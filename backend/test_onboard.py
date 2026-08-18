from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    print("[SUCCESS] GET /health endpoint passed!")

def test_onboard_endpoint():
    payload = {"repo_url": "https://github.com/fastapi/fastapi"}
    response = client.post("/api/onboard", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "onboarding_brief" in data
    assert "analysis" in data
    assert "suggested_questions" in data
    assert len(data["suggested_questions"]) > 0
    print("[SUCCESS] POST /api/onboard endpoint passed!")

if __name__ == "__main__":
    test_health_endpoint()
    test_onboard_endpoint()
