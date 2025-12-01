import os
import logging
import asyncio
import logging.config
import coloredlogs
import yaml
import uvicorn
import torch
from pathlib import Path
from peft import PeftModel
from pydantic import BaseModel
from typing import AsyncGenerator
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.concurrency import run_in_threadpool
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig, TextStreamer

from src.data_schemas import EventModel
from src.components.features import extract_patterns

BASE_MODEL = "microsoft/Phi-3-mini-4k-instruct"
OUTPUT_PATH = "../event_llm_v2"
SYSTEM_PROMPT = "You are a helpful and expert event management assistant. Your goal is to provide concise, structured, and professional advice on planning and executing events. \
\nIn the first line of your response, answer with the format you were trained with: \n<|assistant|>\nintent:\nday_of_week:\nevent_type:<|end|> \
\nPlease make sure day_of_week is the full date (day, month, year). Then respond letting the user know whether the event was created or if any other details are needed"

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

class PromptRequest(BaseModel):
    user_prompt: str

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

# Is there a better way to do this?
print("Loading tokenizer...")

tokenizer = AutoTokenizer.from_pretrained(OUTPUT_PATH)

bnb_config = BitsAndBytesConfig(
    load_in_4bit = True,
    bnb_4bit_quant_type = "nf4",
    bnb_4bit_use_double_quant = True,
    bnb_4bit_compute_dtype = torch.float16,
)

print(f"Loading base model ({BASE_MODEL}) with 4-bit quantization...")

base_model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL,
    quantization_config = bnb_config,
    device_map = "auto"
)

print(f"Attaching and merging adapter weights from {OUTPUT_PATH}...")

model = PeftModel.from_pretrained(base_model, OUTPUT_PATH)
model = model.merge_and_unload() 
model.eval()

print("Ready")

def sync_generate(formatted_input: str, output_queue: asyncio.Queue):
    try:
        inputs = tokenizer(
            formatted_input, 
            return_tensors = "pt", 
            padding = True
        ).to(model.device)

        # Temporary method taken from the internet
        class QueueStreamer(TextStreamer):
            def __init__(self, tokenizer, queue, skip_prompt=True, **kwargs):
                super().__init__(tokenizer, skip_prompt=skip_prompt, **kwargs)
                self.queue = queue
                
            def on_finalized_text(self, text: str):
                self.queue.put_nowait(text)

            def on_start_generate(self):
                self.queue.put_nowait("START_GENERATION")

            def on_generate(self, token_ids: torch.LongTensor):
                new_tokens = token_ids[-1]
                decoded_text = self.tokenizer.decode(
                    new_tokens, 
                    skip_special_tokens=False
                )
                self.queue.put_nowait(decoded_text)

        streamer = QueueStreamer(
            tokenizer = tokenizer, 
            queue = output_queue, 
            skip_prompt = True
        )

        with torch.no_grad():
            model.generate(
                **inputs,
                max_new_tokens = 512,
                do_sample = True,
                temperature = 0.7,
                top_p = 0.95,
                pad_token_id = tokenizer.eos_token_id,
                streamer = streamer
            )

    except Exception as e:
        print(f"Generation Thread Error: {e}")
        
        output_queue.put_nowait(f"ERROR: {e}")
    finally:
        output_queue.put_nowait(None) 
        
async def stream_from_queue(output_queue: asyncio.Queue) -> AsyncGenerator[bytes, None]:
    first_item = await output_queue.get()
    
    if first_item != "START_GENERATION":
        yield first_item.encode("utf-8")
        
    while True:
        token = await output_queue.get()
        
        if token is None:
            break
        
        if str(token).startswith("ERROR:"):
            raise HTTPException(status_code=500, detail=token)
            
        yield token.encode("utf-8")
        
@app.post("/internal_stream")
async def stream_chat(request: PromptRequest):
    if model is None or tokenizer is None:
        raise HTTPException(status_code=503, detail="Model not loaded.")
    
    formatted_input = (
        f"<|system|>\n{SYSTEM_PROMPT}<|end|>\n"
        f"<|user|>\n{request.user_prompt}<|end|>\n"
        f"<|assistant|>"
    )
    
    output_queue = asyncio.Queue()
    
    await run_in_threadpool(sync_generate, formatted_input, output_queue)
    
    return StreamingResponse(
        stream_from_queue(output_queue), 
        media_type="text/plain"
    )

if __name__ == "__main__":
    os.system('cls')
    
    setup_logging(
        config_path = CONFIG_PATH / 'logging.yaml',
        log_path = LOG_PATH
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