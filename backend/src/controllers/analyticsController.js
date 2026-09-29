const AnalyticsService = require('../services/analyticsService');
const { successResponse } = require('../utils/responseHelper');

class AnalyticsController {
  static async getDashboard(req, res, next) {
    try {
      const data = await AnalyticsService.getDashboardAnalytics(req.user.id, req.user);
      return successResponse(res, data, 'Dashboard analytics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getMonthlyTrend(req, res, next) {
    try {
      const trend = await AnalyticsService.getMonthlyTrend(req.user.id);
      return successResponse(res, { trend }, 'Monthly spending trend retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(req, res, next) {
    try {
      const breakdown = await AnalyticsService.getCategoryAnalytics(req.user.id);
      return successResponse(res, { breakdown }, 'Category breakdown retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getWeekly(req, res, next) {
    try {
      const weekly = await AnalyticsService.getWeeklyAnalytics(req.user.id);
      return successResponse(res, { weekly }, 'Weekly spending analytics retrieved');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AnalyticsController;
