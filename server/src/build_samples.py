import json

import numpy as np
import pandas as pd

from pathlib import Path

from sample_data import sample_synthetic_data

OUTPUT = Path("./server/data/seed")

def build_samples():
    with open(OUTPUT / "synthetic_events.json", "r") as f:
        data = json.load(f)

    samples = sample_synthetic_data([item for sub in data for item in sub])

    df_samples = pd.DataFrame(samples)

    if len(df_samples) == 0:
        print("No samples generated.")
        
        return

    df_samples.to_parquet(OUTPUT / "dataset.parquet", index = False)
    
    print(f"Saved data/seed/dataset.parquet with {len(df_samples)} samples")
    
    seqs = np.stack(df_samples["seq_intervals"].to_numpy())
    
    extra = np.vstack([
        df_samples["last_hour"].to_numpy(),
        df_samples["last_weekday"].to_numpy(),
        df_samples["last_duration"].to_numpy()
    ]).T
    
    x = np.hstack([seqs, extra])
    y = df_samples["label_next_interval"].to_numpy()

    np.save(OUTPUT / "x.npy", x)
    np.save(OUTPUT / "y.npy", y)
    
    print(f"Saved x.npy {x.shape}\nSaved y.npy {y.shape}")
    
if __name__ == "__main__":
    build_samples()