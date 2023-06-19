// tailwind.config.js
const FormKitVariants = require('@formkit/themes/tailwindcss')

module.exports = {
  content: [
    './src/**/*.{html,js,vue}',
    './node_modules/@formkit/themes/dist/tailwindcss/genesis/index.cjs',
  ],
  plugins: [FormKitVariants],
  theme: {
    extend:
    {
      fontFamily: {
        'playfair': ['Playfair Display', 'sans-serif']
      },
      colors: {
        'beige': '#D9D1B8',
        'light-brown': '#736355',
        'dark-brown': '#401F13',
      }
    },
  },
}