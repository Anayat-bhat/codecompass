# API Design: CodeCompass

This document outlines the REST API endpoints required for the FastAPI backend.

---

## 1. Health Check
**Purpose:** Verify the backend is running and accessible (used by frontend to show connection status).
- **Endpoint:** `GET /health`
- **Request:** None
- **Response (200 OK):**
  ```json
  {
    "status": "ok",
    "message": "CodeCompass API is running"
  }
  ```

---

## 2. Ingest Repository
**Purpose:** Fetch a GitHub repository, chunk its code, store vectors, and generate the Onboarding Brief and File Tree.
- **Endpoint:** `POST /api/ingest`
- **Request Body:**
  ```json
  {
    "repo_url": "https://github.com/username/repository"
  }
  ```
- **Validation:** 
  - `repo_url` must be a valid GitHub URL.
  - Repository must be public.
  - Repository must contain fewer than 200 supported files (Python/JS/TS).
- **Response (200 OK):**
  ```json
  {
    "repo_url": "https://github.com/username/repository",
    "file_tree": {
      "src": {
        "main.py": "file",
        "utils": {
          "helpers.py": "file"
        }
      }
    },
    "onboarding_brief": "# Architecture Overview\nThis project is a..."
  }
  ```
- **Error Cases:**
  - `400 Bad Request`: Invalid URL format.
  - `404 Not Found`: Repository does not exist or is private.
  - `413 Payload Too Large`: Repository exceeds the 200-file limit.

---

## 3. Chat (Streaming)
**Purpose:** Handle user Q&A grounded in the ingested codebase. Streams the response back to the client.
- **Endpoint:** `POST /api/chat`
- **Request Body:**
  ```json
  {
    "repo_url": "https://github.com/username/repository",
    "query": "Where is the authentication middleware located?",
    "history": [
      {"role": "user", "content": "What does this repo do?"},
      {"role": "assistant", "content": "It is a web framework..."}
    ]
  }
  ```
- **Validation:** 
  - `repo_url` must exist in the vector database.
  - `query` cannot be empty.
- **Response (200 OK - text/event-stream):**
  Server-Sent Events (SSE) streaming the markdown response word-by-word.
  ```text
  data: {"chunk": "The "}
  data: {"chunk": "authentication "}
  data: {"chunk": "middleware "}
  ...
  ```
- **Error Cases:**
  - `400 Bad Request`: Repository has not been ingested yet.
  - `500 Internal Server Error`: OpenAI API failure.
