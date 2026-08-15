# API Design: CodeCompass

This document outlines the REST API endpoints provided by the FastAPI backend.

---

## 1. Health Check
**Purpose:** Verify the backend is running and accessible.
- **Endpoint:** `GET /health`
- **Request:** None
- **Response (200 OK):**
  ```json
  {
    "status": "ok",
    "message": "CodeCompass API is operational"
  }
  ```

---

## 2. Ingest Repository
**Purpose:** Fetch a public GitHub repository, perform code-aware AST chunking, and index vectors in Chroma DB.
- **Endpoint:** `POST /api/ingest`
- **Request Body:**
  ```json
  {
    "repo_url": "https://github.com/octocat/Spoon-Knife"
  }
  ```
- **Validation:** 
  - `repo_url` must be a valid public GitHub URL.
  - Limits fetching to supported source file extensions (`.py`, `.js`, `.ts`, `.jsx`, `.tsx`, `.html`, `.css`, `.json`, `.md`).
  - Ignores binary files, lockfiles, and `node_modules` / `venv` directories.
- **Response (200 OK):**
  ```json
  {
    "status": "success",
    "repo_url": "https://github.com/octocat/Spoon-Knife",
    "owner": "octocat",
    "repo": "Spoon-Knife",
    "file_count": 3,
    "chunk_count": 3,
    "files": [
      { "path": "README.md", "language": "markdown" },
      { "path": "index.html", "language": "html" },
      { "path": "styles.css", "language": "css" }
    ],
    "vector_db": {
      "status": "success",
      "count": 3,
      "collection": "codecompass_chunks",
      "message": "Successfully indexed 3 chunks into vector database."
    }
  }
  ```
- **Error Cases:**
  - `400 Bad Request`: Invalid GitHub URL or no supported source code files found.
  - `404 Not Found`: Repository does not exist or is private.
  - `500 Internal Server Error`: Ingestion processing error.

---

## 3. Semantic Vector Search
**Purpose:** Query the vector database for relevant code chunks based on semantic similarity.
- **Endpoint:** `POST /api/search`
- **Request Body:**
  ```json
  {
    "query": "Where is the authentication handled?",
    "top_k": 5
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "status": "success",
    "query": "Where is the authentication handled?",
    "count": 5,
    "results": [
      {
        "content": "def authenticate_user(...):",
        "metadata": {
          "file_path": "auth.py",
          "language": "python",
          "chunk_index": 0
        },
        "score": 0.245
      }
    ]
  }
  ```

---

## 4. Chat (Scheduled for Day 6)
**Purpose:** Handle grounded user Q&A streaming response grounded in indexed code.
- **Endpoint:** `POST /api/chat`
