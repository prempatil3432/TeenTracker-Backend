const IncomeModel = require('../models/incomeModel');
const { generateIncomeCsv } = require('../utils/exportCsv');
const { successResponse, errorResponse } = require('../utils/responseHelper');

class IncomeController {
  static async getIncomeList(req, res, next) {
    try {
      const incomeList = await IncomeModel.findAll(req.user.id, req.query);
      const totalIncome = Number(
        incomeList.reduce((sum, item) => sum + Number(item.amount), 0).toFixed(2)
      );
      return successResponse(res, { incomeList, totalIncome }, 'Income records retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getIncomeById(req, res, next) {
    try {
      const income = await IncomeModel.findById(req.params.id, req.user.id);
      if (!income) {
        return errorResponse(res, 'Income record not found or access denied', 404);
      }
      return successResponse(res, { income }, 'Income record retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async createIncome(req, res, next) {
    try {
      const { source, amount, income_date, description } = req.body;
      const income = await IncomeModel.create({
        user_id: req.user.id,
        source,
        amount,
        income_date,
        description,
      });

      return successResponse(res, { income }, 'Income logged successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateIncome(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await IncomeModel.findById(id, req.user.id);
      if (!existing) {
        return errorResponse(res, 'Income record not found or access denied', 404);
      }

      const updated = await IncomeModel.update(id, req.user.id, req.body);
      return successResponse(res, { income: updated }, 'Income updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteIncome(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await IncomeModel.findById(id, req.user.id);
      if (!existing) {
        return errorResponse(res, 'Income record not found or access denied', 404);
      }

      await IncomeModel.delete(id, req.user.id);
      return successResponse(res, null, 'Income record deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async exportCsv(req, res, next) {
    try {
      const incomeList = await IncomeModel.findAll(req.user.id, req.query);
      const csvData = generateIncomeCsv(incomeList);

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename=teenspend-income-${new Date().toISOString().split('T')[0]}.csv`);
      return res.status(200).send(csvData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = IncomeController;
