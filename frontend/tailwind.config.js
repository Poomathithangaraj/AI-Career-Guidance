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
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#badffd',
          300: '#7cc3fc',
          400: '#38a4f9',
          500: '#0e87e3',
          600: '#026bc3',
          700: '#03559e',
          800: '#074982',
          900: '#0c3e6d',
          950: '#082747',
        },
        slate: {
          950: '#0b0f19'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
