import os
import sys

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(__file__))

from services.chunker import chunk_file
from services.vector_db import store_chunks_in_vector_db, query_vector_db

def test_vector_database():
    print("========================================")
    print("Testing Day 5 Vector Database & Local Free Embeddings")
    print("========================================")

    sample_doc = {
        "path": "auth/security.py",
        "content": """
def hash_password(password: str) -> str:
    # Hashes user password using bcrypt algorithm
    return f"hashed_{password}"

def verify_jwt_token(token: str) -> bool:
    # Verifies JWT bearer authentication token
    return token == "valid_secret_token"
""",
        "language": "python",
        "repo": "test/auth-service"
    }

    # 1. Chunk document
    chunks = chunk_file(sample_doc, chunk_size=300, chunk_overlap=50)
    print(f"Created {len(chunks)} chunks for vector indexing.")

    # 2. Store in ChromaDB
    res = store_chunks_in_vector_db(chunks, collection_name="test_collection")
    print(f"Index status: {res}")

    # 3. Query vector store
    search_query = "password hashing bcrypt security"
    results = query_vector_db(search_query, n_results=2, collection_name="test_collection")

    print(f"\nSearch results for '{search_query}':")
    for r in results:
        print(f"\n[Score: {r.get('score', 0):.4f}] File: {r['metadata'].get('file_path')}")
        print(f"Content:\n{r['content']}")

    assert len(results) > 0, "Vector DB search returned 0 results!"
    print("\n[SUCCESS] Milestone 2 Vector DB & Search Verification Passed!")

if __name__ == "__main__":
    test_vector_database()
