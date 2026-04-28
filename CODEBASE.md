# GhostNet Codebase Map
> This document is the primary context file for IBM Bob. It describes the full architecture, route map, database schema, and module responsibilities of the GhostNet platform.

---

## Overview

GhostNet is a browser-based, multiplayer hacking simulator and cybersecurity education platform. Players hack, scan, steal, and defend in a persistent game world that maps to real MITRE ATT&CK tactics and Bloom's Taxonomy cognitive levels.

- **Live URL:** https://ghost-net.org (V4/V5) | https://ghost10.org (V10)
- **Stack:** Python 3 / Flask / SQLite (V4/V5) or PostgreSQL (V10)
- **Server:** DigitalOcean Droplet, nginx reverse proxy, systemd service (`ghostnet.service`)
- **Single developer / solo maintainer**

---

## Entry Point

**`app.py`** — Main Flask application. Contains all routes, DB init, game logic, and API endpoints. Approximately 3,000–5,000 lines.

Run via systemd:
```bash
systemctl restart ghostnet
journalctl -u ghostnet -n 15 --no-pager
```

Python compile check before restart:
```bash
python3 -m py_compile app.py
```

---

## Database Schema (SQLite — V4/V5)

### `users` table
| Column | Type | Notes |
|---|---|---|
| id | INTEGER | Primary key |
| username | TEXT | Unique |
| password | TEXT | Hashed |
| email | TEXT | |
| money | REAL | In-game currency (NOT btc for bank ops) |
| btc | REAL | Bitcoin balance |
| xp | INTEGER | Experience points |
| level | INTEGER | Derived from XP |
| home_ip | TEXT | Player's assigned IP (NOT `ip`) |
| vip | INTEGER | VIP multiplier flag |
| loan_btc | REAL | Bank loan amount |
| defense_expiry | TEXT | JSON-parsed honeypot expiry (48h) |

### `bank_accounts` table
| Column | Type | Notes |
|---|---|---|
| user_id | INTEGER | FK to users |
| balance | REAL | Bank balance |
| loan_btc | REAL | Outstanding loan |

### `posts` table (social feed)
| Column | Type | Notes |
|---|---|---|
| id | INTEGER | |
| user_id | INTEGER | |
| content | TEXT | |
| created_at | TEXT | |

### `missions` / `ALL_MISSIONS`
Uses `level_req` column (NOT `locked`). Mission system defined in-code as a list of dicts.

---

## Key Route Groups

### Authentication
| Route | Method | Description |
|---|---|---|
| `/login` | GET/POST | Login form + bcrypt check |
| `/register` | GET/POST | New user registration |
| `/logout` | GET | Clear session |

### Game Core
| Route | Method | Description |
|---|---|---|
| `/desktop` | GET | Main game UI (desktop.html) |
| `/terminal` | GET | Hacker terminal (loads as iframe in desktop.html) |
| `/api/bump/linux` | POST | Award XP for terminal command (use postMessage bridge from iframe) |
| `/api/award_xp` | POST | Award XP with VIP multiplier + mission bump |
| `/api/public_stats` | GET | Public leaderboard stats |

### Economy
| Route | Method | Description |
|---|---|---|
| `/api/economy/leaderboard` | GET | Live leaderboard (used by `top` command) |
| `/api/bank/deposit` | POST | Deposit money (uses `money` column) |
| `/api/bank/withdraw` | POST | Withdraw money |
| `/api/bank/convert` | POST | Bidirectional money ↔ BTC conversion |

### PvP
| Route | Method | Description |
|---|---|---|
| `/api/hack` | POST | Hack another player |
| `/api/steal` | POST | Steal BTC from target |
| `/api/ddos` | POST | DDoS attack |
| `/api/ghost_wipe` | POST | Wipe target's logs |

### Missions
| Route | Method | Description |
|---|---|---|
| `/missions` | GET | Mission board |
| `/api/mission/grover/submit` | POST | Submit Grover's Algorithm solution (Qiskit subprocess) |
| `/rpg4` | GET | RPG4 mission (CIPHER + PHANTOM characters) |

### Admin
| Route | Method | Description |
|---|---|---|
| `/admin` | GET | Admin dashboard (Fortinet SOC aesthetic) |
| `/admin/users` | GET | User management |
| `/api/admin/award_xp` | POST | Manual XP award |

### Quantum
| Route | Method | Description |
|---|---|---|
| `/api/qscan` | POST | Grover (8-qubit) + QRNG scan, awards 75 XP + 15/vuln |
| `/api/mission/grover/submit` | POST | Validates Qiskit stdout == '11', awards 1000 XP + $10,000 |

---

## Terminal Commands

The terminal (Share Tech Mono, green-on-black) supports 40+ commands:

**Recon:** `nmap`, `nikto`, `scan`, `ping`, `traceroute`, `whois`, `qscan`
**Navigation:** `ls`, `cat`, `ps`, `ifconfig`, `netstat`, `grep`, `history`, `man`
**Actions:** `hack`, `steal`, `ddos`, `ghost_wipe`, `ssh`, `sudo`, `chmod`
**Files:** `wget`, `curl`, `nano`, `git`
**System:** `top` (fetches live players from `/api/economy/leaderboard`), `systemctl`, `journalctl`

All 20 core commands are wired to `awardXP()` for XP rewards.

**`man grover`** — Opens academic page about Grover's Algorithm.
**`qscan`** — Runs 8-qubit Grover + 16-qubit QRNG async TCP scan.

---

## AI Agents (Ollama-powered)

| Agent | Color | Endpoint | Notes |
|---|---|---|---|
| GHOST-7 | Green | `/api/agents/ask/ghost7` | Primary onboarding agent, max-height: 160px bubble |
| NEXUS-IR | Blue | `/api/agents/ask/nexus` | Incident response |
| PHANTOM-0 | Purple | `/api/agents/ask/phantom` | Stealth ops |
| ANALYST-X | Cyan | `/api/agents/ask/analyst` | Data analysis |
| BROKER-9 | Gold | `/api/agents/ask/broker` | Economy/trading |
| RON | Pink #ff69b4 | `/api/agents/ask/ron` | RON Protocol (RonMemory model, glitch injector), top: 248px |

Agent prompts use actual usernames (never `[name]` placeholder).

---

## Bot Engine (`bot_engine.py`)

8 AI bots running as daemon thread (45s tick, 3 bots/tick):
- VENOM-X, GHOST-RIDER, CIPHER-9, ZERO-DAY, PHANTOM-SYS, DARK-PULSE, NET-WRAITH, BYTE-STORM

Bots interact with the economy and social feed. Table references:
- Users: `home_ip` column (NOT `ip`)
- Social: `posts` table (NOT `social_posts`)

---

## Mission System

### Grover's Algorithm Mission (Critical — Correct Solution)
```python
# 3-qubit circuit — q0/q1=data, q2=ancilla
qc = QuantumCircuit(3, 2)
qc.x(2)           # ancilla prep
qc.h(2)           # ancilla → |−⟩
# Oracle: phase kickback on |11⟩
qc.ccx(0, 1, 2)
# Diffuser on q0, q1
qc.h([0,1]); qc.x([0,1])
qc.cz(0, 1)
qc.x([0,1]); qc.h([0,1])
qc.measure([0, 1], [0, 1])
```
Validates: `stdout == '11'`. Awards 1000 XP + $10,000.
**The 2-qubit CZ-only version is REJECTED** with "WRONG: Check man grover."

---

## Frontend Architecture

### desktop.html
Main game UI. Loads terminal as iframe (`<iframe src="/terminal">`).

**Critical:** Session-sensitive API calls from terminal must use `postMessage` bridge (NOT direct fetch):
```javascript
// In terminal.html (iframe)
window.parent.postMessage({type: 'api_call', endpoint: '/api/bump/linux'}, '*');
// In desktop.html (parent)
window.addEventListener('message', handleTerminalMessage);
```

### Logout behavior
Hides: `iso-canvas`, `hud`, `agent-panel`, bubbles, `event-log`, `float-term`.

### GHOST-7 Onboarding Tour
8-step tour using localStorage key `gn10_tour_done`. ❓ button at `bottom: 130px, right: 236px`.

---

## Module Stubs (Required — Do Not Delete)

```python
# ghostnet_ctf_patch.py
def fn(app, **kwargs): pass

# ghostnet_scripting_engine.py  
def fn(app, **kwargs): pass
```

Pre-deletion check:
```bash
grep -n "from ghostnet\|import ghostnet" app.py
```

---

## Security (Audited Mar 30 2026)

- XSS: `sanitize()` applied to all user input + `addLog` patched
- Auth: JWT stored in `#fragment` (not cookie/localStorage)
- CORS: Locked to `ghost10.org`
- CSP headers: Set in `__init__.py` `after_request` (allowlist: cdnjs, soundcloud, cloudflareinsights)
- Rate limiting: `flask-limiter` installed in venv
- Tile bounds validated server-side
- All 7 audit items resolved

---

## Patching Rules

1. Always backup first: `cp app.py app.py.$(date +%Y%m%d_%H%M%S)`
2. Use Python EOF heredoc for patches
3. Compile check: `python3 -m py_compile app.py`
4. Target `templates/` files for frontend patches
5. Output format: `[OK]` / `[WARN]` / `[ERROR]`

---

## V10 Additional Context (ghost10.org)

- **Stack:** Flask / PostgreSQL / SocketIO
- **Server:** DigitalOcean SGP1 (159.65.142.97), systemd `ghostnet.service`
- **Venv:** `/root/ghostnet_v10/env/`
- **Isometric engine:** 20×20 grid, BASE_TW=80/BASE_TH=40
- **Faction war:** North/Central/South districts, 0v0 display bug pending fix
- **Academy:** ghost10.org/academy — 5 zones, port 5050, `ghostnet_academy` service

---

*Last updated: April 2026 | Maintained by Orlando Ritchie R. Natonton*
