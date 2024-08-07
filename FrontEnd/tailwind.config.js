const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        'button-bg': '#1A1A1A',
        'text': '#999999',
      },
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
}