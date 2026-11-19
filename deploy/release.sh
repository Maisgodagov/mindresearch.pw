#!/usr/bin/env bash
set -euo pipefail

release_dir="$1"
cd "$release_dir"
npm ci --omit=dev --workspace=@opora/api --include-workspace-root

# Keep old hashed assets available for tabs already open during the release.
cp -an /opt/mindresearch/current/apps/web/dist/assets/. apps/web/dist/assets/
sudo -n /usr/local/sbin/mindresearch-activate-release "${release_dir##*/}"
