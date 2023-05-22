/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    './public/**/*.html',
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./islands/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes : {
        fade : {
          "0%" : {opacity : 0},
          "100%" : {opacity : 1},
        },
        dropDown : {
          "0%" : {marginTop : -10},
          "100%" : {marginTop : 0}
        },
      },
      animation : {
        'fade-in' : 'fade 0.5s ease',
        'drop-in' : 'dropDown 1s ease'
      }
    },
  },
  plugins: [],
};
