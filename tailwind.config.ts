import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          blue: "#0052FF",
          blueLight: "#3D7BFF",
          blueDark: "#0040CC",
        },
        surface: {
          DEFAULT: "#0A0A0A",
          void: "#050505",
          card: "#111214",
          border: "#1E2024",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        display: ["var(--font-space)", "var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        "glow-blue": "0 0 0 1px rgba(0,82,255,0.4), 0 8px 32px rgba(0,82,255,0.35), 0 0 60px rgba(0,82,255,0.15)",
        "glow-blue-lg": "0 0 0 1px rgba(0,82,255,0.5), 0 12px 48px rgba(0,82,255,0.45), 0 0 90px rgba(0,82,255,0.2)",
        card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 40px -20px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(60% 50% at 50% 0%, rgba(0,82,255,0.18) 0%, rgba(0,82,255,0) 70%)",
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
      },
      animation: {
        "pulse-slow": "pulse 3.5s cubic-bezier(0.4,0,0.6,1) infinite",
        "fade-up": "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
        "scale-in": "scaleIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
