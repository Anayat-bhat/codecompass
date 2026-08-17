# API Specifications: CodeCompass

This document details the REST API endpoints exposed by the FastAPI backend server (`http://localhost:8000`).

---

## 1. Health Check
**Purpose:** Verify backend server status and CORS configuration.
- **Endpoint:** `GET /health`
- **Request Parameters:** None
- **Response (200 OK):**
  ```json
  {
    "status": "ok",
    "message": "CodeCompass API is operational"
  }
  ```

---

## 2. Ingest Repository
**Purpose:** Ingests a public GitHub repository, fetches target source code files, splits code into AST-aware chunks, and indexes embeddings in ChromaDB.
- **Endpoint:** `POST /api/ingest`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "repo_url": "https://github.com/fastapi/fastapi"
  }
  ```
- **Validation Rules:**
  - `repo_url` must be a valid public GitHub URL.
  - Limits file fetching to target source extensions (`.py`, `.js`, `.ts`, `.jsx`, `.tsx`, `.html`, `.css`, `.json`, `.md`).
  - Automatically filters out binary files, lockfiles, `.git`, `node_modules`, and `venv`.
- **Response (200 OK):**
  ```json
  {
    "status": "success",
    "repo_url": "https://github.com/fastapi/fastapi",
    "owner": "fastapi",
    "repo": "fastapi",
    "file_count": 45,
    "chunk_count": 120,
    "files": [
      { "path": "fastapi/applications.py", "language": "python" },
      { "path": "fastapi/routing.py", "language": "python" }
    ],
    "vector_db": {
      "status": "success",
      "count": 120,
      "collection": "codecompass_chunks",
      "message": "Successfully indexed 120 chunks into vector database."
    }
  }
  ```

---

## 3. Semantic Vector Search
**Purpose:** Performs semantic vector search against indexed code chunks using cosine distance matching.
- **Endpoint:** `POST /api/search`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "query": "Where is CORS middleware configured?",
    "top_k": 5
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "status": "success",
    "query": "Where is CORS middleware configured?",
    "count": 5,
    "results": [
      {
        "content": "app.add_middleware(CORSMiddleware, allow_origins=['*'])",
        "metadata": {
          "file_path": "backend/main.py",
          "language": "python",
          "repo": "owner/repo",
          "chunk_index": 0,
          "total_chunks": 3,
          "char_length": 145
        },
        "score": 0.1852
      }
    ]
  }
  ```

---

## 4. RAG Chat Endpoint
**Purpose:** Handles natural language codebase questions by retrieving top matching code chunks from ChromaDB and returning code-grounded explanations with source citations.
- **Endpoint:** `POST /api/chat`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "query": "Where is the authentication logic implemented?",
    "top_k": 5,
    "repo_url": "https://github.com/fastapi/fastapi"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "status": "success",
    "query": "Where is the authentication logic implemented?",
    "answer": "Based on semantic code search in the ingested repository, authentication logic is implemented in `fastapi/security/oauth2.py`...",
    "sources": [
      {
        "file_path": "fastapi/security/oauth2.py",
        "language": "python",
        "chunk_index": 0,
        "snippet": "class OAuth2PasswordBearer(SecurityBase):\n    def __init__(self, tokenUrl: str)..."
      }
    ],
    "chunks_retrieved": 5
  }
  ```

