const mongoose = require('mongoose');

const artSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, default: 0 },
    imageUrl: { type: String, required: true },
    category: { type: String, default: 'Oil Painting' },
    status: { type: String, enum: ['Available', 'Sold'], default: 'Available' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Art', artSchema);
