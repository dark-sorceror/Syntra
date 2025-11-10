import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/test")
def test_button():
    return {"response": "Backend is working"}

@app.post("/api/ai-suggest")
def ai_suggest():
    return {
        "suggestion": "Study 28 hours a day", 
        "confidence": 0.85
    }

if __name__ == "__main__":
    uvicorn.run("__main__:app", host="127.0.0.1", port=8000)