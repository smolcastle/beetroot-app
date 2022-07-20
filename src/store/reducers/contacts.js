const initialState = {
    contacts: null,
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
      case "UPDATE_CONTACTS":
        return {
          ...state,
          contacts: action.contacts,
        };
      default:
        return state;
    }
}