$ErrorActionPreference = 'Stop'
$runnerDir = Join-Path $env:LOCALAPPDATA 'OporaMethodologyRunner'
$null = New-Item -ItemType Directory -Path $runnerDir -Force
Set-Content -LiteralPath (Join-Path $runnerDir 'STOP') -Value 'stop' -Encoding UTF8
Unregister-ScheduledTask -TaskName 'Opora-Methodology-Backlog-Resume' -Confirm:$false -ErrorAction SilentlyContinue
Write-Output 'Запрос остановки сохранён. Runner остановит обработку сейчас или сразу после завершения текущего пункта.'
