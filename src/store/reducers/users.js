const initialState = {
  users: null
};

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_USERS':
      return {
        ...state,
        users: action.users
      };
    default:
      return state;
  }
}
