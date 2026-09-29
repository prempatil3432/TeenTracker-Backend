const express = require('express');
const router = express.Router();
const ExpenseController = require('../controllers/expenseController');
const authenticate = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const {
  createExpenseValidator,
  updateExpenseValidator,
} = require('../validators/expenseValidators');

// All expense routes require authentication
router.use(authenticate);

router.get('/', ExpenseController.getExpenses);
router.get('/export', ExpenseController.exportCsv);
router.get('/:id', ExpenseController.getExpenseById);
router.post('/', createExpenseValidator, validate, ExpenseController.createExpense);
router.put('/:id', updateExpenseValidator, validate, ExpenseController.updateExpense);
router.delete('/:id', ExpenseController.deleteExpense);

module.exports = router;
