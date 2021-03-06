import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import {createPostVote} from '../../actions/votes/post-vote/create';
import {deletePostVote} from '../../actions/votes/post-vote/delete';
import {editPostVote} from '../../actions/votes/post-vote/edit';
import {getUsersFullName} from '../../utils/user';
import './PostListItem.scss';


class PostListItem extends Component {

    getPostImage() {
        const {post} = this.props;
        if (post.image) return `http://127.0.0.1:8000${post.image}`;
        return 'http://i.imgur.com/1HHJKXC.png';
    }

    getVoteScoreStyling() {
        if(this.usersVoteValue() === -1) return 'down-voted';
        if(this.usersVoteValue() === 1) return 'up-voted';
    }

    getVoteTally() {
        const {post, postVotes} = this.props;
        return Object.values(postVotes)
            .filter(postVote => postVote.post === post.id)
            .reduce((acc, postVote) => acc + postVote.value, 0);
    }

    handleDownArrowClick = () => {
        const {dispatch, post} = this.props;
        if(this.usersVoteValue() === null) {
            dispatch(createPostVote({
                post: post.id,
                value: -1
            }));
        }
        if(this.usersVoteValue() === -1) {
            dispatch(deletePostVote(this.usersVote()));
        }
        if(this.usersVoteValue() === 1) {
            dispatch(editPostVote({
                ...this.usersVote(),
                value: -1
            }));
        }
    };

    handleUpArrowClick = () => {
        const {dispatch, post} = this.props;
        if(this.usersVoteValue() === null) {
            dispatch(createPostVote({
                post: post.id,
                value: 1
            }));
        }
        if(this.usersVoteValue() === -1) {
            dispatch(editPostVote({
                ...this.usersVote(),
                value: 1
            }));
        }
        if(this.usersVoteValue() === 1) {
            dispatch(deletePostVote(this.usersVote()));
        }
    };

    renderReplyCount() {
        const {post, postReplies} = this.props;
        const replies = Object.values(postReplies)
            .filter(postReply => postReply.post === post.id);
        return `${replies.length} replies`
    }

    renderContent() {
        const {post, users} = this.props;
        return (
            <div className="content">
                <Link className="title" to={`/profile/${post.user}/posts/${post.id}`}>
                    {post.title}
                </Link>
                <div className="details">
                    <Link className="user"
                          to={`/profile/${post.user}/posts`}>{getUsersFullName(users, post.user)}</Link>
                    {' · '}
                    <span className="date">{post.created_date}</span>
                </div>
                <Link className="replies" to={`/profile/${post.user}/posts/${post.id}`}>
                    {this.renderReplyCount()}
                </Link>
            </div>
        );
    }

    renderThumbnail() {
        const {post} = this.props;
        return (
            <div className="thumbnail-container">
                <Link to={`/profile/${post.user}/posts/${post.id}`}>
                    <img className="thumbnail" src={this.getPostImage()}/>
                </Link>
            </div>
        );
    }

    renderVotes() {
        return (
            <div className="votes">
                <a className="up-arrow" onClick={this.handleUpArrowClick}>
                    <i className={`fa fa-arrow-up ${this.usersVoteValue() === 1 && 'up-voted'}`}/>
                </a>
                <div className={`score ${this.getVoteScoreStyling()}`}>
                    {this.getVoteTally()}
                </div>
                <a className="down-arrow" onClick={this.handleDownArrowClick}>
                    <i className={`fa fa-arrow-down ${this.usersVoteValue() === -1 && 'down-voted'}`}/>
                </a>
            </div>
        );
    }

    usersVote() {
        const {activeUser, post, postVotes} = this.props;
        const vote = Object.values(postVotes)
            .filter(postVote => postVote.post === post.id)
            .filter(postVote => postVote.user === activeUser.id);
        if(vote.length) return vote[0];
        return null;
    }

    usersVoteValue() {
        const {activeUser, post, postVotes} = this.props;
        const vote = Object.values(postVotes)
            .filter(postVote => postVote.post === post.id)
            .filter(postVote => postVote.user === activeUser.id);
        if(vote.filter(postVote => postVote.value === -1).length) return -1;
        if(vote.filter(postVote => postVote.value === 1).length) return 1;
        return null;
    }

    render() {
        const {children} = this.props;
        return (
            <div className="PostListItem">
                {children}
                {this.renderVotes()}
                {this.renderThumbnail()}
                {this.renderContent()}
            </div>
        );
    }

}

PostListItem.propTypes = {
    post: PropTypes.object.isRequired,
};

export default connect(state => ({
    activeUser: state.activeUser,
    postReplies: state.postReplies.data,
    postVotes: state.postVotes.data,
    users: state.users.data,
}))(PostListItem);
