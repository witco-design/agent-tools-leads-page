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
          50:  '#849EE3',
          60:  '#6781D9',
          70:  '#4E68CC',
          80:  '#3E60C9',
          90:  '#3840a9',
          100: '#3A4DAA',
          110: '#3E60C9', // brand primary
          120: '#3840A9', // brand primary hover/pressed
        },
        gray: {
          10:  '#F9FAFB',
          20:  '#F2F4F7',
          30:  '#EAECF0',
          40:  '#D0D5DD',
          50:  '#E4E7EC', // default hairline / border
          60:  '#98A2B3',
          70:  '#667085',
          80:  '#475467',
          90:  '#344054',
          100: '#1D2939',
          110: '#101828', // primary text
          120: '#0C111D',
        },
        green: {
          10:  '#e0f1ec',
          20:  '#DCFAE6',
          30:  '#e0f1ec',
          40:  '#6CE9A6',
          50:  '#32D583',
          60:  '#12B76A',
          70:  '#45ac86', // success text/icon (Green.70)
          80:  '#027A48',
          90:  '#05603A',
          100: '#216f51',
          110: '#053321',
          120: '#022A1A',
        },
        red: {
          10:  '#FEF3F2',
          20:  '#FEE4E2',
          30:  '#ffe0e4',
          40:  '#FDA29B',
          50:  '#F97066',
          60:  '#F04438',
          70:  '#ec423d', // error default (Red.70)
          80:  '#B42318',
          90:  '#912018',
          100: '#7A271A',
          110: '#55160C',
          120: '#3B0B05',
        },
        orange: {
          10:  '#FEF6EE',
          20:  '#fbe4ab',
          30:  '#F9DBAF',
          40:  '#F7B27A',
          50:  '#F38744',
          60:  '#EF6820',
          70:  '#f48a3c', // warning default (Orange.70)
          80:  '#B93815',
          90:  '#932F19',
          100: '#7E2410',
          110: '#c26025',
          120: '#3D1106',
        },
        purple: {
          10:  '#EBEAFF', // AI gradient start
          20:  '#D9D6FE',
          30:  '#C3C0F1', // AI card border
          40:  '#A4A0F5',
          50:  '#8580EB',
          60:  '#6A65D8',
          70:  '#746ec0', // Purple.70
          80:  '#4F4DAB',
          90:  '#3E3D87',
          100: '#2F2E67',
          110: '#23234B',
          120: '#171733',
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
        'bg-app':    '#f5fcff',  // outer shell background (blue.10)
        'bg-card':   '#FFFFFF',  // card / panel surfaces
        'bg-canvas': '#FFFFFF',  // alias — same as bg-card (design system term)
        'bg-muted':  '#F9FAFB',  // gray.10 — subtle row bg / hover

        // Text
        'text-default':    '#101828', // gray.110 — primary text on cards
        'text-secondary':  '#475467', // gray.80  — supporting / meta text
        'text-muted':      '#667085', // gray.70  — hint / disabled / icon labels
        'text-link':       '#3E60C9', // blue.110 — links and brand actions
        'text-link-hover': '#3840A9', // blue.120 — hover / pressed link

        // Borders
        'border-default': '#E4E7EC', // gray.50 — 1px hairlines, card borders
        'border-strong':  '#D0D5DD', // gray.40 — heavier emphasis
        'border-focus':   '#3E60C9', // blue.110 — focused inputs

        // Brand
        'brand-primary':       '#3E60C9', // blue.110
        'brand-primary-hover': '#3840A9', // blue.120

        // Focus
        'focus-ring':   '#3E60C9', // blue.110 — 2px focus outline

        // Icon
        'icon-default': '#667085', // gray.70

        // Status — success
        'success-bg':     '#e0f1ec', // green.10
        'success-border': '#6CE9A6', // green.40
        'success-text':   '#45ac86', // green.70

        // Status — warning
        'warning-bg':     '#FEF6EE', // orange.10
        'warning-border': '#fbe4ab', // orange.20
        'warning-text':   '#f48a3c', // orange.70

        // Status — error
        'error-bg':     '#FEF3F2', // red.10
        'error-border': '#FDA29B', // red.40
        'error-text':   '#ec423d', // red.70

        // Status — info
        'info-bg':   '#F4F7FE', // blue.10
        'info-text': '#3E60C9', // blue.110

        // Tag / chip
        'tag-bg':   '#C3C0F1', // purple.30
        'tag-text': '#23234B', // purple.110

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
      },
      height: {
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
      },

      /* ─── Border Radius tokens (Figma: [ Border Radius ].Mode 1.tokens.json) ─── */
      borderRadius: {
        'radius-1':     '4px',
        'radius-2':     '8px',
        'radius-3':     '12px',
        'radius-4':     '16px',
        'radius-round': '9999px',
        // Legacy short aliases kept for backward compat — prefer radius-N above
        'round': '9999px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      /* ─── Shadow tokens (Figma: effect.styles.tokens.json) ─── */
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
        'md': '0 4px 8px -2px rgba(16, 24, 40, 0.10), 0 2px 4px -2px rgba(16, 24, 40, 0.06)',
        'lg': '0 12px 16px -4px rgba(16, 24, 40, 0.08), 0 4px 6px -2px rgba(16, 24, 40, 0.03)',
      },

      /* ─── Typography scale (Figma: text.styles.tokens.json) ─── */
      fontSize: {
        'text-1': ['8px',  { lineHeight: '12px' }],
        'text-2': ['10px', { lineHeight: '14px' }],
        'text-3': ['12px', { lineHeight: '16px' }],
        'text-4': ['14px', { lineHeight: '20px' }],
        'text-5': ['16px', { lineHeight: '24px' }],
        'text-6': ['20px', { lineHeight: '28px' }],
        'text-7': ['24px', { lineHeight: '32px' }],
        'text-8': ['32px', { lineHeight: '40px' }],
        'text-9': ['60px', { lineHeight: '72px' }],
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
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}
