import pandas as pd

from data_models import EventModel

SEQ_LEN = 2

def sample_synthetic_data(events: EventModel):
    rows = []

    df = pd.DataFrame(data = events)
    
    if df.empty: return "No events"
    
    df["start_date"] = (pd.to_datetime(df["start"], format="mixed")).apply(lambda x: x.to_pydatetime())
    df["end_date"] = (pd.to_datetime(df["end"], format="mixed")).apply(lambda x: x.to_pydatetime())
    
    group = df.groupby(["user_id", "event_title"])
    
    for (user, event_title), g in group:
        g = g.sort_values("start_date").reset_index(drop = True)
        
        g["previous_start"] = g["start_date"].shift(1)
        
        g["interval_days"] = [
            (curr - prev).total_seconds() / (3600 * 24) if prev is not pd.NaT else 0
            
            for curr, prev in zip(g["start_date"], g["previous_start"])
        ]
        
        for i in range(1, len(g) - 1):
            start_i = i - SEQ_LEN + 1
            
            if start_i < 1: continue
            
            seq = g.loc[start_i:i, "interval_days"].tolist()
            
            if len(seq) != SEQ_LEN: continue
            
            last_row = g.loc[i]
            next_row = g.loc[i + 1]
            
            label = (next_row["start_date"] - last_row["start_date"]).total_seconds() / (3600 * 24)

            rows.append({
                "user_id": user,
                "event_title": event_title,
                "last_timestamp": last_row["start_date"].isoformat(),
                "seq_intervals": seq,
                "last_hour": last_row["start_date"].hour + last_row["start_date"].minute / 60.0,
                "last_weekday": int(last_row["start_date"].weekday()),
                "last_duration": (last_row["end_date"] - last_row["start_date"]).total_seconds() / 3600.0,
                "label_next_interval": float(label)
            })
    
    return rows