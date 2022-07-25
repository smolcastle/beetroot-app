const initialState = {
    receiverContacts: null
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
      case "UPDATE_RECEIVER_CONTACTS":
      return {
        ...state,
        receiverContacts: action.receiverContacts,
      };
      default:
        return state;
    }
}