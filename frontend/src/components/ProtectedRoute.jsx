import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componentă pentru rutele protejate
 * Redirecționează către /login dacă utilizatorul nu este autentificat
 */
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    // Afișează loading în timp ce verificăm autentificarea
    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '200px' 
            }}>
                <p>Se încarcă...</p>
            </div>
        );
    }

    // Redirecționează dacă nu este autentificat
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Afișează conținutul dacă este autentificat
    return children;
};

export default ProtectedRoute;
