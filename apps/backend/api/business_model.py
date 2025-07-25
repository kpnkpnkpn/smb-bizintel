from datetime import datetime
from typing import Optional
import uuid
from sqlalchemy import Column, String, Integer, Numeric, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base
from pydantic import BaseModel, Field

Base = declarative_base()

class BusinessORM(Base):
    __tablename__ = 'businesses'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False, default='TX')
    zipCode = Column(String, nullable=False)
    latitude = Column(Numeric, nullable=False)
    longitude = Column(Numeric, nullable=False)
    website = Column(String, nullable=True)
    phoneNumber = Column(String, nullable=True)
    ownerName = Column(String, nullable=True)
    yearStarted = Column(Integer, nullable=True)
    starRating = Column(Numeric, nullable=True)
    reviewCount = Column(Integer, nullable=True)
    naicsCode = Column(String, nullable=True)
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Business(BaseModel):
    id: uuid.UUID
    name: str
    address: str
    city: str
    state: str = 'TX'
    zipCode: str
    latitude: float
    longitude: float
    website: Optional[str] = None
    phoneNumber: Optional[str] = None
    ownerName: Optional[str] = None
    yearStarted: Optional[int] = None
    starRating: Optional[float] = None
    reviewCount: Optional[int] = None
    naicsCode: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime

    class Config:
        orm_mode = True 