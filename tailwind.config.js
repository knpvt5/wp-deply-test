// tailwind.config.js
module.exports = {
  content: [
    './**/*.{html,js}', // Matches all files in the project, excluding node_modules
    '!./node_modules/**', // Exclude node_modules
  ],
  theme: {
    extend: {
      fontFamily: {
        'custom-sans': ['Arial', 'sans-serif'],
      },
    },
  },
  corePlugins: {
    preflight: false, // Disable Tailwind's Preflight (base/reset) styles
  },
  plugins: [],
};
