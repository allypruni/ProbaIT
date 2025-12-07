import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
    const navigate = useNavigate();
    const { login, error, setError } = useAuth();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Curăță erorile când utilizatorul modifică câmpurile
        setLocalError('');
        if (setError) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validare de bază
        if (!formData.email || !formData.password) {
            setLocalError('Te rog completează toate câmpurile');
            return;
        }

        setLoading(true);
        setLocalError('');

        try {
            const result = await login({
                email: formData.email,
                password: formData.password
            });

            if (result.success) {
                // Redirect la profile după login reușit
                navigate('/profile');
            } else {
                setLocalError(result.error || 'Eroare la autentificare');
            }
        } catch (err) {
            setLocalError(err.message || 'Eroare la autentificare');
        } finally {
            setLoading(false);
        }
    };

    const displayError = localError || error;

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1 className="auth-title">🔐 Autentificare</h1>
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Adresa ta de email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Parolă</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Parola ta"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    {displayError && (
                        <div className="auth-error">
                            {displayError}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="auth-submit"
                    >
                        {loading ? 'Se autentifică...' : 'Intră în cont'}
                    </button>
                </form>

                <p className="auth-link">
                    Nu ai cont?{' '}
                    <Link to="/register">Înregistrează-te</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
