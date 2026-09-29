const ExpenseModel = require('../models/expenseModel');
const IncomeModel = require('../models/incomeModel');
const BudgetModel = require('../models/budgetModel');
const SavingsModel = require('../models/savingsModel');
const CategoryModel = require('../models/categoryModel');
const {
  calculateTotalExpenses,
  calculateTotalIncome,
  calculateRemainingMoney,
  calculateSavingsRate,
  calculateAverageDailySpend,
  calculateCategoryBreakdown,
  calculateWeekdayBreakdown,
  calculateBudgetUsage,
  findHighestExpense,
  findTopCategory,
  calculateMonthOverMonthChange,
} = require('./financialCalcService');
const { getCurrentMonthRange, getPreviousMonthRange } = require('../utils/dateUtils');

class AnalyticsService {
  static async getDashboardAnalytics(userId, user) {
    const { startDate, endDate } = getCurrentMonthRange();
    const prevRange = getPreviousMonthRange();

    // Fetch in parallel
    const [
      currentExpenses,
      prevExpenses,
      incomeList,
      budgets,
      savingsGoals,
      categories,
    ] = await Promise.all([
      ExpenseModel.findByDateRange(userId, startDate, endDate),
      ExpenseModel.findByDateRange(userId, prevRange.startDate, prevRange.endDate),
      IncomeModel.findByDateRange(userId, startDate, endDate),
      BudgetModel.findAll(userId),
      SavingsModel.findAll(userId),
      CategoryModel.findByUserId(userId),
    ]);

    const totalSpent = calculateTotalExpenses(currentExpenses);
    const totalIncome = calculateTotalIncome(incomeList);
    const remaining = calculateRemainingMoney(totalIncome, totalSpent);
    const savingsRate = calculateSavingsRate(totalIncome, totalSpent);

    // Sum of all savings goals current amount
    const totalSavedInGoals = Number(
      savingsGoals.reduce((sum, g) => sum + Number(g.current_amount || 0), 0).toFixed(2)
    );

    const now = new Date();
    const daysElapsed = Math.max(1, now.getDate());
    const averageDailySpend = calculateAverageDailySpend(totalSpent, daysElapsed);

    const highestExpense = findHighestExpense(currentExpenses);
    const categoryBreakdown = calculateCategoryBreakdown(currentExpenses, categories);
    const topCategory = findTopCategory(categoryBreakdown);
    const budgetUsage = calculateBudgetUsage(budgets, currentExpenses);
    const weekdaySpending = calculateWeekdayBreakdown(currentExpenses);

    const prevMonthTotal = calculateTotalExpenses(prevExpenses);
    const monthComparison = calculateMonthOverMonthChange(totalSpent, prevMonthTotal);

    return {
      summary: {
        totalIncome,
        monthlyAllowance: Number(user.monthly_allowance || 0),
        totalSpent,
        remaining,
        savingsRate,
        totalSavedInGoals,
        expenseCount: currentExpenses.length,
        averageDailySpend,
        highestExpense,
        topCategory,
        monthComparison,
      },
      categoryBreakdown: categoryBreakdown.slice(0, 6),
      budgetUsage: budgetUsage.slice(0, 5),
      weekdaySpending,
      savingsGoals: savingsGoals.slice(0, 4),
      recentExpenses: currentExpenses.slice(0, 5),
    };
  }

  static async getMonthlyTrend(userId) {
    // Generate past 6 months data
    const monthsData = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(Date.UTC(now.getFullYear(), now.getMonth() - i, 1));
      const year = d.getFullYear();
      const monthNum = d.getMonth() + 1;
      const monthName = d.toLocaleString('en-US', { month: 'short' });

      const start = new Date(Date.UTC(year, monthNum - 1, 1)).toISOString().split('T')[0];
      const end = new Date(Date.UTC(year, monthNum, 0)).toISOString().split('T')[0];

      const [expenses, income] = await Promise.all([
        ExpenseModel.findByDateRange(userId, start, end),
        IncomeModel.findByDateRange(userId, start, end),
      ]);

      const spent = calculateTotalExpenses(expenses);
      const earned = calculateTotalIncome(income);

      monthsData.push({
        month: monthName,
        year,
        fullLabel: `${monthName} ${year}`,
        expenses: spent,
        income: earned,
        savings: Math.max(0, earned - spent),
      });
    }

    return monthsData;
  }

  static async getCategoryAnalytics(userId) {
    const { startDate, endDate } = getCurrentMonthRange();
    const [expenses, categories] = await Promise.all([
      ExpenseModel.findByDateRange(userId, startDate, endDate),
      CategoryModel.findByUserId(userId),
    ]);

    return calculateCategoryBreakdown(expenses, categories);
  }

  static async getWeeklyAnalytics(userId) {
    const { startDate, endDate } = getCurrentMonthRange();
    const expenses = await ExpenseModel.findByDateRange(userId, startDate, endDate);
    return calculateWeekdayBreakdown(expenses);
  }
}

module.exports = AnalyticsService;
