from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from src.utils.db import get_db
import src.utils.crud as crud, src.utils.schemas as schemas

router = APIRouter(prefix = "/events", tags = ["events"])

@router.get("/", response_model = list[schemas.EventOut])
async def list_events(
    user_id: int = Query(...),
    start: datetime = Query(...),
    end: datetime = Query(...),
    db: AsyncSession = Depends(get_db)
):
    return await crud.get_events(db, user_id, start, end)

@router.post("/", response_model = schemas.EventOut, status_code = 201)
async def create_event(
    user_id: int = Query(...),
    data: schemas.EventCreate = ...,
    db: AsyncSession = Depends(get_db)
):
    return await crud.create_event(db, user_id, data)

@router.patch("/{event_id}", response_model = schemas.EventOut)
async def update_event(
    event_id: int,
    user_id: int = Query(...),
    data: schemas.EventUpdate = ...,
    db: AsyncSession = Depends(get_db)
):
    event = await crud.update_event(db, event_id, user_id, data)
    
    if not event:
        raise HTTPException(404, "Event not found")
    
    return event

@router.delete("/{event_id}", status_code=204)
async def delete_event(
    event_id: int,
    user_id: int = Query(...),
    db: AsyncSession = Depends(get_db)
):
    deleted = await crud.delete_event(db, event_id, user_id)
    
    if not deleted:
        raise HTTPException(404, "Event not found")