const { body, param } = require('express-validator');

const createSavingsValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Savings goal name is required')
    .isLength({ min: 2, max: 150 })
    .withMessage('Name must be between 2 and 150 characters'),
  body('target_amount')
    .notEmpty()
    .withMessage('Target amount is required')
    .isFloat({ min: 1 })
    .withMessage('Target amount must be greater than 0'),
  body('current_amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Current amount cannot be negative'),
  body('target_date')
    .optional({ nullable: true })
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('Target date must be a valid date in YYYY-MM-DD format'),
];

const updateSavingsValidator = [
  param('id').notEmpty().withMessage('Goal ID is required'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Goal name cannot be empty'),
  body('target_amount')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Target amount must be greater than 0'),
  body('current_amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Current amount cannot be negative'),
];

const contributeSavingsValidator = [
  param('id').notEmpty().withMessage('Goal ID is required'),
  body('amount')
    .notEmpty()
    .withMessage('Contribution amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Contribution must be greater than 0'),
];

module.exports = {
  createSavingsValidator,
  updateSavingsValidator,
  contributeSavingsValidator,
};
