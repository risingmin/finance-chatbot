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
  credentials: true
}));

app.use(express.json());

// Add a simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', routes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const port = process.env.PORT || config.port || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});