# OFF-GRID SOS — Rescue Dispatch System

## 🛰️ Technical Overview
Off-Grid emergency LoRa beacon receiver and SAR dispatch command dashboard for ESP32 + SX1278 / bladeRF 2.0 micro xA4 hardware reception.

---

## 🚀 How to Run the Frontend
1. Open Terminal / PowerShell in this folder:
`ash
npm install
npm run dev
`
2. Open your browser at:
http://localhost:5173/

---

## 📡 How to Run the Python Receiver Bridge (Optional Live Hardware Stream)
`ash
cd server
python receiver_server.py
`
* **API Endpoint**: http://localhost:5055/api/telemetry
* **Live Ingest POST**: http://localhost:5055/api/rx_packet

---

## 📱 How to Send on WhatsApp
1. Open WhatsApp (Desktop or Web on your browser).
2. Open your friend's chat.
3. Click the **+** or **Attach Paperclip** icon (📎) -> Select **Document**.
4. Navigate to your **Downloads** folder:
   C:\Users\Karthikeyan\Downloads\
5. Select: **OFF-GRID-SOS-Frontend-Code.zip** and click **Send**.

---

## 🐙 How to Share on GitHub (Web Upload - No Git Install Needed)
1. Go to [https://github.com](https://github.com) and log in.
2. Click **New Repository** -> Name it offgrid-sos-dispatch.
3. Choose **Public** -> Click **Create Repository**.
4. On the empty repo page, click **uploading an existing file**.
5. Drag and drop all files from C:\Users\Karthikeyan\Downloads\OFF-GRID-SOS-Frontend-Code into the upload box.
6. Click **Commit changes**.
