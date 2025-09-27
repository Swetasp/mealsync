from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class Family(BaseModel):
    address: str
    school_name: str
    family_size: int
    contact_email: str
    contact_phone: Optional[str] = None
    preferred_language: str = "en"
    children_ages: List[int] = []
    created_at: datetime = datetime.utcnow()

class MealSite(BaseModel):
    id: str
    name: str
    address: str
    phone: Optional[str] = None
    meal_types: List[str] = []
    accessibility: List[str] = []

class Application(BaseModel):
    family_id: str
    status: str = "pending"

class Notification(BaseModel):
    family_id: str
    message: str
