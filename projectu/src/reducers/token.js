export const setToken = (token) => {
    return async dispatch => {
        dispatch({
            type: 'SET_TOKEN',
            data: token
        })
    }
}

export const clearToken = () => {
    return async dispatch => {
        dispatch({
            type: 'CLEAR_TOKEN'
        })
    }
}

const token = (state = null, action) => {
    switch (action.type) {
        case 'SET_TOKEN' :
            return action.data
        case 'CLEAR_TOKEN' :
            return null
        default:
            return state
    }
}

export default token