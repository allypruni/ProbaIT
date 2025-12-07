const express = require('express');
const router = express.Router();
const { body, query, param, validationResult } = require('express-validator');
const Grill = require('../models/Grill');
const { authRequired, adminRequired } = require('../middleware/auth');

/**
 * Helper pentru a colecta și trimite erorile de validare
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            message: 'Erori de validare',
            errors: errors.array() 
        });
    }
    next();
};

/**
 * Formatează un grill pentru răspuns
 */
const formatGrill = (grill, currentUserId = null) => {
    return {
        id: grill._id,
        title: grill.title,
        description: grill.description,
        imageUrl: grill.imageUrl || null,
        likesCount: grill.likes ? grill.likes.length : 0,
        likedByCurrentUser: currentUserId 
            ? grill.likes.some(id => id.toString() === currentUserId.toString())
            : false,
        owner: grill.owner ? {
            id: grill.owner._id || grill.owner,
            name: grill.owner.name || null,
            email: grill.owner.email || null
        } : null,
        createdAt: grill.createdAt,
        updatedAt: grill.updatedAt
    };
};

// ============================================
// GET /api/grills/test - Healthcheck
// ============================================
router.get('/test', (req, res) => {
    res.status(200).json({ 
        message: 'Grills API funcționează!',
        timestamp: new Date().toISOString()
    });
});

// ============================================
// GET /api/grills/leaderboard - Top grills
// PUBLIC - returnează cele mai populare grills
// ============================================
router.get('/leaderboard', [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 }).withMessage('Limit trebuie să fie între 1 și 50')
], handleValidationErrors, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3;

        // Găsește toate grills și sortează după numărul de likes
        const grills = await Grill.find()
            .populate('owner', 'name email')
            .lean();

        // Sortează descrescător după numărul de likes și ia primele `limit`
        const sortedGrills = grills
            .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
            .slice(0, limit);

        const formattedGrills = sortedGrills.map(grill => ({
            id: grill._id,
            title: grill.title,
            imageUrl: grill.imageUrl || null,
            likesCount: grill.likes?.length || 0,
            owner: grill.owner ? {
                id: grill.owner._id,
                name: grill.owner.name
            } : null
        }));

        res.status(200).json({
            grills: formattedGrills
        });

    } catch (error) {
        console.error('Eroare la leaderboard:', error);
        res.status(500).json({ message: 'Eroare de server' });
    }
});

// ============================================
// GET /api/grills/mine - Grills ale userului curent
// PROTECTED - necesită autentificare
// ============================================
router.get('/mine', authRequired, async (req, res) => {
    try {
        const grills = await Grill.find({ owner: req.user.id })
            .populate('owner', 'name email')
            .sort({ createdAt: -1 })
            .lean();

        const formattedGrills = grills.map(grill => formatGrill(grill, req.user.id));

        res.status(200).json({
            grills: formattedGrills
        });

    } catch (error) {
        console.error('Eroare la obținerea grills:', error);
        res.status(500).json({ message: 'Eroare de server' });
    }
});

// ============================================
// GET /api/grills - Lista toate grills + search + sort
// PUBLIC - nu necesită autentificare
// ============================================
router.get('/', [
    query('q')
        .optional()
        .trim(),
    query('sort')
        .optional()
        .isIn(['new', 'top']).withMessage('Sort trebuie să fie "new" sau "top"')
], handleValidationErrors, async (req, res) => {
    try {
        const { q, sort = 'new' } = req.query;

        // Construiește query-ul
        let queryFilter = {};
        
        if (q && q.trim()) {
            // Căutare case-insensitive în title și description
            const searchRegex = new RegExp(q.trim(), 'i');
            queryFilter = {
                $or: [
                    { title: searchRegex },
                    { description: searchRegex }
                ]
            };
        }

        // Execută query-ul
        let grills = await Grill.find(queryFilter)
            .populate('owner', 'name email')
            .lean();

        // Sortare
        if (sort === 'top') {
            // Sortează după numărul de likes (descrescător)
            grills.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        } else {
            // sort === 'new' - sortează după createdAt (descrescător)
            grills.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        const formattedGrills = grills.map(grill => formatGrill(grill));

        res.status(200).json({
            grills: formattedGrills,
            total: formattedGrills.length
        });

    } catch (error) {
        console.error('Eroare la listare grills:', error);
        res.status(500).json({ message: 'Eroare de server' });
    }
});

// ============================================
// GET /api/grills/:id - Detalii grill
// PUBLIC
// ============================================
router.get('/:id', [
    param('id')
        .isMongoId().withMessage('ID invalid')
], handleValidationErrors, async (req, res) => {
    try {
        const grill = await Grill.findById(req.params.id)
            .populate('owner', 'name email')
            .lean();

        if (!grill) {
            return res.status(404).json({ message: 'Grill not found' });
        }

        res.status(200).json({
            grill: formatGrill(grill)
        });

    } catch (error) {
        console.error('Eroare la obținerea grill:', error);
        res.status(500).json({ message: 'Eroare de server' });
    }
});

// ============================================
// POST /api/grills - Creare grill nou
// PROTECTED - necesită autentificare
// ============================================
router.post('/', authRequired, [
    body('title')
        .trim()
        .notEmpty().withMessage('Titlul este obligatoriu')
        .isLength({ min: 3 }).withMessage('Titlul trebuie să aibă minim 3 caractere'),
    body('description')
        .trim()
        .notEmpty().withMessage('Descrierea este obligatorie')
        .isLength({ min: 10 }).withMessage('Descrierea trebuie să aibă minim 10 caractere'),
    body('imageUrl')
        .optional()
        .trim()
        .custom((value) => {
            if (value && value.length === 0) {
                throw new Error('imageUrl nu poate fi string gol');
            }
            return true;
        })
], handleValidationErrors, async (req, res) => {
    try {
        const { title, description, imageUrl } = req.body;

        const grill = new Grill({
            title,
            description,
            imageUrl: imageUrl || undefined,
            owner: req.user.id,
            likes: []
        });

        await grill.save();

        // Populează owner pentru răspuns
        await grill.populate('owner', 'name email');

        res.status(201).json({
            message: 'Grill creat cu succes',
            grill: formatGrill(grill.toObject(), req.user.id)
        });

    } catch (error) {
        console.error('Eroare la crearea grill:', error);
        res.status(500).json({ message: 'Eroare de server' });
    }
});

// ============================================
// PUT /api/grills/:id - Update grill
// PROTECTED - doar owner sau admin
// ============================================
router.put('/:id', authRequired, [
    param('id')
        .isMongoId().withMessage('ID invalid'),
    body('title')
        .optional()
        .trim()
        .isLength({ min: 3 }).withMessage('Titlul trebuie să aibă minim 3 caractere'),
    body('description')
        .optional()
        .trim()
        .isLength({ min: 10 }).withMessage('Descrierea trebuie să aibă minim 10 caractere'),
    body('imageUrl')
        .optional()
        .trim()
], handleValidationErrors, async (req, res) => {
    try {
        const grill = await Grill.findById(req.params.id);

        if (!grill) {
            return res.status(404).json({ message: 'Grill not found' });
        }

        // Verifică permisiunile: admin sau owner
        const isAdmin = req.user.role === 'admin';
        const isOwner = grill.owner.toString() === req.user.id;

        if (!isAdmin && !isOwner) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Actualizează doar câmpurile permise
        const { title, description, imageUrl } = req.body;

        if (title !== undefined) grill.title = title;
        if (description !== undefined) grill.description = description;
        if (imageUrl !== undefined) grill.imageUrl = imageUrl;

        await grill.save();

        // Populează owner pentru răspuns
        await grill.populate('owner', 'name email');

        res.status(200).json({
            message: 'Grill actualizat cu succes',
            grill: formatGrill(grill.toObject(), req.user.id)
        });

    } catch (error) {
        console.error('Eroare la actualizarea grill:', error);
        res.status(500).json({ message: 'Eroare de server' });
    }
});

// ============================================
// DELETE /api/grills/:id - Ștergere grill
// PROTECTED - doar owner sau admin
// ============================================
router.delete('/:id', authRequired, [
    param('id')
        .isMongoId().withMessage('ID invalid')
], handleValidationErrors, async (req, res) => {
    try {
        const grill = await Grill.findById(req.params.id);

        if (!grill) {
            return res.status(404).json({ message: 'Grill not found' });
        }

        // Verifică permisiunile: admin sau owner
        const isAdmin = req.user.role === 'admin';
        const isOwner = grill.owner.toString() === req.user.id;

        if (!isAdmin && !isOwner) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Grill.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Grill deleted' });

    } catch (error) {
        console.error('Eroare la ștergerea grill:', error);
        res.status(500).json({ message: 'Eroare de server' });
    }
});

// ============================================
// POST /api/grills/:id/like - Toggle MIC (like/unlike)
// PROTECTED - necesită autentificare
// ============================================
router.post('/:id/like', authRequired, [
    param('id')
        .isMongoId().withMessage('ID invalid')
], handleValidationErrors, async (req, res) => {
    try {
        const grill = await Grill.findById(req.params.id);

        if (!grill) {
            return res.status(404).json({ message: 'Grill not found' });
        }

        const userId = req.user.id;
        const likeIndex = grill.likes.findIndex(id => id.toString() === userId);

        let likedByCurrentUser;

        if (likeIndex === -1) {
            // User-ul NU a dat like → adaugă like
            grill.likes.push(userId);
            likedByCurrentUser = true;
        } else {
            // User-ul a dat deja like → scoate like
            grill.likes.splice(likeIndex, 1);
            likedByCurrentUser = false;
        }

        await grill.save();

        res.status(200).json({
            id: grill._id,
            likesCount: grill.likes.length,
            likedByCurrentUser
        });

    } catch (error) {
        console.error('Eroare la like/unlike:', error);
        res.status(500).json({ message: 'Eroare de server' });
    }
});

module.exports = router;
