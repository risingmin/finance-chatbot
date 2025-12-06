const express = require('express');
const router = express.Router();
const llamaService = require('../services/llamaService');
const financeService = require('../services/financeService');
const { validateChatRequest } = require('../utils/validators');

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const validationError = validateChatRequest(req);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const { message } = req.body;
    const reply = await llamaService.getResponse(message);
    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error.message);
    const status = error.response?.status || 500;
    res.status(status).json({ error: 'Failed to process message', details: error.message });
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