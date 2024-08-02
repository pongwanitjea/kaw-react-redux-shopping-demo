const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backdropBlur: {
        'sm': '0',
      },
    },
    // screens: {
    //   'xs': '440px'
    // }
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
});