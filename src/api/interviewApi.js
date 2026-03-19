import apiClient from './apiClient';

export const interviewApi = {
    /**
     * Fetch bookings based on role.
     */
    getBookings: async () => {
        const role = localStorage.getItem('userRole');
        const userId = localStorage.getItem('userId');

        if (role === 'admin') {
            const response = await apiClient.get('/api/bookings');
            return response.data;
        } else {
            const response = await apiClient.get(`/api/user-bookings/${userId}`);
            return response.data;
        }
    },

    /**
     * Fetch full interview/user details
     */
    getInterviewDetail: async (id) => {
        const response = await apiClient.get(`/api/interview-detail/${id}`);
        return response.data;
    },

    /**
     * Update Booking Status (Accept/Reject)
     */
    updateBookingStatus: async (id, status, rejectionReason = "") => {
        const payload = { status };
        if (status === 'rejected') {
            payload.rejectionReason = rejectionReason;
        }
        const response = await apiClient.put(`/api/interview-change-status/${id}`, payload);
        return response.data;
    }
};