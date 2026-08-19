import sys
import os
import json

# Force UTF-8 stdout encoding for Windows compatibility
sys.stdout.reconfigure(encoding='utf-8')

# Ensure backend directory is in python path
sys.path.insert(0, os.path.dirname(__file__))

from fastapi.testclient import TestClient
from main import app
from services.vector_db import store_chunks_in_vector_db
from services.onboarding_service import generate_onboarding_brief

def run_production_qa_suite():
    print("=" * 70)
    print("[QA SUITE] Running CodeCompass Day 8 Release-Readiness QA & Test Suite")
    print("=" * 70)

    client = TestClient(app)

    # Test 1: Health Check Endpoint
    print("\n[TEST 1] GET /health")
    health_resp = client.get("/health")
    assert health_resp.status_code == 200, f"Expected 200, got {health_resp.status_code}"
    health_data = health_resp.json()
    assert health_data["status"] == "ok"
    print("  [SUCCESS] GET /health passed! Status: OK")

    # Test 2: Ingest Request Validation (Invalid URL)
    print("\n[TEST 2] POST /api/ingest - Input Validation (Invalid URL)")
    bad_ingest = client.post("/api/ingest", json={"repo_url": "invalid_url_string"})
    assert bad_ingest.status_code == 400, f"Expected 400 for bad URL, got {bad_ingest.status_code}"
    print("  [SUCCESS] POST /api/ingest input validation passed! Properly rejected invalid URL.")

    # Test 3: Seed Vector DB & Test Search
    print("\n[TEST 3] Seed Vector DB & POST /api/search")
    dummy_chunks = [
        {
            "id": "fastapi_app_py_0",
            "text": "class FastAPI(App):\n    def __init__(self, debug: bool = False):\n        self.router = APIRouter()",
            "metadata": {
                "file_path": "fastapi/applications.py",
                "language": "python",
                "repo": "fastapi/fastapi",
                "chunk_index": 0,
                "total_chunks": 1,
                "char_length": 95
            }
        }
    ]
    store_chunks_in_vector_db(dummy_chunks)
    search_resp = client.post("/api/search", json={"query": "FastAPI class initialization", "top_k": 3})
    assert search_resp.status_code == 200
    search_data = search_resp.json()
    assert search_data["status"] == "success"
    assert search_data["count"] > 0
    print(f"  [SUCCESS] POST /api/search passed! Retrieved {search_data['count']} relevant vector chunks.")

    # Test 4: RAG Chat Endpoint (Static Response)
    print("\n[TEST 4] POST /api/chat - RAG Chat Endpoint")
    chat_resp = client.post("/api/chat", json={"query": "Where is the main FastAPI app class defined?", "top_k": 3})
    assert chat_resp.status_code == 200
    chat_data = chat_resp.json()
    assert chat_data["status"] == "success"
    assert "answer" in chat_data
    assert len(chat_data["sources"]) > 0
    print("  [SUCCESS] POST /api/chat passed! Citation file path:", chat_data["sources"][0]["file_path"])

    # Test 5: Real-Time SSE Streaming Endpoint (/api/chat/stream)
    print("\n[TEST 5] POST /api/chat/stream - Real-Time SSE Response Stream")
    stream_resp = client.post("/api/chat/stream", json={"query": "Explain the FastAPI app class.", "top_k": 3})
    assert stream_resp.status_code == 200
    assert "text/event-stream" in stream_resp.headers["content-type"]
    
    stream_content = stream_resp.content.decode("utf-8")
    assert "data: {" in stream_content
    assert '"type": "sources"' in stream_content or '"type": "token"' in stream_content
    print("  [SUCCESS] POST /api/chat/stream passed! Verified SSE event-stream content delivery.")

    # Test 6: Repository Onboarding Brief Engine (Direct Unit Test)
    print("\n[TEST 6] Onboarding Brief Engine Unit Test")
    mock_file_tree = [
        {"path": "fastapi/applications.py", "language": "python"},
        {"path": "fastapi/routing.py", "language": "python"},
        {"path": "pyproject.toml", "language": "toml"},
        {"path": "README.md", "language": "markdown"}
    ]
    brief = generate_onboarding_brief("fastapi", "fastapi", mock_file_tree, dummy_chunks)
    assert brief["status"] == "success"
    assert "onboarding_brief" in brief
    assert len(brief["suggested_questions"]) == 4
    print("  [SUCCESS] Onboarding Brief Generator passed! Synthesized Markdown brief with 4 exploration triggers.")

    print("\n" + "=" * 70)
    print("[QA SUITE] ALL 6 RELEASE-READINESS QA TESTS PASSED SUCCESSFULLY! (100% PASS RATE)")
    print("=" * 70)

if __name__ == "__main__":
    run_production_qa_suite()
