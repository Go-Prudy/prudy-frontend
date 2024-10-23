import axios from 'axios';

// Create an axios instance with the base URL from the environment variable
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://prudy-api.onrender.com/api/v1', // Default to production API
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;

