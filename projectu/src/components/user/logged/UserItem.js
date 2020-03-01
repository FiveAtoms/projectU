import React from 'react'
import { connect } from 'react-redux'

const UserItem = (props) => {
    const contentStyle = props.logInContainer === props.itemType ?
            {height: '600px', marginTop: '5px', marginBottom: '5px'} : {height: '0px'}

    return (
        <div className="user-item">
            <div onClick={() =>  props.handleHorizontalExpand(props.itemType)} className="user-item-banner">
                <img src={props.icon} className="user-item-icon" alt="user detail" />
            </div>
            <div style={contentStyle} className="user-item-wrapper">
                <div className="user-item-container">
                    {props.children}
                </div>
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
    mapStateToProps
)(UserItem)