const { body, param } = require('express-validator');

const createCategoryValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters'),
  body('color')
    .optional()
    .matches(/^#([0-9A-F]{3}){1,2}$/i)
    .withMessage('Color must be a valid HEX color code (e.g. #3b82f6)'),
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Icon identifier cannot exceed 50 characters'),
];

const updateCategoryValidator = [
  param('id').notEmpty().withMessage('Category ID is required'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category name cannot be empty')
    .isLength({ min: 2, max: 100 }),
  body('color')
    .optional()
    .matches(/^#([0-9A-F]{3}){1,2}$/i)
    .withMessage('Color must be a valid HEX color code'),
];

module.exports = {
  createCategoryValidator,
  updateCategoryValidator,
};
