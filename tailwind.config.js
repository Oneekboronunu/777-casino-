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
        retro777: {
          header: "#FBF3DE",
          cream: "#FEF9E7",
          parchment: "#F5EAD0",
          burgundy: "#BA2649",
          burgundyHover: "#A11D3C",
          cherry: "#D1345B",
          teal: "#0D9488",
          tealHover: "#0F766E",
          gold: "#F59E0B",
          goldLight: "#FDE047",
          brown: "#3E1F17",
          dark: "#120B10",
          cardDark: "#1C141B",
          cardBorder: "#342230",
          border: "#EADDC3",
        },
        casino: {
          bg: "#0B0F1A",
          dark: "#080B12",
          surface: "#101726",
          card: "#151F32",
          cardHover: "#1B273F",
          border: "#23334E",
          borderLight: "#2E4366",
          muted: "#8A99AD",
          gold: {
            DEFAULT: "#D4AF37",
            light: "#EBD07B",
            hover: "#E0BF4E",
            dark: "#A3821C",
          },
          emerald: {
            DEFAULT: "#10B981",
            light: "#34D399",
            dark: "#059669",
            glow: "rgba(16, 185, 129, 0.15)",
          },
          crimson: {
            DEFAULT: "#EF4444",
            light: "#F87171",
            dark: "#DC2626",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "Cabinet Grotesk", "Inter", "sans-serif"],
        retro: ["var(--font-retro)", "Impact", "Arial Black", "sans-serif"],
        serif: ["Georgia", "Merriweather", "serif"],
      },
      boxShadow: {
        retro: "0 4px 0 0 #871630",
        retroTeal: "0 4px 0 0 #095952",
        card: "0 8px 30px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [],
};
