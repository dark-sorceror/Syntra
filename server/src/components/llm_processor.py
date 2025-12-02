import torch
import asyncio
from peft import PeftModel
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig, TextStreamer

BASE_MODEL = "microsoft/Phi-3-mini-4k-instruct"
OUTPUT_PATH = "../event_llm_v2"
SYSTEM_PROMPT = "You are a helpful and expert event management assistant. Your goal is to provide concise, structured, and professional advice on planning and executing events. \
\nIn the first line of your response, answer with the format you were trained with: \n<|assistant|>\nintent:\nday_of_week:\nevent_type:<|end|> \
\nPlease make sure day_of_week is the full date (day, month, year). Then respond letting the user know whether the event was created or if any other details are needed"

class PromptRequest(BaseModel):
    user_prompt: str
    
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

def sync_generate(user_prompt: str, output_queue: asyncio.Queue):
    if model is None or tokenizer is None:
        output_queue.put_nowait("ERROR: Model not loaded or initialized.")
        output_queue.put_nowait(None)
         
        return
     
    formatted_input = (
        f"<|system|>\n{SYSTEM_PROMPT}<|end|>\n"
        f"<|user|>\n{user_prompt}<|end|>\n"
        f"<|assistant|>"
    )
    
    try:
        inputs = tokenizer(
            formatted_input, 
            return_tensors = "pt", 
            padding = True
        ).to(model.device)

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