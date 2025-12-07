import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

// Creăm contextul
const AuthContext = createContext(null);

/**
 * Hook pentru a folosi contextul de autentificare
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth trebuie folosit în interiorul AuthProvider');
    }
    return context;
};

/**
 * Provider pentru autentificare
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Inițializare din localStorage la mount
     */
    useEffect(() => {
        const initAuth = async () => {
            try {
                const savedToken = localStorage.getItem('authToken');
                const savedUser = localStorage.getItem('authUser');

                if (savedToken && savedUser) {
                    // Verificăm dacă token-ul este încă valid
                    try {
                        const response = await apiClient.get('/auth/me', { 
                            authToken: savedToken 
                        });
                        
                        setUser(response.user);
                        setToken(savedToken);
                    } catch (err) {
                        // Token invalid sau expirat - curățăm
                        console.log('Token invalid, curățăm localStorage');
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('authUser');
                    }
                }
            } catch (err) {
                console.error('Eroare la inițializarea auth:', err);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    /**
     * Înregistrare utilizator nou
     * @param {object} formData - { name, email, phone, password, confirmPassword }
     */
    const register = async (formData) => {
        setError(null);
        
        try {
            const response = await apiClient.post('/auth/register', formData);
            
            // Auto-login după înregistrare
            const { user: newUser, token: newToken } = response;
            
            setUser(newUser);
            setToken(newToken);
            
            localStorage.setItem('authToken', newToken);
            localStorage.setItem('authUser', JSON.stringify(newUser));
            
            return { success: true, user: newUser };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    /**
     * Autentificare utilizator
     * @param {object} credentials - { email, password }
     */
    const login = async (credentials) => {
        setError(null);
        
        try {
            const response = await apiClient.post('/auth/login', credentials);
            
            const { user: loggedUser, token: authToken } = response;
            
            setUser(loggedUser);
            setToken(authToken);
            
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('authUser', JSON.stringify(loggedUser));
            
            return { success: true, user: loggedUser };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    /**
     * Deconectare utilizator
     */
    const logout = () => {
        setUser(null);
        setToken(null);
        setError(null);
        
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
    };

    /**
     * Verifică dacă utilizatorul este autentificat
     */
    const isAuthenticated = !!user && !!token;

    const value = {
        user,
        token,
        loading,
        error,
        isAuthenticated,
        register,
        login,
        logout,
        setError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
