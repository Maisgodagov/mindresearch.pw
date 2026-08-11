#!/usr/bin/env bash
set -euo pipefail

release_dir="$1"
cd "$release_dir"
npm ci
npm run build

ln -sfn /etc/mindresearch.env "$release_dir/apps/api/.env"
npm run seed

ln -sfn "$release_dir" /opt/mindresearch/current
sudo /usr/bin/systemctl restart mindresearch
sudo /usr/bin/systemctl reload nginx

for attempt in {1..15}; do
  if curl --fail --silent http://127.0.0.1:4000/api/health >/dev/null; then
    find /opt/mindresearch/releases -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' | sort -rn | tail -n +6 | cut -d' ' -f2- | xargs -r rm -rf
    exit 0
  fi
  sleep 2
done

echo "API health check failed" >&2
exit 1
