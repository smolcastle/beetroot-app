const initialState = {
  showLoader: null
};

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case 'SHOW_LOADER':
      return {
        ...state,
        showLoader: true
      };
    case 'HIDE_LOADER':
      return {
        ...state,
        showLoader: false
      };
    default:
      return state;
  }
}
