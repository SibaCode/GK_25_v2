/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        fontFamily: {
          poppins: ['Poppins', 'sans-serif'],
        },
        colors: {
          primary: '#019bff',
          sidebar: '#019bff',
          accent: '#8be000', 
        },
      },
    },
    plugins: [],
  }
  