// tailwind.config.js
module.exports = {
  content: [
    "./docs/**/*.{md,vue,js,ts,jsx,tsx}", // Includi i file di VitePress
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'), // Abilita DaisyUI
  ],
  daisyui: {
    themes: ["light", "dark"],
  },
}