const mongoose = require('mongoose');
const matrimonyProfileSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    location: { type: String, required: true },
    education: String,
    profession: String,
    image: String,
    interests: [String],
    family: String,
    verified: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('MatrimonyProfile', matrimonyProfileSchema);