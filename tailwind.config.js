/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F5F5F0",
        primary: "#60564A",
        secondary: "#EBCB90",

        accent: "#D97706",

        textPrimary: "#2F2A24",
        textWhite: "#F0F0DB",
      },
    },
  },
  plugins: [],
};

export default config;
