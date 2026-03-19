import apiClient from './apiClient';

export const availabilityApi = {
    getInterviewerAvailability: (interviewerId) =>
        apiClient.get(`/api/${interviewerId}/availability`),

    setAvailability: (interviewerId, payload) =>
        apiClient.post(`/api/${interviewerId}/availability`, payload),

    // Match Postman: PUT https://api.wingmann.online/api/update/:userId/:slotId
    updateSlot: (userId, slotId, payload) =>
        apiClient.put(`/api/update/${userId}/${slotId}`, payload),

    // Match Postman: DELETE https://api.wingmann.online/api/delete-slot?userId=...&slotId=...
    deleteSlot: (userId, slotId) =>
        apiClient.delete(`/api/delete-slot`, {
            params: { userId, slotId }
        }),

    bookSlot: (interviewerId, payload) =>
        apiClient.post(`/api/book-slot/${interviewerId}`, payload),

    getUsers: () => apiClient.get('/api/users'),
};