const initialState = {
  showNewUser: null
};

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case 'SHOW_NEW_USER':
      return {
        ...state,
        showNewUser: true
      };
    case 'HIDE_NEW_USER':
      return {
        ...state,
        showNewUser: false
      };
    default:
      return state;
  }
}
