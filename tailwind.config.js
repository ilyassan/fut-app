/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "secondary": "#393218",
        "gray": "#dddeee"
      },
      screens: {
        xs: '500px',
      },
    },
  },
  plugins: [],
}