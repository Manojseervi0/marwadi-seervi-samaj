const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    if (req.user.userId !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    if (req.user.userId !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { name, email } = req.body;
    const updateData = {};

    if (name) updateData.name = name.trim();
    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      // Check if email format is basic valid
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
      // Check for duplicate email
      const existing = await User.findOne({ email: normalizedEmail, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
      updateData.email = normalizedEmail;
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    if (req.user.userId !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

module.exports = router;