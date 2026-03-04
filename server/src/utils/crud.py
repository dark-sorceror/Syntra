from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from src.models.db_models import Event, EventLog
from src.utils.schemas import EventCreate, EventUpdate

async def get_events(db: AsyncSession, user_id: int, start: datetime, end: datetime):
    # Strip timezones before querying
    start_naive = start.replace(tzinfo=None)
    end_naive = end.replace(tzinfo=None)
    
    result = await db.execute(
        select(Event).where(
            and_(Event.user_id == user_id,
                 Event.start_time >= start_naive,
                 Event.end_time <= end_naive)
        ).order_by(Event.start_time)
    )
    
    return result.scalars().all()

async def create_event(db: AsyncSession, user_id: int, data: EventCreate):
    data_dict = data.model_dump()
    
    # Strip timezones before inserting
    data_dict["start_time"] = data_dict["start_time"].replace(tzinfo=None)
    data_dict["end_time"] = data_dict["end_time"].replace(tzinfo=None)
    
    event = Event(user_id=user_id, **data_dict)
    db.add(event)
    
    await db.flush()
    
    log = EventLog(user_id=user_id, event_id=event.id, action="created")
    db.add(log)
    
    await db.commit()
    await db.refresh(event)
    
    return event

async def update_event(db: AsyncSession, event_id: int, user_id: int, data: EventUpdate):
    result = await db.execute(
        select(Event).where(and_(Event.id == event_id, Event.user_id == user_id))
    )
    event = result.scalar_one_or_none()
    
    if not event:
        return None
        
    data_dict = data.model_dump(exclude_none=True)
    
    # Strip timezones before updating
    if "start_time" in data_dict:
        data_dict["start_time"] = data_dict["start_time"].replace(tzinfo=None)
    if "end_time" in data_dict:
        data_dict["end_time"] = data_dict["end_time"].replace(tzinfo=None)
        
    for field, value in data_dict.items():
        setattr(event, field, value)
        
    log = EventLog(user_id=user_id, event_id=event_id, action="moved")
    db.add(log)
    
    await db.commit()
    await db.refresh(event)
    
    return event

async def delete_event(db: AsyncSession, event_id: int, user_id: int):
    result = await db.execute(
        select(Event).where(and_(Event.id == event_id, Event.user_id == user_id))
    )
    event = result.scalar_one_or_none()
    
    if not event:
        return False
    
    log = EventLog(user_id=user_id, event_id=event_id, action="deleted")
    db.add(log)
    
    await db.delete(event)
    await db.commit()
    
    return True