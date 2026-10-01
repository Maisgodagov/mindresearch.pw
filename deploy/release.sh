#!/usr/bin/env bash
set -euo pipefail

release_dir="$1"
cd "$release_dir"
npm ci --omit=dev --workspace=@opora/api --include-workspace-root
ln -sfn /etc/mindresearch.env "$release_dir/apps/api/.env"
(cd apps/api && node dist/seed.js)

ln -sfn "$release_dir" /opt/mindresearch/current
sudo /usr/bin/systemctl restart mindresearch
sudo /usr/bin/systemctl reload nginx

for attempt in {1..15}; do
  if curl --fail --silent http://127.0.0.1:4000/api/health >/dev/null; then
    current_release="$(readlink -f /opt/mindresearch/current)"
    while IFS= read -r old_release; do
      [ -z "$old_release" ] && continue
      [ "$(readlink -f "$old_release")" = "$current_release" ] && continue
      if ! rm -rf -- "$old_release"; then
        echo "Warning: could not remove old release: $old_release" >&2
      fi
    done < <(find /opt/mindresearch/releases -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' | sort -rn | tail -n +6 | cut -d' ' -f2-)
    exit 0
  fi
  sleep 2
done

echo "API health check failed" >&2
exit 1
