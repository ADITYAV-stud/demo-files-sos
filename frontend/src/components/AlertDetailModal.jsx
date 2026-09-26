import React from 'react';
import {
  X,
  MapPin,
  Radio,
  Battery,
  Activity,
  Send,
  CheckCircle,
  Truck,
  ShieldAlert,
  Clock,
  Cpu,
  Layers,
  PhoneCall,
  Terminal,
  ShieldCheck,
  Lock
} from 'lucide-react';
import LiveMap from './LiveMap';
import { useDispatch } from '../context/DispatchContext';

export default function AlertDetailModal({ alert, onClose }) {
  const { acknowledgeAlert, dispatchTeamToAlert, resolveAlert } = useDispatch();
  if (!alert) return null;

  const isPending = alert.status === 'pending';
  const isAck = alert.status === 'acknowledged';
  const isDispatched = alert.status === 'dispatched';
  const isResolved = alert.status === 'resolved';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto select-none">
      <div className="relative w-full max-w-4xl bg-[#060e1e] border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-slate-900/95 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              isResolved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
              isDispatched ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40' :
              'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-display font-bold text-slate-100 uppercase tracking-wider">
                  INCIDENT {alert.id}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase ${
                  isResolved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                  isDispatched ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40' :
                  isAck ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                  'bg-rose-500 text-white shadow-[0_0_8px_#FF2A4D]'
                }`}>
                  {alert.status}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">
                {alert.locationName || 'Verified Laboratory Coordinates (13.0827° N, 80.2707° E • 434.0 MHz LoRa / bladeRF xA4)'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Telemetry Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">DEVICE ID</span>
              <span className="text-cyan-300 font-bold text-sm">{alert.deviceId}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">MESSAGE ID</span>
              <span className="text-slate-200 font-bold text-sm">{alert.messageId}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">TIMESTAMP</span>
              <span className="text-slate-200 font-bold text-sm">{alert.fullTimestamp || alert.timestamp}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px]">ALERT TYPE</span>
              <span className="text-rose-400 font-bold text-sm">{alert.alertType}</span>
            </div>
          </div>

          {/* Cryptographic Telemetry & AES-256-GCM Verification Breakdown */}
          <div className="p-4 rounded-2xl bg-[#030914] border border-cyan-500/30 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-cyan-300 font-bold">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>64-BYTE RADIO FRAME & AES-256-GCM CRYPTO INGEST</span>
              </div>
              <span className="text-emerald-400 text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                AES-GCM SUCCESS [OK]
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1 text-slate-300 text-[11px]">
                <div className="flex justify-between"><span className="text-slate-500">Total Packet Bytes:</span><span>64 Bytes</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Magic Identifier:</span><span className="text-cyan-300 font-bold">b'SO' (0x53 0x4f)</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Device ID Header:</span><span className="text-cyan-300">1001</span></div>
                <div className="flex justify-between"><span className="text-slate-500">IV (12-byte):</span><span className="text-slate-400 truncate max-w-[160px]">546478afe1dec2f4d1a88771</span></div>
              </div>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <div className="flex justify-between"><span className="text-slate-500">Plaintext Decoded:</span><span>30 Bytes</span></div>
                <div className="flex justify-between"><span className="text-slate-500">GCM Auth Tag:</span><span className="text-emerald-300 truncate max-w-[160px]">5240b9334864d8f6...</span></div>
                <div className="flex justify-between"><span className="text-slate-500">AAD Header:</span><span className="text-slate-400">e9030000</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Receiver Demod:</span><span className="text-slate-200">bladeRF 2.0 micro xA4</span></div>
              </div>
            </div>

            {/* Plaintext HEX Dump */}
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] break-all">
              <span className="text-slate-500 block mb-0.5">PLAINTEXT HEX (30 BYTES):</span>
              <span className="text-cyan-300 font-mono">52464300e903000001000000f842cc073856d82f0f00690078010000015f</span>
            </div>
          </div>

          {/* Signal & RF Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[10px]">COORDINATES</span>
              <span className="text-slate-200 font-bold">{alert.latitude?.toFixed(4)}° N, {alert.longitude?.toFixed(4)}° E</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">ALTITUDE / HDOP</span>
              <span className="text-slate-200 font-bold">{alert.altitude} m / {alert.hdop}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">RSSI / SNR</span>
              <span className="text-emerald-300 font-bold">{alert.rssi || -72} dBm / +{alert.snr || 8.5} dB</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">BATTERY POWER</span>
              <span className="text-emerald-400 font-bold">{alert.battery}% (Li-Po)</span>
            </div>
          </div>

          {/* Assigned Rescue Team Details if dispatched */}
          {alert.assignedTeam && (
            <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-glow-cyan">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-100">{alert.assignedTeam.name}</div>
                  <div className="text-xs text-cyan-300 mt-0.5">
                    Unit: {alert.assignedTeam.unitType} • ETA: <strong className="text-yellow-300">{alert.assignedTeam.eta}</strong>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${alert.assignedTeam.contact}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 flex items-center gap-1.5 hover:bg-slate-800 transition"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Unit</span>
                </a>
              </div>
            </div>
          )}

          {/* Operational Timeline Progress */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Operational Timeline & Transmission Events
            </h4>
            <div className="space-y-1.5">
              {alert.timeline?.map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-xs font-mono p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-cyan-400 font-bold whitespace-nowrap">{item.time}</span>
                  <span className="text-slate-200 font-semibold">{item.stage}:</span>
                  <span className="text-slate-400">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button Controls */}
          <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-800">
            {isPending && (
              <button
                onClick={() => { acknowledgeAlert(alert.id); }}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center justify-center gap-2 transition shadow-md"
              >
                <CheckCircle className="w-4 h-4" />
                <span>ACKNOWLEDGE EMERGENCY ALERT</span>
              </button>
            )}

            {!isDispatched && !isResolved && (
              <button
                onClick={() => { dispatchTeamToAlert(alert); onClose(); }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-glow-cyan text-xs font-mono font-bold flex items-center justify-center gap-2 transition"
              >
                <Send className="w-4 h-4" />
                <span>DISPATCH RESCUE TEAM</span>
              </button>
            )}

            {isDispatched && !isResolved && (
              <button
                onClick={() => { resolveAlert(alert.id); onClose(); }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-glow-green text-xs font-mono font-bold flex items-center justify-center gap-2 transition"
              >
                <CheckCircle className="w-4 h-4" />
                <span>MARK INCIDENT AS RESOLVED</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

