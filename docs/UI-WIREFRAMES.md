# UI Wireframes & User Journey: CodeCompass

This document describes the screen flows, wireframes, and user experience for CodeCompass.

---

## 1. User Journey Flow

1. **Landing Page:** User enters CodeCompass. They see a clean hero interface with a GitHub URL input bar.
2. **Ingestion Trigger:** User enters a GitHub URL (e.g. `https://github.com/fastapi/fastapi`) and clicks **Analyze**.
3. **Loading Progress:** Real-time feedback shows processing progress:
   - `[1/3]` Fetching repository tree via GitHub API...
   - `[2/3]` Parsing AST-aware code chunks...
   - `[3/3]` Indexing vectors into ChromaDB...
4. **Dashboard Layout:**
   - **Left Panel:** Interactive, collapsible repository file tree component.
   - **Right Panel (Tabs):**
     - **Onboarding Brief:** Auto-generated repository architecture summary.
     - **Code Chat:** Q&A interface with source citations.

---

## 2. Screen Layout Wireframes

### Screen 1: Home & Connection Indicator
```text
+-------------------------------------------------------------+
| 🧭 CodeCompass                      Backend: Connected ✅  |
+-------------------------------------------------------------+
|                                                             |
|               Navigate Any Codebase, Instantly.             |
|                                                             |
|    [ https://github.com/owner/repository................ ]  |
|                       [ Analyze Repo ]                      |
|                                                             |
+-------------------------------------------------------------+
```

### Screen 2: Dashboard (File Explorer + Chat/Brief)
```text
+-------------------------------------------------------------+
| 🧭 CodeCompass | Repo: fastapi/fastapi             [ New ]  |
+----------------------+--------------------------------------+
| FILE EXPLORER        | [ Onboarding Brief ]  [ Code Chat ]  |
|                      |                                      |
| 📁 fastapi           | # FastAPI Overview                   |
|   📄 applications.py | FastAPI is a modern Python web...    |
|   📄 routing.py      |                                      |
|   📁 middleware      | ## Key Components                    |
|     📄 cors.py       | - Applications (`applications.py`)   |
| 📄 README.md         | - Router (`routing.py`)              |
| 📄 requirements.txt  |                                      |
+----------------------+--------------------------------------+
```

### Screen 3: Semantic Code Chat
```text
+----------------------+--------------------------------------+
| FILE EXPLORER        | [ Onboarding Brief ]  [ Code Chat ]  |
|                      |                                      |
| 📁 fastapi           | [User]: Where is CORS defined?       |
|   ...                |                                      |
|                      | [AI]: CORS middleware is configured   |
|                      | inside `fastapi/middleware/cors.py`  |
|                      | (Lines 15-42).                       |
|                      |                                      |
|                      | +----------------------------------+ |
|                      | | Ask a question about the code... | |
|                      | +----------------------------------+ |
+----------------------+--------------------------------------+
```
