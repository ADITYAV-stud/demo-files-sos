import React, { useEffect, useRef, useState } from 'react';
import { Radio, Activity, Cpu, Wifi, Sliders, Play, Pause, RefreshCw, BarChart2 } from 'lucide-react';

// Matplotlib Colormaps RGB Lookup generators
const COLORMAPS = {
  viridis: (val) => {
    // Matplotlib Viridis: Dark Purple -> Blue -> Green -> Bright Yellow
    const v = Math.max(0, Math.min(1, val));
    let r, g, b;
    if (v < 0.25) {
      const t = v / 0.25;
      r = Math.floor(68 * (1 - t) + 49 * t);
      g = Math.floor(1 * (1 - t) + 104 * t);
      b = Math.floor(84 * (1 - t) + 142 * t);
    } else if (v < 0.5) {
      const t = (v - 0.25) / 0.25;
      r = Math.floor(49 * (1 - t) + 33 * t);
      g = Math.floor(104 * (1 - t) + 145 * t);
      b = Math.floor(142 * (1 - t) + 140 * t);
    } else if (v < 0.75) {
      const t = (v - 0.5) / 0.25;
      r = Math.floor(33 * (1 - t) + 53 * t);
      g = Math.floor(145 * (1 - t) + 183 * t);
      b = Math.floor(140 * (1 - t) + 121 * t);
    } else {
      const t = (v - 0.75) / 0.25;
      r = Math.floor(53 * (1 - t) + 253 * t);
      g = Math.floor(183 * (1 - t) + 231 * t);
      b = Math.floor(121 * (1 - t) + 37 * t);
    }
    return [r, g, b];
  },
  plasma: (val) => {
    // Matplotlib Plasma: Navy Blue -> Violet -> Orange -> Yellow
    const v = Math.max(0, Math.min(1, val));
    let r, g, b;
    if (v < 0.33) {
      const t = v / 0.33;
      r = Math.floor(13 * (1 - t) + 156 * t);
      g = Math.floor(8 * (1 - t) + 23 * t);
      b = Math.floor(135 * (1 - t) + 158 * t);
    } else if (v < 0.66) {
      const t = (v - 0.33) / 0.33;
      r = Math.floor(156 * (1 - t) + 237 * t);
      g = Math.floor(23 * (1 - t) + 121 * t);
      b = Math.floor(158 * (1 - t) + 83 * t);
    } else {
      const t = (v - 0.66) / 0.34;
      r = Math.floor(237 * (1 - t) + 240 * t);
      g = Math.floor(121 * (1 - t) + 249 * t);
      b = Math.floor(83 * (1 - t) + 33 * t);
    }
    return [r, g, b];
  },
  turbo: (val) => {
    // Matplotlib Turbo / Rainbow: Deep Blue -> Cyan -> Green -> Yellow -> Red
    const v = Math.max(0, Math.min(1, val));
    const r = Math.floor(Math.sin(v * Math.PI - Math.PI / 2) * 127 + 128);
    const g = Math.floor(Math.sin(v * Math.PI) * 255);
    const b = Math.floor(Math.cos(v * Math.PI / 2) * 255);
    return [r, g, b];
  },
  cyber: (val) => {
    // Cyberpunk Neon: Deep Navy -> Electric Cyan -> Fluorescent Green
    const v = Math.max(0, Math.min(1, val));
    let r, g, b;
    if (v < 0.5) {
      const t = v / 0.5;
      r = Math.floor(2 * (1 - t) + 0 * t);
      g = Math.floor(15 * (1 - t) + 240 * t);
      b = Math.floor(40 * (1 - t) + 255 * t);
    } else {
      const t = (v - 0.5) / 0.5;
      r = Math.floor(0 * (1 - t) + 57 * t);
      g = Math.floor(240 * (1 - t) + 255 * t);
      b = Math.floor(255 * (1 - t) + 20 * t);
    }
    return [r, g, b];
  }
};

export default function WaterfallVisualizer({
  rssi = -72,
  snr = 8.5,
  frequency = "434.000 MHz",
  bandwidth = "125 kHz",
  sf = "SF9",
  cr = "4/7",
  status = "bladeRF 2.0 micro xA4 ACTIVE"
}) {
  const fftCanvasRef = useRef(null);
  const waterfallCanvasRef = useRef(null);

  const [colormap, setColormap] = useState('viridis');
  const [isRunning, setIsRunning] = useState(true);
  const [liveRssi, setLiveRssi] = useState(rssi);
  const [liveSnr, setLiveSnr] = useState(snr);

  // Live telemetry subtle variation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveRssi(rssi + (Math.floor(Math.random() * 5) - 2));
      setLiveSnr(parseFloat((snr + (Math.random() * 0.4 - 0.2)).toFixed(1)));
    }, 1500);
    return () => clearInterval(interval);
  }, [rssi, snr]);

  useEffect(() => {
    const fftCanvas = fftCanvasRef.current;
    const wfCanvas = waterfallCanvasRef.current;
    if (!fftCanvas || !wfCanvas) return;

    const fftCtx = fftCanvas.getContext('2d');
    const wfCtx = wfCanvas.getContext('2d');

    const numBins = 256;
    let animId;
    let time = 0;
    let chirpOffset = 0;

    // Buffer for offscreen waterfall scrolling
    const offCanvas = document.createElement('canvas');
    offCanvas.width = numBins;
    offCanvas.height = 160;
    const offCtx = offCanvas.getContext('2d');
    offCtx.fillStyle = '#020610';
    offCtx.fillRect(0, 0, numBins, 160);

    const render = () => {
      if (isRunning) {
        time += 0.03;
        chirpOffset = (chirpOffset + 0.02) % 1;

        // Generate synthetic FFT bin power slice with LoRa Chirp modulation
        const fftData = new Float32Array(numBins);
        const centerBin = Math.floor(numBins / 2);
        const chirpWidth = Math.floor(numBins * 0.48); // 125 kHz BW representation
        const startBin = centerBin - Math.floor(chirpWidth / 2);

        for (let i = 0; i < numBins; i++) {
          // Noise floor (-115 dBm to -105 dBm baseline)
          let noise = (Math.random() * 0.12) + 0.05;

          // LoRa carrier & sweeping chirp tone
          if (i >= startBin && i <= startBin + chirpWidth) {
            const relPos = (i - startBin) / chirpWidth;
            // LoRa linear up-chirp instantaneous frequency position
            const chirpBin = startBin + Math.floor(chirpOffset * chirpWidth);
            const dist = Math.abs(i - chirpBin);

            if (dist < 4) {
              // Peak signal power
              const peakPower = (1 - dist / 4) * 0.85;
              noise += peakPower;
            } else {
              // Elevated channel power in 125 kHz channel
              noise += 0.15 * Math.sin(relPos * Math.PI);
            }
          }

          fftData[i] = Math.min(1.0, noise);
        }

        // 1. DRAW TOP FFT SPECTRUM
        const fw = fftCanvas.width;
        const fh = fftCanvas.height;
        fftCtx.clearRect(0, 0, fw, fh);

        // Grid lines (dBm levels: -40dBm, -60dBm, -80dBm, -100dBm, -120dBm)
        fftCtx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
        fftCtx.lineWidth = 1;
        for (let g = 0; g < fh; g += fh / 4) {
          fftCtx.beginPath();
          fftCtx.moveTo(0, g);
          fftCtx.lineTo(fw, g);
          fftCtx.stroke();
        }

        // Vertical frequency grid
        for (let x = 0; x < fw; x += fw / 6) {
          fftCtx.beginPath();
          fftCtx.moveTo(x, 0);
          fftCtx.lineTo(x, fh);
          fftCtx.stroke();
        }

        // Center frequency marker
        fftCtx.strokeStyle = 'rgba(0, 255, 102, 0.4)';
        fftCtx.setLineDash([2, 2]);
        fftCtx.beginPath();
        fftCtx.moveTo(fw / 2, 0);
        fftCtx.lineTo(fw / 2, fh);
        fftCtx.stroke();
        fftCtx.setLineDash([]);

        // Plot FFT Curve
        fftCtx.beginPath();
        fftCtx.lineWidth = 2;
        fftCtx.strokeStyle = '#00FF66';
        fftCtx.shadowColor = '#00FF66';
        fftCtx.shadowBlur = 6;

        for (let i = 0; i < numBins; i++) {
          const x = (i / (numBins - 1)) * fw;
          const y = fh - fftData[i] * (fh * 0.92);
          if (i === 0) fftCtx.moveTo(x, y);
          else fftCtx.lineTo(x, y);
        }
        fftCtx.stroke();
        fftCtx.shadowBlur = 0;

        // FFT Gradient Fill under curve
        const grad = fftCtx.createLinearGradient(0, 0, 0, fh);
        grad.addColorStop(0, 'rgba(0, 255, 102, 0.25)');
        grad.addColorStop(1, 'rgba(0, 100, 255, 0.02)');
        fftCtx.lineTo(fw, fh);
        fftCtx.lineTo(0, fh);
        fftCtx.closePath();
        fftCtx.fillStyle = grad;
        fftCtx.fill();

        // 2. DRAW WATERFALL (Shift old image down by 1 row)
        offCtx.drawImage(offCanvas, 0, 0, numBins, 159, 0, 1, numBins, 159);

        // Draw top 1px slice using the selected colormap
        const colorMapFn = COLORMAPS[colormap] || COLORMAPS.viridis;
        const imgData = offCtx.createImageData(numBins, 1);
        for (let i = 0; i < numBins; i++) {
          const [r, g, b] = colorMapFn(fftData[i]);
          imgData.data[i * 4 + 0] = r;
          imgData.data[i * 4 + 1] = g;
          imgData.data[i * 4 + 2] = b;
          imgData.data[i * 4 + 3] = 255;
        }
        offCtx.putImageData(imgData, 0, 0);

        // Render scaled offscreen canvas to main waterfall canvas
        wfCtx.imageSmoothingEnabled = false;
        wfCtx.drawImage(offCanvas, 0, 0, wfCanvas.width, wfCanvas.height);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [colormap, isRunning]);

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-cyan-500/30 bg-slate-950/80 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-cyan-500/15 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 text-white shadow-glow-cyan flex items-center justify-center">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-display font-bold text-base tracking-wider text-slate-100 uppercase">
                MATPLOTLIB WATERFALL SDR SPECTROGRAM
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                {status}
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Real-Time RF Spectral Density & LoRa Chirp Demodulation (bladeRF xA4 RX Pipeline)
            </p>
          </div>
        </div>

        {/* Controls & Colormap Selector */}
        <div className="flex items-center gap-2">
          {/* Colormap Selector */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-slate-500 pl-2 pr-1 text-[11px]">Colormap:</span>
            {['viridis', 'plasma', 'turbo', 'cyber'].map((cmap) => (
              <button
                key={cmap}
                onClick={() => setColormap(cmap)}
                className={`px-2.5 py-1 rounded-lg capitalize transition ${
                  colormap === cmap
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cmap}
              </button>
            ))}
          </div>

          {/* Pause / Resume Button */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-cyan-300 transition"
            title={isRunning ? "Pause Waterfall Stream" : "Resume Waterfall Stream"}
          >
            {isRunning ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Telemetry Indicator Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-3 font-mono text-xs">
        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-500">CENTER FREQ</span>
          <span className="text-cyan-300 font-bold">{frequency}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-500">BANDWIDTH</span>
          <span className="text-slate-200 font-bold">{bandwidth}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-500">MODULATION</span>
          <span className="text-slate-200 font-bold">{sf} / CR {cr}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-500">RSSI POWER</span>
          <span className={`font-bold ${liveRssi > -80 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {liveRssi} dBm
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-500">SNR RATIO</span>
          <span className="text-emerald-300 font-bold">+{liveSnr} dB</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-500">LORA SYNC</span>
          <span className="text-cyan-400 font-bold">0x12 (Ra-02)</span>
        </div>
      </div>

      {/* Main Waterfall Model Visualizer Canvas Area */}
      <div className="rounded-xl border border-cyan-500/30 overflow-hidden bg-[#020612] relative shadow-inner">
        {/* Top: FFT Power Spectrum (PSD) */}
        <div className="relative w-full h-24 sm:h-28 border-b border-cyan-500/20 bg-[#020917]">
          <canvas
            ref={fftCanvasRef}
            width={768}
            height={112}
            className="w-full h-full block"
          />
          {/* dBm scale Y-axis labels */}
          <div className="absolute left-2 top-1 bottom-1 flex flex-col justify-between text-[9px] font-mono text-cyan-400/60 pointer-events-none">
            <span>-40 dBm</span>
            <span>-80 dBm</span>
            <span>-120 dBm</span>
          </div>
          <div className="absolute top-1 right-2 text-[9px] font-mono text-emerald-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
            FFT PSD (Power Spectral Density)
          </div>
        </div>

        {/* Bottom: Scrolling Matplotlib Waterfall Display */}
        <div className="relative w-full h-40 sm:h-48 bg-[#01040a]">
          <canvas
            ref={waterfallCanvasRef}
            width={768}
            height={180}
            className="w-full h-full block"
          />
          {/* Time scale Y-axis label */}
          <div className="absolute left-2 top-1 bottom-1 flex flex-col justify-between text-[9px] font-mono text-slate-500 pointer-events-none">
            <span>t = 0s</span>
            <span>t = -5s</span>
            <span>t = -10s</span>
          </div>
          {/* Live indicator badge */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950/85 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>WATERFALL MODEL (LIVE SDR)</span>
          </div>
        </div>

        {/* Frequency scale X-axis footer */}
        <div className="px-4 py-1.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>433.850 MHz</span>
          <span className="text-cyan-400 font-bold">f₀ = 434.000 MHz (Center)</span>
          <span>434.150 MHz</span>
        </div>
      </div>
    </div>
  );
}

