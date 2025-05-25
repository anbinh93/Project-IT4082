const express = require('express');
const dotenv = require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const accountantRoutes = require('./routes/accountantRoutes');

const app = express();

const port = process.env.PORT || 8000;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/accountant', accountantRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});