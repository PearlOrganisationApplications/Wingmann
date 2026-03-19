// src/api/demographicsApi.js
import apiClient from './apiClient';

export const getUserAnalytics = async () => {
  try {
    const response = await apiClient.get('/api/user-analytics');
    return response.data;
  } catch (error) {
    console.error("Error fetching demographic analytics:", error);
    throw error;
  }
};