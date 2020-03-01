import {combineReducers, createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import token from './reducers/token'
import logInContainer from './reducers/logInContainer'
import currentUser from './reducers/currentUser'
import posts from './reducers/posts'
import users from './reducers/users'

const reducer = combineReducers({
    token,
    logInContainer,
    currentUser,
    posts,
    users,
})

const store = createStore(
    reducer,
    applyMiddleware(thunk)
)

export default store