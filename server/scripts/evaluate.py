import torch
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from src.components.model import IntervalPredictor

pd.set_option('display.max_rows', None)

scale_input = lambda x, mean, scale: (x - mean) / scale

if __name__ == "__main__":
    DATA = Path("../data/seed")

    df = pd.read_parquet(DATA / "dataset.parquet")

    mean = np.load(DATA / "scaler_mean.npy")
    scale = np.load(DATA / "scaler_scale.npy")
    
    input_size = scale.shape[0]
    
    model = IntervalPredictor(input_size)
    model.load_state_dict(torch.load("../models/FNN_model.pth"))
    model.eval()

    pred_rows = []
    percentage = 0

    for i, row in df.iterrows():        
        seqs = np.stack(row["seq_intervals"])

        x = np.array([
            *seqs,
            row["last_hour"],
            row["last_weekday"],
            row["last_duration"]
        ])

        x_scaled = scale_input(x, mean, scale)
        t = torch.tensor(x_scaled, dtype = torch.float32)

        with torch.no_grad():
            pred = model(t).item()
            
        error = pred - row["label_next_interval"]
        percentage += 1 - (error) / row["label_next_interval"] 

        pred_rows.append({
            "user_id": row["user_id"],
            "event_title": row["event_title"],
            "actual": row["label_next_interval"],
            "predicted": pred,
            "error":  error,
        })

    df_preds = pd.DataFrame(pred_rows)
    
    print(df_preds)

    mae = mean_absolute_error(df_preds["actual"], df_preds["predicted"])
    rmse = np.sqrt(mean_squared_error(df_preds["actual"], df_preds["predicted"]))
    r2 = r2_score(df_preds["actual"], df_preds["predicted"])
    total_percentage = percentage / df_preds.shape[0] * 100

    print("\n=== Model Accuracy ===")
    print(f"MAE : {mae:.4f} days")
    print(f"RMSE: {rmse:.4f} days")
    print(f"R²  : {r2:.4f}")
    print(f"%   : {total_percentage:.4f} %\n")