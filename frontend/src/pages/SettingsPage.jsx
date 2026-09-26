import React, { useState } from 'react';
import {
  Sliders,
  Palette,
  MapPin,
  Volume2,
  Bell,
  Shield,
  Save,
  CheckCircle2,
  RefreshCw,
  Radio
} from 'lucide-react';
import { useDispatch } from '../context/DispatchContext';

export default function SettingsPage() {
  const {
    theme,
    setTheme,
    mapSettings,
    setMapSettings,
    soundEnabled,
    setSoundEnabled,
    operator,
    setOperator
  } = useDispatch();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [tempOperatorName, setTempOperatorName] = useState(operator.name);
  const [tempOperatorRole, setTempOperatorRole] = useState(operator.role);
  const [selectedMarker, setSelectedMarker] = useState(mapSettings.markerStyle || 'radar');

  const handleSaveSettings = () => {
    setOperator(prev => ({
      ...prev,
      name: tempOperatorName,
      role: tempOperatorRole,
      avatar: tempOperatorName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    }));

    setMapSettings(prev => ({
      ...prev,
      markerStyle: selectedMarker
    }));

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-wide text-slate-100 uppercase">
          SYSTEM PREFERENCES & CUSTOMIZATION
        </h1>
        <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
          Adjust mission control theme, tactical map symbols, audio telemetry, and operator identity.
        </p>
      </div>

      {/* 1. THEME SELECTION */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <Palette className="w-5 h-5 text-cyan-400" />
          <h2 className="font-display font-bold text-base text-slate-100 uppercase tracking-wider">
            1. INTERFACE THEME
          </h2>
        </div>

        <p className="text-xs font-mono text-slate-400">
          Choose your preferred control-room visual environment:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Dark Blue (Default) */}
          <button
            onClick={() => setTheme('darkBlue')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              theme === 'darkBlue'
                ? 'bg-blue-950/50 border-cyan-400 shadow-glow-cyan ring-1 ring-cyan-400'
                : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-4 h-4 rounded-full bg-[#050B14] border border-cyan-400" />
              {theme === 'darkBlue' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
            </div>
            <div className="font-display font-bold text-sm text-slate-100">DARK BLUE (DEFAULT)</div>
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              Deep naval blue with cyan/emerald neon highlights for night operations.
            </p>
          </button>

          {/* Deep Dark */}
          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              theme === 'dark'
                ? 'bg-slate-900 border-emerald-400 shadow-glow-green ring-1 ring-emerald-400'
                : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-4 h-4 rounded-full bg-[#020408] border border-emerald-400" />
              {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            <div className="font-display font-bold text-sm text-slate-100">DEEP CYBER DARK</div>
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              Ultra-dark OLED black with high contrast green indicators.
            </p>
          </button>

          {/* Light High-Contrast */}
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              theme === 'light'
                ? 'bg-slate-200 border-sky-600 shadow-md ring-1 ring-sky-600'
                : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-4 h-4 rounded-full bg-slate-100 border border-slate-400" />
              {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
            </div>
            <div className="font-display font-bold text-sm text-slate-100">TACTICAL LIGHT</div>
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              High daylight outdoor visibility mode with slate neutrals.
            </p>
          </button>
        </div>
      </div>

      {/* 2. MAP CUSTOMIZATION */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <MapPin className="w-5 h-5 text-cyan-400" />
          <h2 className="font-display font-bold text-base text-slate-100 uppercase tracking-wider">
            2. TACTICAL MAP MARKER & SYMBOL CUSTOMIZATION
          </h2>
        </div>

        <p className="text-xs font-mono text-slate-400">
          Select marker styles for SOS nodes, beacons, and rescue assets on the Live Map:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <button
            onClick={() => setSelectedMarker('radar')}
            className={`p-3.5 rounded-xl border text-center transition ${
              selectedMarker === 'radar'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/80'
            }`}
          >
            <div className="w-8 h-8 mx-auto rounded-full bg-rose-500/30 border border-rose-400 flex items-center justify-center text-rose-400 mb-2 font-bold text-base">
              ⨀
            </div>
            <div className="font-bold">Sonar Radar</div>
            <p className="text-[10px] text-slate-400 mt-1">Expanding sonar wave rings</p>
          </button>

          <button
            onClick={() => setSelectedMarker('crosshair')}
            className={`p-3.5 rounded-xl border text-center transition ${
              selectedMarker === 'crosshair'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/80'
            }`}
          >
            <div className="w-8 h-8 mx-auto rounded-full bg-cyan-500/30 border border-cyan-400 flex items-center justify-center text-cyan-300 mb-2 font-black text-base">
              ⌖
            </div>
            <div className="font-bold">Target Crosshair</div>
            <p className="text-[10px] text-slate-400 mt-1">Precision target crosshair</p>
          </button>

          <button
            onClick={() => setSelectedMarker('hexagon')}
            className={`p-3.5 rounded-xl border text-center transition ${
              selectedMarker === 'hexagon'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/80'
            }`}
          >
            <div className="w-8 h-8 mx-auto bg-amber-500/30 border border-amber-400 flex items-center justify-center text-amber-300 mb-2 font-bold text-base clip-hexagon">
              ⬡
            </div>
            <div className="font-bold">SAR Hexagon</div>
            <p className="text-[10px] text-slate-400 mt-1">Tactical node polygon</p>
          </button>

          <button
            onClick={() => setSelectedMarker('satellite')}
            className={`p-3.5 rounded-xl border text-center transition ${
              selectedMarker === 'satellite'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/80'
            }`}
          >
            <div className="w-8 h-8 mx-auto rounded-xl bg-blue-500/30 border border-blue-400 flex items-center justify-center text-cyan-300 mb-2 text-base">
              📡
            </div>
            <div className="font-bold">Satellite Vector</div>
            <p className="text-[10px] text-slate-400 mt-1">Direct LEO beacon relay</p>
          </button>
        </div>
      </div>

      {/* 3. OPERATOR PROFILE */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <Shield className="w-5 h-5 text-cyan-400" />
          <h2 className="font-display font-bold text-base text-slate-100 uppercase tracking-wider">
            3. OPERATOR CALLSIGN & STATION
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div>
            <label className="block text-slate-400 mb-1">OPERATOR NAME</label>
            <input
              type="text"
              value={tempOperatorName}
              onChange={(e) => setTempOperatorName(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">DUTY ROLE / CALL SIGN</label>
            <input
              type="text"
              value={tempOperatorRole}
              onChange={(e) => setTempOperatorRole(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex items-center justify-between pt-2">
        {savedSuccess ? (
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Preferences successfully updated & persisted!</span>
          </div>
        ) : <div />}

        <button
          onClick={handleSaveSettings}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 hover:from-blue-500 hover:to-cyan-500 text-white font-mono font-bold text-xs uppercase shadow-glow-cyan flex items-center gap-2 transition"
        >
          <Save className="w-4 h-4" />
          <span>SAVE PREFERENCES</span>
        </button>
      </div>
    </div>
  );
}
