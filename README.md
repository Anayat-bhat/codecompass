# CodeCompass 🧭

> Code-Aware RAG Intelligence & Interactive Repository Onboarding Assistant

CodeCompass is an AI-powered developer onboarding platform that ingests public GitHub repositories, performs AST code-aware chunking, generates vector embeddings for semantic code search, and generates contextual answers to codebase questions.

---

## 📅 10-Day Build Progress

- [x] **Day 1:** Idea Validation & Pitch Deck
- [x] **Day 2:** System Architecture & Tech Stack Selection
- [x] **Day 3:** Monorepo Setup & Frontend/Backend Health Check
- [x] **Day 4:** GitHub Repository Ingestion Service
- [x] **Day 5:** Code-Aware AST Chunking, Free Vector DB Integration & Early Deployment Setup
- [ ] **Day 6:** RAG Retrieval & Chat Backend
- [ ] **Day 7:** Interactive Frontend UI (Chat & File Tree)
- [ ] **Day 8:** Auto-Generated Repository Onboarding Brief
- [ ] **Day 9:** End-to-End Refinement & Response Streaming
- [ ] **Day 10:** Production QA & Pitch Demo

---

## 🚀 Day 5 Highlights

1. **AST Code-Aware Chunking:**
   - Intelligent language-specific code splitting for Python, JavaScript, TypeScript, HTML, CSS, and Markdown using LangChain text splitters.
   - Attaches metadata (file path, repo, language, chunk index) to preserve structural context.

2. **Vector DB & Free Embeddings:**
   - 100% free vector indexing powered by ChromaDB with built-in ONNX embeddings (`all-MiniLM-L6-v2`).
   - Supports `/api/ingest` for full repo processing and `/api/search` for semantic code retrieval.
   - Zero-cost architecture requiring no paid API keys.

3. **Early Deployment Preparedness:**
   - Configured `Procfile` and `render.yaml` for free backend deployment on Render.
   - Configured `vercel.json` for free frontend SPA hosting on Vercel.

---

## 🛠 Project Structure

```text
codecompass/
├── backend/
│   ├── main.py                  # FastAPI Application & REST Endpoints
│   ├── Procfile                 # Production Process definition
│   ├── render.yaml              # Render Cloud Deployment Spec
│   ├── requirements.txt         # Python Dependencies
│   ├── test_chunker.py          # Chunker Unit Test Script
│   ├── test_vector_db.py        # Vector DB Unit Test Script
│   ├── services/
│   │   ├── github_service.py    # GitHub REST Ingestion Service
│   │   ├── chunker.py           # AST Code Splitter Engine
│   │   └── vector_db.py         # Chroma Vector DB & Search Service
│   └── chroma_db/               # Persistent Vector Storage
└── frontend/
    ├── index.html
    ├── vercel.json              # Vercel SPA Routing Configuration
    ├── package.json
    └── src/
        ├── App.jsx              # React Interface Component
        └── index.css            # Styling Setup
```

---

## 🧪 Quick Start (Local Development)

### Backend:
```bash
cd codecompass/backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend:
```bash
cd codecompass/frontend
npm install
npm run dev
```
