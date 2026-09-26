/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: 'var(--bg-main)',
          card: 'var(--bg-card)',
          cardHover: 'var(--bg-card-hover)',
          border: 'var(--border-color)',
          text: 'var(--text-main)',
          muted: 'var(--text-muted)',
          blue: '#1E6091',
          accentBlue: '#00B4D8',
          neonCyan: '#00F0FF',
          neonGreen: '#00FF66',
          neonOrange: '#FF8800',
          neonRed: '#FF2A4D',
          neonYellow: '#F39C12',
          purple: '#8B5CF6'
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.35)',
        'glow-green': '0 0 20px rgba(0, 255, 102, 0.35)',
        'glow-red': '0 0 25px rgba(255, 42, 77, 0.45)',
        'glow-blue': '0 0 20px rgba(30, 96, 145, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'orbit': 'orbit 20s linear infinite',
        'scanline': 'scanline 8s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
      }
    },
  },
  plugins: [],
}
