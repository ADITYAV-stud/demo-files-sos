import React from 'react';
import {
  AlertTriangle,
  Radio,
  Truck,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Cpu,
  KeyRound,
  FileCheck,
  Terminal,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import WaterfallVisualizer from '../components/WaveformVisualizer';
import { useDispatch } from '../context/DispatchContext';

export default function DashboardPage() {
  const {
    operator,
    stats,
    alerts,
    setFocusedAlertId,
    setSelectedAlert,
    setCurrentPage
  } = useDispatch();

  const recentAlerts = alerts.slice(0, 5);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#FF2A4D]" />
            <span>New / SOS</span>
          </span>
        );
      case 'acknowledged':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#FF8800]" />
            <span>Acknowledged</span>
          </span>
        );
      case 'dispatched':
      case 'dispatching':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-400/50 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_6px_#F39C12]" />
            <span>Dispatched</span>
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#00FF66]" />
            <span>Resolved</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 whitespace-nowrap">
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome & Command Center Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/20 bg-gradient-to-r from-slate-950 via-[#061226] to-slate-950">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#00FF66]" />
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-semibold">
              MISSION CONTROL • EMERGENCY SAR DISPATCH
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-wide text-slate-100 mt-1">
            Welcome, {operator.name}
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            Real-time OFF-GRID SOS telemetry demodulation via bladeRF 2.0 micro xA4 & LEO Satellite Mesh.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>RX PROTOCOL: <strong>AES-256-GCM (64-BYTE)</strong></span>
          </div>
        </div>
      </div>

      {/* TOP 4 DASHBOARD STATISTIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Active SOS Alerts */}
        <div className="glass-panel p-4 rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-950/30 to-slate-950/80 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
              <span className="font-display font-bold text-sm tracking-tighter uppercase">SOS</span>
            </div>
            <span className="text-[11px] font-mono text-rose-300/80 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              (Pending Action)
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Active SOS Alerts</div>
            <div className="text-3xl font-display font-bold text-slate-100 mt-0.5">{stats.totalSosAlerts}</div>
          </div>
        </div>

        {/* 2. Active Devices */}
        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 to-slate-950/80 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <Radio className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono text-emerald-300/80 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              (Online Nodes)
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Active Devices</div>
            <div className="text-3xl font-display font-bold text-slate-100 mt-0.5">{stats.activeDevices}</div>
          </div>
        </div>

        {/* 3. Dispatched Units */}
        <div className="glass-panel p-4 rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-950/20 to-slate-950/80 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-300 group-hover:scale-105 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono text-yellow-300/80 bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/20">
              (In Progress)
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Dispatched Units</div>
            <div className="text-3xl font-display font-bold text-slate-100 mt-0.5">{stats.dispatched}</div>
          </div>
        </div>

        {/* 4. Resolved Incidents */}
        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-900/40 to-slate-950/80 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
              (Resolved)
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Resolved</div>
            <div className="text-3xl font-display font-bold text-slate-100 mt-0.5">{stats.resolved}</div>
          </div>
        </div>
      </div>

      {/* MATPLOTLIB WATERFALL MODEL SPECTROGRAM (Main Dashboard Tab Only) */}
      <WaterfallVisualizer
        rssi={-72}
        snr={8.5}
        frequency="434.000 MHz"
        bandwidth="125 kHz"
        sf="SF9"
        cr="4/7"
        status="bladeRF 2.0 micro xA4 ACTIVE"
      />

      {/* GROUND STATION SDR RECEIVER & AES-256-GCM VERIFICATION PIPELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Terminal Decoding Breakdown (Direct from Receiver Test Output) (7 Cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-5 border border-cyan-500/30 bg-[#040c1c]/90 space-y-4">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Terminal className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-sm tracking-wider text-slate-100 uppercase">
                OFF-GRID SOS RX DECRYPT PIPELINE
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              AES-GCM VERIFIED ✓
            </span>
          </div>

          {/* 64-Byte Encrypted Radio Frame Inspector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">TOTAL PACKET BYTES: <strong className="text-slate-200">64</strong></span>
              <span className="text-cyan-400 font-bold">MAGIC: b'SO'</span>
            </div>
            
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-[11px] space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Device ID:</span>
                <span className="text-cyan-300 font-bold">1001</span>
              </div>
              <div className="flex justify-between gap-2 overflow-hidden">
                <span className="text-slate-500 shrink-0">IV (12B):</span>
                <span className="text-slate-300 truncate">546478afe1dec2f4d1a88771</span>
              </div>
              <div className="flex justify-between gap-2 overflow-hidden">
                <span className="text-slate-500 shrink-0">Ciphertext (30B):</span>
                <span className="text-amber-300 truncate">45771e25ef95c480f6be8d7750646aa2bed0d171375601051cc40f40674c</span>
              </div>
              <div className="flex justify-between gap-2 overflow-hidden">
                <span className="text-slate-500 shrink-0">GCM Tag (16B):</span>
                <span className="text-emerald-300 truncate">5240b9334864d8f652aa7796e574b669</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">AAD:</span>
                <span className="text-slate-400">e9030000</span>
              </div>
            </div>
          </div>

          {/* Decoded SOS Fields (Plaintext 30 Bytes) */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/30 to-cyan-950/30 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-emerald-300 font-bold">
              <span>DECODED SOS DATA (30-BYTE PLAINTEXT)</span>
              <span>TAG: RFC</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">DEVICE / MSG</span>
                <span className="text-cyan-300 font-bold">1001 / #1</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">LAT / LON</span>
                <span className="text-slate-200 font-bold">13.0827° / 80.2707°</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">ALT / HDOP</span>
                <span className="text-slate-200 font-bold">15 m / 1.05</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">ALERT / BATT</span>
                <span className="text-rose-400 font-bold">SOS / 95%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Validation Pipeline & Verification Matrix (5 Cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-5 border border-cyan-500/30 bg-[#040c1c]/90 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="font-display font-bold text-sm tracking-wider text-slate-100 uppercase">
                  RX PIPELINE SUCCESS CHECKS
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">100% VALIDATED</span>
            </div>

            {/* Validation Checklist */}
            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">LoRa packet received</span>
                <span className="text-emerald-400 font-bold">[OK] YES</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">64-byte frame recovered</span>
                <span className="text-emerald-400 font-bold">[OK] YES</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">AES-GCM authentication</span>
                <span className="text-emerald-400 font-bold">[OK] YES</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Payload decrypted</span>
                <span className="text-emerald-400 font-bold">[OK] YES</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">SOS fields decoded & registered</span>
                <span className="text-emerald-400 font-bold">[OK] YES</span>
              </div>
            </div>
          </div>

          {/* Quick Hardware Reference */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1">
            <div className="text-cyan-400 font-bold text-xs uppercase">Hardware Prototype Profile:</div>
            <div>Transmitter: ESP32 DevKit V1 + Ai-Thinker Ra-02 (SX1278)</div>
            <div>Frequency: 434.000 MHz (Current Lab) → 868.000 MHz (Target)</div>
            <div>Receiver SDR: Nuand bladeRF 2.0 micro xA4</div>
          </div>
        </div>

      </div>

      {/* RECENT ALERTS SUMMARY (With Map Navigation & View Details) */}
      <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 bg-slate-950/70">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
            <h3 className="font-display font-bold text-sm tracking-wider text-slate-100 uppercase">
              RECENT RESCUE ALERTS
            </h3>
          </div>
          <button
            onClick={() => setCurrentPage('alerts')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition"
          >
            <span>View All Alerts</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 pb-2 text-[11px] uppercase">
                <th className="pb-2.5 font-bold pr-3">Alert ID</th>
                <th className="pb-2.5 font-bold pr-3">Device ID</th>
                <th className="pb-2.5 font-bold pr-3">Coordinates (Lat / Lon)</th>
                <th className="pb-2.5 font-bold pr-3">Time</th>
                <th className="pb-2.5 font-bold pr-3">Status</th>
                <th className="pb-2.5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentAlerts.map((al) => (
                <tr key={al.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-bold text-rose-400 whitespace-nowrap pr-3">
                    {al.id}
                  </td>
                  <td className="py-3 font-bold text-cyan-300 whitespace-nowrap pr-3">
                    {al.deviceId}
                  </td>
                  <td className="py-3 text-slate-300 whitespace-nowrap pr-3">
                    {al.latitude?.toFixed(4)}° N, {al.longitude?.toFixed(4)}° E
                  </td>
                  <td className="py-3 text-slate-400 whitespace-nowrap pr-3">
                    {al.timestamp}
                  </td>
                  <td className="py-3 whitespace-nowrap pr-3">
                    {getStatusBadge(al.status)}
                  </td>
                  <td className="py-3 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2 justify-end">
                      <button
                        onClick={() => {
                          setFocusedAlertId(al.id);
                          setCurrentPage('liveMap');
                        }}
                        title="Focus on Live Map"
                        className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-cyan-500/20 text-cyan-400 border border-slate-700 hover:border-cyan-400 text-[11px] font-mono transition"
                      >
                        Map
                      </button>
                      <button
                        onClick={() => setSelectedAlert(al)}
                        title="View Complete Decoded Telemetry"
                        className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-blue-500/20 text-cyan-300 border border-slate-700 hover:border-blue-400 text-[11px] font-mono transition"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

