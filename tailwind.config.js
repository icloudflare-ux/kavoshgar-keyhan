/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./index.tsx"
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        sans: ['Vazirmatn', 'sans-serif'],
        lalezar: ['Lalezar', 'cursive'],
        tanha: ['Tanha', 'sans-serif'],
        'roboto-mono': ['Roboto Mono', 'monospace'],
      },
      colors: {
        'gold': '#D4AF37',
        'galactic-purple': '#8B5CF6',
      },
      backdropBlur: {
        'md': '12px',
      },
      boxShadow: {
        'cosmic': '0 10px 15px -3px var(--color-shadow, rgba(0,0,0,0.1)), 0 4px 6px -4px var(--color-shadow, rgba(0,0,0,0.1))',
        'cosmic-hover': '0 20px 25px -5px var(--color-shadow-hover, rgba(0,0,0,0.1)), 0 8px 10px -6px var(--color-shadow-hover, rgba(0,0,0,0.1))',
      },
      keyframes: {
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        'spin-slow': 'spin 240s linear infinite',
      },
    },
  },
  plugins: [],
}
