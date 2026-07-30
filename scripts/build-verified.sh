#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ "${SITES_ENV_READY:-}" != "1" ]]; then
  exec "${script_dir}/sites-env.sh" -- "$0" "$@"
fi

command -v timeout >/dev/null || {
  echo "build-verified.sh requires GNU timeout." >&2
  exit 69
}

vinext="${SITES_PROJECT_ROOT}/node_modules/.bin/vinext"
if [[ ! -x "${vinext}" ]]; then
  echo "vinext is unavailable. Run npm run install:ci and wait for it to finish before building." >&2
  exit 69
fi

echo "Running bounded vinext build..."
timeout \
  --signal=TERM \
  --kill-after="${SITES_BUILD_KILL_AFTER:-10s}" \
  "${SITES_BUILD_TIMEOUT:-3m}" \
  "${vinext}" build

install -m 0644 \
  "${SITES_PROJECT_ROOT}/dist/standalone/server.js" \
  "${SITES_PROJECT_ROOT}/dist/standalone/vinext-server.mjs"
install -m 0644 \
  "${script_dir}/cloudflare-worker-loader.mjs" \
  "${SITES_PROJECT_ROOT}/dist/standalone/cloudflare-worker-loader.mjs"
install -m 0644 \
  "${script_dir}/hostinger-server.cjs" \
  "${SITES_PROJECT_ROOT}/dist/standalone/server.js"
install -m 0644 \
  "${script_dir}/hostinger-package.json" \
  "${SITES_PROJECT_ROOT}/dist/standalone/package.json"
install -m 0644 \
  "${script_dir}/hostinger-esm-package.json" \
  "${SITES_PROJECT_ROOT}/dist/standalone/dist/package.json"

"${script_dir}/validate-artifact.sh"
node "${script_dir}/verify-hostinger-output.mjs"
