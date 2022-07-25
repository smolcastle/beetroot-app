const initialState = {
  selectedTab: 1,
  tabs: [
    { name: "Settings", to: "/", index: 0 },
    { name: "Chat", to: "/chat", index: 1 },
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
