const express = require('express');
const router = express.Router();
const SavingsController = require('../controllers/savingsController');
const authenticate = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const {
  createSavingsValidator,
  updateSavingsValidator,
  contributeSavingsValidator,
} = require('../validators/savingsValidators');

router.use(authenticate);

router.get('/', SavingsController.getGoals);
router.get('/:id', SavingsController.getGoalById);
router.post('/', createSavingsValidator, validate, SavingsController.createGoal);
router.put('/:id', updateSavingsValidator, validate, SavingsController.updateGoal);
router.delete('/:id', SavingsController.deleteGoal);
router.post('/:id/contribute', contributeSavingsValidator, validate, SavingsController.contribute);

module.exports = router;
