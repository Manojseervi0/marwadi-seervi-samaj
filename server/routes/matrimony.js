const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MatrimonyProfile = require('../models/MatrimonyProfile');
const { verifyToken } = require('../middleware/auth');

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

router.get('/', async (req, res) => {
  try {
    const profiles = await MatrimonyProfile.find().sort({ createdAt: -1 });
    res.json({ profiles });
  } catch (err) {
    console.error('Error fetching matrimony profiles:', err);
    res.status(500).json({ message: 'Failed to fetch profiles' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid profile ID' });
    }
    const profile = await MatrimonyProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json({ profile });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, age, location, education, profession, image, interests, family } = req.body;
    if (!name || age === undefined || !location) {
      return res.status(400).json({ message: 'Name, age, and location are required' });
    }

    const numAge = Number(age);
    if (isNaN(numAge) || numAge < 18 || numAge > 120) {
      return res.status(400).json({ message: 'Please provide a valid age (18+)' });
    }

    const profile = await MatrimonyProfile.create({
      name: name.trim(),
      age: numAge,
      location: location.trim(),
      education,
      profession,
      image,
      interests: Array.isArray(interests) ? interests : [],
      family,
      verified: req.user.role === 'admin' ? Boolean(req.body.verified) : false,
      owner: req.user.userId,
    });
    res.status(201).json({ message: 'Matrimony profile created successfully', profile });
  } catch (err) {
    console.error('Error creating profile:', err);
    res.status(500).json({ message: 'Failed to create profile' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid profile ID' });
    }
    const profile = await MatrimonyProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    if (String(profile.owner) !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { name, age, location, education, profession, image, interests, family, verified } = req.body;
    if (name) profile.name = name.trim();
    if (age !== undefined) {
      const numAge = Number(age);
      if (!isNaN(numAge) && numAge >= 18) profile.age = numAge;
    }
    if (location !== undefined) profile.location = location.trim();
    if (education !== undefined) profile.education = education;
    if (profession !== undefined) profile.profession = profession;
    if (image !== undefined) profile.image = image;
    if (interests !== undefined) profile.interests = Array.isArray(interests) ? interests : [];
    if (family !== undefined) profile.family = family;

    // Only admin can toggle verified status
    if (req.user.role === 'admin' && verified !== undefined) {
      profile.verified = Boolean(verified);
    }

    await profile.save();
    res.json({ message: 'Matrimony profile updated', profile });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid profile ID' });
    }
    const profile = await MatrimonyProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    if (String(profile.owner) !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await profile.deleteOne();
    res.json({ message: 'Matrimony profile deleted successfully' });
  } catch (err) {
    console.error('Error deleting profile:', err);
    res.status(500).json({ message: 'Failed to delete profile' });
  }
});

router.post('/search', async (req, res) => {
  try {
    const { name, location, minAge, maxAge } = req.body;
    const query = {};

    if (name && typeof name === 'string') {
      query.name = new RegExp(escapeRegex(name.trim()), 'i');
    }

    if (location && typeof location === 'string') {
      query.location = new RegExp(escapeRegex(location.trim()), 'i');
    }

    const parsedMin = minAge ? parseInt(minAge, 10) : null;
    const parsedMax = maxAge ? parseInt(maxAge, 10) : null;

    if (!isNaN(parsedMin) && parsedMin !== null || !isNaN(parsedMax) && parsedMax !== null) {
      query.age = {};
      if (!isNaN(parsedMin) && parsedMin !== null) query.age.$gte = parsedMin;
      if (!isNaN(parsedMax) && parsedMax !== null) query.age.$lte = parsedMax;
    }

    const profiles = await MatrimonyProfile.find(query).sort({ createdAt: -1 });
    res.json({ profiles });
  } catch (err) {
    console.error('Error searching matrimony profiles:', err);
    res.status(500).json({ message: 'Failed to search profiles' });
  }
});

module.exports = router;