import React from 'react'
import { connect } from 'react-redux'
import UserContainer from './user/UserContainer'
import logoIcon from '../static/svg/logoW.svg'
import searchIcon from '../static/svg/searchW.svg'
import { Link } from 'react-router-dom'

const NavBar = (props) => {
    const handleKeyPress = (event) => {
        if (event.key === 'Enter'){
            props.enteredSearch()
        }
    }

    return (
        <div className="nav-bar-container">
            <Link to="/" ><img src={logoIcon} alt="icon" className="nav-bar-icon" /></Link>
            <div className="search-bar">
                <div className="enter-search" onClick={() => props.enteredSearch()}>
                    <img src={searchIcon} className="search-icon" alt="search" />
                </div>
                <input className="search-input" type="text" onChange={(e) => props.onQueryChange(e)} onKeyPress={(e) => handleKeyPress(e)} />
                <div className="searching-for">
                    all
                </div>
            </div>
            <UserContainer />
        </div>
    )
}

//const mapStateToProps = (state) => {
//	return {
        
//	}
//}
export default connect(
    null
)(NavBar)