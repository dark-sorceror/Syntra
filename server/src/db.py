import psycopg2

def get_connection():
    try: 
        return psycopg2.connect(
            database="postgres",
            user="test",
            password="password",
            host="127.0.0.1",
            port=1234,
        )
    except:
        return False

print(get_connection())