from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
from sqlalchemy.orm import Session
from . import models, database

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class ProductBase(BaseModel):
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

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    class Config:
        orm_mode = True

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/products", response_model=List[Product])
def get_products(db: Session = Depends(get_db)):
    products = db.query(models.Product).all()
    # Convert images string back to list for Pydantic
    for p in products:
        if p.images:
            p.images = json.loads(p.images)
        else:
            p.images = []
    return products

@app.post("/products", response_model=Product)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product.id).first()
    if db_product:
        raise HTTPException(status_code=400, detail="Product with this ID already exists")
    
    new_product = models.Product(
        id=product.id,
        name=product.name,
        sku=product.sku,
        category=product.category,
        description=product.description,
        images=json.dumps(product.images), # Store as JSON string
        video=product.video,
        price=product.price,
        weight=product.weight,
        purity=product.purity,
        stock=product.stock,
        makingCharges=product.makingCharges,
        deletedAt=product.deletedAt
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    
    # Convert for response
    new_product.images = json.loads(new_product.images)
    return new_product

@app.put("/products/{product_id}", response_model=Product)
def update_product(product_id: str, product: ProductCreate, db: Session = Depends(get_db)):
    if product_id != product.id:
        raise HTTPException(status_code=400, detail="Product ID mismatch")
        
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    db_product.name = product.name
    db_product.sku = product.sku
    db_product.category = product.category
    db_product.description = product.description
    db_product.images = json.dumps(product.images)
    db_product.video = product.video
    db_product.price = product.price
    db_product.weight = product.weight
    db_product.purity = product.purity
    db_product.stock = product.stock
    db_product.makingCharges = product.makingCharges
    db_product.deletedAt = product.deletedAt

    db.commit()
    db.refresh(db_product)
    
    db_product.images = json.loads(db_product.images)
    return db_product

@app.delete("/products/{product_id}")
def delete_product(product_id: str, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
