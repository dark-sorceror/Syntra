import statistics
from collections import Counter
from datetime import datetime

from ..data_schemas import HabitModel, HabitPatternModel

def extract_patterns(user_id: str, db: dict):
    user_events = [i for i in db["events"] if i["user_id"] == user_id]
    
    if not user_events:
        return {
            "code": "NO_EVENTS",
            "message": f"No events to extract on for user '{user_id}'"
        }
        
    habits, learned = {}, {}
    
    for i in user_events:
        title = i["event_title"]
        start_date = datetime.fromisoformat(str(i["start"]))
        end_date = datetime.fromisoformat(str(i["end"]))
        
        if title not in habits:
            habits[title] = HabitModel (
                count = 0,
                days =  [],
                start_times = [],
                durations = []
            )
        
        habits[title].count += 1
        habits[title].days.append(start_date.weekday())
        habits[title].start_times.append(start_date.hour + start_date.minute / 60)
        habits[title].durations.append((end_date - start_date).seconds / 3600)
    
    for title, stats in habits.items():
        count = stats.count
        avg_start = sum(stats.start_times) / len(stats.start_times)
        avg_duration = sum(stats.durations) / len(stats.durations)

        day_counts = Counter(stats.days)
        usual_days = [i for i, f in day_counts.items() if f > 1]

        if len(stats.start_times) > 1: std_dev = statistics.stdev(stats.start_times)
        else: std_dev = 0

        consistency = max(0, 1.0 - (std_dev / 4))

        learned[title] = HabitPatternModel (
            frequency = count,
            average_start_time = round(avg_start, 2),
            average_duration_hours = round(avg_duration, 2),
            usual_days_of_week = usual_days,
            consistency_score = round(consistency, 3)
        )
        
    db["models"][user_id] = learned