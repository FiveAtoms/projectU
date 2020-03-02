import React, { useState } from 'react'
import { connect } from 'react-redux'
import '../../static/css/newPost.css'
import { Link } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import userIconB from '../../static/svg/userB.svg'
import clockIconB from '../../static/svg/clockB.svg'
import coopIconB from '../../static/svg/coopB.svg'
import plusIconB from '../../static/svg/plusB.svg'
import shareIconB from '../../static/svg/shareB.svg'
import userIconW from '../../static/svg/userW.svg'
import clockIconW from '../../static/svg/clockW.svg'
import coopIconW from '../../static/svg/coopW.svg'
import plusIconW from '../../static/svg/plusW.svg'
import shareIconW from '../../static/svg/shareW.svg'

const NewPost = (props) => {
    const post = props.post
    const color = post.color
    const colors = color.split('(')[1].split(')')[0].split(',').map(c => Number(c))
    const higherColor = `rgb(${colors.map(c => c + 30).join(',')})`
    let isDark = ((colors[0] + colors[1] + colors[2]) / 3) < 127 ?
        true : false
    const colorPalette = isDark ? 
        {
            textColor: 'white',
            userIcon: userIconW,
            clockIcon: clockIconW,
            coopIcon: coopIconW,
            plusIcon: plusIconW,
            shareIcon: shareIconW
        }
        :
        {
            textColor: '#282828',
            userIcon: userIconB,
            clockIcon: clockIconB,
            coopIcon: coopIconB,
            plusIcon: plusIconB,
            shareIcon: shareIconB
        }
    const skills = post.skillNames.map(so => so.name)
    const mappedSkills = () => (
        skills.map(s => 
                <div className="coop-skill">
                    {s}
                </div>
            )
    )
    const totalSkillCapCount = post.skillCapacities.reduce((total, capacity) => total + capacity)
    const totalSkillFillCount = post.skillFills.reduce((total, fill) => total + fill)
    let cleanedTime = new Date(Number(post.time))
    cleanedTime = cleanedTime.toString().split(' ')
    cleanedTime = cleanedTime.slice(1,4).join(' ') + ' ' + cleanedTime[4].split(':').slice(0,2).join(':')
   
    const [copied, setCopied] = useState(false)
    const showImgOrText = copied ?
            <div className="share-text modify-hover">url copied!</div>
            :
            <img src={colorPalette.shareIcon} onClick={() => setCopied(true)} className="utilities-icon modify-hover" alt="user" />

    return (
        <div className="newPost-container" style={{backgroundColor: color, color: colorPalette.textColor}}>
            <Link to={`/post/${post._id}`} className="coop-container" style={{backgroundColor: higherColor, color: colorPalette.textColor}} >
                <div className="coop-header">
                    <img src={colorPalette.coopIcon} className="coop-icon" alt="like" />
                    <div className="coop-title">{totalSkillFillCount} / {totalSkillCapCount}</div> 
                </div>
                <div className="custom-hr" style={{backgroundColor: color}} />
                <div className="coop-skills">
                    {mappedSkills()}
                </div>
            </Link>
            <Link to={`/post/${post._id}`} className="neutralize-link" style={{color: colorPalette.textColor}}><h3 className="header-primary-title modify-hover">{post.title}</h3></Link>
            <Link to={`${window.location.href}post/${post._id}`} className="neutralize-link newPost-content">
                <div className="paragraph-wrapper">
                    {post.description}
                </div>
            </Link>
            <div className="newPost-footer">
                <div className="footer-items reroute-hover">
                    <img src={colorPalette.userIcon} className="_footer-icon" alt="user" />
                    <div className="footer-text">{post.user.username}</div>
                </div>
                <div className="_footer-secondary">
                    <div className="footer-items modify-hover"></div>
                    <div className="footer-items">
                        <img src={colorPalette.clockIcon} className="_footer-icon" alt="user" />
                        <div className="footer-text">{cleanedTime}</div>
                    </div>
                </div>
            </div>
            <div className="newPost-utilities">
                <div className="utilities-primary">
                    <img src={colorPalette.plusIcon} className="utilities-icon modify-hover" alt="user" />
                    <CopyToClipboard text={`/post/${post._id}`}>{showImgOrText}</CopyToClipboard>
                </div>
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
)(NewPost)