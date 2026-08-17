import sys
import os

# Ensure backend root is on Python path
sys.path.insert(0, os.path.dirname(__file__))

from services.vector_db import store_chunks_in_vector_db
from services.rag_service import generate_rag_response
from main import app
from fastapi.testclient import TestClient

def test_rag_service_and_chat_endpoint():
    print("[TEST] Running RAG Service and /api/chat Test...")

    # 1. Insert dummy code chunk into ChromaDB
    dummy_chunks = [
        {
            "id": "test_repo_auth_py_0",
            "text": "def authenticate_user(username, password):\n    # Hash password and verify in database\n    return db.query_user(username).verify(password)",
            "metadata": {
                "file_path": "services/auth.py",
                "language": "python",
                "repo": "test/repo",
                "chunk_index": 0,
                "total_chunks": 1,
                "char_length": 120
            }
        }
    ]

    store_res = store_chunks_in_vector_db(dummy_chunks)
    print(f"[OK] Vector Store Result: {store_res['message']}")

    # 2. Test direct rag_service generation
    rag_res = generate_rag_response(query="Where is user authentication logic?", top_k=2)
    assert rag_res["status"] == "success"
    assert len(rag_res["sources"]) > 0
    assert "services/auth.py" in [s["file_path"] for s in rag_res["sources"]]
    print(f"[OK] RAG Service Answer Generated successfully!")
    print(f"[OK] Citations Found: {[s['file_path'] for s in rag_res['sources']]}")

    # 3. Test FastAPI endpoint via TestClient
    client = TestClient(app)
    resp = client.post("/api/chat", json={"query": "How is authentication implemented?", "top_k": 3})
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert "answer" in data
    assert "sources" in data
    print(f"[SUCCESS] API Endpoint POST /api/chat Passed (Status Code 200)!")

if __name__ == "__main__":
    test_rag_service_and_chat_endpoint()
