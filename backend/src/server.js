require('dotenv').config();

const express = require('express');
const cors = require('cors');
const routes = require('./api/routes');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://finance-chatbot.onrender.com'],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m`,
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 'not set'
  });
});

// Root endpoint for Render
app.get('/', (req, res) => {
  res.json({ 
    message: 'Finance Chatbot API is running!',
    endpoints: {
      health: '/health',
      chat: '/api/chat',
      testGemini: '/api/test-gemini',
      finance: '/api/finance'
    },
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api', routes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 Gemini API Key available: ${!!process.env.GEMINI_API_KEY}`);
  console.log(`🌐 CORS origins: ${JSON.stringify(['http://localhost:3000', 'https://finance-chatbot.onrender.com'])}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   - GET  / (root)`);
  console.log(`   - GET  /health`);
  console.log(`   - POST /api/chat`);
  console.log(`   - GET  /api/test-gemini`);
  console.log(`   - GET  /api/finance`);
});

module.exports = app;