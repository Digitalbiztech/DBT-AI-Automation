import requests
import json

url = "http://localhost:8088/chat"
payload = {
    "message": "Hello, can you help me interpret my lab results?",
    "reports": [],
    "history": []
}
headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
