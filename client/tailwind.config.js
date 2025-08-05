/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    fontFamily: {
      main: ['Poppins', 'sans-serif'],
    },
    extend: {
      width: {
        main: '1220px',
      },
      backgroundColor: {
        main: '#DC1C31',
      },
      colors: {
        main: '#DC1C31',
      }
    },
  },
  plugins: [],
}