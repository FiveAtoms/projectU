import React, { useState, useEffect } from 'react'
import { initializePosts } from './reducers/posts'
import { initializeUsers } from './reducers/users'
import { setCurrentUser } from './reducers/currentUser'
import { setToken } from './reducers/token'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import NavBar from './components/NavBar'
import Home from './components/pages/Home'
import PostPage from './components/pages/PostPage'
import './static/css/base.css'
import './static/css/navBar.css'
import { ME, ALL_POSTS, ALL_USERS } from './schemas'

const App = (props) => {
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const onQueryChange = (event) => {
    setQuery(event.target.value)
  }
  const enteredSearch = () => {
    setSearch(query)
  }
  if (localStorage.getItem('token') && props.token === null) {
    props.setToken(localStorage.getItem('token'))
  }
  const postQuery = useQuery(ALL_POSTS)
  const allPosts = !postQuery.loading && props.posts === null && postQuery.data ?
    postQuery.data.allPosts : null
  const userQuery = useQuery(ME)
  const user = !userQuery.loading && props.currentUser === null && props.token && userQuery.data ?
    userQuery.data.me : null
  const allUserQuery = useQuery(ALL_USERS)
  const users = !allUserQuery.loading && props.users === null && allUserQuery.data ?
    allUserQuery.data.allUsers : null
  console.log(users)
  useEffect(() => {
    if (user) {
      props.setCurrentUser(user)
    }
    if (allPosts) {
      props.initializePosts(allPosts)
    }
    if (users) {
      props.initializeUsers(users)
    }
  }, [users, props.initializeUsers, allPosts, props.initializePosts, user, props.setCurrentUser, props])

  if (!props.posts || !props.users) {
    return (
      <div>
        <h1 style={{color: 'white'}}>loading...</h1>
      </div>
    )
  }
  
  return (
    <div className="wrapper">
      <Router>
        <NavBar onQueryChange={onQueryChange} enteredSearch={enteredSearch} />
        {/* <UserContainer /> */}
        <Route exact path="/" render={() => <Home search={search} /> } />
        <Route path="/post/:id" render={({match}) => <PostPage postId={match.params.id} /> } />
        {/* <Route path="/slice/:name/:id" render={({match}) => <Slice slice={getSliceById(match.params.id)} /> } /> */}
      </Router>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser,
    token: state.token,
    posts: state.posts,
    users: state.users,
  }
}

export default connect(
  mapStateToProps,
  { setCurrentUser, setToken, initializePosts, initializeUsers }
)(App)