# CodeCompass 🧭

> Code-Aware RAG Intelligence & Interactive Repository Onboarding Assistant

CodeCompass is an AI-powered developer onboarding platform that ingests public GitHub repositories, performs AST code-aware chunking, generates vector embeddings for semantic code search, and provides contextual answers to codebase questions with exact file citations.

---

## 📅 10-Day Build Progress

- [x] **Day 1:** Idea Validation & Pitch Deck
- [x] **Day 2:** System Architecture & Tech Stack Selection
- [x] **Day 3:** Monorepo Setup & Frontend/Backend Health Check (`/health`)
- [x] **Day 4:** GitHub Repository Ingestion Service (`POST /api/ingest`)
- [x] **Day 5:** Code-Aware AST Chunking, Free ChromaDB Vector Integration & Early Deployment Setup
- [x] **Day 6:** RAG Retrieval & Chat Backend (`POST /api/chat`) & Complete Working MVP
- [ ] **Day 7:** Interactive Frontend UI (Chat & File Tree Component)
- [ ] **Day 8:** Auto-Generated Repository Onboarding Brief
- [ ] **Day 9:** End-to-End Refinement & Response Streaming
- [ ] **Day 10:** Production QA & Pitch Demo

---

## 🚀 Key Features Built (Day 1 - Day 6)

1. **GitHub Ingestion Engine (`services/github_service.py`):**
   - Parses public repository URLs, fetches file trees recursively, and filters for relevant source files (`.py`, `.js`, `.ts`, `.jsx`, `.tsx`, `.html`, `.css`, `.json`, `.md`).
   - Ignores binary files, lockfiles, and `node_modules` / `venv` directories.

2. **AST Code-Aware Chunking Engine (`services/chunker.py`):**
   - Uses LangChain AST splitters for Python, JavaScript, TypeScript, HTML, CSS, and Markdown to preserve function, class, and logic boundaries.
   - Enriches each chunk with metadata (`file_path`, `language`, `repo`, `chunk_index`, `total_chunks`, `char_length`).

3. **Persistent Vector Store & Free Local Embeddings (`services/vector_db.py`):**
   - Persistent **ChromaDB** vector database instance (`backend/chroma_db`).
   - 100% free vector embedding execution via local ONNX model (`all-MiniLM-L6-v2`), with zero required API keys.
   - Supports `/api/ingest` for batch indexing and `/api/search` for semantic similarity retrieval.

4. **RAG Retrieval & Intelligence Chat Backend (`services/rag_service.py` & `POST /api/chat`):**
   - Queries ChromaDB for top matching code chunks.
   - Synthesizes code-grounded answers citing exact file paths.
   - Supports OpenAI, Google Gemini API, or zero-cost local fallback synthesis.

5. **Interactive Frontend MVP & Challenge Footer (`frontend/src/`):**
   - Full dark-mode UI built with React + Tailwind CSS + Lucide Icons.
   - Collapsible **FileTree** component and **Chat** component with source citation cards.
   - Footer: *"Built with Claude as part of the AB Talks 60-Day Claude AI Challenge."*

4. **Production Cloud Deployment Specs:**
   - Pre-configured `Procfile` & `render.yaml` for free backend deployment on **Render**.
   - Pre-configured `vercel.json` for single-page app deployment on **Vercel**.

---

## 🛠 Project Structure

```text
codecompass/
├── docs/                        # Complete technical documentation suite
│   ├── API.md                   # REST API specifications
│   ├── ARCHITECTURE.md          # System architecture and data flow
│   ├── ENVIRONMENT.md           # Configuration & environment variables
│   ├── PROJECT-STRUCTURE.md     # Directory layout & file organization
│   ├── SCHEMA.md                # Vector database & payload schemas
│   ├── SETUP.md                 # Local setup & step-by-step developer guide
│   └── UI-WIREFRAMES.md         # Component layouts & screen flows
├── backend/                     # FastAPI backend service
│   ├── main.py                  # API endpoints (/health, /api/ingest, /api/search)
│   ├── Procfile                 # Production process runner definition
│   ├── render.yaml              # Render deployment configuration
│   ├── requirements.txt         # Python dependencies
│   ├── test_chunker.py          # Chunker test suite
│   ├── test_vector_db.py        # Vector database test suite
│   ├── services/
│   │   ├── github_service.py    # GitHub REST API fetcher
│   │   ├── chunker.py           # AST code splitter
│   │   └── vector_db.py         # ChromaDB storage & search service
│   └── chroma_db/               # Local persistent vector database
└── frontend/                    # Vite + React + Tailwind CSS frontend
    ├── index.html               # Entry HTML
    ├── vercel.json              # Vercel deployment rewrite rules
    ├── package.json             # Frontend dependencies
    └── src/
        ├── App.jsx              # React interface component
        ├── main.jsx             # React DOM root render
        └── index.css            # Tailwind styling setup
```

---

## 🧪 Quick Start Guide

### 1. Start Backend Server:
```powershell
cd codecompass/backend
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
- Server endpoint: `http://localhost:8000`
- Interactive API Docs: `http://localhost:8000/docs`

### 2. Start Frontend App:
```powershell
cd codecompass/frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 🌐 Deploy to Cloud (Free Tier)

- **Backend (Render):** Deploy using `backend/render.yaml` or connect your repo to Render Web Service pointing to root directory `backend`.
- **Frontend (Vercel):** Import repository in Vercel, set root directory to `frontend`, and click **Deploy**.
