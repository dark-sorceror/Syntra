import json
import torch
import numpy as np
from pathlib import Path
from datetime import datetime

from src.components.data_preprocessing import SEQ_LEN
from src.components.model import IntervalPredictor

DATA_PATH = Path("../data/seed")

scale_input = lambda x, mean, scale: (x - mean) / scale

def cyclical_encoding(value: float, maxV: float) -> np.float64:
    # i.e. Make hour 23 adjacent to 0 recognized through a circle
    sinc = np.sin(2 * np.pi * value / maxV)
    cosc = np.cos(2 * np.pi * value / maxV)
    
    return sinc, cosc

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
    
def prediction_for_user(user: int, habit: str, re: bool = False, compact: bool = False) -> float:
    with open(DATA_PATH / 'synthetic_events.json', 'r') as f:
        data = json.load(f)
        
    events = [data[user][i] for i in range(len(data[user])) if data[user][i]["event_title"] == habit]
    
    last_start = datetime.fromisoformat(events[0]["start"])
    last_end = datetime.fromisoformat(events[0]["end"])
    
    last_hour = last_start.hour + last_start.minute / 60 + last_start.second / 3600
    last_weekday = last_start.weekday()
    last_duration = (last_end - last_start).total_seconds() / (3600 * 24)

    last_hour_sin, last_hour_cos = cyclical_encoding(last_hour, 24.0)
    last_weekday_sin, last_weekday_cos = cyclical_encoding(last_weekday, 7.0)
    
    features = [
        round(float(last_hour_sin), 4), 
        round(float(last_hour_cos), 4), 
        round(float(last_weekday_sin), 4), 
        round(float(last_weekday_cos), 4), 
        round(float(last_duration), 4)
    ]
    
    intervals = []
    
    for i in range(SEQ_LEN + 1):
        previous_start = datetime.fromisoformat(events[i + 1]["start"])
        current_start = datetime.fromisoformat(events[i]["start"])
            
        intervals.append((current_start - previous_start).total_seconds() / (3600 * 24))
        
    intervals = intervals[::-1]
    
    actual = intervals.pop()
    sample = np.array([intervals + features])
    predicted = predict(sample)[0][0]
    error = abs(actual - predicted) / actual
    
    if re: return float(error)
    
    if compact:
        print(f"Accuracy: {((1 - error) * 100):,.2f}%\n---")
        
        return
    
    print(f"\n===\n\nPrevious {SEQ_LEN} intervals: {[round(i, 4) for i in intervals]}")
    print(f"Features: {features}\n")
    print(f"Predicted next habit occurence: {predicted:,.4f} days")
    print(f"Actual next habit occurence: {actual:,.4f} days")
    print(f"Percentage Error: {(error * 100):,.2f}%")
    print(f"Accuracy: {((1 - error) * 100):,.2f}%")
    
def average_prediction_error() -> None:
    with open(DATA_PATH / 'synthetic_events.json', 'r') as f:
        data = json.load(f)
    
    total_error = []
    
    for i in range(len(data)):
        try:
            error = prediction_for_user(i, "Study", re = True) + prediction_for_user(i, "Gym", re = True)
            total_error.append(error)
        except Exception: continue

    return sum(total_error) / (len(total_error) * 2)

    # BUG: Unfit list indexes; inconsistent data generation
    
if __name__ == "__main__":
    average_prediction_error = average_prediction_error()
    prediction_for_user(0, "Study")
    prediction_for_user(0, "Gym")
    
    print(f"\n===\n\nAverage prediction error for user: {(average_prediction_error * 100):.2f}%")
    print(f"Average Accuracy: {((1 - average_prediction_error) * 100):.2f}%\n")