import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000'
});

// Pull the server's error message out of an axios error, with a fallback.
export function errorMessage(err, fallback = 'Something went wrong') {
    return err?.response?.data?.error || fallback;
}

export default api;
