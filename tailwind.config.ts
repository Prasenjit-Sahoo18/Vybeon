import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // VYBEON Design System
        primary: {
          DEFAULT: "#B8FF00",
          foreground: "#050505",
        },
        secondary: {
          DEFAULT: "#7C3AED",
          foreground: "#F5F5F5",
        },
        accent: {
          DEFAULT: "#00F5FF",
          foreground: "#050505",
        },
        background: {
          DEFAULT: "#050505",
          secondary: "#090912",
        },
        card: {
          DEFAULT: "#11111A",
          foreground: "#F5F5F5",
        },
        muted: {
          DEFAULT: "#1A1A2E",
          foreground: "#8B8B9A",
        },
        border: "rgba(184,255,0,0.15)",
        input: "rgba(255,255,255,0.08)",
        ring: "#B8FF00",
        // Named aliases for shadcn compatibility
        destructive: {
          DEFAULT: "#FF4444",
          foreground: "#F5F5F5",
        },
        popover: {
          DEFAULT: "#11111A",
          foreground: "#F5F5F5",
        },
        foreground: "#F5F5F5",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      backgroundImage: {
        "gradient-radium": "linear-gradient(135deg, #B8FF00, #00F5FF)",
        "gradient-neon": "linear-gradient(135deg, #B8FF00, #7C3AED)",
        "gradient-cyber": "linear-gradient(135deg, #7C3AED, #00F5FF)",
        "gradient-aurora":
          "radial-gradient(ellipse at 20% 50%, rgba(124, 58, 237, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(184, 255, 0, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(0, 245, 255, 0.08) 0%, transparent 50%)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 1.8s infinite",
        float: "float 3s ease-in-out infinite",
        "neon-pulse": "neon-pulse 2s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "gradient-shift": "gradient-shift 4s ease-in-out infinite",
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
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "neon-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      boxShadow: {
        "neon-primary": "0 0 20px rgba(184,255,0,0.3), 0 0 40px rgba(184,255,0,0.1)",
        "neon-secondary": "0 0 20px rgba(124,58,237,0.3), 0 0 40px rgba(124,58,237,0.1)",
        "neon-accent": "0 0 20px rgba(0,245,255,0.3), 0 0 40px rgba(0,245,255,0.1)",
        glass: "0 8px 32px rgba(0,0,0,0.5)",
        card: "0 4px 24px rgba(0,0,0,0.4)",
      },
      backdropBlur: {
        xs: "4px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
