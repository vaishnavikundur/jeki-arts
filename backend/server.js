require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/art_portfolio')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

const artRoutes = require('./routes/artRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

// Routes
app.use('/api/art', artRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
