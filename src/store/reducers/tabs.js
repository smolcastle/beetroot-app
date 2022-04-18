const initialState = {
  selectedTab: 0,
  tabs: [
    { name: "Holdings", to: "/", index: 0 },
    { name: "Profit / Loss", to: "/pnl", index: 1 },
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
