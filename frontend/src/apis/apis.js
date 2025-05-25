import axios from 'axios';

const apiPrefix = "http://localhost:8000"

export const getCurrentUser = async () => {
    try {
        const response = await axios.get(apiPrefix + "/users/current-user", { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const loginUser = async (data) => {
    try {
        const response = await axios.post(apiPrefix + "/users/login", { ...data }, {withCredentials:true});
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const signUpUser = async (formData) => {
    try {
        const response = await axios.post(apiPrefix + "/users/register", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getUserProfile = async (username) => {
    try {
        const response = await axios.post(apiPrefix + '/users/get-user',{username});
        return response.data.data;
    } catch (error) {
        throw error;
    }
}
