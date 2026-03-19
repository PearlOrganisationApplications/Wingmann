import apiClient from './apiClient';

// Use the specific Get URL you provided
export const getPhotos = async (userId) => {
    try {
        const response = await apiClient.get(`/api/get-all-match-photos/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching photos:", error);
        throw error;
    }
};

// Assuming upload follows the same pattern as before but on the wingmann domain
export const uploadPhotos = async (userId, formData) => {
    try {
        const response = await apiClient.post(`/api/curate-vibe/${userId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// New Delete API using the query parameters format you provided
export const deletePhoto = async (adminId, photoId) => {
    try {
        const response = await apiClient.delete(`/api/delete-photo`, {
            params: { adminId, photoId }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting photo:", error);
        throw error;
    }
};

export const updatePhoto = async (adminId, photoId, gender) => {
    try {
        // According to your screenshot: PUT /api/update-photo?adminId=...&photoId=...&gender=...
        const response = await apiClient.put(`/api/update-photo`, {}, {
            params: {
                adminId: adminId,
                photoId: photoId,
                gender: gender
            }
        });
        return response.data;
    } catch (error) {
        console.error("Update API Error:", error.response?.data || error.message);
        throw error;
    }
};