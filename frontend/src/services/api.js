import axios from 'axios';

// Get base URL from environment or default
const apiBaseURL = import.meta.env.VITE_API_URL || 'https://finance-chatbot-api.onrender.com';

// Log the actual API URL being used
console.log('API Service initialized with base URL:', apiBaseURL);

const api = axios.create({
  baseURL: apiBaseURL,
  timeout: 30000, // 30 seconds default timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for logging
api.interceptors.request.use(
  config => {
    console.log(`Sending ${config.method.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with better error logging
api.interceptors.response.use(
  response => {
    console.log(`Request to ${response.config.url} successful (${response.status})`);
    return response;
  },
  error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API error response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url,
        method: error.config?.method
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API no response:', {
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.config?.timeout
      });
      
      // Check if Render is likely sleeping
      if (apiBaseURL.includes('render.com')) {
        console.warn('No response from Render.com service. It might be in sleep mode and takes 1-3 minutes to wake up.');
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Test connection more gracefully
const testConnection = () => {
  console.log('Testing API connection...');
  
  // Try different endpoints in sequence
  const endpoints = ['/health', '/api/ping', '/'];
  
  endpoints.forEach(endpoint => {
    api.get(endpoint)
      .then(response => {
        console.log(`Connection test to ${endpoint} successful:`, response.data);
      })
      .catch(error => {
        console.warn(`Connection test to ${endpoint} failed:`, error.message);
      });
  });
};

// Run the test immediately
testConnection();

export default api;
