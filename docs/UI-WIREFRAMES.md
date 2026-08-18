# UI Wireframes & Component Design: CodeCompass

This document details the user journey, layout wireframes, screen states, and component flows for **CodeCompass**.

---

## 1. Core User Journey

1. **Initial Access & Health Check:** User opens CodeCompass. Top header automatically polls `GET /health` and displays live backend status (`Backend Connected`).
2. **Repository Ingestion:** User inputs a public GitHub URL (e.g. `https://github.com/fastapi/fastapi`) or hits `Ctrl+K`. Clicking **Ingest & Index** parses source files into AST chunks and indexes them in ChromaDB.
3. **Repository Exploration:**
   - **Left Panel:** Interactive, collapsible file tree with instantaneous file filtering and extension badges.
   - **Right Panel (Main View Switcher):**
     - **🧭 Chat Intelligence:** RAG code QA chat with expandable code citation cards and one-click snippet copying.
     - **📄 Onboarding Brief:** Auto-generated repository documentation, language breakdown progress bars, primary entry point listings, and clickable prompt suggestions.
4. **Challenge Branding:** Persistent bottom footer displaying *"Built with Claude as part of the AB Talks 60-Day Claude AI Challenge."*

---

## 2. Screen Layout Wireframes

### Screen 1: Header Navigation & Ingestion Section
```text
+-----------------------------------------------------------------------------------------+
| 🧭 CodeCompass v1.0 Day 7    [ Chat Intelligence ]  [ Onboarding Brief ]  ● Backend Connected |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|  [ 🐙 https://github.com/fastapi/fastapi                            ⌘ K ] [ Ingest ] [ Brief ] |
|                                                                                         |
|  [ Repo: fastapi/fastapi ]  [ Parsed: 45 files ]  [ Chunks: 120 ]  [ Vector: ChromaDB Ready ] |
+-----------------------------------------------------------------------------------------+
```

### Screen 2: Dashboard Grid (File Tree + RAG Intelligence Chat)
```text
+------------------------------------+----------------------------------------------------+
| 📁 FILE EXPLORER                   | 💬 CHAT INTELLIGENCE                [ RAG Active ] |
+------------------------------------+----------------------------------------------------+
| [ 🔍 Filter files... (e.g. py)   ] | 🤖 Welcome to CodeCompass! Ingest a repo or ask    |
|                                    |    questions about the codebase structure.         |
| 📂 fastapi                         |                                                    |
|   📄 __init__.py         [PY]      | 👤 [User]: Where is CORS middleware configured?    |
|   📄 applications.py     [PY]      |                                                    |
|   📄 routing.py          [PY]      | 🤖 [AI]: CORS middleware is configured in          |
|   📂 middleware                    |    `fastapi/middleware/cors.py`.                   |
|     📄 cors.py           [PY]      |    +---------------------------------------------+ |
|   📂 security                      |    | 📄 fastapi/middleware/cors.py (Chunk #0)   | |
|     📄 oauth2.py         [PY]      |    | class CORSMiddleware(BaseHTTPMiddleware):.. | |
| 📄 pyproject.toml        [TOML]    |    +---------------------------------------------+ |
| 📄 README.md             [MD]      |                                                    |
|                                    | [ Ask a question about this repository...   ] [Send]|
+------------------------------------+----------------------------------------------------+
```

### Screen 3: Auto-Generated Repository Onboarding Brief Tab
```text
+------------------------------------+----------------------------------------------------+
| 📁 FILE EXPLORER                   | 📄 REPOSITORY ONBOARDING BRIEF  [ Copy ] [ Download]|
+------------------------------------+----------------------------------------------------+
| 📂 fastapi                         | [ Document ]  [ Tech Stack & Entry ]  [ Questions ]|
|   📄 applications.py               |                                                    |
|   ...                              | # 🧭 Repository Onboarding Brief: fastapi/fastapi  |
|                                    |                                                    |
|                                    | ## 📊 Tech Stack Breakdown                         |
|                                    | Python   [====================================] 93%|
|                                    | Markdown [==] 4.4%                                 |
|                                    |                                                    |
|                                    | ## 🚀 Key Entry Points                             |
|                                    | 📄 fastapi/applications.py                         |
|                                    | 📄 fastapi/routing.py                              |
|                                    |                                                    |
|                                    | ## 💡 Suggested Exploration Queries                |
|                                    | ➔ What is the main entry point and execution flow? |
|                                    | ➔ How are environment variables managed?           |
+------------------------------------+----------------------------------------------------+
| Built with Claude as part of the AB Talks 60-Day Claude AI Challenge.                   |
+-----------------------------------------------------------------------------------------+
```
