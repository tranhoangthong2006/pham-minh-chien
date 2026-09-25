/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FAF7F2',
        card: '#FFFFFF',
        'card-border': '#F1E9DE',
        gold: {
          DEFAULT: '#D97706',
          light: '#FEF3C7',
          warm: '#F59E0B',
          dark: '#B45309',
        },
        rose: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E',
          600: '#E11D48',
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337',
        }
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
      }
    },
  },
  plugins: [],
}
