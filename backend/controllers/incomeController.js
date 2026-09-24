const asyncHandler = require('../utils/asyncHandler');
const Income = require('../models/Income');
const socketUtil = require('../utils/socket');

// @route POST /api/income
const createIncome = asyncHandler(async (req, res) => {
  const { title, amount, category, date, description } = req.body;

  const income = await Income.create({
    user: req.user._id,
    title,
    amount,
    category,
    date,
    description,
  });

  try {
    socketUtil.getIo().to(req.user._id.toString()).emit('dataUpdated', { resource: 'income', action: 'create', payload: income });
  } catch (e) {}

  res.status(201).json(income);
});

// @route GET /api/income
const getIncomes = asyncHandler(async (req, res) => {
  const { search, category, page = 1, limit = 10, sort = 'date:desc' } = req.query;

  const filter = { user: req.user._id };
  if (category) filter.category = category;
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

  const [incomes, total] = await Promise.all([
    Income.find(filter).sort(sortOption).skip(skip).limit(limitNum),
    Income.countDocuments(filter),
  ]);

  res.status(200).json({
    incomes,
    pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
  });
});

// @route GET /api/income/:id
const getIncomeById = asyncHandler(async (req, res) => {
  const income = await Income.findOne({ _id: req.params.id, user: req.user._id });
  if (!income) {
    return res.status(404).json({ message: 'Income not found' });
  }
  res.status(200).json(income);
});

// @route PUT /api/income/:id
const updateIncome = asyncHandler(async (req, res) => {
  const income = await Income.findOne({ _id: req.params.id, user: req.user._id });
  if (!income) {
    return res.status(404).json({ message: 'Income not found' });
  }

  const { title, amount, category, date, description } = req.body;
  if (title !== undefined) income.title = title;
  if (amount !== undefined) income.amount = amount;
  if (category !== undefined) income.category = category;
  if (date !== undefined) income.date = date;
  if (description !== undefined) income.description = description;

  await income.save();
  try {
    socketUtil.getIo().to(req.user._id.toString()).emit('dataUpdated', { resource: 'income', action: 'update', payload: income });
  } catch (e) {}

  res.status(200).json(income);
});

// @route DELETE /api/income/:id
const deleteIncome = asyncHandler(async (req, res) => {
  const income = await Income.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!income) {
    return res.status(404).json({ message: 'Income not found' });
  }
  try {
    socketUtil.getIo().to(req.user._id.toString()).emit('dataUpdated', { resource: 'income', action: 'delete', payload: { id: req.params.id } });
  } catch (e) {}

  res.status(200).json({ message: 'Income deleted successfully' });
});

module.exports = { createIncome, getIncomes, getIncomeById, updateIncome, deleteIncome };
