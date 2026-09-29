const express = require('express');
const router = express.Router();
const IncomeController = require('../controllers/incomeController');
const authenticate = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const {
  createIncomeValidator,
  updateIncomeValidator,
} = require('../validators/incomeValidators');

router.use(authenticate);

router.get('/', IncomeController.getIncomeList);
router.get('/export', IncomeController.exportCsv);
router.get('/:id', IncomeController.getIncomeById);
router.post('/', createIncomeValidator, validate, IncomeController.createIncome);
router.put('/:id', updateIncomeValidator, validate, IncomeController.updateIncome);
router.delete('/:id', IncomeController.deleteIncome);

module.exports = router;
