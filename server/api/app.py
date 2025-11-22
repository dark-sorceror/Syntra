import os
import logging
import logging.config
import coloredlogs
import yaml
import uvicorn
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.data_schemas import EventModel
from src.components.features import extract_patterns

CONFIG_PATH = Path("../config")
LOG_PATH = Path("../logs")

BASE_URL = "http://localhost:8000"

db = {
    "events": [],
    "models": {}
}

app = FastAPI(
    title = "Syntra Backend",
    description = "Prediction models and database handling",
    version = "1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins = [
        "http://localhost:3000"
    ],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

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

def setup_logging(config_path = CONFIG_PATH, log_path = LOG_PATH):
    if not os.path.exists(log_path): os.makedirs(log_path)
    
    try:
        with open(config_path, "rt") as f:
            config = yaml.safe_load(f.read())
        
        logging.config.dictConfig(config = config)
        coloredlogs.install()
        logging.info("Logging configured successfully.")
        logging.info(f"Logging to {log_path.resolve()}")
        
    except Exception as e:
        logging.basicConfig(level = logging.INFO)
        coloredlogs.install(level = logging.INFO)
        
        logging.error(f"Logging configuration failed:\n{e}")
        logging.warning("Falling back to basic console logging.")

if __name__ == "__main__":
    os.system('cls')
    
    setup_logging(
        config_path = CONFIG_PATH / 'logging.yaml',
        log_dir = LOG_PATH
    )
    
    with open(CONFIG_PATH / 'config.yaml', "rt") as f:
        config = yaml.safe_load(f)
        
    SERVER_PORT = config['app']['port']
    
    uvicorn.run(
        "__main__:app", 
        host = "127.0.0.1", 
        port = SERVER_PORT, 
        reload = True,
        reload_dirs = ["../"]
    )