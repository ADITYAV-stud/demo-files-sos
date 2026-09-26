import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Shield, Radio } from 'lucide-react';

export default function LiveMap({
  alerts = [],
  devices = [],
  focusedAlertId = null,
  onSelectAlert = () => {},
  markerStyle = 'radar', // 'radar' | 'pin' | 'diamond'
  height = '420px',
  interactive = true,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const routeLayerRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Real Hardware Demonstrated Coordinate (13.0827° N, 80.2707° E)
    const defaultCenter = [13.0827, 80.2707];
    
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 13,
      zoomControl: interactive,
      dragging: interactive,
      scrollWheelZoom: interactive,
      attributionControl: false
    });

    // 100% Free OpenStreetMap Tiles with Tactical Dark Filter (Zero Watermarks, Zero API Keys, No Attribution Links)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      className: 'tactical-osm-tiles',
      attribution: ''
    }).addTo(map);

    // Add radar grid overlay effect
    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;

    const routeGroup = L.layerGroup().addTo(map);
    routeLayerRef.current = routeGroup;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [interactive]);

  // Update Markers when alerts, devices, or markerStyle changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    const routeGroup = routeLayerRef.current;
    if (!map || !markersGroup || !routeGroup) return;

    markersGroup.clearLayers();
    routeGroup.clearLayers();

    // Helper for status color
    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case 'pending': return { hex: '#FF2A4D', bg: 'bg-rose-500', border: 'border-rose-400', text: 'text-rose-400' };
        case 'acknowledged':
        case 'acknowledge': return { hex: '#FF8800', bg: 'bg-amber-500', border: 'border-amber-400', text: 'text-amber-400' };
        case 'dispatched':
        case 'dispatching':
        case 'dispatch': return { hex: '#F39C12', bg: 'bg-yellow-400', border: 'border-yellow-300', text: 'text-yellow-300' };
        case 'resolved': return { hex: '#00FF66', bg: 'bg-emerald-500', border: 'border-emerald-400', text: 'text-emerald-400' };
        default: return { hex: '#00F0FF', bg: 'bg-cyan-500', border: 'border-cyan-400', text: 'text-cyan-400' };
      }
    };

    // Render Symbol Shape based on user selected markerStyle: 'radar' | 'crosshair' | 'hexagon' | 'satellite' | 'diamond'
    const getSymbolHtml = (col, isCritical, isResolved) => {
      if (markerStyle === 'crosshair') {
        return `
          <div class="relative flex items-center justify-center">
            ${isCritical ? `<div class="absolute w-12 h-12 rounded-full radar-ring bg-rose-500/30"></div>` : ''}
            <div class="w-8 h-8 rounded-full border-2 ${col.border} ${col.bg} flex items-center justify-center text-slate-950 font-bold text-xs shadow-[0_0_15px_${col.hex}] relative">
              <span class="text-sm font-mono font-black">${isResolved ? '✓' : '⌖'}</span>
            </div>
          </div>
        `;
      } else if (markerStyle === 'hexagon') {
        return `
          <div class="relative flex items-center justify-center">
            ${isCritical ? `<div class="absolute w-12 h-12 rounded-full radar-ring bg-rose-500/30"></div>` : ''}
            <div class="w-8 h-8 ${col.bg} border-2 ${col.border} flex items-center justify-center text-slate-950 font-bold text-xs shadow-[0_0_15px_${col.hex}] clip-hexagon">
              <span class="text-sm font-mono font-black">${isResolved ? '✓' : '⬡'}</span>
            </div>
          </div>
        `;
      } else if (markerStyle === 'satellite') {
        return `
          <div class="relative flex items-center justify-center">
            ${isCritical ? `<div class="absolute w-12 h-12 rounded-full radar-ring bg-rose-500/30"></div>` : ''}
            <div class="w-8 h-8 rounded-xl ${col.bg} border-2 ${col.border} flex items-center justify-center text-slate-950 font-bold text-xs shadow-[0_0_15px_${col.hex}]">
              <span class="text-xs font-mono font-black">${isResolved ? '✓' : '📡'}</span>
            </div>
          </div>
        `;
      } else {
        // Default: Tactical Sonar / Radar Rings
        return `
          <div class="relative flex items-center justify-center">
            ${isCritical ? `<div class="absolute w-12 h-12 rounded-full radar-ring bg-rose-500/30"></div>` : ''}
            <div class="w-8 h-8 rounded-full flex items-center justify-center ${col.bg} border-2 ${col.border} shadow-[0_0_15px_${col.hex}] text-slate-950 font-bold text-xs">
              <span class="text-xs font-mono font-black">${isResolved ? '✓' : '!'}</span>
            </div>
          </div>
        `;
      }
    };

    // 1. Draw Real Online Devices
    devices.forEach((dev) => {
      const hasActiveAlert = alerts.some(a => a.deviceId === dev.id && a.status !== 'resolved');
      if (hasActiveAlert || !dev.latitude || !dev.longitude) return;

      const iconHtml = `
        <div class="custom-beacon-marker">
          <div class="relative flex items-center justify-center">
            <span class="w-3.5 h-3.5 rounded-full ${dev.status === 'online' ? 'bg-emerald-400' : 'bg-slate-500'} shadow-md"></span>
            ${dev.status === 'online' ? '<span class="absolute w-6 h-6 rounded-full bg-emerald-400/30 animate-ping"></span>' : ''}
          </div>
          <span class="mt-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900/90 text-slate-200 border border-slate-700 shadow-md">
            Node ${dev.id}
          </span>
        </div>
      `;

      const devIcon = L.divIcon({
        html: iconHtml,
        className: 'device-marker',
        iconSize: [70, 45],
        iconAnchor: [35, 22],
      });

      const marker = L.marker([dev.latitude, dev.longitude], { icon: devIcon }).addTo(markersGroup);
      marker.bindPopup(`
        <div class="p-2 font-mono text-xs bg-slate-950 text-slate-100 rounded border border-cyan-500/40">
          <div class="font-bold text-cyan-400 text-sm">DEVICE ${dev.id}</div>
          <div>Model: ${dev.model}</div>
          <div>Status: <span class="text-emerald-400 font-bold uppercase">${dev.status}</span></div>
          <div>Battery: ${dev.battery}%</div>
          <div>Signal: ${dev.signalStrength} dBm (434.0 MHz)</div>
        </div>
      `);
    });

    // 2. Draw SOS Alerts Markers with dynamic colors and Device ID underneath
    alerts.forEach((alert) => {
      if (!alert.latitude || !alert.longitude) return;
      const col = getStatusColor(alert.status);
      const isCritical = alert.status === 'pending';

      const symbolContent = getSymbolHtml(col, isCritical, alert.status === 'resolved');

      const iconHtml = `
        <div class="custom-beacon-marker group cursor-pointer">
          ${symbolContent}
          <div class="mt-1.5 flex flex-col items-center">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-950/95 ${col.text} border border-slate-700 shadow-lg whitespace-nowrap">
              ${alert.id} (${alert.deviceId})
            </span>
          </div>
        </div>
      `;

      const alertIcon = L.divIcon({
        html: iconHtml,
        className: 'sos-alert-marker',
        iconSize: [90, 60],
        iconAnchor: [45, 30],
      });

      const marker = L.marker([alert.latitude, alert.longitude], { icon: alertIcon }).addTo(markersGroup);
      marker.on('click', () => onSelectAlert(alert));

      // Draw Rescue Team and Path if assigned
      if (alert.assignedTeam && alert.assignedTeam.latitude && alert.assignedTeam.longitude) {
        const team = alert.assignedTeam;
        const teamIconHtml = `
          <div class="custom-beacon-marker">
            <div class="w-8 h-8 rounded-full bg-blue-600 border-2 border-cyan-300 flex items-center justify-center text-white shadow-[0_0_15px_#00B4D8]">
              🚑
            </div>
            <span class="mt-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-950/90 text-cyan-200 border border-cyan-500/40 whitespace-nowrap">
              ${team.name}
            </span>
          </div>
        `;
        const teamIcon = L.divIcon({
          html: teamIconHtml,
          className: 'rescue-team-marker',
          iconSize: [90, 50],
          iconAnchor: [45, 25],
        });

        L.marker([team.latitude, team.longitude], { icon: teamIcon }).addTo(markersGroup);

        // Dashed trajectory route
        const latlngs = [
          [team.latitude, team.longitude],
          [alert.latitude, alert.longitude],
        ];
        L.polyline(latlngs, {
          color: '#00F0FF',
          weight: 3,
          dashArray: '6, 8',
          opacity: 0.85,
        }).addTo(routeGroup);
      }
    });

    // If focused alert, pan/fly to it
    if (focusedAlertId) {
      const target = alerts.find(a => a.id === focusedAlertId);
      if (target && target.latitude && target.longitude) {
        map.flyTo([target.latitude, target.longitude], 14, { duration: 1.2 });
      }
    }
  }, [alerts, devices, focusedAlertId, markerStyle]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-cyan-500/20 shadow-glass" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] px-3 py-2 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-700/60 text-[11px] font-mono flex flex-wrap gap-3 pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_6px_#FF2A4D]"></span>
          <span className="text-slate-300">Pending</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_6px_#FF8800]"></span>
          <span className="text-slate-300">Acknowledge</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_6px_#F39C12]"></span>
          <span className="text-slate-300">Dispatch</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#00FF66]"></span>
          <span className="text-slate-300">Resolved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_6px_#00B4D8]"></span>
          <span className="text-slate-300">Rescue Team</span>
        </div>
      </div>
    </div>
  );
}
