const BudgetModel = require('../models/budgetModel');
const ExpenseModel = require('../models/expenseModel');
const CategoryModel = require('../models/categoryModel');
const { calculateBudgetUsage } = require('../services/financialCalcService');
const { getCurrentMonthRange } = require('../utils/dateUtils');
const { successResponse, errorResponse } = require('../utils/responseHelper');

class BudgetController {
  static async getBudgets(req, res, next) {
    try {
      const { startDate, endDate } = getCurrentMonthRange();
      const [budgets, expenses] = await Promise.all([
        BudgetModel.findAll(req.user.id),
        ExpenseModel.findByDateRange(req.user.id, startDate, endDate),
      ]);

      const enrichedBudgets = calculateBudgetUsage(budgets, expenses);
      return successResponse(res, { budgets: enrichedBudgets }, 'Budgets retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getBudgetById(req, res, next) {
    try {
      const budget = await BudgetModel.findById(req.params.id, req.user.id);
      if (!budget) {
        return errorResponse(res, 'Budget not found or access denied', 404);
      }
      return successResponse(res, { budget }, 'Budget retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async createBudget(req, res, next) {
    try {
      const { category_id, amount, period = 'monthly', start_date, end_date } = req.body;

      const category = await CategoryModel.findById(category_id, req.user.id);
      if (!category) {
        return errorResponse(res, 'Category not found', 404);
      }

      // Check if user already has a budget for this category and period
      const existing = await BudgetModel.findByCategoryAndPeriod(req.user.id, category_id, period);
      if (existing) {
        return errorResponse(res, `A ${period} budget for "${category.name}" already exists`, 409);
      }

      const budget = await BudgetModel.create({
        user_id: req.user.id,
        category_id,
        amount,
        period,
        start_date,
        end_date,
      });

      return successResponse(res, { budget }, 'Budget created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateBudget(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await BudgetModel.findById(id, req.user.id);
      if (!existing) {
        return errorResponse(res, 'Budget not found or access denied', 404);
      }

      const updated = await BudgetModel.update(id, req.user.id, req.body);
      return successResponse(res, { budget: updated }, 'Budget updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteBudget(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await BudgetModel.findById(id, req.user.id);
      if (!existing) {
        return errorResponse(res, 'Budget not found or access denied', 404);
      }

      await BudgetModel.delete(id, req.user.id);
      return successResponse(res, null, 'Budget deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BudgetController;
