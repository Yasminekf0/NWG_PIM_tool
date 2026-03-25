import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2D6A4F",
        "primary-hover": "#40916C",
        "light-accent": "#D8F3DC",
        background: "#F8F9FA",
        card: "#FFFFFF",
        "text-primary": "#1B1B1B",
        "text-secondary": "#6B7280",
        border: "#E5E7EB",
        "border-dashed": "#D1D5DB",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "8px",
        button: "6px",
      },
    },
  },
  plugins: [],
};

export default config;
