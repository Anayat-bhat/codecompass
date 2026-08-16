# Environment Variables: CodeCompass

This document describes the environment variable setup for local development and cloud production.

---

## Backend Environment Configuration (`backend/.env`)

Create a `.env` file in the `backend/` directory.

```env
# Optional GitHub Personal Access Token (prevents rate limits on public repos)
GITHUB_TOKEN=your_github_token_here

# Optional OpenAI API Key (if provided, switches vector embeddings to text-embedding-3-small)
OPENAI_API_KEY=your_openai_api_key_here
```

---

## 🔑 Key Details

1. **GITHUB_TOKEN (Optional):**
   - Public repository fetching works out-of-the-box without a token.
   - Adding a PAT increases GitHub API rate limit from 60 requests/hour to 5,000 requests/hour.
   - *How to generate:* GitHub -> Settings -> Developer Settings -> Personal Access Tokens (Classic).

2. **OPENAI_API_KEY (Optional):**
   - By default, CodeCompass uses a **100% free local ONNX embedding model** (`all-MiniLM-L6-v2`) built into ChromaDB.
   - No paid API key is required to run CodeCompass!

---

## Security Warning
- **Never** commit `.env` files to git repositories. `.env` is listed in `.gitignore`.
