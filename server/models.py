from datetime import datetime

from pydantic import BaseModel

class EventModel(BaseModel):
    user_id: str
    event_title: str
    start: datetime
    end: datetime
    category: str
    
class HabitModel(BaseModel):
    count: int
    days: list[int]
    start_times: list[int]
    durations: list[int]
    
class HabitPatternModel(BaseModel):
    frequency: int
    average_start_time: float
    average_duration_hours: float
    usual_days_of_week: list[int]
    consistency_score: float