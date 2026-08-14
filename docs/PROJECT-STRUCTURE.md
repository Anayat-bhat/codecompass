# Project Structure: CodeCompass

We are utilizing a monorepo approach where both the frontend and backend exist in the same repository. This simplifies version control and makes it easier to track full-stack features.

```text
codecompass/
├── docs/                   # Architectural blueprints, schemas, and API docs
│
├── frontend/               # React + Vite application
│   ├── public/             # Static assets (favicons, etc.)
│   ├── src/
│   │   ├── components/     # Reusable UI components (FileTree, ChatBox, LoadingState)
│   │   ├── hooks/          # Custom React hooks (e.g., useChatStream, useIngest)
│   │   ├── services/       # API call wrappers (axios/fetch logic)
│   │   ├── App.jsx         # Main layout and routing
│   │   └── main.jsx        # React DOM entry point
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── package.json        # Frontend dependencies
│
├── backend/                # FastAPI application
│   ├── app/
│   │   ├── api/            # Route handlers (routes/chat.py, routes/ingest.py)
│   │   ├── core/           # Configuration, security, and environment variables
│   │   ├── models/         # Pydantic schemas for request/response validation
│   │   ├── services/       # Core business logic
│   │   │   ├── github.py   # GitHub REST API interaction
│   │   │   ├── chunker.py  # Code parsing and chunking logic
│   │   │   ├── vector.py   # Pinecone database interactions
│   │   │   └── llm.py      # OpenAI prompt construction and generation
│   │   └── main.py         # FastAPI application factory and middleware setup
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Template for required environment variables
│
├── .gitignore              # Standard ignores (node_modules, venv, .env)
└── README.md               # Project overview and local setup instructions
```

## Rationale
- **Separation of Concerns:** The `backend/app/services` directory isolates business logic from the API routing layer (`api/`). This makes the code easier to test.
- **Scalability:** If we need to swap out Pinecone for Supabase later, we only need to touch `services/vector.py`.
- **Deployment:** Vercel can be configured to point its root directory to `frontend/`, while Render can point its root directory to `backend/`.
