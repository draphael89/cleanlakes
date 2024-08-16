import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          light: 'var(--color-secondary-light)',
          dark: 'var(--color-secondary-dark)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          light: 'var(--color-accent-light)',
          dark: 'var(--color-accent-dark)',
        },
        background: {
          light: 'var(--color-background-light)',
          dark: 'var(--color-background-dark)',
        },
        text: {
          DEFAULT: 'var(--color-text)',
          light: 'var(--color-text-light)',
          dark: 'var(--color-text-dark)',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(to bottom, var(--color-primary), var(--color-secondary))",
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      ringColor: {
        'primary': 'var(--color-primary)',
        'secondary': 'var(--color-secondary)',
        'accent': 'var(--color-accent)',
      },
      ringOpacity: {
        'DEFAULT': '0.5',
      },
      boxShadow: {
        'custom': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};

export default config;