import axios from 'axios';

// Get base URL from environment or default with trailing slash handling
const apiBaseURL = import.meta.env.VITE_API_URL || 'https://finance-chatbot-api.onrender.com';
// Ensure the URL doesn't have a trailing slash for consistency
const normalizedBaseURL = apiBaseURL.endsWith('/') ? apiBaseURL.slice(0, -1) : apiBaseURL;

// Log the actual API URL being used
console.log('API Service initialized with base URL:', normalizedBaseURL);

const api = axios.create({
  baseURL: normalizedBaseURL,
  timeout: 30000, // 30 seconds default timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for logging with detailed URL info
api.interceptors.request.use(
  config => {
    // Construct and log the complete URL for debugging
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log(`Sending ${config.method.toUpperCase()} request to: ${fullUrl}`);
    console.log('Request headers:', config.headers);
    
    if (config.data) {
      console.log('Request payload:', config.data);
    }
    
    return config;
  },
  error => {
    console.error('Request setup error:', error);
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
      console.error('API error response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: `${error.config?.baseURL || ''}${error.config?.url || ''}`,
        method: error.config?.method
      });
      
      // Special handling for 404 errors
      if (error.response.status === 404) {
        console.error('404 Not Found Error - API endpoint does not exist or is misconfigured');
        console.error('Tried URL:', `${error.config?.baseURL || ''}${error.config?.url || ''}`);
        
        // Try alternative endpoint paths for chat if that's what failed
        if (error.config?.url === '/api/chat' || error.config?.url === 'api/chat') {
          console.log('Attempting to use alternative chat endpoint...');
          
          // Create a new request with slightly different path
          const newUrl = error.config.url.startsWith('/') ? 
            error.config.url : `/${error.config.url}`;
          
          // We'll retry with an adjusted URL, but return the original error
          axios({
            ...error.config,
            url: newUrl === '/api/chat' ? '/chat' : '/api/chat'  // Try alternative path
          }).then(response => {
            console.log('Alternative endpoint succeeded:', response.data);
          }).catch(retryError => {
            console.error('Alternative endpoint also failed:', retryError.message);
          });
        }
      }
    } else if (error.request) {
      console.error('API no response:', {
        url: `${error.config?.baseURL || ''}${error.config?.url || ''}`,
        method: error.config?.method,
        timeout: error.config?.timeout
      });
      
      if (error.config?.baseURL?.includes('render.com')) {
        console.warn('No response from Render.com service. It might be in sleep mode and takes 1-3 minutes to wake up.');
      }
    } else {
      console.error('API request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Test multiple connection paths
const testConnection = () => {
  console.log('Testing API connection with multiple path variations...');
  
  // Try different endpoint variations
  const endpoints = [
    '/health',
    '/api/ping',
    '/',
    '/api/chat',  // API chat endpoint
    '/chat',      // Alternative path without /api prefix
    '/api'        // Just the API root
  ];
  
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
