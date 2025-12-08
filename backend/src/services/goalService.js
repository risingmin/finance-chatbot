const store = require('../storage/jsonStore');
const llamaService = require('./llamaService');
const { generateBudgetSummary } = require('./summaryService');

const parseGoalText = (text) => {
  if (!text) return null;
  const lower = text.toLowerCase();
  if (!/(save|goal)/.test(lower)) return null;

  const amountMatch = text.match(/\$?(-?\d+(?:\.\d{1,2})?)/);
  const amount = amountMatch ? parseFloat(amountMatch[1]) : null;
  const wantsMonthly = /month|monthly|this month/.test(lower);

  if (!amount) return null;

  return {
    targetMonthlyAmount: wantsMonthly ? amount : undefined,
    targetAmount: wantsMonthly ? undefined : amount,
    deadline: null
  };
};

const setGoal = async (userId = 'default', goal) => {
  const normalized = {
    targetMonthlyAmount: goal.targetMonthlyAmount ?? null,
    targetAmount: goal.targetAmount ?? null,
    deadline: goal.deadline || null,
    updatedAt: new Date().toISOString()
  };
  await store.setGoal(userId, normalized);
  return normalized;
};

const getGoal = async (userId = 'default') => store.getGoal(userId);

const analyzeSavingsGoal = async (userId = 'default', options = {}) => {
  const goal = options.goal || await getGoal(userId);
  const summary = options.summary || await generateBudgetSummary(userId, options.month, options.year);

  const goalText = goal
    ? `Goal: targetMonthlyAmount=${goal.targetMonthlyAmount || 'n/a'}, targetAmount=${goal.targetAmount || 'n/a'}, deadline=${goal.deadline || 'n/a'}`
    : 'Goal: none set yet';

  const system = {
    role: 'system',
    content: 'You are a concise financial coach. Suggest 1-3 concrete, practical spending adjustments. Keep it friendly and short. Do not invent numbers.'
  };

  const user = {
    role: 'user',
    content: `The user has monthly spending (USD): ${JSON.stringify(summary.byCategory)}. Total spent: ${summary.total}. ${goalText}. Suggest practical adjustments to help reach the goal.`
  };

  const reply = await llamaService.getResponseWithMessages([system, user]);
  return reply;
};

module.exports = {
  parseGoalText,
  setGoal,
  getGoal,
  analyzeSavingsGoal
};

// TODO: add unit tests for goal parsing and suggestion prompts
