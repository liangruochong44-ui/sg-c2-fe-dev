#!/usr/bin/env bash
# openclaw-monitor.sh — Continuously monitor Gateway health with auto-recovery

set -euo pipefail

SERVICE_NAME="openclaw-gateway.service"
GATEWAY_PORT="${OPENCLAW_GATEWAY_PORT:-18789}"
AUTO_RESTART="${OPENCLAW_AUTO_RESTART:-1}"
MAX_RESTART_ATTEMPTS=5

LOCK_FILE="${XDG_RUNTIME_DIR:-/tmp}/openclaw-monitor.lock"
LOG_DIR="${XDG_DATA_HOME:-${HOME}/.local/share}/openclaw/logs"
LOG_FILE="${LOG_DIR}/monitor.log"

mkdir -p "$LOG_DIR"

exec 9>"$LOCK_FILE"
flock -n 9 || exit 0

log() {
  local msg="$(date -u +%Y-%m-%dT%H:%M:%SZ) $*"
  echo "$msg" | tee -a "$LOG_FILE"
}

check_gateway_errors() {
  # Only match config-related errors, not startup failures
  local error_pattern="(JSON5: invalid end of input|JSON5 parse failed|SyntaxError.*config|Failed to read config at.*openclaw\.json|at loadConfig|at getHealthSnapshot)"
  if journalctl --user -u openclaw-gateway --no-pager -n 50 2>/dev/null | grep -qiE "$error_pattern"; then
    log "⚠️ Found config errors in Gateway journal"
    return 1
  fi
  return 0
}

is_gateway_healthy() {
  # Check for config errors first
  if ! check_gateway_errors; then
    return 1
  fi

  # Check health endpoint first (most reliable)
  if command -v curl &>/dev/null; then
    if curl -sfm 5 "http://localhost:$GATEWAY_PORT/health" >/dev/null 2>&1; then
      return 0
    fi
  fi

  # Fallback to port check
  if ss -tlnp 2>/dev/null | grep -q ":${GATEWAY_PORT} " || \
     netstat -tlnp 2>/dev/null | grep -q ":${GATEWAY_PORT} "; then
    return 0
  fi

  return 1
}

log "Checking Gateway health..."
if is_gateway_healthy; then
  log "✅ Gateway is healthy"
  exit 0
fi

log "⚠️ Gateway unhealthy, waiting 10s then re-checking..."
sleep 10

if is_gateway_healthy; then
  log "✅ Gateway recovered after wait"
  exit 0
fi

if [[ "$AUTO_RESTART" != "1" ]]; then
  log "❌ Gateway unhealthy, auto-restart disabled"
  exit 1
fi

log "Attempting up to $MAX_RESTART_ATTEMPTS restarts..."
for i in $(seq 1 $MAX_RESTART_ATTEMPTS); do
  log "Restart attempt $i/$MAX_RESTART_ATTEMPTS..."
  openclaw gateway --force 2>/dev/null || true
  sleep 5

  if is_gateway_healthy; then
    log "✅ Gateway recovered after restart $i"
    exit 0
  fi
done

log "❌ All $MAX_RESTART_ATTEMPTS restart attempts failed"
log "🔧 Running fix script..."

if ~/.local/bin/openclaw-fix.sh 2>&1 | tee -a "$LOG_FILE"; then
  log "✅ Fix succeeded"
  exit 0
else
  log "❌ Fix failed"
  exit 1
fi
