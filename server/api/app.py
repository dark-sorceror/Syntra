import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import events

app = FastAPI(title = "Syntra Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:3000"],
    allow_methods = ["*"],
    allow_headers = ["*"],
)

app.include_router(events.router)

if __name__ == "__main__":
    os.system('cls')
    
    uvicorn.run(
        "__main__:app", 
        host = "127.0.0.1", 
        port = 8000, 
        reload = True,
        reload_dirs = ["../"]
    )