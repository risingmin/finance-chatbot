// Add dotenv at the top to load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const routes = require('./api/routes');
const config = require('./config');

// Define the model name as a constant at the top level for consistent use throughout the app
const DEEPSEEK_MODEL = "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free";

const app = express();

// Log environment settings for debugging
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);KEY || config.LLM_API_KEY;
console.log('API Keys available:', !!process.env.OPENAI_API_KEY);console.log('API Keys available (OpenAI):', !!process.env.OPENAI_API_KEY);
console.log('API Keys available (Together):', !!process.env.TOGETHER_API_KEY);', !!togetherApiKey);
console.log('Using LLM model:', DEEPSEEK_MODEL);odel:', DEEPSEEK_MODEL);

// Configure CORS - handle multiple originsins
const allowedOrigins = [nst allowedOrigins = [
  'http://localhost:3000',  'http://localhost:3000',
  'https://finance-chatbot.onrender.com'
];

// If FRONTEND_URL env variable exists, add it to allowed origins/ If FRONTEND_URL env variable exists, add it to allowed origins
if (process.env.FRONTEND_URL) {if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// Enhanced CORS configuration with explicit OPTIONS handling
app.use(cors({
  origin: function(origin, callback) {igin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)e apps, curl requests)
    if (!origin) return callback(null, true);ull, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else { else {
      console.log('Blocked by CORS. Origin:', origin);  console.log('Blocked by CORS. Origin:', origin);
      return callback(null, true); // Temporarily allow all origins while debuggingTemporarily allow all origins while debugging
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],'OPTIONS'],
  credentials: true,edentials: true,
  preflightContinue: false,  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle OPTIONS requests explicitlyts explicitly
app.options('*', cors());app.options('*', cors());

app.use(express.json());

// Add request logging middlewareare
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);onsole.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.method === 'POST') {.method === 'POST') {
    console.log('Request body:', JSON.stringify(req.body)); console.log('Request body:', JSON.stringify(req.body));
  }  }
  next();
});

// Add a simple health check endpointAdd a simple health check endpoint
app.get('/health', (req, res) => {app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Add a debug endpoint to test core functionalityre functionality
app.get('/api/debug', (req, res) => { (req, res) => {
  try {
    // Check environment variablesables
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,PORT: process.env.PORT,
      // Add other important environment variables your app uses  // Add other important environment variables your app uses
      // API_KEY: process.env.API_KEY ? 'Set' : 'Not set',EY: process.env.API_KEY ? 'Set' : 'Not set',
    };
    
    res.json({
      status: 'ok',
      environment: envVars,,
      config: {
        // Include non-sensitive config values // Include non-sensitive config values
        port: config.port, port: config.port,
        // Don't include API keys or secretsinclude API keys or secrets
      }
    });
  } catch (err) {
    console.error('Debug endpoint error:', err);ndpoint error:', err);
    res.status(500).json({.status(500).json({
      error: 'Debug endpoint failed',   error: 'Debug endpoint failed',
      message: err.message   message: err.message
    });    });
  }
});

// Create a more robust fallback chat handler with extra debuggingk chat handler with extra debugging
app.post('/api/chat-direct', async (req, res) => {
  try {y {
    // Log the incoming request
    console.log('Direct chat request received:', JSON.stringify(req.body));ived:', JSON.stringify(req.body));
    
    // Check if the request contains a message/ Check if the request contains a message
    if (!req.body || !req.body.message) {if (!req.body || !req.body.message) {
      return res.status(400).json({ error: 'Message is required' });required' });
    }
    
    // Check if we have essential environment variablesvironment variables
    if (!process.env.OPENAI_API_KEY) {
      console.error('ERROR: Missing OPENAI_API_KEY environment variable');;
      return res.status(500).json({ urn res.status(500).json({ 
        error: 'Server configuration error: Missing API key',   error: 'Server configuration error: Missing API key',
        fixInstructions: 'Please set OPENAI_API_KEY environment variable'    fixInstructions: 'Please set OPENAI_API_KEY environment variable'
      });
    }
    
    // Return a static response for now
    return res.json({urn res.json({
      response: `Echo: ${req.body.message}`,ho: ${req.body.message}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Direct chat handler error:', error);t handler error:', error);
    return res.status(500).json({ 
      error: 'Chat handler error', rror: 'Chat handler error', 
      details: error.message,   details: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined   stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });    });
  }
});

// Add a fallback chat handler in case the main one is failingin case the main one is failing
app.post('/api/chat-fallback', (req, res) => {
  try {y {
    // Log the incoming request
    console.log('Chat fallback request body:', req.body);dy:', req.body);
    
    // Check if the request contains a message/ Check if the request contains a message
    if (!req.body || !req.body.message) {if (!req.body || !req.body.message) {
      return res.status(400).json({ error: 'Message is required' });on({ error: 'Message is required' });
    }
    
    // Return a simple response
    return res.json({
      message: "This is a fallback response. The main chat API is currently unavailable.",essage: "This is a fallback response. The main chat API is currently unavailable.",
      received: req.body.message,.body.message,
      timestamp: new Date().toISOString()
    });
  } catch (error) { catch (error) {
    console.error('Error in fallback chat handler:', error); console.error('Error in fallback chat handler:', error);
    return res.status(500).json({ error: 'Fallback handler error: ' + error.message });    return res.status(500).json({ error: 'Fallback handler error: ' + error.message });
  }
});

// Update LLM test endpoint to specifically check for DeepSeek model
app.post('/api/llm-test', async (req, res) => {post('/api/llm-test', async (req, res) => {
  try {
    console.log('LLM test request received:', JSON.stringify(req.body));d:', JSON.stringify(req.body));
    
    // Check if the request contains a message/ Check if the request contains a message
    if (!req.body || !req.body.message) {if (!req.body || !req.body.message) {
      return res.status(400).json({ error: 'Message is required' });error: 'Message is required' });
    }
    
    // Use the global model constant
    console.log(`Testing with model: ${DEEPSEEK_MODEL}`);L}`);
    
    // Log all available environment variables (redacted for security)
    console.log('Environment variables available:');
    Object.keys(process.env).forEach(key => {ect.keys(process.env).forEach(key => {
      if (key.includes('API') || key.includes('KEY') || key.includes('SECRET') || key.includes('MODEL')) {f (key.includes('API') || key.includes('KEY') || key.includes('SECRET') || key.includes('MODEL')) {
        console.log(`${key}: ${key.length > 0 ? '[SET]' : '[NOT SET]'}`);    console.log(`${key}: ${key.length > 0 ? '[SET]' : '[NOT SET]'}`);
      }
    });
    
    // Check if we have essential environment variables for Together.aivironment variables for Together.ai
    if (!process.env.TOGETHER_API_KEY) {
      console.error('ERROR: Missing TOGETHER_API_KEY environment variable');;
      return res.status(500).json({ urn res.status(500).json({ 
        error: 'Server configuration error: Missing Together.ai API key',   error: 'Server configuration error: Missing Together.ai API key',
        fixInstructions: 'Please set TOGETHER_API_KEY environment variable'    fixInstructions: 'Please set TOGETHER_API_KEY environment variable'
      });
    }
    
    // Return information about the configurationout the configuration
    return res.json({
      message: "LLM test endpoint",endpoint",
      model: DEEPSEEK_MODEL,
      receivedMessage: req.body.message,ceivedMessage: req.body.message,
      apiKeysAvailable: {
        together: !!process.env.TOGETHER_API_KEY together: !!process.env.TOGETHER_API_KEY
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('LLM test endpoint error:', error);ndpoint error:', error);
    return res.status(500).json({ 
      error: 'LLM test failed', rror: 'LLM test failed', 
      details: error.message,   details: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined   stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });    });
  }
});

// Add a DeepSeek model test endpoint
app.post('/api/deepseek-test', async (req, res) => {post('/api/deepseek-test', async (req, res) => {
  try {
    console.log('DeepSeek test request received:', JSON.stringify(req.body));q.body));
    
    if (!req.body || !req.body.message) {if (!req.body || !req.body.message) {
      return res.status(400).json({ error: 'Message is required' });error: 'Message is required' });
    }
    
    // Check for Together.ai API key
    if (!process.env.TOGETHER_API_KEY) {
      console.error('ERROR: Missing TOGETHER_API_KEY environment variable');iable');
      return res.status(500).json({ urn res.status(500).json({ 
        error: 'Missing Together.ai API key',   error: 'Missing Together.ai API key',
        fixInstructions: 'Set TOGETHER_API_KEY environment variable'    fixInstructions: 'Set TOGETHER_API_KEY environment variable'
      });
    }
    
    // Log that we're using the DeepSeek model
    console.log(`Using model: ${DEEPSEEK_MODEL}`);g model: ${DEEPSEEK_MODEL}`);
    
    // For testing without actually making API calls
    return res.json({{
      model: DEEPSEEK_MODEL,EL,
      message: `Model would process: "${req.body.message}"`,ld process: "${req.body.message}"`,
      modelConfig: {
        temperature: 0.7, temperature: 0.7,
        max_tokens: 1024, max_tokens: 1024,
        model: DEEPSEEK_MODEL    model: DEEPSEEK_MODEL
      }
    });
    
    /* 
    // Implementation example for Together.ai API (uncomment and adapt as needed)ation example for Together.ai API (uncomment and adapt as needed)
    const response = await fetch('https://api.together.xyz/v1/completions', {pi.together.xyz/v1/completions', {
      method: 'POST',
      headers: {aders: {
        'Content-Type': 'application/json',lication/json',
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`er ${process.env.TOGETHER_API_KEY}`
      },
      body: JSON.stringify({y({
        model: DEEPSEEK_MODEL,MODEL,
        prompt: req.body.message,prompt: req.body.message,
        max_tokens: 1024, max_tokens: 1024,
        temperature: 0.7    temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json(); const errorData = await response.json();
      console.error('Together API error:', errorData);  console.error('Together API error:', errorData);
      throw new Error(`API error: ${response.status} ${response.statusText}`);ponse.status} ${response.statusText}`);
    }
    
    const data = await response.json();ait response.json();
    return res.json(data);
    */
  } catch (error) {
    console.error('DeepSeek test endpoint error:', error);est endpoint error:', error);
    return res.status(500).json({ 
      error: 'DeepSeek test failed', rror: 'DeepSeek test failed', 
      details: error.message,   details: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined   stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });    });
  }
});

// IMPORTANT: Check if routes module is properly loaded
console.log('Routes module loaded:', !!routes);onsole.log('Routes module loaded:', !!routes);
if (typeof routes !== 'function' && !routes.stack) {if (typeof routes !== 'function' && !routes.stack) {
  console.error('WARNING: routes module does not appear to be a valid Express router');tes module does not appear to be a valid Express router');
}

// Use routes from api/routes
app.use('/api', (req, res, next) => {
  try {
    // Check if routes is a valid routerr
    if (typeof routes !== 'function') {
      console.error('Routes is not a function. Type:', typeof routes);ypeof routes);
      if (typeof routes === 'object') {
        console.log('Routes object keys:', Object.keys(routes));ject.keys(routes));
        // Add model to routes object if it's used there/ Add model to routes object if it's used there
        if (typeof routes === 'object') { if (typeof routes === 'object') {
          routes.MODEL_NAME = DEEPSEEK_MODEL;
        }   }
      }
      throw new Error('Invalid routes configuration');lid routes configuration');
    }
    console.log(`Routing request to /api${req.path}`);
    routes(req, res, next);, res, next);
  } catch (err) { catch (err) {
    console.error('Error in routes middleware:', err); console.error('Error in routes middleware:', err);
    next(err);    next(err);
  }
});

// Enhanced error handling
app.use((err, req, res, next) => {
  console.error('ERROR OCCURRED:');
  console.error('Request path:', req.path););
  console.error('Request method:', req.method);
  console.error('Request body:', req.body);
  console.error('Error name:', err.name);console.error('Error name:', err.name);
  console.error('Error message:', err.message);sage);
  console.error('Error stack:', err.stack);
  
  let statusCode = err.statusCode || 500;
  let errorMessage = process.env.NODE_ENV === 'production' let errorMessage = process.env.NODE_ENV === 'production' 
    ? 'An error occurred while processing your request.' 
    : err.message || 'Something went wrong!';
  
  // Set CORS headers directly on error responses to ensure they're present
  res.header('Access-Control-Allow-Origin', '*');res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');ow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');trol-Allow-Headers', 'Content-Type, Authorization');
  
  res.status(statusCode).json({ 
    error: errorMessage,,
    // Include more details in non-production environmentsdetails in non-production environments
    ...(process.env.NODE_ENV !== 'production' && { .(process.env.NODE_ENV !== 'production' && { 
      stack: err.stack, stack: err.stack,
      name: err.name   name: err.name
    })    })
  });
});

// Catch-all handler for undefined routesCatch-all handler for undefined routes
app.use((req, res) => {app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const port = process.env.PORT || config.port || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);onsole.log(`Server running on port ${port}`);



});  console.log(`Using model: ${DEEPSEEK_MODEL}`);  console.log(`Available endpoints: /health, /api/debug, /api/chat, /api/chat-direct, /api/chat-fallback, /api/deepseek-test`);  console.log(`Available endpoints: /health, /api/debug, /api/chat, /api/chat-direct, /api/chat-fallback, /api/deepseek-test`);
  console.log(`Using model: ${DEEPSEEK_MODEL}`);
});