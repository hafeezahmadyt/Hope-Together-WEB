/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "hope-blue": {
          DEFAULT: "#1D70B8",
          light: "#0284C7",
          dark: "#175C96",
          50: "#e9f1ff",
          100: "#d2e4ff",
          500: "#1D70B8",
          600: "#175C96",
          700: "#00497e",
        },
        "hope-green": {
          DEFAULT: "#16A34A",
          light: "#22c55e",
          dark: "#15803D",
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#16A34A",
          600: "#15803D",
          700: "#005320",
        },
        "surface-warm": "#FAF9F6",
        "surface-subtle": "#F8FAFC",
        "surface-elevation": "#F4F4F0",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      keyframes: {
        'gentle-pulse': {
          '0%, 100%': { transform: 'scale(1) translate(0px, 0px)', opacity: '0.45' },
          '50%': { transform: 'scale(1.15) translate(12px, -8px)', opacity: '0.7' },
        },
        'subtle-drift': {
          '0%, 100%': { transform: 'scale(1) translate(0px, 0px)', opacity: '0.35' },
          '50%': { transform: 'scale(1.08) translate(-15px, 10px)', opacity: '0.55' },
        },
        'ambient-glow': {
          '0%, 100%': { transform: 'scale(0.95)', opacity: '0.25' },
          '50%': { transform: 'scale(1.1)', opacity: '0.45' },
        },
      },
      animation: {
        'gentle-pulse': 'gentle-pulse 9s ease-in-out infinite',
        'subtle-drift': 'subtle-drift 12s ease-in-out infinite',
        'ambient-glow': 'ambient-glow 8s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
};
