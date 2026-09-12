const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Temple = require('../models/Temple');
const { verifyToken, requireAdmin } = require('../middleware/auth');

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

router.get('/', async (req, res) => {
  try {
    const { city, type, search } = req.query;
    const query = {};

    if (city) {
      query.city = new RegExp(`^${escapeRegex(city.trim())}$`, 'i');
    }
    if (type && type !== 'All Temples') {
      query.type = new RegExp(escapeRegex(type.trim()), 'i');
    }
    if (search) {
      query.name = new RegExp(escapeRegex(search.trim()), 'i');
    }

    const temples = await Temple.find(query).sort({ rating: -1 });
    res.json({ temples });
  } catch (err) {
    console.error('Error fetching temples:', err);
    res.status(500).json({ message: 'Failed to fetch temples' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid temple ID' });
    }
    const temple = await Temple.findById(req.params.id);
    if (!temple) return res.status(404).json({ message: 'Temple not found' });
    res.json({ temple });
  } catch (err) {
    console.error('Error fetching temple:', err);
    res.status(500).json({ message: 'Failed to fetch temple' });
  }
});

router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { name, city, type, address, description, image, timings, phone, website, features, specialDays } = req.body;
    if (!name || !city) {
      return res.status(400).json({ message: 'Name and city are required' });
    }

    const temple = await Temple.create({
      name: name.trim(),
      city: city.trim(),
      type,
      address,
      description,
      image,
      timings,
      phone,
      website,
      features: Array.isArray(features) ? features : [],
      specialDays: Array.isArray(specialDays) ? specialDays : [],
    });
    res.status(201).json({ message: 'Temple entry created successfully', temple });
  } catch (err) {
    console.error('Error creating temple:', err);
    res.status(500).json({ message: 'Failed to create temple' });
  }
});

router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid temple ID' });
    }
    const temple = await Temple.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!temple) return res.status(404).json({ message: 'Temple not found' });
    res.json({ message: 'Temple updated successfully', temple });
  } catch (err) {
    console.error('Error updating temple:', err);
    res.status(500).json({ message: 'Failed to update temple' });
  }
});

router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid temple ID' });
    }
    const temple = await Temple.findByIdAndDelete(req.params.id);
    if (!temple) return res.status(404).json({ message: 'Temple not found' });
    res.json({ message: 'Temple deleted successfully' });
  } catch (err) {
    console.error('Error deleting temple:', err);
    res.status(500).json({ message: 'Failed to delete temple' });
  }
});

router.get('/:id/timings', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid temple ID' });
    }
    const temple = await Temple.findById(req.params.id);
    if (!temple) return res.status(404).json({ message: 'Temple not found' });
    res.json({ timings: temple.timings });
  } catch (err) {
    console.error('Error fetching timings:', err);
    res.status(500).json({ message: 'Failed to fetch timings' });
  }
});

module.exports = router;