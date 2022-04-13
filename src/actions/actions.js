import { getCollectionsService } from "../services/services"

export function getCollections() {
    return async (dispatch) => {
        const collections = await getCollectionsService()
        dispatch({ type: 'UPDATE_COLLECTIONS', collections })
    }
}