const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authRequired } = require('../middleware/auth');

/**
 * Generează JWT token
 */
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

/**
 * POST /api/auth/register
 * Înregistrare utilizator nou
 */
router.post('/register', [
    body('name')
        .trim()
        .notEmpty().withMessage('Numele este obligatoriu'),
    body('email')
        .trim()
        .isEmail().withMessage('Email-ul trebuie să fie valid')
        .normalizeEmail(),
    body('phone')
        .optional()
        .trim(),
    body('password')
        .isLength({ min: 6 }).withMessage('Parola trebuie să aibă minim 6 caractere'),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Parolele nu coincid');
            }
            return true;
        })
], async (req, res) => {
    try {
        // Verifică erorile de validare
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: 'Erori de validare',
                errors: errors.array() 
            });
        }

        const { name, email, phone, password } = req.body;

        // Verifică dacă email-ul există deja
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'Un utilizator cu acest email există deja' 
            });
        }

        // Hash parola
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Creează utilizatorul
        const user = new User({
            name,
            email,
            phone: phone || '',
            password: hashedPassword,
            role: 'user'
        });

        await user.save();

        // Generează token
        const token = generateToken(user);

        // Răspuns
        res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.error('Eroare la înregistrare:', error);
        res.status(500).json({ 
            message: 'Eroare de server la înregistrare' 
        });
    }
});

/**
 * POST /api/auth/login
 * Autentificare utilizator
 */
router.post('/login', [
    body('email')
        .trim()
        .isEmail().withMessage('Email-ul trebuie să fie valid')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Parola este obligatorie')
], async (req, res) => {
    try {
        // Verifică erorile de validare
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: 'Erori de validare',
                errors: errors.array() 
            });
        }

        const { email, password } = req.body;

        // Caută utilizatorul
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                message: 'Credențiale invalide' 
            });
        }

        // Verifică parola
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                message: 'Credențiale invalide' 
            });
        }

        // Generează token
        const token = generateToken(user);

        // Răspuns
        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.error('Eroare la autentificare:', error);
        res.status(500).json({ 
            message: 'Eroare de server la autentificare' 
        });
    }
});

/**
 * GET /api/auth/me
 * Obține datele utilizatorului curent (protejată)
 */
router.get('/me', authRequired, async (req, res) => {
    try {
        // Găsește utilizatorul după ID-ul din token (fără parolă)
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                message: 'Utilizatorul nu a fost găsit' 
            });
        }

        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Eroare la obținerea datelor utilizatorului:', error);
        res.status(500).json({ 
            message: 'Eroare de server' 
        });
    }
});

module.exports = router;
