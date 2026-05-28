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
      },
      colors: {
        /* ── Real Geeks Design System Color Scales ── */
        blue: {
          10: '#f0f3fb',
          20: '#d9e0f4',
          30: '#b3c1e9',
          40: '#8da2de',
          50: '#6783d3',
          60: '#4f6ec9',
          70: '#4564c4',
          80: '#3e5cb8',
          90: '#3752a8',
          100: '#2f4898',
          110: '#3e60c9',
          120: '#1a2f6b',
        },
        gray: {
          10: '#f8f8f8',
          20: '#f0f0f0',
          30: '#e8e8e8',
          40: '#d8d8d8',
          50: '#c0c0c0',
          60: '#a0a0a0',
          70: '#888888',
          80: '#707070',
          90: '#585858',
          100: '#404040',
          110: '#303030',
          120: '#1a1a1a',
        },
        green: {
          10: '#f0faf0',
          20: '#d4f0d4',
          30: '#b0e0b0',
          40: '#80cc80',
          50: '#5cb85c',
          60: '#4cae4c',
          70: '#42a042',
          80: '#389438',
          90: '#2d7a2d',
          100: '#256b25',
          110: '#1a5c1a',
          120: '#0f3d0f',
        },
        red: {
          10: '#fef0f0',
          20: '#fcd4d4',
          30: '#f8a8a8',
          40: '#f47c7c',
          50: '#ef5050',
          60: '#e04040',
          70: '#d43030',
          80: '#c42020',
          90: '#a81818',
          100: '#8c1010',
          110: '#700a0a',
          120: '#500505',
        },
        orange: {
          10: '#fef5dd',
          20: '#fde8b0',
          30: '#fcd883',
          40: '#fbc856',
          50: '#fab829',
          60: '#e5a520',
          70: '#cc9318',
          80: '#b38010',
          90: '#996e0a',
          100: '#805c05',
          110: '#664a03',
          120: '#4d3802',
        },
        purple: {
          10: '#f5f0ff',
          20: '#e4d9fc',
          30: '#d3c0f9',
          40: '#bfa3f5',
          50: '#a886f0',
          60: '#9470e0',
          70: '#7f5bcc',
          80: '#6b47b8',
          90: '#5733a4',
          100: '#462090',
          110: '#36107c',
          120: '#260060',
        },
        ink: {
          white: '#ffffff',
          black: '#000000',
        },

        /* ── Semantic Aliases ── */
        'bg-app': '#fef5dd',
        'bg-canvas': '#ffffff',
        'bg-muted': '#f8f8f8',
        'text-default': '#1a1a1a',
        'text-secondary': '#585858',
        'text-muted': '#a0a0a0',
        'text-link': '#3e60c9',
        'brand-primary': '#3e60c9',
        'brand-primary-hover': '#3752a8',
        'border-default': '#c0c0c0',
        'focus-ring': '#1a1a1a',
        'icon-default': '#303030',
        'success-bg': '#b0e0b0',
        'success-border': '#80cc80',
        'success-text': '#2d7a2d',
        'error-bg': '#fcd4d4',
        'error-border': '#f47c7c',
        'error-text': '#a81818',
        'warning-bg': '#fef5dd',
        'warning-border': '#fde8b0',
        'warning-text': '#996e0a',
        'tag-bg': '#d3c0f9',
        'tag-text': '#36107c',

        /* ── shadcn defaults ── */
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

      /* ── Spacing tokens ── */
      spacing: {
        'spacing-1': '4px',
        'spacing-2': '8px',
        'spacing-3': '12px',
        'spacing-4': '16px',
        'spacing-5': '20px',
        'spacing-6': '24px',
        'spacing-7': '28px',
        'spacing-8': '32px',
        'spacing-9': '36px',
        'spacing-10': '40px',
      },

      /* ── Sizing tokens ── */
      width: {
        'sizing-1': '4px',
        'sizing-2': '8px',
        'sizing-3': '12px',
        'sizing-4': '16px',
        'sizing-5': '20px',
        'sizing-6': '24px',
        'sizing-7': '28px',
        'sizing-8': '32px',
        'sizing-9': '36px',
        'sizing-10': '40px',
        'sizing-11': '44px',
        'sizing-12': '48px',
        'sizing-13': '52px',
        'sizing-14': '56px',
      },
      height: {
        'sizing-1': '4px',
        'sizing-2': '8px',
        'sizing-3': '12px',
        'sizing-4': '16px',
        'sizing-5': '20px',
        'sizing-6': '24px',
        'sizing-7': '28px',
        'sizing-8': '32px',
        'sizing-9': '36px',
        'sizing-10': '40px',
        'sizing-11': '44px',
        'sizing-12': '48px',
        'sizing-13': '52px',
        'sizing-14': '56px',
      },

      /* ── Border Radius tokens ── */
      borderRadius: {
        'round': '9999px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      /* ── Shadow tokens ── */
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0,0,0,0.05)',
        'md': '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
        'lg': '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)',
      },

      /* ── Typography (fontSize) ── */
      fontSize: {
        'text-1': ['10px', { lineHeight: '14px' }],
        'text-2': ['12px', { lineHeight: '16px' }],
        'text-3': ['14px', { lineHeight: '20px' }],
        'text-4': ['16px', { lineHeight: '24px' }],
        'text-5': ['18px', { lineHeight: '26px' }],
        'text-6': ['20px', { lineHeight: '28px' }],
        'text-7': ['24px', { lineHeight: '32px' }],
        'text-8': ['32px', { lineHeight: '40px' }],
        'text-9': ['40px', { lineHeight: '48px' }],
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
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.3s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}
