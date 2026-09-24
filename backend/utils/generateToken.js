const jwt = require('jsonwebtoken');

// Creates a signed JWT containing the user's id. Used right after register/login.
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = generateToken;
