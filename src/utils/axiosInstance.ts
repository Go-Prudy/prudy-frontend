import axios from 'axios';

// Helper function to get a specific cookie by name
function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
    }
    return null;
}

// Create an axios instance with the base URL from the environment variable
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://prudy-api.onrender.com/api/v1', // Default to production API
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Retrieve the token from cookies
        const token = getCookie('token'); // Adjust 'token' to your actual cookie name

        // Add token to headers if it exists
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Proper string interpolation
        }
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        // Any custom behavior on successful responses
        return response;
    },
    (error) => {
        if (error.response) {
            // If the response status is 401 (unauthorized), remove the token cookie and log the user out
            if (error.response.status === 401) {
                console.log('Unauthorized, logging out...');

                // Remove the token cookie
                document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

                // Optionally redirect the user to the login page
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
