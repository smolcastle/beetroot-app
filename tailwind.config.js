module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  // purge: {
  //   enabled: true,
  //   content: ["./**/*.html"],
  // },
  theme: {
    extend: {
      fontFamily: {
        righteous: ["Righteous", "sans-serif"],
        termina: ["Termina", "sans-serif"],
      },
      backgroundImage: {
        bg: "url('/src/img/bg.png')",
        chart: "url('/src/img/chart.png')",
        mesh: "url('/src/img/mesh.png')",
        mobile_mesh: "url('/src/img/mesh_m.png')",
        play: "url('/src/img/play.png')",
        playing: "url('/src/img/playing.png')",
      },
    },
    colors: {
      gray1: "#cacaca",
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
      "nord-dark1": "#2E3440",
      "nord-dark2": "#3B4252",
      "nord-dark3": "#434C5E",
      "nord-dark4": "#4C566A",
      "nord-light": "#5E81AC",
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp"),
  ],
};
