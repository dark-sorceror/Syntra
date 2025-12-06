import torch
from torch.utils.data import DataLoader, TensorDataset
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from pathlib import Path

from src.components.trainer import Trainer
from src.components.model import IntervalPredictor

def split_data(x, y, train = 0.8, val = 0.1):
    x_train, x_temp, y_train, y_temp = train_test_split(
        x, 
        y,
        test_size = 1 - train, 
        random_state = 42
    )
    
    val_ratio = val / (1 - train)
    
    x_val, x_test, y_val, y_test = train_test_split(
        x_temp, 
        y_temp, 
        test_size = 1 - val_ratio, 
        random_state = 42
    )
    
    return x_train, x_val, x_test, y_train, y_val, y_test

if __name__ == "__main__":
    DATA_PATH = Path("../data/seed")
    MODEL_SAVE_PATH = Path("../models/LSTM_model.pth")

    x = np.load(DATA_PATH / "x.npy")
    y = np.load(DATA_PATH / "y.npy")
    
    scaler = StandardScaler()
    
    x_train, x_val, x_test, y_train, y_val, y_test = split_data(x, y)
    
    n, l, f = x_train.shape
    x_train_flat = x_train.reshape(-1, f)
    x_train_scaled_flat = scaler.fit_transform(x_train_flat)
    x_train_scaled = x_train_scaled_flat.reshape(n, l, f)

    N_val, L_val, F_val = x_val.shape
    x_val_flat = x_val.reshape(-1, F_val)
    x_val_scaled_flat = scaler.transform(x_val_flat)
    x_val_scaled = x_val_scaled_flat.reshape(N_val, L_val, F_val)
    
    n_test, l_test, f_test = x_test.shape
    x_test_flat = x_test.reshape(-1, f_test)
    x_test_scaled_flat = scaler.transform(x_test_flat)
    x_test_scaled = x_test_scaled_flat.reshape(n_test, l_test, f_test)
    
    train_ds = TensorDataset(
        torch.tensor(x_train_scaled, dtype = torch.float32),
        torch.tensor(y_train, dtype = torch.float32).unsqueeze(-1)
    )
    
    val_ds = TensorDataset(
        torch.tensor(x_val_scaled, dtype = torch.float32),
        torch.tensor(y_val, dtype = torch.float32).unsqueeze(-1)
    )
    
    test_ds = TensorDataset(
        torch.tensor(x_test_scaled, dtype = torch.float32),
        torch.tensor(y_test, dtype = torch.float32).unsqueeze(-1)
    )
    
    train_loader = DataLoader(train_ds, batch_size = 32, shuffle = True)
    val_loader = DataLoader(val_ds, batch_size = 32)
    test_loader = DataLoader(test_ds, batch_size = 32)

    model = IntervalPredictor(input_size = x.shape[1])
    trainer = Trainer(model)
    
    trainer.fit(
        train_loader = train_loader,
        val_loader = val_loader,
        epochs = 350,
        checkpoint_path = MODEL_SAVE_PATH
    )

    np.save(DATA_PATH / "scaler_mean.npy", scaler.mean_)
    np.save(DATA_PATH / "scaler_scale.npy", scaler.scale_)
    
    print("Training complete")