const calculateBudget = (income, expenses) => {
  return income - expenses;
};

const getSavingsGoal = (currentSavings, targetSavings) => {
  return targetSavings - currentSavings;
};

const calculateDebtToIncomeRatio = (debt, income) => {
  if (typeof income !== 'number' || income === 0 || !Number.isFinite(income)) {
    throw new Error('Income must be a finite, non-zero number.');
  }

  if (typeof debt !== 'number' || !Number.isFinite(debt)) {
    throw new Error('Debt must be a finite number.');
  }

  return (debt / income) * 100;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const getFinanceData = () => {
  return {
    tools: {
      calculateBudget,
      getSavingsGoal,
      calculateDebtToIncomeRatio,
      formatCurrency
    },
    examples: {
      budget: calculateBudget(5000, 3500),
      savingsGoal: getSavingsGoal(10000, 25000),
      debtRatio: calculateDebtToIncomeRatio(1500, 5000)
    }
  };
};

module.exports = {
  calculateBudget,
  getSavingsGoal,
  calculateDebtToIncomeRatio,
  formatCurrency,
  getFinanceData
};