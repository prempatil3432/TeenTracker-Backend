/**
 * Standardized API Response Helpers
 */

const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (res, message = 'Internal Server Error', statusCode = 500, error = null) => {
  const response = {
    success: false,
    message,
  };

  if (error) {
    response.error = typeof error === 'string' ? error : error.message || 'An error occurred';
  }

  return res.status(statusCode).json(response);
};

const validationErrorResponse = (res, errors, message = 'Validation failed') => {
  return res.status(422).json({
    success: false,
    message,
    errors,
  });
};

module.exports = {
  successResponse,
  errorResponse,
  validationErrorResponse,
};
