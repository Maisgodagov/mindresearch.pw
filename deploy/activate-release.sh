#!/usr/bin/env bash
set -euo pipefail

root=/opt/mindresearch
name="${1:-}"
[[ "$#" == 1 && "$name" =~ ^[0-9a-f]{40}-[0-9]+-[0-9]+$ ]]
release="$root/releases/$name"
[[ "$(realpath -e -- "$release")" == "$release" ]]
[[ -f "$release/apps/api/dist/index.js" && -f "$release/apps/web/dist/index.html" ]]

exec 9>/run/lock/mindresearch-release.lock
flock -n 9
previous="$(readlink -f "$root/current")"
[[ "$previous" == "$root/releases/"* && -d "$previous" ]]
switch_to() {
  local link="$root/.current-$$"
  ln -s -- "$1" "$link"
  mv -Tf -- "$link" "$root/current"
}

systemctl start mindresearch-backup.service
switch_to "$release"
if systemctl restart mindresearch; then
  for attempt in {1..20}; do
    if curl --fail --silent --max-time 2 http://127.0.0.1:4000/api/health >/dev/null; then
      exit 0
    fi
    sleep 2
  done
fi
echo "API health check failed; restoring $previous" >&2
switch_to "$previous"
systemctl restart mindresearch
exit 1
