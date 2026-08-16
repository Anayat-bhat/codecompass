# Database & Payload Schemas: CodeCompass

CodeCompass utilizes **ChromaDB** as its primary vector store to support Retrieval-Augmented Generation (RAG) and semantic code search.

---

## 1. Vector Collection Specification

- **Vector Database:** ChromaDB (Persistent local storage at `backend/chroma_db`)
- **Collection Name:** `codecompass_chunks`
- **Default Embedding Model:** `all-MiniLM-L6-v2` (ONNX local embedding function)
- **Vector Dimensions:** 384 dimensions (or 1536 if OpenAI embeddings are enabled)
- **Distance Metric:** Cosine similarity

---

## 2. Chunk Record Payload Schema

Each indexed record represents an AST-aware code block (e.g., function, class, or logic segment).

| Field | Type | Description | Example |
|---|---|---|---|
| `id` | String | Unique deterministic identifier | `owner_repo_path_to_file_py_0` |
| `text` | String | Raw text content of code chunk | `def connect_db(): ...` |
| `metadata` | Object | Metadata payload for filtering & citations | *(See below)* |

---

## 3. Metadata Payload Schema

```json
{
  "file_path": "backend/services/github_service.py",
  "language": "python",
  "repo": "owner/repo-name",
  "chunk_index": 0,
  "total_chunks": 4,
  "char_length": 340
}
```

### Attribute Descriptions:
- `file_path`: Relative file path within the ingested GitHub repository.
- `language`: Source language identifier (`python`, `js`, `ts`, `html`, `css`, `markdown`).
- `repo`: GitHub `owner/repository` string.
- `chunk_index`: 0-indexed position of chunk within the source file.
- `total_chunks`: Total number of chunks generated for this file.
- `char_length`: Number of characters in the chunk.
