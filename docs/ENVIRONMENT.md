# Environment Variables: CodeCompass

CodeCompass relies on several external APIs for repository ingestion, vector storage, and AI generation. 

## Backend `.env` File
Create a file named `.env` in the `backend/` directory. **Never commit this file to version control.**

```env
# GitHub PAT for fetching repositories without strict rate limits
GITHUB_TOKEN=your_github_personal_access_token_here

# OpenAI API Key for embeddings and GPT-4o-mini generation
OPENAI_API_KEY=your_openai_api_key_here

# Pinecone API Key for Vector Database
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=codecompass-index
```

## How to get these keys:
1. **GITHUB_TOKEN:** Go to GitHub -> Settings -> Developer Settings -> Personal Access Tokens (Classic) -> Generate new token (check `repo` scope).
2. **OPENAI_API_KEY:** Go to platform.openai.com -> API Keys -> Create new secret key.
3. **PINECONE_API_KEY:** Go to pinecone.io -> Create a free account -> API Keys. 

*Note: We will configure these keys in tomorrow's session when we build the GitHub Ingestion Service.*
