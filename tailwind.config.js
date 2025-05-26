/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'weather-transition': 'weather-transition 2s ease-in-out',
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '12px',
        'glass-heavy': '20px',
      },
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          medium: 'rgba(255, 255, 255, 0.2)',
          heavy: 'rgba(255, 255, 255, 0.3)',
          dark: 'rgba(0, 0, 0, 0.1)',
          'dark-medium': 'rgba(0, 0, 0, 0.2)',
          'dark-heavy': 'rgba(0, 0, 0, 0.3)',
        },
        weather: {
          sunny: {
            from: '#FFA726',
            via: '#FFD54F',
            to: '#81C784',
          },
          rainy: {
            from: '#42A5F5',
            via: '#66BB6A',
            to: '#78909C',
          },
          cloudy: {
            from: '#90A4AE',
            via: '#B0BEC5',
            to: '#CFD8DC',
          },
          snowy: {
            from: '#E3F2FD',
            via: '#BBDEFB',
            to: '#90CAF9',
          },
          stormy: {
            from: '#5C6BC0',
            via: '#7986CB',
            to: '#3F51B5',
          },
          foggy: {
            from: '#ECEFF1',
            via: '#CFD8DC',
            to: '#B0BEC5',
          },
        },
      },
      spacing: {
        'glass': '1.5rem',
        'glass-sm': '1rem',
        'glass-lg': '2rem',
        'glass-xl': '3rem',
      },
      borderRadius: {
        'glass': '1rem',
        'glass-lg': '1.5rem',
        'glass-xl': '2rem',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-lg': '0 15px 35px 0 rgba(31, 38, 135, 0.4)',
        'glass-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
      },
      keyframes: {
        'weather-transition': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 