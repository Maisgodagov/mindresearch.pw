param(
  [int]$MaxItems = 0,
  [int]$MaxAttemptsPerItem = 2,
  [ValidateRange(1, 12)][int]$ResearchSlots = 12,
  [ValidateRange(1, 50)][int]$DeployBatchSize = 10,
  [switch]$DryRun,
  [switch]$SelectOnly
)

$ErrorActionPreference = 'Stop'
$sourceRepo = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$runnerDir = Join-Path $env:LOCALAPPDATA 'OporaMethodologyRunner'
$null = New-Item -ItemType Directory -Path $runnerDir -Force
$repo = Join-Path $runnerDir 'integration-repo'
$sourceRemote = (& git -C $sourceRepo remote get-url origin).Trim()
if ($LASTEXITCODE -ne 0 -or !$sourceRemote) { throw 'Не удалось определить Git remote исходного репозитория.' }
if (!(Test-Path -LiteralPath (Join-Path $repo '.git'))) {
  if (Test-Path -LiteralPath $repo) { throw "Папка интеграционной копии существует, но это не Git-репозиторий: $repo" }
  & git clone --no-hardlinks $sourceRepo $repo | Out-Null
  if ($LASTEXITCODE -ne 0) { throw 'Не удалось создать локальную интеграционную копию вне OneDrive.' }
  & git -C $repo remote set-url origin $sourceRemote
  if ($LASTEXITCODE -ne 0) { throw 'Не удалось настроить Git remote интеграционной копии.' }
}
& git -C $repo fetch origin main | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Не удалось обновить origin/main интеграционной копии.' }
$branch = (& git -C $repo branch --show-current).Trim()
if ($branch -ne 'main') { throw "Интеграционная копия должна находиться на ветке main, сейчас: $branch" }
& git -C $repo merge-base --is-ancestor origin/main main 2>$null
if ($LASTEXITCODE -eq 1) {
  & git -C $repo merge-base --is-ancestor main origin/main 2>$null
  if ($LASTEXITCODE -eq 0) {
    & git -C $repo merge --ff-only origin/main | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'Не удалось синхронизировать интеграционную копию с origin/main.' }
  } else {
    throw 'Локальная интеграционная ветка и origin/main разошлись; остановка без перезаписи коммитов.'
  }
} elseif ($LASTEXITCODE -ne 0) {
  throw 'Не удалось проверить связь интеграционной ветки с origin/main.'
}
$runnerScriptRelative = 'scripts/run-methodology-backlog.ps1'
$sourceRunnerScript = Join-Path $sourceRepo $runnerScriptRelative
$integrationRunnerScript = Join-Path $repo $runnerScriptRelative
$sourceRunnerHash = (Get-FileHash -LiteralPath $sourceRunnerScript -Algorithm SHA256).Hash
$integrationRunnerHash = if (Test-Path -LiteralPath $integrationRunnerScript) { (Get-FileHash -LiteralPath $integrationRunnerScript -Algorithm SHA256).Hash } else { '' }
if ($sourceRunnerHash -ne $integrationRunnerHash) {
  Copy-Item -LiteralPath $sourceRunnerScript -Destination $integrationRunnerScript -Force
  & git -C $repo add -- $runnerScriptRelative | Out-Null
  if ($LASTEXITCODE -ne 0) { throw 'Не удалось добавить обновлённый runner в интеграционную копию.' }
  & git -C $repo commit -m 'Harden methodology backlog runner' | Out-Null
  if ($LASTEXITCODE -ne 0) { throw 'Не удалось зафиксировать обновлённый runner.' }
}
$queuePath = Join-Path $repo 'docs\methodologies\links\_backlog.md'
$workflowPath = Join-Path $repo 'docs\methodologies\WORKFLOW.md'
$codexCommand = Get-Command codex -ErrorAction Stop
$statePath = Join-Path $runnerDir 'state.json'
$stopPath = Join-Path $runnerDir 'STOP'
$lockPath = Join-Path $runnerDir 'runner.lock'
$logPath = Join-Path $runnerDir 'runner.log'
$terminalStatuses = @('implemented-local', 'done', 'blocked', 'ru-ineligible', 'already-available')
$script:researchWorkers = @{}
$script:nextInstrumentCode = 64
$script:itemCodes = @{}

function Write-State($State) {
  $json = ConvertTo-Json -InputObject $State -Depth 8
  $tempState = "$statePath.$PID.tmp"
  [IO.File]::WriteAllText($tempState, $json, [Text.UTF8Encoding]::new($true))
  Move-Item -LiteralPath $tempState -Destination $statePath -Force
}

function Add-RunLog([string]$Message) {
  $line = "$(Get-Date -Format o) $Message"
  Add-Content -LiteralPath $logPath -Value $line -Encoding UTF8
}

function Get-QueuedItems {
  $items = [Collections.Generic.List[object]]::new()
  $lines = Get-Content -LiteralPath $queuePath -Encoding UTF8
  foreach ($line in $lines) {
    if ($line -match '^\- \[ \] (?<id>\d+)\. (?<body>.+?) — `queued`;') {
      $items.Add([pscustomobject]@{ Id = [int]$Matches.id; Line = $line })
    }
  }
  return $items.ToArray()
}

function Get-ImplementedLocalLines {
  return @(Get-Content -LiteralPath $queuePath -Encoding UTF8 | Where-Object { $_ -match '^\- \[x\] \d+\. .+ — `implemented-local`;' })
}

function Test-PreparedMetadata([string]$ModulePath, [string]$ReviewPath) {
  if (!(Test-Path -LiteralPath $ModulePath) -or !(Test-Path -LiteralPath $ReviewPath)) { throw 'Не найден модуль или review для проверки описания и источников.' }
  $moduleText = Get-Content -LiteralPath $ModulePath -Raw -Encoding UTF8
  $descriptionMatch = [regex]::Match($moduleText, 'description\s*:\s*(["''`])(?<description>(?:\\.|(?!\1).)*)\1', [Text.RegularExpressions.RegexOptions]::Singleline)
  if (!$descriptionMatch.Success) { throw 'В методике отсутствует описание для каталога.' }
  $description = [regex]::Unescape($descriptionMatch.Groups['description'].Value).Trim()
  if ($description.Length -lt 80) { throw 'Описание методики слишком короткое; объясните, что она исследует.' }
  if ($description -match '^(?i)\s*(?:Оцените|Укажите|Отметьте|Выберите|Прочитайте|Ответьте|Поставьте|Вам предлагается|Перед вами|Пожалуйста)\b') { throw 'Описание начинается с инструкции респонденту, а должно объяснять предмет методики.' }
  if ($description -notmatch '(?i)(оценивает|измеряет|исследует|изучает|описывает|формирует|выявляет|предназначен|определяет|отражает|помогает понять)') { throw 'В описании не указано, что именно изучает методика.' }
  $reviewText = Get-Content -LiteralPath $ReviewPath -Raw -Encoding UTF8
  if ($reviewText -notmatch 'https?://[^\s)]+') { throw 'В review не указаны ссылки на источники методики.' }
  if ($reviewText -notmatch '\[[^\]]{8,}\]\(https?://[^)]+\)') { throw 'Добавьте кликабельную ссылку на источник с понятным библиографическим названием, а не голый URL.' }
  return $true
}

function Stop-ReadAheadResearch {
  foreach ($worker in @($script:researchWorkers.Values)) {
    if (!$worker.Completed -and !$worker.Process.HasExited) {
      try { $worker.Process.Kill() } catch { }
      try { $worker.Process.WaitForExit() } catch { }
      Add-RunLog "RESEARCH_STOPPED id=$($worker.Id) slot=$($worker.Slot)"
    }
    try { $worker.Process.Dispose() } catch { }
  }
  $script:researchWorkers = @{}
}

function Start-ReadAheadResearch($Item, [int]$Slot = 1) {
  if (!$Item) { return }

  $itemDir = Join-Path $runnerDir (Join-Path 'research' ('{0:D4}' -f $Item.Id))
  $null = New-Item -ItemType Directory -Path $itemDir -Force
  $reportPath = Join-Path $itemDir 'prepared-result.json'
  if (Test-Path -LiteralPath $reportPath) {
    try {
      $cached = Get-Content -LiteralPath $reportPath -Raw -Encoding UTF8 | ConvertFrom-Json
      $cachedOk = (($cached.status -in @('blocked','ru-ineligible','already-available')) -and (Test-Path (Join-Path $itemDir 'review.md'))) -or ($cached.status -eq 'prepared' -and (Test-PreparedMetadata (Join-Path $itemDir 'module.ts') (Join-Path $itemDir 'review.md')))
      if ($cachedOk) { Add-RunLog "PREPARED_CACHE_HIT id=$($Item.Id)"; return }
    } catch { }
    Remove-Item -LiteralPath $reportPath -Force -ErrorAction SilentlyContinue
  }

  $worktree = Join-Path $runnerDir ("integration-research-worktree-{0}" -f $Slot)
  $baseSha = Get-CurrentCommit
  if (Test-Path -LiteralPath $worktree) {
    & git -C $worktree rev-parse --is-inside-work-tree 2>$null | Out-Null
    if ($LASTEXITCODE -ne 0) {
      & git -C $repo worktree prune | Out-Null
      & git -C $repo worktree add --detach $worktree $baseSha | Out-Null
    } else {
      & git -C $worktree reset --hard $baseSha | Out-Null
    }
    if ($LASTEXITCODE -ne 0) { throw "Не удалось обновить исследовательское worktree слота $Slot." }
  } else {
    & git -C $repo worktree add --detach $worktree $baseSha | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'Не удалось создать исследовательскую рабочую копию.' }
  }

  $stdoutPath = Join-Path $itemDir 'stdout.jsonl'
  $stderrPath = Join-Path $itemDir 'stderr.log'
  if ($script:itemCodes.ContainsKey($Item.Id)) { $code = $script:itemCodes[$Item.Id] }
  else { $code = "test_$script:nextInstrumentCode"; $script:itemCodes[$Item.Id] = $code; $script:nextInstrumentCode++ }
  $researchPrompt = @'
Ты — независимый слот пакетного импорта методик. Прочитай docs/methodologies/WORKFLOW.md. Обработай только переданный пункт: достаточно проверить наличие адекватного русского текста и надёжного точного ключа/подсчёта. Пропусти остальные проверки. Используй прямые источники и не угадывай.

Если оба критерия соблюдены, создай полноценную регистрацию в `apps/api/src/data/methodologies/method-__ID__.ts`, экспортируя `methodology` с `instrument`, `scoringConfig`, `validationCases` (хотя бы один вручную проверенный случай) и `formulaVersion`. Используй выданный код `__CODE__`. Включи полный доступный русский текст всех пунктов, варианты ответов без нумерационных цифр, ключи и реверсивные пункты. Алгоритм должен точно соответствовать источнику. Поле `instrument.description` обязательно: это краткое содержательное описание для автора опроса — что именно измеряет методика, какие аспекты охватывает и для какой группы/версии подходит. Не подменяй его инструкцией «оцените/выберите/ответьте»; подробности прохождения оставляй в формулировках вопросов. В review обязательно приводи библиографические источники с кликабельными ссылками на первоисточник/публикацию и страницу русской версии или бланка, если доступны. Не ограничивайся URL без названия источника. Если русский текст или ключ отсутствует, модуль не создавай.

Создай короткую записку в `docs/methodologies/reviews/method-__ID__.md` с решением, библиографическими источниками и ссылками, количеством пунктов, шкалами и формулой. Не оставляй источники просто списком URL: у каждой ссылки должно быть понятное название работы, страницы, бланка или публикации. Проверь, что `instrument.description` объясняет, что методика измеряет и чем может быть полезна автору опроса; описание не должно быть инструкцией участнику. Не редактируй `seed.ts`, реестр, backlog или любые общие файлы; не коммить и не отправляй изменения. Не запускай тесты/build. Не трогай ничего кроме двух разрешённых уникальных файлов. В конце верни строго одну JSON-строку: {"status":"prepared"|"blocked"|"ru-ineligible"|"already-available","reason":"...","instrumentCode":"__CODE__","moduleFile":"apps/api/src/data/methodologies/method-__ID__.ts","reviewFile":"docs/methodologies/reviews/method-__ID__.md"}. Для prepared оба файла должны существовать.

Пункт очереди:
__QUEUE_ITEM__
'@
  $researchPrompt = $researchPrompt.Replace('__ID__', ('{0:D4}' -f $Item.Id)).Replace('__CODE__', $code)
  $researchPrompt = $researchPrompt.Replace('__QUEUE_ITEM__', $Item.Line)
  $psi = [Diagnostics.ProcessStartInfo]::new()
  $psi.FileName = $codexCommand.Source
  $psi.WorkingDirectory = $worktree
  $psi.UseShellExecute = $false
  $psi.CreateNoWindow = $true
  $psi.RedirectStandardInput = $true
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true
  $psi.StandardOutputEncoding = [Text.UTF8Encoding]::new($false)
  $psi.StandardErrorEncoding = [Text.UTF8Encoding]::new($false)
  $psi.Arguments = "exec --json --approve-for-me -c model_reasoning_effort=low -C `"$worktree`" --output-last-message `"$reportPath`" -"
  $proc = [Diagnostics.Process]::new()
  $proc.StartInfo = $psi
  if (!$proc.Start()) { throw 'Не удалось запустить параллельного исследователя.' }
  $stdoutTask = $proc.StandardOutput.ReadToEndAsync()
  $stderrTask = $proc.StandardError.ReadToEndAsync()
  $promptBytes = [Text.UTF8Encoding]::new($false).GetBytes($researchPrompt)
  $proc.StandardInput.BaseStream.Write($promptBytes, 0, $promptBytes.Length)
  $proc.StandardInput.BaseStream.Flush()
  $proc.StandardInput.Close()
  $worker = [pscustomobject]@{
    Id = $Item.Id; Title = (($Item.Line -split ' — `queued`;', 2)[0] -replace '^\- \[ \] \d+\. ', '').Trim()
    Code = $code
    Slot = $Slot
    Process = $proc; StdoutTask = $stdoutTask; StderrTask = $stderrTask
    ReportPath = $reportPath; StdoutPath = $stdoutPath; StderrPath = $stderrPath; Worktree = $worktree; ItemDir = $itemDir
    Started = Get-Date; Completed = $false; ExitCode = $null
  }
  $script:researchWorkers[$Item.Id] = $worker
  $state.researchItem = "$($Item.Id). $($worker.Title)"
  $state.researchStatus = 'running'
  $state.researchWorkers = @($script:researchWorkers.Values | ForEach-Object { "$($_.Id). $($_.Title) [slot $($_.Slot)] running" })
  $state.updatedAt = (Get-Date).ToString('o')
  Write-State $state
  Add-RunLog "RESEARCH_START id=$($Item.Id) slot=$Slot worktree=$worktree base=$baseSha"
}

function Complete-ReadAheadResearch {
  foreach ($worker in @($script:researchWorkers.Values)) {
    if ($worker.Completed) { continue }
    if (!$worker.Process.HasExited) {
      if (((Get-Date) - $worker.Started).TotalMinutes -gt 30) {
        try { $worker.Process.Kill() } catch { }
        try { $worker.Process.WaitForExit() } catch { }
        $worker.Completed = $true
        $worker.ExitCode = -1
        Add-RunLog "RESEARCH_TIMEOUT id=$($worker.Id) slot=$($worker.Slot)"
      }
      continue
    }
    $stdout = $worker.StdoutTask.GetAwaiter().GetResult()
    $stderr = $worker.StderrTask.GetAwaiter().GetResult()
    Set-Content -LiteralPath $worker.StdoutPath -Value $stdout -Encoding UTF8
    Set-Content -LiteralPath $worker.StderrPath -Value $stderr -Encoding UTF8
    $worker.Completed = $true
    $worker.ExitCode = $worker.Process.ExitCode
    if ($worker.ExitCode -eq 0 -and (Test-Path -LiteralPath $worker.ReportPath)) {
      try {
        $result = Get-Content -LiteralPath $worker.ReportPath -Raw -Encoding UTF8 | ConvertFrom-Json
        $safeId = '{0:D4}' -f $worker.Id
        $expectedModule = "apps/api/src/data/methodologies/method-$safeId.ts"
        $expectedReview = "docs/methodologies/reviews/method-$safeId.md"
        if ($result.reviewFile -ne $expectedReview) { throw 'Worker returned an unexpected review path.' }
        if ($result.status -eq 'prepared') {
          if ($result.moduleFile -ne $expectedModule) { throw 'Worker returned an unexpected module path.' }
          $moduleSource = Join-Path $worker.Worktree $result.moduleFile
          $reviewSource = Join-Path $worker.Worktree $result.reviewFile
          if (!(Test-Path -LiteralPath $moduleSource) -or !(Test-Path -LiteralPath $reviewSource)) { throw 'Worker reported prepared but did not create both output files.' }
          $moduleText = Get-Content -LiteralPath $moduleSource -Raw -Encoding UTF8
          if (!$result.instrumentCode -or $moduleText -notmatch [regex]::Escape([string]$result.instrumentCode)) { throw 'Worker module does not contain its reported instrument code.' }
          Test-PreparedMetadata $moduleSource $reviewSource | Out-Null
          Copy-Item -LiteralPath $moduleSource -Destination (Join-Path $worker.ItemDir 'module.ts') -Force
          Copy-Item -LiteralPath $reviewSource -Destination (Join-Path $worker.ItemDir 'review.md') -Force
        } elseif ($result.status -in @('blocked','ru-ineligible','already-available')) {
          $reviewSource = Join-Path $worker.Worktree $result.reviewFile
          if (Test-Path -LiteralPath $reviewSource) {
            Copy-Item -LiteralPath $reviewSource -Destination (Join-Path $worker.ItemDir 'review.md') -Force
          } else {
            $queueLine = Get-Content -LiteralPath $queuePath -Encoding UTF8 | Where-Object { $_ -match "^\- \[ \] $($worker.Id)\. " } | Select-Object -First 1
            $reason = ([string]$result.reason -replace '[\r\n]+', ' ').Trim()
            if ($reason -match 'Р[\sЎ]С|РЎС') { $reason = [Text.Encoding]::UTF8.GetString([Text.Encoding]::GetEncoding(1251).GetBytes($reason)) }
            if ($reason.Length -gt 2000) { $reason = $reason.Substring(0, 2000) }
            $sourceUrls = @([regex]::Matches([string]$queueLine, 'https?://[^\s)]+') | ForEach-Object Value | Select-Object -Unique)
            $fallbackReview = @(
              "# $($worker.Id). $($worker.Title)",
              '',
              "Решение worker: ``$($result.status)``.",
              "Основание: $reason",
              '',
              'Пункт очереди:',
              [string]$queueLine,
              '',
              'Ссылки из пункта очереди:',
              ($sourceUrls -join "`n")
            ) -join "`n"
            [IO.File]::WriteAllText((Join-Path $worker.ItemDir 'review.md'), $fallbackReview + "`n", [Text.UTF8Encoding]::new($false))
            Add-RunLog "REVIEW_FALLBACK_CREATED id=$($worker.Id) status=$($result.status)"
          }
        } else { throw 'Worker result JSON has an unsupported status.' }
      } catch {
        $worker.ExitCode = 2
        Add-RunLog "PREPARED_RESULT_INVALID id=$($worker.Id) error=$($_.Exception.Message)"
      }
    }
    Add-RunLog "RESEARCH_DONE id=$($worker.Id) slot=$($worker.Slot) exit=$($worker.ExitCode)"
  }
  $ready = @($script:researchWorkers.Values | Where-Object { $_.ExitCode -eq 0 -and (Test-Path -LiteralPath $_.ReportPath) }).Count
  $state.researchStatus = if ($ready) { 'ready' } elseif (@($script:researchWorkers.Values | Where-Object Completed).Count -eq $script:researchWorkers.Count) { 'failed' } else { 'running' }
  $state.researchWorkers = @($script:researchWorkers.Values | ForEach-Object { $workerStatus = if (!$_.Completed) { 'running' } elseif ($_.ExitCode -eq 0) { 'ready' } else { 'failed' }; "$($_.Id). $($_.Title) [slot $($_.Slot)] $workerStatus" })
  $state.updatedAt = (Get-Date).ToString('o')
  Write-State $state
}

function Wait-ReadAheadResearch([int]$ItemId) {
  $worker = $script:researchWorkers[$ItemId]
  if (!$worker) {
    $itemDir = Join-Path $runnerDir (Join-Path 'research' ('{0:D4}' -f $ItemId))
    $cachedReport = Join-Path $itemDir 'prepared-result.json'
    if (Test-Path -LiteralPath $cachedReport) {
      $report = Get-Content -LiteralPath $cachedReport -Raw -Encoding UTF8
      try { $cached = $report | ConvertFrom-Json; $cacheValid = (($cached.status -in @('blocked','ru-ineligible','already-available')) -and (Test-Path (Join-Path $itemDir 'review.md'))) -or ($cached.status -eq 'prepared' -and (Test-PreparedMetadata (Join-Path $itemDir 'module.ts') (Join-Path $itemDir 'review.md'))) } catch { $cacheValid = $false }
      if ($cacheValid) {
        $line = Get-Content -LiteralPath $queuePath -Encoding UTF8 | Where-Object { $_ -match "^\- \[ \] $ItemId\. " } | Select-Object -First 1
        $title = if ($line) { (($line -split ' — `queued`;', 2)[0] -replace '^\- \[ \] \d+\. ', '').Trim() } else { '' }
        $state.researchItem = "$ItemId. $title"
        $state.researchStatus = 'ready'
        $state.updatedAt = (Get-Date).ToString('o')
        Write-State $state
        Add-RunLog "RESEARCH_CACHE_HIT id=$ItemId"
        return $report
      }
    }
    return ''
  }
  while (!$worker.Completed -and !$worker.Process.HasExited) {
    if (Test-Path -LiteralPath $stopPath) { return '' }
    Complete-ReadAheadResearch
    if (!$worker -or $worker.Completed) { break }
    $state.updatedAt = (Get-Date).ToString('o')
    $state.message = "Ожидаю подготовку методики $ItemId в слоте $($worker.Slot); остальные слоты работают параллельно."
    Write-State $state
    Start-Sleep -Seconds 3
  }
  Complete-ReadAheadResearch
  if ($worker -and $worker.ExitCode -eq 0 -and (Test-Path -LiteralPath $worker.ReportPath)) {
    return Get-Content -LiteralPath $worker.ReportPath -Raw -Encoding UTF8
  }
  return ''
}

function Integrate-PreparedMethod([int]$ItemId, [string]$QueueLine, [string]$ResultJson) {
  $result = $ResultJson | ConvertFrom-Json
  if ($result.instrumentCode) { $script:itemCodes[$ItemId] = [string]$result.instrumentCode }
  $itemDir = Join-Path $runnerDir (Join-Path 'research' ('{0:D4}' -f $ItemId))
  $moduleName = 'method-{0:D4}.ts' -f $ItemId
  $reviewName = 'method-{0:D4}.md' -f $ItemId
  $reviewSource = Join-Path $itemDir 'review.md'
  if (!(Test-Path -LiteralPath $reviewSource)) { throw "Worker $ItemId did not preserve its source review." }
  $reviewTarget = Join-Path $repo (Join-Path 'docs\methodologies\reviews' $reviewName)
  $null = New-Item -ItemType Directory -Path (Split-Path -Parent $reviewTarget) -Force
  Copy-Item -LiteralPath $reviewSource -Destination $reviewTarget -Force

  $status = [string]$result.status
  if ($status -eq 'prepared') {
    $moduleSource = Join-Path $itemDir 'module.ts'
    if (!(Test-Path -LiteralPath $moduleSource)) { throw "Worker $ItemId reported prepared without a methodology module." }
    $expectedCode = [string]$result.instrumentCode
    if (!$expectedCode -and $moduleText -match "(?<code>test_\d+)") { $expectedCode = $Matches.code }
    $moduleText = Get-Content -LiteralPath $moduleSource -Raw -Encoding UTF8
    if (!$expectedCode -or $moduleText -notmatch [regex]::Escape($expectedCode)) { throw "Worker $ItemId produced a module without its reserved instrument code." }
    Test-PreparedMetadata $moduleSource $reviewSource | Out-Null
    $moduleTarget = Join-Path $repo (Join-Path 'apps\api\src\data\methodologies' $moduleName)
    $null = New-Item -ItemType Directory -Path (Split-Path -Parent $moduleTarget) -Force
    Copy-Item -LiteralPath $moduleSource -Destination $moduleTarget -Force
    $queueStatus = 'implemented-local'
  } else {
    if ($status -notin @('blocked','ru-ineligible','already-available')) { throw "Unsupported terminal methodology result: $status" }
    $queueStatus = $status
  }

  $currentLines = Get-Content -LiteralPath $queuePath -Encoding UTF8
  $current = $currentLines | Where-Object { $_ -match "^\- \[ \] $ItemId\. " } | Select-Object -First 1
  if (!$current) { throw "Queue item $ItemId is no longer queued." }
  $reviewLink = "[review](../reviews/$reviewName)"
  $updated = $current -replace '^\- \[ \]', '- [x]'
  $updated = [regex]::Replace($updated, '— `queued`;', "— ``$queueStatus``;")
  if ($updated -notmatch '\[review\]\(') { $updated += " $reviewLink;" }
  $content = [IO.File]::ReadAllText($queuePath, [Text.UTF8Encoding]::new($true))
  $content = $content.Replace($current, $updated)
  [IO.File]::WriteAllText($queuePath, $content, [Text.UTF8Encoding]::new($true))

  $paths = @("docs/methodologies/reviews/$reviewName", 'docs/methodologies/links/_backlog.md')
  if ($status -eq 'prepared') { $paths += "apps/api/src/data/methodologies/$moduleName" }
  & git -C $repo add -- $paths | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "Не удалось добавить файлы методики $ItemId в локальный commit." }
  & git -C $repo commit -m "Add methodology backlog item $ItemId ($queueStatus)" | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "Не удалось создать локальный commit методики $ItemId." }
  Add-RunLog "METHOD_INTEGRATED id=$ItemId status=$queueStatus code=$($script:itemCodes[$ItemId])"
  try { Remove-Item -LiteralPath $itemDir -Recurse -Force -ErrorAction Stop }
  catch { Add-RunLog "CACHE_CLEANUP_ERROR id=$ItemId error=$($_.Exception.Message)" }
  return @{ status = $queueStatus; line = $updated; reason = $result.reason }
}

function Get-CurrentCommit {
  $sha = (& git -C $repo rev-parse HEAD).Trim()
  if ($LASTEXITCODE -ne 0 -or !$sha) { throw 'Не удалось определить текущий git commit.' }
  return $sha
}

function Test-PreDeploymentBuild([string]$Sha) {
  Add-RunLog "PRE_DEPLOY_BUILD_START sha=$Sha"
  $previousLocation = Get-Location
  $output = @()
  $exitCode = 1
  try {
    Set-Location -LiteralPath $repo
    $output = @(& npm run build 2>&1)
    $exitCode = $LASTEXITCODE
  } catch {
    $output += $_.Exception.Message
  } finally {
    Set-Location -LiteralPath $previousLocation.Path
  }
  if ($exitCode -eq 0) {
    Add-RunLog "PRE_DEPLOY_BUILD_OK sha=$Sha"
    return @{ passed = $true; reason = ''; log = '' }
  }
  $buildLogPath = Join-Path $runnerDir "build-validation-$($Sha.Substring(0, 7)).log"
  [IO.File]::WriteAllLines($buildLogPath, [string[]]@($output | ForEach-Object { [string]$_ }), [Text.UTF8Encoding]::new($false))
  $diagnostics = @($output | Where-Object { [string]$_ -match 'error TS\d+|npm error|Error:' } | Select-Object -First 8 | ForEach-Object { ([string]$_).Trim() })
  $detail = if ($diagnostics.Count) { $diagnostics -join ' | ' } else { "см. журнал $buildLogPath" }
  Add-RunLog "PRE_DEPLOY_BUILD_FAILED sha=$Sha exit=$exitCode log=$buildLogPath details=$detail"
  return @{ passed = $false; reason = "Локальная production-сборка не прошла (exit $exitCode): $detail"; log = $buildLogPath }
}

function Start-DeploymentRetry([int]$ItemId) {
  $markerPath = Join-Path $repo 'deployment-retry.txt'
  $marker = "Retry accumulated methodologies after queue item $ItemId at $((Get-Date).ToString('o'))"
  [IO.File]::WriteAllText($markerPath, $marker + "`n", [Text.UTF8Encoding]::new($false))
  & git -C $repo add -- deployment-retry.txt | Out-Null
  if ($LASTEXITCODE -ne 0) { throw 'Не удалось подготовить marker для повторного deploy.' }
  & git -C $repo commit -m "Retry deployment after methodology $ItemId" | Out-Null
  if ($LASTEXITCODE -ne 0) { throw 'Не удалось создать commit для повторного deploy.' }
  & git -C $repo push origin main | Out-Null
  if ($LASTEXITCODE -ne 0) { throw 'Не удалось отправить повторный deploy в main.' }
  return Get-CurrentCommit
}

function Get-GitHubApiHeaders {
  $headers = @{ 'User-Agent' = 'OporaMethodologyRunner' }
  $savedPrompt = $env:GIT_TERMINAL_PROMPT
  $savedInteractive = $env:GCM_INTERACTIVE
  try {
    $env:GIT_TERMINAL_PROMPT = '0'
    $env:GCM_INTERACTIVE = 'Never'
    $credentialInput = "protocol=https`nhost=github.com`n`n"
    $credentialLines = @($credentialInput | & git -C $repo credential fill 2>$null)
    $passwordLine = $credentialLines | Where-Object { $_ -match '^password=' } | Select-Object -First 1
    if ($passwordLine) {
      $apiToken = $passwordLine.Substring('password='.Length)
      if ($apiToken) { $headers.Authorization = "Bearer $apiToken" }
    }
  } catch {
    Add-RunLog "DEPLOY_API_CREDENTIAL_UNAVAILABLE error=$($_.Exception.Message)"
  } finally {
    $env:GIT_TERMINAL_PROMPT = $savedPrompt
    $env:GCM_INTERACTIVE = $savedInteractive
  }
  return $headers
}

function Wait-Deployment([string]$Sha) {
  $headers = Get-GitHubApiHeaders
  $apiRoot = 'https://api.github.com/repos/Maisgodagov/mindresearch.pw/actions'
  $run = $null
  $deadline = (Get-Date).AddMinutes(3)
  while ((Get-Date) -lt $deadline) {
    try {
      if ($run) {
        $run = Invoke-RestMethod -Uri $run.url -Headers $headers -TimeoutSec 10
      } else {
        $response = Invoke-RestMethod -Uri "$apiRoot/workflows/deploy.yml/runs?head_sha=$Sha&per_page=1" -Headers $headers -TimeoutSec 10
        $run = $response.workflow_runs | Select-Object -First 1
      }
    } catch {
      Add-RunLog "DEPLOY_STATUS_QUERY_ERROR sha=$Sha error=$($_.Exception.Message)"
      Start-Sleep -Seconds 10
      continue
    }
    if (!$run) {
      Add-RunLog "DEPLOY_RUN_NOT_VISIBLE sha=$Sha"
      Start-Sleep -Seconds 10
      continue
    }
    if ($run.status -eq 'completed') {
      if ($run.conclusion -eq 'success') {
        try {
          $health = Invoke-RestMethod -Uri 'https://mindresearch.pw/api/health' -TimeoutSec 10
          if ($health.ok -eq $true) { return @{ status = 'success'; url = $run.html_url; sha = $Sha } }
          return @{ status = 'deferred'; reason = 'Health API не подтвердил ok=true'; url = $run.html_url; sha = $Sha }
        } catch {
          return @{ status = 'deferred'; reason = "Health API недоступен: $($_.Exception.Message)"; url = $run.html_url; sha = $Sha }
        }
      }
      try {
        $jobs = Invoke-RestMethod -Uri "$apiRoot/runs/$($run.id)/jobs?per_page=100" -Headers $headers -TimeoutSec 10
        $failedChecks = @($jobs.jobs | ForEach-Object { $_.steps | Where-Object { $_.conclusion -eq 'failure' -and $_.name -eq 'Run npm run build' } })
        if ($failedChecks.Count) { return @{ status = 'validation-failed'; reason = ($failedChecks.name -join ', '); url = $run.html_url; sha = $Sha } }
      } catch { Add-RunLog "DEPLOY_JOB_QUERY_ERROR sha=$Sha error=$($_.Exception.Message)" }
      return @{ status = 'deferred'; reason = "Workflow завершился: $($run.conclusion)"; url = $run.html_url; sha = $Sha }
    }
    $state.updatedAt = (Get-Date).ToString('o')
    $state.message = "Ожидается deploy batch $Sha; последний статус: $($run.status)."
    $state.pendingDeployCount = @(Get-ImplementedLocalLines).Count
    Write-State $state
    Start-Sleep -Seconds 10
  }
  return @{ status = 'deferred'; reason = 'Истёк короткий лимит ожидания workflow (3 минуты).'; url = if ($run) { $run.html_url } else { '' }; sha = $Sha }
}

function Mark-ImplementedLocalAsDone([string]$Sha) {
  $content = [IO.File]::ReadAllText($queuePath, [Text.UTF8Encoding]::new($true))
  $shortSha = $Sha.Substring(0, 7)
  $content = [regex]::Replace($content, '(?m)^(\- \[x\] \d+\. .+ — )`implemented-local`;', "`$1``done`` (release $shortSha);")
  [IO.File]::WriteAllText($queuePath, $content, [Text.UTF8Encoding]::new($true))
}

function Invoke-PendingDeployment([int]$AfterItemId) {
  $pending = @(Get-ImplementedLocalLines)
  if (!$pending.Count) { return @{ status = 'none'; count = 0 } }
  $candidateSha = Get-CurrentCommit
  $build = Test-PreDeploymentBuild $candidateSha
  if (!$build.passed) { return @{ status = 'validation-failed'; count = $pending.Count; sha = $candidateSha; reason = $build.reason; url = '' } }
  $sha = Start-DeploymentRetry $AfterItemId
  Add-RunLog "DEPLOY_START id=$AfterItemId sha=$sha pending=$($pending.Count) threshold=$DeployBatchSize"
  $deploy = Wait-Deployment $sha
  if ($deploy.status -eq 'success') {
    Mark-ImplementedLocalAsDone $sha
    & git -C $repo add -- docs/methodologies/links/_backlog.md | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'Не удалось подготовить статусы подтверждённых методик.' }
    & git -C $repo commit -m 'Mark methodology batch deployed' | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'Не удалось зафиксировать статусы подтверждённых методик.' }
    & git -C $repo push origin main | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'Не удалось сохранить статусы подтверждённых методик в main.' }
    Add-RunLog "DEPLOY_CONFIRMED id=$AfterItemId sha=$sha count=$($pending.Count) url=$($deploy.url)"
    return @{ status = 'success'; count = $pending.Count; sha = $sha; url = $deploy.url }
  }
  if ($deploy.status -eq 'validation-failed') { return @{ status = 'validation-failed'; count = $pending.Count; sha = $sha; reason = $deploy.reason; url = $deploy.url } }
  Add-RunLog "DEPLOY_DEFERRED id=$AfterItemId sha=$sha pending=$($pending.Count) reason=$($deploy.reason)"
  return @{ status = 'deferred'; count = $pending.Count; sha = $sha; reason = $deploy.reason; url = $deploy.url }
}

function Set-FinalState($State, [string]$Status, [string]$Reason) {
  $State.status = $Status
  $State.activeItem = $null
  $State.researchItem = $null
  $State.researchWorkers = @()
  if ($State.researchStatus -eq 'running') { $State.researchStatus = 'stopped' }
  $State.message = $Reason
  $State.updatedAt = (Get-Date).ToString('o')
  Write-State $State
  Add-RunLog "$Status $Reason"
}

if (!(Test-Path -LiteralPath $queuePath)) { throw "Queue file not found: $queuePath" }

$queue = @(Get-QueuedItems)
if (!$queue.Count -and !(Get-ImplementedLocalLines).Count) {
  Write-Output 'Очередь пуста: записей со статусом queued нет.'
  exit 0
}
if ($DryRun) {
  if ($queue.Count) { Write-Output "Следующий пункт: $($queue[0].Line)" }
  else { Write-Output 'Очередь пуста; есть накопленная пачка, ожидающая deploy.' }
  Write-Output "Осталось записей в статусе queued: $($queue.Count)"
  exit 0
}

$maxCode = 0
$dataFiles = @(Get-ChildItem -LiteralPath (Join-Path $repo 'apps\api\src\data') -File -Filter '*.ts' -Recurse -ErrorAction SilentlyContinue)
$seedFile = Get-Item -LiteralPath (Join-Path $repo 'apps\api\src\seed.ts') -ErrorAction SilentlyContinue
if ($seedFile) { $dataFiles += $seedFile }
foreach ($sourceFile in $dataFiles) {
  foreach ($match in (Select-String -LiteralPath $sourceFile.FullName -Pattern 'test_(\d+)' -AllMatches).Matches) {
    $maxCode = [Math]::Max($maxCode, [int]$match.Groups[1].Value)
  }
}
$cacheRoot = Join-Path $runnerDir 'research'
if (Test-Path -LiteralPath $cacheRoot) {
  foreach ($cachedModule in (Get-ChildItem -LiteralPath $cacheRoot -Recurse -File -Filter 'module.ts')) {
    foreach ($match in (Select-String -LiteralPath $cachedModule.FullName -Pattern 'test_(\d+)' -AllMatches).Matches) {
      $maxCode = [Math]::Max($maxCode, [int]$match.Groups[1].Value)
    }
  }
}
$script:nextInstrumentCode = $maxCode + 1

$lockStream = $null
try {
  $lockStream = [IO.File]::Open($lockPath, [IO.FileMode]::OpenOrCreate, [IO.FileAccess]::ReadWrite, [IO.FileShare]::None)
} catch {
  Write-Output 'Runner уже запущен; второй экземпляр завершён.'
  exit 2
}

$runId = [guid]::NewGuid().ToString()
$state = [ordered]@{
  runId = $runId
  status = 'running'
  pid = $PID
  queuePath = $queuePath
  startedAt = (Get-Date).ToString('o')
  updatedAt = (Get-Date).ToString('o')
  activeItem = $null
  currentAttempt = 0
  processedThisRun = 0
  remaining = $queue.Count
  pendingDeployCount = @(Get-ImplementedLocalLines).Count
  lastDeployStatus = 'none'
  researchItem = $null
  researchStatus = 'idle'
  researchSlots = $ResearchSlots
  deployBatchSize = $DeployBatchSize
  researchWorkers = @()
  message = "До $ResearchSlots независимых слотов готовят методики параллельно; результат интегрируется последовательно."
}
Remove-Item -LiteralPath $stopPath -Force -ErrorAction SilentlyContinue
Write-State $state
Add-RunLog "START run=$runId remaining=$($queue.Count)"
$script:deferredUntil = @{}
$initialPendingCount = @(Get-ImplementedLocalLines).Count
$script:lastAttemptPendingCount = if ($initialPendingCount -ge $DeployBatchSize) { $initialPendingCount - $DeployBatchSize } else { 0 }

try {
  while ($true) {
    if (Test-Path -LiteralPath $stopPath) {
      Set-FinalState $state 'stopped' 'Получен запрос на остановку; очередь сохранена.'
      break
    }

    $pendingAtLoopStart = @(Get-ImplementedLocalLines).Count
    if ((Get-QueuedItems).Count -gt 0 -and $pendingAtLoopStart -ge $DeployBatchSize -and ($pendingAtLoopStart - $script:lastAttemptPendingCount) -ge $DeployBatchSize) {
      $batchRetry = Invoke-PendingDeployment 0
      $state.lastDeployStatus = $batchRetry.status
      $state.pendingDeployCount = @(Get-ImplementedLocalLines).Count
      $script:lastAttemptPendingCount = if ($batchRetry.status -eq 'success') { 0 } else { $pendingAtLoopStart }
      if ($batchRetry.status -eq 'validation-failed') {
        Set-FinalState $state 'paused' "Проверка production-сборки остановила публикацию $($batchRetry.sha): $($batchRetry.reason). $($batchRetry.url)"
        break
      }
    }

    Add-RunLog 'LOOP_READ_START'
    $allQueue = @(Get-QueuedItems)
    Add-RunLog "LOOP_READ_DONE count=$($allQueue.Count)"
    if (!$allQueue.Count) {
      $pendingAtEnd = @(Get-ImplementedLocalLines)
      if ($pendingAtEnd.Count) {
        $finalDeploy = Invoke-PendingDeployment 0
        $state.lastDeployStatus = $finalDeploy.status
        $state.pendingDeployCount = @(Get-ImplementedLocalLines).Count
        $state.updatedAt = (Get-Date).ToString('o')
        if ($finalDeploy.status -eq 'validation-failed') {
          Set-FinalState $state 'paused' "Проверка production-сборки остановила финальную публикацию $($finalDeploy.sha): $($finalDeploy.reason). $($finalDeploy.url)"
          break
        }
        if ($finalDeploy.status -eq 'deferred') {
          $state.message = "Очередь обработана; финальный пакет из $($finalDeploy.count) методик ожидает повторного deploy: $($finalDeploy.reason)"
          Write-State $state
          Start-Sleep -Seconds 900
          continue
        }
      }
      Set-FinalState $state 'complete' 'Записей со статусом queued больше нет.'
      Unregister-ScheduledTask -TaskName 'Opora-Methodology-Backlog-Resume' -Confirm:$false -ErrorAction SilentlyContinue
      break
    }
    $now = Get-Date
    $eligible = @($allQueue | Where-Object { !$script:deferredUntil.ContainsKey($_.Id) -or $script:deferredUntil[$_.Id] -le $now })
    if (!$eligible.Count) {
      $nextRetry = @($script:deferredUntil.Values | Sort-Object | Select-Object -First 1)[0]
      $waitSeconds = [Math]::Max(1, [Math]::Min(60, [int][Math]::Ceiling(($nextRetry - $now).TotalSeconds)))
      $state.activeItem = $null
      $state.remaining = $allQueue.Count
      $state.updatedAt = (Get-Date).ToString('o')
      $state.message = "Все оставшиеся пункты временно отложены после ошибок; следующая попытка через $waitSeconds сек."
      Write-State $state
      Start-Sleep -Seconds $waitSeconds
      continue
    }
    $item = $eligible[0]
    $queue = @($item) + @($allQueue | Where-Object { $_.Id -ne $item.Id })
    $itemId = $item.Id
    Add-RunLog "ITEM_SELECTED id=$itemId lineType=$($item.Line.GetType().FullName) lineLength=$($item.Line.Length)"
    $itemTitle = (($item.Line -split ' — `queued`;', 2)[0] -replace '^\- \[ \] \d+\. ', '').Trim()
    $state.activeItem = "$itemId. $itemTitle"
    Add-RunLog 'ACTIVE_ITEM_SET'
    $state.remaining = $queue.Count
    $state.currentAttempt = 0
    $state.updatedAt = (Get-Date).ToString('o')
  $state.message = "До $ResearchSlots методик готовятся параллельно в отдельных worktree; результаты вносятся последовательно."
    Add-RunLog 'ACTIVE_STATE_WRITE_START'
    Write-State $state
    Add-RunLog 'ACTIVE_STATE_WRITE_DONE'
    Add-RunLog "ITEM_START id=$itemId remaining=$($queue.Count)"
    if ($SelectOnly) {
      Set-FinalState $state 'checkpoint' "SelectOnly: selected queue item $itemId without starting Codex."
      break
    }

    # Fill isolated implementation slots before waiting for the head item.
    if (!(Test-Path -LiteralPath $stopPath)) {
      $usedSlots = @($script:researchWorkers.Values | Where-Object { !$_.Completed -and !$_.Process.HasExited } | ForEach-Object Slot)
      $slotLimit = [Math]::Min($ResearchSlots, $queue.Count)
      for ($offset = 0; $offset -lt $slotLimit; $offset++) {
        $candidate = $queue[$offset]
        if ($script:researchWorkers.ContainsKey($candidate.Id)) { continue }
        $cachedPath = Join-Path (Join-Path $runnerDir (Join-Path 'research' ('{0:D4}' -f $candidate.Id))) 'prepared-result.json'
        if (Test-Path -LiteralPath $cachedPath) {
          try {
            $cached = Get-Content -LiteralPath $cachedPath -Raw -Encoding UTF8 | ConvertFrom-Json
            $cachedDir = Split-Path $cachedPath
            $cacheGood = (($cached.status -in @('blocked','ru-ineligible','already-available')) -and (Test-Path (Join-Path $cachedDir 'review.md'))) -or ($cached.status -eq 'prepared' -and (Test-PreparedMetadata (Join-Path $cachedDir 'module.ts') (Join-Path $cachedDir 'review.md')))
            if ($cacheGood) { continue }
          } catch { }
        }
        $freeSlot = 1
        while ($usedSlots -contains $freeSlot -and $freeSlot -le $ResearchSlots) { $freeSlot++ }
        if ($freeSlot -gt $ResearchSlots) { break }
        try { Start-ReadAheadResearch $candidate $freeSlot; $usedSlots += $freeSlot }
        catch { Add-RunLog "WORKER_START_ERROR id=$($candidate.Id) slot=$freeSlot error=$($_.Exception.Message)" }
      }
    }

    $result = $null
    $workerError = ''
    for ($attempt = 1; $attempt -le $MaxAttemptsPerItem; $attempt++) {
      if (Test-Path -LiteralPath $stopPath) { break }
      $state.currentAttempt = $attempt
      $state.updatedAt = (Get-Date).ToString('o')
      Write-State $state
      $preparedJson = ''
      try { $preparedJson = Wait-ReadAheadResearch $itemId }
      catch { $workerError = $_.Exception.Message; Add-RunLog "WORKER_WAIT_ERROR id=$itemId attempt=$attempt error=$workerError" }
      if ($preparedJson) {
        try {
          $result = Integrate-PreparedMethod $itemId $item.Line $preparedJson
          if ($script:researchWorkers.ContainsKey($itemId)) {
            $finishedWorker = $script:researchWorkers[$itemId]
            try { $finishedWorker.Process.Dispose() } catch { }
            $script:researchWorkers.Remove($itemId)
          }
          break
        } catch {
          $workerError = $_.Exception.Message
          Add-RunLog "METHOD_INTEGRATE_ERROR id=$itemId attempt=$attempt error=$workerError"
          throw
        }
      }
      if ($script:researchWorkers.ContainsKey($itemId)) {
        $consumedWorker = $script:researchWorkers[$itemId]
        $workerError = if ($consumedWorker.ExitCode -ne 0) { "Worker завершился с кодом $($consumedWorker.ExitCode)." } else { 'Worker не создал корректный результат.' }
        try { $consumedWorker.Process.Dispose() } catch { }
        $script:researchWorkers.Remove($itemId)
      }
      if ($attempt -lt $MaxAttemptsPerItem) {
        Add-RunLog "WORKER_RETRY id=$itemId attempt=$attempt reason=$workerError"
        Start-Sleep -Seconds (5 * $attempt)
        $freeSlot = 1
        $busy = @($script:researchWorkers.Values | Where-Object { !$_.Completed -and !$_.Process.HasExited } | ForEach-Object Slot)
        while ($busy -contains $freeSlot -and $freeSlot -le $ResearchSlots) { $freeSlot++ }
        if ($freeSlot -gt $ResearchSlots) { $freeSlot = 1; try { foreach ($w in $script:researchWorkers.Values) { if (!$w.Process.HasExited) { $w.Process.WaitForExit(1000) } } } catch { } }
        try { Start-ReadAheadResearch $item $freeSlot }
        catch { $workerError = $_.Exception.Message; Add-RunLog "WORKER_RETRY_START_ERROR id=$itemId error=$workerError" }
      } else {
        $retryAt = (Get-Date).AddMinutes(15)
        $script:deferredUntil[$itemId] = $retryAt
        $state.currentAttempt = 0
        $state.activeItem = $null
        $state.remaining = @(Get-QueuedItems).Count
        $state.updatedAt = (Get-Date).ToString('o')
        $state.message = "Пункт $itemId пропущен после $MaxAttemptsPerItem ошибок и будет повторён в $($retryAt.ToString('HH:mm:ss')); продолжаю очередь. $workerError"
        Write-State $state
        Add-RunLog "ITEM_DEFERRED id=$itemId retryAt=$($retryAt.ToString('o')) attempts=$MaxAttemptsPerItem reason=$workerError"
        $failedCache = Join-Path $runnerDir (Join-Path 'research' ('{0:D4}' -f $itemId))
        Remove-Item -LiteralPath $failedCache -Recurse -Force -ErrorAction SilentlyContinue
        $result = @{ status = 'deferred'; line = $null }
      }
    }
    if (Test-Path -LiteralPath $stopPath) {
      Set-FinalState $state 'stopped' "Остановлено пользователем во время пункта $itemId; пункт остался в очереди."
      break
    }
    if ($state.status -eq 'stopped') { break }
    if ($result -and $result.status -eq 'deferred') { continue }
    if ($state.status -eq 'paused') { break }
    if (!$result) { Set-FinalState $state 'paused' "Пункт $itemId не был закрыт итоговым статусом."; break }

    $pendingBeforeDeploy = @(Get-ImplementedLocalLines)
    $state.pendingDeployCount = @(Get-ImplementedLocalLines).Count
    $queueAfterItem = @(Get-QueuedItems)
    $isBatchFull = ($state.pendingDeployCount - $script:lastAttemptPendingCount) -ge $DeployBatchSize
    $isLastQueuedItem = $queueAfterItem.Count -eq 0
    if ($state.pendingDeployCount -gt 0 -and ($isBatchFull -or $isLastQueuedItem)) {
      $deployResult = Invoke-PendingDeployment $itemId
      $state.lastDeployStatus = $deployResult.status
      $state.pendingDeployCount = @(Get-ImplementedLocalLines).Count
      $script:lastAttemptPendingCount = if ($deployResult.status -eq 'success') { 0 } else { $state.pendingDeployCount }
      if ($deployResult.status -eq 'validation-failed') {
        Set-FinalState $state 'paused' "Проверка production-сборки остановила публикацию $($deployResult.sha): $($deployResult.reason). $($deployResult.url)"
        break
      }
      if ($deployResult.status -eq 'deferred') {
        $state.message = "Deploy пачки из $($deployResult.count) методик временно отложен; продолжаю очередь. Причина: $($deployResult.reason)"
      }
    } elseif ($state.pendingDeployCount -gt 0) {
      Add-RunLog "DEPLOY_BATCH_ACCUMULATING id=$itemId pending=$($state.pendingDeployCount) threshold=$DeployBatchSize"
      $state.message = "Добавлено методик в ожидающую пачку: $($state.pendingDeployCount) из $DeployBatchSize; продолжаю очередь."
    }
    $state.processedThisRun++
    $state.lastCompleted = "$itemId. $($result.status) — $itemTitle"
    $state.activeItem = $null
    $state.remaining = @(Get-QueuedItems).Count
    $state.updatedAt = (Get-Date).ToString('o')
    $state.message = "Пункт $itemId закрыт статусом $($result.status)."
    Write-State $state
    Add-RunLog "ITEM_DONE id=$itemId status=$($result.status) remaining=$($state.remaining)"

    if ($MaxItems -gt 0 -and $state.processedThisRun -ge $MaxItems) {
      Set-FinalState $state 'checkpoint' "Достигнут лимит этого запуска: $MaxItems пунктов; продолжи запуском start-methodology-backlog.ps1."
      break
    }
  }
} catch {
  Set-FinalState $state 'paused' $_.Exception.Message
  throw
} finally {
  Stop-ReadAheadResearch
  if ($lockStream) { $lockStream.Dispose() }
}
