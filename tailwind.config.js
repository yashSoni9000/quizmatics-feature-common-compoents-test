/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slide: {
          "0%": { transform: "translate(-100%)" },
          "100%": { transform: "translate(0%)" },
        },
        slideFromRight: {
          "0%": { transform: "translate(250%)" },
          "100%": { transform: "translate(0%)" },
        }
      },
      animation: {
        slideIn: "slide 0.15s ease-out",
        slideLeft: "slideFromRight 0.3s ease-out"
      },
      screens: {
        'xs': '480px',
      },
    },
  },
  plugins: [],
  important: "#root",


}