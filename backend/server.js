const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // Using port 3000 instead of 5000

// Enable CORS for frontend
// Example backend CORS configuration (needs to be updated)
app.use(cors({
  origin: ['http://localhost:3000', 'https://finance-chatbot.onrender.com'],
  methods: ['GET', 'POST'],
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});