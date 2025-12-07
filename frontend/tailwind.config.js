/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './services/**/*.{ts,tsx}',
    './store/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brandBlue: '#1D6EEA',
        brandBlueDark: '#0D3B72',
        brandOrange: '#F47B20',
        brandNavy: '#0C1F3F',
        brandGray: '#6F7D94',
        surface: '#F4F7FC',
        white: '#FFFFFF',
      },
      boxShadow: {
        card: '0 24px 60px rgba(13, 59, 114, 0.12)',
        soft: '0 16px 40px rgba(21, 75, 146, 0.1)',
      },
      borderRadius: {
        glass: '32px',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        'display': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h2': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'h3': ['1.875rem', { lineHeight: '1.4' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
};

