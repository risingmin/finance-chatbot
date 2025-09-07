import axios from 'axios';

// Determine environment-aware base URL
const isDev = import.meta.env.DEV;
const rawConfiguredBase = (import.meta.env.VITE_API_URL || '').trim();
const defaultRemote = 'https://finance-chatbot-api.onrender.com';

// Sanitize configured base to origin only (strip any path like /api or /api/chat)
let configuredBase = rawConfiguredBase;
try {
  if (configuredBase && /^(http|https):\/\//i.test(configuredBase)) {
    const parsed = new URL(configuredBase);
    const originOnly = parsed.origin; // e.g., https://finance-chatbot-api.onrender.com
    if (parsed.pathname && parsed.pathname !== '/' ) {
      console.warn('[API] VITE_API_URL contains a path (', parsed.pathname, '). Using origin only:', originOnly);
    }
    configuredBase = originOnly;
  }
} catch (e) {
  console.warn('[API] Invalid VITE_API_URL, falling back to default. Value:', configuredBase);
  configuredBase = '';
}

// In dev, use relative paths so Vite proxy handles requests; in prod, use configured or default remote
const apiBaseURL = isDev ? '' : (configuredBase || defaultRemote);
// Ensure the URL doesn't have a trailing slash for consistency (no-op for empty string)
const normalizedBaseURL = apiBaseURL && apiBaseURL.endsWith('/') ? apiBaseURL.slice(0, -1) : apiBaseURL;

// Log the actual API URL being used
console.log('API Service initialized with base URL:', normalizedBaseURL || '(relative via dev proxy)');

const api = axios.create({
  baseURL: normalizedBaseURL, // '' in dev -> relative requests
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
    const fullUrl = `${config.baseURL || ''}${config.url}`;
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
      
      const baseForCheck = error.config?.baseURL || '';
      if (baseForCheck.includes('render.com') || isDev) {
        console.warn('No response from API. On Render.com free tier, the service may be in sleep mode and take 1-3 minutes to wake up.');
      }
    } else {
      console.error('API request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Test multiple connection paths (runs once on import)
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
    api.get(endpoint, { timeout: 20000 })
      .then(response => {
        console.log(`Connection test to ${endpoint} successful:`, response.data);
      })
      .catch(error => {
        console.warn(`Connection test to ${endpoint} failed:`, error.message);
      });
  });
};

// Run the test immediately
try { testConnection(); } catch (_) { /* ignore */ }

export default api;
