import axios from "axios"

const apiPrefix = "http://localhost:8000"

export const getUserLikes = async (userId, itemType) => {
    try {
        console.log(userId);
        
        const response = await axios.post(apiPrefix+ '/likes/userlikes',{userId, itemType});
        console.log(response.data);
        return response.data.data;
    } catch (error) {
        throw error;
    }

}


export const likePost = async (postId, userId) => {
    try {
        const response = await axios.post(apiPrefix + '/likes/like', { itemId:postId, userId, itemType: 'Post' }, {withCredentials:true})
        console.log(response);
    } catch (error) {
        throw error
    }
}

export const unlikePost = async (postId, userId) => {
    try {
        const response = await axios.post(apiPrefix + '/likes/unlike', { itemId:postId, userId, itemType: 'Post' },{withCredentials:true})
        console.log(response);
    } catch (error) {
        throw error;
    }
}

export const likeComment = async (commentId) => {

}

export const unlikeComment = async (commentId) => {
    
}