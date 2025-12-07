import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
            <h1>📝 Înregistrare</h1>
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>
                        Nume *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Numele tău"
                        value={formData.name}
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
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
                        Email *
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
                    <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px' }}>
                        Telefon (opțional)
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="Numărul tău de telefon"
                        value={formData.phone}
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
                        Parolă * (minim 6 caractere)
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Alege o parolă"
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

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>
                        Confirmă parola *
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Repetă parola"
                        value={formData.confirmPassword}
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
                        backgroundColor: loading ? '#6c757d' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '16px'
                    }}
                >
                    {loading ? 'Se creează contul...' : 'Creează cont'}
                </button>
            </form>

            <p style={{ marginTop: '20px', textAlign: 'center' }}>
                Ai deja cont?{' '}
                <Link to="/login" style={{ color: '#007bff' }}>
                    Autentifică-te
                </Link>
            </p>
        </div>
    );
}

export default RegisterPage;
