const express = require('express');
const router = express.Router();
const Art = require('../models/Art');
const multer = require('multer');
const path = require('path');

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET all art
router.get('/', async (req, res) => {
    try {
        const art = await Art.find().sort({ createdAt: -1 });
        res.json(art);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new art (Admin only strictly speaking, but open for prototype dev)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const newArt = new Art({
            title,
            description,
            category,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : ''
        });
        await newArt.save();
        res.status(201).json(newArt);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
