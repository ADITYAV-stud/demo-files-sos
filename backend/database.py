import sqlite3

DATABASE = "sos.db"


def get_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def init_database():
    connection = get_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS sos_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            status TEXT NOT NULL,
            priority TEXT,
            tag TEXT,

            device_id INTEGER NOT NULL,
            device_name TEXT,
            sequence INTEGER NOT NULL,

            alert_type TEXT,

            gps_valid INTEGER,
            latitude REAL,
            longitude REAL,
            altitude_m REAL,
            hdop REAL,

            timestamp_utc_epoch INTEGER,

            battery_pct INTEGER,

            security TEXT,

            rssi_dbm REAL,
            snr_db REAL,

            received_at REAL NOT NULL
        )
    """)

    connection.commit()
    connection.close()
