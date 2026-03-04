import enum
from datetime import datetime
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.utils.db import Base

class EventCategory(str, enum.Enum):
    work = "work"
    personal = "personal"
    health = "health"
    social = "social"
    focus = "focus"

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key = True)
    email: Mapped[str] = mapped_column(String, unique = True, nullable = False)
    name: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, default = datetime.utcnow)

    events: Mapped[list["Event"]] = relationship(back_populates = "user")
    logs: Mapped[list["EventLog"]] = relationship(back_populates = "user")

class Event(Base):
    __tablename__ = "events"
    id: Mapped[int] = mapped_column(Integer, primary_key = True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable = False)
    title: Mapped[str] = mapped_column(String, nullable = False)
    category: Mapped[EventCategory] = mapped_column(Enum(EventCategory))
    start_time: Mapped[datetime] = mapped_column(DateTime, nullable = False)
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable = False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default = datetime.utcnow)

    user: Mapped["User"] = relationship(back_populates = "events")
    logs: Mapped[list["EventLog"]] = relationship(back_populates = "event")

class EventLog(Base):
    __tablename__ = "event_logs"
    id: Mapped[int] = mapped_column(Integer, primary_key = True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"), nullable = True)
    action: Mapped[str] = mapped_column(String)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default = datetime.utcnow)

    user: Mapped["User"] = relationship(back_populates = "logs")
    event: Mapped["Event"] = relationship(back_populates=  "logs")

class MLPrediction(Base):
    __tablename__ = "ml_predictions"
    id: Mapped[int] = mapped_column(Integer, primary_key = True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    event_type: Mapped[str] = mapped_column(String)
    suggested_start: Mapped[datetime] = mapped_column(DateTime)
    confidence: Mapped[float] = mapped_column(Float)
    accepted: Mapped[bool] = mapped_column(default = False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default = datetime.utcnow)