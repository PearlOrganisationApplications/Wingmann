import apiClient from './apiClient';

/**
 * Fetch all users from the system
 */
export const fetchUsers = async () => {
    try {
        // Matches your provided URL: {{Base_url}}/api/users
        const response = await apiClient.get('/api/users');
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};