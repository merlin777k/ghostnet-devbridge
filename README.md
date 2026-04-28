# 🕵️ GhostNet DevBridge
### IBM Bob Hackathon 2026 — *Your Repo. Your Rules. AI as Your Dev Partner.*

> **GhostNet DevBridge** uses IBM Bob as an AI-powered development partner for [GhostNet](https://ghost-net.org) — a live, deployed, gamified cybersecurity education platform. Bob understands the full GhostNet codebase, generates documentation, answers developer questions in context, and auto-generates new mission content.

---

## 🚀 The Problem

GhostNet is a complex, multi-service cybersecurity training platform built and maintained by a **single developer**. It runs across two production servers, serves real students, and has grown organically over 3+ years into a system with:

- 40+ terminal commands with custom logic
- Faction war systems, XP economy, BTC conversion, PvP mechanics
- 5 AI agents powered by Ollama (GHOST-7, NEXUS-IR, PHANTOM-0, ANALYST-X, BROKER-9, RON)
- Quantum computing missions using real Qiskit circuits
- An isometric city engine with real-time player activity

**The challenge:** Onboarding a new contributor or even remembering the full codebase structure after a week away is painful. There's no documentation, no test coverage guide, and no AI-aware context layer.

---

## 💡 The Solution: GhostNet DevBridge

GhostNet DevBridge integrates **IBM Bob** directly into the GhostNet development workflow, enabling:

### 🗺️ Feature 1 — Codebase Navigator
Ask Bob anything about the GhostNet codebase in natural language:
- *"Where is the XP award logic?"*
- *"How does the faction war system work?"*
- *"What commands are available in the Linux terminal?"*

Bob reads the full repository context and answers with precision — no more grepping through 5,000 lines of Flask code.

### 📄 Feature 2 — Auto-Doc Generator
Feed Bob any route, module, or function and get structured Markdown documentation instantly. Outputs:
- Route descriptions with parameters and return values
- Module-level summaries
- `CODEBASE.md` updates automatically

### 🎮 Feature 3 — Mission Content Generator
Bob understands the GhostNet mission schema and generates:
- New CTF mission content (description, hints, objectives)
- Solution validator logic
- MITRE ATT&CK mappings for each mission
- Ready-to-insert SQL seed data

---

## 🏗️ Architecture

```
ghostnet-devbridge/
├── app.py                          # Main Flask application
├── bot_engine.py                   # AI bot daemon (8 bots, 45s tick)
├── ghostnet_ctf_patch.py           # CTF mission module
├── ghostnet_scripting_engine.py    # Scripting engine module
├── requirements.txt
├── README.md                       # This file
├── CODEBASE.md                     # Full codebase map for IBM Bob
├── templates/
│   ├── desktop.html                # Main game UI
│   ├── terminal.html               # Hacker terminal (iframe)
│   └── admin/                      # SOC-style admin dashboard
└── static/
    ├── js/
    └── css/
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python / Flask |
| Database | SQLite (V4/V5) / PostgreSQL (V10) |
| AI Agents | Ollama (llama3.2, custom models) |
| Quantum | Qiskit |
| Maps | Leaflet.js + CartoDB Dark Matter |
| Frontend | Vanilla JS, Socket.IO |
| Server | DigitalOcean, nginx, systemd |

---

## 🎯 IBM Bob Integration

IBM Bob was used throughout this project to:

1. **Understand the codebase** — Bob was given the full repository and used to answer architectural questions, trace logic flows, and identify dependencies across modules.
2. **Generate documentation** — `CODEBASE.md` was generated and maintained with Bob's assistance, providing a living map of the platform.
3. **Create mission content** — New CTF missions were scaffolded by Bob using context from existing missions in the codebase.
4. **Debug cross-module issues** — Bob helped trace session handling bugs across the iframe terminal / desktop.html postMessage bridge.

---

## 🌐 Live Demo

- **GhostNet V4/V5:** https://ghost-net.org
- **GhostNet V10 (Isometric):** https://ghost10.org
- **GhostNet Academy:** https://ghost10.org/academy

---

## 👤 Developer

**Engr. Orlando Ritchie R. Natonton, IE, ME, LPT**
Faculty — Father Saturnino Urios University (FSUU)
Honorary Member — Quantum Computing Society of the Philippines (QCSP)
IPOPHL Copyright Registered — GhostNet V5 & V10

GitHub: [@merlin777k](https://github.com/merlin777k)
Platform: [ghost-net.org](https://ghost-net.org)

---

## 📄 License

MIT License — © 2026 Orlando Ritchie R. Natonton
