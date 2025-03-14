 /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // You can add custom colors here
      },
      spacing: {
        // You can add custom spacing here
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}; 
