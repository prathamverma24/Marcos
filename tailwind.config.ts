import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './data/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0d4f8b',
        secondary: '#00b7d3',
        surface: '#f8fbff',
        accent: '#6dd5ed',
        'accent-dark': '#0d77a6',
        navy: '#081e3d',
        glass: 'rgba(255, 255, 255, 0.72)',
      },
      boxShadow: {
        soft: '0 30px 90px rgba(13, 79, 139, 0.12)',
        glow: '0 0 40px rgba(0, 183, 211, 0.18)',
      },
      backgroundImage: {
        'water-fade': 'radial-gradient(circle at top, rgba(0,183,211,0.18), transparent 28%), radial-gradient(circle at bottom, rgba(13,79,139,0.15), transparent 24%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
