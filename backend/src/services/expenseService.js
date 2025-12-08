const crypto = require('crypto');
const llamaService = require('./llamaService');
const store = require('../storage/jsonStore');

const CATEGORY_KEYWORDS = {
  transportation: ['uber', 'lyft', 'bus', 'taxi', 'cab', 'train', 'metro', 'subway', 'gas', 'fuel'],
  food: ['starbucks', 'restaurant', 'coffee', 'dining', 'lunch', 'dinner', 'breakfast', 'meal'],
  shopping: ['amazon', 'shopping', 'clothes', 'apparel', 'mall', 'retail'],
  bills: ['rent', 'electric', 'water', 'wifi', 'internet', 'utility', 'utilities', 'power', 'gas bill'],
};

const ALLOWED_CATEGORIES = ['food', 'transportation', 'shopping', 'bills', 'other'];

const toNumber = (value) => {
  const parsed = typeof value === 'number' ? value : parseFloat(value);
  if (Number.isNaN(parsed)) return null;
  return Math.round(parsed * 100) / 100;
};

const parseExpenseInput = (inputText) => {
  if (!inputText || typeof inputText !== 'string') return null;
  const normalized = inputText.trim();
  const amountMatch = normalized.match(/(-?\d+(?:\.\d{1,2})?)/);
  if (!amountMatch) return null;

  const amount = toNumber(amountMatch[1]);
  if (amount === null) return null;

  const description = normalized
    .replace(amountMatch[0], '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return {
    amount,
    description: description || 'Uncategorized expense'
  };
};

const categorizeExpenseHeuristic = (description) => {
  const text = (description || '').toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const matched = keywords.some(keyword => text.includes(keyword));
    if (matched) {
      return { category, reason: 'heuristic' };
    }
  }
  return null;
};

const categorizeWithLLM = async (description) => {
  const prompt = [
    {
      role: 'system',
      content: 'Classify the expense description into one of: food, transportation, shopping, bills, other. Reply with only the single category word. If unsure, reply "other".'
    },
    {
      role: 'user',
      content: `Description: ${description}`
    }
  ];

  const reply = await llamaService.getResponseWithMessages(prompt);
  const normalized = (reply || '').toLowerCase().trim();
  const cleaned = normalized.split(/\s|\n/)[0];
  if (ALLOWED_CATEGORIES.includes(cleaned)) return cleaned;
  return 'other';
};

const categorizeExpense = async (description) => {
  const heuristic = categorizeExpenseHeuristic(description);
  if (heuristic) return heuristic.category;
  return categorizeWithLLM(description);
};

const buildTransaction = ({ userId = 'default', description, amount, category }) => ({
  id: crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex'),
  userId,
  description,
  amount,
  category,
  timestamp: new Date().toISOString()
});

const addExpenseFromText = async ({ inputText, userId = 'default' }) => {
  const parsed = parseExpenseInput(inputText);
  if (!parsed) {
    const err = new Error('Could not parse an amount from the message. Please include a number like "Starbucks 8.50".');
    err.status = 400;
    throw err;
  }
  const category = await categorizeExpense(parsed.description);
  const txn = buildTransaction({ userId, description: parsed.description, amount: parsed.amount, category });
  await store.addTransaction(userId, txn);
  return txn;
};

const listExpenses = async (userId = 'default') => store.listTransactions(userId);

const detectExpenseIntent = (text) => {
  const parsed = parseExpenseInput(text);
  return parsed ? parsed : null;
};

// TODO: add unit tests for parsing, heuristic categorization, and LLM fallback validation

module.exports = {
  ALLOWED_CATEGORIES,
  parseExpenseInput,
  categorizeExpense,
  categorizeExpenseHeuristic,
  addExpenseFromText,
  listExpenses,
  detectExpenseIntent
};
