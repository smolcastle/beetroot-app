const initialState = {
  createTradeData: null,
  acceptTradeData: null
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_CREATE_TRADE_DATA':
      return {
        ...state,
        createTradeData: action.tradeData
      }
    case 'UPDATE_ACCEPT_TRADE_DATA':
      return {
        ...state,
        acceptTradeData: action.tradeData
      }
    default:
      return state
  }
}
