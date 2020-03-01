export const initializeUsers = (posts) => {
    return async dispatch => {
        dispatch({
            type: 'INIT_USERS',
            data: posts
        })
    }
}

const users = (state = null, action) => {
    switch (action.type) {
        case 'INIT_USERS':
          return action.data
        default:
            return state
    }
}

export default users