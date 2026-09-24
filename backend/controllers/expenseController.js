const asyncHandler = require('../utils/asyncHandler');
const Expense = require('../models/Expense');
const Income = require('../models/Income');
const socketUtil = require('../utils/socket');

// @route POST /api/expenses
const createExpense = asyncHandler(async (req, res) => {
  const { title, amount, category, paymentMethod, date, description } = req.body;

  const expense = await Expense.create({
    user: req.user._id,
    title,
    amount,
    category,
    paymentMethod,
    date,
    description,
  });

  try {
    socketUtil.getIo().to(req.user._id.toString()).emit('dataUpdated', { resource: 'expense', action: 'create', payload: expense });
  } catch (e) {
    
  }

  res.status(201).json(expense);
});

// @route GET /api/expenses

const getExpenses = asyncHandler(async (req, res) => {
  const { category, startDate, endDate, search, page = 1, limit = 10, sort = 'date:desc' } = req.query;

  const filter = { user: req.user._id };

  if (category) filter.category = category;

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const [sortField, sortDir] = sort.split(':');
  const sortOption = { [sortField || 'date']: sortDir === 'asc' ? 1 : -1 };

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const skip = (pageNum - 1) * limitNum;

  const [expenses, total] = await Promise.all([
    Expense.find(filter).sort(sortOption).skip(skip).limit(limitNum),
    Expense.countDocuments(filter),
  ]);

  res.status(200).json({
    expenses,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

// @route GET /api/expenses/:id
const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
  if (!expense) {
    return res.status(404).json({ message: 'Expense not found' });
  }
  res.status(200).json(expense);
});

// @route PUT /api/expenses/:id
const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
  if (!expense) {
    return res.status(404).json({ message: 'Expense not found' });
  }

  const { title, amount, category, paymentMethod, date, description } = req.body;

  if (title !== undefined) expense.title = title;
  if (amount !== undefined) expense.amount = amount;
  if (category !== undefined) expense.category = category;
  if (paymentMethod !== undefined) expense.paymentMethod = paymentMethod;
  if (date !== undefined) expense.date = date;
  if (description !== undefined) expense.description = description;

  await expense.save();
  try {
    socketUtil.getIo().to(req.user._id.toString()).emit('dataUpdated', { resource: 'expense', action: 'update', payload: expense });
  } catch (e) {}

  res.status(200).json(expense);
});

// @route DELETE /api/expenses/:id
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!expense) {
    return res.status(404).json({ message: 'Expense not found' });
  }
  try {
    socketUtil.getIo().to(req.user._id.toString()).emit('dataUpdated', { resource: 'expense', action: 'delete', payload: { id: req.params.id } });
  } catch (e) {}

  res.status(200).json({ message: 'Expense deleted successfully' });
});

// @route GET /api/expenses/summary

const getExpenseSummary = asyncHandler(async (req, res) => {
  const summary = await Expense.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $sort: { total: -1 } },
  ]);

  const totalSpent = summary.reduce((sum, item) => sum + item.total, 0);

  res.status(200).json({ totalSpent, byCategory: summary });
});

// @route GET /api/expenses/monthly-report?year=2026

const getMonthlyReport = asyncHandler(async (req, res) => {
  const year = Number(req.query.year) || new Date().getFullYear();

  const report = await Expense.aggregate([
    {
      $match: {
        user: req.user._id,
        date: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31T23:59:59`) },
      },
    },
    {
      $group: {
        _id: { $month: '$date' },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

 
  const months = Array.from({ length: 12 }, (_, i) => {
    const found = report.find((r) => r._id === i + 1);
    return { month: i + 1, total: found ? found.total : 0, count: found ? found.count : 0 };
  });

  res.status(200).json({ year, months });
});

// @route GET /api/expenses/export

const exportExpensesCsv = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });

  const header = 'Title,Amount,Category,PaymentMethod,Date,Notes';
  const rows = expenses.map((e) => {
    const safe = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    return [
      safe(e.title),
      e.amount,
      safe(e.category),
      safe(e.paymentMethod),
      e.date.toISOString().split('T')[0],
      safe(e.description),
    ].join(',');
  });

  const csv = [header, ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="expenses.csv"');
  res.status(200).send(csv);
});

// @route GET /api/expenses/dashboard-summary

const getDashboardSummary = asyncHandler(async (req, res) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const [totalExpenseAgg, thisMonthExpenseAgg, totalIncomeAgg, thisMonthIncomeAgg, recentExpenses, recentIncomes] =
    await Promise.all([
      Expense.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Expense.aggregate([
        { $match: { user: req.user._id, date: { $gte: monthStart, $lte: monthEnd } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Income.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Income.aggregate([
        { $match: { user: req.user._id, date: { $gte: monthStart, $lte: monthEnd } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Expense.find({ user: req.user._id }).sort({ date: -1 }).limit(5),
      Income.find({ user: req.user._id }).sort({ date: -1 }).limit(5),
    ]);

  const totalExpense = totalExpenseAgg[0]?.total || 0;
  const thisMonthExpense = thisMonthExpenseAgg[0]?.total || 0;
  const totalIncome = totalIncomeAgg[0]?.total || 0;
  const thisMonthIncome = thisMonthIncomeAgg[0]?.total || 0;
  const balance = totalIncome - totalExpense;

  res.status(200).json({
    totalIncome,
    totalExpense,
    balance,
    thisMonth: thisMonthExpense,
    thisMonthIncome,
    recentExpenses,
    recentIncomes,
  });
});

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  getMonthlyReport,
  exportExpensesCsv,
  getDashboardSummary,
};
