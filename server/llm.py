import os
import torch
from datasets import load_dataset
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments, BitsAndBytesConfig
from trl import SFTTrainer
from peft import LoraConfig, prepare_model_for_kbit_training

os.environ["TORCH_USE_REENTRANT"] = "False"

# Loading the lightest model :skull:
# https://huggingface.co/microsoft/Phi-3-mini-4k-instruct
# ~ 3.3 Billion parameters
BASE_MODEL = "microsoft/Phi-3-mini-4k-instruct"
DATASET_PATH = "data.jsonl"
OUTPUT_PATH = "./event_llm_v2"

EPOCHS = 3
LR = 2e-4
BATCH_SIZE = 1
GRAD_ACCUM = 8

def load_model_and_tokenizer():
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
    tokenizer.pad_token = tokenizer.eos_token
    
    bnb_config = BitsAndBytesConfig(
        load_in_4bit = True,
        bnb_4bit_quant_type = "nf4",
        bnb_4bit_use_double_quant = True,
        bnb_4bit_compute_dtype = torch.float16,
    )
    
    model = AutoModelForCausalLM.from_pretrained(
        BASE_MODEL,
        quantization_config = bnb_config,
        device_map = "auto",
    )
    
    model = prepare_model_for_kbit_training(model)
    
    # model.to("cuda")

    return model, tokenizer

def get_lora_config():
    return LoraConfig(
        r = 8,
        lora_alpha = 16,
        lora_dropout = 0.05,
        bias = "none",
        task_type = "CAUSAL_LM",
        target_modules = ["q_proj", "k_proj", "v_proj", "o_proj",
                        "gate_proj", "down_proj", "up_proj"]
    )

def get_training_args():
    return TrainingArguments(
        output_dir = OUTPUT_PATH,
        num_train_epochs = EPOCHS,
        per_device_train_batch_size = BATCH_SIZE,
        gradient_accumulation_steps = GRAD_ACCUM,
        learning_rate = LR,
        save_strategy = "epoch",
        logging_steps = 10,
        fp16 = True,
        bf16 = False,
        report_to = "tensorboard",
        ddp_find_unused_parameters = False,
        fsdp = None,
        optim = "paged_adamw_8bit"
    )

def setup_trainer():
    dataset = load_dataset("json", data_files = DATASET_PATH, split = "train")

    model, tokenizer = load_model_and_tokenizer()
    lora_config = get_lora_config()
    training_args = get_training_args()

    trainer = SFTTrainer(
        model = model,
        args = training_args,
        train_dataset = dataset,
        processing_class = tokenizer,
        peft_config = lora_config,
    )

    trainer.train()
    
    trainer.model.save_pretrained(OUTPUT_PATH)
    tokenizer.save_pretrained(OUTPUT_PATH)

    print("Training completed!")

if __name__ == "__main__":
    setup_trainer()