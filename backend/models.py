from sqlalchemy import Column, Integer, String, Float, Text
try:
    from .database import Base
except ImportError:
    from database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    sku = Column(String, nullable=True)
    category = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    images = Column(Text, nullable=True) # Storing JSON string
    video = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    weight = Column(Float, nullable=True)
    purity = Column(String, nullable=True)
    stock = Column(Integer, nullable=True)
    makingCharges = Column(Float, nullable=True)
    deletedAt = Column(String, nullable=True)

class Settings(Base):
    __tablename__ = "settings"

    id = Column(String, primary_key=True, index=True) # Will be 'app_settings'
    gold_rates = Column(Text, nullable=False) # JSON string
    silver_rate = Column(Float, nullable=False)
    hero_image = Column(Text, nullable=False)
    categories = Column(Text, nullable=False) # JSON string
    purities = Column(Text, nullable=False) # JSON string
    showcase_categories = Column(Text, nullable=False) # JSON string
