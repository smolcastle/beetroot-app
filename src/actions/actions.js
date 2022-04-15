import { getCollectionsService } from "../services/services";

export function getCollections() {
  return async (dispatch) => {
    const collections = await getCollectionsService();
    dispatch({ type: "UPDATE_COLLECTIONS", collections });
  };
}

export function updateSelectedTab(index) {
  return {
    type: "UPDATE_TAB",
    index,
  };
}
