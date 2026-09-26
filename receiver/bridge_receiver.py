import requests


BACKEND_URL = "http://127.0.0.1:8000/api/sos"


def send_to_backend(result: dict) -> None:
    """
    Send a validated receiver result to the FastAPI backend.
    """

    payload = {
        "device_id": result["deviceId"],
        "message_id": result["sequence"],
        "latitude": result.get("latitude"),
        "longitude": result.get("longitude"),
        "altitude": result.get("altitude_m"),
        "hdop": result.get("hdop"),
        "timestamp": result.get("timestamp_utc_epoch"),
        "alert_type": "SOS"
        if result.get("status") == "VALID_SOS"
        else "HEARTBEAT",
        "battery": result.get("battery_pct"),
        "authentication": "VERIFIED"
        if result.get("security")
        else "FAILED",
        "decryption": "SUCCESS"
        if result.get("security")
        else "FAILED",
        "validation": "VALID"
        if result.get("status", "").startswith("VALID")
        else "INVALID",
    }

    try:
        response = requests.post(
            BACKEND_URL,
            json=payload,
            timeout=3,
        )

        response.raise_for_status()

        print("[BACKEND] SOS sent successfully")
        print("[BACKEND]", response.json())

    except requests.RequestException as exc:
        print("[BACKEND] Failed to send SOS:", exc)


if __name__ == "__main__":

    test_result = {
        "status": "VALID_SOS",
        "priority": "CRITICAL",
        "tag": "RFC",
        "deviceId": 1001,
        "deviceName": "Off-Grid Rescue Beacon #1",
        "sequence": 1,
        "alertType": "CRITICAL_SOS",
        "gpsValid": True,
        "latitude": 13.0827,
        "longitude": 80.2707,
        "altitude_m": 15,
        "hdop": 1.05,
        "battery_pct": 95,
        "timestamp_utc_epoch": 376,
        "security": "AES-256-GCM VERIFIED",
        "rssi_dbm": None,
        "snr_db": None,
    }

    send_to_backend(test_result)
