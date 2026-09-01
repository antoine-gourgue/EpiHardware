import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

/**
 * Shared Tailwind preset — the single source of truth for the EpiHardware
 * design language. Consumed by both `apps/web` and `packages/ui`.
 *
 * Brand DNA: a deep indigo scale (`brand`) over slate neutrals, generous
 * rounding, an indigo-tinted soft shadow, and class-based dark mode.
 */
const preset: Omit<Config, 'content'> = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef1ff',
          100: '#e0e5ff',
          200: '#c7ceff',
          300: '#a5adfc',
          400: '#828bf8',
          500: '#6366f1',
          600: '#4f4ee6',
          700: '#4341c0',
          800: '#37368f',
          900: '#302f72',
          950: '#1d1c44'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-display)', 'var(--font-sans)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono]
      },
      boxShadow: {
        soft: '0 10px 30px -14px rgba(67, 65, 192, 0.28)',
        'soft-lg': '0 24px 60px -20px rgba(67, 65, 192, 0.35)',
        glow: '0 0 0 1px rgba(99, 102, 241, 0.12), 0 8px 30px -12px rgba(99, 102, 241, 0.45)'
      },
      screens: {
        xs: '375px',
        '3xl': '1920px'
      },
      borderRadius: {
        '4xl': '2rem'
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' }
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.5s ease both',
        marquee: 'marquee 32s linear infinite'
      }
    }
  },
  plugins: []
}

export default preset
