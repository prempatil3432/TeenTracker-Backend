const { body, param } = require('express-validator');

const createIncomeValidator = [
  body('source')
    .trim()
    .notEmpty()
    .withMessage('Income source is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Source must be between 2 and 100 characters'),
  body('amount')
    .notEmpty()
    .withMessage('Income amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('income_date')
    .optional()
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('Income date must be a valid date in YYYY-MM-DD format'),
  body('description')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage('Description cannot exceed 255 characters'),
];

const updateIncomeValidator = [
  param('id').notEmpty().withMessage('Income ID is required'),
  body('source')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Source cannot be empty'),
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('income_date')
    .optional()
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('Income date must be a valid date in YYYY-MM-DD format'),
];

module.exports = {
  createIncomeValidator,
  updateIncomeValidator,
};
