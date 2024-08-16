const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
           50: '#e6f3ff',
           100: '#cce7ff',
           200: '#99cfff',
           300: '#66b7ff',
           400: '#339fff',
           500: '#0077be',
           600: '#005c8f',
           700: '#004166',
           800: '#002633',
           900: '#001319',
        },
        secondary: {
           50: '#e6f9ff',
           100: '#ccf3ff',
           200: '#99e7ff',
           300: '#66dbff',
           400: '#33cfff',
           500: '#00a8e8',
           600: '#0082b3',
           700: '#005c80',
           800: '#00364d',
           900: '#001b26',
        },
        accent: {
           50: '#f0fbff',
           100: '#e1f7ff',
           200: '#c3eeff',
           300: '#a5e5ff',
           400: '#87dcff',
           500: '#90e0ef',
           600: '#5fb8d9',
           700: '#3a90b3',
           800: '#1d6880',
           900: '#0e3440',
        },
        background: {
           light: '#f0f8ff',
           dark: '#0a192f',
        },
        text: {
           light: '#333333',
           dark: '#e6f1ff',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in-down': 'fadeInDown 0.5s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
           '0%': { opacity: '0' },
           '100%': { opacity: '1' },
        },
        fadeInUp: {
           '0%': { opacity: '0', transform: 'translateY(10px)' },
           '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
           '0%': { opacity: '0', transform: 'translateY(-10px)' },
           '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}