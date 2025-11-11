/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#10B981',
          purple: '#8B5CF6',
          dark: '#1F2937',
        },
        accent: {
          green: '#34D399',
          purple: '#A78BFA',
        },
      },
    },
  },
  plugins: [],
}

