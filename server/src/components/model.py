import torch.nn as nn

class IntervalPredictor(nn.Module):
    def __init__(self, input_size, hidden_size = 128, num_layers = 3):
        super().__init__()
        
        self.lstm = nn.LSTM(
            input_size = input_size, 
            hidden_size = hidden_size, 
            num_layers = num_layers, 
            batch_first = True,
            dropout = 0.1
        )
        
        self.linear = nn.Linear(hidden_size, 1)

    def forward(self, x):
        lstm_out, _ = self.lstm(x)
        
        final_output = lstm_out[:, -1, :] 
        
        return self.linear(final_output)