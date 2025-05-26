const express = require('express');
const app = express();

require('dotenv').config();

// Đặt express.json() SAU dotenv
app.use(express.json({ limit: '10mb' })); 

const authRoutes = require('./routes/authRoutes');
const accountantRoutes = require('./routes/accountantRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');

const port = process.env.PORT || 8000;

// Debug middleware
app.use((req, res, next) => {
    console.log('Request Method:', req.method);
    console.log('Request URL:', req.url);
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    next();
});

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Department Management API Server',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            accountant: '/api/accountant',
            payments: '/api/payments',
            statistics: '/api/statistics'
        },
        documentation: {
            payments: '/docs/payment-api.md'
        }
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/accountant', accountantRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/statistics', statisticsRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});