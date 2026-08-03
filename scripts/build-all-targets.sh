#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
project_root="$(cd "${script_dir}/.." && pwd)"

restore_next_package() {
  cd "${project_root}"
  node "${script_dir}/prepare-next-package.mjs"
}

trap restore_next_package EXIT

echo "Building the ChatGPT Sites artifact..."
"${script_dir}/build-verified.sh"

echo "Building the standard Next.js Hostinger server..."
cd "${project_root}"
restore_next_package
"${project_root}/node_modules/.bin/next" build
node "${script_dir}/prepare-hostinger.mjs"

"${script_dir}/validate-artifact.sh"
trap - EXIT
restore_next_package
echo "Both Sites and Hostinger outputs are ready."
