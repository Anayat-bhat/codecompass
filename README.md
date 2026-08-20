# CodeCompass 🧭

> **Code-Aware RAG Intelligence & Interactive Repository Onboarding Assistant**

[![Version](https://img.shields.io/badge/version-1.0.0-indigo.svg)](https://github.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/frontend-React_19-61DAFB.svg)](https://react.dev/)
[![ChromaDB](https://img.shields.io/badge/vector_db-ChromaDB-orange.svg)](https://www.trychroma.com/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

CodeCompass is an open-source, AI-powered developer onboarding platform that ingests public GitHub repositories, performs AST code-aware chunking, generates vector embeddings for semantic code search, and provides contextual, streaming answers to codebase questions with exact file citations.

---

## 🌟 Live Application & Repository Links

- **🌐 Live Web Application:** [https://codecompass.vercel.app](https://codecompass.vercel.app) *(Replace with your deployed Vercel URL)*
- **📦 GitHub Repository:** [https://github.com/your-username/codecompass](https://github.com/your-username/codecompass) *(Replace with your GitHub repository URL)*

---

## 📅 10-Day Build Progress (Sprint Workbook Checklist)

- [x] **Day 1:** Idea Validation & Pitch Deck
- [x] **Day 2:** System Architecture & Tech Stack Selection
- [x] **Day 3:** Monorepo Setup & Frontend/Backend Health Check (`/health`)
- [x] **Day 4:** GitHub Repository Ingestion Service (`POST /api/ingest`)
- [x] **Day 5:** Code-Aware AST Chunking, Free ChromaDB Vector Integration & Early Deployment Setup
- [x] **Day 6:** RAG Retrieval & Chat Backend (`POST /api/chat`) & Complete Working MVP
- [x] **Day 7:** Auto-Generated Repository Onboarding Brief & Senior UI/UX Refinement
- [x] **Day 8:** Production QA, Security Headers, Performance Tuning & SSE Response Streaming (`POST /api/chat/stream`)
- [x] **Day 9:** Launch & Production Readiness Review (SEO, Favicon, Error Boundaries, Licensing & Release Audit)
- [ ] **Day 10:** Pitch Demo & Final Showcase

---

## 🚀 Key Features

1. **⚡ Real-Time SSE Token Response Streaming (`POST /api/chat/stream`):**
   - Characters stream word-by-word into the UI with low-latency Server-Sent Events (<100ms perceived delay).
2. **🧠 AST Code-Aware Chunking Engine (`services/chunker.py`):**
   - Preserves function, class, and logic block integrity using LangChain splitters for Python, JavaScript, TypeScript, HTML, CSS, and Markdown.
3. **🔍 Persistent Vector Store & Free Local Embeddings (`services/vector_db.py`):**
   - Embedded local **ChromaDB** with `all-MiniLM-L6-v2` embeddings—100% free and zero API key dependency for retrieval.
4. **📋 Auto-Generated Onboarding Brief (`services/brief_service.py`):**
   - Automatically analyzes project structure, file types, entry points, and README to construct an interactive architecture summary and exploration prompts.
5. **🛡️ Enterprise Security & Error Resilience:**
   - FastAPI HTTP security headers middleware (`nosniff`, `DENY`, `XSS protection`), regex URL validation, and React `ErrorBoundary`.

---

## 🛠 Tech Stack Architecture

```text
[ React 19 Client (Vite + Tailwind) ]
                │
                │ SSE Streaming / REST API
                ▼
[ FastAPI Backend (Python 3.11) ]
     ├── Security Headers & Sanitization
     ├── GitHub Service (REST API Fetcher)
     ├── AST Chunker (LangChain Splitters)
     ├── ChromaDB Vector Store (Local MiniLM Embeddings)
     └── RAG Streaming Engine (OpenAI / Gemini / Local Fallback)
```

---

## 📂 Project Directory Structure

```text
codecompass/
├── LICENSE                      # MIT Open Source License
├── DAY8-SUMMARY.md              # Day 8 Release Readiness Summary
├── DAY9-SUMMARY.md              # Day 9 Launch & Production Summary
├── README.md                    # Production release documentation
├── docs/                        # Complete technical documentation suite
│   ├── API.md                   # REST API specifications
│   ├── ARCHITECTURE.md          # System architecture and data flow
│   ├── ENVIRONMENT.md           # Configuration & environment variables
│   ├── PROJECT-STRUCTURE.md     # Directory layout & file organization
│   ├── SCHEMA.md                # Vector database & payload schemas
│   ├── SETUP.md                 # Local setup & step-by-step developer guide
│   └── UI-WIREFRAMES.md         # Component layouts & screen flows
├── backend/                     # FastAPI backend service
│   ├── main.py                  # API endpoints (/health, /api/ingest, /api/chat/stream)
│   ├── test_qa_suite.py         # Automated QA test suite (6/6 pass)
│   ├── Procfile                 # Production process runner definition
│   ├── render.yaml              # Render deployment configuration
│   ├── requirements.txt         # Python dependencies
│   ├── services/
│   │   ├── github_service.py    # GitHub REST API fetcher
│   │   ├── chunker.py           # AST code splitter
│   │   ├── vector_db.py         # ChromaDB storage & search service
│   │   └── rag_service.py       # RAG generation & SSE streaming engine
│   └── chroma_db/               # Local persistent vector database
└── frontend/                    # Vite + React + Tailwind CSS frontend
    ├── index.html               # Production SEO entry point with meta & font tags
    ├── vercel.json              # Vercel deployment rewrite rules
    ├── package.json             # Frontend dependencies & metadata
    └── src/
        ├── App.jsx              # Main React layout & app container
        ├── main.jsx             # React DOM root render with ErrorBoundary wrapper
        ├── index.css            # Tailwind CSS design system
        └── components/
            ├── Chat.jsx         # Real-time SSE streaming chat UI with citation badges
            ├── FileTree.jsx     # Recursive repository file tree explorer
            ├── OnboardingBrief.jsx # Automated markdown repository onboarding brief
            └── ErrorBoundary.jsx   # React global error fallback screen
```

---

## 🧪 Quick Start Guide (Local Setup)

### 1. Prerequisites
- Python 3.10+ installed
- Node.js 18+ installed

### 2. Backend Setup:
```powershell
cd codecompass/backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

### 3. Frontend Setup:
```powershell
cd codecompass/frontend
npm install
npm run dev
```
- Access app in browser: `http://localhost:5173`

---

## 🌐 Production Cloud Deployment Guide

### Deploy Backend (Render / Railway):
1. Connect your GitHub repository to **Render**.
2. Create a **Web Service**, set Root Directory to `backend`.
3. Set Build Command: `pip install -r requirements.txt`
4. Set Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Configure Environment Variables (`OPENAI_API_KEY` or `GEMINI_API_KEY` optional).

### Deploy Frontend (Vercel):
1. Import repository in **Vercel**.
2. Set Root Directory to `frontend`.
3. Add Environment Variable: `VITE_API_URL = https://your-backend.onrender.com`
4. Click **Deploy**.

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details. Built as part of the **AB Talks 60-Day AI Challenge**.
