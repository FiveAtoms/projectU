import React from 'react'
import { connect } from 'react-redux'
import { useMutation } from '@apollo/react-hooks'
import { useField } from '../../../hooks/index'
import { LOGIN } from '../../../schemas'
import { setToken } from '../../../reducers/token'
import { contractLogInContainer } from '../../../reducers/logInContainer'
import { setCurrentUser } from '../../../reducers/currentUser'


const SignInForm = (props) => {
    const handleError = (error) => {
        console.log(error)
    }
    
    const [login] = useMutation(LOGIN, {
        onError: handleError
    })

    const password = useField('password')
    const username = useField('text')

    const handleSignIn = async (event) => {
        event.preventDefault()

        const result = await login({
            variables: {
                username: username.fields.value,
                password: password.fields.value,
            }
        })
        if (result) {
            const token = result.data.login.value
            localStorage.setItem('token', token)
            localStorage.setItem('username', username.fields.value)
            const user = props.users.find(u => u.username === username.fields.value)
            props.setCurrentUser(user)
            props.setToken(token)
            username.reset()
            password.reset()
            props.contractLogInContainer()
        }
    }

    return (
        <div>
            <h3>sign in</h3>
            <form className="log_in-form" onSubmit={(e) => handleSignIn(e)}>
                <label htmlFor="log_in-username">username</label>
                <input className="log_in-input" id="log_in-username" {...username.fields} />
                <label htmlFor="log_in-password">password</label>
                <input className="log_in-input" id="log_in-password" {...password.fields} />
                <button className="log_in-form-submit" type="submit"><h3>sign in</h3></button>
            </form>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        users: state.users,
    }
}
export default connect(
    mapStateToProps,
    { setToken, contractLogInContainer, setCurrentUser }
)(SignInForm)