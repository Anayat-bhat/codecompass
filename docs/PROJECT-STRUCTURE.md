# Project Structure: CodeCompass

CodeCompass is organized as a monorepo containing the `frontend` (React + Vite) and `backend` (FastAPI) applications.

---

```text
codecompass/
├── docs/                        # Complete architecture & API documentation suite
│   ├── API.md                   # REST API specifications (/health, /api/ingest, /api/search)
│   ├── ARCHITECTURE.md          # System design & data flow diagrams
│   ├── ENVIRONMENT.md           # Environment variable configurations
│   ├── PROJECT-STRUCTURE.md     # Workspace layout & directory specifications
│   ├── SCHEMA.md                # Vector store schemas & payload definitions
│   ├── SETUP.md                 # Local setup & developer guides
│   └── UI-WIREFRAMES.md         # Dashboard layouts & component flows
│
├── frontend/                    # Vite + React + Tailwind CSS web application
│   ├── index.html               # Main HTML template
│   ├── vercel.json              # Vercel deployment SPA rewrite configuration
│   ├── package.json             # NPM dependencies & scripts
│   └── src/
│       ├── App.css              # Custom styling
│       ├── App.jsx              # Core application UI component
│       ├── index.css            # Tailwind directives
│       └── main.jsx             # React DOM entry point
│
├── backend/                     # Python FastAPI service
│   ├── main.py                  # FastAPI application entry point & CORS configuration
│   ├── Procfile                 # Process runner for cloud web hosting
│   ├── render.yaml              # Render cloud infrastructure specification
│   ├── requirements.txt         # Python package dependencies
│   ├── test_chunker.py          # Chunker unit test suite
│   ├── test_vector_db.py        # Vector database unit test suite
│   ├── services/
│   │   ├── github_service.py    # GitHub REST API file fetching & filtering
│   │   ├── chunker.py           # AST-aware code splitting engine
│   │   └── vector_db.py         # ChromaDB vector store & search service
│   └── chroma_db/               # Local persistent Chroma vector database
│
├── .gitignore                   # Workspace git ignore patterns
└── README.md                    # Root project overview & 10-day roadmap
```

---

## Component Responsibilities

1. **`backend/services/github_service.py`:** Handles GitHub URL parsing, recursive tree fetching, and target source file filtering.
2. **`backend/services/chunker.py`:** Parses source code into AST-aware chunks with structural metadata using LangChain splitters.
3. **`backend/services/vector_db.py`:** Manages persistent ChromaDB vector storage and semantic search operations.
4. **`backend/main.py`:** Exposes CORS-enabled FastAPI endpoints for `/health`, `/api/ingest`, and `/api/search`.
5. **`frontend/src/App.jsx`:** React interface displaying backend connection status and repository tools.
