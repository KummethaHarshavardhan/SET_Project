const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../middleware/validateMiddleware');

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.put('/change-password', protect, changePassword);

module.exports = router;
