import os
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import PeftModel

BASE_MODEL = "microsoft/Phi-3-mini-4k-instruct"
OUTPUT_PATH = "./event_llm_v2" 
SYSTEM_PROMPT = "You are a helpful and expert event management assistant. Your goal is to provide concise, structured, and professional advice on planning and executing events. \
                In the first line of your response, answer with the format you were trained with: \n<|assistant|>\nintent:\nday_of_week:\nevent_type:<|end|> \
                Please make sure day_of_week is the full date (day, month, year). Then respond letting the user know whether the event was created or if any other details are needed"

def load_model_for_chat(base_model_id, adapter_path):
    print("Loading tokenizer...")
    
    tokenizer = AutoTokenizer.from_pretrained(adapter_path)
    
    bnb_config = BitsAndBytesConfig(
        load_in_4bit = True,
        bnb_4bit_quant_type = "nf4",
        bnb_4bit_use_double_quant = True,
        bnb_4bit_compute_dtype = torch.float16,
    )

    print(f"Loading base model ({base_model_id}) with 4-bit quantization...")
    
    base_model = AutoModelForCausalLM.from_pretrained(
        base_model_id,
        quantization_config = bnb_config,
        device_map = "auto"
    )

    print(f"Attaching and merging adapter weights from {adapter_path}...")
    
    model = PeftModel.from_pretrained(base_model, adapter_path)
    model = model.merge_and_unload() 
    model.eval()
    
    print("Ready")
    
    return model, tokenizer

def chat(model, tokenizer):
    os.system('cls')
    
    print("AI: Ask me anything")
    
    while True:
        try:
            user_input = input("\n>>> ")

            if user_input.lower() in ['quit', 'exit']:
                break
            
            formatted_input = (
                f"<|system|>\n{SYSTEM_PROMPT}<|end|>\n"
                f"<|user|>\n{user_input}<|end|>\n"
                f"<|assistant|>"
            )
            
            inputs = tokenizer(
                formatted_input, 
                return_tensors = "pt", 
                padding = True
            ).to("cuda")
            
            with torch.no_grad():
                outputs = model.generate(
                    **inputs,
                    max_new_tokens = 512,
                    do_sample = True,
                    temperature = 0.7,
                    top_p = 0.95,
                    pad_token_id = tokenizer.eos_token_id
                )
                
            response = tokenizer.decode(
                outputs[0], 
                skip_special_tokens = False
            )
            
            assistant_start_tag = "<|assistant|>"
            
            response = response.split(assistant_start_tag)[-1].split("<|end|>")[0].strip()
            
            print(f"\nAI: {response}")

        except Exception as e:
            print(f"\nAn error occurred: {e}")
            
            break

if __name__ == "__main__":
    os.system('cls')
    
    try:
        model, tokenizer = load_model_for_chat(BASE_MODEL, OUTPUT_PATH)
        chat(model, tokenizer)
    except RuntimeError as e:
        print("EROR: ", e)