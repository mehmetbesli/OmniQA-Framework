#!/usr/bin/env bash
set -e

# ==============================================================================
# OmniQA Framework - Docker Entrypoint Script
# Supports direct pipeline execution or custom commands
# ==============================================================================

# If no arguments provided, run default e2e suite in QA environment
if [ $# -eq 0 ]; then
  echo "🚀 Executing OmniQA Unified Suite (Default: QA environment)..."
  exec pwsh -File ./run-e2e.ps1 -Env "${TEST_ENV:-qa}"
fi

# If first argument starts with a dash (e.g. -Env dev, -Browser firefox, -SkipPerformance)
if [[ "$1" == -* ]]; then
  echo "🚀 Executing OmniQA Unified Suite with custom parameters: $*"
  exec pwsh -File ./run-e2e.ps1 "$@"
fi

# Otherwise, execute user-specified command (e.g. npm test, npx playwright test, bash)
exec "$@"
