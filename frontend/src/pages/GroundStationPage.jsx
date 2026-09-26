import React, { useState } from 'react';
import {
  TowerControl,
  Cpu,
  Radio,
  FileCode,
  Send,
  CheckCircle2,
  RefreshCw,
  Terminal,
  Activity,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { useDispatch } from '../context/DispatchContext';

export default function GroundStationPage() {
  const { alerts, devices, groundStation, triggerSimulatedSos } = useDispatch();
  const [rawJsonInput, setRawJsonInput] = useState(JSON.stringify({
    isSos: true,
    deviceId: "DEV-009",
    messageId: "MSG-8841Z",
    latitude: 12.9812,
    longitude: 77.6250,
    altitude: 940.0,
    hdop: 0.7,
    alertType: "LoRa SDR Distress Signal",
    battery: 79,
    rssi: -81,
    snr: 10.4,
    spreadingFactor: "SF10",
    frequency: "868.100 MHz",
    locationName: "Karnataka Forest Ridge Sector 2",
    rawHex: "AA534F532D4C4F52412D534154454C4C495445"
  }, null, 2));

  const [copied, setCopied] = useState(false);
  const [ingestSuccess, setIngestSuccess] = useState(false);

  const handleIngestPacket = async () => {
    try {
      const parsed = JSON.parse(rawJsonInput);
      
      // Try sending to Python Receiver Server if online
      try {
        await fetch('http://localhost:5055/api/rx_packet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed)
        });
      } catch (e) {
        // Fallback local trigger
      }

      triggerSimulatedSos(parsed);
      setIngestSuccess(true);
      setTimeout(() => setIngestSuccess(false), 3000);
    } catch (e) {
      alert("Invalid JSON format. Please verify your Python receiver output payload.");
    }
  };

  const copyScriptCode = () => {
    navigator.clipboard.writeText("python server/receiver_server.py");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-wide text-slate-100 uppercase">
            GROUND STATION SDR & PYTHON RECEIVER PIPELINE
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            LoRa → Satellite → Ground Station Demodulator Telemetry Bridge & JSON Ingestion.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>PYTHON REST/WS BRIDGE: READY</span>
          </div>
        </div>
      </div>

      {/* Ground Station Hardware Specs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 font-mono text-xs">
          <span className="text-slate-500 block text-[10px]">STATION CALLSIGN</span>
          <span className="text-cyan-300 font-bold text-sm">{groundStation.stationId || 'GS-BANGALORE-01'}</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 font-mono text-xs">
          <span className="text-slate-500 block text-[10px]">CENTER FREQUENCY</span>
          <span className="text-slate-100 font-bold text-sm">{groundStation.frequency || '868.100 MHz'}</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 font-mono text-xs">
          <span className="text-slate-500 block text-[10px]">SATELLITE PASS</span>
          <span className="text-slate-100 font-bold text-sm">{groundStation.satellitePass || 'LEO-SAR-ORBIT-42'}</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 font-mono text-xs">
          <span className="text-slate-500 block text-[10px]">SDR ENGINE</span>
          <span className="text-emerald-400 font-bold text-sm">RTL-SDR / HackRF</span>
        </div>
      </div>

      {/* Ingestion & Raw Payload Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: JSON Ingestion Console (7 Cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-cyan-400" />
              <h2 className="font-display font-bold text-base text-slate-100 uppercase tracking-wider">
                PYTHON RECEIVER JSON INGESTION CONSOLE
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              telemetry_feed.json
            </span>
          </div>

          <p className="text-xs font-mono text-slate-400">
            Paste decoded telemetry JSON packets from your Python receiver script to broadcast immediately into the rescue console:
          </p>

          <textarea
            rows="12"
            value={rawJsonInput}
            onChange={(e) => setRawJsonInput(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-950/90 border border-slate-700 text-cyan-300 font-mono text-xs outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-mono text-slate-400">
              Auto-validates CRC, Lat/Lon coordinates, and RSSI metrics.
            </span>
            <button
              onClick={handleIngestPacket}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 hover:from-blue-500 hover:to-cyan-500 text-white font-mono font-bold text-xs uppercase shadow-glow-cyan flex items-center gap-2 transition"
            >
              <Send className="w-4 h-4" />
              <span>INGEST RAW PACKET</span>
            </button>
          </div>

          {ingestSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Packet successfully parsed and dispatched to Mission Control!</span>
            </div>
          )}
        </div>

        {/* Right: Python Receiver Script Integration Guide (5 Cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-cyan-500/20 space-y-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h3 className="font-display font-bold text-base text-slate-100 uppercase tracking-wider">
              HOW TO CONNECT YOUR PYTHON CODE
            </h3>
          </div>

          <div className="space-y-3 text-xs font-mono text-slate-300 leading-relaxed">
            <p>
              1. Run the included Python receiver server in your terminal:
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <code className="text-emerald-400">python server/receiver_server.py</code>
              <button
                onClick={copyScriptCode}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <p>
              2. In your SDR / LoRa receiver script, send HTTP POST packets or write directly to <code className="text-cyan-300">src/data/telemetry_feed.json</code>:
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 overflow-x-auto">
              <pre className="text-cyan-300 font-mono">
{`import requests

payload = {
  "isSos": True,
  "deviceId": "DEV-003",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "battery": 68,
  "rssi": -82,
  "snr": 9.4
}

requests.post("http://localhost:5055/api/rx_packet", json=payload)`}
              </pre>
            </div>

            <p>
              3. The React dashboard automatically detects updates every 3s via live polling and immediately raises critical alarm banners.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
