from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Union
import sqlite3
import json
from datetime import datetime

app = FastAPI()

# CORS Configuration
origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:3000",  # React default
    "*" # Allow all for development convenience
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Setup
DB_NAME = "database.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            sku TEXT,
            category TEXT NOT NULL,
            description TEXT,
            images TEXT, -- JSON array of strings
            video TEXT,
            price REAL NOT NULL,
            weight REAL,
            purity TEXT,
            stock INTEGER,
            makingCharges REAL,
            deletedAt TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Pydantic Models
class Product(BaseModel):
    id: str
    name: str
    sku: Optional[str] = None
    category: str
    description: str
    images: List[str]
    video: Optional[str] = None
    price: float
    weight: Optional[float] = None
    purity: Optional[str] = None
    stock: Optional[int] = None
    makingCharges: Optional[float] = None
    deletedAt: Optional[str] = None

# Helper to convert DB row to Product dict
def row_to_product(row):
    return {
        "id": row[0],
        "name": row[1],
        "sku": row[2],
        "category": row[3],
        "description": row[4],
        "images": json.loads(row[5]) if row[5] else [],
        "video": row[6],
        "price": row[7],
        "weight": row[8],
        "purity": row[9],
        "stock": row[10],
        "makingCharges": row[11],
        "deletedAt": row[12]
    }

@app.get("/products", response_model=List[Product])
def get_products():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products")
    rows = cursor.fetchall()
    conn.close()
    return [row_to_product(row) for row in rows]

@app.post("/products", response_model=Product)
def create_product(product: Product):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # Check if exists
    cursor.execute("SELECT id FROM products WHERE id = ?", (product.id,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Product with this ID already exists")

    cursor.execute('''
        INSERT INTO products (id, name, sku, category, description, images, video, price, weight, purity, stock, makingCharges, deletedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        product.id,
        product.name,
        product.sku,
        product.category,
        product.description,
        json.dumps(product.images),
        product.video,
        product.price,
        product.weight,
        product.purity,
        product.stock,
        product.makingCharges,
        product.deletedAt
    ))
    conn.commit()
    conn.close()
    return product

@app.put("/products/{product_id}", response_model=Product)
def update_product(product_id: str, product: Product):
    if product_id != product.id:
        raise HTTPException(status_code=400, detail="Product ID mismatch")
        
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    cursor.execute("SELECT id FROM products WHERE id = ?", (product_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Product not found")

    cursor.execute('''
        UPDATE products SET
            name = ?, sku = ?, category = ?, description = ?, images = ?, video = ?, 
            price = ?, weight = ?, purity = ?, stock = ?, makingCharges = ?, deletedAt = ?
        WHERE id = ?
    ''', (
        product.name,
        product.sku,
        product.category,
        product.description,
        json.dumps(product.images),
        product.video,
        product.price,
        product.weight,
        product.purity,
        product.stock,
        product.makingCharges,
        product.deletedAt,
        product_id
    ))
    conn.commit()
    conn.close()
    return product

@app.delete("/products/{product_id}")
def delete_product(product_id: str):
    # Soft delete is handled by update, but if we want a hard delete endpoint:
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM products WHERE id = ?", (product_id,))
    conn.commit()
    conn.close()
    return {"message": "Product deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
