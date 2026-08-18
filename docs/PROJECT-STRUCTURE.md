# Project Structure: CodeCompass

CodeCompass is organized as a monorepo containing the `frontend` (React + Vite) and `backend` (FastAPI) applications.

---

```text
codecompass/
├── docs/                        # Complete architecture & API documentation suite
│   ├── API.md                   # REST API specifications (/health, /api/ingest, /api/search, /api/chat)
│   ├── ARCHITECTURE.md          # System design & RAG data flow diagrams
│   ├── ENVIRONMENT.md           # Environment variable configurations
│   ├── PROJECT-STRUCTURE.md     # Workspace layout & directory specifications
│   ├── SCHEMA.md                # Vector store schemas & payload definitions
│   ├── SETUP.md                 # Local setup & developer guides
│   └── UI-WIREFRAMES.md         # Dashboard layouts & component flows
│
├── frontend/                    # Vite + React + Tailwind CSS web application
│   ├── index.html               # Main HTML template
│   ├── vercel.json              # Vercel deployment SPA rewrite configuration
│   ├── package.json             # NPM dependencies & scripts (lucide-react, react, vite)
│   └── src/
│       ├── App.css              # Custom styling
│       ├── App.jsx              # Core application UI component & challenge footer
│       ├── index.css            # Tailwind directives
│       ├── main.jsx             # React DOM entry point
│       └── components/
│           ├── FileTree.jsx     # Collapsible directory tree component
│           ├── Chat.jsx         # RAG intelligence chat component with citation cards
│           └── OnboardingBrief.jsx # Auto-generated repository onboarding brief component
│
├── backend/                     # Python FastAPI service
│   ├── main.py                  # FastAPI application entry point, endpoints & CORS configuration
│   ├── Procfile                 # Process runner for cloud web hosting
│   ├── render.yaml              # Render cloud infrastructure specification
│   ├── requirements.txt         # Python package dependencies
│   ├── test_chunker.py          # Chunker unit test suite
│   ├── test_vector_db.py        # Vector database unit test suite
│   ├── test_chat.py             # RAG retrieval & /api/chat unit test suite
│   ├── test_onboard.py          # Onboarding brief API endpoint test suite
│   ├── services/
│   │   ├── github_service.py    # GitHub REST API file fetching & filtering
│   │   ├── chunker.py           # AST-aware code splitting engine
│   │   ├── vector_db.py         # ChromaDB vector store & search service
│   │   ├── rag_service.py       # RAG retrieval & AI answer synthesis engine
│   │   └── onboarding_service.py # Repository onboarding brief synthesis engine
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
4. **`backend/services/rag_service.py`:** Performs RAG retrieval from ChromaDB and synthesizes code-grounded explanations with file citations.
5. **`backend/services/onboarding_service.py`:** Generates structured repository onboarding briefs with tech stack analysis and key entry points.
6. **`backend/main.py`:** Exposes CORS-enabled FastAPI endpoints for `/health`, `/api/ingest`, `/api/search`, `/api/chat`, and `/api/onboard`.
7. **`frontend/src/components/FileTree.jsx`:** Collapsible directory tree component displaying parsed repository files.
8. **`frontend/src/components/Chat.jsx`:** Interactive chat window displaying RAG responses and expandable source citations.
9. **`frontend/src/components/OnboardingBrief.jsx`:** Tabbed interface rendering auto-generated repository onboarding documentation and suggested prompt triggers.

8. **`frontend/src/App.jsx`:** React interface combining header, ingestion form, file tree, chat, and mandatory challenge footer.
