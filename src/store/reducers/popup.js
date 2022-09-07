const initialState = {
  showPopUp: null,
  category: '',
  msgTitle: ''
};

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case 'SHOW_POPUP':
      return {
        ...state,
        showPopUp: true,
        category: action.category,
        msgTitle: action.msgTitle
      };
    case 'HIDE_POPUP':
      return {
        ...state,
        showPopUp: false
      };
    default:
      return state;
  }
}
