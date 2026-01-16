import torch.nn as nn

class HabitEmbedding(nn.Module):
    def __init__(self):
        super().__init__()
        
        self.embedding = nn.Embedding(100000, 32)

    def forward(self, user_ids):
        return self.embedding(user_ids)
