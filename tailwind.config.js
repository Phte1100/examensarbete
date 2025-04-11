/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.ts',
    './node_modules/@nuxt/ui/**/*'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
