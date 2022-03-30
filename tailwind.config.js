module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gray1': '#cacaca',
        'beetroot1': '#70263d'
      },
      backgroundImage: {
        'bg': "url('/img/bg.png')",
        'chart': "url('/img/chart.png')"
      }
    },
  },
  plugins: [],
}
