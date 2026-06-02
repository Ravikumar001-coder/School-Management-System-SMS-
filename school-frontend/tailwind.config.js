// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // This line tells Tailwind WHERE to look for class names
  // If you miss this, NO styles will work!
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      // Brand colors from Stitch Login Design
      colors: {
        "brand-background": "#fbf8ff",
        "brand-surface-container-highest": "#e3e1eb",
        "brand-primary-fixed-dim": "#b8c4ff",
        "brand-outline": "#757684",
        "brand-neutral-bg": "#F8FAFC",
        "brand-on-secondary-fixed": "#00201d",
        "brand-tertiary": "#611e00",
        "brand-on-background": "#1a1b22",
        "brand-on-secondary-fixed-variant": "#00504a",
        "brand-inverse-primary": "#b8c4ff",
        "brand-text-body": "#334155",
        "brand-on-primary-fixed": "#001453",
        "brand-tertiary-container": "#872d00",
        "brand-on-tertiary": "#ffffff",
        "brand-inverse-surface": "#2f3037",
        "brand-inverse-on-surface": "#f1f0fa",
        "brand-secondary-fixed-dim": "#80d5cb",
        "brand-secondary-container": "#99efe5",
        "brand-tertiary-fixed-dim": "#ffb59a",
        "brand-on-error": "#ffffff",
        "brand-warning": "#B45309",
        "brand-role-student": "#7C3AED",
        "brand-surface-container-lowest": "#ffffff",
        "brand-outline-variant": "#c4c5d5",
        "brand-on-tertiary-container": "#ffa583",
        "brand-surface-variant": "#e3e1eb",
        "brand-on-error-container": "#93000a",
        "brand-on-primary-fixed-variant": "#173bab",
        "brand-on-primary": "#ffffff",
        "brand-surface": "#fbf8ff",
        "brand-on-surface-variant": "#444653",
        "brand-error": "#ba1a1a",
        "brand-secondary": "#006a63",
        "brand-surface-container-low": "#f4f2fc",
        "brand-surface-dim": "#dad9e3",
        "brand-surface-tint": "#3755c3",
        "brand-text-heading": "#0F172A",
        "brand-surface-bg": "#F1F5F9",
        "brand-on-surface": "#1a1b22",
        "brand-on-tertiary-fixed-variant": "#802a00",
        "brand-error-container": "#ffdad6",
        "brand-on-primary-container": "#a8b8ff",
        "brand-primary-container": "#1e40af",
        "brand-tertiary-fixed": "#ffdbce",
        "brand-primary": "#00288e",
        "brand-surface-container-high": "#e8e7f1",
        "brand-on-tertiary-fixed": "#380d00",
        "brand-primary-light": "#DBEAFE",
        "brand-success": "#15803D",
        "brand-role-admin": "#1D4ED8",
        "brand-surface-container": "#eeedf7",
        "brand-on-secondary-container": "#006f67",
        "brand-surface-bright": "#fbf8ff",
        "brand-danger": "#B91C1C",
        "brand-secondary-fixed": "#9cf2e8",
        "brand-on-secondary": "#ffffff",
        "brand-primary-fixed": "#dde1ff",

        // Existing custom colors for your school app
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        school: {
          blue:   '#2563eb',
          green:  '#16a34a',
          red:    '#dc2626',
          yellow: '#d97706',
          purple: '#7c3aed',
        }
      },
      // Custom font sizes
      fontSize: {
        'xxs': '0.65rem',
        "brand-label-xs": ["11px", {"lineHeight": "15px", "fontWeight": "500"}],
        "brand-body-sm": ["13px", {"lineHeight": "20px", "fontWeight": "400"}],
        "brand-headline-md": ["22px", {"lineHeight": "28px", "fontWeight": "600"}],
        "brand-headline-lg": ["28px", {"lineHeight": "34px", "fontWeight": "700"}],
        "brand-title-lg": ["18px", {"lineHeight": "25px", "fontWeight": "600"}],
        "brand-headline-md-mobile": ["20px", {"lineHeight": "26px", "fontWeight": "600"}],
        "brand-stat-display": ["36px", {"lineHeight": "40px", "fontWeight": "700"}],
        "brand-body-base": ["15px", {"lineHeight": "24px", "fontWeight": "400"}]
      },
      fontFamily: {
        "brand-inter": ["Inter", "sans-serif"]
      },
      spacing: {
        "brand-xs": "4px",
        "brand-sm": "8px",
        "brand-base": "4px",
        "brand-md": "16px",
        "brand-gutter": "16px",
        "brand-lg": "24px",
        "brand-margin": "24px",
        "brand-xl": "48px",
      },
      // Custom box shadows
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12)',
      },
      // Custom border radius
      borderRadius: {
        'xl2': '1rem',
        'xl3': '1.5rem',
      },
      // Animation
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-in': 'bounceIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%':   { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        bounceIn: {
          '0%':   { transform: 'scale(0.9)', opacity: '0' },
          '70%':  { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}