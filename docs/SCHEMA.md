# Database Design: CodeCompass

Because CodeCompass v1.0 does not require user accounts, authentication, or persistent chat histories across sessions, we do not need a traditional relational database (like PostgreSQL or MySQL). 

Instead, our only database is a **Vector Database** (Pinecone) used to store embedded code chunks for Retrieval-Augmented Generation (RAG).

## 1. Vector Database Configuration
- **Provider:** Pinecone (Serverless Free Tier)
- **Index Name:** `codecompass-index`
- **Dimensions:** 1536 (matches OpenAI `text-embedding-3-small`)
- **Metric:** Cosine Similarity

## 2. Vector Schema (Payload)
Each record in the Vector DB represents a semantic chunk of code (e.g., a single function or class).

### Schema Definition
| Field | Type | Description | Example |
|---|---|---|---|
| `id` | String | Unique identifier for the chunk. | `github.com/user/repo_main.py_chunk_1` |
| `values` | Float[] | The 1536-dimensional embedding vector. | `[0.012, -0.045, ...]` |
| `metadata` | Object | Key-value pairs used for filtering and citations. | *(See below)* |

### Metadata Schema
The metadata is critical. It allows us to filter searches to a specific repository and provides the LLM with citation context.

```json
{
  "repo_url": "https://github.com/tiangolo/fastapi",
  "file_path": "fastapi/routing.py",
  "language": "python",
  "chunk_type": "function",
  "entity_name": "get_request_handler",
  "content": "def get_request_handler(...):\n    ...",
  "start_line": 142,
  "end_line": 210
}
```

## 3. User Story Validation
- **Story:** *As a user, I want to ask questions about a specific repo.*
  - **Validation:** We filter vector searches using `metadata.repo_url == <current_repo>`.
- **Story:** *As a user, I want to know exactly which file the answer comes from.*
  - **Validation:** The `file_path` and `start_line` metadata are injected into the LLM prompt, allowing it to accurately cite sources.
