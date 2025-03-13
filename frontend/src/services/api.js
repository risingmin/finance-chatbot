// Create this file if it doesn't exist
import axios from 'axios';

// Create an axios instance with the API URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
