import axiosInstance from '../api/axios';

export const login = async (credentials) => {
    try {
        const response = await axiosInstance.post('/users/login', credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const register = async (userData) => {
    try {
        const response = await axiosInstance.post('/users/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const logout = async () => {
    try {
        const response = await axiosInstance.post('/users/logout');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
