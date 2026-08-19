import os
from typing import List, Dict, Any, Optional
import openai
from services.vector_db import query_vector_db

def format_context(chunks: List[Dict[str, Any]]) -> str:
    """
    Formats vector search results into a clean code context block for the LLM prompt.
    """
    if not chunks:
        return "No relevant code snippets found in the indexed repository."

    formatted_blocks = []
    for idx, item in enumerate(chunks, 1):
        content = item.get("content", "").strip()
        meta = item.get("metadata", {})
        file_path = meta.get("file_path", "unknown_file")
        language = meta.get("language", "text")
        chunk_idx = meta.get("chunk_index", 0)

        block = f"--- Source Snippet #{idx} [File: {file_path} | Language: {language} | Chunk: {chunk_idx}] ---\n{content}\n"
        formatted_blocks.append(block)

    return "\n".join(formatted_blocks)

def extract_sources(chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Extracts distinct source metadata and snippets for frontend citation cards.
    """
    sources = []
    seen = set()

    for item in chunks:
        meta = item.get("metadata", {})
        file_path = meta.get("file_path", "unknown_file")
        chunk_idx = meta.get("chunk_index", 0)
        key = f"{file_path}#{chunk_idx}"

        if key not in seen:
            seen.add(key)
            snippet = item.get("content", "")
            if len(snippet) > 250:
                snippet = snippet[:250] + "..."
            
            sources.append({
                "file_path": file_path,
                "language": meta.get("language", "text"),
                "chunk_index": chunk_idx,
                "snippet": snippet
            })

    return sources

def synthesize_fallback_response(query: str, chunks: List[Dict[str, Any]]) -> str:
    """
    Generates a clear, code-grounded answer using retrieved chunks when no external API key is present.
    """
    if not chunks:
        return f"I searched the repository for **\"{query}\"**, but no matching code snippets were found. Please make sure a repository has been ingested first."

    file_list = sorted(list({c.get("metadata", {}).get("file_path", "unknown") for c in chunks}))
    file_str = ", ".join([f"`{f}`" for f in file_list])

    primary_snippet = chunks[0].get("content", "").strip()
    first_file = chunks[0].get("metadata", {}).get("file_path", "unknown")

    answer = (
        f"Based on semantic code search in the ingested repository, relevant implementation details "
        f"for **\"{query}\"** were located across the following files:\n\n"
        f"📍 **Relevant Files:** {file_str}\n\n"
        f"### 🔍 Key Implementation Insight ({first_file})\n"
        f"```code\n{primary_snippet[:400]}\n```\n\n"
        f"--- \n"
        f"💡 *Tip: To enable full generative AI explanations, set `OPENAI_API_KEY` or `GEMINI_API_KEY` in `backend/.env`.*"
    )
    return answer

def generate_rag_response(query: str, top_k: int = 5, collection_name: str = "codecompass_chunks") -> Dict[str, Any]:
    """
    Performs RAG retrieval against ChromaDB vector store and generates an AI answer with file citations.
    """
    # Step 1: Vector Search Retrieval
    chunks = query_vector_db(query_text=query, n_results=top_k, collection_name=collection_name)
    sources = extract_sources(chunks)
    context_text = format_context(chunks)

    # Check for API keys
    openai_key = os.getenv("OPENAI_API_KEY", "").strip()
    gemini_key = os.getenv("GEMINI_API_KEY", "").strip()

    # System prompt instructing the model to ground its response in the provided codebase context
    system_prompt = (
        "You are CodeCompass, an expert code-aware AI assistant. "
        "Answer the user's question accurately using ONLY the provided code snippets from the ingested GitHub repository. "
        "Always cite specific file paths when referencing code logic. "
        "If the answer cannot be determined from the code context, state that clearly."
    )

    user_prompt = (
        f"User Question: {query}\n\n"
        f"Retrieved Codebase Context:\n{context_text}\n\n"
        f"Provide a clear, helpful response explaining how the codebase handles this question with file citations."
    )

    answer = None

    # Step 2A: Try OpenAI API if key available
    if openai_key and openai_key != "your_openai_api_key_here":
        try:
            client = openai.OpenAI(api_key=openai_key)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.2,
                max_tokens=800
            )
            answer = response.choices[0].message.content
        except Exception as e:
            print(f"[RAG Warning] OpenAI API call failed: {e}. Using fallback synthesizer.")

    # Step 2B: Try Gemini API if key available and OpenAI wasn't used
    if not answer and gemini_key and gemini_key != "your_gemini_api_key_here":
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            full_prompt = f"{system_prompt}\n\n{user_prompt}"
            res = model.generate_content(full_prompt)
            answer = res.text
        except Exception as e:
            print(f"[RAG Warning] Gemini API call failed: {e}. Using fallback synthesizer.")

    # Step 2C: Fallback Synthesizer if no API key or API call failed
    if not answer:
        answer = synthesize_fallback_response(query, chunks)

    return {
        "status": "success",
        "query": query,
        "answer": answer,
        "sources": sources,
        "chunks_retrieved": len(chunks)
    }

async def generate_rag_stream(query: str, top_k: int = 5, collection_name: str = "codecompass_chunks"):
    """
    Async generator yielding Server-Sent Event (SSE) chunks for real-time response streaming.
    Format per chunk: 'data: {"type": "content|sources|done", "payload": ...}\n\n'
    """
    import json
    import asyncio

    # Step 1: Query ChromaDB for top matching context chunks
    chunks = query_vector_db(query_text=query, n_results=top_k, collection_name=collection_name)
    sources = extract_sources(chunks)
    context_text = format_context(chunks)

    # First send retrieved citations payload
    yield f"data: {json.dumps({'type': 'sources', 'sources': sources})}\n\n"
    await asyncio.sleep(0.01)

    openai_key = os.getenv("OPENAI_API_KEY", "").strip()
    gemini_key = os.getenv("GEMINI_API_KEY", "").strip()

    system_prompt = (
        "You are CodeCompass, an expert code-aware AI assistant. "
        "Answer the user's question accurately using ONLY the provided code snippets from the ingested GitHub repository. "
        "Always cite specific file paths when referencing code logic. "
        "If the answer cannot be determined from the code context, state that clearly."
    )

    user_prompt = (
        f"User Question: {query}\n\n"
        f"Retrieved Codebase Context:\n{context_text}\n\n"
        f"Provide a clear, helpful response explaining how the codebase handles this question with file citations."
    )

    streamed_success = False

    # Try OpenAI streaming if key present
    if openai_key and openai_key != "your_openai_api_key_here":
        try:
            client = openai.OpenAI(api_key=openai_key)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.2,
                max_tokens=800,
                stream=True
            )
            for chunk in response:
                if chunk.choices and chunk.choices[0].delta.content:
                    text_delta = chunk.choices[0].delta.content
                    yield f"data: {json.dumps({'type': 'token', 'token': text_delta})}\n\n"
                    await asyncio.sleep(0.005)
            streamed_success = True
        except Exception as e:
            print(f"[RAG Stream Warning] OpenAI streaming failed: {e}")

    # Fallback to Local/Synthesizer Stream if OpenAI was not used or failed
    if not streamed_success:
        full_answer = synthesize_fallback_response(query, chunks)
        # Stream character/word tokens smoothly
        words = full_answer.split(" ")
        for idx, word in enumerate(words):
            token = word + (" " if idx < len(words) - 1 else "")
            yield f"data: {json.dumps({'type': 'token', 'token': token})}\n\n"
            await asyncio.sleep(0.015)

    # Signal completion
    yield f"data: {json.dumps({'type': 'done'})}\n\n"

