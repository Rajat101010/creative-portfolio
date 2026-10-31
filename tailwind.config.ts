
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",

  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
      },

      colors: {
        ink: "#302A23",
        lime: "#876747",
        violet: "#A78B70",

        beige: {
          50: "#FFFCF7",
          100: "#F5F1E9",
          200: "#EEE7DC",
          300: "#E5DACA",
          400: "#C8B79F",
          500: "#876747",
          600: "#705237",
          700: "#494034",
          800: "#302A23",
          900: "#191713",
        },
      },

      boxShadow: {
        glow: "0 0 60px rgba(135, 103, 71, 0.12)",
        card: "0 8px 28px rgba(66, 49, 30, 0.08)",
      },
    },
  },

  plugins: [],
};

export default config;
