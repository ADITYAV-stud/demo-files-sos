import React, { useEffect, useRef } from 'react';

export default function Globe3D({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Handle high DPI
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate random twinkling stars in background
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * 900,
      y: Math.random() * 900,
      radius: Math.random() * 1.6 + 0.3,
      alpha: Math.random() * 0.85 + 0.15,
      twinkleSpeed: Math.random() * 0.025 + 0.008,
    }));

    // Dense glowing continent coordinates (latitude, longitude in degrees)
    const landPoints = [];
    const addLandCluster = (centerLat, centerLon, count, spreadLat, spreadLon) => {
      for (let i = 0; i < count; i++) {
        const lat = centerLat + (Math.random() - 0.5) * spreadLat;
        const lon = centerLon + (Math.random() - 0.5) * spreadLon;
        landPoints.push({ lat: lat * (Math.PI / 180), lon: lon * (Math.PI / 180) });
      }
    };

    // Global Continents & Island Clusters
    addLandCluster(48, -100, 220, 35, 60);  // North America
    addLandCluster(32, -95, 120, 20, 30);   // USA South & Gulf
    addLandCluster(-15, -60, 200, 45, 35);  // South America
    addLandCluster(52, 15, 230, 25, 45);   // Europe
    addLandCluster(5, 20, 240, 48, 40);    // Africa
    addLandCluster(55, 90, 320, 35, 80);   // Russia / North Asia
    addLandCluster(34, 105, 240, 28, 45);  // East Asia / China
    addLandCluster(20, 78, 160, 22, 22);   // Indian Subcontinent (Southern Asia)
    addLandCluster(12, 105, 110, 18, 25);  // SE Asia
    addLandCluster(-25, 135, 160, 28, 38); // Australia
    addLandCluster(-41, 174, 50, 12, 10);  // New Zealand
    addLandCluster(65, -40, 90, 18, 30);   // Greenland
    addLandCluster(36, 138, 70, 12, 12);   // Japan

    // Globe rotation state with multi-axis random motion
    let rotationY = 0.5;
    let rotationX = 0.22;
    let rotationZ = 0.05;
    let satAngle = 0;
    let time = 0;

    const render = () => {
      time += 0.016;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      if (!width || !height) return;

      const cx = width * 0.5;
      const cy = height * 0.48;
      const radius = Math.min(width, height) * 0.36;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Starfield with twinkle
      stars.forEach((star) => {
        const starX = (star.x + time * 1.5) % width;
        const starY = (star.y + Math.sin(time * 0.2 + star.x) * 1) % height;
        const twinkle = Math.sin(time * star.twinkleSpeed * 50) * 0.35 + 0.65;
        ctx.beginPath();
        ctx.arc(starX, starY, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 230, 255, ${star.alpha * twinkle})`;
        ctx.fill();
      });

      // 2. Outer Atmospheric Glow (Deep Cyan / Blue)
      const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius * 1.4);
      glowGrad.addColorStop(0, 'rgba(0, 220, 255, 0.28)');
      glowGrad.addColorStop(0.45, 'rgba(0, 120, 255, 0.14)');
      glowGrad.addColorStop(0.8, 'rgba(2, 20, 60, 0.05)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // 3. Deep Ocean Blue Sphere (Sea)
      const oceanGrad = ctx.createRadialGradient(
        cx - radius * 0.32,
        cy - radius * 0.32,
        radius * 0.08,
        cx,
        cy,
        radius
      );
      oceanGrad.addColorStop(0, '#0c4a80');   // Sunlit upper ocean layer
      oceanGrad.addColorStop(0.35, '#052a56'); // Deep ocean blue
      oceanGrad.addColorStop(0.7, '#021633');  // Abyssal deep navy
      oceanGrad.addColorStop(0.95, '#010a1a'); // Dark terminator edge
      oceanGrad.addColorStop(1, '#00050d');    // Edge limb

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = oceanGrad;
      ctx.fill();

      // Globe sphere edge ring
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
      ctx.stroke();

      // 4. Random / Natural Dynamic Motion
      // Continuous rotation on Y-axis plus sinusoidal multi-axis precession
      rotationY += 0.005 + Math.sin(time * 0.3) * 0.0008;
      rotationX = 0.22 + Math.sin(time * 0.25) * 0.06 + Math.cos(time * 0.18) * 0.03;
      rotationZ = Math.sin(time * 0.2) * 0.04;

      // 5. Draw Glowing Fluorescent Neon Green Continents
      landPoints.forEach((pt) => {
        // Spherical to 3D Cartesian
        const cosLat = Math.cos(pt.lat);
        const sinLat = Math.sin(pt.lat);
        const cosLon = Math.cos(pt.lon + rotationY);
        const sinLon = Math.sin(pt.lon + rotationY);

        let x = radius * cosLat * sinLon;
        let y = -radius * sinLat;
        let z = radius * cosLat * cosLon;

        // Apply X-axis rotation (tilt)
        const cosX = Math.cos(rotationX);
        const sinX = Math.sin(rotationX);
        let y1 = y * cosX - z * sinX;
        let z1 = y * sinX + z * cosX;

        // Apply Z-axis rotation (wobble)
        const cosZ = Math.cos(rotationZ);
        const sinZ = Math.sin(rotationZ);
        let x2 = x * cosZ - y1 * sinZ;
        let y2 = x * sinZ + y1 * cosZ;
        let z2 = z1;

        // Draw points on the visible front hemisphere
        if (z2 > 0) {
          const depthAlpha = Math.max(0.12, z2 / radius);
          const px = cx + x2;
          const py = cy + y2;

          // Glowing neon fluorescent green land node
          ctx.beginPath();
          ctx.arc(px, py, 1.8 * (0.8 + depthAlpha * 0.5), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 255, 102, ${depthAlpha * 0.9})`;
          ctx.shadowColor = '#00FF66';
          ctx.shadowBlur = 7 * depthAlpha;
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      });

      // 6. Draw Orbit Path (Dashed Ellipse Ring)
      ctx.save();
      ctx.beginPath();
      const orbitRx = radius * 1.5;
      const orbitRy = radius * 0.6;
      const orbitTilt = -0.32;
      ctx.ellipse(cx, cy, orbitRx, orbitRy, orbitTilt, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.setLineDash([4, 6]);
      ctx.lineWidth = 1.3;
      ctx.stroke();
      ctx.restore();

      // 7. Small Satellite continuously orbiting clockwise
      satAngle += 0.018; // Clockwise orbital motion
      const rawSatX = Math.cos(satAngle) * orbitRx;
      const rawSatY = Math.sin(satAngle) * orbitRy;

      // Apply orbital inclination tilt
      const satX = cx + rawSatX * Math.cos(orbitTilt) - rawSatY * Math.sin(orbitTilt);
      const satY = cy + rawSatX * Math.sin(orbitTilt) + rawSatY * Math.cos(orbitTilt);

      // Draw Satellite
      ctx.save();
      ctx.translate(satX, satY);

      // Radiating RF signal waves down towards the globe
      const waveRadius = (time * 30) % 36;
      ctx.beginPath();
      ctx.arc(0, 0, waveRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 255, 170, ${Math.max(0, 1 - waveRadius / 36) * 0.7})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Satellite Solar Panels (Cyan Neon)
      ctx.fillStyle = '#00F0FF';
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 6;
      ctx.fillRect(-10, -2.5, 6, 5);
      ctx.fillRect(4, -2.5, 6, 5);

      // Central Satellite Chassis
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Emergency Beacon Status LED (Flashing Red/Green)
      ctx.fillStyle = (Math.sin(time * 12) > 0) ? '#00FF66' : '#FF2A4D';
      ctx.beginPath();
      ctx.arc(0, -4, 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className={`relative flex flex-col items-center justify-center overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-[400px] lg:h-[480px] select-none"
      />
      {/* Footer Tagline */}
      <div className="mt-3 text-center select-none">
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#03152d]/80 border border-cyan-500/40 backdrop-blur-md shadow-glow-cyan">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#00FF66]" />
          <span className="tracking-[0.28em] font-display text-xs md:text-sm font-bold text-cyan-200 uppercase">
            SAVE LIVES. TOGETHER.
          </span>
        </div>
      </div>
    </div>
  );
}
