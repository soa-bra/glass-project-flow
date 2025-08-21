#!/usr/bin/env bash
set -euo pipefail
echo "➤ Type-check"
pnpm tsc -p tsconfig.json --noEmit
