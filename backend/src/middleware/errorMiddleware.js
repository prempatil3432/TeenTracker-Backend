const config = require('../config/env');
const { errorResponse } = require('../utils/responseHelper');

/**
 * 404 Route Not Found Middleware
 */
const notFoundHandler = (req, res, next) => {
  return errorResponse(res, `Endpoint not found: ${req.method} ${req.originalUrl}`, 404);
};

/**
 * Centralized Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'An unexpected internal error occurred';

  // Log error details on server
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  const errorPayload = config.nodeEnv === 'development' ? err.stack : undefined;

  return res.status(statusCode).json({
    success: false,
    message,
    ...(errorPayload && { stack: errorPayload }),
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
