# Future Scope & Product Roadmap: CodeCompass 🧭

> **Architectural Evolution & Product Strategy (3, 6, and 12-Month Scope)**

CodeCompass v1.0.0 provides a single-repository RAG onboarding platform with AST code-aware chunking, local vector search, automated architectural briefs, and real-time SSE streaming. This document outlines the technical evolution roadmap to transform CodeCompass from an MVP developer tool into an enterprise-grade AI Code Intelligence Platform.

---

## 📅 3-Month Scope: Multi-Repo & Hybrid Graph Retrieval

### 1. Multi-Repository Workspace Aggregation
- **Goal:** Allow developers to index multiple interconnected microservice repositories into a unified workspace.
- **Technical Blueprint:**
  - Introduce `Workspace` entity mapping to multiple GitHub repositories.
  - Implement workspace-level ChromaDB collection partitioning and namespace filtering.
  - Add cross-repository link analysis (e.g. tracking REST API/gRPC schema calls between frontend and backend repos).

### 2. Hybrid Graph-Vector RAG (GraphRAG)
- **Goal:** Combine vector similarity search with AST dependency graphs to eliminate hallucinated function calls.
- **Technical Blueprint:**
  - Integrate **NetworkX** or **Neo4j Embedded** to build a directed call graph (AST parent-child, function imports, class inheritance).
  - Perform hybrid retrieval: Vector Search extracts top-K code snippets -> Graph Traversal pulls upstream caller functions and downstream dependency signatures.

### 3. Local Fine-Tuned Code Model Integration
- **Goal:** Support local inference with Qwen-2.5-Coder / DeepSeek-R1-Distill without relying on cloud API rate limits.
- **Technical Blueprint:**
  - Add Ollama / vLLM backend connector interface in `backend/services/rag_service.py`.
  - Fallback pipeline supporting OpenAI, Gemini, and local GGUF models via llama-cpp-python.

---

## 📅 6-Month Scope: Autonomous PR Reviewer & Enterprise Security

### 1. Agentic Pull Request Code Review Bot
- **Goal:** Automatically inspect incoming GitHub PRs, evaluate diffs against existing codebase architecture, and write contextual inline comments.
- **Technical Blueprint:**
  - Build GitHub Webhook listener (`POST /api/webhooks/github`).
  - Calculate delta vector embeddings for incoming PR diff lines.
  - Query existing codebase vectors for breaking API changes, security flaws, or anti-patterns, posting automated markdown review summaries directly to GitHub PR threads.

### 2. Enterprise RBAC & SOC2 Compliance
- **Goal:** Enable enterprise teams to index private GitHub/GitLab repositories with strict role-based access control.
- **Technical Blueprint:**
  - Implement OAuth2 / OIDC authentication (GitHub Enterprise, Google Workspace, Okta).
  - Single-Tenant persistent ChromaDB / Qdrant Cloud cluster deployment support.
  - End-to-end data encryption at rest (AES-256) and TLS 1.3 transit security.

### 3. Incremental Indexing & Git Commit Syncing
- **Goal:** Eliminate full repository re-ingestion by listening to `push` events and updating vector embeddings incrementally.
- **Technical Blueprint:**
  - Diff commit hashes to detect modified, added, or deleted files.
  - Execute delta vector deletions (`chroma_collection.delete(ids=...)`) and upsert only changed AST chunks.

---

## 📅 12-Month Scope: IDE Extensions & Autonomous Refactoring Agent

### 1. Native VS Code & JetBrains IDE Extensions
- **Goal:** Bring CodeCompass directly into the developer's code editor sidebar.
- **Technical Blueprint:**
  - Develop VS Code extension using TypeScript and Webview API.
  - Implement inline hover tooltips showing architectural context and instant RAG chat sidebar inside VS Code.

### 2. Autonomous Multi-File Refactoring Engine
- **Goal:** Enable developers to request complex refactoring (e.g. "Migrate all REST endpoints to GraphQL") and receive automated Git branch commits.
- **Technical Blueprint:**
  - Multi-agent orchestration framework (Planner Agent -> Code Modifier Agent -> Syntax Verifier Agent -> Git Commit Agent).
  - AST transformation using `libcst` for Python and `babel` for JavaScript/TypeScript.

### 3. Synthetic Test Suite Generator
- **Goal:** Auto-generate unit, integration, and property-based tests for any selected function or module.
- **Technical Blueprint:**
  - Retrieve target function AST + dependent type schemas via CodeCompass vector store.
  - Prompt specialized LLM to generate `pytest` or `vitest` code with 90%+ code coverage.

---

## 📊 Roadmap Milestone Summary

| Horizon | Primary Focus | Key Technical Deliverables | Impact |
| :--- | :--- | :--- | :--- |
| **3 Months** | Hybrid Graph RAG & Local LLMs | Multi-repo support, GraphRAG, Ollama / vLLM connectors | Higher accuracy, zero API cost option |
| **6 Months** | GitHub PR Agent & Enterprise Security | Webhooks, incremental vector diffs, OAuth2 / RBAC | Enterprise sales readiness |
| **12 Months** | IDE Integration & Autonomous Refactoring | VS Code extension, multi-agent refactoring, test generator | Full developer workflow ownership |
