import React from 'react'
import { connect } from 'react-redux'
import { useMutation } from '@apollo/react-hooks'
import { useField } from '../../../hooks/index'
import { LOGIN } from '../../../schemas'
import { CREATE_USER } from '../../../schemas'
import { setToken, clearToken } from '../../../reducers/token'
import { contractLogInContainer } from '../../../reducers/logInContainer'
import { setCurrentUser } from '../../../reducers/currentUser'

const RegisterForm = (props) => {
    const handleError = (error) => {
        console.log(error)
    }
    const [login] = useMutation(LOGIN, {
        onError: handleError
    })
    const [createUser] = useMutation(CREATE_USER, {
        onError: handleError
    })

    const password = useField('password')
    const username = useField('text')
    const email = useField('email')

    const handleRegister = async (event) => {
        event.preventDefault()

        const register = await createUser({
            variables: {
                username: username.fields.value,
                password: password.fields.value,
            }
        })

        const result = await login({
            variables: {
                username: register.data.createUser.username,
                password: password.fields.value,
            }
        })
        if (result) {
            const token = result.data.login.value
            localStorage.setItem('token', token)
            props.setCurrentUser({username: username.fields.value})
            props.setToken(token)
            username.reset()
            password.reset()
            email.reset()
            props.contractLogInContainer()
        }
    }

    return (
        <div>
            <h3>register</h3>
            <form className="log_in-form" onSubmit={(e) => handleRegister(e)}>
                <label htmlFor="log_in-username">username</label>
                <input className="log_in-input" id="log_in-username" {...username.fields} />
                <label htmlFor="log_in-password">password</label>
                <input className="log_in-input" id="log_in-password" {...password.fields} />
                <label htmlFor="log_in-password">email</label>
                <input className="log_in-input" id="log_in-password" {...email.fields} />
                <button className="log_in-form-submit" type="submit"><h3>register</h3></button>
            </form>
        </div>
    )
}

// const mapStateToProps = (state) => {
//     return {
        
//     }
// }
export default connect(
    null,
    { setToken, clearToken, contractLogInContainer, setCurrentUser }
)(RegisterForm)