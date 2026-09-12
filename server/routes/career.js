const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CareerOpportunity = require('../models/CareerOpportunity');
const { verifyToken } = require('../middleware/auth');

// Static sub-routes placed before /:id to prevent route shadowing
router.get('/guidance/resources', (req, res) => {
  res.json({ message: 'Get career guidance resources' });
});

router.get('/networking/events', (req, res) => {
  res.json({ message: 'Get networking events' });
});

router.get('/', async (req, res) => {
  try {
    const opportunities = await CareerOpportunity.find().sort({ createdAt: -1 });
    res.json({ opportunities });
  } catch (err) {
    console.error('Error fetching career opportunities:', err);
    res.status(500).json({ message: 'Failed to fetch opportunities' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid opportunity ID' });
    }
    const opportunity = await CareerOpportunity.findById(req.params.id);
    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });
    res.json({ opportunity });
  } catch (err) {
    console.error('Error fetching opportunity:', err);
    res.status(500).json({ message: 'Failed to fetch opportunity' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, company, location, salary, type, experience, skills, description } = req.body;
    if (!title || !company) {
      return res.status(400).json({ message: 'Title and company are required' });
    }

    const opportunity = await CareerOpportunity.create({
      title: title.trim(),
      company: company.trim(),
      location,
      salary,
      type: type || 'Full-time',
      experience,
      skills: Array.isArray(skills) ? skills : [],
      description,
      postedBy: req.user.userId,
    });
    res.status(201).json({ message: 'Career opportunity created successfully', opportunity });
  } catch (err) {
    console.error('Error creating career opportunity:', err);
    res.status(500).json({ message: 'Failed to create career opportunity' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid opportunity ID' });
    }
    const opportunity = await CareerOpportunity.findById(req.params.id);
    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });

    if (String(opportunity.postedBy) !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { title, company, location, salary, type, experience, skills, description } = req.body;
    if (title) opportunity.title = title.trim();
    if (company) opportunity.company = company.trim();
    if (location !== undefined) opportunity.location = location;
    if (salary !== undefined) opportunity.salary = salary;
    if (type !== undefined) opportunity.type = type;
    if (experience !== undefined) opportunity.experience = experience;
    if (skills !== undefined) opportunity.skills = Array.isArray(skills) ? skills : [];
    if (description !== undefined) opportunity.description = description;

    await opportunity.save();
    res.json({ message: 'Career opportunity updated', opportunity });
  } catch (err) {
    console.error('Error updating career opportunity:', err);
    res.status(500).json({ message: 'Failed to update career opportunity' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid opportunity ID' });
    }
    const opportunity = await CareerOpportunity.findById(req.params.id);
    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });

    if (String(opportunity.postedBy) !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await opportunity.deleteOne();
    res.json({ message: 'Career opportunity deleted successfully' });
  } catch (err) {
    console.error('Error deleting career opportunity:', err);
    res.status(500).json({ message: 'Failed to delete career opportunity' });
  }
});

module.exports = router;