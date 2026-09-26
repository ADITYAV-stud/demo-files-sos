import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  Crosshair,
  Radio,
  AlertTriangle,
  Truck,
  Compass,
  Maximize2
} from 'lucide-react';
import LiveMap from '../components/LiveMap';
import { useDispatch } from '../context/DispatchContext';

export default function LiveMapPage() {
  const {
    alerts,
    devices,
    focusedAlertId,
    setFocusedAlertId,
    setSelectedAlert,
    mapSettings,
    stats
  } = useDispatch();

  return (
    <div className="space-y-4 pb-12 select-none">
      {/* Top Map Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 rounded-2xl glass-panel border border-cyan-500/20 bg-gradient-to-r from-slate-950 via-[#061226] to-slate-950">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-glow-cyan">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#00FF66]" />
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-semibold">
                TACTICAL GEOSPATIAL RADAR
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-100 uppercase tracking-wider mt-0.5">
              OFF-GRID LIVE RESCUE MAP
            </h1>
            <p className="text-xs font-mono text-slate-400">
              Live geospatial positioning of off-grid LoRa emergency beacons and dispatched rescue units.
            </p>
          </div>
        </div>

        {/* Quick Device / Alert Jump Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Focus Target:</span>
          <select
            value={focusedAlertId || ''}
            onChange={(e) => setFocusedAlertId(e.target.value || null)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-mono outline-none focus:border-cyan-400"
          >
            <option value="">-- All Active Beacons --</option>
            {alerts.map((al) => (
              <option key={al.id} value={al.id}>
                {al.id} ({al.deviceId}) - {al.status.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fullscreen Interactive Tactical Map */}
      <div className="relative rounded-2xl overflow-hidden glass-panel border border-cyan-500/30 shadow-2xl">
        <LiveMap
          alerts={alerts}
          devices={devices}
          focusedAlertId={focusedAlertId}
          onSelectAlert={(al) => {
            setSelectedAlert(al);
            setFocusedAlertId(al.id);
          }}
          markerStyle={mapSettings.markerStyle}
          height="680px"
        />
      </div>
    </div>
  );
}

