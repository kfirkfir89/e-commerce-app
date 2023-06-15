/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      spacing: {
        "1/24": "4.166666%",
        "2/24": "8.333333%",
        "3/24": "12.5%",
        "4/24": "16.666666%",
        "5/24": "20.833333%",
        "6/24": "25%",
        "7/24": "29.166666%",
        "8/24": "33.333333%",
        "9/24": "37.5%",
        "10/24": "41.666666%",
        "11/24": "45.833333%",
        "12/24": "50%",
        "13/24": "54.166666%",
        "14/24": "58.333333%",
        "15/24": "62.5%",
        "16/24": "66.666666%",
        "17/24": "70.833333%",
        "18/24": "75%",
        "19/24": "79.166666%",
        "20/24": "83.333333%",
        "21/24": "87.5%",
        "22/24": "91.666666%",
        "23/24": "95.833333%",
      },
      height: {
        "10v": "10vh",
        "20v": "20vh",
        "30v": "30vh",
        "40v": "40vh",
        "50v": "50vh",
        "60v": "60vh",
        "70v": "70vh",
        "80v": "80vh",
        "90v": "90vh",
        "100v": "100vh",
      },
      animation: {
        "spin-slow": "spin 2s linear infinite",
        "spin-reverse": "spin-reverse 1s linear infinite",
        marquee: "marquee 35s linear infinite",
        marquee2: "marquee2 35s linear infinite",
        "marquee-rev": "marquee-rev 5s linear infinite",
        // "marquee-rev2": "marquee-rev 5s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "marquee-rev": {
          "0%": {
            right: "100%",
          },
          "100%": {
            right: "-100%",
          },
        },

        wave: {
          "0%,": { transform: "rotate(0.0deg)" },
          "10%": { transform: "rotate(14deg)" },
          "20%": { transform: "rotate(-8deg)" },
          "30%": { transform: "rotate(14deg)" },
          "40%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(10.0deg)" },
          "60%": { transform: "rotate(0.0deg)" },
          "100%": { transform: "rotate(0.0deg)" },
        },
        "spin-reverse": {
          "0%,": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(-360deg)" },
        },
      },
      backgroundImage: {
        "keyboard-pattern": "url('/src/assets/keyboard.svg')",
        triangle2: "url('/src/assets/triangle2.svg')",
      },
    },
    fontFamily: {
      pacifico: ["Pacifico"],
      titanOne: ["Titan One"],
      dosis: ["Dosis", "sans-serif"],
      smoochSans: ["Smooch-Sans", "sans-serif"],
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant("child-span", "& > span");
      addVariant("child-hover", "& > *:hover");
      addVariant("child-div", "& < div:hover");
    },
    // eslint-disable-next-line global-require
    require("daisyui"),
  ],
};
