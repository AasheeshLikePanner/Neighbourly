import axios from "axios";

const apiPrefix = "http://localhost:8000"


export const createPost = async (formData) => {
    try {
        for (let pair of formData.entries()) {
            console.log(pair[0] + ':', pair[1]);
        }
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
        
        const response = await axios.post(apiPrefix + '/posts/posts', {...filter});
        console.log(response);
        return response.data;
    } catch (error) {
        
    }
}

