const express = require('express');
const router = express.Router();
const BudgetController = require('../controllers/budgetController');
const authenticate = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const {
  createBudgetValidator,
  updateBudgetValidator,
} = require('../validators/budgetValidators');

router.use(authenticate);

router.get('/', BudgetController.getBudgets);
router.get('/:id', BudgetController.getBudgetById);
router.post('/', createBudgetValidator, validate, BudgetController.createBudget);
router.put('/:id', updateBudgetValidator, validate, BudgetController.updateBudget);
router.delete('/:id', BudgetController.deleteBudget);

module.exports = router;
