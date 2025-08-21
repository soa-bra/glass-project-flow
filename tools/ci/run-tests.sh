#!/usr/bin/env bash
set -euo pipefail
echo "➤ Unit tests"
pnpm vitest run
echo "➤ E2E (headless)"
pnpm playwright test
