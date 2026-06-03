/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        black: '#111111',
        white: '#ffffff',
        gray: {
          100: '#f9f9f9',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#cccccc',
          500: '#aaaaaa',
          600: '#888888',
          700: '#555555',
          800: '#333333',
          900: '#222222'
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        'full': '9999px',
      },
      boxShadow: {
        'solid': '4px 4px 0px 0px rgba(17, 17, 17, 1)',
      }
    },
  },
  plugins: [],
}
