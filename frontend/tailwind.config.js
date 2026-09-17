/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        ink: "#1C1C1C",
        paper: "#F5F4EF",
        line: "#DCDAD2",
        accent: "#245D4A",
        "accent-soft": "#E6EEE9",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(28, 28, 28, 0.06)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};