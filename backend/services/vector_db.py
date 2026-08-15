import os
import chromadb
from chromadb.utils import embedding_functions
from typing import List, Dict, Any, Optional
import openai

CHROMA_PERSIST_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "chroma_db")

def get_embedding_function():
    """
    Returns OpenAI embedding function if API key is provided, 
    otherwise falls back to Chroma's default sentence-transformers embedding.
    """
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if api_key and api_key != "your_openai_api_key_here":
        try:
            return embedding_functions.OpenAIEmbeddingFunction(
                api_key=api_key,
                model_name="text-embedding-3-small"
            )
        except Exception as e:
            print(f"[VectorDB Warning] Failed to initialize OpenAI Embeddings ({e}). Falling back to default.")
    
    # Fallback default embedding function
    return embedding_functions.DefaultEmbeddingFunction()

def get_vector_client():
    """Returns a persistent ChromaDB client."""
    os.makedirs(CHROMA_PERSIST_DIR, exist_ok=True)
    return chromadb.PersistentClient(path=CHROMA_PERSIST_DIR)

def get_collection(name: str = "codecompass_chunks"):
    """Gets or creates the Chroma collection with appropriate embedding function."""
    client = get_vector_client()
    embedding_fn = get_embedding_function()
    return client.get_or_create_collection(
        name=name,
        embedding_function=embedding_fn
    )

def store_chunks_in_vector_db(chunks: List[Dict[str, Any]], collection_name: str = "codecompass_chunks") -> Dict[str, Any]:
    """
    Upserts chunk documents and metadata into the Chroma vector database.
    """
    if not chunks:
        return {"status": "success", "count": 0, "message": "No chunks to insert"}

    collection = get_collection(collection_name)

    ids = [c["id"] for c in chunks]
    documents = [c["text"] for c in chunks]
    metadatas = [c["metadata"] for c in chunks]

    # Batch upsert to prevent size limits (max batch size 200)
    batch_size = 100
    total_stored = 0

    for i in range(0, len(chunks), batch_size):
        batch_ids = ids[i:i + batch_size]
        batch_docs = documents[i:i + batch_size]
        batch_meta = metadatas[i:i + batch_size]

        collection.upsert(
            ids=batch_ids,
            documents=batch_docs,
            metadatas=batch_meta
        )
        total_stored += len(batch_ids)

    return {
        "status": "success",
        "count": total_stored,
        "collection": collection_name,
        "message": f"Successfully indexed {total_stored} chunks into vector database."
    }

def query_vector_db(query_text: str, n_results: int = 5, collection_name: str = "codecompass_chunks") -> List[Dict[str, Any]]:
    """
    Queries vector database for the top n_results most relevant code chunks.
    """
    collection = get_collection(collection_name)
    results = collection.query(
        query_texts=[query_text],
        n_results=n_results
    )

    formatted_results = []
    if results and "documents" in results and results["documents"]:
        docs = results["documents"][0]
        metas = results["metadatas"][0] if "metadatas" in results else [{}] * len(docs)
        distances = results["distances"][0] if "distances" in results else [0.0] * len(docs)

        for doc, meta, dist in zip(docs, metas, distances):
            formatted_results.append({
                "content": doc,
                "metadata": meta,
                "score": float(dist)
            })

    return formatted_results
