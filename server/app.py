import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import EventModel
from pattern_recognition import extract_patterns

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
    "events": [],
    "models": {}
}

@app.get("/api/test")
def test_button():
    return {
        "response": "Backend is working"
    }

@app.post("/api/ai-suggest")
def ai_suggest():
    return {
        "suggestion": "Study 28 hours a day", 
        "confidence": 0.85
    }
    
@app.post("/events")
def add_event(event: EventModel):
    db["events"].append(event.model_dump())
    
    return {
        "status": "ok", 
        "count": len(db["events"])
    }

@app.get("/events")
def get_events():
    return {
        "events": db["events"], 
        "count": len(db["events"])
    }
    
@app.get('/extract/{user_id}')
def extract(user_id: str):
    response = extract_patterns(user_id, db)
    
    if not response:
        return {
            "message": "Model pattern analyzed",
            "user_id": user_id,
            "habits": db["models"].get(
                user_id, 
                {
                    "message": "Error occured"
                }
            )
        }
        
    return response
    
@app.get("/db")
def database():
    return db

if __name__ == "__main__":
    uvicorn.run(
        "__main__:app", 
        host = "127.0.0.1", 
        port = 8000, 
        reload = True
    )