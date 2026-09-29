const ExpenseModel = require('../models/expenseModel');
const BudgetModel = require('../models/budgetModel');
const IncomeModel = require('../models/incomeModel');
const SavingsModel = require('../models/savingsModel');
const CategoryModel = require('../models/categoryModel');
const { generateInsights } = require('../services/recommendationService');
const { calculateCategoryBreakdown, calculateBudgetUsage } = require('../services/financialCalcService');
const { getCurrentMonthRange, getPreviousMonthRange } = require('../utils/dateUtils');
const { successResponse } = require('../utils/responseHelper');

class InsightController {
  static async getInsights(req, res, next) {
    try {
      const { startDate, endDate } = getCurrentMonthRange();
      const prevRange = getPreviousMonthRange();

      const [
        currentMonthExpenses,
        previousMonthExpenses,
        budgets,
        incomeList,
        savingsGoals,
        categories,
      ] = await Promise.all([
        ExpenseModel.findByDateRange(req.user.id, startDate, endDate),
        ExpenseModel.findByDateRange(req.user.id, prevRange.startDate, prevRange.endDate),
        BudgetModel.findAll(req.user.id),
        IncomeModel.findByDateRange(req.user.id, startDate, endDate),
        SavingsModel.findAll(req.user.id),
        CategoryModel.findByUserId(req.user.id),
      ]);

      const categoryBreakdown = calculateCategoryBreakdown(currentMonthExpenses, categories);
      const budgetUsage = calculateBudgetUsage(budgets, currentMonthExpenses);

      const insightsData = generateInsights({
        user: req.user,
        currentMonthExpenses,
        previousMonthExpenses,
        budgets,
        incomeList,
        categoryBreakdown,
        budgetUsage,
        savingsGoals,
      });

      return successResponse(res, insightsData, 'Personalized spending suggestions generated');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = InsightController;
