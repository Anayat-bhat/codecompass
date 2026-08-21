# 30-Day Product Growth Plan: CodeCompass 🧭

> **Post-v1.0.0 Daily Milestone Roadmap to Enterprise Readiness**

This 30-day roadmap outlines individual, highly actionable daily engineering milestones to transform **CodeCompass** from a v1.0.0 MVP into an enterprise-grade AI code intelligence platform. Each day builds logically on the work of the previous day.

---

## 🚀 Week 1: Core Performance & Vector Database Scaling

- **Day 1: Vector Cache Layer (Redis / In-Memory LRU)**
  - Implement LRU caching for frequent vector queries to reduce ChromaDB query execution time by 60%.
- **Day 2: Asynchronous Background Ingestion (Celery / FastAPI Background Tasks)**
  - Decouple repository zip downloading and indexing into non-blocking background workers.
- **Day 3: Incremental File Ingestion & Git Commit Hashing**
  - Store commit SHA during indexing; only re-chunk and re-embed files modified since the last indexed commit.
- **Day 4: Support for Private GitHub Repositories (Personal Access Tokens)**
  - Add secure GitHub PAT authentication input in frontend and backend request headers.
- **Day 5: AST Parser Expansion (Go & Rust Support)**
  - Add AST recursive language splitters for Go (`.go`) and Rust (`.rs`) files in `services/chunker.py`.
- **Day 6: Advanced RAG Chunk Filtering (Language & Directory Exclusions)**
  - Allow users to exclude vendor, node_modules, dist, and binary paths from vector indexing.
- **Day 7: Week 1 Integration Testing & Benchmark Benchmarks**
  - Run benchmark suite comparing retrieval speed and accuracy across multi-language repositories.

---

## 🧠 Week 2: RAG Accuracy & Graph Intelligence

- **Day 8: Code Dependency Graph Construction (NetworkX)**
  - Build directed graph representing import dependencies and function calls across repository files.
- **Day 9: Hybrid Retrieval (Graph Traversal + Vector Similarity)**
  - Combine top-K vector matches with graph neighbor nodes to inject caller/callee context into prompts.
- **Day 10: Multi-Query Prompt Expansion**
  - Generate 3 variations of user queries using LLM before querying ChromaDB to increase recall.
- **Day 11: Re-Ranking Engine Integration (FlashRank / Cross-Encoder)**
  - Re-rank top 20 retrieved vector chunks using a lightweight local cross-encoder model before sending to LLM.
- **Day 12: Direct Code Line Citation Highlighting**
  - Enhance frontend markdown renderer to highlight exact line numbers cited in code responses.
- **Day 13: Interactive Code Snippet Copy & Sandbox Run**
  - Add "Copy Snippet" and "Open in Web IDE" quick actions to chat response citation cards.
- **Day 14: Week 2 Retrospective & RAG Evaluation Metrics**
  - Measure precision@K and MRR (Mean Reciprocal Rank) across 50 test codebase queries.

---

## 🛡️ Week 3: Enterprise Security & Multi-Repo Workspaces

- **Day 15: User Authentication & Workspace Persistence (JWT + SQLite/PostgreSQL)**
  - Add user login, registration, and persistent user workspaces.
- **Day 16: Multi-Repository Workspace Grouping**
  - Support adding multiple GitHub repositories into a single searchable workspace collection.
- **Day 17: Role-Based Access Control (RBAC)**
  - Introduce Owner, Editor, and Viewer permissions for shared team workspaces.
- **Day 18: Enterprise Security Audit & Input Sanitization**
  - Audit prompt injection risks, sanitize all user inputs, and enforce rate-limiting per API key.
- **Day 19: Local LLM Provider Connector (Ollama / vLLM)**
  - Add config option to stream chat completions from local Ollama instances (e.g. Qwen2.5-Coder).
- **Day 20: Audit Logging & Telemetry**
  - Track query performance, vector search latency, and LLM token usage with structured JSON logs.
- **Day 21: Week 3 Security & Scale Hardening**
  - Execute automated penetration testing and load test backend with Locust (100 concurrent users).

---

## 🎨 Week 4: IDE Extensions & Developer Experience

- **Day 22: VS Code Extension Boilerplate & Authentication**
  - Initialize VS Code extension project connected to CodeCompass backend API.
- **Day 23: VS Code Sidebar RAG Chat Interface**
  - Implement webview panel in VS Code allowing developers to query CodeCompass without leaving the IDE.
- **Day 24: Active File Context Injection**
  - Automatically append currently active VS Code editor tab code into CodeCompass query context.
- **Day 25: GitHub Action PR Review Bot**
  - Create reusable GitHub Action (`action.yml`) that runs CodeCompass automated PR reviews.
- **Day 26: Automated Unit Test Generator Endpoint**
  - Add API endpoint `/api/generate-tests` to auto-generate unit tests for selected repository functions.
- **Day 27: Custom System Prompt Configuration**
  - Allow team admins to customize AI mentor tone, coding guidelines, and response format.
- **Day 28: Full Platform Documentation & API Reference**
  - Publish OpenAPI 3.0 specification and developer documentation portal.
- **Day 29: Production Staging & Deployment Automation**
  - Setup CI/CD pipeline using GitHub Actions for automated testing and Vercel/Render deployment.
- **Day 30: Grand v2.0 Release & Public Launch**
  - Tag CodeCompass v2.0.0, record demo video, and publish announcement on Hacker News & Product Hunt!
