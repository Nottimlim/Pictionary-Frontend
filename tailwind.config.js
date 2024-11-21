/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'vanilla': {
          DEFAULT: '#f1e8b8',
          100: '#473e0e',
          200: '#8d7c1c',
          300: '#d4bb2a',
          400: '#e3d270',
          500: '#f1e8b8',
          600: '#f4edc5',
          700: '#f6f1d4',
          800: '#f9f6e2',
          900: '#fcfaf1'
        },
        'flax': {
          DEFAULT: '#f9e784',
          100: '#493f03',
          200: '#927d07',
          300: '#dbbc0a',
          400: '#f6da3c',
          500: '#f9e784',
          600: '#faec9e',
          700: '#fcf1b6',
          800: '#fdf6ce',
          900: '#fefae7'
        },
        'atomic-tangerine': {
          DEFAULT: '#e58f65',
          100: '#39190a',
          200: '#713313',
          300: '#aa4c1d',
          400: '#dc682e',
          500: '#e58f65',
          600: '#eaa785',
          700: '#efbda3',
          800: '#f5d3c2',
          900: '#fae9e0'
        },
        'indian-red': {
          DEFAULT: '#d05353',
          100: '#2e0d0d',
          200: '#5b1919',
          300: '#892626',
          400: '#b73232',
          500: '#d05353',
          600: '#d97575',
          700: '#e39898',
          800: '#ecbaba',
          900: '#f6dddd'
        },
        'eerie-black': {
          DEFAULT: '#191919',
          100: '#050505',
          200: '#0a0a0a',
          300: '#0f0f0f',
          400: '#141414',
          500: '#191919',
          600: '#474747',
          700: '#757575',
          800: '#a3a3a3',
          900: '#d1d1d1'
        },
        width: {
          'toolbar': '30px',
        },
        minWidth: {
          'toolbar': '2rem',
        },
        maxWidth: {
          'toolbar': '2rem',
        },
      }
    }
  },
  plugins: [
    require('daisyui'),
  ],
}