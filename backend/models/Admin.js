const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true } // simple plaintext/hashed for now
});

module.exports = mongoose.model('Admin', adminSchema);
