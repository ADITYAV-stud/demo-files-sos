import React from 'react';
import { AlertTriangle, MapPin, Radio, Send, Eye, CheckCircle, X } from 'lucide-react';

export default function NewAlertPopup({
  alert,
  onClose,
  onAcknowledge,
  onViewAlert,
  onDispatch
}) {
  if (!alert) return null;

  return (
    <div className="fixed top-20 right-4 md:right-8 z-50 w-full max-w-md animate-bounce-in">
      <div className="relative rounded-2xl bg-[#091120]/95 backdrop-blur-xl border-2 border-rose-500 shadow-[0_0_40px_rgba(255,42,77,0.45)] p-5 text-slate-100 overflow-hidden">
        {/* Pulsing Alert Scan Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-400 to-rose-500 animate-pulse" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500 flex items-center justify-center text-rose-400 animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg tracking-wider text-rose-400 uppercase">
                  EMERGENCY SOS BROADCAST
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Satellite Downlink Lock Established
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950/70 rounded-xl p-3 border border-slate-800 mb-4 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px]">DEVICE ID:</span>
            <span className="text-cyan-300 font-bold">{alert.deviceId} ({alert.id})</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">MESSAGE ID:</span>
            <span className="text-slate-200 font-bold">{alert.messageId}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">ALERT TYPE:</span>
            <span className="text-rose-400 font-bold">{alert.alertType}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">BATTERY:</span>
            <span className="text-emerald-400 font-bold">{alert.battery}%</span>
          </div>
          <div className="col-span-2 pt-1 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              {alert.latitude?.toFixed(4)}° N, {alert.longitude?.toFixed(4)}° E
            </span>
            <span className="text-amber-400 font-bold">Alt: {alert.altitude}m</span>
          </div>
        </div>

        {/* Action Buttons: Acknowledge, View Alert, Dispatch */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onAcknowledge(alert.id)}
            className="py-2 px-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center justify-center gap-1 transition"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>ACK</span>
          </button>

          <button
            onClick={() => onViewAlert(alert)}
            className="py-2 px-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center justify-center gap-1 transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>VIEW</span>
          </button>

          <button
            onClick={() => onDispatch(alert)}
            className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-lg text-xs font-mono font-bold flex items-center justify-center gap-1 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>DISPATCH</span>
          </button>
        </div>
      </div>
    </div>
  );
}
