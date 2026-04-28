# 🕵️ GhostNet DevBridge
### IBM Bob Hackathon 2026 — *Your Repo. Your Rules. AI as Your Dev Partner.*

> **GhostNet DevBridge** uses IBM Bob as an AI-powered development partner for **GhostNet V2** — an early open-source version of a gamified cybersecurity education platform. This repository serves as the demonstration codebase for the hackathon, showcasing how IBM Bob can accelerate solo developer workflows on complex Flask projects.

---

## 🚀 The Problem

GhostNet is a cybersecurity training platform built and maintained by a **single developer**. Even at its V2 stage, the codebase includes:

- Multiple terminal commands with custom routing logic
- XP economy and player progression systems
- Session-based authentication and admin dashboards
- Multi-template Flask architecture with dynamic game state

**The challenge:** Onboarding a new contributor — or even returning to your own code after a week — is painful without proper documentation, context maps, or an AI-aware layer that understands the full codebase.

---

## 💡 The Solution: GhostNet DevBridge

GhostNet DevBridge integrates **IBM Bob** directly into the GhostNet V2 development workflow, enabling:

### 🗺️ Feature 1 — Codebase Navigator
Ask Bob anything about the GhostNet V2 codebase in natural language:
- *"Where is the XP award logic?"*
- *"How does session authentication work?"*
- *"What routes are available in app.py?"*

Bob reads the full repository context and answers with precision — no more grepping through thousands of lines of Flask code.

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
├── app.py                          # Main Flask application (V2 demo)
├── requirements.txt
├── README.md                       # This file
├── CODEBASE.md                     # Full codebase map for IBM Bob
├── templates/
│   ├── index.html                  # Landing / login
│   ├── terminal.html               # Hacker terminal
│   ├── leaderboard.html            # Player rankings
│   ├── admin.html                  # Admin dashboard
│   ├── admin_login.html            # Admin auth
│   ├── intro.html                  # Onboarding intro
│   └── vip.html                    # VIP tier page
└── static/
    ├── js/
    │   ├── terminal.js
    │   ├── city.js
    │   └── intro.js
    └── css/
        └── ghost.css
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python / Flask |
| Database | SQLite |
| Frontend | Vanilla JS |
| Server | DigitalOcean / nginx / systemd |

---

## 🎯 IBM Bob Integration

IBM Bob was used throughout this project to:

1. **Understand the codebase** — Bob was given the full V2 repository and used to answer architectural questions, trace logic flows, and identify dependencies across modules.
2. **Generate documentation** — `CODEBASE.md` was generated and maintained with Bob's assistance, providing a living map of the platform.
3. **Create mission content** — New CTF missions were scaffolded by Bob using context from existing missions in the codebase.
4. **Debug cross-module issues** — Bob helped trace session handling bugs and template rendering logic across the Flask app.

---

## ⚠️ Note on Versioning

This repository contains **GhostNet V2**, an early open-source demo version of the platform released specifically for this hackathon showcase. It is not the current production version. The platform has evolved significantly since V2 and continues to be actively developed.

---

## 👤 Developer

**Engr. Orlando Ritchie R. Natonton, IE, ME, LPT**
Faculty — Father Saturnino Urios University (FSUU)
CEO/Founder — M73 vLabs

GitHub: [@merlin777k](https://github.com/merlin777k)

---

## 📄 License

MIT License — © 2026 Orlando Ritchie R. Natonton
