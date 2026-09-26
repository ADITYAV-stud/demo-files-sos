from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import get_connection, init_database


app = FastAPI(
    title="OFF-GRID SOS Backend",
    version="1.0.0"
)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_database()


class SOSPacket(BaseModel):
    status: str
    priority: Optional[str] = None
    tag: Optional[str] = None

    deviceId: int
    deviceName: Optional[str] = None
    sequence: int

    alertType: Optional[str] = None

    gpsValid: Optional[bool] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    altitude_m: Optional[float] = None
    hdop: Optional[float] = None

    timestamp_utc_epoch: Optional[int] = None

    battery_pct: Optional[int] = None

    security: Optional[str] = None

    rssi_dbm: Optional[float] = None
    snr_db: Optional[float] = None

    received_at: Optional[float] = None


@app.get("/")
def root():
    return {
        "system": "OFF-GRID SOS",
        "status": "backend running"
    }


@app.get("/api/health")
def health():
    return {
        "status": "online"
    }


@app.post("/api/sos")
def receive_sos(packet: SOSPacket):

    if not packet.status.startswith("VALID"):
        raise HTTPException(
            status_code=400,
            detail="Only validated receiver packets can be stored"
        )

    connection = get_connection()

    cursor = connection.execute("""
        INSERT INTO sos_messages (
            status,
            priority,
            tag,
            device_id,
            device_name,
            sequence,
            alert_type,
            gps_valid,
            latitude,
            longitude,
            altitude_m,
            hdop,
            timestamp_utc_epoch,
            battery_pct,
            security,
            rssi_dbm,
            snr_db,
            received_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        packet.status,
        packet.priority,
        packet.tag,
        packet.deviceId,
        packet.deviceName,
        packet.sequence,
        packet.alertType,
        int(packet.gpsValid) if packet.gpsValid is not None else None,
        packet.latitude,
        packet.longitude,
        packet.altitude_m,
        packet.hdop,
        packet.timestamp_utc_epoch,
        packet.battery_pct,
        packet.security,
        packet.rssi_dbm,
        packet.snr_db,
        packet.received_at
    ))

    connection.commit()

    database_id = cursor.lastrowid

    connection.close()

    return {
        "status": "SOS stored",
        "database_id": database_id
    }

def format_alert(row):
    data = dict(row)

    return {
        "id": f"SOS-{data['device_id']}",
        "deviceId": str(data["device_id"]),
        "deviceName": data["device_name"],
        "messageId": str(data["sequence"]),

        "latitude": data["latitude"],
        "longitude": data["longitude"],
        "altitude": data["altitude_m"],
        "hdop": data["hdop"],

        "timestamp": str(data["timestamp_utc_epoch"]),
        "alertType": data["alert_type"],

        "severity": data["priority"],
        "status": "pending",

        "battery": data["battery_pct"],

        "authentication": data["security"],
        "decryption": "SUCCESS",
        "validation": data["status"],

        "rssi": data["rssi_dbm"],
        "snr": data["snr_db"],

        "tag": data["tag"],
        "gpsValid": bool(data["gps_valid"]) if data["gps_valid"] is not None else None,

        "receivedAt": data["received_at"]
    }

@app.get("/api/latest")
def latest_sos():

    connection = get_connection()

    row = connection.execute("""
        SELECT *
        FROM sos_messages
        ORDER BY id DESC
        LIMIT 1
    """).fetchone()

    connection.close()

    if row is None:
        return {
            "status": "no SOS received"
        }
    return format_alert(row)


@app.get("/api/alerts")
def all_alerts():

    connection = get_connection()

    rows = connection.execute("""
        SELECT *
        FROM sos_messages
        ORDER BY id DESC
    """).fetchall()

    connection.close()

    return [format_alert(row) for row in rows]
