import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import userIcon from '../../../static/svg/userB.svg'
import { expandLogInContainer, contractLogInContainer } from '../../../reducers/logInContainer'
import SignInForm from './SignInForm'
import RegisterForm from './RegisterForm'

const LogIn = (props) => {
    const [logInOption, setLogInOption] = useState(false)

    useEffect(() => {
        setLogInOption(false)
    }, [props.logInContainer])

    const handleExpand = () => {
        if (props.logInContainer) {
            props.contractLogInContainer()
        } else {
            props.expandLogInContainer()
        }
        setLogInOption(false)
    }

    const setToSignIn = () => {
        setLogInOption('signIn')
    }
    const setToRegister = () => {
        setLogInOption('register')
    }

    const formToShow = () => {
        if (logInOption === 'signIn') {
            return <SignInForm />
        }
        if (logInOption === 'register') {
            return <RegisterForm />
        }
    }

    const dynamicBannerStyle = props.logInContainer ?
        {
            borderBottomLeftRadius: '0px',
            borderBottomRightRadius: '0px',
        }
        :
        {
            borderBottomLeftRadius: '5px',
            borderBottomRightRadius: '5px',
            display: 'grid',
            gridTemplateColumns: '55px 1fr',
        }

    const loginBanner = () => {
        if (props.logInContainer) {
            return (
                <div style={dynamicBannerStyle} onClick={() => handleExpand()} className="icon-banner">
                    <img src={userIcon} className="user-icon" alt="user" />
                </div>
            )
        } else {
            return (
                <div style={dynamicBannerStyle} onClick={() => handleExpand()} className="icon-banner">
                    <img src={userIcon} className="user-icon" alt="user" />
                    <h2 className="banner-text">sign in</h2>
                </div>
            )
        }
    }

    const dynamicFormContainerStyle = logInOption ?
    logInOption === 'signIn' ? { height: '190px' } : { height: '230px' }
    :
    { height: '0px' }

    const dynamicLIOContainerStyle = props.logInContainer ?
        { height: '36px' } : { height: '0px' }

    const signInClass = logInOption === 'signIn' ? 'log_in-option-selected' : 'log_in-option'
    const registerClass = logInOption === 'register' ? 'log_in-option-selected' : 'log_in-option'
    
    return (
        <div>
            {loginBanner()}
            <div style={dynamicLIOContainerStyle} className="log_in-option-container">
                <div onClick={() => setToSignIn()} className={`${signInClass} LIO-left`}>
                    sign in
                </div>
                <div onClick={() => setToRegister()} className={`${registerClass} LIO-right`}>
                    register
                </div>
            </div>
            <div style={dynamicFormContainerStyle} className="log_in-form-container">
                {formToShow()}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        logInContainer: state.logInContainer,
    }
}

export default connect(
    mapStateToProps,
    {expandLogInContainer, contractLogInContainer }
)(LogIn)