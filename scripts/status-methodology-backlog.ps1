$statePath = Join-Path (Join-Path $env:LOCALAPPDATA 'OporaMethodologyRunner') 'state.json'
if (!(Test-Path -LiteralPath $statePath)) {
  Write-Output 'Runner ещё не запускался.'
  exit 0
}
$state = Get-Content -LiteralPath $statePath -Raw -Encoding UTF8 | ConvertFrom-Json
$state | Format-List runId,status,pid,startedAt,updatedAt,processedThisRun,remaining,pendingDeployCount,lastDeployStatus,activeItem,lastCompleted,message
