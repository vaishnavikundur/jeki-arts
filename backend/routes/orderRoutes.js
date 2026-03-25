const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const multer = require('multer');
const path = require('path');
const sendEmail = require('../utils/email');

// Health Check for Debugging
router.get('/test-connection', (req, res) => {
    res.json({
        message: 'Backend is connected and reading .env correctly',
        email_configured: !!process.env.EMAIL_USER,
        user: process.env.EMAIL_USER
    });
});

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });



// POST Create Order
router.post('/', upload.single('referencePhoto'), async (req, res) => {
    try {
        const { customerName, email, details } = req.body;
        console.log(`[NEW ORDER] Incoming request from ${customerName} (${email})`);
        const order = new Order({
            customerName,
            email,
            details,
            isPaid: req.body.isPaid === 'true',
            referencePhoto: req.file ? `/uploads/${req.file.filename}` : ''
        });
        await order.save();

        // Notify Customer
        const trackingLink = `http://localhost:5173/track-order?email=${encodeURIComponent(email)}&orderId=${order._id}`;
        await sendEmail(email, 'Order Received',
            `Hi ${customerName},\n\nWe received your commission request for: "${details}".\n\nYour Order ID is: ${order._id}\n\nYou can automatically track your order status by clicking the link below:\n${trackingLink}\n\nI will review your request and get back to you shortly.\n\nBest,\nJeki Arts`
        );

        // Notify Artist (Elena)
        await sendEmail(process.env.EMAIL_USER, 'New Commission Request!',
            `You have a new commission request from ${customerName} (${email}).\n\nDetails: ${details}\n\nCheck your Dashboard to accept/decline.`
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

// POST Track Order
router.post('/track', async (req, res) => {
    try {
        const { email, orderId } = req.body;
        const order = await Order.findOne({ _id: orderId, email });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(400).json({ message: 'Invalid details' });
    }
});

// PUT Cancel Order (Customer)
router.put('/cancel-customer/:id', async (req, res) => {
    try {
        const { email } = req.body;
        const order = await Order.findOne({ _id: req.params.id, email });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.status !== 'Pending') {
            return res.status(400).json({ message: 'Cannot cancel order that is already processed' });
        }

        order.status = 'Cancelled';
        await order.save();

        await sendEmail(email, 'Order Cancelled', `Hi ${order.customerName},\n\nYour order ${order._id} has been successfully cancelled.`);
        res.json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT Pay for Order
// PUT Pay for Order (Submit Proof)
router.put('/pay/:id', async (req, res) => {
    try {
        const { transactionId } = req.body;
        if (!transactionId) return res.status(400).json({ message: 'Transaction ID is required' });

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.transactionId = transactionId;
        // Do NOT set isPaid = true. Admin will verify.
        await order.save();

        await sendEmail(order.email, 'Payment Submitted', `Hi ${order.customerName},\n\nWe have received your payment reference: ${transactionId}. We will verify it and update your status shortly.\n\nBest,\nJeki Arts`);
        res.json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT Agree to Price (Customer)
router.put('/agree/:id', async (req, res) => {
    try {
        const { email } = req.body;
        const order = await Order.findOne({ _id: req.params.id, email });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.customerAgreed = true;
        await order.save();

        await sendEmail(process.env.EMAIL_USER, 'Customer Agreed to Price', `Customer ${order.customerName} (${order.email}) has agreed to the price for order ${order._id}. They will proceed to payment shortly.`);

        res.json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT Update Status (Accept/Decline) - Admin
router.put('/:id/status', async (req, res) => {
    try {
        const { status, priceDetails } = req.body; // 'Accepted', 'Declined', 'Cancelled'
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = status;
        if (priceDetails) order.priceDetails = priceDetails;
        await order.save();

        // Auto Email Notification
        let subject = 'Order Update';
        let msg = '';

        if (status === 'Accepted') {
            const trackingLink = `http://localhost:5173/track-order?email=${encodeURIComponent(order.email)}&orderId=${order._id}`;
            subject = 'Your Commission Price Details & Next Steps';
            msg = `Hi ${order.customerName},\n\nWe have reviewed your request and are happy to accept it!\n\nHere are your customized price details:\n${order.priceDetails || 'N/A'}\n\nPlease head over to the tracking page to agree to the price and proceed with payment.\n\nTracking Link: ${trackingLink}`;
        } else if (status === 'Declined') {
            subject = 'Order Status Update';
            msg = `Hi ${order.customerName},\n\nUnfortunately we cannot accept your request at this time.`;
        } else if (status === 'Cancelled') {
            subject = 'Order Cancelled';
            msg = `Hi ${order.customerName},\n\nYour order has been cancelled. If this was a mistake, please contact us.`;
        }

        if (msg) {
            await sendEmail(order.email, subject, msg + `\n\nBest,\nJeki Arts`);
        }

        res.json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE Order (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        await order.deleteOne();
        res.json({ message: 'Order deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
