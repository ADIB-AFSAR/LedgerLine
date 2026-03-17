import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://localhost:5000/api/v1',
    baseURL: 'https://taxproject-api.vercel.app/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
    (config) => {
        const path = window.location.pathname;
        const isAdminPath = path.startsWith('/admin');

        let token = null;
        if (isAdminPath) {
            token = localStorage.getItem('admin_token') || localStorage.getItem('token');
        } else {
            token = localStorage.getItem('token');
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
