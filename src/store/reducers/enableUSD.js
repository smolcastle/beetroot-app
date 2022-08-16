const initialState = {
  enableUSD: false,
  ethPrice: null
};

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_USD_BOOL': {
      const { enable } = action;
      return {
        ...state,
        enableUSD: enable
      };
    }
    case 'UPDATE_ETH_PRICE': {
      const { price } = action;
      return {
        ...state,
        ethPrice: price
      };
    }
    default:
      return state;
  }
}
