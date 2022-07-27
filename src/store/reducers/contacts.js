const initialState = {
    receiverContacts: null,
    addContactBtn: null,
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
      case "UPDATE_RECEIVER_CONTACTS":
      return {
        ...state,
        receiverContacts: action.receiverContacts,
      };
      case "ADD_CONTACT_BUTTON":
      return {
        ...state,
        addContactBtn: action.addContactBtn,
      };
      default:
        return state;
    }
}