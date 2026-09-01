#!/data/data/com.termux/files/usr/bin/bash
# llama-setup.sh — Local LLM profile picker for Stone* Planner on Termux.
#
# Pipeline: detect arch -> detect RAM -> select model profile ->
#           benchmark (tok/s + peak RSS) -> enable/disable local LLM.
#
# Usage:  bash llama-setup.sh          # decide + enable/disable
#         bash llama-setup.sh --force  # ignore disable verdict, try anyway
set -u

PREFIX=${PREFIX:-/data/data/com.termux/files/usr}
MODELS_DIR="$HOME/planner-models"
ENV_FILE="${1:+$PWD/}planner.env"
ENV_FILE="planner.env"

log()   { printf '==> %s\n' "$*"; }
warn()  { printf '!!  %s\n' "$*" >&2; }

# ---------- env writers ----------
disable_llm() {
  { grep -v '^LOCAL_LLM_ENABLED=' "$ENV_FILE" 2>/dev/null
    printf 'LOCAL_LLM_ENABLED=false\nLLM_BASE_URL=\nLLM_MODEL=\n'; } > "$ENV_FILE.tmp"
  mv "$ENV_FILE.tmp" "$ENV_FILE" 2>/dev/null || { rm -f "$ENV_FILE.tmp"; printf 'LOCAL_LLM_ENABLED=false\nLLM_BASE_URL=\nLLM_MODEL=\n' > "$ENV_FILE"; }
  log "local LLM: DISABLED (deterministic engine + optional Gemini consultant still work)"
}

enable_llm() {
  { grep -v -E '^(LOCAL_LLM_ENABLED|LLM_BASE_URL|LLM_MODEL)=' "$ENV_FILE" 2>/dev/null
    printf 'LOCAL_LLM_ENABLED=true\nLLM_BASE_URL=http://localhost:8800/v1\nLLM_MODEL=%s\n' "$PROFILE"; } > "$ENV_FILE.tmp"
  mv "$ENV_FILE.tmp" "$ENV_FILE" 2>/dev/null || { rm -f "$ENV_FILE.tmp"; printf 'LOCAL_LLM_ENABLED=true\nLLM_BASE_URL=http://localhost:8800/v1\nLLM_MODEL=%s\n' "$PROFILE" > "$ENV_FILE"; }
  log "local LLM: ENABLED (profile=${PROFILE}, ${TPS_NUM} tok/s, RSS ${RSS_MB}MB)"
}

# -------- 1. detect architecture --------
ARCH=$(dpkg --print-architecture 2>/dev/null || uname -m)
case "$ARCH" in
  arm|armhf|armv7*)                   ISA=arm32   ;;
  aarch64|arm64)                      ISA=aarch64 ;;
  x86_64|amd64)                       ISA=x86_64  ;;
  *)                                  ISA=unknown ;;
esac
log "architecture: $ARCH ($ISA)"

# -------- 2. detect RAM --------
if command -v free >/dev/null 2>&1; then
  TOTAL_MB=$(free -m | awk '/Mem:/{print $2}')
  AVAIL_MB=$(free -m | awk '/Mem:/{print $7}')
else
  TOTAL_MB=$(( $(awk '/MemTotal/{print $2}' /proc/meminfo) / 1024 ))
  AVAIL_MB=$TOTAL_MB
fi
[ -z "$TOTAL_MB" ] && TOTAL_MB=0
[ -z "$AVAIL_MB" ] && AVAIL_MB=$TOTAL_MB
log "ram: ${TOTAL_MB}MB total, ${AVAIL_MB}MB available"

# -------- 3. select model profile --------
pick_profile() {
  case "$ISA" in
    arm32)
      if   [ "$AVAIL_MB" -lt 1000 ]; then echo none
      elif [ "$AVAIL_MB" -lt 2600 ]; then echo qwen25-0.5b
      else                                echo qwen25-1.5b
      fi ;;
    aarch64|x86_64)
      if   [ "$AVAIL_MB" -lt 1500 ]; then echo none
      elif [ "$AVAIL_MB" -lt 3600 ]; then echo qwen25-0.5b
      else                                echo qwen25-1.5b
      fi ;;
    *) echo none ;;
  esac
}

PROFILE=$(pick_profile)
log "model profile: ${PROFILE:-none}"

declare -A URLS SIZES
URLS[qwen25-0.5b]="https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf"
URLS[qwen25-1.5b]="https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q4_k_m.gguf"
SIZES[qwen25-0.5b]=480
SIZES[qwen25-1.5b]=1100

[ "${1:-}" = --force ] && FORCE=1 || FORCE=0

if [ "$PROFILE" = none ]; then
  disable_llm
  warn "Available RAM is too tight for a local model on this $ISA box."
  warn "The planner stays fully offline-capable WITHOUT a local LLM."
  exit 0
fi

MODEL_FILE="$MODELS_DIR/${PROFILE}.gguf"
model_mb=${SIZES[$PROFILE]:-500}

if [ "$AVAIL_MB" -lt $(( model_mb + 300 )) ] && [ "$FORCE" = 0 ]; then
  disable_llm
  warn "Model needs ~${model_mb}MB but only ${AVAIL_MB}MB are available. Re-run with --force to try anyway."
  exit 0
fi

mkdir -p "$MODELS_DIR"
if [ ! -f "$MODEL_FILE" ]; then
  log "downloading ${PROFILE} (~${model_mb}MB)…"
  curl -L --fail --progress-bar -o "$MODEL_FILE" "${URLS[$PROFILE]}" || {
    warn "download failed (no network?). Local LLM stays OFF; engine keeps planning offline."
    disable_llm
    exit 1
  }
fi

# -------- llama-server (build once when missing) --------
SERVER_BIN="$PREFIX/bin/llama-server"
if [ ! -x "$SERVER_BIN" ]; then
  log "llama-server missing — installing build tools and building llama.cpp (a few minutes)…"
  pkg install -y cmake make clang git 2>/dev/null
  TMP=$(mktemp -d)
  git clone --depth 1 https://github.com/ggml-org/llama.cpp "$TMP/llama.cpp" >/dev/null 2>&1 \
    && cmake -B "$TMP/llama.cpp/build" -DLLAMA_CURL=OFF -DCMAKE_BUILD_TYPE=Release "$TMP/llama.cpp" >/dev/null 2>&1 \
    && cmake --build "$TMP/llama.cpp/build" --config Release -j2 --target llama-server >/dev/null 2>&1 \
    && cp "$TMP/llama.cpp/build/bin/llama-server" "$SERVER_BIN" \
    && chmod +x "$SERVER_BIN"
  rm -rf "$TMP"
  [ -x "$SERVER_BIN" ] || { warn "llama.cpp build failed. Re-run inside Termux with network, or keep LLM off."; disable_llm; exit 1; }
fi

# -------- 4. benchmark (tok/s + peak RSS) --------
log "benchmarking ${PROFILE} (64 tokens)…"
"$SERVER_BIN" -m "$MODEL_FILE" --port 8800 -c 2048 --no-warmup >"/tmp/llama-bench-$$.log" 2>&1 &
LSPID=$!
sleep 6
TPS=$("$SERVER_BIN" -m "$MODEL_FILE" -p "Write one short sentence about discipline." -n 64 -t 4 2>/dev/null \
      | grep -oE '[0-9.]+ tokens/s' | head -1 | sed 's/ tokens\/s//')
RSS_KB=$(awk '/VmRSS/{print $2}' /proc/$LSPID/status 2>/dev/null || echo 0)
kill "$LSPID" 2>/dev/null
wait "$LSPID" 2>/dev/null

TPS_NUM=${TPS:-0}
TPS_NUM=$(printf '%.1f' "$TPS_NUM" 2>/dev/null || echo 0)
RSS_MB=$(( ${RSS_KB:-0} / 1024 ))
[ "$RSS_MB" -le 0 ] && RSS_MB=$model_mb
log "benchmark: ${TPS_NUM} tok/s, peak RSS ~${RSS_MB}MB"

# -------- 5. verdict --------
OK_TPS=$(awk -v a="$TPS_NUM" 'BEGIN{print (a>=2)?1:0}' 2>/dev/null || echo 0)
OK_RSS=$(awk -v t="$TOTAL_MB" -v r="$RSS_MB" 'BEGIN{print ((r*100/t)<=70)?1:0}' 2>/dev/null || echo 1)

if [ "$OK_TPS" = 1 ] && [ "$OK_RSS" = 1 ]; then
  enable_llm
else
  if [ "$FORCE" = 1 ]; then enable_llm; else disable_llm; fi
fi

log "done. planner.env now controls the local LLM ('source planner.env' next to engine)."