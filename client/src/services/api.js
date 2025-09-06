import axios from 'axios';
const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true, // Crucial for sending the 'token' cookie
});
// This interceptor automatically handles unauthorized errors
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // If API returns 401, token is invalid/expired, redirect to login
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);
export default api;
