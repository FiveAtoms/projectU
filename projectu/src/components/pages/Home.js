import React from 'react'
import { connect } from 'react-redux'
import '../../static/css/home.css'
import NewPost from '../newPost/NewPost'
import UserBanner from '../userBanner/UserBanner'

const Home = (props) => {
    const isSearchedFor = (post) => {
        const skills = post.skillNames.map(so => so.name)
        if (post.description.includes(props.search) || post.title.includes(props.search) || skills.includes(props.search)){
            return true
        }
        return false
    }
    const filteredPosts = props.posts.filter(p => isSearchedFor(p))

    const postsToShow = filteredPosts.map(p => <NewPost post={p} />)
    return (
        <div className="home-container">
            <div style={{height: "70px"}} />
            <div className="home-content-container">
                <div className="home-posts-container" >
                    <div style={{gridColumn: '1/3'}}>
                        <h1 style={{color: '#235e6f'}} className="home-content-title">posts</h1>
                        <div className="custom-hr" style={{backgroundColor: '#235e6f', gridColumn: '1/3'}} />
                    </div>
                    {postsToShow}
                    {postsToShow}

                </div>
                {/* <div className="home-users-container">
                    <div >
                        <h1 className="home-content-title" style={{color: '#f5624d'}} >users</h1>
                        <div className="custom-hr" style={{backgroundColor: '#f5624d', gridColumn: '1/3'}} />
                    </div>
                    <UserBanner />
                    <UserBanner />
                    <UserBanner />
                </div> */}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
	return {
        posts: state.posts
	}
}
export default connect(
    mapStateToProps
)(Home)