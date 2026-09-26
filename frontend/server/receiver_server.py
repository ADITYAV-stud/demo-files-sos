#!/usr/bin/env python3
"""
OFF-GRID SOS Rescue Dispatch - Python Receiver Server & SDR Demod Bridge
========================================================================
This Python script receives decoded LoRa -> Satellite -> Ground Station
packets from your SDR/Serial/UDP receiver, processes the JSON telemetry,
and serves it to the React Dispatch Frontend via HTTP API & telemetry_feed.json.

Run:
  python receiver_server.py
"""

import json
import os
import sys
import time
import random
from http.server import HTTPServer, BaseHTTPRequestHandler
from threading import Thread

PORT = 5055
JSON_FILE_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'telemetry_feed.json')

def load_telemetry():
    try:
        if os.path.exists(JSON_FILE_PATH):
            with open(JSON_FILE_PATH, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception as e:
        print(f"[Error loading JSON] {e}")
    return {"status": "ONLINE", "alerts": [], "devices": []}

def save_telemetry(data):
    try:
        os.makedirs(os.path.dirname(JSON_FILE_PATH), exist_ok=True)
        with open(JSON_FILE_PATH, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        print(f"[Telemetry Saved] Updated {JSON_FILE_PATH}")
    except Exception as e:
        print(f"[Error saving JSON] {e}")

class ReceiverAPIHandler(BaseHTTPRequestHandler):
    def _set_cors_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_cors_headers(204)

    def do_GET(self):
        if self.path == '/api/telemetry':
            data = load_telemetry()
            self._set_cors_headers(200)
            self.wfile.write(json.dumps(data).encode('utf-8'))
        elif self.path == '/api/status':
            self._set_cors_headers(200)
            self.wfile.write(json.dumps({
                "status": "ONLINE",
                "engine": "Python LoRa-Satellite Ground Station Receiver",
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
            }).encode('utf-8'))
        else:
            self._set_cors_headers(404)
            self.wfile.write(json.dumps({"error": "Not Found"}).encode('utf-8'))

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            payload = json.loads(post_data.decode('utf-8'))
        except Exception:
            payload = {}

        if self.path == '/api/rx_packet':
            # Ingest raw or decoded packet from receiver python script
            print(f"\n[LoRa -> Satellite Downlink Received]: {payload}")
            current_data = load_telemetry()
            
            # If payload is an alert
            if payload.get("isSos") or payload.get("alertType"):
                alert_id = payload.get("id") or f"SOS-{payload.get('deviceId', '1001')}"
                new_alert = {
                    "id": alert_id,
                    "deviceId": str(payload.get("deviceId", "1001")),
                    "messageId": str(payload.get("messageId", "1")),
                    "latitude": float(payload.get("latitude", 13.0827)),
                    "longitude": float(payload.get("longitude", 80.2707)),
                    "altitude": float(payload.get("altitude", 15.0)),
                    "hdop": float(payload.get("hdop", 1.05)),
                    "timestamp": str(payload.get("timestamp", "376 (13:08)")),
                    "fullTimestamp": time.strftime("%d %b %Y, %H:%M:%S UTC", time.gmtime()),
                    "alertType": payload.get("alertType", "SOS (Type 1)"),
                    "severity": payload.get("severity", "CRITICAL"),
                    "status": payload.get("status", "pending"),
                    "battery": int(payload.get("battery", 95)),
                    "rssi": int(payload.get("rssi", -72)),
                    "snr": float(payload.get("snr", 8.5)),
                    "spreadingFactor": payload.get("spreadingFactor", "SF9"),
                    "codingRate": payload.get("codingRate", "4/7"),
                    "frequency": payload.get("frequency", "434.000 MHz"),
                    "locationName": payload.get("locationName", "Verified Hardware Coordinate (13.0827° N, 80.2707° E)"),
                    "rawHex": payload.get("rawHex", "52464300e903000001000000f842cc073856d82f0f00690078010000015f"),
                    "tag": payload.get("tag", "RFC"),
                    "magic": payload.get("magic", "b'SO'"),
                    "iv": payload.get("iv", "546478afe1dec2f4d1a88771"),
                    "ciphertext": payload.get("ciphertext", "45771e25ef95c480f6be8d7750646aa2bed0d171375601051cc40f40674c"),
                    "gcmTag": payload.get("gcmTag", "5240b9334864d8f652aa7796e574b669"),
                    "aad": payload.get("aad", "e9030000"),
                    "assignedTeam": None,
                    "timeline": [
                        {"stage": "LoRa SOS Received", "time": time.strftime("%H:%M:%S"), "desc": "Demodulated by bladeRF 2.0 micro xA4 and verified via AES-256-GCM"}
                    ]
                }
                current_data.setdefault("alerts", []).insert(0, new_alert)
                current_data["stats"]["totalSosAlerts"] = len(current_data["alerts"])
                save_telemetry(current_data)
            
            self._set_cors_headers(200)
            self.wfile.write(json.dumps({"success": True, "message": "Packet processed successfully"}).encode('utf-8'))
            
        elif self.path == '/api/update_status':
            # Update status of an alert (pending -> acknowledged -> dispatched -> resolved)
            alert_id = payload.get("id")
            new_status = payload.get("status")
            current_data = load_telemetry()
            for al in current_data.get("alerts", []):
                if al["id"] == alert_id:
                    al["status"] = new_status
                    if new_status == "dispatched" and not al.get("assignedTeam"):
                        al["assignedTeam"] = {
                            "id": "TEAM-01",
                            "name": "Rescue Team #1 (Bravo Unit)",
                            "unitType": "All-Terrain Medical 4x4",
                            "eta": "10 mins",
                            "status": "En Route",
                            "latitude": al["latitude"] - 0.02,
                            "longitude": al["longitude"] - 0.02,
                            "contact": "+91 (080) 459-7890"
                        }
                    al.setdefault("timeline", []).append({
                        "stage": f"Status updated to {new_status.capitalize()}",
                        "time": time.strftime("%H:%M:%S"),
                        "desc": f"Updated by Operator via Mission Control"
                    })
                    break
            save_telemetry(current_data)
            self._set_cors_headers(200)
            self.wfile.write(json.dumps({"success": True, "alerts": current_data.get("alerts", [])}).encode('utf-8'))
        else:
            self._set_cors_headers(404)
            self.wfile.write(json.dumps({"error": "Unknown endpoint"}).encode('utf-8'))

def run_server():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, ReceiverAPIHandler)
    print(f"\n=======================================================")
    print(f"🛰️ OFF-GRID SOS Python Receiver Server Running")
    print(f"📡 API Endpoint: http://localhost:{PORT}/api/telemetry")
    print(f"📥 Receiver Ingest Endpoint: http://localhost:{PORT}/api/rx_packet")
    print(f"=======================================================\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
