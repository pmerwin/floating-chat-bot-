/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../src/**/*.{js,ts,jsx,tsx}" // Look at the parent src directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}