/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
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
