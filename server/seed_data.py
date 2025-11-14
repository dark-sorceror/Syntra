import requests

from datetime import datetime, timedelta, time

user_id = "test"
BASE_URL = "http://localhost:8000"

patterns = [
    {
        "event_title": "Gym",
        "category": "Health",
        "start_time": 7,
        "duration": 1,
        "days": [0, 2, 4]
    },
    {
        "event_title": "Work", 
        "category": "Job", 
        "start_time": 9,
        "duration": 6,
        "days": [0, 1, 2, 3, 4]
    },
    {
        "event_title": "Study", 
        "category": "Learning", 
        "start_time": 20,
        "duration": 6,
        "days": [1, 3, 5]
    }
]

today = datetime.now().date()
events = []

for i in range(30):
    day = today - timedelta(days = i)
    weekday = day.weekday()
    
    for j in patterns:
        if weekday in j["days"]:
            start = datetime.combine(day, time(j["start_time"], 0))
            end = start + timedelta(minutes = j["duration"])
            
            events.append(
                {
                    "user_id": user_id,
                    "event_title": j["event_title"],
                    "start": start.isoformat(),
                    "end": end.isoformat(),
                    "category": j["category"]
                }
            )  

for i in events:
    r = requests.post(f"{BASE_URL}/events", json=i)
    
    print(r.status_code, r.json())

print(f"Finished seeding user: {user_id}")