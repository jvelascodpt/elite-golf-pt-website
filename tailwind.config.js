// Build config for css/tailwind.css (replaces the Tailwind CDN script).
// Rebuild after adding new Tailwind classes to any page:
//   tailwindcss.exe -c tailwind.config.js -i css/tailwind.src.css -o css/tailwind.css --minify
module.exports = {
  content: ['./*.html', './blog/*.html', './js/*.js'],
  theme: {
    extend: {
      colors: {
        dark: { 950: '#13131a', 900: '#1c1c24', 800: '#25252e', 700: '#2f2f39', 600: '#383843', 500: '#42424d' },
        brand: { 900: '#0f2b18', 800: '#163d22', 700: '#1e5530', 600: '#276e3f', 500: '#2d8a4e', 400: '#3da863', 300: '#6bc285', 200: '#a3d9b1', 100: '#d1edda' },
        motion: { DEFAULT: '#5ae28c', light: '#7deba5' },
        gold: { 600: '#a8882e', 500: '#c9a84c', 400: '#d4b95f', 300: '#e0cc82', 200: '#eeddb0' },
      },
      fontFamily: {
        heading: ['"Barlow Condensed"', 'Impact', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
};
