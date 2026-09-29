const CategoryModel = require('../models/categoryModel');
const { successResponse, errorResponse } = require('../utils/responseHelper');

class CategoryController {
  static async getCategories(req, res, next) {
    try {
      const categories = await CategoryModel.findByUserId(req.user.id);
      return successResponse(res, { categories }, 'Categories retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryById(req, res, next) {
    try {
      const category = await CategoryModel.findById(req.params.id, req.user.id);
      if (!category) {
        return errorResponse(res, 'Category not found', 404);
      }
      return successResponse(res, { category }, 'Category retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async createCategory(req, res, next) {
    try {
      const { name, color, icon } = req.body;

      // Check duplicate name for this user
      const existing = await CategoryModel.findByName(req.user.id, name);
      if (existing) {
        return errorResponse(res, `A category named "${name}" already exists`, 409);
      }

      const category = await CategoryModel.create({
        user_id: req.user.id,
        name,
        color: color || '#6366f1',
        icon: icon || 'Tag',
      });

      return successResponse(res, { category }, 'Category created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await CategoryModel.findById(id, req.user.id);
      if (!existing) {
        return errorResponse(res, 'Category not found or access denied', 404);
      }

      if (req.body.name && req.body.name.toLowerCase() !== existing.name.toLowerCase()) {
        const duplicate = await CategoryModel.findByName(req.user.id, req.body.name);
        if (duplicate && duplicate.id !== id) {
          return errorResponse(res, `A category named "${req.body.name}" already exists`, 409);
        }
      }

      const updated = await CategoryModel.update(id, req.user.id, req.body);
      return successResponse(res, { category: updated }, 'Category updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await CategoryModel.findById(id, req.user.id);
      if (!existing) {
        return errorResponse(res, 'Category not found or access denied', 404);
      }

      await CategoryModel.delete(id, req.user.id);
      return successResponse(res, null, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
