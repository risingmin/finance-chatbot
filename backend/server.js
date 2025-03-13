const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // Using port 3000 instead of 5000

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:5173', // Default Vite dev server port
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
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