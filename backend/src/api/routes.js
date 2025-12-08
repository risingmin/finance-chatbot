const express = require('express');
const router = express.Router();
const llamaService = require('../services/llamaService');
const financeService = require('../services/financeService');
const chatOrchestrator = require('../services/chatOrchestrator');
const expenseService = require('../services/expenseService');
const summaryService = require('../services/summaryService');
const goalService = require('../services/goalService');
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
    const { messages, userId = 'demo-user' } = req.body;

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
    
    // Route to finance-aware handler first, then fall back to generic chat
    const { handled, reply } = await chatOrchestrator.handleChat(messages, userId);
    console.log(`✅ POST /api/chat - Response generated (${reply.length} chars) (handled=${handled})`);
    
    // Return successful JSON response
    res.status(200).json({ 
      success: true,
      reply,
      handled
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

// --------------------------------------------
// Expense capture endpoints
// --------------------------------------------
router.post('/transactions', async (req, res, next) => {
  try {
    const { inputText, message, userId = 'demo-user' } = req.body;
    const text = inputText || message;
    const txn = await expenseService.addExpenseFromText({ inputText: text, userId });
    res.status(201).json({ success: true, transaction: txn });
  } catch (error) {
    next(error);
  }
});

router.get('/transactions', async (req, res, next) => {
  try {
    const { userId = 'demo-user' } = req.query;
    const list = await expenseService.listExpenses(userId);
    res.json({ success: true, transactions: list });
  } catch (error) {
    next(error);
  }
});

// --------------------------------------------
// Summary endpoints
// --------------------------------------------
router.get('/summary', async (req, res, next) => {
  try {
    const { userId = 'demo-user', month, year } = req.query;
    const parsedMonth = month !== undefined ? Number(month) : undefined;
    const parsedYear = year !== undefined ? Number(year) : undefined;
    const summary = await summaryService.generateBudgetSummary(userId, parsedMonth, parsedYear);
    res.json({ success: true, summary });
  } catch (error) {
    next(error);
  }
});

// --------------------------------------------
// Goal endpoints
// --------------------------------------------
router.post('/goal', async (req, res, next) => {
  try {
    const { userId = 'demo-user', targetMonthlyAmount, targetAmount, deadline } = req.body;
    const goal = await goalService.setGoal(userId, { targetMonthlyAmount, targetAmount, deadline });
    res.status(201).json({ success: true, goal });
  } catch (error) {
    next(error);
  }
});

router.get('/goal', async (req, res, next) => {
  try {
    const { userId = 'demo-user' } = req.query;
    const goal = await goalService.getGoal(userId);
    res.json({ success: true, goal });
  } catch (error) {
    next(error);
  }
});

router.post('/goal/suggestions', async (req, res, next) => {
  try {
    const { userId = 'demo-user', month, year } = req.body;
    const summary = await summaryService.generateBudgetSummary(userId, month, year);
    const goal = await goalService.getGoal(userId);
    const suggestions = await goalService.analyzeSavingsGoal(userId, { summary, goal });
    res.json({ success: true, suggestions });
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