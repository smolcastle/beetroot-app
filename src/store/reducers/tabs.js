const initialState = {
  selectedTab: 2,
  tabs: [
    { name: "Profit/Loss", to: "/", index: 0 },
    { name: "Portfolio", to: "/", index: 1 },
    { name: "Chat", to: "/chat", index: 2 },
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
