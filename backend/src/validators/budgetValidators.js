const { body, param } = require('express-validator');

const createBudgetValidator = [
  body('category_id')
    .notEmpty()
    .withMessage('Category ID is required'),
  body('amount')
    .notEmpty()
    .withMessage('Budget amount is required')
    .isFloat({ min: 1, max: 10000000 })
    .withMessage('Budget amount must be a positive number'),
  body('period')
    .optional()
    .isIn(['weekly', 'monthly', 'yearly'])
    .withMessage('Period must be weekly, monthly, or yearly'),
];

const updateBudgetValidator = [
  param('id').notEmpty().withMessage('Budget ID is required'),
  body('amount')
    .optional()
    .isFloat({ min: 1, max: 10000000 })
    .withMessage('Budget amount must be a positive number'),
  body('period')
    .optional()
    .isIn(['weekly', 'monthly', 'yearly'])
    .withMessage('Period must be weekly, monthly, or yearly'),
];

module.exports = {
  createBudgetValidator,
  updateBudgetValidator,
};
