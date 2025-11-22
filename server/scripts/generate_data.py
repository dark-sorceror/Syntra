import random
import json
from pathlib import Path
from datetime import datetime, timedelta, time

from ..src.data_schemas import EventModel, HabitPatternModel

OUTPUT_PATH = Path("../data/seed") # ./server/data/raw in the future
OUTPUT_PATH.mkdir(exist_ok = True)

NUM_USERS = 1000
DAYS_PER_USER = 5

PATTERNS = [
    HabitPatternModel (
        event_title = "Study",
        frequency = 3,
        average_start_time = 16.0,
        average_duration_hours = 5.0,
        usual_days_of_week = [1, 2, 3, 4, 5, 6, 7],
        consistency_score = 4
    ),
    HabitPatternModel (
        event_title = "Gym",
        frequency = 2,
        average_start_time = 6.0,
        average_duration_hours = 1.0,
        usual_days_of_week = [1, 3, 5, 7],
        consistency_score = 2
    )  
]

db = []

def generate_users(n: int = NUM_USERS) -> list[str]:
    return [f"user_{i:04d}" for i in range(n)]
 
def generate_user_patterns(seed: int) -> HabitPatternModel:
    # Will directly get from database from unique users in the future
    r = random.Random(seed)

    patterns = []
    chosen = r.sample(PATTERNS, k = 2)
    
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

def generate_events_for_user(user_id: str, patterns: HabitPatternModel, days: int = DAYS_PER_USER) -> list[dict[str, any]]:
    # Generate synthetically based on the patterns observed to expand dataset
    today = datetime.now().date()
    events = []
    
    for i in range(days):
        day = today - timedelta(days = i)
        weekday = day.weekday()
        
        for j in patterns:
            if weekday in j.usual_days_of_week:
                noise = random.uniform(-j.consistency_score, j.consistency_score)
                start_hour = int(max(0, min(23.99, j.average_start_time + noise)))
                minute = int(start_hour % 1 * 60)
                start_date = datetime.combine(day, time(start_hour, minute))
                duration = max(0.25, j.average_duration_hours + random.uniform(-0.4, 0.4))
                end_date = start_date + timedelta(hours = duration)
                
                events.append(
                    EventModel (
                        user_id = user_id,
                        event_title = j.event_title,
                        start = start_date,
                        end = end_date,
                        category = "test"
                    ).model_dump(mode = "json")
                )
                
    return events

if __name__ == "__main__":
    user_ids = generate_users(1000)

    for i, user_id in enumerate(user_ids):
        patterns = generate_user_patterns(seed = 1000 + i)
        events = generate_events_for_user(user_id, patterns, DAYS_PER_USER)
        db.extend(events)

    with open(OUTPUT_PATH / "synthetic_events.json", "w") as f:
        json.dump(db, f, indent = 4)
        
    print(f"Saved to {OUTPUT_PATH.resolve()}/synthetic_events.json")