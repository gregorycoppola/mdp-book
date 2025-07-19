import requests

BASE_URL = "http://localhost:8000"

def post(path: str, json: dict = None):
    url = f"{BASE_URL}{path}"
    response = requests.post(url, json=json)
    return response.json()

def get(path: str):
    url = f"{BASE_URL}{path}"
    response = requests.get(url)
    return response.json()
