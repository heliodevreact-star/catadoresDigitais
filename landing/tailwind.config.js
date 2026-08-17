/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#83B80D',
          'green-light': '#CFF183',
          'green-dark': '#6B9A0B',
          blue: '#114BF2',
          'blue-light': '#84A4FF',
          'blue-dark': '#0D3BC2',
          violet: '#4D1BBB',
          'violet-light': '#A382ED',
        },
        dark: {
          950: '#06030F',
          900: '#0F0A1E',
          800: '#1A1230',
          700: '#251A42',
          600: '#312160',
        },
      },
      fontFamily: {
        syne: ['"Barlow Condensed"', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out 1s infinite',
        'float-slower': 'float 10s ease-in-out 2s infinite',
        'spin-slow': 'spin 25s linear infinite',
        'marquee': 'marquee 28s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
