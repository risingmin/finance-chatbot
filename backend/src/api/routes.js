const express = require('express');
const router = express.Router();
const llamaService = require('../services/llamaService');
const financeService = require('../services/financeService');

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const response = await llamaService.getResponse(message);
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Finance data endpoint
router.get('/finance', async (req, res) => {
  try {
    const financeData = await financeService.getFinanceData();
    res.json(financeData);
  } catch (error) {
    console.error('Finance error:', error.message);
    res.status(500).json({ error: 'Failed to fetch finance data' });
  }
});

// Test Gemini API endpoint
router.get('/test-gemini', async (req, res) => {
  try {
    const testResponse = await llamaService.getResponse('Hello, can you say hi back?');
    res.json({ 
      success: true, 
      message: 'Gemini API is working!',
      response: testResponse 
    });
  } catch (error) {
    console.error('Gemini test error:', error.message);
    res.status(500).json({ 
      error: 'Gemini API test failed', 
      details: error.message 
    });
  }
});

module.exports = router;