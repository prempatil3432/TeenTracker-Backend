/**
 * Financial Calculation Helpers
 * Clean, pure functions for mathematical and financial modeling
 */

const calculateTotalExpenses = (expenses = []) => {
  return Number(expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0).toFixed(2));
};

const calculateTotalIncome = (incomeList = []) => {
  return Number(incomeList.reduce((acc, curr) => acc + Number(curr.amount || 0), 0).toFixed(2));
};

const calculateRemainingMoney = (totalIncome, totalExpenses) => {
  return Number((totalIncome - totalExpenses).toFixed(2));
};

const calculateSavingsRate = (totalIncome, totalExpenses) => {
  if (!totalIncome || totalIncome <= 0) return 0;
  const saved = Math.max(0, totalIncome - totalExpenses);
  return Number(((saved / totalIncome) * 100).toFixed(1));
};

const calculateAverageDailySpend = (totalExpenses, days) => {
  if (!days || days <= 0) return 0;
  return Number((totalExpenses / days).toFixed(2));
};

const calculateAverageWeeklySpend = (totalExpenses, days) => {
  if (!days || days <= 0) return 0;
  const weeks = days / 7;
  return Number((totalExpenses / Math.max(1, weeks)).toFixed(2));
};

const calculateMonthOverMonthChange = (currentTotal, prevTotal) => {
  const diff = Number((currentTotal - prevTotal).toFixed(2));
  let percentage = 0;

  if (prevTotal > 0) {
    percentage = Number((((currentTotal - prevTotal) / prevTotal) * 100).toFixed(1));
  } else if (currentTotal > 0) {
    percentage = 100;
  }

  return {
    difference: diff,
    percentage,
    increased: diff > 0,
    decreased: diff < 0,
    neutral: diff === 0,
  };
};

const findHighestExpense = (expenses = []) => {
  if (!expenses.length) return null;
  return expenses.reduce((max, curr) => (Number(curr.amount) > Number(max.amount) ? curr : max), expenses[0]);
};

const calculateCategoryBreakdown = (expenses = [], categories = []) => {
  const total = calculateTotalExpenses(expenses);
  const catMap = {};

  // Initialize from categories list
  categories.forEach((c) => {
    catMap[c.id] = {
      id: c.id,
      name: c.name,
      color: c.color,
      icon: c.icon,
      amount: 0,
      count: 0,
      percentage: 0,
    };
  });

  // Accumulate expenses
  expenses.forEach((e) => {
    const catId = e.category_id || 'uncategorized';
    if (!catMap[catId]) {
      catMap[catId] = {
        id: catId,
        name: e.category?.name || 'Uncategorized',
        color: e.category?.color || '#94a3b8',
        icon: e.category?.icon || 'Tag',
        amount: 0,
        count: 0,
        percentage: 0,
      };
    }
    catMap[catId].amount = Number((catMap[catId].amount + Number(e.amount)).toFixed(2));
    catMap[catId].count += 1;
  });

  const breakdown = Object.values(catMap)
    .filter((c) => c.amount > 0)
    .map((c) => ({
      ...c,
      percentage: total > 0 ? Number(((c.amount / total) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  return breakdown;
};

const findTopCategory = (categoryBreakdown = []) => {
  if (!categoryBreakdown.length) return null;
  return categoryBreakdown[0];
};

const calculateWeekdayBreakdown = (expenses = []) => {
  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayTotals = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0,
  };

  expenses.forEach((exp) => {
    const d = new Date(exp.expense_date);
    // JavaScript getDay(): 0 is Sunday, 1 is Monday ...
    const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayMap[d.getUTCDay()];
    dayTotals[dayName] = Number((dayTotals[dayName] + Number(exp.amount)).toFixed(2));
  });

  return daysOrder.map((day) => ({
    day,
    shortDay: day.substring(0, 3),
    amount: dayTotals[day],
  }));
};

const calculateBudgetUsage = (budgets = [], expenses = []) => {
  return budgets.map((b) => {
    const catExpenses = expenses.filter((e) => e.category_id === b.category_id);
    const spent = calculateTotalExpenses(catExpenses);
    const budgetAmount = Number(b.amount);
    const remaining = Number((budgetAmount - spent).toFixed(2));
    const percentage = budgetAmount > 0 ? Number(((spent / budgetAmount) * 100).toFixed(1)) : 0;

    let status = 'normal'; // green 0-60%
    if (percentage > 100) status = 'over'; // red
    else if (percentage >= 80) status = 'warning'; // orange 80-100%
    else if (percentage >= 60) status = 'caution'; // yellow 60-80%

    return {
      ...b,
      spent,
      remaining,
      percentage,
      status,
    };
  });
};

module.exports = {
  calculateTotalExpenses,
  calculateTotalIncome,
  calculateRemainingMoney,
  calculateSavingsRate,
  calculateAverageDailySpend,
  calculateAverageWeeklySpend,
  calculateMonthOverMonthChange,
  findHighestExpense,
  calculateCategoryBreakdown,
  findTopCategory,
  calculateWeekdayBreakdown,
  calculateBudgetUsage,
};
