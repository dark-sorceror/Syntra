import torch
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from src.components.model import IntervalPredictor

pd.set_option('display.max_rows', None)

scale_input = lambda x, mean, scale: (x - mean) / scale

def cyclical_encoding(value: float, maxV: float) -> np.float64:
    # i.e. Make hour 23 adjacent to 0 recognized through a circle
    sinc = np.sin(2 * np.pi * value / maxV)
    cosc = np.cos(2 * np.pi * value / maxV)
    
    return sinc, cosc

if __name__ == "__main__":
    DATA = Path("../data/seed")

    df = pd.read_parquet(DATA / "dataset.parquet")

    mean = np.load(DATA / "scaler_mean.npy")
    scale = np.load(DATA / "scaler_scale.npy")
    
    input_size = scale.shape[0]
    
    model = IntervalPredictor(input_size)
    model.load_state_dict(torch.load("../models/FNN_model.pth"))
    model.eval()
    
    percentage = 0

    seqs = np.stack(df["seq_intervals"])
    
    hour = df["last_hour"].to_numpy()
    hour_sin, hour_cos = cyclical_encoding(hour, 24.0)
    
    weekday = df["last_weekday"].to_numpy()
    weekday_sin, weekday_cos = cyclical_encoding(weekday, 7.0)
    
    duration = df["last_duration"].to_numpy()
    
    extra = np.vstack([
        hour_sin, 
        hour_cos, 
        weekday_sin, 
        weekday_cos, 
        duration
    ]).T
    
    x = np.hstack([seqs, extra])

    x_scaled = scale_input(x, mean, scale)
    t = torch.tensor(x_scaled, dtype = torch.float32)

    model.eval()
    with torch.no_grad():
        pred = model(t).detach().numpy().flatten()
        
    error = pred - df["label_next_interval"]

    df_preds = pd.DataFrame({
        "user_id": df["user_id"],
        "event_title": df["event_title"],
        "actual": df["label_next_interval"],
        "predicted": pred,
        "error":  error
    })

    mae = mean_absolute_error(df_preds["actual"], df_preds["predicted"])
    rmse = np.sqrt(mean_squared_error(df_preds["actual"], df_preds["predicted"]))
    r2 = r2_score(df_preds["actual"], df_preds["predicted"])
    mean_percentage = (1 - np.abs(error)).mean() * 100
    
    print(df_preds)

    print("\n=== Model Accuracy ===")
    print(f"MAE : {mae:.4f} days")
    print(f"RMSE: {rmse:.4f} days")
    print(f"R²  : {r2:.4f}")
    print(f"%   : {mean_percentage:.4f} %\n")
    
    # TODO: Add evaluation of feature significance