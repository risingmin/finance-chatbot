const express = require('express');
const router = express.Router();
const llamaService = require('../services/llamaService');
const financeService = require('../services/financeService');

// Route for handling chat interactions
router.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        const response = await llamaService.getResponse(userMessage);
        res.json({ response });
    } catch (error) {
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