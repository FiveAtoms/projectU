import React from 'react'
import { connect } from 'react-redux'
import '../../static/css/user.css'
import LogIn from './logIn/LogIn'
import UserNav from './logged/UserNav'

const UserContainer = (props) => {
    const dynamicContainerStyle = props.logInContainer ?
        props.token ? { width: '500px' } : { width: '400px' }
        :
        props.token ? { width: '100px' } : { width: '145px' }
    const logOrLogged = () => {
        if (props.token) {
            return <UserNav />
        } else {
            return <LogIn />
        }
    }
    
    return (
        <div style={dynamicContainerStyle} className="user-container">
            {logOrLogged()}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        logInContainer: state.logInContainer,
        token: state.token,
    }
}

export default connect(
    mapStateToProps
)(UserContainer)