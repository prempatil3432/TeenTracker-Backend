const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/analyticsController');
const authenticate = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/dashboard', AnalyticsController.getDashboard);
router.get('/monthly', AnalyticsController.getMonthlyTrend);
router.get('/categories', AnalyticsController.getCategories);
router.get('/weekly', AnalyticsController.getWeekly);

module.exports = router;
