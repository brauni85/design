/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        vfb: {
          red: '#E32219',
          accent: '#CC0000',
          dark: '#1A1A1A',
          gray: '#F5F5F5',
          border: '#E0E0E0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
