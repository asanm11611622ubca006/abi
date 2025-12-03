from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
from sqlalchemy.orm import Session
try:
    from . import models, database
except ImportError:
    import models, database

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

class SettingsBase(BaseModel):
    gold_rates: Dict[str, float]
    silver_rate: float
    hero_image: str
    categories: List[str]
    purities: List[str]
    showcase_categories: List[Dict[str, Any]]

class Settings(SettingsBase):
    id: str
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

@app.get("/settings", response_model=Settings)
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(models.Settings).filter(models.Settings.id == 'app_settings').first()
    if not settings:
        # Return default settings if not found (or create them)
        return Settings(
            id='app_settings',
            gold_rates={'22K': 6650, '24K': 7255},
            silver_rate=95,
            hero_image='https://picsum.photos/id/13/1920/1080',
            categories=['Gold', 'Silver', 'Covering'],
            purities=['24K', '22K', '92.5 Sterling'],
            showcase_categories=[
                {'name': 'Gold', 'image': 'https://images.unsplash.com/photo-1610375461490-67a3386e9ec0?q=80&w=300&auto=format&fit=crop'},
                {'name': 'Silver', 'image': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=300&auto=format&fit=crop'},
                {'name': 'Covering', 'image': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=300&auto=format&fit=crop'}
            ]
        )
    
    # Parse JSON fields
    return Settings(
        id=settings.id,
        gold_rates=json.loads(settings.gold_rates),
        silver_rate=settings.silver_rate,
        hero_image=settings.hero_image,
        categories=json.loads(settings.categories),
        purities=json.loads(settings.purities),
        showcase_categories=json.loads(settings.showcase_categories)
    )

@app.put("/settings", response_model=Settings)
def update_settings(settings: SettingsBase, db: Session = Depends(get_db)):
    db_settings = db.query(models.Settings).filter(models.Settings.id == 'app_settings').first()
    
    if not db_settings:
        db_settings = models.Settings(id='app_settings')
        db.add(db_settings)
    
    db_settings.gold_rates = json.dumps(settings.gold_rates)
    db_settings.silver_rate = settings.silver_rate
    db_settings.hero_image = settings.hero_image
    db_settings.categories = json.dumps(settings.categories)
    db_settings.purities = json.dumps(settings.purities)
    db_settings.showcase_categories = json.dumps(settings.showcase_categories)
    
    db.commit()
    db.refresh(db_settings)
    
    return Settings(
        id=db_settings.id,
        gold_rates=json.loads(db_settings.gold_rates),
        silver_rate=db_settings.silver_rate,
        hero_image=db_settings.hero_image,
        categories=json.loads(db_settings.categories),
        purities=json.loads(db_settings.purities),
        showcase_categories=json.loads(db_settings.showcase_categories)
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
