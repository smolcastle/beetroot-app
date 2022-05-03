import { getFloorPriceService } from "../services/services";

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
