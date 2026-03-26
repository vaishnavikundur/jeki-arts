require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// =======================
// 🔥 CORS CONFIG (FIXED)
// =======================

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "https://jeki-arts-fr1o.vercel.app", // your live frontend
    "http://localhost:5173",
    "http://localhost:3000"
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error("CORS not allowed"), false);
        }
    },
    credentials: true
}));

// =======================
// 🔥 MIDDLEWARE
// =======================

app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =======================
// 🔥 DATABASE CONNECTION
// =======================

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.error('❌ MongoDB Error:', err);
        process.exit(1);
    });

// =======================
// 🔥 ROUTES
// =======================

const artRoutes = require('./routes/artRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/art', artRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// =======================
// 🔥 TEST ROUTE (OPTIONAL)
// =======================

app.get('/', (req, res) => {
    res.send('🚀 Backend is running successfully');
});

// =======================
// 🔥 START SERVER
// =======================

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});