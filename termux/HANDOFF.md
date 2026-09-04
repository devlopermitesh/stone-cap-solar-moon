# Stone* Day Planner — deploy to Termux

Run the authoritative Planner engine on your phone. This folder is
self-contained: `planner-engine.mjs` needs **no npm install** — Node built-ins only.

## Files

| File | Purpose |
| --- | --- |
| `planner-engine.mjs` | Bundled engine (REST service, sole writer of state.json) |
| `llama-setup.sh` | Local-LLM picker: arch → RAM → profile → benchmark → enable/disable |
| `planner.env.example` | Env template — copy to `planner.env` |
| `HANDOFF.md` | This doc |

## Option A — pull from GitHub (needs git on the phone)

```bash
pkg update && pkg upgrade -y
pkg install -y git nodejs-lts

git clone --depth 1 -b feat/planner \
  https://github.com/devlopermitesh/stone-cap-solar-moon.git planner
cd planner/termux
```

## Option B — files already pushed to /sdcard via adb (my fast path)

```bash
pkg update && pkg upgrade -y
pkg install -y nodejs-lts      # only needed to run the engine
cp -r /sdcard/planner "$HOME/planner"
cd "$HOME/planner/termux"
```

## Run

```bash
# 1) (optional) local LLM — auto-decides, will DISABLE on low-RAM / 32-bit boxes
bash llama-setup.sh

# 2) secrets — fill the Gemini key if you want richer AI quick-add (optional)
cp planner.env.example planner.env   # GEMINI_API_KEY is optional; engine works without it

# 3) keep the phone awake + run the engine
termux-wake-lock
node planner-engine.mjs
```

The engine prints a status line and serves. Persistence is **SQLite**
(`planner.db`, Node's built-in `node:sqlite`, no install) with a `state.json`
fallback. On startup it recovers missed blocks (past-end, not started → marked
`carried`, folded back in on replan).

```
GET  /api/planner/state   full EngineState
GET  /api/today           today's plan + now
GET  /api/week            next 7 days
POST /api/tasks           { text: 'review notes 40min P1' } → add task(s)
POST /api/events          { events: [...] } → fold EngineEvents, persists
POST /api/feedback        { attempt: {...} } → record TaskAttempt, update behavior
GET  /api/events          recent event log
```

Try it from the phone browser: `http://127.0.0.1:8787/`.

## Keep-alive (Android 10 background limits)

- `termux-wake-lock` keeps the CPU grant while the session is open.
- Run under `termux-services` for auto-restart:
  ```bash
  pkg install termux-services
  cat > "$PREFIX/var/service/planner/run" <<'EOF'
  #!/data/data/com.termux/files/usr/bin/sh
  cd "$HOME/planner/termux"
  exec node planner-engine.mjs
  EOF
  chmod +x "$PREFIX/var/service/planner/run"
  sv-enable planner
  ```

## Local LLM strictness

`llama-setup.sh` never blindly installs a model:
1. detect architecture (`dpkg --print-architecture`)
2. detect RAM (`free -m`)
3. select model profile (32-bit + low RAM → `none` / 0.5B; 64-bit + more RAM → 1.5B)
4. **benchmark** — real 64-token generation; requires ≥ 2 tok/s and peak RSS ≤ 70%
   of RAM
5. enable/disable → writes `LOCAL_LLM_ENABLED` into `planner.env`

Re-run it anytime (e.g. after more RAM frees up) — it self-upgrades.

## Web ↦ phone wiring

The web app's Day Planner can treat the phone engine as the **single source of
truth** over REST. In the planner's **"Phone engine connection"** panel, paste
the URL; the app fetches the phone's plan on load and POSTs actions back. If
the phone is unreachable it falls back to the on-device deterministic engine,
so the web app never goes blank.

Architecture: **the deterministic engine is always authoritative.** AI (Gemini
as PRINCIPAL) only ever *proposes* whitelisted tool calls (`add_goal`,
`set_priority`, `set_weekly_target`, `schedule_now`) which the engine validates
and executes — an LLM never writes the schedule directly. Quick actions
(START/complete/quick-add) never wait on the cloud; Gemini refinement runs in
the background with graceful failure.

- **Same Wi-Fi:** engine binds `HOST=0.0.0.0`; give the web app the phone's LAN
  URL `http://192.168.0.100:8787`.
- **Over internet (Phase 2):** a reverse tunnel (e.g. `cloudflared tunnel`) so
  the deployed HTTPS web app can reach the phone.

Day one goal: confirm the engine runs on-device via `http://127.0.0.1:8787/`
and that `GET /api/today` returns your day.