import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

function RegisterPage() {
    const navigate = useNavigate();
    const { register, error, setError } = useAuth();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
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
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setLocalError('Te rog completează toate câmpurile obligatorii');
            return;
        }

        if (formData.password.length < 6) {
            setLocalError('Parola trebuie să aibă minim 6 caractere');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setLocalError('Parolele nu coincid');
            return;
        }

        setLoading(true);
        setLocalError('');

        try {
            const result = await register({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                confirmPassword: formData.confirmPassword
            });

            if (result.success) {
                // Auto-login reușit, redirect la profile
                navigate('/profile');
            } else {
                setLocalError(result.error || 'Eroare la înregistrare');
            }
        } catch (err) {
            setLocalError(err.message || 'Eroare la înregistrare');
        } finally {
            setLoading(false);
        }
    };

    const displayError = localError || error;

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1 className="auth-title">📝 Înregistrare</h1>
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">Nume *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Numele tău"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
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
                        <label htmlFor="phone">Telefon (opțional)</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            placeholder="Numărul tău de telefon"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Parolă * (minim 6 caractere)</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Alege o parolă"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmă parola *</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Repetă parola"
                            value={formData.confirmPassword}
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
                        {loading ? 'Se creează contul...' : 'Creează cont'}
                    </button>
                </form>

                <p className="auth-link">
                    Ai deja cont?{' '}
                    <Link to="/login">Autentifică-te</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
