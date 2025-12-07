const jwt = require('jsonwebtoken');

/**
 * Middleware pentru verificare autentificare JWT
 * Citește header-ul Authorization: Bearer <token>
 * Dacă e valid, atașează req.user = { id, role }
 */
const authRequired = (req, res, next) => {
    try {
        // Verifică dacă există header Authorization
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ 
                message: 'Acces neautorizat. Token lipsă.' 
            });
        }

        // Verifică formatul Bearer <token>
        const parts = authHeader.split(' ');
        
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ 
                message: 'Acces neautorizat. Format token invalid.' 
            });
        }

        const token = parts[1];

        // Verifică și decodează token-ul
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Atașează datele utilizatorului la request
        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Acces neautorizat. Token expirat.' 
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Acces neautorizat. Token invalid.' 
            });
        }

        return res.status(401).json({ 
            message: 'Acces neautorizat.' 
        });
    }
};

/**
 * Middleware opțional pentru verificare rol admin
 */
const adminRequired = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ 
        message: 'Acces interzis. Rol de admin necesar.' 
    });
};

module.exports = {
    authRequired,
    adminRequired
};
