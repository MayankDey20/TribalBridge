/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bce5bc',
          300: '#8fd18f',
          400: '#5fb55f',
          500: '#4a7c3a',
          600: '#3a632e',
          700: '#2d5016',
          800: '#284013',
          900: '#213510',
        },
        earth: {
          50: '#faf8f0',
          100: '#f5f0e5',
          200: '#eee0c7',
          300: '#e0c8a0',
          400: '#d2b48c',
          500: '#c19a6b',
          600: '#a67c52',
          700: '#8b6f47',
          800: '#6f5a3c',
          900: '#8b4513',
        },
        nature: {
          50: '#f8f6f0',
          100: '#f1ede0',
          200: '#e3d7c1',
          300: '#d0bfa0',
          400: '#bfa87f',
          500: '#a68f5e',
          600: '#8b7548',
          700: '#6d5b37',
          800: '#5c4d2e',
          900: '#4a3f26',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'leaf-float': 'leafFloat 6s ease-in-out infinite',
        'gentle-bounce': 'gentleBounce 2s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
      },
      keyframes: {
        leafFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        gentleBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};