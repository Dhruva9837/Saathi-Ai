import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: {
          DEFAULT: "var(--surface)",
          2: "var(--surface-2)",
        },
        border: "var(--border)",
        text: {
          DEFAULT: "var(--text)",
          muted: "var(--text-muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          2: "var(--accent-2)",
          emerald: "#3DDC97",
          amber: "#F5B544",
          rose: "#FF6B7A",
          cyan: "#4F8BFF",
          indigo: "#7C6CFF",
        },
        gold: "var(--gold)",
        success: "var(--success)",
        danger: "var(--danger)",

        // Extended theme tokens
        background: "var(--bg)",
        surfaceSecondary: "var(--surface)",
        surfaceLight: "var(--surface-2)",
        surfaceBorder: "var(--border)",
        surfaceBorderHover: "rgba(255, 255, 255, 0.15)",
        textMain: "var(--text)",
        textMuted: "var(--text-muted)",
        primary: {
          50: "#F2F0FF",
          100: "#E5E1FF",
          200: "#CDC5FF",
          300: "#AFA0FF",
          400: "#917BFF",
          500: "#7C6CFF",
          600: "#6352E8",
          700: "#4D3EC7",
          800: "#3A2E9E",
          900: "#2A2175",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        heading: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
