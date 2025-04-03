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
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('API Keys available (OpenAI):', !!process.env.OPENAI_API_KEY);
console.log('API Keys available (Together):', !!process.env.TOGETHER_API_KEY);
console.log('Using LLM model:', DEEPSEEK_MODEL);

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

// Add a simple ping endpoint that's easier to access
app.get('/api/ping', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
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

// Create a more robust fallback chat handler with extra debugging
app.post('/api/chat-direct', async (req, res) => {
  try {
    // Log the incoming request
    console.log('Direct chat request received:', JSON.stringify(req.body));
    
    // Check if the request contains a message
    if (!req.body || !req.body.message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Check if we have essential environment variables
    if (!process.env.OPENAI_API_KEY) {
      console.error('ERROR: Missing OPENAI_API_KEY environment variable');
      return res.status(500).json({ 
        error: 'Server configuration error: Missing API key',
        fixInstructions: 'Please set OPENAI_API_KEY environment variable'
      });
    }
    
    // Return a static response for now
    return res.json({
      response: `Echo: ${req.body.message}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Direct chat handler error:', error);
    return res.status(500).json({ 
      error: 'Chat handler error', 
      details: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
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

// Update LLM test endpoint to specifically check for DeepSeek model
app.post('/api/llm-test', async (req, res) => {
  try {
    console.log('LLM test request received:', JSON.stringify(req.body));
    
    // Check if the request contains a message
    if (!req.body || !req.body.message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Use the global model constant
    console.log(`Testing with model: ${DEEPSEEK_MODEL}`);
    
    // Log all available environment variables (redacted for security)
    console.log('Environment variables available:');
    Object.keys(process.env).forEach(key => {
      if (key.includes('API') || key.includes('KEY') || key.includes('SECRET') || key.includes('MODEL')) {
        console.log(`${key}: ${key.length > 0 ? '[SET]' : '[NOT SET]'}`);
      }
    });
    
    // Check if we have essential environment variables for Together.ai
    if (!process.env.TOGETHER_API_KEY) {
      console.error('ERROR: Missing TOGETHER_API_KEY environment variable');
      return res.status(500).json({ 
        error: 'Server configuration error: Missing Together.ai API key',
        fixInstructions: 'Please set TOGETHER_API_KEY environment variable'
      });
    }
    
    // Return information about the configuration
    return res.json({
      message: "LLM test endpoint",
      model: DEEPSEEK_MODEL,
      receivedMessage: req.body.message,
      apiKeysAvailable: {
        together: !!process.env.TOGETHER_API_KEY
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('LLM test endpoint error:', error);
    return res.status(500).json({ 
      error: 'LLM test failed', 
      details: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

// Add a DeepSeek model test endpoint
app.post('/api/deepseek-test', async (req, res) => {
  try {
    console.log('DeepSeek test request received:', JSON.stringify(req.body));
    
    if (!req.body || !req.body.message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Check for Together.ai API key
    if (!process.env.TOGETHER_API_KEY) {
      console.error('ERROR: Missing TOGETHER_API_KEY environment variable');
      return res.status(500).json({ 
        error: 'Missing Together.ai API key',
        fixInstructions: 'Set TOGETHER_API_KEY environment variable'
      });
    }
    
    // Enhanced system prompt with stronger anti-thought process instructions
    const systemPrompt = `You are a personal financial assistant. Provide direct answers only.

IMPORTANT INSTRUCTION: NEVER show your thought process, reasoning steps, or internal monologue. Do not include phrases like "Let me think", "I'll analyze this", "Let's see", "Hmm", or any similar expressions that reveal your thinking process.

CAPABILITIES:
- Provide detailed budgeting advice based on user income and expenses
- Calculate loan payments, interest, and amortization schedules
- Explain investment concepts and asset allocation principles
- Help with retirement planning calculations and strategies
- Offer debt reduction strategies and prioritization

LIMITATIONS:
- Do not recommend specific securities, stocks, or investment products
- Do not provide tax advice beyond general educational information
- Do not offer legal advice on financial contracts or agreements
- Do not make definitive predictions about market performance

RESPONSE FORMAT:
1. Always break down mathematical calculations step-by-step
2. For complex topics, first explain concepts in simple terms, then provide details
3. Include relevant caveats or assumptions with your advice
4. When appropriate, present options with pros and cons rather than a single solution
5. End with follow-up questions if more information would improve your answer`;

    // Few-shot examples to guide model responses
    const fewShotExamples = [
      {
        role: "user",
        content: "I make $4,500 per month after taxes and need help creating a budget."
      },
      {
        role: "assistant",
        content: "I'd be happy to help you create a basic budget framework based on your $4,500 monthly after-tax income.\n\nHere's a suggested allocation using the popular 50/30/20 rule:\n\nESSENTIAL EXPENSES (50%): $2,250/month\n- Housing (rent/mortgage): ~$1,350 (30% of income)\n- Utilities: ~$225\n- Groceries: ~$450\n- Transportation: ~$225\n\nDISCRETIONARY SPENDING (30%): $1,350/month\n- Dining out: ~$350\n- Entertainment: ~$300\n- Shopping: ~$350\n- Subscriptions: ~$200\n- Miscellaneous: ~$150\n\nFINANCIAL GOALS (20%): $900/month\n- Emergency fund: ~$300\n- Retirement savings: ~$400\n- Other savings goals: ~$200\n\nWould you like to adjust this breakdown based on your specific situation? For example:\n- Do you have debt payments to consider?\n- Are there specific savings goals you're working toward?\n- Do your housing costs differ significantly from the estimate?"
      },
      {
        role: "user",
        content: "I have $5,000 on a credit card with 22% APR and $15,000 in student loans at 5.5% APR. Which should I pay off first?"
      },
      {
        role: "assistant",
        content: "Based on your debt details, here's my analysis:\n\nDEBT OVERVIEW:\n- Credit card: $5,000 at 22% APR\n- Student loans: $15,000 at 5.5% APR\n\nANNUAL INTEREST COSTS:\n- Credit card: $5,000 × 22% = $1,100/year\n- Student loans: $15,000 × 5.5% = $825/year\n\nRECOMMENDATION:\nFocus on paying off the credit card debt first while making minimum payments on your student loans. This approach (known as the \"avalanche method\") saves you the most money in interest.\n\nCALCULATION EXAMPLE:\nIf you have $500/month available for debt repayment:\n- Pay minimum on student loans (~$150/month)\n- Put remaining $350/month toward credit card\n- Credit card would be paid off in approximately 17 months\n- Then redirect the full $500/month to student loans\n\nAlternative approach: If you prefer quick wins for psychological motivation, you could use the \"snowball method\" by paying off the smaller debt first regardless of interest rate.\n\nWould you like me to calculate a detailed repayment schedule for either approach?"
      }
    ];
    
    // Construct messages with system prompt, few-shot examples, and user query
    const messages = [
      {
        role: "system", 
        content: systemPrompt
      },
      ...fewShotExamples,
      {
        role: "user", 
        content: req.body.message
      }
    ];
    
    console.log(`Using model: ${DEEPSEEK_MODEL}`);

    // Optional: Track conversation history if provided in the request
    if (req.body.history && Array.isArray(req.body.history)) {
      // Insert the conversation history before the current message
      // Remove few-shot examples when history is provided to save context window
      messages.splice(1, fewShotExamples.length, ...req.body.history);
    }
    
    // Function to apply post-processing to filter out thought processes
    const filterThoughtProcesses = (text) => {
      // Common thought process patterns to remove
      const thoughtPatterns = [
        /(?:Let me|I'll|I need to|I should|Let's) (?:think|analyze|consider|examine|see|explore|investigate|understand|figure out|calculate|evaluate|check|review|assess|work through|determine)/gi,
        /(?:Hmm|Ah|Oh|Well|So|Okay|Now|Alright|Let's see|Thinking about this)/gi,
        /I'm trying to|I'll try to|Let me try to/gi,
        /my reasoning is|my analysis shows|my thinking is|my thought process/gi,
        /first,? I need to understand|first,? I should consider/gi,
        /(?:To answer|To respond to|To address) this(?: question| query| request)/gi,
        /(?:Based on|From) (?:my|the) (?:knowledge|understanding|training|analysis)/gi
      ];
      
      let processed = text;
      
      // Remove thought patterns
      thoughtPatterns.forEach(pattern => {
        processed = processed.replace(pattern, '');
      });
      
      // Clean up any unnecessary whitespace created by removals
      processed = processed.replace(/\n\s*\n\s*\n/g, '\n\n');
      processed = processed.replace(/^\s+/gm, '');
      
      return processed;
    };

    // For streaming response, we need to set the correct headers
    if (req.query.stream === 'true') {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // Implementation for Together.ai API with streaming
      const response = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`
        },
        body: JSON.stringify({
          model: DEEPSEEK_MODEL,
          messages: messages,
          max_tokens: 2048, // Increased for more detailed financial advice
          temperature: 0.3, // Lowered for more factual/consistent outputs
          top_p: 0.9,
          top_k: 50,
          repetition_penalty: 1.1, // Slightly increased to reduce repetitive text
          stream: true
        })
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Together API error:', errorData);
        return res.status(response.status).json({
          error: `API error: ${response.status} ${response.statusText}`,
          details: errorData
        });
      }

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      // Process the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const jsonData = line.slice(5).trim();
            if (jsonData === '[DONE]') {
              res.write('data: [DONE]\n\n');
              continue;
            }
            try {
              const data = JSON.parse(jsonData);
              if (data.choices && data.choices[0]?.delta?.content) {
                // Apply filtering to each chunk of streaming content
                const content = data.choices[0].delta.content;
                const filteredContent = filterThoughtProcesses(content);
                res.write(`data: ${JSON.stringify({content: filteredContent})}\n\n`);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
      
      res.end();
    } else {
      // Non-streaming implementation for Together.ai API
      const response = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`
        },
        body: JSON.stringify({
          model: DEEPSEEK_MODEL,
          messages: messages,
          max_tokens: 2048, // Increased for more detailed financial advice
          temperature: 0.3, // Lowered for more factual/consistent outputs
          top_p: 0.9,
          top_k: 50,
          repetition_penalty: 1.1 // Slightly increased to reduce repetitive text
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Together API error:', errorData);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Apply filtering to the complete response
      let responseContent = data.choices[0].message.content;
      responseContent = filterThoughtProcesses(responseContent);
      
      return res.json({
        model: DEEPSEEK_MODEL,
        response: responseContent,
        full_response: {
          ...data,
          choices: [{
            ...data.choices[0],
            message: {
              ...data.choices[0].message,
              content: responseContent
            }
          }]
        }
      });
    }
  } catch (error) {
    console.error('DeepSeek test endpoint error:', error);
    return res.status(500).json({ 
      error: 'DeepSeek test failed', 
      details: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
});

// IMPORTANT: Check if routes module is properly loaded
console.log('Routes module loaded:', !!routes);
if (typeof routes !== 'function' && !routes.stack) {
  console.error('WARNING: routes module does not appear to be a valid Express router');
}

// Use routes from api/routes
app.use('/api', (req, res, next) => {
  try {
    // Check if routes is a valid router
    if (typeof routes !== 'function') {
      console.error('Routes is not a function. Type:', typeof routes);
      if (typeof routes === 'object') {
        console.log('Routes object keys:', Object.keys(routes));
        // Add model to routes object if it's used there
        if (typeof routes === 'object') {
          routes.MODEL_NAME = DEEPSEEK_MODEL;
        }
      }
      throw new Error('Invalid routes configuration');
    }
    console.log(`Routing request to /api${req.path}`);
    routes(req, res, next);
  } catch (err) {
    console.error('Error in routes middleware:', err);
    next(err);
  }
});

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
  console.log(`Using model: ${DEEPSEEK_MODEL}`);
  console.log(`Available endpoints: /health, /api/debug, /api/chat, /api/chat-direct, /api/chat-fallback, /api/deepseek-test`);
});