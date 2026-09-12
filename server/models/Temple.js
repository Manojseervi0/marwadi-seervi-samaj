const mongoose = require('mongoose');

const templeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: String,
  city: { type: String, required: true },
  address: String,
  description: String,
  image: String,
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  timings: String,
  phone: String,
  website: String,
  features: [String],
  specialDays: [String],
}, { timestamps: true });

module.exports = mongoose.model('Temple', templeSchema);
