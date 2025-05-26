import axios from "axios";

const apiPrefix = "http://localhost:8000"

export const addCommentInPost = async (postId, content) => {
    try {
        const comment = await axios.post(apiPrefix + '/comments/create', {content}, {withCredentials:true});
        const post = await axios.post(apiPrefix + '/posts/add-comment', {postId, commentId:comment.data.data._id}, {withCredentials:true})
        return comment.data.data;
    } catch (error) {
        throw error;
    }
}

export const loadCommentsForPost = async (postId) => {
    try {
        const response = await axios.post(apiPrefix + '/posts/comments', {postId});
        console.log(response.data.data);
        return response.data.data;
    } catch (error) {
        throw error;
    }
}