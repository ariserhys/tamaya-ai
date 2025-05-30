import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindcssTypography from "@tailwindcss/typography";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
      screens: {
        'xxs': '360px',
      },
      fontFamily: {
        sans: [
          '"EB Garamond"',
          'serif'
        ],
        heading: [
          '"SF Pro Display"',
          '"SF Pro"',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif'
        ],
        sfpro: [
          '"EB Garamond"',
          'serif'
        ],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#0071E3',
          50: '#EBF5FF',
          100: '#D6EBFF',
          200: '#ADD6FF',
          300: '#85C2FF',
          400: '#5CADFF',
          500: '#3399FF',
          600: '#0071E3',
          700: '#005FBD',
          800: '#004C99',
          900: '#003A75',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#F8FAFC',
          50: '#FFFFFF',
          100: '#F8FAFC',
          200: '#E6EAF0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          foreground: '#475569'
        },
        destructive: {
          DEFAULT: '#EF4444',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          foreground: '#FFFFFF'
        },
        muted: {
          DEFAULT: '#94A3B8',
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          foreground: '#FFFFFF'
        },
        accent: {
          DEFAULT: '#0071E3',
          50: '#EBF5FF',
          100: '#D6EBFF',
          200: '#ADD6FF',
          300: '#85C2FF',
          400: '#5CADFF',
          500: '#3399FF',
          600: '#0071E3',
          700: '#005FBD',
          800: '#004C99',
          900: '#003A75',
          foreground: '#FFFFFF'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem'
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "button-pulse": {
          "0%, 100%": { opacity: "0.1" },
          "50%": { opacity: "0.3" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "button-pulse": "button-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      scale: {
        '102': '1.02',
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    tailwindcssTypography
  ],
} satisfies Config;
