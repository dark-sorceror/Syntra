import torch
import torch.nn as nn
import torch.optim as optim

class Trainer:
    def __init__(self, model, lr = 0.001, device = None):
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.model = model.to(self.device)
        
        self.criterion = nn.MSELoss()
        self.optimizer = optim.Adam(model.parameters(), lr = lr)
        
    def train(self, loader):
        self.model.train()
        
        total_loss = 0
        
        for x_batch, y_batch in loader:
            x_batch = x_batch.to(self.device)
            y_batch = y_batch.to(self.device)
            
            self.optimizer.zero_grad()
            
            pred = self.model(x_batch)
            loss = self.criterion(pred, y_batch)
            
            loss.backward()
            self.optimizer.step()
            
            total_loss += loss.item()
            
        return total_loss / len(loader)
    
    def validate(self, loader):
        self.model.eval()
        
        total_loss = 0
        
        with torch.no_grad():
            for x_batch, y_batch in loader:
                x_batch = x_batch.to(self.device)
                y_batch = y_batch.to(self.device)
                
                pred = self.model(x_batch)
                loss = self.criterion(pred, y_batch)
                
                total_loss += loss.item()
                
        return total_loss / len(loader)