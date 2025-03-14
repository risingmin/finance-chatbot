const express = require('express');
const cors = require('cors');
const routes = require('./api/routes');
const config = require('./config');

const app = express();

// Log environment settings for debugging
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

// Configure CORS - handle multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://finance-chatbot.onrender.com'
];

// If FRONTEND_URL env variable exists, add it to allowed origins
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// Enhanced CORS configuration with explicit OPTIONS handling
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      console.log('Blocked by CORS. Origin:', origin);
      return callback(null, true); // Temporarily allow all origins while debugging
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle OPTIONS requests explicitly
app.options('*', cors());

app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.method === 'POST') {
    console.log('Request body:', JSON.stringify(req.body));
  }
  next();
});

// Add a simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Add a debug endpoint to test core functionality
app.get('/api/debug', (req, res) => {
  try {
    // Check environment variables
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      // Add other important environment variables your app uses
      // API_KEY: process.env.API_KEY ? 'Set' : 'Not set',
    };
    
    res.json({
      status: 'ok',
      environment: envVars,
      config: {
        // Include non-sensitive config values
        port: config.port,
        // Don't include API keys or secrets
      }
    });
  } catch (err) {
    console.error('Debug endpoint error:', err);
    res.status(500).json({
      error: 'Debug endpoint failed',
      message: err.message
    });
  }
});

// Add a fallback chat handler in case the main one is failing
app.post('/api/chat-fallback', (req, res) => {
  try {
    // Log the incoming request
    console.log('Chat fallback request body:', req.body);
    
    // Check if the request contains a message
    if (!req.body || !req.body.message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Return a simple response
    return res.json({
      message: "This is a fallback response. The main chat API is currently unavailable.",
      received: req.body.message,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in fallback chat handler:', error);
    return res.status(500).json({ error: 'Fallback handler error: ' + error.message });
  }
});

// Use routes from api/routes
app.use('/api', routes);

// Enhanced error handling
app.use((err, req, res, next) => {
  console.error('ERROR OCCURRED:');
  console.error('Request path:', req.path);
  console.error('Request method:', req.method);
  console.error('Request body:', req.body);
  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  console.error('Error stack:', err.stack);
  
  let statusCode = err.statusCode || 500;
  let errorMessage = process.env.NODE_ENV === 'production' 
    ? 'An error occurred while processing your request.' 
    : err.message || 'Something went wrong!';
  
  // Set CORS headers directly on error responses to ensure they're present
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  res.status(statusCode).json({ 
    error: errorMessage,
    // Include more details in non-production environments
    ...(process.env.NODE_ENV !== 'production' && { 
      stack: err.stack,
      name: err.name
    })
  });
});

// Catch-all handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const port = process.env.PORT || config.port || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});