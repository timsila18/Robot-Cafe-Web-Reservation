/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        robot: {
          night: "#050B12",
          navy: "#0B1320",
          blue: "#0A84FF",
          silver: "#D9E2EC",
          gold: "#D4AF37",
          muted: "#A0AEC0",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 24px 80px rgba(10, 132, 255, 0.22)",
        gold: "0 18px 60px rgba(212, 175, 55, 0.18)",
      },
      backgroundImage: {
        "premium-radial":
          "radial-gradient(circle at 20% 10%, rgba(10,132,255,0.24), transparent 36%), radial-gradient(circle at 80% 0%, rgba(212,175,55,0.12), transparent 32%)",
      },
    },
  },
  plugins: [],
};
