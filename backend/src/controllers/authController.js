const UserModel = require('../models/userModel');
const CategoryModel = require('../models/categoryModel');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/responseHelper');

class AuthController {
  static async register(req, res, next) {
    try {
      const { name, email, password, age, currency, monthly_allowance } = req.body;

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return errorResponse(res, 'An account with this email address already exists', 409);
      }

      const password_hash = await hashPassword(password);
      const user = await UserModel.create({
        name,
        email,
        password_hash,
        age: age ? Number(age) : 16,
        currency: currency || '₹',
        monthly_allowance: monthly_allowance ? Number(monthly_allowance) : 0,
      });

      // Automatically seed default teen-friendly categories for the new user
      await CategoryModel.seedDefaultCategoriesForUser(user.id);

      const token = generateToken({ id: user.id, email: user.email });

      return successResponse(
        res,
        {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            age: user.age,
            currency: user.currency,
            monthly_allowance: user.monthly_allowance,
            created_at: user.created_at,
          },
          token,
        },
        'Registration successful! Welcome to TEENSPEND.',
        201
      );
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return errorResponse(res, 'Invalid email or password', 401);
      }

      const isMatch = await comparePassword(password, user.password_hash);
      if (!isMatch) {
        return errorResponse(res, 'Invalid email or password', 401);
      }

      const token = generateToken({ id: user.id, email: user.email });

      return successResponse(
        res,
        {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            age: user.age,
            currency: user.currency,
            monthly_allowance: user.monthly_allowance,
            created_at: user.created_at,
          },
          token,
        },
        'Login successful. Welcome back!'
      );
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req, res, next) {
    try {
      return successResponse(res, { user: req.user }, 'Current user profile retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const updatedUser = await UserModel.update(req.user.id, req.body);
      return successResponse(res, { user: updatedUser }, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res) {
    return successResponse(res, null, 'Logged out successfully');
  }
}

module.exports = AuthController;
