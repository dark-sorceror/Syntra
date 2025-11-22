import torch
from torch.utils.data import DataLoader, TensorDataset
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from pathlib import Path

from src.components.trainer import Trainer
from src.components.model import IntervalPredictor

def split_data(x, y, train = 0.8, val = 0.1):
    x_train, x_temp, y_train, y_temp = train_test_split(x, y, test_size = 1 - train)
    val_ratio = val / (1 - train)
    x_val, x_test, y_val, y_test = train_test_split(x_temp, y_temp, test_size = 1 - val_ratio)
    
    return x_train, x_val, x_test, y_train, y_val, y_test

if __name__ == "__main__":
    DATA_PATH = Path("../data/seed")

    x = np.load(DATA_PATH / "x.npy")
    y = np.load(DATA_PATH / "y.npy")

    scaler = StandardScaler()
    x_scaled = scaler.fit_transform(x)
    
    x_train, x_val, x_test, y_train, y_val, y_test = split_data(x_scaled, y)
    
    train_ds = TensorDataset(
        torch.tensor(x_train, dtype = torch.float32),
        torch.tensor(y_train, dtype = torch.float32).unsqueeze(-1)
    )
    
    val_ds = TensorDataset(
        torch.tensor(x_train, dtype = torch.float32),
        torch.tensor(y_train, dtype = torch.float32).unsqueeze(-1)
    )
    
    test_ds = TensorDataset(
        torch.tensor(x_train, dtype = torch.float32),
        torch.tensor(y_train, dtype = torch.float32).unsqueeze(-1)
    )
    
    train_loader = DataLoader(train_ds, batch_size = 32, shuffle = True)
    val_loader = DataLoader(val_ds, batch_size = 32)
    test_loader = DataLoader(test_ds, batch_size = 32)

    model = IntervalPredictor(input_size = x.shape[1])
    
    trainer = Trainer(model)

    for epoch in range(150):
        train_loss = trainer.train(train_loader)
        val_loss = trainer.validate(val_loader)

        if not epoch % 20:
            print(f"Epoch {epoch}, Train Loss = {train_loss:.4f}, Val Loss = {val_loss:.4f}")

    torch.save(model.state_dict(), "../models/FNN_model.pth")

    np.save(DATA_PATH / "scaler_mean.npy", scaler.mean_)
    np.save(DATA_PATH / "scaler_scale.npy", scaler.scale_)
    
    print("Training complete")