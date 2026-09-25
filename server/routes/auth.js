const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

function signToken(user) {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
      }
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await User.create({ name, email, password: hashedPassword, role: 'user' });
      const token = signToken(newUser);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax',
        path: '/'
      });
      res.status(201).json({
        message: 'User registered successfully',
        user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
      });
    } catch (error) {
      console.error('REGISTER ERROR:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
      
      const token = signToken(user);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax',
        path: '/'
      });
      res.json({
        message: 'Login successful',
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error) {
      console.error('LOGIN ERROR:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.post('/logout', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    console.error('ME ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post(
  '/forgot-password',
  authLimiter,
  [body('email').isEmail().withMessage('Valid email is required').normalizeEmail()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'No account found with this email' });
      }

      // 6-digit random OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.resetOTP = otp;
      user.resetOTPExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
      await user.save();

      const { sendEmail } = require('../services/emailService');
      await sendEmail({
        to: user.email,
        subject: 'Password Reset OTP - Marwadi Seervi Samaj',
        text: `Your OTP for password reset is: ${otp}\nIt is valid for 10 minutes.`
      });

      res.json({
        message: 'OTP sent to your email (valid for 10 minutes)'
      });
    } catch (error) {
      console.error('FORGOT PASSWORD ERROR:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.post(
  '/verify-otp',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('otp').trim().notEmpty().withMessage('OTP is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }
      const { email, otp } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!user.resetOTP || user.resetOTP !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }

      if (!user.resetOTPExpiry || user.resetOTPExpiry < new Date()) {
        return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
      }

      // Generate short-lived reset token (10 minutes)
      const resetToken = jwt.sign(
        { userId: user._id, email: user.email, purpose: 'password_reset' },
        process.env.JWT_SECRET,
        { expiresIn: '10m' }
      );

      res.json({
        message: 'OTP verified successfully',
        resetToken,
      });
    } catch (error) {
      console.error('VERIFY OTP ERROR:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.post(
  '/reset-password',
  authLimiter,
  [
    body('resetToken').notEmpty().withMessage('Reset token is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { resetToken, newPassword } = req.body;

      let decoded;
      try {
        decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        if (decoded.purpose !== 'password_reset') {
          return res.status(400).json({ message: 'Invalid reset token' });
        }
      } catch (err) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      user.resetOTP = undefined;
      user.resetOTPExpiry = undefined;
      await user.save();

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('RESET PASSWORD ERROR:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;