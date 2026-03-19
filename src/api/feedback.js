import apiClient from './apiClient';

export const getAllFeedback = async (page = 1, limit = 10) => {
    try {
        const response = await apiClient.get(`/api/feedback/all?page=${page}&limit=${limit}`);
        return response.data; // Returns { data, total, page, limit, ... }
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getFeedbackStats = async () => {
    try {
        const response = await apiClient.get('/api/feedback/stats');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};