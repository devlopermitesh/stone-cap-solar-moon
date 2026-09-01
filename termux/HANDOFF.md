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

# 2) secrets — put the rotated Gemini key here if you want the AI quick-add
cp planner.env.example planner.env
nano planner.env               # fill GEMINI_API_KEY (optional)

# 3) keep the phone awake + run the engine
termux-wake-lock
node planner-engine.mjs
```

The engine prints a status line with the day's blocks and serves:

```
GET  /api/planner/state      current EngineState
POST /api/planner/replan     { events: [...] }  → folds events, persists, returns plan
POST /api/planner/feedback   { attempt: {...} } → records TaskAttempt, updates behavior
POST /api/planner/intake     { text: 'review notes 40min P1' } → mini-parser add
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

The web app's Gemini consultant runs on the deployed app. To point the web
"Day Planner" at the phone engine (canonical state.json on-device):

- **Same Wi-Fi:** set the engine's `HOST=0.0.0.0` and give the web app the
  phone's LAN URL `http://192.168.0.100:8787`.
- **Over internet:** a reverse tunnel (e.g. termux `cloudflared tunnel`) to
  `https://<tunnel>/api/planner/...`.

Day one goal: confirm the engine runs on-device via `http://127.0.0.1:8787/`.
Wiring the deployed UI to it is the next step.