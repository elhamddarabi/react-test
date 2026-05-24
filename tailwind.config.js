/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#F3F4F6",
        dark: "#1F2937",
        secondary_dark: "#6B7280",
      },
    },
  },
  plugins: [],
}