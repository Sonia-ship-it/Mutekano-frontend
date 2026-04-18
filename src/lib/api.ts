import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 10000,
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const data = error.response?.data;

        if (status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('cached_user_profile');
        }

        const message =
            data?.error ||
            data?.message ||
            (Array.isArray(data?.detail) ? data.detail.map((e: any) => e.msg).join(', ') : null) ||
            error.message;
        return Promise.reject(new Error(message));
    }
);

export default api;
