from datetime import datetime
from pydantic import BaseModel

from src.models.db_models import EventCategory

class EventCreate(BaseModel):
    title: str
    category: EventCategory
    start_time: datetime
    end_time: datetime

class EventUpdate(BaseModel):
    title: str | None = None
    category: EventCategory | None = None
    start_time: datetime | None = None
    end_time: datetime | None = None

class EventOut(BaseModel):
    id: int
    user_id: int
    title: str
    category: EventCategory
    start_time: datetime
    end_time: datetime
    created_at: datetime

    model_config = {"from_attributes": True}

class AgentRequest(BaseModel):
    user_id: int
    message: str