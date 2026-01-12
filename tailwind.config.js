/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cute-pink': '#FFB7B2',
        'cute-green': '#B5EAD7',
        'cute-yellow': '#FFDAC1',
        'cute-purple': '#E2F0CB', 
        'cute-blue': '#C7CEEA',
        'cute-text': '#6D5C6A',
        'cute-bg': '#FFF5F7',
        'cute-card': '#FFFFFF',
        'wood-floor': '#FFE8D6',
        primary: '#FF9AA2', 
        secondary: '#95D9C3', 
      },
      fontFamily: {
        'nunito': ['Nunito', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'bubble-rise': 'bubbleRise 2s ease-in infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'dust': 'dust 1s ease-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        bubbleRise: {
          '0%': { transform: 'translateY(0) scale(0.5)', opacity: '0' },
          '50%': { opacity: '0.8' },
          '100%': { transform: 'translateY(-40px) scale(1.2)', opacity: '0' },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1) rotate(45deg)', opacity: '1' },
        },
        dust: {
          '0%': { transform: 'translate(0, 0) scale(1)', opacity: '0.8' },
          '100%': { transform: 'translate(10px, -10px) scale(0)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
