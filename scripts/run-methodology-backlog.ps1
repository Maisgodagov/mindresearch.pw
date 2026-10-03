param(
  [int]$MaxItems = 0,
  [int]$MaxAttemptsPerItem = 3,
  [switch]$DryRun,
  [switch]$SelectOnly
)

$ErrorActionPreference = 'Stop'
$repo = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$queuePath = Join-Path $repo 'docs\methodologies\links\_backlog.md'
$workflowPath = Join-Path $repo 'docs\methodologies\WORKFLOW.md'
$codexCommand = Get-Command codex -ErrorAction Stop
$runnerDir = Join-Path $env:LOCALAPPDATA 'OporaMethodologyRunner'
$null = New-Item -ItemType Directory -Path $runnerDir -Force
$statePath = Join-Path $runnerDir 'state.json'
$stopPath = Join-Path $runnerDir 'STOP'
$lockPath = Join-Path $runnerDir 'runner.lock'
$logPath = Join-Path $runnerDir 'runner.log'
$terminalStatuses = @('implemented-local', 'done', 'blocked', 'ru-ineligible', 'already-available')

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

function Get-CurrentCommit {
  $sha = (& git -C $repo rev-parse HEAD).Trim()
  if ($LASTEXITCODE -ne 0 -or !$sha) { throw 'Не удалось определить текущий git commit.' }
  return $sha
}

function Start-DeploymentRetry([int]$ItemId) {
  $markerPath = Join-Path $repo 'deployment-retry.txt'
  $marker = "Retry accumulated methodologies after queue item $ItemId at $((Get-Date).ToString('o'))"
  [IO.File]::WriteAllText($markerPath, $marker + "`n", [Text.UTF8Encoding]::new($false))
  & git -C $repo add -- deployment-retry.txt
  if ($LASTEXITCODE -ne 0) { throw 'Не удалось подготовить marker для повторного deploy.' }
  & git -C $repo commit -m "Retry deployment after methodology $ItemId"
  if ($LASTEXITCODE -ne 0) { throw 'Не удалось создать commit для повторного deploy.' }
  & git -C $repo push origin main
  if ($LASTEXITCODE -ne 0) { throw 'Не удалось отправить повторный deploy в main.' }
  return Get-CurrentCommit
}

function Wait-Deployment([string]$Sha) {
  $headers = @{ 'User-Agent' = 'OporaMethodologyRunner' }
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

function Set-FinalState($State, [string]$Status, [string]$Reason) {
  $State.status = $Status
  $State.activeItem = $null
  $State.message = $Reason
  $State.updatedAt = (Get-Date).ToString('o')
  Write-State $State
  Add-RunLog "$Status $Reason"
}

if (!(Test-Path -LiteralPath $queuePath)) { throw "Queue file not found: $queuePath" }

$queue = @(Get-QueuedItems)
if (!$queue.Count) {
  Write-Output 'Очередь пуста: записей со статусом queued нет.'
  exit 0
}
if ($DryRun) {
  Write-Output "Следующий пункт: $($queue[0].Line)"
  Write-Output "Осталось записей в статусе queued: $($queue.Count)"
  exit 0
}

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
  message = 'Последовательная обработка начата.'
}
Remove-Item -LiteralPath $stopPath -Force -ErrorAction SilentlyContinue
Write-State $state
Add-RunLog "START run=$runId remaining=$($queue.Count)"

try {
  while ($true) {
    if (Test-Path -LiteralPath $stopPath) {
      Set-FinalState $state 'stopped' 'Получен запрос на остановку; очередь сохранена.'
      break
    }

    Add-RunLog 'LOOP_READ_START'
    $queue = @(Get-QueuedItems)
    Add-RunLog "LOOP_READ_DONE count=$($queue.Count)"
    if (!$queue.Count) {
      Set-FinalState $state 'complete' 'Записей со статусом queued больше нет.'
      Unregister-ScheduledTask -TaskName 'Opora-Methodology-Backlog-Resume' -Confirm:$false -ErrorAction SilentlyContinue
      break
    }
    $item = $queue[0]
    $itemId = $item.Id
    Add-RunLog "ITEM_SELECTED id=$itemId lineType=$($item.Line.GetType().FullName) lineLength=$($item.Line.Length)"
    $itemTitle = (($item.Line -split ' — `queued`;', 2)[0] -replace '^\- \[ \] \d+\. ', '').Trim()
    $state.activeItem = "$itemId. $itemTitle"
    Add-RunLog 'ACTIVE_ITEM_SET'
    $state.remaining = $queue.Count
    $state.currentAttempt = 0
    $state.updatedAt = (Get-Date).ToString('o')
    $state.message = 'Обрабатывается один пункт; следующий не начнётся до итогового статуса этого пункта.'
    Add-RunLog 'ACTIVE_STATE_WRITE_START'
    Write-State $state
    Add-RunLog 'ACTIVE_STATE_WRITE_DONE'
    Add-RunLog "ITEM_START id=$itemId remaining=$($queue.Count)"
    if ($SelectOnly) {
      Set-FinalState $state 'checkpoint' "SelectOnly: selected queue item $itemId without starting Codex."
      break
    }

    $result = $null
    for ($attempt = 1; $attempt -le $MaxAttemptsPerItem; $attempt++) {
      if (Test-Path -LiteralPath $stopPath) { break }
      $state.currentAttempt = $attempt
      $state.updatedAt = (Get-Date).ToString('o')
      Write-State $state

      $prompt = @'
Это ровно один пункт фоновой очереди методик. Работай только с ним и не переходи к соседним пунктам.

Сначала прочитай docs/methodologies/WORKFLOW.md. Работай в ускоренном режиме. Решение о добавлении зависит только от двух условий: (1) доступен адекватный русский текст методики и (2) найден надёжный, однозначный ключ и алгоритм подсчёта. Не трать время на проверки лицензий, российской апробации, норм, публикационных требований или обязательную независимую копию. Не отклоняй методику по этим причинам. Не выдумывай ключ и не создавай собственный перевод вместо отсутствующей русской версии.

НОВЫЙ ОБЯЗАТЕЛЬНЫЙ РЕЖИМ НАКОПИТЕЛЬНОГО DEPLOY (он переопределяет любые противоречащие старые указания ниже): каждая локально завершённая методика коммитится/пушится с итогом `implemented-local`; runner ждёт GitHub workflow. Если deploy не удался из-за хостинга, базы, SSH или health-check, НЕ ставь `PAUSE_REQUIRED`, не откатывай изменения и переходи к следующему пункту. После каждого следующего пункта runner повторно выкладывает все накопленные `implemented-local` методики. Только при успешном workflow и production health все накопленные строки меняются на `done`. Ошибка CI `npm ci`/build или невозможность commit/push — причина остановиться.

Для нового инструмента быстро найди русскую версию, надёжный ключ и схему подсчёта. Если оба условия допуска выполнены — реализуй методику, выполни краткую проверку соответствия ключа и нужную сборку, поставь `[x]` и `implemented-local`, добавь краткий review и закоммить/отправь в `main` только относящиеся к ней файлы. Не трать время на остальные исследовательские проверки. Не жди deploy в этой Codex-сессии и не ставь `done`: runner следит за workflow и production health-check. Если production deploy падает по инфраструктурной причине, оставь пакет в `implemented-local` и продолжай очередь.

Не ставь `blocked` или `ru-ineligible` из-за лицензии, апробации, норм, отсутствия независимой копии либо недоступности необязательных сведений. `blocked` допустим только если после разумного поиска нельзя получить надёжный ключ/подсчёт; `ru-ineligible` — только если нет адекватного русского текста. Для точного дубликата допустим `already-available`. Создай короткий review и перейди дальше. Если в очереди есть изменения других закрытых пунктов этого запуска, включи их тоже, но не включай посторонние файлы. При наличии `implemented-local` runner после этого пункта повторит deploy накопленного пакета.

Не меняй существующие опросы и исторические результаты. Не коммить посторонние незакоммиченные изменения. Не используй `PAUSE_REQUIRED` для исследовательских вопросов: зафиксируй итог `blocked` только при ненадёжном/отсутствующем ключе, `ru-ineligible` только при отсутствии адекватного русского текста и продолжай. Если возникла временная техническая ошибка, попробуй альтернативный способ и затем продолжай очередь с ясным статусом. Не ставь статус только по названию без поиска ключа и русского текста.

Пункт очереди (ссылка на страницу и путеводитель включены):
__QUEUE_ITEM__

После завершения напиши короткое резюме. Runner проверит итог, продолжит очередь при сбое production deploy и подтвердит весь накопленный batch после успешного workflow и health-check.
'@
      $prompt = $prompt.Replace('__QUEUE_ITEM__', $item.Line)
      $safeId = '{0:D4}' -f $itemId
      $itemDir = Join-Path $runnerDir "items\$safeId"
      $null = New-Item -ItemType Directory -Path $itemDir -Force
      $lastMessage = Join-Path $itemDir 'last-message.txt'
      $transcript = Join-Path $itemDir ("attempt-{0}.jsonl" -f $attempt)
      $stderrPath = Join-Path $itemDir ("attempt-{0}.stderr.log" -f $attempt)
      Remove-Item -LiteralPath $lastMessage -Force -ErrorAction SilentlyContinue

      $psi = [Diagnostics.ProcessStartInfo]::new()
      $psi.FileName = $codexCommand.Source
      $psi.WorkingDirectory = $repo
      $psi.UseShellExecute = $false
      $psi.CreateNoWindow = $true
      $psi.RedirectStandardInput = $true
      $psi.RedirectStandardOutput = $true
      $psi.RedirectStandardError = $true
      $psi.StandardOutputEncoding = [Text.UTF8Encoding]::new($false)
      $psi.StandardErrorEncoding = [Text.UTF8Encoding]::new($false)
      $psi.Arguments = "exec --json --approve-for-me -c model_reasoning_effort=medium -C `"$repo`" --output-last-message `"$lastMessage`" -"
      $proc = [Diagnostics.Process]::new()
      $proc.StartInfo = $psi
      try {
        if (!$proc.Start()) { throw 'Codex CLI did not start.' }
        $stdoutTask = $proc.StandardOutput.ReadToEndAsync()
        $stderrTask = $proc.StandardError.ReadToEndAsync()
        $promptBytes = [Text.UTF8Encoding]::new($false).GetBytes($prompt)
        $proc.StandardInput.BaseStream.Write($promptBytes, 0, $promptBytes.Length)
        $proc.StandardInput.BaseStream.Flush()
        $proc.StandardInput.Close()
        $started = Get-Date
        $stopRequested = $false
        while (!$proc.WaitForExit(2000)) {
          if (Test-Path -LiteralPath $stopPath) {
            $stopRequested = $true
            try { $proc.Kill() } catch { }
            break
          }
          if (((Get-Date) - $started).TotalMinutes -gt 120) {
            try { $proc.Kill() } catch { }
            throw 'Методика не завершилась за 120 минут; текущая запись оставлена queued.'
          }
          $state.updatedAt = (Get-Date).ToString('o')
          Write-State $state
        }
        $proc.WaitForExit()
        $stdoutText = $stdoutTask.GetAwaiter().GetResult()
        $stderrText = $stderrTask.GetAwaiter().GetResult()
        Set-Content -LiteralPath $transcript -Value $stdoutText -Encoding UTF8
        Set-Content -LiteralPath $stderrPath -Value $stderrText -Encoding UTF8
        if ($stopRequested) {
          Set-FinalState $state 'stopped' "Остановлено пользователем во время пункта $itemId; пункт остался в очереди."
          break
        }
        if ($proc.ExitCode -ne 0) {
          $shortError = (($stderrText -split "`r?`n" | Where-Object { $_.Trim() } | Select-Object -Last 3) -join ' ').Trim()
          throw "Codex CLI завершился с кодом $($proc.ExitCode). $shortError"
        }
      } finally {
        $proc.Dispose()
      }

      $latestLine = Get-Content -LiteralPath $queuePath -Encoding UTF8 | Where-Object { $_ -match "^\- \[[ x]\] $itemId\. " } | Select-Object -First 1
      if ($latestLine -and $latestLine -match '^\- \[x\] \d+\. .+ — `(?<status>[^`]+)`;' -and $terminalStatuses -contains $Matches.status) {
        $result = @{ status = $Matches.status; line = $latestLine }
        break
      }
      if (Test-Path -LiteralPath $lastMessage) {
        $agentMessage = (Get-Content -LiteralPath $lastMessage -Raw -Encoding UTF8).Trim()
      } else { $agentMessage = 'Codex не сохранил итоговое сообщение.' }
      if ($attempt -lt $MaxAttemptsPerItem) {
        Add-RunLog "RETRY id=$itemId attempt=$attempt reason=NoTerminalStatus"
        Start-Sleep -Seconds (5 * $attempt)
      } else {
        Set-FinalState $state 'paused' "После $MaxAttemptsPerItem попыток пункт $itemId не получил итоговый статус. $agentMessage"
      }
    }

    if ($state.status -in @('stopped', 'paused')) { break }
    if (!$result) { Set-FinalState $state 'paused' "Пункт $itemId не был закрыт итоговым статусом."; break }

    $pendingBeforeDeploy = @(Get-ImplementedLocalLines)
    if ($result.status -eq 'implemented-local' -or $pendingBeforeDeploy.Count -gt 0) {
      $deploySha = Get-CurrentCommit
      if ($result.status -ne 'implemented-local') { $deploySha = Start-DeploymentRetry $itemId }
      Add-RunLog "DEPLOY_START id=$itemId sha=$deploySha pending=$($pendingBeforeDeploy.Count)"
      $deployResult = Wait-Deployment $deploySha
      $state.lastDeployStatus = $deployResult.status
      if ($deployResult.status -eq 'success') {
        Mark-ImplementedLocalAsDone $deploySha
        $state.pendingDeployCount = 0
        Add-RunLog "DEPLOY_CONFIRMED id=$itemId sha=$deploySha url=$($deployResult.url)"
        & git -C $repo add -- docs/methodologies/links/_backlog.md
        if ($LASTEXITCODE -ne 0) { throw 'Не удалось подготовить статусы подтверждённых методик.' }
        & git -C $repo commit -m "Mark methodology batch deployed"
        if ($LASTEXITCODE -ne 0) { throw 'Не удалось зафиксировать статусы подтверждённых методик.' }
        & git -C $repo push origin main
        if ($LASTEXITCODE -ne 0) { throw 'Не удалось сохранить статусы подтверждённых методик в main.' }
      } elseif ($deployResult.status -eq 'validation-failed') {
        Set-FinalState $state 'paused' "CI validation failed for deployment $($deploySha): $($deployResult.reason). $($deployResult.url)"
        break
      } else {
        $state.pendingDeployCount = @(Get-ImplementedLocalLines).Count
        $state.message = "Deploy отложен; очередь продолжится, ожидают выпуска: $($state.pendingDeployCount). Причина: $($deployResult.reason)"
        Add-RunLog "DEPLOY_DEFERRED id=$itemId sha=$deploySha pending=$($state.pendingDeployCount) reason=$($deployResult.reason)"
      }
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
  if ($lockStream) { $lockStream.Dispose() }
}
