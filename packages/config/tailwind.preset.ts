import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

/**
 * Shared Tailwind preset — the single source of truth for the EpiHardware
 * design language. Consumed by both `apps/web` and `packages/ui`.
 *
 * Marketplace DNA: a warm amazon-like orange accent (`brand`) over slate
 * neutrals, a dark `navy` top bar, a yellow `cart` call-to-action, tight
 * rounding, neutral soft shadows, and class-based dark mode.
 */
const preset: Omit<Config, 'content'> = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff8ec',
          100: '#feecc8',
          200: '#fdd88d',
          300: '#fbbd52',
          400: '#ffa724',
          500: '#ff9900',
          600: '#e8850a',
          700: '#b45f09',
          800: '#8f4a0f',
          900: '#743d10',
          950: '#431e05'
        },
        navy: {
          700: '#232f3e',
          800: '#1b2531',
          900: '#131921',
          950: '#0d1117'
        },
        cart: {
          DEFAULT: '#ffd814',
          hover: '#f7ca00',
          buy: '#ffa41c',
          'buy-hover': '#fa8900'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-display)', 'var(--font-sans)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono]
      },
      boxShadow: {
        soft: '0 8px 24px -12px rgba(15, 23, 42, 0.18)',
        'soft-lg': '0 20px 45px -18px rgba(15, 23, 42, 0.25)',
        glow: '0 0 0 1px rgba(255, 153, 0, 0.14), 0 8px 26px -12px rgba(255, 153, 0, 0.4)'
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
