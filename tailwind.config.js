/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Viridis color scale for temperature (scientific visualization)
        'viridis-1': '#440154',   // Dark purple (coldest)
        'viridis-2': '#31688e',   // Blue
        'viridis-3': '#35b779',   // Green
        'viridis-4': '#6ece58',   // Yellow-green
        'viridis-5': '#fde725',   // Yellow (warmest)
        
        // Magma color scale (alternative for heat)
        'magma-1': '#000004',     // Black (coldest)
        'magma-2': '#3b0f70',     // Dark purple
        'magma-3': '#8c2981',     // Purple
        'magma-4': '#de4968',     // Pink-red
        'magma-5': '#fcfea4',     // Yellow-white (hottest)
        
        // Temperature color scale (simplified)
        'temp-cold': '#0066CC',      // Blue
        'temp-cool': '#00CCFF',      // Cyan
        'temp-mild': '#00CC66',      // Green
        'temp-warm': '#FFCC00',      // Yellow
        'temp-hot': '#FF6600',       // Orange
        'temp-extreme': '#CC0000',   // Red
        
        // NDVI color scale
        'ndvi-water': '#0000FF',     // Blue
        'ndvi-bare': '#CCCCCC',      // Gray
        'ndvi-sparse': '#FFFF00',    // Yellow
        'ndvi-dense': '#00FF00',     // Green
        
        // UI Colors (Light theme with green)
        'bg-primary': '#f5fdf9',
        'bg-secondary': '#ffffff',
        'bg-tertiary': '#e8f5f0',
        'text-primary': '#1a1a1a',
        'text-secondary': '#4a5568',
        'accent-green': '#10b981',
        'accent-green-light': '#6ee7b7',
        'accent-green-dark': '#059669',
        'border-primary': '#d1fae5',
        'border-secondary': '#a7f3d0',
      },
      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        'mono': ['Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.5)',
      },
    },
  },
  plugins: [],
}

