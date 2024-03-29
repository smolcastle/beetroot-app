import { getEthPriceService, getFloorPriceService } from '../services/services';

export function getFloorPrices() {
  return async (dispatch) => {
    const prices = await getFloorPriceService();
    dispatch({ type: 'UPDATE_FLOOR_PRICES', prices });
  };
}

export function updateSelectedTab(index) {
  return {
    type: 'UPDATE_TAB',
    index
  };
}

export function updateUSDBool(enable) {
  return (dispatch) => {
    dispatch({ type: 'UPDATE_USD_BOOL', enable });
  };
}

export function getEthPrice() {
  return async (dispatch) => {
    const price = await getEthPriceService();
    dispatch({ type: 'UPDATE_ETH_PRICE', price });
  };
}

export function updateUsers(users) {
  return {
    type: 'UPDATE_USERS',
    users
  };
}
export function addContactBtn(addContactBtn) {
  return {
    type: 'ADD_CONTACT_BUTTON',
    addContactBtn
  };
}
export function updateReceiverContacts(receiverContacts) {
  return {
    type: 'UPDATE_RECEIVER_CONTACTS',
    receiverContacts
  };
}

export function updateMessages(messages) {
  return {
    type: 'UPDATE_MESSAGES',
    messages
  };
}

export function updateMessage(message) {
  return {
    type: 'UPDATE_MESSAGE',
    message
  };
}
export function updateMsgTime(msgTime, unread) {
  return {
    type: 'UPDATE_MSG_TIME',
    msgTime,
    unread
  };
}

export function resetMessages() {
  return {
    type: 'RESET_MESSAGES'
  };
}

export function updateQueueIds(queue_ids) {
  return {
    type: 'UPDATE_QUEUE_IDS',
    queue_ids
  };
}
export function updateSignatureData(signatureData) {
  return {
    type: 'UPDATE_SIGNING_DATA',
    signatureData
  };
}

export function resetSignatureData() {
  return {
    type: 'RESET_SIGNING_DATA'
  };
}

export function showLoader() {
  return {
    type: 'SHOW_LOADER'
  };
}

export function hideLoader() {
  return {
    type: 'HIDE_LOADER'
  };
}
export function showPopUp(category, msgTitle) {
  return {
    type: 'SHOW_POPUP',
    category,
    msgTitle
  };
}

export function hidePopUp() {
  return {
    type: 'HIDE_POPUP'
  };
}
