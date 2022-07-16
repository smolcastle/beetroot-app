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

export function updateUsers(users) {
  return {
    type: "UPDATE_USERS",
    users,
  };
}

export function updateMessages(messages) {
  return {
    type: "UPDATE_MESSAGES",
    messages,
  };
}

export function updateMessage(message) {
  return {
    type: "UPDATE_MESSAGE",
    message,
  };
}

export function resetMessages() {
  return {
    type: "RESET_MESSAGES",
  };
}

export function updateQueueIds(queue_ids) {
  return {
    type: "UPDATE_QUEUE_IDS",
    queue_ids,
  };
}
export function updateSignatureData(signatureData) {
  return {
    type: "UPDATE_SIGNING_DATA",
    signatureData,
  };
}

export function resetSignatureData() {
  return {
    type: "RESET_SIGNING_DATA",
  };
}

export function showLoader() {
  return {
    type: "SHOW_LOADER",
  };
}

export function hideLoader() {
  return {
    type: "HIDE_LOADER",
  };
}
export function showNewUser() {
  return {
    type: "SHOW_NEW_USER",
  };
}

export function hideNewUser() {
  return {
    type: "HIDE_NEW_USER",
  };
}

