import React, { useState } from 'react';
import {
  Radio,
  Search,
  Plus,
  Battery,
  MapPin,
  CheckCircle,
  XCircle,
  Wifi,
  Cpu,
  History,
  Shield
} from 'lucide-react';
import { useDispatch } from '../context/DispatchContext';

export default function DevicesPage() {
  const { devices, setFocusedAlertId, setCurrentPage } = useDispatch();
  const [filterState, setFilterState] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New device input form state
  const [newDevId, setNewDevId] = useState(`1002`);
  const [newDevModel, setNewDevModel] = useState('ESP32 DevKit V1 + SX1278 (Ra-02)');
  const [newDevOwner, setNewDevOwner] = useState('Emergency Field Responder');

  const filteredDevices = devices.filter((dev) => {
    const matchFilter =
      filterState === 'ALL' ||
      (filterState === 'ONLINE' && dev.status === 'online') ||
      (filterState === 'OFFLINE' && dev.status === 'offline');
    const matchSearch =
      dev.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dev.owner && dev.owner.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (dev.model && dev.model.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-wide text-slate-100 uppercase">
            DEVICE MANAGEMENT & TELEMETRY
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            Registered off-grid hardware nodes, battery health, and satellite uplink history.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-mono font-bold text-xs uppercase shadow-glow-cyan flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Register Device</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Device ID, Model, Owner..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-xs font-mono outline-none focus:border-cyan-400"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2">
          {['ALL', 'ONLINE', 'OFFLINE'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterState(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition ${
                filterState === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-glow-cyan'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Device Table */}
      <div className="glass-panel rounded-2xl border border-cyan-500/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-slate-950/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="p-3.5 font-bold">Device ID</th>
                <th className="p-3.5 font-bold">Controller & Transceiver</th>
                <th className="p-3.5 font-bold">RF Frequency</th>
                <th className="p-3.5 font-bold">Coordinates (Lat / Lon)</th>
                <th className="p-3.5 font-bold">Alt / HDOP</th>
                <th className="p-3.5 font-bold">Battery</th>
                <th className="p-3.5 font-bold">Signal (RSSI / SNR)</th>
                <th className="p-3.5 font-bold">Security Frame</th>
                <th className="p-3.5 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/30">
              {filteredDevices.map((dev) => (
                <tr key={dev.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-cyan-300 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-cyan-400" />
                    <span>{dev.id}</span>
                  </td>
                  <td className="p-3.5 text-slate-200">
                    <div className="font-bold">{dev.model}</div>
                    <div className="text-[10px] text-slate-400 font-mono">SX1278 SPI LoRa Module</div>
                  </td>
                  <td className="p-3.5 text-slate-300 font-mono">
                    <span className="text-cyan-400 font-bold">{dev.frequency || '434.000 MHz'}</span>
                    <span className="text-[10px] text-slate-500 block">BW: 125kHz | SF9 | CR 4/7</span>
                  </td>
                  <td className="p-3.5 text-slate-200 font-mono">
                    {dev.latitude ? `${dev.latitude.toFixed(4)}° N, ${dev.longitude.toFixed(4)}° E` : '—'}
                  </td>
                  <td className="p-3.5 text-slate-300 font-mono">
                    {dev.altitude} m / 1.05
                  </td>
                  <td className="p-3.5 text-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-emerald-400"
                          style={{ width: `${dev.battery}%` }}
                        />
                      </div>
                      <span className="font-bold text-emerald-400">{dev.battery}%</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-300 font-mono">
                    <span className="text-emerald-400 font-bold">{dev.signalStrength} dBm</span>
                    <span className="text-[10px] text-slate-400 block">+8.5 dB SNR</span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      AES-256-GCM (64B)
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#00FF66]" />
                      <span>ONLINE</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#091222] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-display font-bold text-slate-100 uppercase tracking-wider">
              REGISTER NEW OFF-GRID BEACON
            </h3>
            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-slate-400 mb-1">DEVICE IDENTIFIER</label>
                <input
                  type="text"
                  value={newDevId}
                  onChange={(e) => setNewDevId(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">HARDWARE MODEL</label>
                <select
                  value={newDevModel}
                  onChange={(e) => setNewDevModel(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100"
                >
                  <option value="LoRa-Beacon-Pro-X1">LoRa-Beacon-Pro-X1 (868MHz)</option>
                  <option value="OffGrid-SOS-Hiker-V2">OffGrid-SOS-Hiker-V2 (GPS + Fall Sensor)</option>
                  <option value="Marine-LoRa-EPIRB">Marine-LoRa-EPIRB (Distress Floating)</option>
                  <option value="LoRa-Tracker-Solar">LoRa-Tracker-Solar (Outpost)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">DEPLOYED GROUP / OWNER</label>
                <input
                  type="text"
                  value={newDevOwner}
                  onChange={(e) => setNewDevOwner(e.target.value)}
                  placeholder="e.g. Mountain Trek Unit 3"
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Device ${newDevId} registered into Ground Station directory.`);
                  setShowAddModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-mono font-bold text-xs"
              >
                Confirm Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
