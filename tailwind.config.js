export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', // ⬅️ Tambahkan ini
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        somnia: {
          light: '#e0e7ff',
          dark: '#312e81',
          accent: '#7c3aed',
        },
      },
    },
  },
  plugins: [],
};