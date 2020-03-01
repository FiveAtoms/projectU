import React, { useState } from 'react'
import { connect } from 'react-redux'
import { clearToken } from '../../../reducers/token'
import { setCurrentUser } from '../../../reducers/currentUser'
import { Link } from 'react-router-dom'
import { contractLogInContainer, expandLogInContainer, setLogInContainer } from '../../../reducers/logInContainer'
import '../../../static/css/userUtilities.css'
import bellIcon from '../../../static/svg/bellB.svg'
import userIcon from '../../../static/svg/userB.svg'
import plusIcon from '../../../static/svg/plusB.svg'
import exitIcon from '../../../static/svg/exitB.svg'
import UserItem from './UserItem'

const UserNav = (props) => {
    const [verticalExpand, setVerticalExpand] = useState(false)

    if (!props.currentUser) {
        const username = localStorage.getItem('username')
        const user = props.users.find(u => u.username === username)
        props.setCurrentUser(user)
        return (
            <div>
                ...
            </div>
        )
    }
    console.log(props.currentUser)

    const handleVerticalExpand = () => {
        if (verticalExpand) {
            props.contractLogInContainer()
        }
        setVerticalExpand(!verticalExpand)
    }

    const handleHorizontalExpand = (from = false) => {
        if (props.logInContainer && from === props.logInContainer) {
            props.contractLogInContainer()
        } else {
            props.setLogInContainer(from)
        }
    }
    const handleLogout = () => {
        setVerticalExpand(false)
        props.contractLogInContainer()
        localStorage.clear()
        props.clearToken()
    }
    const userLetterIcon = props.logInContainer ?
        props.currentUser.username
        :
        props.currentUser.username.substr(0, 1).toUpperCase()

    console.log()

    const bannerStyle = props.logInContainer ?
        {
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
            transition: 'border-top-right-radius 0.25s, border-top-right-radius 0.25s, border-bottom-left-radius 0.1s 0.25s, border-bottom-right-radius 0.1s 0.25s, background-color 0.25s',
        }
        :
        verticalExpand?
            {
                borderBottomLeftRadius: '0px',
                borderBottomRightRadius: '0px',
                transition: 'border-top-right-radius 0.25s, border-top-right-radius 0.25s, border-bottom-left-radius 0.1s 0.25s, border-bottom-left-radius 0.1s, border-bottom-right-radius 0.1s, background-color 0.25s',
                
            }
            :
            {
                borderBottomLeftRadius: '50px',
                borderBottomRightRadius: '50px',
                transition: 'border-top-right-radius 0.25s, border-top-right-radius 0.25s, border-bottom-left-radius 0.1s 0.25s, border-bottom-left-radius 0.1s 0.25s, border-bottom-right-radius 0.1s 0.25s, background-color 0.25s',
            }
    
    const userItemsContainerStyle = verticalExpand ?
        props.logInContainer ? 
            {
                borderBottomLeftRadius: '5px',
                borderBottomRightRadius: '5px',
                height: '820px',
                transition: 'all 0.25s 0.1s',
            }
            :
            {
                height: '210px',
                transition: 'all 0.25s 0.1s',
            }
        :
        { height: '0px', transition: 'all 0.25s', }
    const userPosts = props.currentUser.posts.map(pid => {
        const post = props.posts.find(p => p._id === pid._id)
        return {color: post.color,title: post.title, _id: post._id}
    })
    const showUserPosts = () => userPosts.map(p => 
            <Link to={`/post/${p._id}`} className="simple-post-banner" style={{color: p.color}}>{p.title}</Link>
        )
    const showNotifications = () => props.currentUser.notifications.map(n => {
        const fromUser = props.users.find(u => u._id === n.userTo._id)
        const post = n.post ? props.posts.find(p => p._id === n.post._id) : null
        const proposedContributions = n.post ? 
            post.skillNames.map(s => s.name) : null
        // if (post){

        // }
        const status = n.accepted ? 'notif-accepted' : n.accepted === false ? 'notif-declined' : null 
        const postContent = () => post ? (
            <div>
                <h3>proposed contributions</h3>
                <div style={{display: 'flex', flexDirection: 'column', textAlign: 'center'}}>
                    {proposedContributions.map(s =>
                        <div className="skilll">
                            {s}
                        </div>
                    )}
                </div>
                
            </div>
        ): null
        if (status) {
            if (status === 'notif-accepted') {
                return (
                    <div className={`notif-container ${status}`}>
                        <h2 className="notif-sender">{fromUser.username}:</h2>
                        <div className="notif-message">
                            {n.message}
                        </div>
                        {postContent()}
                        <h3 className="email">
                            email: {fromUser.email}
                        </h3>
                    </div>
                )
            } else {
                return (
                    <div className={`notif-container ${status}`}>
                        <h2 className="notif-sender">{fromUser.username}:</h2>
                        <div className="notif-message">
                            {n.message}
                        </div>
                        {postContent()}
                    </div>
                )
            }
        } else {
            return(
                <div className={`notif-container`}>
                    <h2 className="notif-sender">{fromUser.username}:</h2>
                    <div className="notif-message">
                        {n.message}
                    </div>
                    {postContent()}
                    <div className="decide">
                        <h3 style={{backgroundColor: 'green'}} className="option">
                            accept
                        </h3>
                        <h3 style={{backgroundColor: 'red'}} className="option">
                            decline
                        </h3>
                    </div>
                </div>
            )
        }
        
    })
    return (
        <div>
            <div style={bannerStyle} onClick={() => handleVerticalExpand()} className="user-banner" >
                <h1 className="letter-icon" >{userLetterIcon}</h1>
            </div>
            <div style={userItemsContainerStyle} className="user-items-container">
                <div className="custom-hr" style={{backgroundColor: '#585858', marginTop: '1px'}} />
                <UserItem itemType='userDetail' icon={userIcon} handleHorizontalExpand={handleHorizontalExpand}>
                    <div className="userUtil-info">
                        <h3>{props.currentUser.username}</h3>
                        <h3>{props.currentUser.email}</h3>
                        <a href={props.currentUser.referenceLink}>{props.currentUser.referenceLink}</a>
                        <div className="custom-hr" style={{backgroundColor: '#282828', marginTop: '20px'}} />
                        <h2>posts</h2>
                        {showUserPosts()}
                    </div>
                </UserItem>
                <UserItem itemType='notifications' icon={bellIcon} handleHorizontalExpand={handleHorizontalExpand}>
                    <div className="userUtil-notif">
                        <div style={{height: '10px'}} />
                        {showNotifications()}
                    </div>
                </UserItem>
                <UserItem itemType='following' icon={plusIcon} handleHorizontalExpand={handleHorizontalExpand}>
                    <h3>Feature coming soon!</h3>
                </UserItem>
                <div onClick={() => handleLogout()} className="logout-container">
                    <img src={exitIcon} className="logout-icon" alt="log out" />
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        logInContainer: state.logInContainer,
        currentUser: state.currentUser,
        users: state.users,
        posts: state.posts,
    }
}
export default connect(
    mapStateToProps,
    { setCurrentUser, clearToken, contractLogInContainer, expandLogInContainer, setLogInContainer }
)(UserNav)