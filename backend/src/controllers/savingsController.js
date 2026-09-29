const SavingsModel = require('../models/savingsModel');
const { successResponse, errorResponse } = require('../utils/responseHelper');

class SavingsController {
  static async getGoals(req, res, next) {
    try {
      const rawGoals = await SavingsModel.findAll(req.user.id);
      const goals = rawGoals.map((g) => {
        const target = Number(g.target_amount);
        const current = Number(g.current_amount || 0);
        const percentage = target > 0 ? Number(Math.min(100, (current / target) * 100).toFixed(1)) : 0;
        const remaining = Math.max(0, Number((target - current).toFixed(2)));
        const isCompleted = current >= target;

        return {
          ...g,
          target_amount: target,
          current_amount: current,
          percentage,
          remaining,
          isCompleted,
        };
      });

      return successResponse(res, { goals }, 'Savings goals retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getGoalById(req, res, next) {
    try {
      const goal = await SavingsModel.findById(req.params.id, req.user.id);
      if (!goal) {
        return errorResponse(res, 'Savings goal not found or access denied', 404);
      }
      return successResponse(res, { goal }, 'Savings goal retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async createGoal(req, res, next) {
    try {
      const { name, target_amount, current_amount, target_date, description } = req.body;
      const goal = await SavingsModel.create({
        user_id: req.user.id,
        name,
        target_amount,
        current_amount,
        target_date,
        description,
      });

      return successResponse(res, { goal }, 'Savings goal created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateGoal(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await SavingsModel.findById(id, req.user.id);
      if (!existing) {
        return errorResponse(res, 'Savings goal not found or access denied', 404);
      }

      const updated = await SavingsModel.update(id, req.user.id, req.body);
      return successResponse(res, { goal: updated }, 'Savings goal updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteGoal(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await SavingsModel.findById(id, req.user.id);
      if (!existing) {
        return errorResponse(res, 'Savings goal not found or access denied', 404);
      }

      await SavingsModel.delete(id, req.user.id);
      return successResponse(res, null, 'Savings goal deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async contribute(req, res, next) {
    try {
      const { id } = req.params;
      const { amount } = req.body;

      const existing = await SavingsModel.findById(id, req.user.id);
      if (!existing) {
        return errorResponse(res, 'Savings goal not found or access denied', 404);
      }

      const updated = await SavingsModel.contribute(id, req.user.id, amount);
      const isCompleted = Number(updated.current_amount) >= Number(updated.target_amount);

      return successResponse(
        res,
        { goal: updated, isCompleted },
        isCompleted ? '🎉 Congratulations! You reached your savings goal!' : 'Contribution added successfully!'
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SavingsController;
