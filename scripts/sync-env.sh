#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <frontend|pocketbase> <dev|prod>" >&2
  exit 1
fi

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
env_dir="${root_dir}/env"
target="${1}"
profile="${2}"

case "${target}" in
  frontend)
    src="${env_dir}/.env.${profile}"
    dest="${root_dir}/.env"
    ;;
  pocketbase)
    src="${env_dir}/.pb.${profile}"
    dest="${root_dir}/.pb-env"
    ;;
  *)
    echo "Unknown target: ${target}. Expected 'frontend' or 'pocketbase'." >&2
    exit 2
    ;;
esac

if [[ ! -f "${src}" ]]; then
  echo "Missing source file: ${src}" >&2
  exit 3
fi

cp "${src}" "${dest}"
echo "Copied ${src#"${root_dir}/"} -> ${dest#"${root_dir}/"}"
