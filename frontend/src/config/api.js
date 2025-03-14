// API Configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  apiKey: import.meta.env.VITE_API_KEY, 
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`
  }
};

export const getApiConfig = () => {
  // Validate API key is present
  if (!API_CONFIG.apiKey) {
    console.error('API key is missing. Please check your .env file.');
  }
  
  return API_CONFIG;
};

export default API_CONFIG;
