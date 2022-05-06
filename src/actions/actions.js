import { getEthPriceService, getFloorPriceService } from "../services/services";

export function getFloorPrices() {
  return async (dispatch) => {
    const prices = await getFloorPriceService();
    dispatch({ type: "UPDATE_FLOOR_PRICES", prices });
  };
}

export function updateSelectedTab(index) {
  return {
    type: "UPDATE_TAB",
    index,
  };
}

export function updateUSDBool(enable) {
  return (dispatch) => {
    dispatch({ type: "UPDATE_USD_BOOL", enable });
  };
}

export function getEthPrice() {
  return async (dispatch) => {
    const price = await getEthPriceService();
    dispatch({ type: "UPDATE_ETH_PRICE", price });
  };
}
