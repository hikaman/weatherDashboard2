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
        'glass-lg': '16px',
      },
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.2)',
          'light-border': 'rgba(255, 255, 255, 0.3)',
          dark: 'rgba(15, 23, 42, 0.3)',
          'dark-border': 'rgba(71, 85, 105, 0.3)',
        },
        weather: {
          sunny: {
            from: '#FEF3C7',
            via: '#FCD34D',
            to: '#F59E0B',
          },
          rainy: {
            from: '#DBEAFE',
            via: '#60A5FA',
            to: '#2563EB',
          },
          cloudy: {
            from: '#F1F5F9',
            via: '#CBD5E1',
            to: '#64748B',
          },
          snowy: {
            from: '#F8FAFC',
            via: '#E2E8F0',
            to: '#94A3B8',
          },
          stormy: {
            from: '#1E293B',
            via: '#475569',
            to: '#334155',
          },
          foggy: {
            from: '#F8FAFC',
            via: '#F1F5F9',
            to: '#E2E8F0',
          },
        },
      },
      spacing: {
        'glass': '1rem',
        'glass-lg': '1.5rem',
        'glass-xl': '2rem',
      },
      borderRadius: {
        'glass': '12px',
        'glass-lg': '16px',
        'glass-xl': '20px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-lg': '0 12px 40px 0 rgba(31, 38, 135, 0.4)',
        'glass-xl': '0 16px 48px 0 rgba(31, 38, 135, 0.45)',
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