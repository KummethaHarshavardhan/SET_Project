// Lightweight manual validation - no extra npm packages required.

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || !name.trim()) errors.push('Name is required');
  if (!email || !isValidEmail(email)) errors.push('A valid email is required');
  if (!password || password.length < 6) errors.push('Password must be at least 6 characters');

  if (errors.length) return res.status(400).json({ message: errors.join(', ') });
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !isValidEmail(email)) errors.push('A valid email is required');
  if (!password) errors.push('Password is required');

  if (errors.length) return res.status(400).json({ message: errors.join(', ') });
  next();
};

const validateExpense = (req, res, next) => {
  const { title, amount, category } = req.body;
  const errors = [];

  if (!title || !title.trim()) errors.push('Title is required');
  if (amount === undefined || amount === null || isNaN(amount) || Number(amount) < 0) {
    errors.push('Amount must be a positive number');
  }
  if (!category || !category.trim()) errors.push('Category is required');

  if (errors.length) return res.status(400).json({ message: errors.join(', ') });
  next();
};

const validateBudget = (req, res, next) => {
  const { category, limit, month, year } = req.body;
  const errors = [];

  if (!category || !category.trim()) errors.push('Category is required');
  if (limit === undefined || isNaN(limit) || Number(limit) < 0) errors.push('Limit must be a positive number');
  if (!month || month < 1 || month > 12) errors.push('Month must be between 1 and 12');
  if (!year || year < 2000) errors.push('A valid year is required');

  if (errors.length) return res.status(400).json({ message: errors.join(', ') });
  next();
};

module.exports = { validateRegister, validateLogin, validateExpense, validateBudget };
