const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    details: { type: String, required: true },
    referencePhoto: { type: String }, // Path to uploaded file
    status: { type: String, enum: ['Pending', 'Accepted', 'Declined', 'Completed'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
