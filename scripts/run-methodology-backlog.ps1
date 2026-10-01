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
$terminalStatuses = @('done', 'blocked', 'ru-ineligible', 'already-available')

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

Обязательно сначала прочитай docs/methodologies/WORKFLOW.md и выполни его правила: российская опубликованная версия; первичный и независимый источник; лицензионные условия; точный текст/ключ/подсчёт; ручные крайние и смешанные контрольные расчёты; отсутствие выдуманных норм. PsyTests используй только для навигации и независимой сверки, не как единственное доказательство.

Для нового инструмента выполни проверку источников, прав, тестов и сборки по WORKFLOW. Если он подтверждён и реализован, отдельно зафиксируй и отправь только относящиеся к нему изменения в `main`, дождись успешного GitHub Actions workflow `Deploy production`, проверь production health и наличие инструмента в каталоге сайта как подтверждённого (`isVerified=true`). Не начинай следующий пункт до выполнения всех этих шагов. Только тогда поставь статус `done`. Не объявляй успех при неуспешном/неизвестном деплое или если методика не видна в production. При проблеме оставь пункт `queued`, запиши конкретный блокер и заверши `PAUSE_REQUIRED`.

Для `blocked`, `ru-ineligible` или `already-available` создай/обнови review и точно укажи причину; эти решения не требуют релиза. Если работа объективно требует ответа пользователя или прав/файлов/источников, которые невозможно запросить фоново, не угадывай: оставь этот пункт в `queued`, запиши блокер и заверши сообщением `PAUSE_REQUIRED`.

Не меняй существующие опросы и исторические результаты. Сохраняй посторонние незакоммиченные изменения пользователя и не включай их в commit. Обработай только указанный пункт, затем обнови только его строку в docs/methodologies/links/_backlog.md: для успешно реализованного и появившегося в production подтверждённого инструмента установи `[x]` и статус `done`; для `blocked`, `ru-ineligible` или `already-available` — соответствующий итоговый статус. Включи ссылку на review и подтверждение deploy для `done`. Никакой статус не ставь только по названию без проверки источников.

Пункт очереди (ссылка на страницу и путеводитель включены):
__QUEUE_ITEM__

После завершения напиши короткое резюме. Runner проверит статус строки перед переходом дальше.
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
      $psi.Arguments = "exec --json --approve-for-me -c model_reasoning_effort=high -C `"$repo`" --output-last-message `"$lastMessage`" -"
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
      if ($agentMessage -match 'PAUSE_REQUIRED') {
        Set-FinalState $state 'paused' "Нужен человек по пункту $itemId. $agentMessage"
        break
      }
      if ($attempt -lt $MaxAttemptsPerItem) {
        Add-RunLog "RETRY id=$itemId attempt=$attempt reason=NoTerminalStatus"
        Start-Sleep -Seconds (60 * $attempt)
      } else {
        Set-FinalState $state 'paused' "После $MaxAttemptsPerItem попыток пункт $itemId не получил итоговый статус. $agentMessage"
      }
    }

    if ($state.status -in @('stopped', 'paused')) { break }
    if (!$result) { Set-FinalState $state 'paused' "Пункт $itemId не был закрыт итоговым статусом."; break }
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
