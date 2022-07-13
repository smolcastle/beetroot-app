const initialState = {
  messages: null,
  queue_ids: null,
  signatureData: null,
};

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case "UPDATE_MESSAGES":
      return {
        ...state,
        messages: action.messages,
      };
    case "RESET_MESSAGES":
      return {
        ...state,
        messages: null,
      };
    case "UPDATE_QUEUE_IDS":
      return {
        ...state,
        queue_ids: action.queue_ids,
      };
    case "UPDATE_DETAILS":
      return {
        ...state,
        messages: [...(state.messages || [])].concat(action.details)
      };
    case "UPDATE_SIGNING_DATA":
      return {
        ...state,
        signatureData: action.signatureData,
      };
    case "RESET_SIGNING_DATA":
      return {
        ...state,
        signatureData: null,
      };
    case "UPDATE_MESSAGE":
      if (action.message) {
        return {
          ...state,
          messages: [...(state.messages || [])].concat(action.message),
        };
      }
      return state;

    default:
      return state;
  }
}
