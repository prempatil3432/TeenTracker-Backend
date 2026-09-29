const { validationResult } = require('express-validator');
const { validationErrorResponse } = require('../utils/responseHelper');

/**
 * Middleware to check express-validator results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = {};
    errors.array().forEach((err) => {
      // Map error to field name
      const field = err.path || err.param;
      if (!formattedErrors[field]) {
        formattedErrors[field] = err.msg;
      }
    });
    return validationErrorResponse(res, formattedErrors, 'Validation failed');
  }
  next();
};

module.exports = validate;
