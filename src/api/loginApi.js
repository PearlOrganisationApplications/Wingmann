import axios from 'axios';

const apiClient = axios.create({
  baseURL: '', // Uses Vite proxy
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- REGISTER ADMIN ---
export const registerAdmin = async (userData) => {
  try {
    const res = await apiClient.post('/api/register/admin', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: "admin"
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Admin registration failed.");
  }
};

// --- REGISTER INTERVIEWER ---
export const registerInterviewer = async (userData) => {
  try {
    const res = await apiClient.post('/api/register/interviewer', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: "interviewer"
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Interviewer registration failed.");
  }
};

// --- UNIFIED LOGIN ---
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/api/login', {
      email: credentials.email,
      password: credentials.password
    });

    // New backend structure: { success, message, data: { id, name, email, role, token } }
    if (response.data && response.data.success) {
      const userData = response.data.data; // Access the 'data' object

      const { token, role, name, id } = userData;

      if (!token) {
        throw new Error("No token received from server.");
      }

      // Save to LocalStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role); // This will now be 'admin' or 'interviewer'
      localStorage.setItem('userName', name);
      localStorage.setItem('userId', id);

      return {
        success: true,
        role: role,
        userName: name,
        token: token,
        userId: id
      };
    }

    throw new Error("Invalid response format from server.");
  } catch (error) {
    const msg = error.response?.data?.message || error.message || "Authentication failed.";
    throw new Error(msg);
  }
};