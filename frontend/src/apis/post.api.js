import axios from "axios";

const apiPrefix = "http://localhost:8000"


export const createPost = async (formData) => {
    try {
        const formDataObj = {};
        for (let [key, value] of formData.entries()) {
            formDataObj[key] = value instanceof File ?
                `File: ${value.name} (${value.type}, ${value.size} bytes)` :
                value;
        }
        console.log('FormData contents:', formDataObj);
        const response = await axios.post(apiPrefix + '/posts/create', formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data;
    } catch (error) {
        throw error
    }
}

export const getAllPost = async (filter) => {
    try {
        // const { state, filterType, latitude, longitude } = req.body

        const response = await axios.post(apiPrefix + '/posts/posts', { ...filter });
        console.log(response);
        return response.data;
    } catch (error) {

    }
}

export const getPostById = async (postId) => {
    try {
        const response = await axios.post(apiPrefix + '/posts/post', {postId});
        console.log(response.data.data);
        return response.data.data
    } catch (error) {
       throw error; 
    }
}

export const getUserPosts = async (username) => {
    try {
        const response = await axios.post(apiPrefix + '/posts/user-posts', {username});
        console.log(response.data.data)
        return response.data.data;
    } catch (error) {
        throw error;
    }
}