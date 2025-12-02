/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Temperature color scale (Viridis/Magma inspired)
        'temp-cold': '#0066CC',
        'temp-mild': '#00CC66',
        'temp-warm': '#FFCC00',
        'temp-hot': '#FF6600',
        'temp-extreme': '#CC0000',
        // NDVI color scale
        'ndvi-water': '#0000FF',
        'ndvi-bare': '#CCCCCC',
        'ndvi-sparse': '#FFFF00',
        'ndvi-dense': '#00FF00',
      },
    },
  },
  plugins: [],
}

