const express = require('express');
const router = express.Router();

const {
  createIncome,
  getIncomes,
  getIncomeById,
  updateIncome,
  deleteIncome,
} = require('../controllers/incomeController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getIncomes)
  .post(createIncome);

router.route('/:id')
  .get(getIncomeById)
  .put(updateIncome)
  .delete(deleteIncome);

module.exports = router;
