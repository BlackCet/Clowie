/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        border: "var(--border)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        pastel: {
          pink: "var(--pastel-pink)",
          blue: "var(--pastel-blue)",
          peach: "var(--pastel-peach)",
          mint: "var(--pastel-mint)",
          lavender: "var(--pastel-lavender)",
          yellow: "var(--pastel-yellow)",
        },
        gray: {
          50: "#f9f7f5",
          100: "#f3f0ec",
          200: "#e8dfd5",
          300: "#dccfbe",
          400: "#c4b5a0",
          500: "#a89c8f",
          600: "#8a7d72",
          700: "#6b635a",
          800: "#4a3f35",
          900: "#2f2a26",
        }
      }
    },
  },
  plugins: [],
}