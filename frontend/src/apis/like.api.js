import axios from "axios"

const apiPrefix = "http://localhost:8000"

export const getUserLikes = async (userId, itemType) => {
    try {
        const response = await axios.post(apiPrefix+ '/likes/userlikes',{userId, itemType});
        console.log(response.data);
        return response.data.data;
    } catch (error) {
        
    }

}


export const likePost = async (postId, userId) => {
    try {
        const response = await axios.post(apiPrefix + '/likes/like', { itemId:postId, userId, itemType: 'Post' })
        console.log(response);
    } catch (error) {
        throw error
    }
}

export const unlikePost = async (postId, userId) => {
    try {
        const response = await axios.post(apiPrefix + '/likes/like', { itemId:postId, userId, itemType: 'Post' })
        console.log(response);
    } catch (error) {
        throw error;
    }
}