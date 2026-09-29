/**
 * Personalized Spending Suggestions and Teen Financial Health Engine
 * Educational, encouraging, and calculated strictly from tracked user metrics.
 */

const generateInsights = ({
  user,
  currentMonthExpenses = [],
  previousMonthExpenses = [],
  budgets = [],
  incomeList = [],
  categoryBreakdown = [],
  budgetUsage = [],
  savingsGoals = [],
}) => {
  const suggestions = [];
  const totalSpent = currentMonthExpenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalIncome = incomeList.reduce((s, i) => s + Number(i.amount), 0);
  const currency = user.currency || '₹';

  // 1. Category-specific suggestions
  const topCategory = categoryBreakdown[0];
  if (topCategory && topCategory.percentage >= 30) {
    suggestions.push({
      id: 'top-cat-insight',
      type: 'category',
      priority: 'high',
      title: `${topCategory.name} is your biggest expense`,
      message: `You spent ${topCategory.percentage}% of your money on ${topCategory.name} this month (${currency}${topCategory.amount.toLocaleString()}). Setting a dedicated weekly limit could help keep more money in your pocket!`,
      action: 'Set Category Budget',
      actionUrl: '/budgets',
    });
  }

  // 2. Budget utilization checks
  const overBudgetItems = budgetUsage.filter((b) => b.percentage > 100);
  const warningBudgetItems = budgetUsage.filter((b) => b.percentage >= 80 && b.percentage <= 100);

  if (overBudgetItems.length > 0) {
    const names = overBudgetItems.map((b) => b.category?.name || 'Category').join(', ');
    suggestions.push({
      id: 'over-budget-warning',
      type: 'budget',
      priority: 'urgent',
      title: `Over budget in ${names}`,
      message: `You've exceeded your planned spending in ${names}. Review recent transactions to see where adjustments can be made.`,
      action: 'Review Budgets',
      actionUrl: '/budgets',
    });
  } else if (warningBudgetItems.length > 0) {
    const item = warningBudgetItems[0];
    suggestions.push({
      id: 'near-budget-warning',
      type: 'budget',
      priority: 'medium',
      title: `${item.category?.name || 'Category'} budget nearly reached`,
      message: `You have used ${item.percentage}% of your ${item.category?.name} budget. Consider spacing out non-essential purchases for the rest of this month.`,
      action: 'Check Spending',
      actionUrl: '/expenses',
    });
  }

  // 3. Frequent small purchases detection (the "latte/snack effect")
  const smallThreshold = currency === '₹' ? 200 : 5;
  const smallExpenses = currentMonthExpenses.filter((e) => Number(e.amount) <= smallThreshold);
  if (smallExpenses.length >= 5) {
    const smallTotal = smallExpenses.reduce((s, e) => s + Number(e.amount), 0);
    suggestions.push({
      id: 'micro-purchases',
      type: 'habit',
      priority: 'medium',
      title: 'Small purchases add up',
      message: `You made ${smallExpenses.length} small purchases this month totaling ${currency}${smallTotal.toFixed(2)}. Little treats like snacks and drinks can quietly add up to a big amount!`,
      action: 'View Expenses',
      actionUrl: '/expenses',
    });
  }

  // 4. Month-over-month comparison
  const prevMonthTotal = previousMonthExpenses.reduce((s, e) => s + Number(e.amount), 0);
  if (prevMonthTotal > 0) {
    const diff = totalSpent - prevMonthTotal;
    const pctChange = ((diff / prevMonthTotal) * 100).toFixed(1);
    if (diff > 0 && pctChange > 15) {
      suggestions.push({
        id: 'spending-trend-up',
        type: 'trend',
        priority: 'medium',
        title: 'Spending is higher than last month',
        message: `Your spending is up by ${pctChange}% compared with this time last month. Check your largest transactions to see what changed.`,
        action: 'Compare Analytics',
        actionUrl: '/analytics',
      });
    } else if (diff < 0 && Math.abs(pctChange) > 10) {
      suggestions.push({
        id: 'spending-trend-down',
        type: 'trend',
        priority: 'positive',
        title: 'Smart saving trend! 🎉',
        message: `Great discipline! You have spent ${Math.abs(pctChange)}% less than last month. Put that extra cash toward your savings goals!`,
        action: 'Add to Savings',
        actionUrl: '/savings',
      });
    }
  }

  // 5. Savings Goals progress
  if (savingsGoals.length > 0) {
    const nearestGoal = savingsGoals.find((g) => {
      const pct = (Number(g.current_amount) / Number(g.target_amount)) * 100;
      return pct >= 60 && pct < 100;
    });

    if (nearestGoal) {
      const pct = Math.round((Number(nearestGoal.current_amount) / Number(nearestGoal.target_amount)) * 100);
      const remainingAmount = Number(nearestGoal.target_amount) - Number(nearestGoal.current_amount);
      suggestions.push({
        id: 'goal-close',
        type: 'savings',
        priority: 'positive',
        title: `You're ${pct}% close to your goal! 🎯`,
        message: `Only ${currency}${remainingAmount.toLocaleString()} needed to complete "${nearestGoal.name}". You're almost there!`,
        action: 'Contribute Now',
        actionUrl: '/savings',
      });
    }
  } else {
    suggestions.push({
      id: 'create-first-goal',
      type: 'savings',
      priority: 'low',
      title: 'Set your first savings goal',
      message: 'Whether it is new headphones, sneakers, or a concert ticket, having a clear goal makes saving exciting and rewarding.',
      action: 'Create Goal',
      actionUrl: '/savings',
    });
  }

  // 6. Overall Health Status assessment
  let healthScore = 'good';
  let healthStatusText = "You're on track";
  let healthBadgeColor = 'emerald';

  if (overBudgetItems.length > 0) {
    healthScore = 'danger';
    healthStatusText = 'Over budget in categories';
    healthBadgeColor = 'rose';
  } else if (warningBudgetItems.length > 0 || (totalIncome > 0 && totalSpent / totalIncome > 0.85)) {
    healthScore = 'warning';
    healthStatusText = 'Watch your spending';
    healthBadgeColor = 'amber';
  } else if (totalIncome > 0 && totalSpent / totalIncome < 0.6) {
    healthScore = 'excellent';
    healthStatusText = 'Great savings progress';
    healthBadgeColor = 'indigo';
  }

  return {
    health: {
      score: healthScore,
      status: healthStatusText,
      badgeColor: healthBadgeColor,
      disclaimer: 'These educational suggestions are calculated purely from your tracked expenses and budgets to help build smart money habits.',
    },
    suggestions,
  };
};

module.exports = {
  generateInsights,
};
