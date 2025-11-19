import torch
import numpy as np
from pathlib import Path

from models import IntervalPredictor

def scale_input(x, mean, scale):
    return (x - mean) / scale

def predict(x):
    DATA = Path("server/data/seed")
    
    mean = np.load(DATA / "scaler_mean.npy")
    scale = np.load(DATA / "scaler_scale.npy")
    
    x_scale = scale_input(x, mean, scale)
    x_tensor = torch.tensor(x_scale, dtype = torch.float32)
    
    model = IntervalPredictor(input_size = x.shape[1])
    model.load_state_dict(torch.load("server/FNN_model.pth", map_location = "cpu"))
    model.eval()
    
    with torch.no_grad():
        output = model(x_tensor)
        
        return output.numpy()
    
if __name__ == "__main__":
    sample = np.array([[4.5, 7.2, 13, 2, 1.5]])
    
    print(predict(sample))
    
    sample = np.array([[0.75, 1.25, 13, 2, 1.5]])
    
    print(predict(sample)) # Not user specifc...
    