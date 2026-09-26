import React, { useState } from 'react';
import {
  LayoutDashboard,
  MapPin,
  AlertTriangle,
  Radio,
  Send,
  Sliders,
  HelpCircle,
  Bell,
  Volume2,
  VolumeX,
  LogOut,
  ChevronDown,
  Satellite
} from 'lucide-react';
import { useDispatch } from '../context/DispatchContext';

export function Sidebar() {
  const { currentPage, setCurrentPage, systemOnline, alerts } = useDispatch();
  const pendingCount = alerts.filter(a => a.status === 'pending').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'liveMap', label: 'Live Map', icon: MapPin },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: pendingCount },
    { id: 'devices', label: 'Devices', icon: Radio },
    { id: 'dispatch', label: 'Dispatch', icon: Send },
    { id: 'settings', label: 'Settings', icon: Sliders },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-[#060D1A]/90 backdrop-blur-xl border-r border-cyan-500/20 flex flex-col justify-between hidden md:flex select-none">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-cyan-500/15 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 p-0.5 shadow-glow-cyan flex items-center justify-center">
            <Satellite className="w-6 h-6 text-cyan-200 animate-pulse" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg tracking-wider text-slate-100 flex items-center gap-1.5 leading-none uppercase">
              OFF-GRID SOS
            </h1>
            <p className="text-[10px] font-mono text-cyan-400 tracking-wider uppercase mt-1">
              Rescue Dispatch System
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-[0_0_15px_rgba(0,180,216,0.35)] font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status Section */}
      <div className="p-4 m-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${systemOnline ? 'bg-emerald-400 shadow-glow-green animate-pulse' : 'bg-rose-500'}`} />
          <span className="text-xs font-mono font-bold text-slate-200">
            {systemOnline ? 'System Online' : 'System Offline'}
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-400">
          Last Updated:
          <div className="text-slate-300 font-semibold mt-0.5">
            {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </aside>
  );
}

export function Topbar() {
  const {
    operator,
    lastSignalTime,
    soundEnabled,
    setSoundEnabled,
    handleLogout,
    alerts,
    setCurrentPage
  } = useDispatch();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const pendingAlerts = alerts.filter(a => a.status === 'pending');

  return (
    <header className="h-16 px-4 md:px-6 bg-[#060D1A]/80 backdrop-blur-xl border-b border-cyan-500/20 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Mobile Menu / Brand */}
      <div className="flex items-center gap-3 md:hidden">
        <Satellite className="w-6 h-6 text-cyan-400" />
        <span className="font-display font-bold text-slate-100 text-base">OFF-GRID SOS</span>
      </div>

      {/* Top Centre: Glass/blurred status banner */}
      <div className="hidden sm:flex items-center justify-center flex-1 mx-4">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-950/70 border border-cyan-500/30 shadow-glass backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono text-cyan-300">
              Last Signal Received <strong className="text-slate-100">{lastSignalTime}</strong>
            </span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>bladeRF SDR Link OK</span>
          </div>
        </div>
      </div>

      {/* Right Action Icons & Operator Profile */}
      <div className="flex items-center gap-3">
        {/* Audio Mute Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Mute Alert Audio' : 'Unmute Alert Audio'}
          className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
        </button>

        {/* Notification Bell with Badge */}
        <button
          onClick={() => setCurrentPage('alerts')}
          className="relative p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition"
        >
          <Bell className="w-4 h-4" />
          {pendingAlerts.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {pendingAlerts.length}
            </span>
          )}
        </button>

        {/* Operator Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/40 transition"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center font-display font-bold text-xs text-white shadow-md">
              {operator.avatar}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-200 leading-tight">{operator.name}</div>
              <div className="text-[10px] font-mono text-cyan-400 leading-tight">{operator.role}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#091120] border border-cyan-500/30 shadow-2xl p-2 z-50 animate-in fade-in">
              <div className="px-3 py-2 border-b border-slate-800">
                <div className="text-xs font-bold text-slate-200">{operator.name}</div>
                <div className="text-[10px] font-mono text-slate-400">{operator.badgeId}</div>
              </div>
              <button
                onClick={() => { setShowProfileMenu(false); setCurrentPage('settings'); }}
                className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg transition mt-1"
              >
                Settings & Preferences
              </button>
              <button
                onClick={() => { setShowProfileMenu(false); handleLogout(); }}
                className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-2 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

