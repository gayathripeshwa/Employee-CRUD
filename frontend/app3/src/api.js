import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000'
});

// Before every request: if we have a saved token, attach it as
//   Authorization: Bearer <token>
// so the backend's requireAuth middleware lets us in.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// After every response: a 401 on a non-login request means our token is
// missing or expired, so clear it and send the user to the login page.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthRequest = error.config?.url?.startsWith('/auth');
        if (error.response?.status === 401 && !isAuthRequest) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Pull the server's error message out of an axios error, with a fallback.
export function errorMessage(err, fallback = 'Something went wrong') {
    return err?.response?.data?.error || fallback;
}

export default api;
