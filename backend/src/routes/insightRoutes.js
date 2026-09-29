const express = require('express');
const router = express.Router();
const InsightController = require('../controllers/insightController');
const authenticate = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/', InsightController.getInsights);

module.exports = router;
