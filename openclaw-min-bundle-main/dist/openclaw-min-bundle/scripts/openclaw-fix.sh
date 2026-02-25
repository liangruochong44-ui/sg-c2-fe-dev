#!/usr/bin/env bash
# openclaw-fix.sh — Auto-fix OpenClaw Gateway issues.
# Can be called in two ways:
#   1. Directly by user: openclaw-fix.sh
#   2. By systemd OnFailure: when gateway repeatedly fails
#
# This script will:
#   - Check and fix invalid JSON config (via Claude Code)
#   - If gateway is failed, diagnose and fix the issue
#   - Restart the gateway and verify
#
# IMPORTANT:
#   - Do NOT hardcode API keys/tokens here.
#   - This script assumes a systemd *user* service: openclaw-gateway.service

set -euo pipefail

SERVICE_NAME="${OPENCLAW_GATEWAY_UNIT:-openclaw-gateway.service}"
GATEWAY_PORT="${OPENCLAW_GATEWAY_PORT:-18789}"

echo "[openclaw-fix] ======================================="
echo "[openclaw-fix] Starting fix script at $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "[openclaw-fix] Service: $SERVICE_NAME, Port: $GATEWAY_PORT"

is_gateway_healthy() {
  # Check health endpoint first (most reliable)
  if command -v curl &>/dev/null; then
    if curl -sfm 5 "http://localhost:$GATEWAY_PORT/health" >/dev/null 2>&1; then
      echo "[openclaw-fix] Health check: OK (curl /health success)"
      return 0
    fi
    echo "[openclaw-fix] Health check: /health endpoint failed"
  fi
  # Fallback to port check
  if ! ss -tlnp 2>/dev/null | grep -q ":${GATEWAY_PORT} " && \
     ! netstat -tlnp 2>/dev/null | grep -q ":${GATEWAY_PORT} "; then
    echo "[openclaw-fix] Health check: port $GATEWAY_PORT not listening"
    return 1
  fi
  echo "[openclaw-fix] Health check: OK (port listening)"
  return 0
}

if [[ -n "${1:-}" && "$1" == "--check-only" ]]; then
  MODE="check-only"
  echo "[openclaw-fix] Mode: forced check-only (via CLI argument)"
elif is_gateway_healthy; then
  MODE="check-only"
  echo "[openclaw-fix] Mode: check-only (Gateway is healthy)"
else
  MODE="fix"
  echo "[openclaw-fix] Mode: fix (Gateway is NOT healthy)"
fi

# Optional: Telegram notify (set to your own chat_id). Leave empty to disable.
TELEGRAM_TARGET="${OPENCLAW_FIX_TELEGRAM_TARGET:-}"

# Paths (adjust to your environment)
OPENCLAW_CONFIG_PATH="${OPENCLAW_CONFIG_PATH:-$HOME/.openclaw/openclaw.json}"
LOG_DIR="${OPENCLAW_LOG_DIR:-/tmp/openclaw-1000}"
LOG_DATE="$(date -u +%Y-%m-%d)"
LOG_FILE="${LOG_DIR}/openclaw-${LOG_DATE}.log"

mkdir -p "$LOG_DIR"

MAX_RETRIES="${OPENCLAW_FIX_MAX_RETRIES:-2}"
CLAUDE_TIMEOUT_SECS="${OPENCLAW_FIX_CLAUDE_TIMEOUT_SECS:-300}"

# Single-instance lock - kill stale opencode if locked
LOCK_FILE="${XDG_RUNTIME_DIR:-/tmp}/openclaw-fix.lock"

# Try to acquire lock, if failed, kill stale processes and retry
if ! (exec 9>"$LOCK_FILE") 2>/dev/null || ! flock -n 9; then
  echo "Detected stale lock, killing old opencode processes..."
  pkill -f "opencode" 2>/dev/null || true
  sleep 1
  rm -f "$LOCK_FILE"
  exec 9>"$LOCK_FILE"
  flock -w 5 9 || { echo "Still cannot acquire lock, exiting."; exit 1; }
fi

notify() {
  local msg="$1"
  [[ -z "$TELEGRAM_TARGET" ]] && return 0
  openclaw message send --channel telegram --target "$TELEGRAM_TARGET" --message "$msg" 2>/dev/null || true
}

write_result() {
  local status="$1" message="$2"
  local out="${XDG_RUNTIME_DIR:-/tmp}/openclaw-fix-result.json"
  cat > "$out" <<EOF
{"status":"$status","message":"$message","timestamp":"$(date -u +%Y-%m-%dT%H:%M:%SZ)"}
EOF
  echo "[openclaw-fix] result: $out"
}

find_ai_cli() {
  local c
  # Try opencode first (Codex CLI) - preferred
  c="$(command -v opencode 2>/dev/null || true)"
  if [[ -n "$c" && -x "$c" ]]; then
    echo "[openclaw-fix] Using opencode: $c" >&2
    echo "$c"; return 0
  fi
  # Try opencode in common paths
  for candidate in "$HOME/.local/bin/opencode" "$HOME/.bun/bin/opencode" /usr/local/bin/opencode; do
    if [[ -x "$candidate" ]]; then
      echo "[openclaw-fix] Using opencode: $candidate" >&2
      echo "$candidate"; return 0
    fi
  done
  # Fallback: try claude
  c="$(command -v claude 2>/dev/null || true)"
  if [[ -n "$c" && -x "$c" ]]; then
    echo "[openclaw-fix] Using claude: $c" >&2
    echo "$c"; return 0
  fi
  for candidate in "$HOME/.local/bin/claude" "$HOME/.claude/local/claude" /usr/local/bin/claude; do
    if [[ -x "$candidate" ]]; then
      echo "[openclaw-fix] Using claude: $candidate" >&2
      echo "$candidate"; return 0
    fi
  done
  echo ""
}

collect_errors() {
  local errors=""
  if [[ -f "$LOG_FILE" ]]; then
    errors+=$(tail -80 "$LOG_FILE" 2>/dev/null | grep -i "error\|fatal\|invalid\|failed\|EADDRINUSE" | tail -20 || true)
  fi

  local journal
  journal=$(journalctl --user -u "$SERVICE_NAME" --no-pager -n 40 2>/dev/null || true)

  echo "=== tail(log) errors ==="
  echo "$errors"
  echo ""
  echo "=== journalctl ($SERVICE_NAME) ==="
  echo "$journal"
}

validate_config_json() {
  # Hard validation to avoid restarting into a broken config
  if [[ -f "$OPENCLAW_CONFIG_PATH" ]]; then
    python3 -m json.tool "$OPENCLAW_CONFIG_PATH" >/dev/null 2>&1
  fi
}

restart_and_check() {
  openclaw gateway --force 2>/dev/null || true
  sleep 8
  # Check health endpoint (most reliable)
  if command -v curl &>/dev/null; then
    curl -sfm 5 "http://localhost:$GATEWAY_PORT/health" >/dev/null 2>&1
  else
    # Fallback to port check
    ss -tlnp 2>/dev/null | grep -q ":${GATEWAY_PORT} " || \
    netstat -tlnp 2>/dev/null | grep -q ":${GATEWAY_PORT} "
  fi
}

# ---- Pre-start check: validate and fix JSON before Gateway starts ----
fix_json_if_needed() {
  if [[ ! -f "$OPENCLAW_CONFIG_PATH" ]]; then
    echo "[openclaw-fix] Config file not found: $OPENCLAW_CONFIG_PATH"
    return 0
  fi

  if validate_config_json; then
    echo "[openclaw-fix] JSON config is valid"
    return 0
  fi

  echo "[openclaw-fix] JSON config is invalid, attempting to fix..."

  CLAUDE_CODE="$(find_ai_cli)"
  if [[ -z "$CLAUDE_CODE" ]]; then
    echo "[openclaw-fix] ERROR: Claude Code not found, cannot fix JSON"
    return 1
  fi

  # Collect JSON parse error details
  JSON_ERROR=$(python3 -m json.tool "$OPENCLAW_CONFIG_PATH" 2>&1 || true)

  run_ai_fix() {
  local ai_cli="$1"
  local prompt="$2"
  local timeout_secs="${3:-300}"
  
  local ai_name
  ai_name=$(basename "$ai_cli")
  
  if [[ "$ai_name" == "opencode" ]]; then
    echo "[openclaw-fix] Using opencode to fix JSON..."
    timeout "$timeout_secs" "$ai_cli" run "$prompt" --format json 2>&1
    return $?
  else
    # Claude Code or other
    timeout "$timeout_secs" "$ai_cli" -p "$prompt" \
      --allowedTools "Read,Write,Edit" \
      --max-turns 10 \
      2>&1
    return $?
  fi
}

FIX_PROMPT="OpenClaw Gateway config JSON is corrupted/invalid and needs to be fixed.

Config file: $OPENCLAW_CONFIG_PATH

JSON parse error:
$JSON_ERROR

Task:
1. Read the current config file to understand its structure
2. Fix the JSON syntax errors (missing quotes, extra commas, etc.)
3. Ensure the JSON is valid: python3 -m json.tool $OPENCLAW_CONFIG_PATH
4. Do NOT change the configuration values, only fix the JSON syntax

Show what you fixed."

  fix_output=$(run_ai_fix "$CLAUDE_CODE" "$FIX_PROMPT" "$CLAUDE_TIMEOUT_SECS" || echo "AI fix failed or timed out")

  echo "[openclaw-fix] JSON fix attempt output (tail):"
  echo "$fix_output" | tail -40

  # Verify JSON is now valid
  if validate_config_json; then
    echo "[openclaw-fix] ✅ JSON fixed successfully by Claude Code."
    notify "✅ JSON config auto-fixed by Claude Code."
    return 0
  else
    echo "[openclaw-fix] ❌ Failed to fix JSON"
    notify "🔴 Failed to auto-fix JSON config"
    return 1
  fi
}

# Run JSON fix check (works in both modes)
if ! fix_json_if_needed; then
  echo "[openclaw-fix] ❌ JSON fix failed, cannot start Gateway"
  write_result "error" "JSON fix failed"
  exit 1
fi

# Check if there are config errors in journal (even if service appears running)
check_config_errors() {
  local error_pattern="(SyntaxError|JSON5|JSON parse|Failed to read config|invalid.*config|Config invalid)"
  if journalctl --user -u openclaw-gateway --no-pager -n 30 2>/dev/null | grep -qiE "$error_pattern"; then
    return 1
  fi
  return 0
}

# Even in check-only mode, restart if there are config errors
if [[ "$MODE" == "check-only" ]]; then
  if ! check_config_errors; then
    echo "[openclaw-fix] Check-only mode: config errors found, forcing restart..."
    restart_and_check
    if ss -tlnp 2>/dev/null | grep -q ":${GATEWAY_PORT} " || \
       netstat -tlnp 2>/dev/null | grep -q ":${GATEWAY_PORT} "; then
      write_result "ok" "Restarted after config fix"
      exit 0
    fi
  fi
  echo "[openclaw-fix] Check-only mode: Gateway is running and no errors, exiting"
  write_result "ok" "Check passed"
  exit 0
fi

# MODE == "fix": Gateway is not running, attempt full fix

CLAUDE_CODE="$(find_ai_cli)"
if [[ -z "$CLAUDE_CODE" ]]; then
  notify "🔴 $SERVICE_NAME failed. Claude Code not found; cannot auto-fix."
  write_result "no-claude" "Claude Code not found"
  exit 1
fi

notify "🔧 $SERVICE_NAME failed. Attempting auto-fix via Claude Code…"

ERROR_CONTEXT="$(collect_errors)"

for attempt in $(seq 1 "$MAX_RETRIES"); do
  FIX_PROMPT="OpenClaw Gateway repeatedly failed. Fix the issue and verify.

Service: $SERVICE_NAME
Gateway port: $GATEWAY_PORT

Error context:
$ERROR_CONTEXT

Rules:
- Prefer minimal changes.
- Do NOT remove known-good baseline plugins unless clearly broken.
- After changes, verify JSON (if present): python3 -m json.tool $OPENCLAW_CONFIG_PATH > /dev/null
- Then restart: openclaw gateway --force

Show what you changed."

  fix_output=$(run_ai_fix "$CLAUDE_CODE" "$FIX_PROMPT" "$CLAUDE_TIMEOUT_SECS" || echo "AI fix failed or timed out")

  echo "[openclaw-fix] Attempt $attempt Claude output (tail):"
  echo "$fix_output" | tail -40

  # Validate config before restart
  if [[ -f "$OPENCLAW_CONFIG_PATH" ]]; then
    if ! validate_config_json; then
      notify "🔴 Auto-fix attempt $attempt produced invalid JSON: $OPENCLAW_CONFIG_PATH. Not restarting."
      continue
    fi
  fi

  if restart_and_check; then
    notify "✅ Gateway auto-fixed and restarted successfully (attempt $attempt)."
    write_result "ok" "Fixed on attempt $attempt"
    exit 0
  fi

  # Refresh error context for next loop
  ERROR_CONTEXT="$(collect_errors)"
done

notify "🔴 Gateway auto-fix failed after $MAX_RETRIES attempts. Manual intervention needed."
write_result "failed" "Failed after $MAX_RETRIES attempts"
exit 1
