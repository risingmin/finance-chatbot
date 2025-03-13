import axios from 'axios';

const api = axios.create({
  baseURL: 'https://finance-chatbot-api.onrender.com',
});

export default api;
