import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Matched to the SS brand logo: cool metallic near-black, electric
        // indigo-blue accent, brushed-silver highlights.
        background: "#0A0A0D",
        surface: "#14141A",
        ink: "#EAECF3",        // cool silver-white — primary text
        primary: "#4550F5",    // electric indigo-blue — signature accent
        secondary: "#6E76FF",  // lighter blue, gradient partner
        silver: "#C7D0E0",     // brushed-metal highlight
        muted: "#8A8FA3",      // cool gray
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(69,80,245,0.45)",
        "glow-lg": "0 0 90px -14px rgba(69,80,245,0.50)",
        premium: "0 24px 70px -28px rgba(0,0,0,0.85), 0 0 1px rgba(234,236,243,0.10) inset",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(234,236,243,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(234,236,243,0.035) 1px, transparent 1px)",
        "brand-gradient": "linear-gradient(135deg, #4550F5 0%, #6E76FF 100%)",
      },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-14px)" } },
        "pulse-glow": {
          "0%,100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.04)" },
        },
        "marker-in": { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 5s ease-in-out infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        marquee: "marquee 26s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
