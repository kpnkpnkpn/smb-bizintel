import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock, MagicMock
from apps.backend.api.index import app
import uuid
from datetime import datetime

client = TestClient(app)

# Helper: valid business dict matching shared type
business_dict = {
    "id": str(uuid.uuid4()),
    "name": "Test Business",
    "address": "123 Main St",
    "city": "Austin",
    "state": "TX",
    "zipCode": "78701",
    "latitude": 30.2672,
    "longitude": -97.7431,
    "website": "https://test.com",
    "phoneNumber": "555-1234",
    "ownerName": "Jane Doe",
    "yearStarted": 2020,
    "starRating": 4.5,
    "reviewCount": 10,
    "naicsCode": "541511",
    "createdAt": datetime.utcnow().isoformat(),
    "updatedAt": datetime.utcnow().isoformat(),
}

@pytest.fixture(autouse=True)
def set_api_key_env(monkeypatch):
    monkeypatch.setenv("API_KEY", "testkey")

@patch("apps.backend.api.index.BusinessRepository")
def test_get_businesses_success(mock_repo):
    mock_instance = mock_repo.return_value
    mock_instance.list_all = AsyncMock(return_value=[MagicMock(**business_dict)])
    response = client.get("/api/businesses", headers={"X-API-Key": "testkey"})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert data[0]["name"] == "Test Business"
    assert data[0]["id"] == business_dict["id"]

@patch("apps.backend.api.index.BusinessRepository")
def test_get_businesses_empty(mock_repo):
    mock_instance = mock_repo.return_value
    mock_instance.list_all = AsyncMock(return_value=[])
    response = client.get("/api/businesses", headers={"X-API-Key": "testkey"})
    assert response.status_code == 200
    data = response.json()
    assert data == []

@patch("apps.backend.api.index.BusinessRepository")
def test_get_businesses_missing_api_key(mock_repo):
    response = client.get("/api/businesses")
    assert response.status_code == 401
    data = response.json()
    assert data["detail"]["code"] == "UNAUTHORIZED"

@patch("apps.backend.api.index.BusinessRepository")
def test_get_businesses_invalid_api_key(mock_repo):
    response = client.get("/api/businesses", headers={"X-API-Key": "wrongkey"})
    assert response.status_code == 401
    data = response.json()
    assert data["detail"]["code"] == "UNAUTHORIZED"

@patch("apps.backend.api.index.BusinessRepository")
def test_get_businesses_db_error(mock_repo):
    mock_instance = mock_repo.return_value
    mock_instance.list_all = AsyncMock(side_effect=Exception("DB Failure"))
    response = client.get("/api/businesses", headers={"X-API-Key": "testkey"})
    assert response.status_code == 500
    data = response.json()
    assert data["detail"]["code"] == "INTERNAL_SERVER_ERROR" 