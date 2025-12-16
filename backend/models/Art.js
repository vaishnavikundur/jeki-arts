const mongoose = require('mongoose');

const artSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true },
    category: { type: String, default: 'Oil Painting' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Art', artSchema);
