import axios from 'axios';

const api = axios.create({
  baseURL: 'https://finance-chatbot-api.onrender.com',
});

// Add a response interceptor to log errors
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API request error:', error);
    return Promise.reject(error);
  }
);

// Test request to check connection
api.get('/test')
  .then(response => {
    console.log('Test request successful:', response.data);
  })
  .catch(error => {
    console.error('Test request failed:', error);
  });

export default api;
