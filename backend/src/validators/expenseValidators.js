const { body, query, param } = require('express-validator');

const ALLOWED_PAYMENT_METHODS = ['Cash', 'UPI', 'Debit Card', 'Credit Card', 'Bank Transfer', 'Other'];

const createExpenseValidator = [
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01, max: 10000000 })
    .withMessage('Amount must be greater than 0 and less than 10,000,000'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 255 })
    .withMessage('Description cannot exceed 255 characters'),
  body('category_id')
    .optional({ nullable: true }),
  body('expense_date')
    .optional()
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('Expense date must be a valid date in YYYY-MM-DD format'),
  body('payment_method')
    .optional()
    .isIn(ALLOWED_PAYMENT_METHODS)
    .withMessage(`Payment method must be one of: ${ALLOWED_PAYMENT_METHODS.join(', ')}`),
  body('merchant')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 150 })
    .withMessage('Merchant name cannot exceed 150 characters'),
  body('notes')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
];

const updateExpenseValidator = [
  param('id')
    .notEmpty()
    .withMessage('Expense ID is required'),
  body('amount')
    .optional()
    .isFloat({ min: 0.01, max: 10000000 })
    .withMessage('Amount must be greater than 0 and less than 10,000,000'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty')
    .isLength({ max: 255 }),
  body('expense_date')
    .optional()
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('Expense date must be a valid date in YYYY-MM-DD format'),
  body('payment_method')
    .optional()
    .isIn(ALLOWED_PAYMENT_METHODS)
    .withMessage(`Payment method must be one of: ${ALLOWED_PAYMENT_METHODS.join(', ')}`),
];

module.exports = {
  createExpenseValidator,
  updateExpenseValidator,
};
