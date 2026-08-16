# CodeCompass Backend ⚙️

> FastAPI REST Engine for Repository Ingestion, AST Code Chunking & Vector Search

This folder contains the Python FastAPI backend for CodeCompass.

---

## 🛠 Tech Stack & Services

- **Framework:** FastAPI + Uvicorn
- **Repository Ingestion:** GitHub REST API (`services/github_service.py`)
- **Code Splitter:** LangChain Recursive Character Text Splitter (`services/chunker.py`)
- **Vector Store:** Persistent ChromaDB (`services/vector_db.py`)
- **Local Embeddings:** Free local ONNX model (`all-MiniLM-L6-v2`) via `chromadb`
- **Deployment:** Render (`Procfile`, `render.yaml`)

---

## 📂 Architecture & Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/health` | `GET` | Server health check |
| `/api/ingest` | `POST` | Ingest public GitHub repository, AST chunk, and index vectors |
| `/api/search` | `POST` | Perform semantic vector search on indexed code chunks |

---

## 🚀 Local Setup & Testing

### 1. Setup Virtual Environment
```powershell
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Run Test Suite
```powershell
# Test AST Code Chunker
python test_chunker.py

# Test ChromaDB Vector Indexing & Search
python test_vector_db.py
```

### 3. Run FastAPI Development Server
```powershell
uvicorn main:app --reload --port 8000
```
Visit `http://localhost:8000/docs` to view interactive OpenAPI documentation.
