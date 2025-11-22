import os
import json
import numpy as np
import pandas as pd
from pathlib import Path

from src.components.data_preprocessing import sample_synthetic_data

OUTPUT_PATH = Path("../data/seed")

def build_samples():
    with open(OUTPUT_PATH / "synthetic_events.json", "r") as f:
        data = json.load(f)

    samples = sample_synthetic_data([item for sub in data for item in sub])

    df_samples = pd.DataFrame(samples)

    if len(df_samples) == 0:
        print("\nNo samples generated.")
        
        return

    df_samples.to_parquet(OUTPUT_PATH / "dataset.parquet", index = False)
    
    print(f"\nFiltered down to {len(df_samples):,} events ({os.path.getsize(OUTPUT_PATH / "dataset.parquet")/1000000:,.1f} MB)")
    print(f"Saved to {OUTPUT_PATH.resolve()}\\dataset.parquet")
    
    seqs = np.stack(df_samples["seq_intervals"].to_numpy())
    
    extra = np.vstack([
        df_samples["last_hour"].to_numpy(),
        df_samples["last_weekday"].to_numpy(),
        df_samples["last_duration"].to_numpy()
    ]).T
    
    x = np.hstack([seqs, extra])
    y = df_samples["label_next_interval"].to_numpy()

    np.save(OUTPUT_PATH / "x.npy", x)
    np.save(OUTPUT_PATH / "y.npy", y)
    
    print(f"Saved {OUTPUT_PATH.resolve()}\\x.npy {x.shape}")
    print(f"Saved {OUTPUT_PATH.resolve()}\\y.npy {y.shape}\n")
    
if __name__ == "__main__":
    build_samples()