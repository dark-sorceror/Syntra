import torch
import torch.nn as nn

class IntervalPredictor(nn.Module):
    def __init__(
        self, 
        input_size: int, 
        hidden_size: int = 128, 
        num_layers: int = 3
    ):
        super().__init__()
        
        self.lstm = nn.LSTM(
            input_size = input_size, 
            hidden_size = hidden_size, 
            num_layers = num_layers, 
            batch_first = True,
            dropout = 0.1
        )
        
        self.linear = nn.Linear(
            in_features = hidden_size, 
            out_features = 1
        )

    def forward(self, x: torch.Tensor):
        lstm_out, _ = self.lstm(x)
        
        final_output = lstm_out[:, -1, :]
        
        out = self.linear(final_output)
        
        return out