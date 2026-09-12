const mongoose = require('mongoose');

const careerOpportunitySchema = new mongoose.Schema({
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true },
  location: String,
  salary: String,
  type: { type: String, default: 'Full-time' },
  experience: String,
  skills: [String],
  description: String,
}, { timestamps: true });

module.exports = mongoose.model('CareerOpportunity', careerOpportunitySchema);
