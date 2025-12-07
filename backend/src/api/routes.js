const express = require('express');
const router = express.Router();
const llamaService = require('../services/llamaService');
const financeService = require('../services/financeService');
const { validateChatRequest } = require('../utils/validators');

/**
 * POST /api/chat
 * 
 * Chat endpoint. Expects JSON body with messages array:
 *   { "messages": [{ "role": "user", "content": "text" }, ...] }
 * 
 * Returns on success:
 *   { "success": true, "reply": "assistant response text" }
 * 
 * Returns on error:
 *   { "error": "error code", "message": "human readable message" }
 */
router.post('/chat', async (req, res, next) => {
  try {
    const { messages } = req.body;

    // Validate messages array
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.warn('⚠️  POST /api/chat - Invalid request: messages array is required');
      return res.status(400).json({
        error: 'INVALID_REQUEST',
        message: 'messages array is required and must not be empty'
      });
    }

    // Log the incoming message (last one in array)
    const lastMessage = messages[messages.length - 1];
    const truncated = lastMessage.content?.length > 100 
      ? lastMessage.content.substring(0, 100) + '...' 
      : lastMessage.content || '(empty)';
    console.log(`✅ POST /api/chat - Received message from ${lastMessage.role}: "${truncated}"`);
    
    // Call the LLM service with the full messages array
    const reply = await llamaService.getResponseWithMessages(messages);
    console.log(`✅ POST /api/chat - Response generated (${reply.length} chars)`);
    
    // Return successful JSON response
    res.status(200).json({ 
      success: true,
      reply: reply 
    });
  } catch (error) {
    // Log error and pass to error handler middleware
    console.error(`❌ POST /api/chat - Error: ${error.message}`);
    next(error);
  }
});

/**
 * GET /api/finance
 * Fetch financial data or context
 */
router.get('/finance', async (req, res, next) => {
  try {
    const financeData = await financeService.getFinanceData();
    res.json(financeData);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/test-llm
 * Test endpoint to verify LLM connectivity
 */
router.get('/test-llm', async (req, res, next) => {
  try {
    const testMessage = 'Say "Hello! I am working correctly." in exactly those words.';
    const response = await llamaService.getResponse(testMessage);
    res.json({
      success: true,
      message: 'LLM is working!',
      response
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;