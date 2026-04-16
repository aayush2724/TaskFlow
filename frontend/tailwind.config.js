/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#08111d",
        ocean: "#0f2742",
        teal: "#0b8f8c",
        mint: "#72f0c3",
        coral: "#ff7a59",
        sun: "#f5c451",
      },
      boxShadow: {
        panel: "0 18px 50px rgba(0, 0, 0, 0.18)",
      },
    },
  },
  plugins: [],
};
