const express = require('express');
const router = express.Router();
const Art = require('../models/Art');
const multer = require('multer');
const path = require('path');
const sendEmail = require('../utils/email');

const fs = require('fs');

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

// POST new art
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, description, category, price } = req.body;
        const newArt = new Art({
            title,
            description,
            category,
            price: price || 0,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : ''
        });
        await newArt.save();
        res.status(201).json(newArt);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE art
router.delete('/:id', async (req, res) => {
    try {
        const art = await Art.findById(req.params.id);
        if (!art) return res.status(404).json({ message: 'Art not found' });

        // Delete image file
        if (art.imageUrl) {
            const filePath = path.join(__dirname, '..', art.imageUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await art.deleteOne();
        res.json({ message: 'Art deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST Buy Art (Mock)
// PUT Update Art (Edit/Restock)
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, description, category, price, status } = req.body;
        const art = await Art.findById(req.params.id);
        if (!art) return res.status(404).json({ message: 'Art not found' });

        art.title = title || art.title;
        art.description = description || art.description;
        art.category = category || art.category;
        art.price = price !== undefined ? price : art.price;
        if (status) art.status = status; // Allow manual setting of 'Available' or 'Sold'

        if (req.file) {
            // Optional: Delete old image if it exists and isn't used elsewhere
            art.imageUrl = `/uploads/${req.file.filename}`;
        }

        await art.save();
        res.json(art);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST Buy Art
router.post('/buy/:id', async (req, res) => {
    try {
        const { customerName, email, transactionId } = req.body;
        const art = await Art.findById(req.params.id);
        if (!art) return res.status(404).json({ message: 'Art not found' });

        if (art.status === 'Sold') {
            return res.status(400).json({ message: 'This artwork is already sold.' });
        }

        art.status = 'Sold';
        await art.save();

        // Create an Order record for this purchase so it appears in Admin Dashboard
        const Order = require('../models/Order');
        const newOrder = new Order({
            customerName: customerName || 'Guest Buyer',
            email: email || 'No Email',
            details: `Purchased Artwork: ${art.title} (Price: $${art.price})`,
            status: 'Accepted', // Auto-accept purchases
            isPaid: false, // Pending verification
            transactionId: transactionId || 'Pending'
        });
        await newOrder.save();

        // Send Email Confirmation
        await sendEmail(email, 'Artwork Purchase Confirmation',
            `Hi ${customerName},\n\nThank you for purchasing "${art.title}"!\n\nYour Order ID is: ${newOrder._id}\nWe have received your payment reference: ${transactionId}. We will verify it and update your status shortly.\n\nBest,\nJeki Arts`
        );

        res.json({ message: 'Purchase successful', art, orderId: newOrder._id });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
