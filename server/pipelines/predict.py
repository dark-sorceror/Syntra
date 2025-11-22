import json
import torch
import numpy as np
from pathlib import Path
from datetime import datetime

from src.components.data_preprocessing import SEQ_LEN
from src.components.model import IntervalPredictor

DATA_PATH = Path("../data/seed")

scale_input = lambda x, mean, scale: (x - mean) / scale

def predict(x: np.ndarray) -> np.ndarray:
    mean = np.load(DATA_PATH / "scaler_mean.npy")
    scale = np.load(DATA_PATH / "scaler_scale.npy")
    
    x_scale = scale_input(x, mean, scale)
    x_tensor = torch.tensor(x_scale, dtype = torch.float32)
    
    model = IntervalPredictor(input_size = x.shape[1])
    model.load_state_dict(torch.load("../models/FNN_model.pth", map_location = "cpu"))
    model.eval()
    
    with torch.no_grad():
        output = model(x_tensor)
        
        return output.numpy()
    
if __name__ == "__main__":
    # Test 1 - User 0000 Study Habits
    with open(DATA_PATH / 'synthetic_events.json', 'r') as f:
        data = json.load(f)
    
    habit = "Study"
    events = [data[0][i] for i in range(len(data[0])) if data[0][i]["event_title"] == habit]
    
    last_start = datetime.fromisoformat(events[0]["start"])
    last_end = datetime.fromisoformat(events[0]["end"])
    
    last_hour = last_start.hour + last_start.minute / 60 + last_start.second / 3600
    last_weekday = last_start.weekday()
    last_duration = (last_end - last_start).total_seconds() / (3600 * 24)
    
    features = [float(last_hour), last_weekday, float(last_duration)]
    
    intervals = []
    
    for i in range(SEQ_LEN + 1):
        previous_start = datetime.fromisoformat(events[i + 1]["start"])
        current_start = datetime.fromisoformat(events[i]["start"])
            
        intervals.append((current_start - previous_start).total_seconds() / (3600 * 24))
        
    intervals = intervals[::-1]
    
    actual = intervals.pop()
    sample = np.array([intervals + features])
    predicted = predict(sample)[0][0]
    error = abs(actual - predicted) / actual * 100
    
    print(f"\nPredicted next habit occurence: {predicted:,.4f} days")
    print(f"Actual next habit occurence: {actual} days")
    print(f"Percentage Error: {error:,.2f}%\n")