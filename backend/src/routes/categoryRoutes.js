const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');
const authenticate = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const {
  createCategoryValidator,
  updateCategoryValidator,
} = require('../validators/categoryValidators');

router.use(authenticate);

router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategoryById);
router.post('/', createCategoryValidator, validate, CategoryController.createCategory);
router.put('/:id', updateCategoryValidator, validate, CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);

module.exports = router;
