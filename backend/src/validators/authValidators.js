const { body } = require('express-validator');

const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('age')
    .optional()
    .isInt({ min: 10, max: 25 })
    .withMessage('Age must be between 10 and 25'),
  body('currency')
    .optional()
    .isLength({ max: 10 })
    .withMessage('Currency symbol cannot exceed 10 characters'),
  body('monthly_allowance')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Monthly allowance must be a positive number'),
];

const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('age')
    .optional()
    .isInt({ min: 10, max: 25 })
    .withMessage('Age must be between 10 and 25'),
  body('currency')
    .optional()
    .isLength({ max: 10 })
    .withMessage('Currency symbol cannot exceed 10 characters'),
  body('monthly_allowance')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Monthly allowance must be a positive number'),
];

module.exports = {
  registerValidator,
  loginValidator,
  updateProfileValidator,
};
