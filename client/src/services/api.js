import axios from 'axios';
const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000/api',
    withCredentials: true, // Crucial for sending the 'token' cookie
});
// This interceptor automatically handles unauthorized errors
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Just remove the user from app state — no redirect, no reload
            // Optional: emit an event or call a logout function
            console.warn("401 Unauthorized — session expired.");
        }
        return Promise.reject(error);
    }
);

export default api;
