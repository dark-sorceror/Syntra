from db import create_connection

def create_event(title, description, start_time, end_time):
    conn = create_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO events (title, description, start_time, end_time)
        VALUES (?, ?, ?, ?)
    ''', (title, description, start_time, end_time))
    
    conn.commit()
    event_id = cursor.lastrowid
    conn.close()

    return event_id

def get_all_events():
    conn = create_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM events ORDER BY start_time ASC')
    events = cursor.fetchall()
    
    conn.close()
    
    return events

def update_event(event_id, title, description, start_time, end_time):
    conn = create_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE events
        SET title = ?, description = ?, start_time = ?, end_time = ?
        WHERE id = ?
    ''', (title, description, start_time, end_time, event_id))
    
    conn.commit()
    conn.close()
    
def delete_event(event_id):
    conn = create_connection()
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM events WHERE id = ?', (event_id,))
    
    conn.commit()
    conn.close()