param([int]$MaxItems = 0)

$ErrorActionPreference = 'Stop'
$runner = Join-Path $PSScriptRoot 'run-methodology-backlog.ps1'
$runnerDir = Join-Path $env:LOCALAPPDATA 'OporaMethodologyRunner'
$repo = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$taskName = 'Opora-Methodology-Backlog-Resume'
if ($MaxItems -eq 0) {
  $firstResume = (Get-Date).Date.AddDays(1).AddHours(4)
  $actionArgs = "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$runner`""
  $action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument $actionArgs -WorkingDirectory $repo
  $trigger = New-ScheduledTaskTrigger -Daily -At $firstResume
  $settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Hours 12)
  $principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Limited
  Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description 'Возобновляет локальную обработку очереди методик; runner пропускает дубли процессов и завершает задачу после пустой очереди.' -Force | Out-Null
}
$arguments = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', "`"$runner`"", '-MaxItems', "$MaxItems")
$process = Start-Process -FilePath 'powershell.exe' -ArgumentList $arguments -WorkingDirectory $repo -WindowStyle Hidden -PassThru
Start-Sleep -Seconds 2
if ($process.HasExited -and $process.ExitCode -eq 2) {
  Write-Output 'Runner уже работает. Проверь scripts/status-methodology-backlog.ps1.'
  exit 2
}
Write-Output "Фоновый runner запущен (PID $($process.Id)). Состояние и журнал: $runnerDir"
Write-Output 'Для остановки после текущей методики выполни scripts/stop-methodology-backlog.ps1.'
if ($MaxItems -eq 0) { Write-Output "Задание возобновления создано в Планировщике задач на 04:00 каждый день: $taskName" }
