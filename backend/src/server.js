require('dotenv').config();

const express = require('express');
const cors = require('cors');
const routes = require('./api/routes');
const llmConfig = require('./config/llmConfig');

const app = express();
const PORT = process.env.PORT || 8000;
const ALLOWED_ORIGINS = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173').split(',').map(s => s.trim());

// ============================================
// MIDDLEWARE
// ============================================

// CORS configuration
app.use(cors({
  origin: ALLOWED_ORIGINS,
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n🔵 [${timestamp}] ${req.method} ${req.path}`);
  if (req.method === 'POST' && req.body) {
    console.log(`   Body: ${JSON.stringify(req.body).substring(0, 100)}${JSON.stringify(req.body).length > 100 ? '...' : ''}`);
  }
  next();
});

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('✅ GET /health - Health check passed');
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m`,
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    llmProvider: process.env.LLM_PROVIDER || 'ollama'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  console.log('✅ GET / - API is running');
  res.json({ 
    message: 'Finance Chatbot API is running!',
    environment: process.env.NODE_ENV || 'development',
    llmProvider: process.env.LLM_PROVIDER || 'ollama',
    endpoints: {
      health: '/health',
      chat: '/api/chat',
      testLLM: '/api/test-llm',
      finance: '/api/finance'
    },
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api', routes);

// ============================================
// ERROR HANDLERS
// ============================================

// 404 handler (before error handler)
app.use((req, res) => {
  console.error(`❌ 404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: [
      'GET  /',
      'GET  /health',
      'POST /api/chat',
      'GET  /api/test-llm',
      'GET  /api/finance'
    ]
  });
});

// Centralized error handling middleware
// Must be last - Express requires 4 parameters (err, req, res, next)
app.use((err, req, res, next) => {
  // Log the full error with context
  const timestamp = new Date().toISOString();
  console.error(`\n❌ [${timestamp}] Error Handler Triggered`);
  console.error(`   Route: ${req.method} ${req.path}`);
  console.error(`   Error Type: ${err.name || 'Unknown'}`);
  console.error(`   Message: ${err.message}`);
  
  // Log stack trace in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`   Stack: ${err.stack}`);
  }
  
  // Determine status code
  const status = err.status || err.statusCode || 500;
  
  // Build error response
  const errorResponse = {
    error: err.code || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'Something went wrong on the server',
    timestamp: new Date().toISOString()
  };

  // Include error details only in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.details = err.details || err.stack?.substring(0, 200);
  }

  // Log response status
  console.error(`   Response Status: ${status}`);
  
  res.status(status).json(errorResponse);
});

// ============================================
// SERVER START
// ============================================

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 Finance Chatbot Backend Started');
  console.log('='.repeat(50));
  console.log(`📍 Port: ${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🤖 LLM Provider: ${process.env.LLM_PROVIDER || 'ollama'}`);
  console.log(`🌐 CORS Origins: ${ALLOWED_ORIGINS.join(', ')}`);
  console.log('\n📋 Available Endpoints:');
  console.log(`   GET  /              - API info & health`);
  console.log(`   GET  /health        - Health check`);
  console.log(`   POST /api/chat      - Chat with LLM`);
  console.log(`   GET  /api/test-llm  - Test LLM connection`);
  console.log(`   GET  /api/finance   - Finance data`);
  console.log('='.repeat(50) + '\n');
});

module.exports = app;