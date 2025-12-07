// ============================================
// Pimp Your Grill - Backend Server
// ============================================

// Import modules
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const grillsRoutes = require('./routes/grills');

// App initialization
const app = express();

// ============================================
// Database Connection
// ============================================
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pimp-your-grill';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Conectat la MongoDB:', MONGO_URI);
    })
    .catch(error => {
        console.error('❌ Eroare conectare MongoDB:', error.message);
        process.exit(1);
    });

// ============================================
// Middleware
// ============================================
app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ============================================
// Routes
// ============================================

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok',
        message: 'Pimp Your Grill API is running!',
        timestamp: new Date().toISOString()
    });
});

// Auth routes: /api/auth/register, /api/auth/login, /api/auth/me
app.use('/api/auth', authRoutes);

// Grills routes: /api/grills/...
app.use('/api/grills', grillsRoutes);

// ============================================
// 404 Handler - Route not found
// ============================================
app.use((req, res, next) => {
    res.status(404).json({ 
        message: `Ruta ${req.method} ${req.originalUrl} nu a fost găsită` 
    });
});

// ============================================
// Global Error Handler
// ============================================
app.use((err, req, res, next) => {
    console.error('❌ Eroare server:', err);
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ 
            message: 'Eroare de validare',
            errors: messages 
        });
    }
    
    // Mongoose duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({ 
            message: 'Există deja o înregistrare cu aceste date' 
        });
    }
    
    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({ 
            message: 'ID invalid' 
        });
    }

    // Default server error
    res.status(err.status || 500).json({ 
        message: err.message || 'Eroare internă de server' 
    });
});

// ============================================
// Server Start
// ============================================
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
    console.log('');
    console.log('🔥 ================================');
    console.log('🔥  Pimp Your Grill - Backend');
    console.log('🔥 ================================');
    console.log(`🚀 Server pornit pe portul ${PORT}`);
    console.log('');
    console.log('📡 Endpoint-uri disponibile:');
    console.log('   GET  /api/health');
    console.log('   POST /api/auth/register');
    console.log('   POST /api/auth/login');
    console.log('   GET  /api/auth/me (protejat)');
    console.log('   GET  /api/grills/test');
    console.log('');
});

module.exports = app;
