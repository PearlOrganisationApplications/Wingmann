import apiClient from './apiClient';

/**
 * Fetches dashboard data based on date range
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate - YYYY-MM-DD
 */
export const getDashboardOverview = async (startDate, endDate) => {
    try {
        const response = await apiClient.get('/api/dashbaord-overview', {
            params: { startDate, endDate },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        throw error;
    }
};