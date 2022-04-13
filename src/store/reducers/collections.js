
const initialState = {
    collections: []
}

export default function Reducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_COLLECTIONS': {
            const { collections } = action
            return {
                ...state,
                collections
            }
        }
        default:
            return state
    }
}