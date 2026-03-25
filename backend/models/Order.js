const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    details: { type: String, required: true },
    referencePhoto: { type: String }, // Path to uploaded file
    priceDetails: { type: String }, // Customized price details provided by admin
    customerAgreed: { type: Boolean, default: false }, // Whether customer agreed to price
    status: { type: String, enum: ['Pending', 'Accepted', 'Declined', 'Cancelled', 'Completed'], default: 'Pending' },
    isPaid: { type: Boolean, default: false },
    transactionId: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
