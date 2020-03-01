export const initializePosts = (posts) => {
    return async dispatch => {
        dispatch({
            type: 'INIT_POSTS',
            data: posts
        })
    }
}

const posts = (state = null, action) => {
    switch (action.type) {
        case 'INIT_POSTS':
          return action.data
        default:
            return state
    }
}

export default posts