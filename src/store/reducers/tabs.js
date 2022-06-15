const initialState = {
  selectedTab: 0,
  tabs: [
    { name: "Chats", to: "/", index: 0 },
    { name: "Order History", to: "/", index: 1 },
    { name: "Portfolio", to: "/", index: 2 },
    { name: "Profit / Loss", to: "/pnl", index: 3 },
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
