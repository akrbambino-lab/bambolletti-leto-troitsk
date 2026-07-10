/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#ff6b35",
          dark: "#e85423",
          soft: "#fff2ec",
        },
        ink: "#2a2440",
        berry: "#7b3ff2",
        sun: "#ffc94d",
        mint: "#2ec7a6",
      },
      fontFamily: {
        sans: ['"Nunito"', "system-ui", "sans-serif"],
        display: ['"Baloo 2"', '"Nunito"', "sans-serif"],
      },
      borderRadius: {
        xl2: "1.5rem",
      },
      boxShadow: {
        card: "0 12px 40px -12px rgba(42,36,64,0.18)",
        glow: "0 10px 30px -8px rgba(255,107,53,0.5)",
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pop: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        floaty: "floaty 3.5s ease-in-out infinite",
        pop: "pop 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
