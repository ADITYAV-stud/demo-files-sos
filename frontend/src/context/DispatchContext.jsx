import React, { createContext, useContext, useState, useEffect } from 'react';
import initialTelemetry from '../data/telemetry_feed.json';
import { playEmergencyAlarm, playBeep, playRadioChirp, playSuccessChime } from '../utils/soundFx';

const DispatchContext = createContext();

export function DispatchProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('login'); // 'login' | 'dashboard' | 'liveMap' | 'alerts' | 'devices' | 'dispatch' | 'groundStation' | 'settings' | 'help'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [theme, setTheme] = useState('darkBlue'); // 'darkBlue' | 'dark' | 'light'
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Telemetry & Data
  const [alerts, setAlerts] = useState(initialTelemetry.alerts || []);
  const [devices, setDevices] = useState(initialTelemetry.devices || []);
  const [groundStation, setGroundStation] = useState(initialTelemetry.groundStation || {});
  const [lastSignalTime, setLastSignalTime] = useState('1s ago');
  const [systemOnline, setSystemOnline] = useState(true);

  // Map & Focus
  const [focusedAlertId, setFocusedAlertId] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [selectedDispatchAlert, setSelectedDispatchAlert] = useState(null);

  // Incoming Popup state
  const [incomingAlert, setIncomingAlert] = useState(null);

  // Map Customizations
  const [mapSettings, setMapSettings] = useState({
    markerStyle: 'radar', // 'radar' | 'pin' | 'diamond'
    showRangeRings: true,
    satelliteTiles: true,
    autoCenterAlerts: true
  });

  // Operator Info
  const [operator, setOperator] = useState({
    name: 'Karthik R',
    role: 'Lead Rescue Operator',
    badgeId: 'OP-449',
    avatar: 'KR'
  });

  // Apply Theme class to document root
  useEffect(() => {
    document.documentElement.classList.remove('theme-dark', 'theme-light');
    if (theme === 'dark') {
      document.documentElement.classList.add('theme-dark');
    } else if (theme === 'light') {
      document.documentElement.classList.add('theme-light');
    }
  }, [theme]);

  // Periodic signal received timer updates
  useEffect(() => {
    let sec = 1;
    const interval = setInterval(() => {
      sec++;
      if (sec < 60) {
        setLastSignalTime(`${sec}s ago`);
      } else {
        setLastSignalTime(`${Math.floor(sec / 60)}m ago`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Poll FastAPI backend for real SOS alerts
useEffect(() => {
  const pollBackend = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/alerts');

      if (res.ok) {
        const data = await res.json();

        if (Array.isArray(data)) {
          setAlerts(data);
        }
      }
    } catch (err) {
      // Keep existing frontend data if backend is unavailable
      console.log('Backend unavailable');
    }
  };

  pollBackend();

  const interval = setInterval(pollBackend, 3000);

  return () => clearInterval(interval);
}, []);

  // Login Handler
  const handleLogin = () => {
    setIsTransmitting(true);
  };

  const handleTransmissionComplete = () => {
    setIsTransmitting(false);
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
    if (soundEnabled) playSuccessChime();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  // Alert State Transitions: pending -> acknowledged -> dispatched -> resolved
  const acknowledgeAlert = (alertId) => {
    if (soundEnabled) playRadioChirp();
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'acknowledged',
          timeline: [
            ...a.timeline,
            { stage: 'Acknowledged', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), desc: `Acknowledged by ${operator.name}` }
          ]
        };
      }
      return a;
    }));
    if (incomingAlert?.id === alertId) {
      setIncomingAlert(null);
    }
  };

  const dispatchTeamToAlert = (alert) => {
    if (soundEnabled) playRadioChirp();
    const updatedTeam = alert.assignedTeam || {
      id: 'TEAM-01',
      name: 'Rescue Team #1 (Bravo Unit)',
      unitType: 'All-Terrain Medical 4x4',
      eta: '12 mins',
      status: 'En Route',
      latitude: alert.latitude - 0.025,
      longitude: alert.longitude - 0.02,
      contact: '+91 (080) 459-7890'
    };

    setAlerts(prev => prev.map(a => {
      if (a.id === alert.id) {
        return {
          ...a,
          status: 'dispatched',
          assignedTeam: updatedTeam,
          timeline: [
            ...a.timeline,
            { stage: 'Rescue Team Dispatched', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), desc: `${updatedTeam.name} dispatched. ETA ${updatedTeam.eta}` }
          ]
        };
      }
      return a;
    }));

    if (incomingAlert?.id === alert.id) {
      setIncomingAlert(null);
    }
    setSelectedDispatchAlert(alert);
    setCurrentPage('dispatch');
  };

  const resolveAlert = (alertId) => {
    if (soundEnabled) playSuccessChime();
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'resolved',
          timeline: [
            ...a.timeline,
            { stage: 'Alert Resolved', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), desc: 'Victims evacuated and mission marked resolved' }
          ]
        };
      }
      return a;
    }));
  };

  // Trigger a test incoming LoRa packet
  const triggerSimulatedSos = (customPayload = null) => {
    const alertNum = alerts.length + 1;
    const newAlert = customPayload || {
      id: `SOS-${String(alertNum).padStart(3, '0')}`,
      deviceId: `DEV-00${Math.floor(Math.random() * 8) + 1}`,
      messageId: `MSG-${Math.floor(Math.random() * 8999 + 1000)}Z`,
      latitude: 12.9716 + (Math.random() - 0.5) * 0.15,
      longitude: 77.5946 + (Math.random() - 0.5) * 0.15,
      altitude: Math.floor(Math.random() * 800 + 100),
      hdop: 0.9,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fullTimestamp: `${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString()} UTC`,
      alertType: 'Emergency LoRa SOS Beacon',
      severity: 'CRITICAL',
      status: 'pending',
      battery: Math.floor(Math.random() * 40 + 30),
      rssi: -84,
      snr: 8.6,
      spreadingFactor: 'SF10',
      frequency: '868.100 MHz',
      locationName: 'Simulated High-Altitude Wilderness Coordinate',
      rawHex: 'FF534F532D53494D554C4154494F4E2332303236',
      assignedTeam: null,
      timeline: [
        { stage: 'SOS Transmitted', time: new Date().toLocaleTimeString(), desc: 'Off-grid device triggered emergency protocol' }
      ]
    };

    setAlerts(prev => [newAlert, ...prev]);
    setIncomingAlert(newAlert);
    setFocusedAlertId(newAlert.id);
    setLastSignalTime('Just now');
    if (soundEnabled) playEmergencyAlarm();
  };

  // Derived statistics
  const stats = {
    totalSosAlerts: alerts.length,
    activeDevices: devices.filter(d => d.status === 'online').length,
    dispatched: alerts.filter(a => a.status === 'dispatched').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    pending: alerts.filter(a => a.status === 'pending').length,
    acknowledged: alerts.filter(a => a.status === 'acknowledged').length
  };

  return (
    <DispatchContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        isAuthenticated,
        isTransmitting,
        handleLogin,
        handleTransmissionComplete,
        handleLogout,
        theme,
        setTheme,
        soundEnabled,
        setSoundEnabled,
        alerts,
        devices,
        groundStation,
        stats,
        lastSignalTime,
        systemOnline,
        focusedAlertId,
        setFocusedAlertId,
        selectedAlert,
        setSelectedAlert,
        selectedDispatchAlert,
        setSelectedDispatchAlert,
        incomingAlert,
        setIncomingAlert,
        mapSettings,
        setMapSettings,
        operator,
        setOperator,
        acknowledgeAlert,
        dispatchTeamToAlert,
        resolveAlert,
        triggerSimulatedSos
      }}
    >
      {children}
    </DispatchContext.Provider>
  );
}

export const useDispatch = () => useContext(DispatchContext);
