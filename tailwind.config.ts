import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Bebas Neue'", "var(--font-sans)"]
      },
      colors: {
        primary: {
          DEFAULT: "#FF3B30",
          foreground: "#0B0B0F"
        },
        secondary: {
          DEFAULT: "#4F46E5",
          foreground: "#FFFFFF"
        },
        surface: {
          DEFAULT: "#14141C",
          muted: "#1E1E29"
        }
      },
      boxShadow: {
        glow: "0 0 30px rgba(255, 59, 48, 0.35)"
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms")
  ]
};

export default config;
