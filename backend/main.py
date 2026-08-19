import os
from typing import Optional
from fastapi import FastAPI, HTTPException, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from services.github_service import fetch_repository_files, parse_github_url
from services.chunker import chunk_repository_documents
from services.vector_db import store_chunks_in_vector_db, query_vector_db
from services.rag_service import generate_rag_response, generate_rag_stream
from services.onboarding_service import generate_onboarding_brief

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="CodeCompass API",
    description="Code-aware RAG intelligence assistant for GitHub repositories",
    version="1.0.0"
)

# Configure CORS for React frontend (Development + Deployed Vercel URLs)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local dev & deployed Vercel apps
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware for Security Headers & Request Timing
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response

class IngestRequest(BaseModel):
    repo_url: str = Field(
        ...,
        description="Public GitHub repository URL (e.g. https://github.com/fastapi/fastapi)",
        example="https://github.com/fastapi/fastapi"
    )

class SearchRequest(BaseModel):
    query: str = Field(..., description="Search query string")
    top_k: int = Field(default=5, description="Number of vector results to return")

class ChatRequest(BaseModel):
    query: str = Field(..., description="User question or query about the ingested codebase")
    top_k: int = Field(default=5, description="Number of code chunks to retrieve as context")
    repo_url: Optional[str] = Field(default=None, description="Optional GitHub repo URL context")

@app.get("/health", status_code=status.HTTP_200_OK)
def health_check():
    """Health check endpoint to verify backend server status."""
    return {"status": "ok", "message": "CodeCompass API is operational"}

@app.post("/api/ingest", status_code=status.HTTP_200_OK)
def ingest_repository(request: IngestRequest):
    """
    Ingests a public GitHub repository:
    1. Validates repository URL.
    2. Retrieves source files via GitHub REST API.
    3. Splits source code into AST-aware chunks.
    4. Generates vector embeddings and indexes chunks in vector database.
    """
    try:
        owner, repo = parse_github_url(request.repo_url)
    except ValueError as err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(err))

    try:
        # Step 1: Fetch files from GitHub
        documents = fetch_repository_files(request.repo_url, max_files=150)
        if not documents:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No supported source code files found in repository '{owner}/{repo}'."
            )

        # Step 2: AST Code-Aware Chunking
        chunks = chunk_repository_documents(documents)

        # Step 3: Vector DB Storage & Embeddings
        vector_res = store_chunks_in_vector_db(chunks)

        # Extract simplified file listing for tree view
        file_tree = [{"path": doc["path"], "language": doc["language"]} for doc in documents]

        return {
            "status": "success",
            "repo_url": request.repo_url,
            "owner": owner,
            "repo": repo,
            "file_count": len(documents),
            "chunk_count": len(chunks),
            "files": file_tree,
            "vector_db": vector_res
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ingestion failed: {str(e)}"
        )

@app.post("/api/search", status_code=status.HTTP_200_OK)
def search_code_chunks(request: SearchRequest):
    """
    Performs semantic vector search against indexed code chunks.
    """
    try:
        results = query_vector_db(request.query, n_results=request.top_k)
        return {
            "status": "success",
            "query": request.query,
            "count": len(results),
            "results": results
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Vector search failed: {str(e)}"
        )

@app.post("/api/chat", status_code=status.HTTP_200_OK)
def chat_with_codebase(request: ChatRequest):
    """
    RAG Chat endpoint: Accepts a query, retrieves top code chunks from ChromaDB,
    and returns a code-grounded answer with file citations.
    """
    try:
        response = generate_rag_response(query=request.query, top_k=request.top_k)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"RAG chat failed: {str(e)}"
        )

@app.post("/api/chat/stream")
async def chat_with_codebase_stream(request: ChatRequest):
    """
    RAG Streaming Chat Endpoint: Returns Server-Sent Events (SSE) stream
    delivering real-time response tokens and citations.
    """
    try:
        return StreamingResponse(
            generate_rag_stream(query=request.query, top_k=request.top_k),
            media_type="text/event-stream"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"RAG streaming chat failed: {str(e)}"
        )

class OnboardRequest(BaseModel):
    repo_url: str = Field(..., description="Public GitHub repository URL")

@app.post("/api/onboard", status_code=status.HTTP_200_OK)
def generate_repository_onboard_brief(request: OnboardRequest):
    """
    Generates an auto-generated Repository Onboarding Brief:
    1. Parses repository URL.
    2. Fetches files and computes tech stack breakdown.
    3. Retrieves top vector chunks.
    4. Synthesizes a structured onboarding guide with entry points and suggested questions.
    """
    try:
        owner, repo = parse_github_url(request.repo_url)
        documents = fetch_repository_files(request.repo_url, max_files=150)
        file_tree = [{"path": doc["path"], "language": doc["language"]} for doc in documents]
        chunks = query_vector_db(query_text="architecture main entry point overview", n_results=5)

        brief = generate_onboarding_brief(owner, repo, file_tree, chunks)
        return brief
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Onboarding brief generation failed: {str(e)}"
        )


