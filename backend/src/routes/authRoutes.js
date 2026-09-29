const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  registerValidator,
  loginValidator,
  updateProfileValidator,
} = require('../validators/authValidators');

router.post('/register', authLimiter, registerValidator, validate, AuthController.register);
router.post('/login', authLimiter, loginValidator, validate, AuthController.login);
router.post('/logout', authenticate, AuthController.logout);
router.get('/me', authenticate, AuthController.getMe);
router.put('/profile', authenticate, updateProfileValidator, validate, AuthController.updateProfile);

module.exports = router;
