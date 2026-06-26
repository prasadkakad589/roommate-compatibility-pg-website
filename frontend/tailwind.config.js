/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,jsx}",
    "./api/**/*.{js,jsx}",
    "./auth/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./features/**/*.{js,jsx}",
    "./utils/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17211c",
        surface: "#f6f4ef",
        moss: "#4f6f52",
        coral: "#d7654f",
        clay: "#b77b57",
        mint: "#dfece3",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(23, 33, 28, 0.08)",
      },
    },
  },
  plugins: [],
};
