module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        bg: "url('/img/bg.png')",
        chart: "url('/img/chart.png')"
      }
    },
    colors: {
      gray1: '#cacaca',
      beetroot1: '#70263d',
      black1: '#242933',
      black2: '#2E3440',
      black3: '#3B4252',
      black4: '#434C5E',
      black5: '#4C566A',
      black6: '#7B88A1',
      black7: '#292E39',
      black8: '#3E4553',
      white0: '#FFFFFF',
      white1: '#D8DEE9',
      white2: '#E5E9F0',
      white3: '#ECEFF4',
      white4: '#F8F9FB',
      white5: '#f2f4f7',
      white6: '#ABB9CF',
      f1: '#8FBCBB',
      f2: '#88C0D0',
      f3: '#81A1C1',
      f4: '#5E81AC',
      red: '#BF616A',
      orange: '#D08770',
      yellow: '#EBCB8B',
      green: '#A3BE8C',
      pink: '#B48EAD'
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp')
  ],
}

