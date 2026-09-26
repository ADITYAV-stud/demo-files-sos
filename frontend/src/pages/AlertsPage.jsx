import React, { useState } from 'react';
import {
  AlertTriangle,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Radio,
  FileSpreadsheet
} from 'lucide-react';
import { useDispatch } from '../context/DispatchContext';

export default function AlertsPage() {
  const {
    alerts,
    setSelectedAlert,
    setFocusedAlertId,
    setCurrentPage
  } = useDispatch();

  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlerts = alerts.filter((al) => {
    const matchStatus = filterStatus === 'ALL' || al.status?.toUpperCase() === filterStatus;
    const matchSearch =
      al.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      al.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      al.messageId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      al.alertType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#FF2A4D]" />
            <span>Pending / SOS</span>
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-300 whitespace-nowrap">
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/20 bg-gradient-to-r from-slate-950 via-[#061226] to-slate-950">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-semibold">
              INCIDENT REGISTRY & SATELLITE TELEMETRY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-wide text-slate-100 uppercase mt-1">
            ALERT LOGS & INCIDENT HISTORY
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            Historical ledger of off-grid LoRa distress transmissions verified and decoded via bladeRF SDR.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-950/70">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Alert ID, Device ID, Type..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 text-xs font-mono outline-none focus:border-cyan-400"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {['ALL', 'PENDING', 'ACKNOWLEDGED', 'DISPATCHED', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition whitespace-nowrap ${
                filterStatus === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-glow-cyan'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Alerts Table (Alert ID, Device ID, Message ID, Timestamp, Alert Type only) */}
      <div className="glass-panel rounded-2xl border border-cyan-500/20 overflow-hidden bg-slate-950/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-slate-950/95 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="p-4 font-bold pr-3">Alert ID</th>
                <th className="p-4 font-bold pr-3">Device ID</th>
                <th className="p-4 font-bold pr-3">Message ID</th>
                <th className="p-4 font-bold pr-3">Timestamp</th>
                <th className="p-4 font-bold pr-3">Alert Type</th>
                <th className="p-4 font-bold pr-3">Status</th>
                <th className="p-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/30">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-500">
                    No matching alert records found in ground station archive.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((al) => (
                  <tr key={al.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* 1. Alert ID */}
                    <td className="p-4 font-bold text-rose-400 whitespace-nowrap pr-3">
                      {al.id}
                    </td>
                    {/* 2. Device ID */}
                    <td className="p-4 font-bold text-cyan-300 whitespace-nowrap pr-3">
                      {al.deviceId}
                    </td>
                    {/* 3. Message ID */}
                    <td className="p-4 text-slate-300 whitespace-nowrap pr-3">
                      {al.messageId}
                    </td>
                    {/* 4. Timestamp */}
                    <td className="p-4 text-slate-300 whitespace-nowrap pr-3">
                      {al.timestamp}
                    </td>
                    {/* 5. Alert Type */}
                    <td className="p-4 text-slate-200 font-semibold whitespace-nowrap pr-3">
                      {al.alertType}
                    </td>
                    {/* Status Badge */}
                    <td className="p-4 whitespace-nowrap pr-3">
                      {getStatusBadge(al.status)}
                    </td>
                    {/* Actions */}
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2 justify-end">
                        <button
                          onClick={() => {
                            setFocusedAlertId(al.id);
                            setCurrentPage('liveMap');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/20 text-cyan-300 border border-slate-700 hover:border-cyan-400 text-xs transition font-mono"
                          title="Focus on Live Map"
                        >
                          Map
                        </button>
                        <button
                          onClick={() => setSelectedAlert(al)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 text-xs transition font-mono"
                          title="View Telemetry & Crypto Validation"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

