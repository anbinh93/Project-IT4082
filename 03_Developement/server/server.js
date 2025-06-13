const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();

// CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Đặt express.json() SAU dotenv
app.use(express.json({ limit: '10mb' })); 

const authRoutes = require('./routes/authRoutes');
const householdRoutes = require('./routes/households');
const vehicleRoutes = require('./routes/vehicleRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const residentRoutes = require('./routes/residents');
const populationStatisticsRoutes = require('./routes/populationStatisticsRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const accountantRoutes = require('./routes/accountantRoutes');
const dotThuRoutes = require('./routes/dotThuRoutes');
const khoanThuRoutes = require('./routes/khoanThuRoutes');
const tamTruRoutes = require('./routes/tamTruRoutes');
const canhoRoutes = require('./routes/canhoRoutes');
const roomRoutes = require('./routes/roomRoutes');

const port = process.env.PORT || 8000;

// Enhanced Debug middleware
app.use((req, res, next) => {
    console.log('\n=== INCOMING REQUEST ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Original URL:', req.originalUrl);
    console.log('Path:', req.path);
    console.log('Query:', req.query);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('========================\n');
    next();
});

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Department Management API Server',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            households: '/api/households',
            vehicles: '/api/vehicles',
            statistics: '/api/statistics',
            residents: '/api/residents',
            populationStatistics: '/api/population',
            payments: '/api/payments',
            accountant: '/api/accountant',
            dotThu: '/api/dot-thu',
            khoanThu: '/api/khoan-thu',
            tamTru: '/api/tam-tru',
            canho: '/api/canho',
            rooms: '/api/rooms'
        }
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/households', householdRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/residents', residentRoutes);
app.use('/api/population', populationStatisticsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/accountant', accountantRoutes);
app.use('/api/dot-thu', dotThuRoutes);
app.use('/api/khoan-thu', khoanThuRoutes);
app.use('/api/tam-tru', tamTruRoutes);
app.use('/api/canho', canhoRoutes);
app.use('/api/rooms', roomRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});