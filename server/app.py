import uvicorn
from datetime import datetime, timedelta, time

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_URL = "http://localhost:8000"

db = {
    "events": []
}

class Event(BaseModel):
    user_id: str
    event_title: str
    start: datetime
    end: datetime
    category: str

@app.get("/api/test")
def test_button():
    return {"response": "Backend is working"}

@app.post("/api/ai-suggest")
def ai_suggest():
    return {
        "suggestion": "Study 28 hours a day", 
        "confidence": 0.85
    }
    
@app.post("/events")
def add_event(event: Event):
    db["events"].append(event.model_dump())
    
    return {"status": "ok", "count": len(db["events"])}

@app.get("/events")
def get_events():
    return {
        "events": db["events"], 
        "count": len(db["events"])
    }

if __name__ == "__main__":
    uvicorn.run("__main__:app", host="127.0.0.1", port=8000)