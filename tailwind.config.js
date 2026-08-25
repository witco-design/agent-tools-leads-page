/**
 * Real Geeks Design System — Tailwind Configuration
 *
 * Token scales are derived from the Real Geeks Figma export.
 * Source of truth: [ Base Colors ].Value.tokens.json, [ Spacing & Sizing ].Mode 1.tokens.json,
 * [ Border Radius ].Mode 1.tokens.json, text.styles.tokens.json, effect.styles.tokens.json
 *
 * Engineers: prefer semantic tokens (text-default, border-default, bg-card, etc.) wherever
 * they exist. Use raw scale tokens (blue-110, gray-50) only when no semantic alias applies.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
        sans: ['Lato', 'system-ui', 'sans-serif'],
      },

      colors: {
        /* ─────────────────────────────────────────────────────────────
         * BASE COLOR SCALES  (Figma: [ Base Colors ].Value.tokens.json)
         * ───────────────────────────────────────────────────────────── */
        blue: {
          10:  '#f5fcff',
          20:  '#ebf8ff',
          30:  '#e4f2ff',
          40:  '#bfddff',
          50:  '#96c9ff',
          60:  '#6eb3ff',
          70:  '#55a2ff',
          80:  '#4592ff',
          90:  '#4484f0',
          100: '#4172dc',
          110: '#3e60c9',
          120: '#3840a9',
        },
        gray: {
          10:  '#fcfcfd',
          20:  '#f9f9fb',
          30:  '#f6f7f9',
          40:  '#f2f4f7',
          50:  '#e4e7ec',
          60:  '#d0d5dd',
          70:  '#98a2b3',
          80:  '#667085',
          90:  '#475467',
          100: '#344054',
          110: '#1d2939',
          120: '#101828',
        },
        green: {
          10:  '#f8fcfb',
          20:  '#f1f9f7',
          30:  '#e0f1ec',
          40:  '#b3dbce',
          50:  '#84c5af',
          60:  '#58ae91',
          70:  '#45ac86',
          80:  '#32aa7b',
          90:  '#2a8d66',
          100: '#216f51',
          110: '#1a5f44',
          120: '#11442c',
        },
        red: {
          10:  '#fffafb',
          20:  '#fff0f2',
          30:  '#ffe0e4',
          40:  '#ffbec4',
          50:  '#f98d8c',
          60:  '#e36362',
          70:  '#ec423d',
          80:  '#ed2e20',
          90:  '#de2121',
          100: '#cc0a1b',
          110: '#c00114',
          120: '#b10005',
        },
        orange: {
          10:  '#fef5dd',
          20:  '#fbe4ab',
          30:  '#f8d374',
          40:  '#f7c166',
          50:  '#f6af58',
          60:  '#f59c4a',
          70:  '#f48a3c',
          80:  '#f3782e',
          90:  '#e7722c',
          100: '#db6c29',
          110: '#c26025',
          120: '#aa5420',
        },
        purple: {
          10:  '#f6f6ff',
          20:  '#ebeaff',
          30:  '#dedcff',
          40:  '#c3c0f1',
          50:  '#aba6e6',
          60:  '#8883c9',
          70:  '#746ec0',
          80:  '#6059b7',
          90:  '#4c45ae',
          100: '#3830a5',
          110: '#322b95',
          120: '#2d2684',
        },
        ink: {
          white: '#FFFFFF',
          black: '#000000',
        },

        /* ─────────────────────────────────────────────────────────────
         * SEMANTIC TOKENS  — intent-first aliases over the base scales
         * Engineers should prefer these wherever they exist.
         * ───────────────────────────────────────────────────────────── */

        // Surfaces
        'bg-app':    '#fcfcfd',  // outer shell background (gray.10)
        'bg-card':   '#FFFFFF',  // card / panel surfaces
        'bg-canvas': '#FFFFFF',  // alias — same as bg-card (design system term)
        'bg-muted':  '#fcfcfd',  // gray.10 — subtle row bg / hover

        // Text
        'text-default':    '#101828', // gray.120 — primary text on cards
        'text-secondary':  '#475467', // gray.90  — supporting / meta text
        'text-muted':      '#667085', // gray.80  — hint / disabled / icon labels
        'text-link':       '#4172dc', // blue.100 — links and brand actions
        'text-link-hover': '#3e60c9', // blue.110 — hover / pressed link

        // Borders
        'border-default': '#e4e7ec', // gray.50 — 1px hairlines, card borders
        'border-strong':  '#d0d5dd', // gray.60 — heavier emphasis
        'border-focus':   '#4172dc', // blue.100 — focused inputs

        // Brand
        'brand-primary':       '#4172dc', // blue.100
        'brand-primary-hover': '#3e60c9', // blue.110

        // Focus
        'focus-ring':   '#3840a9', // blue.120 — 2px focus outline (distinct from button rest)

        // Icon
        'icon-default': '#1d2939', // gray.110

        // Status — success
        'success-bg':     '#f8fcfb', // green.10
        'success-border': '#b3dbce', // green.40
        'success-text':   '#45ac86', // green.70

        // Status — warning
        'warning-bg':     '#fef5dd', // orange.10
        'warning-border': '#fbe4ab', // orange.20
        'warning-text':   '#f48a3c', // orange.70

        // Status — error
        'error-bg':     '#fffafb', // red.10
        'error-border': '#ffbec4', // red.40
        'error-text':   '#ec423d', // red.70

        // Status — info
        'info-bg':   '#f5fcff', // blue.10
        'info-text': '#4172dc', // blue.100

        // Tag / chip
        'tag-bg':   '#dedcff', // purple.30
        'tag-text': '#322b95', // purple.110

        // Disabled states
        'disabled-content': '#98a2b3', // gray.70
        'disabled-bg':      '#f2f4f7', // gray.40

        // Focus
        'focus-ring':         '#3840a9', // blue.120 — 2px focus outline
        'focus-ring-default': '#101828', // gray.120 — non-primary focus

        // Backgrounds
        'bg-default':      '#ffffff',
        'bg-default-dark': '#0d0d0d',

        /* ─────────────────────────────────────────────────────────────
         * shadcn/ui CSS-variable tokens — do not modify
         * ───────────────────────────────────────────────────────────── */
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      },

      /* ─── Spacing tokens (Figma: [ Spacing & Sizing ].Mode 1.tokens.json) ─── */
      spacing: {
        'spacing-0':  '0px',
        'spacing-05': '2px',
        'spacing-1':  '4px',
        'spacing-2':  '8px',
        'spacing-3':  '12px',
        'spacing-4':  '16px',
        'spacing-5':  '20px',
        'spacing-6':  '24px',
        'spacing-7':  '28px',
        'spacing-8':  '32px',
        'spacing-9':  '36px',
        'spacing-10': '40px',
        'spacing-11': '48px',
      },

      /* ─── Sizing tokens ─── */
      width: {
        'sizing-0':  '0px',
        'sizing-1':  '4px',
        'sizing-2':  '8px',
        'sizing-3':  '12px',
        'sizing-4':  '16px',
        'sizing-5':  '20px',
        'sizing-6':  '24px',
        'sizing-7':  '28px',
        'sizing-8':  '32px',
        'sizing-9':  '36px',
        'sizing-10': '40px',
        'sizing-11': '44px',
        'sizing-12': '48px',
        'sizing-13': '52px',
        'sizing-14': '56px',
        'sizing-15': '60px',
      },
      height: {
        'sizing-0':  '0px',
        'sizing-1':  '4px',
        'sizing-2':  '8px',
        'sizing-3':  '12px',
        'sizing-4':  '16px',
        'sizing-5':  '20px',
        'sizing-6':  '24px',
        'sizing-7':  '28px',
        'sizing-8':  '32px',
        'sizing-9':  '36px',
        'sizing-10': '40px',
        'sizing-11': '44px',
        'sizing-12': '48px',
        'sizing-13': '52px',
        'sizing-14': '56px',
        'sizing-15': '60px',
      },

      /* ─── Border Radius tokens (Figma: [ Border Radius ].Mode 1.tokens.json) ─── */
      borderRadius: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        'round': '999px',
        // shadcn/ui CSS-var aliases — required by shadcn components
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      /* ─── Shadow tokens (Figma: effect.styles.tokens.json) ─── */
      boxShadow: {
        'sm': '0 1px 1px -0.5px rgba(0,0,0,0.07), 0 2px 2px -1px rgba(0,0,0,0.07), 0 3px 3px -1.5px rgba(0,0,0,0.07)',
        'md': '0 2px 2px -1px rgba(0,0,0,0.07), 0 2px 2px -1px rgba(0,0,0,0.07), 0 6px 6px -3px rgba(0,0,0,0.07)',
        'lg': '0 8px 8px -4px rgba(0,0,0,0.07), 0 0 2px 1px rgba(0,0,0,0.06), 0 10px 36px 0 rgba(0,0,0,0.16)',
        'button-press': '0 0 0 2px #bfddff',
      },

      /* ─── Typography scale (Figma: text.styles.tokens.json) ─── */
      fontSize: {
        'text-1': ['8px',  '10px'],
        'text-2': ['12px', '16px'],
        'text-3': ['14px', '20px'],
        'text-4': ['16px', '24px'],
        'text-5': ['18px', '24px'],
        'text-6': ['20px', '24px'],
        'text-7': ['24px', '32px'],
        'text-8': ['32px', '40px'],
        'text-9': ['60px', '60px'],
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'blink': {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        'chat-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.08)', opacity: '0.85' },
        },
        'dot-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.4)', opacity: '0.6' },
        },
        'badge-burst': {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '60%': { transform: 'scale(1.25)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.3s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'spin-slow': 'spin-slow 3s linear infinite',
        'blink': 'blink 1s steps(2) infinite',
        'chat-pulse': 'chat-pulse 0.8s ease-in-out 4',
        'dot-pulse': 'dot-pulse 1.5s ease-in-out infinite',
        'badge-burst': 'badge-burst 0.35s ease-out forwards',
        'shimmer': 'shimmer 1.4s ease-in-out infinite',
      }
    }
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/container-queries")],
}
