require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');

// Connect to MongoDB
connectDB();

const app = express();

// CORS Middleware: Allow frontend on localhost:8080
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://invoicesystech.netlify.app/',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/products', require('./routes/products'));
app.use('/api/invoices', require('./routes/invoices'));

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});
