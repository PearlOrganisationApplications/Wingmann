import apiClient from './apiClient';

// Use the Admin ID from your screenshots
const ADMIN_ID = "699d6c888e41d29366bb2b50";

export const getAllRestaurants = async () => {
  // GET: /api/getAll-restaurent/:adminId
  const response = await apiClient.get(`/api/getAll-restaurent/${ADMIN_ID}`);
  return response.data;
};

export const addRestaurant = async (formData) => {
  // POST: /api/add-restaurent/:adminId
  const response = await apiClient.post(`/api/add-restaurent/${ADMIN_ID}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const updateRestaurant = async (restaurantId, formData) => {
  // Assuming the update endpoint follows the same pattern
  const response = await apiClient.put(`/api/update-restaurent/${restaurantId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const deleteRestaurant = async (restaurantId) => {
  // Assuming delete endpoint
  const response = await apiClient.delete(`/api/delete-restaurent/${restaurantId}`);
  return response.data;
};