import sqlite3

def create_connection():
    conn = sqlite3.connect("C:/Users/Hao Yan/Documents/GitHub/Syntra/server/calendar.db")
    
    return conn

def setup_database():
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            start_time TEXT NOT NULL,
            end_time TEXT NOT NULL,
            color TEXT NOT NULL
        )
    ''')
    
    conn.commit()
    conn.close()

setup_database()