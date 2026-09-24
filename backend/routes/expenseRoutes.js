const express = require('express');
const router = express.Router();

const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  getMonthlyReport,
  exportExpensesCsv,
  getDashboardSummary,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const { validateExpense } = require('../middleware/validateMiddleware');

router.use(protect);

router.get('/summary', getExpenseSummary);
router.get('/monthly-report', getMonthlyReport);
router.get('/export', exportExpensesCsv);
router.get('/dashboard-summary', getDashboardSummary);

router.route('/')
  .get(getExpenses)
  .post(validateExpense, createExpense);

router.route('/:id')
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;
