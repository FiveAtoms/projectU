import React from 'react'
import { connect } from 'react-redux'
import '../../static/css/postPage.css'

const PostPage = (props) => {
    const post = props.posts.find(p => p._id === props.postId)
    return (
        <div className="postPage-container">
            <div style={{height: '70px'}} />
            {post.title}
        </div>
    )
}

const mapStateToProps = (state) => {
	return {
        posts: state.posts,
	}
}
export default connect(
    mapStateToProps
)(PostPage)