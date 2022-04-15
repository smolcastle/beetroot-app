const initialState = {
  selectedTab: 0,
  tabs: [
    { name: "Holdings", href: "#", index: 0 },
    { name: "Profit / Loss", href: "#", index: 1 },
  ],
};

export default function tabs(state = initialState, action) {
  switch (action.type) {
    case "UPDATE_TAB":
      return {
        ...state,
        selectedTab: action.index,
      };
    default:
      return state;
  }
}
