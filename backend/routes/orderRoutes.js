const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Email Transporter (Placeholder)
// In real prod, use process.env.EMAIL_USER & PASS
const transporter = nodemailer.createTransport({
    service: 'gmail', // or other
    auth: {
        user: 'placeholder@gmail.com',
        pass: 'placeholder'
    }
});

const sendEmail = async (to, subject, text) => {
    try {
        // await transporter.sendMail({ from: 'art@portfolio.com', to, subject, text });
        console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject} | Body: ${text}`);
    } catch (err) {
        console.error('Email error:', err);
    }
};

// POST Create Order
router.post('/', upload.single('referencePhoto'), async (req, res) => {
    try {
        const { customerName, email, details } = req.body;
        const order = new Order({
            customerName,
            email,
            details,
            referencePhoto: req.file ? `/uploads/${req.file.filename}` : ''
        });
        await order.save();

        // Notify Customer (Optional: Order Received)
        sendEmail(email, 'Order Received',
            `Hi ${customerName},\n\nWe received your commission request for: "${details}".\n\nI will review it and get back to you shortly.\n\nIn the meantime, feel free to connect with me:\nWhatsApp: +1 (555) 123-4567\nInstagram: @elena_artistry\n\nBest,\nElena`
        );

        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET All Orders (Admin)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT Update Status (Accept/Decline)
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body; // 'Accepted' or 'Declined'
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = status;
        await order.save();

        // Auto Email Notification
        const subject = status === 'Accepted' ? 'Good News! Your Order is Accepted' : 'Order Update';
        const msg = status === 'Accepted'
            ? `Hi ${order.customerName},\n\nWe are happy to accept your commission! We will start working soon.`
            : `Hi ${order.customerName},\n\nUnfortunately we cannot accept your request at this time.`;

        sendEmail(order.email, subject, msg);

        res.json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
