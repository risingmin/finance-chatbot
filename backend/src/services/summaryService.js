const store = require('../storage/jsonStore');
const { ALLOWED_CATEGORIES } = require('./expenseService');

const generateBudgetSummary = async (userId = 'default', month, year) => {
  const transactions = await store.listTransactions(userId);
  if (!transactions || transactions.length === 0) {
    return {
      total: 0,
      byCategory: ALLOWED_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {})
    };
  }

  const now = new Date();
  // Allow either 0-based or 1-based month input
  const normalizedMonth = typeof month === 'number'
    ? (month > 0 ? month - 1 : month)
    : now.getMonth();
  const targetMonth = normalizedMonth;
  const targetYear = typeof year === 'number' ? year : now.getFullYear();

  const filtered = transactions.filter(txn => {
    const d = new Date(txn.timestamp);
    return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
  });

  const totals = {
    total: 0,
    byCategory: ALLOWED_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {})
  };

  filtered.forEach(txn => {
    totals.total += txn.amount;
    const cat = ALLOWED_CATEGORIES.includes(txn.category) ? txn.category : 'other';
    totals.byCategory[cat] += txn.amount;
  });

  // round to 2 decimals
  totals.total = Math.round(totals.total * 100) / 100;
  Object.keys(totals.byCategory).forEach(cat => {
    totals.byCategory[cat] = Math.round(totals.byCategory[cat] * 100) / 100;
  });

  return totals;
};

module.exports = {
  generateBudgetSummary
};
