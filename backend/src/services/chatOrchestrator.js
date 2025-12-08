const expenseService = require('./expenseService');
const summaryService = require('./summaryService');
const goalService = require('./goalService');
const llamaService = require('./llamaService');

const formatCurrency = (value) => `$${(Math.round(value * 100) / 100).toFixed(2)}`;

const formatSummaryText = (summary) => {
  const lines = [
    `Total this month: ${formatCurrency(summary.total)}`,
    'By category:',
    ...Object.entries(summary.byCategory).map(([cat, amount]) => `- ${cat}: ${formatCurrency(amount)}`)
  ];
  return lines.join('\n');
};

const isSummaryIntent = (text) => /summary|spending|total spent|spent this month/i.test(text || '');
const isGoalAssistIntent = (text) => /save|goal|help me reach/i.test(text || '');

const handleChat = async (messages, userId = 'default') => {
  const lastUserMessage = [...(messages || [])].reverse().find(m => m.role === 'user');
  const content = lastUserMessage?.content || '';

  // Expense logging flow
  const parsedExpense = expenseService.detectExpenseIntent(content);
  if (parsedExpense) {
    const txn = await expenseService.addExpenseFromText({ inputText: content, userId });
    const summary = await summaryService.generateBudgetSummary(userId);
    const reply = [
      `Logged ${formatCurrency(txn.amount)} for "${txn.description}" in category "${txn.category}".`,
      'Current month summary:',
      formatSummaryText(summary)
    ].join('\n');
    return { handled: true, reply };
  }

  // Summary intent
  if (isSummaryIntent(content)) {
    const summary = await summaryService.generateBudgetSummary(userId);
    const reply = formatSummaryText(summary);
    return { handled: true, reply };
  }

  // Goal creation intent
  const goalFromText = goalService.parseGoalText(content);
  if (goalFromText) {
    const saved = await goalService.setGoal(userId, goalFromText);
    const parts = [];
    if (saved.targetMonthlyAmount) parts.push(`monthly savings target: ${formatCurrency(saved.targetMonthlyAmount)}`);
    if (saved.targetAmount) parts.push(`target amount: ${formatCurrency(saved.targetAmount)}`);
    if (saved.deadline) parts.push(`deadline: ${saved.deadline}`);
    const reply = `Got it! I saved your goal (${parts.join(', ') || 'no amount set'}). Ask me for suggestions anytime.`;
    return { handled: true, reply };
  }

  // Goal assistance intent
  if (isGoalAssistIntent(content)) {
    const goal = await goalService.getGoal(userId);
    const summary = await summaryService.generateBudgetSummary(userId);
    const reply = await goalService.analyzeSavingsGoal(userId, { goal, summary });
    return { handled: true, reply };
  }

  // Fallback to general chat
  const reply = await llamaService.getResponseWithMessages(messages);
  return { handled: false, reply };
};

module.exports = {
  handleChat
};
