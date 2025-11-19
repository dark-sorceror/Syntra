import torch.nn as nn

class IntervalPredictor(nn.Module):
    def __init__(self, input_size):
        super().__init__()
        
        self.model = nn.Sequential(
            nn.Linear(input_size, 32),
            nn.ReLU(),
            nn.Linear(32, 16),
            nn.ReLU(),
            nn.Linear(16, 1)
        )
        
    def forward(self, x):
        return self.model(x)