/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a', // Primary Carnival Green
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        carnival: {
          primary: '#16a34a',
          dark: '#0f172a',
          charcoal: '#1e293b',
          muted: '#64748b',
          light: '#f8fafc',
          border: '#e2e8f0',
          accent: '#ea580c',
          blue: '#0284c7',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Noto Sans Bengali"',
          '"Hind Siliguri"',
          'sans-serif',
        ],
        bengali: [
          '"Hind Siliguri"',
          '"Anek Bangla"',
          '"Noto Sans Bengali"',
          'sans-serif',
        ],
        display: [
          'Inter',
          '-apple-system',
          'sans-serif',
        ],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        elevated: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        'md': '8px',
        'lg': '10px',
        'xl': '14px',
        '2xl': '18px',
      }
    },
  },
  plugins: [],
};
