const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  // purge: {
  //   enabled: true,
  //   content: ["./**/*.html"],
  // },
  theme: {
    screens: {
      xs: '380px',
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        righteous: ["Righteous", "sans-serif"],
        termina: ["Termina", "sans-serif"],
        rubik: ["Rubik", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        bg: "url('/src/img/bg.png')",
        chart: "url('/src/img/chart.png')",
        mesh: "url('/src/img/mesh.png')",
        mobile_mesh: "url('/src/img/mesh_m.png')",
        play: "url('https://firebasestorage.googleapis.com/v0/b/beetroot-2192b.appspot.com/o/play.png?alt=media&token=67c51a6d-fdc4-4cec-b1b9-4b5096cf87f3')",
        playing:
          "url('https://firebasestorage.googleapis.com/v0/b/beetroot-2192b.appspot.com/o/playing.png?alt=media&token=4960e9dc-5a6c-4002-865e-f194f47cf93e')",
      },
      
    },
    colors: {
      gray1: "#cacaca",
      gray2: "#565454",
      beetroot1: "#70263d",
      black: "#000000",
      black1: "#242933",
      black2: "#2E3440",
      black3: "#3B4252",
      black4: "#434C5E",
      black5: "#4C566A",
      black6: "#7B88A1",
      black7: "#292E39",
      black8: "#3E4553",
      white0: "#FFFFFF",
      white1: "#D8DEE9",
      white2: "#E5E9F0",
      white3: "#ECEFF4",
      white4: "#F8F9FB",
      white5: "#f2f4f7",
      white6: "#ABB9CF",
      white: "#FFFFFF",
      f1: "#8FBCBB",
      f2: "#88C0D0",
      f3: "#81A1C1",
      f4: "#5E81AC",
      red: "#BF616A",
      orange: "#D08770",
      yellow: "#E8B81C",
      green: "#A3BE8C",
      pink: "#B48EAD",
      "nord-dark1": "#D7DFEC",
      "nord-dark2": "#9FB6D9",
      "nord-dark3": "#434C5E",
      "nord-dark4": "#4C566A",
      "nord-light": "#F7FFF4",
    },
    animation:{
        jello: 'jello 0.9s both',
    },
      keyframes:{
        jello: {
        '0%': {
                  transform: 'scale3d(1, 1, 1)'
        },
        '30%': {
                  transform: 'scale3d(1.25, 0.75, 1)'
        },
        '40%': {
                  transform: 'scale3d(0.75, 1.25, 1)'
        },
        '50%': {
                  transform: 'scale3d(1.15, 0.85, 1)'
        },
        '65%': {
                  transform: 'scale3d(0.95, 1.05, 1)'
        },
        '75%': {
                  transform: 'scale3d(1.05, 0.95, 1)'
        },
        '100%': {
                  transform: 'scale3d(1, 1, 1)'
        },
      }
    }
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp"),
  ],
};
