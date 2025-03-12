// This file contains functions that provide finance-related data and calculations.

const calculateBudget = (income, expenses) => {
    return income - expenses;
};

const getSavingsGoal = (currentSavings, targetSavings) => {
    return targetSavings - currentSavings;
};

const calculateDebtToIncomeRatio = (debt, income) => {
    return (debt / income) * 100;
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

module.exports = {
    calculateBudget,
    getSavingsGoal,
    calculateDebtToIncomeRatio,
    formatCurrency
};