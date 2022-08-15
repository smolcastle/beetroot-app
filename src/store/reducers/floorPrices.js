const initialState = {
  floorPrices: []
}

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_FLOOR_PRICES': {
      const { prices } = action
      return {
        ...state,
        floorPrices: prices
      }
    }
    default:
      return state
  }
}
