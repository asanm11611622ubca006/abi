import requests
import json

BASE_URL = "http://localhost:8000"

def test_api():
    print("Testing API...")
    
    # 1. Create Product
    product = {
        "id": "test_prod_1",
        "name": "Test Product",
        "category": "Gold",
        "description": "A test product",
        "images": ["http://example.com/image.jpg"],
        "price": 1000,
        "stock": 10
    }
    
    try:
        print("Creating product...")
        response = requests.post(f"{BASE_URL}/products", json=product)
        print(f"Create Status: {response.status_code}")
        print(response.json())
    except Exception as e:
        print(f"Create failed: {e}")

    # 2. Get Products
    try:
        print("Fetching products...")
        response = requests.get(f"{BASE_URL}/products")
        print(f"Get Status: {response.status_code}")
        products = response.json()
        print(f"Found {len(products)} products")
    except Exception as e:
        print(f"Get failed: {e}")

if __name__ == "__main__":
    test_api()
