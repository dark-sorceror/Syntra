import torch
import torch.nn as nn
import torch.optim as optim

import numpy as np

from sklearn.preprocessing import StandardScaler

from pathlib import Path

from models import IntervalPredictor

if __name__ == "__main__":
    DATA = Path("./server/data/seed")

    x = np.load(DATA / "x.npy")
    y = np.load(DATA / "y.npy")

    scaler = StandardScaler()
    x_scaled = scaler.fit_transform(x)

    x_tensor = torch.tensor(x_scaled, dtype = torch.float32)
    y_tensor = torch.tensor(y, dtype = torch.float32).unsqueeze(-1)

    model = IntervalPredictor(input_size = x.shape[1])

    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr = 0.01)

    for epoch in range(150):
        optimizer.zero_grad()
        out = model(x_tensor)
        loss = criterion(out, y_tensor)
        loss.backward()
        optimizer.step()

        if not epoch % 20:
            print(f"Epoch {epoch}, Loss = {loss.item():.4f}")

    torch.save(model.state_dict(), "server/FNN_model.pth")

    np.save(DATA / "scaler_mean.npy", scaler.mean_)
    np.save(DATA / "scaler_scale.npy", scaler.scale_)