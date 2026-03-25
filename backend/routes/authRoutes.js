const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Simple plaintext check for prototype
        const admin = await Admin.findOne({ username });
        if (!admin || admin.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json({ message: 'Login successful', userId: admin._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Initial seed route
router.post('/seed', async (req, res) => {
    try {
        const exists = await Admin.findOne({ username: 'admin' });
        if (exists) return res.send('Admin already exists');
        const admin = new Admin({ username: 'vaishnavi', password: 'kundur123' });
        await admin.save();
        res.send('Admin created');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
