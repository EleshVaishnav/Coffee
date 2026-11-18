/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        parchment: {
          50: '#FDFCFB',
          100: '#FAF8F5',
          200: '#F3EFEA',
          300: '#E8E2D8',
          400: '#D5CDC0',
          500: '#B0A595',
          600: '#8C8273',
          700: '#665E52',
          800: '#423D35',
          900: '#23201C',
        },
        terracotta: {
          50: '#FDF4F0',
          100: '#FCE7DF',
          200: '#F9CFBF',
          300: '#F4AC94',
          400: '#EB7F5F',
          500: '#D46238', // Anthropic accent
          600: '#BC4B23',
          700: '#9B3917',
          800: '#7E2F16',
          900: '#672A17',
        },
        obsidian: {
          50: '#2A2927',
          100: '#242321',
          200: '#1F1E1D', // Surface dark
          300: '#191817',
          400: '#141413', // Background dark
          500: '#0E0E0D',
        }
      },
      boxShadow: {
        'warm-sm': '0 1px 2px rgba(27, 24, 20, 0.04)',
        'warm': '0 2px 8px -2px rgba(27, 24, 20, 0.06), 0 1px 4px -1px rgba(27, 24, 20, 0.04)',
        'warm-md': '0 8px 20px -4px rgba(27, 24, 20, 0.08), 0 2px 6px -1px rgba(27, 24, 20, 0.04)',
        'warm-lg': '0 16px 32px -8px rgba(27, 24, 20, 0.12), 0 4px 12px -2px rgba(27, 24, 20, 0.06)',
      }
    },
  },
  plugins: [],
}
