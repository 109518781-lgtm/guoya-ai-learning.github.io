import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#58CC02",
          yellow: "#FFD93D",
          blue: "#4D96FF",
          red: "#FF6B6B",
          purple: "#845EF7",
          orange: "#FF9F1C",
          ink: "#17211C"
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        border: "hsl(var(--border))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))"
      },
      borderRadius: {
        xl: "18px",
        "2xl": "24px",
        "3xl": "32px"
      },
      boxShadow: {
        game: "0 14px 0 rgba(23, 33, 28, 0.10), 0 26px 55px rgba(23, 33, 28, 0.12)",
        soft: "0 18px 50px rgba(23, 33, 28, 0.10)"
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        },
        sparkle: {
          "0%": { opacity: "0", transform: "translateY(12px) scale(.8)" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0", transform: "translateY(-34px) scale(1.1)" }
        },
        coinPop: {
          "0%": { transform: "scale(.75)", opacity: "0" },
          "55%": { transform: "scale(1.12)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" }
        }
      },
      animation: {
        floaty: "floaty 3s ease-in-out infinite",
        sparkle: "sparkle 1.6s ease-out infinite",
        coinPop: "coinPop .45s ease-out"
      }
    }
  },
  plugins: [tailwindcssAnimate]
};

export default config;
