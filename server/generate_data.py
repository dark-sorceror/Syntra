import random

from models import HabitPatternModel

NUM_USERS = 1000
DAYS_PER_USER = 90

PATTERNS = [
    HabitPatternModel (
        event_title = "Study",
        frequency = 3,
        average_start_time = 7.0,
        average_duration_hours = 5.0,
        usual_days_of_week = [1, 2, 3, 4, 5],
        consistency_score = 5
    )   
]
 
def generate_user_patterns(seed: int):
    r = random.Random(seed)

    patterns = []
    chosen = r.sample(PATTERNS, k=1)
    
    for p in chosen:
        p2 = p.model_copy()
        p2.average_start_time = p.average_start_time + r.uniform(-0.5, 0.5)
        p2.consistency_score = max(0.1, p.consistency_score + r.uniform(-0.2, 0.2))
        p2.average_duration_hours = max(0.25, p.average_duration_hours + r.uniform(-0.5, 0.5))
        
        if r.random() < 0.1:
            # Simulate a random weekday
            day = r.randint(0,6)
            
            if day in p2.usual_days_of_week: p2.usual_days_of_week.remove(day)
            else: p2.usual_days_of_week.append(day)
            
        patterns.append(p2)
        
    return patterns