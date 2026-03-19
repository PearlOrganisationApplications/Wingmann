// src/api/interviewerApi.js
import apiClient from './apiClient';

// GET: Fetch all users and filter for interviewers
export const getInterviewers = async () => {
  const response = await apiClient.get('/api/users');
  // Check if data is inside response.data.data or response.data
  const users = response.data.data || response.data;
  return users.filter(user => user.role === 'interviewer');
};

// GET: Specific Availability for one interviewer
export const getInterviewerAvailability = async (id) => {
  const response = await apiClient.get(`/api/${id}/availability`);
  return response.data.data || response.data;
};

// POST: Create (JSON format)
export const registerInterviewer = async (payload) => {
  const response = await apiClient.post('/api/register/interviewer', {
    ...payload,
    role: "interviewer"
  });
  return response.data;
};

// PUT: Update Interviewer (THIS WAS MISSING)
export const updateInterviewer = async (id, payload) => {
  const response = await apiClient.put(`/api/interviewer/${id}`, payload);
  return response.data;
};

// DELETE: Remove interviewer
export const deleteInterviewer = async (id) => {
  const response = await apiClient.delete(`/api/interviewer/${id}`);
  return response.data;
};