import React from 'react'
import { connect } from 'react-redux'
import '../../static/css/userBanner.css'

const UserBanner = (props) => {
    
    return (
        <div className="user-banner-container">
            <div className="user-banner-icon">
                <h1 className="banner-icon-letter">A</h1>
            </div>
            <div className="user-banner-info">
                <h3 className="banner-info-username">Aang</h3>
                <div className="banner-info-username"><span className="important">10</span> things associated to <span className="important">web development</span></div>
            </div>
        </div>
    )
}

//const mapStateToProps = (state) => {
//	return {
        
//	}
//}
export default connect(
    null
)(UserBanner)