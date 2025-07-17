/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-cyan': {
          50: '#E6FEFF',
          100: '#CCFDFF',
          200: '#99FBFF',
          300: '#66F9FF',
          400: '#33F7FF',
          500: '#00F4FF',
          600: '#00D4E6',
          700: '#00B4CC',
          800: '#009BB3',
          900: '#008299'
        },
        'custom-orange': {
          50: '#FFF2E6',
          100: '#FFE5CC',
          200: '#FFCB99',
          300: '#FFB166',
          400: '#FF9533',
          500: '#FF7A00',
          600: '#E66A00',
          700: '#CC5A00',
          800: '#B34A00',
          900: '#993A00'
        }
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(135deg, #00F4FF 0%, #00D4E6 50%, #00B4CC 100%)',
        'custom-gradient-reverse': 'linear-gradient(135deg, #00B4CC 0%, #00D4E6 50%, #00F4FF 100%)',
        'orange-gradient': 'linear-gradient(135deg, #FF7A00 0%, #E66A00 50%, #CC5A00 100%)',
        'orange-gradient-reverse': 'linear-gradient(135deg, #CC5A00 0%, #E66A00 50%, #FF7A00 100%)'
      }
    },
  },
  plugins: [],
};