import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
            <h1>🔐 Autentificare</h1>
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Adresa ta de email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        style={{ 
                            width: '100%', 
                            padding: '10px', 
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
                        Parolă
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Parola ta"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                        style={{ 
                            width: '100%', 
                            padding: '10px', 
                            borderRadius: '4px',
                            border: '1px solid #ccc'
                        }}
                    />
                </div>

                {displayError && (
                    <div style={{ 
                        color: '#dc3545', 
                        backgroundColor: '#f8d7da', 
                        padding: '10px', 
                        borderRadius: '4px',
                        marginBottom: '15px'
                    }}>
                        {displayError}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        width: '100%', 
                        padding: '12px',
                        backgroundColor: loading ? '#6c757d' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '16px'
                    }}
                >
                    {loading ? 'Se autentifică...' : 'Intră în cont'}
                </button>
            </form>

            <p style={{ marginTop: '20px', textAlign: 'center' }}>
                Nu ai cont?{' '}
                <Link to="/register" style={{ color: '#007bff' }}>
                    Înregistrează-te
                </Link>
            </p>
        </div>
    );
}

export default LoginPage;
