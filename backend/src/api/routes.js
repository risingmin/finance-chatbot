const express = require('express');
const router = express.Router();
const llamaService = require('../services/llamaService');
const financeService = require('../services/financeService');
const config = require('../config');

// Ensure we're using the right model everywhere
const MODEL_NAME = llamaService.MODEL_NAME || config.MODEL_NAME;

// Route for handling chat interactions
router.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        
        if (!userMessage) {
            return res.status(400).json({ error: 'Message is required' });
        }
        
        console.log(`Processing chat request with model: ${MODEL_NAME}`);
        console.log(`User message: "${userMessage}"`);
        
        // Check API key before making request
        if (!process.env.TOGETHER_API_KEY && !config.LLM_API_KEY) {
            console.error('⚠️ API KEY MISSING - Please set TOGETHER_API_KEY in environment variables ⚠️');
            return res.status(500).json({ 
                error: 'Server configuration error: Missing API key',
                details: 'The TOGETHER_API_KEY environment variable is not set'
            });
        }
        
        const response = await llamaService.getResponse(userMessage);
        res.json({ response });
    } catch (error) {
        console.error('Error in /chat route:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

// Route for getting finance data
router.get('/finance', async (req, res) => {
    try {
        const financeData = await financeService.getFinanceData();
        res.json(financeData);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching finance data.' });
    }
});

module.exports = router;