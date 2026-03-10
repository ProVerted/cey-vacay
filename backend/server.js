const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();   // loads variables from .env file

const app = express();

// ── Middleware ──────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://cey-vacay.vercel.app',  
  ],
  credentials: true,
}));            // allows frontend to call this backend
app.use(express.json());      // lets us read JSON from request body

// ── Routes (we'll fill these in next phase) ─────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));

// ── Test Route ───────────────────────────────────────
app.get('/', (req, res) => {
  res.send('Travel Platform API is running!');
});

// ── Connect to MongoDB then Start Server ─────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected!');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });