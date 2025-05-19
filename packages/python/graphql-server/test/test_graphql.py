from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)


def test_graphql_query_consonants():
    query = {
        "query": """
        query {
          consonants(place: "velar") {
            phoneme
            place
          }
        }
        """
    }
    response = client.post("/graphql", json=query)
    assert response.status_code == 200
    assert "consonants" in response.json()["data"]
