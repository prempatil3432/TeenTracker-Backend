const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/responseHelper');
const UserModel = require('../models/userModel');

/**
 * Express middleware to authenticate JWT and enforce ownership
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication token missing or invalid', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return errorResponse(res, 'Authentication token missing', 401);
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return errorResponse(res, 'Invalid or expired authentication token', 401);
    }

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return errorResponse(res, 'User session not found or deactivated', 401);
    }

    // Attach authenticated user to request context
    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Authentication failed', 401, error);
  }
};

module.exports = authenticate;
