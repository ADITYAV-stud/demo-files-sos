import React, { useEffect, useState } from 'react';
import { Radio, Satellite, TowerControl, ShieldCheck, Activity, Cpu } from 'lucide-react';

export default function TransmissionLoading({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      label: "SOS Device Activated",
      detail: "Transmitting SOS Message…",
      icon: Radio,
      activeColor: "text-rose-400 border-rose-500 shadow-glow-red",
      stage: "DEVICE_TX"
    },
    {
      label: "LoRa Spread Spectrum",
      detail: "Wireless LoRa Signal Waves (434.0 MHz / SF9 / 125kHz)…",
      icon: Activity,
      activeColor: "text-cyan-400 border-cyan-400 shadow-glow-cyan",
      stage: "LORA_WAVE"
    },
    {
      label: "Satellite Orbit Link",
      detail: "Establishing Satellite Link…",
      icon: Satellite,
      activeColor: "text-cyan-300 border-cyan-300 shadow-glow-cyan",
      stage: "SATELLITE"
    },
    {
      label: "Ground Station Ingest",
      detail: "Signal Received… (bladeRF SDR Demodulator)",
      icon: TowerControl,
      activeColor: "text-emerald-400 border-emerald-400 shadow-glow-green",
      stage: "GROUND_STATION"
    },
    {
      label: "Rescue Dashboard Active",
      detail: "Opening Rescue Dashboard…",
      icon: ShieldCheck,
      activeColor: "text-emerald-300 border-emerald-300 shadow-glow-green",
      stage: "DASHBOARD"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onComplete(), 600);
          return 100;
        }
        const next = prev + 1.35;
        // Update active step index based on progress
        if (next < 20) setCurrentStep(0);
        else if (next < 45) setCurrentStep(1);
        else if (next < 70) setCurrentStep(2);
        else if (next < 90) setCurrentStep(3);
        else setCurrentStep(4);

        return next;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030712] overflow-hidden p-4 select-none">
      {/* Background Starfield and Cyber Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,180,216,0.18),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#00F0FF_1px,transparent_1px),linear-gradient(to_bottom,#00F0FF_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative z-10 w-full max-w-4xl p-8 rounded-2xl glass-modal border border-cyan-500/40 shadow-2xl flex flex-col items-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-6 animate-pulse">
          <Cpu className="w-3.5 h-3.5" />
          <span>OFF-GRID SOS • SATELLITE RELAY PROTOCOL</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-100 tracking-wider text-center uppercase mb-2">
          ESTABLISHING RESCUE DISPATCH PIPELINE
        </h2>
        <p className="text-cyan-300 text-sm font-mono text-center mb-10 max-w-lg font-semibold">
          {steps[currentStep].detail}
        </p>

        {/* 5-Stage Transmission Nodes Visualizer */}
        <div className="w-full relative flex items-center justify-between mb-12 px-2 sm:px-6">
          {/* Background Connecting Rail */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-800/90 -z-0 rounded-full" />

          {/* Animated Glowing Progress Beam */}
          <div
            className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-rose-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-100 shadow-[0_0_12px_#00F0FF]"
            style={{ width: `calc(${progress}% - 3rem)` }}
          />

          {steps.map((st, idx) => {
            const Icon = st.icon;
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center border-2 transition-all duration-300 bg-slate-950 ${
                    isCurrent
                      ? `${st.activeColor} scale-110 animate-pulse`
                      : isCompleted
                      ? 'border-emerald-500 text-emerald-400 shadow-glow-green'
                      : 'border-slate-800 text-slate-600'
                  }`}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>

                <div className="mt-3 text-center">
                  <span
                    className={`block text-[11px] sm:text-xs font-mono font-bold tracking-tight ${
                      isCurrent ? 'text-cyan-300' : isCompleted ? 'text-emerald-400' : 'text-slate-600'
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar & Percentage */}
        <div className="w-full max-w-lg flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              {steps[currentStep].stage}
            </span>
            <span className="font-bold text-slate-200 text-sm">{Math.min(100, Math.round(progress))}%</span>
          </div>

          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-emerald-300 rounded-full transition-all duration-75 shadow-[0_0_10px_#00FF66]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Transmission Status Logs */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-500">
          <span>PACKET: 64 BYTES</span>
          <span>•</span>
          <span>SDR: bladeRF 2.0 micro xA4</span>
          <span>•</span>
          <span>ENCRYPTION: AES-256 GCM</span>
        </div>
      </div>
    </div>
  );
}

