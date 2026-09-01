# Termux handoff — for a local agent on YOUR machine (SSH)

Your sandbox cannot reach the phone (LAN-only). Use this doc from your own
terminal with a CLI agent / yourself to deploy the Stone* Planner engine to
Termux over SSH.

## 0. Deploy scripts are already pushed to the phone (via adb)

The repo's `termux/` folder is already on the phone at `/sdcard/planner/`
(adb push). If it isn't, push it:

```bash
adb push termux/. /sdcard/planner/
```

## 1. SSH in

```bash
ssh -p 8022 u0_a251@192.168.0.100
# ROTATED password — the one pasted in chat history is compromised.
# Prefer key auth: ssh-copy-id -p 8022 u0_a251@192.168.0.100
```

## 2. First-run package setup

```bash
pkg update && pkg upgrade -y
pkg install -y nodejs-lts git termux-api
cp -r /sdcard/planner "$HOME/planner"   # or git clone the feat/planner branch
```

## 3. Local LLM decision (auto)

```bash
cd "$HOME/planner/termux"
bash llama-setup.sh
# This device: 32-bit (arm), ~1.3GiB available → likely DISABLES local LLM. Correct result.
```

## 4. Secrets

```bash
cp planner.env.example planner.env
# GEMINI_API_KEY is OPTIONAL on-device (web app does the AI consulting).
# If set: source planner.env before starting the engine.
```

## 5. Run (long-lived)

```bash
termux-wake-lock
node planner-engine.mjs
```

Verifies with:

```bash
curl -s http://127.0.0.1:8787/ | head
curl -s http://127.0.0.1:8787/api/planner/state | head -c 200
```

## 6. Auto-restart (termux-services)

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

## 7. Optional reverse tunnel (web app → phone engine over internet)

```bash
pkg install termux-api
# cloudflared: pkg install cloudflared
cloudflared tunnel --url http://localhost:8787
# give the web app the returned https://<random>.trycloudflare.com
```

## Architecture notes

- **Engine is pure Node** — identical on sandbox, Vercel, and Termux.
- **This phone (Xiaomi M2006C3MII, MT6765G, 32-bit Termux, ~1.3GiB free)**
  is served by the deterministic engine offline; the AI intake/label polish
  lives on the web side. That is a supported, intentional split.

## Post-deploy

1. `curl http://127.0.0.1:8787/api/planner/state` — expect 4 default goals.
2. `curl -X POST http://127.0.0.1:8787/api/planner/intake -H 'content-type: application/json' -d '{"text":"review DP notes 40min P1"}'`
3. Confirm two blocks now exist before the college window (10:00–14:30).
4. Report `planner.env` + engine stdout back for the plan status.