export const expandLogInContainer = () => {
    return async dispatch => {
        dispatch({
            type: 'EXPAND_LOGIN_CONTAINER',
            data: true
        })
    }
}

export const contractLogInContainer = () => {
    return async dispatch => {
        dispatch({
            type: 'CONTRACT_LOGIN_CONTAINER',
            data: null
        })
    }
}

export const setLogInContainer = (setLogInContainerTo) => {
    return async dispatch => {
        dispatch({
            type: 'SET_LOGIN_CONTAINER',
            data: setLogInContainerTo
        })
    }
}

const logInContainer = (state = null, action) => {
    switch (action.type) {
        case 'EXPAND_LOGIN_CONTAINER' :
            return action.data
        case 'CONTRACT_LOGIN_CONTAINER' :
            return action.data
        case 'SET_LOGIN_CONTAINER' :
            return action.data
        default :
            return state
    }
}

export default logInContainer