/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a',
        secondary: '#0a0a0a',
        accent: '#ffeb3b',
        'text-color': '#ffffff',
        hover: '#ffc107',
        'input-bg': '#2d2d2d',
        'inactive-text': '#b0b0b0',
      },
    },
  },
  plugins: [],
}





