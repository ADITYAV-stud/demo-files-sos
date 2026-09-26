import React, { useState } from 'react';
import {
  Send,
  Radio,
  Battery,
  CheckCircle2,
  Clock,
  Truck,
  Shield,
  Activity,
  Phone,
  Navigation,
  AlertTriangle,
  ChevronRight,
  UserCheck,
  Zap,
  PhoneCall,
  FileText
} from 'lucide-react';
import { useDispatch } from '../context/DispatchContext';

export default function DispatchPage() {
  const {
    alerts,
    selectedDispatchAlert,
    setSelectedDispatchAlert,
    acknowledgeAlert,
    dispatchTeamToAlert,
    resolveAlert,
    operator
  } = useDispatch();

  // Selected target SOS for dispatch operations (default to first active or dispatched)
  const activeAlert = selectedDispatchAlert || alerts.find(a => a.status === 'dispatched') || alerts[0];

  const [notes, setNotes] = useState('');

  if (!activeAlert) {
    return (
      <div className="p-12 text-center glass-panel rounded-2xl border border-cyan-500/20 bg-slate-950/80">
        <h2 className="text-xl font-display font-bold text-slate-200">No Active Emergency Alerts</h2>
        <p className="text-xs font-mono text-slate-400 mt-2">All SOS signals currently resolved.</p>
      </div>
    );
  }

  // Stages for four-stage progress flow
  const stages = [
    { id: 'pending', label: 'Pending', step: 1, desc: 'Awaiting Operator Verification' },
    { id: 'acknowledged', label: 'Acknowledge', step: 2, desc: 'Signal Validated by Base' },
    { id: 'dispatched', label: 'Dispatch', step: 3, desc: 'Rescue Team En Route' },
    { id: 'resolved', label: 'Resolved', step: 4, desc: 'Mission Completed Safely' },
  ];

  const getStageIndex = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 0;
      case 'acknowledged': return 1;
      case 'dispatched': return 2;
      case 'resolved': return 3;
      default: return 0;
    }
  };

  const currentStageIdx = getStageIndex(activeAlert.status);

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Top Header & Alert Selector Strip */}
      <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20 bg-gradient-to-r from-slate-950 via-[#061226] to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-glow-cyan">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#00FF66]" />
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-semibold">
                TACTICAL SAR COMMAND CENTER
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-100 uppercase tracking-wider mt-0.5">
              RESCUE DISPATCH CONSOLE
            </h1>
            <p className="text-xs font-mono text-slate-400">
              Active Focus Target: <strong className="text-rose-400">{activeAlert.id}</strong> (Device <strong className="text-cyan-300">{activeAlert.deviceId}</strong>) • {activeAlert.locationName}
            </p>
          </div>
        </div>

        {/* Quick Alert Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {alerts.map((al) => (
            <button
              key={al.id}
              onClick={() => setSelectedDispatchAlert(al)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 ${
                activeAlert.id === al.id
                  ? 'bg-blue-600 text-white shadow-glow-cyan border border-cyan-400'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                al.status === 'pending' ? 'bg-rose-500 animate-pulse shadow-[0_0_6px_#FF2A4D]' :
                al.status === 'dispatched' ? 'bg-yellow-400 shadow-[0_0_6px_#F39C12]' :
                al.status === 'acknowledged' ? 'bg-amber-400 shadow-[0_0_6px_#FF8800]' : 'bg-emerald-400'
              }`} />
              <span>{al.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Target SOS Telemetry Banner */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-500 block text-[10px]">COORDINATES</span>
            <span className="text-slate-200 font-bold">{activeAlert.latitude?.toFixed(4)}° N, {activeAlert.longitude?.toFixed(4)}° E</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">ALTITUDE / HDOP</span>
            <span className="text-slate-200 font-bold">{activeAlert.altitude} m / {activeAlert.hdop}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">ALERT TYPE</span>
            <span className="text-rose-400 font-bold">{activeAlert.alertType}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-500">ASSIGNED UNIT:</span>
          <span className="text-cyan-300 font-bold px-2.5 py-1 rounded bg-slate-900 border border-slate-700">
            {activeAlert.assignedTeam?.name || 'Rescue Team #1 (Standby Unit)'}
          </span>
        </div>
      </div>

      {/* FOUR MAJOR DISPATCH SECTIONS (NO MAP AS REQUESTED) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SECTION 1: SIGNAL STRENGTH */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-[#040c1c]/90 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Radio className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-sm tracking-wider text-slate-100 uppercase">
                1. SIGNAL STRENGTH & RF TELEMETRY
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              bladeRF SDR LOCK
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center font-mono">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">RSSI (POWER)</div>
              <div className={`text-base font-bold mt-1 ${activeAlert.rssi > -85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {activeAlert.rssi} dBm
              </div>
              <div className="text-[9px] text-slate-500 mt-0.5">Threshold: &gt; -115 dBm</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">SNR (QUALITY)</div>
              <div className="text-base font-bold text-emerald-300 mt-1">
                +{activeAlert.snr} dB
              </div>
              <div className="text-[9px] text-slate-500 mt-0.5">Demod Link Margin: OK</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">SIGNAL QUALITY</div>
              <div className="text-base font-bold text-cyan-300 mt-1">
                {activeAlert.rssi > -80 ? 'EXCELLENT' : activeAlert.rssi > -95 ? 'GOOD' : 'MARGINAL'}
              </div>
              <div className="text-[9px] text-slate-500 mt-0.5">CRC: PASS (0 Loss)</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 font-mono text-xs space-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Center Frequency:</span>
              <span className="text-slate-200">{activeAlert.frequency || '434.000 MHz'} (125 kHz BW)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Modulation / Coding:</span>
              <span className="text-slate-200">{activeAlert.spreadingFactor || 'SF9'} / CR 4/7</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Radio Encryption:</span>
              <span className="text-emerald-400 font-bold">AES-256-GCM (64-Byte Frame)</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: BATTERY & POWER */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-[#040c1c]/90 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Battery className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-sm tracking-wider text-slate-100 uppercase">
                2. BATTERY & DEVICE POWER STATUS
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {activeAlert.battery}% CHARGED
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-slate-400 text-xs mb-1.5">
                <span>Power Level Indicator</span>
                <span className="font-bold text-slate-200">{activeAlert.battery}%</span>
              </div>
              <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    activeAlert.battery > 50
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_12px_#00FF66]'
                      : activeAlert.battery > 20
                      ? 'bg-amber-400'
                      : 'bg-rose-500 animate-pulse'
                  }`}
                  style={{ width: `${activeAlert.battery}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">EST. OPERATIONAL LIFE</span>
                <span className="text-slate-200 font-bold text-sm">~{Math.round(activeAlert.battery * 0.6)} Hours</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">CELL VOLTAGE</span>
                <span className="text-slate-200 font-bold text-sm">3.82 V (Li-Po)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Deep Sleep Power Savings:</span>
              <span className="text-emerald-400 font-semibold">ACTIVE BETWEEN TRANSMISSIONS</span>
            </div>
          </div>
        </div>

        {/* SECTION 3: FOUR-STAGE STATUS PROGRESS FLOW */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-[#040c1c]/90 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-sm tracking-wider text-slate-100 uppercase">
                3. RESCUE STATUS PROGRESS FLOW
              </h3>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
              STAGE {currentStageIdx + 1} OF 4
            </span>
          </div>

          {/* 4-Stage Progress Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {stages.map((st, i) => {
              const isPassed = i < currentStageIdx;
              const isCurrent = i === currentStageIdx;

              return (
                <div
                  key={st.id}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-b from-yellow-500/25 to-slate-950 border-yellow-400 text-yellow-300 shadow-[0_0_15px_rgba(243,156,18,0.35)] ring-1 ring-yellow-400'
                      : isPassed
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-600'
                  }`}
                >
                  <div className="text-xs font-mono font-bold">Stage {st.step}</div>
                  <div className="text-xs font-display font-bold tracking-tight uppercase mt-1">
                    {st.label}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-1 leading-tight">
                    {st.desc}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Trigger Buttons */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            {activeAlert.status === 'pending' && (
              <button
                onClick={() => acknowledgeAlert(activeAlert.id)}
                className="w-full py-3.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 transition shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ACKNOWLEDGE EMERGENCY SOS</span>
              </button>
            )}

            {activeAlert.status !== 'dispatched' && activeAlert.status !== 'resolved' && (
              <button
                onClick={() => dispatchTeamToAlert(activeAlert)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 hover:from-blue-500 hover:to-cyan-500 text-white font-mono font-bold text-xs uppercase shadow-glow-cyan flex items-center justify-center gap-2 transition"
              >
                <Send className="w-4 h-4" />
                <span>DISPATCH RESCUE TEAM (BRAVO UNIT)</span>
              </button>
            )}

            {activeAlert.status === 'dispatched' && (
              <button
                onClick={() => resolveAlert(activeAlert.id)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs uppercase shadow-glow-green flex items-center justify-center gap-2 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>MARK RESCUE INCIDENT AS RESOLVED</span>
              </button>
            )}
          </div>
        </div>

        {/* SECTION 4: ACTIONS & PERFORMED OPERATIONS */}
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-[#040c1c]/90 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-cyan-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-sm tracking-wider text-slate-100 uppercase">
                4. PERFORMED OPERATIONS & AUDIT LOG
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              OPERATOR: {operator.name}
            </span>
          </div>

          {/* Operational Timeline */}
          <div className="space-y-2 max-h-48 overflow-y-auto text-xs font-mono pr-1">
            {activeAlert.timeline?.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800/90">
                <span className="text-cyan-400 font-bold whitespace-nowrap text-[11px]">{item.time}</span>
                <div>
                  <span className="text-slate-200 font-semibold">{item.stage}</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Assigned Rescue Unit Quick Contact Box */}
          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-slate-200 font-bold block">{activeAlert.assignedTeam?.name || 'Rescue Team #1 (Bravo Unit)'}</span>
                <span className="text-[11px] text-cyan-300">ETA: {activeAlert.assignedTeam?.eta || '12 mins'} • VHF: 156.800 MHz</span>
              </div>
            </div>
            <a
              href="tel:+910804597890"
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:bg-slate-800 flex items-center gap-1.5 transition text-[11px]"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

