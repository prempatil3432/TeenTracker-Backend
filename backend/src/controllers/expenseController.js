const ExpenseModel = require('../models/expenseModel');
const CategoryModel = require('../models/categoryModel');
const { generateExpensesCsv } = require('../utils/exportCsv');
const { successResponse, errorResponse } = require('../utils/responseHelper');

class ExpenseController {
  static async getExpenses(req, res, next) {
    try {
      const result = await ExpenseModel.findAll(req.user.id, req.query);
      return successResponse(res, result, 'Expenses retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getExpenseById(req, res, next) {
    try {
      const expense = await ExpenseModel.findById(req.params.id, req.user.id);
      if (!expense) {
        return errorResponse(res, 'Expense record not found or access denied', 404);
      }
      return successResponse(res, { expense }, 'Expense details retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async createExpense(req, res, next) {
    try {
      const { category_id, amount, description, expense_date, payment_method, merchant, notes } = req.body;

      // Verify category belongs to user if specified
      if (category_id) {
        const category = await CategoryModel.findById(category_id, req.user.id);
        if (!category) {
          return errorResponse(res, 'Invalid category selected for this user', 400);
        }
      }

      const expense = await ExpenseModel.create({
        user_id: req.user.id,
        category_id,
        amount,
        description,
        expense_date,
        payment_method,
        merchant,
        notes,
      });

      return successResponse(res, { expense }, 'Expense recorded successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateExpense(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await ExpenseModel.findById(id, req.user.id);
      if (!existing) {
        return errorResponse(res, 'Expense record not found or access denied', 404);
      }

      if (req.body.category_id) {
        const category = await CategoryModel.findById(req.body.category_id, req.user.id);
        if (!category) {
          return errorResponse(res, 'Invalid category selected', 400);
        }
      }

      const updated = await ExpenseModel.update(id, req.user.id, req.body);
      return successResponse(res, { expense: updated }, 'Expense updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteExpense(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await ExpenseModel.findById(id, req.user.id);
      if (!existing) {
        return errorResponse(res, 'Expense record not found or access denied', 404);
      }

      await ExpenseModel.delete(id, req.user.id);
      return successResponse(res, null, 'Expense deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async exportCsv(req, res, next) {
    try {
      // Fetch all matching expenses without pagination
      const result = await ExpenseModel.findAll(req.user.id, { ...req.query, all: true });
      const csvData = generateExpensesCsv(result.expenses);

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename=teenspend-expenses-${new Date().toISOString().split('T')[0]}.csv`);
      return res.status(200).send(csvData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ExpenseController;
