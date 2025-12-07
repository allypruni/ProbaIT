import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';

/**
 * Modal pentru postarea unui grill nou
 */
function PostGrillModal({ isOpen, onClose, onCreated }) {
    const { token } = useAuth();
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: ''
    });
    const [imagePreview, setImagePreview] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Nu afișa nimic dacă modalul nu e deschis
    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    // Handler pentru încărcarea imaginii
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Verifică tipul fișierului
        if (!file.type.startsWith('image/')) {
            setError('Te rog selectează o imagine validă (JPG, PNG, GIF)');
            return;
        }

        // Verifică dimensiunea (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Imaginea este prea mare. Dimensiunea maximă este 5MB');
            return;
        }

        // Convertește imaginea în base64
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setFormData(prev => ({
                ...prev,
                imageUrl: base64String
            }));
            setImagePreview(base64String);
            setError('');
        };
        reader.onerror = () => {
            setError('Eroare la încărcarea imaginii');
        };
        reader.readAsDataURL(file);
    };

    // Șterge imaginea
    const handleRemoveImage = () => {
        setFormData(prev => ({
            ...prev,
            imageUrl: ''
        }));
        setImagePreview('');
        // Resetează input-ul de file
        const fileInput = document.getElementById('imageFile');
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validare
        if (!formData.title.trim()) {
            setError('Titlul este obligatoriu');
            return;
        }
        if (formData.description.length < 10) {
            setError('Descrierea trebuie să aibă minim 10 caractere');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const payload = {
                title: formData.title.trim(),
                description: formData.description.trim()
            };
            
            // Adaugă imageUrl doar dacă e completat
            if (formData.imageUrl.trim()) {
                payload.imageUrl = formData.imageUrl.trim();
            }

            await apiClient.post('/grills', payload, { authToken: token });
            
            // Succes - resetează formularul și închide modalul
            setFormData({ title: '', description: '', imageUrl: '' });
            
            if (onCreated) {
                onCreated();
            }
            onClose();
            
        } catch (err) {
            setError(err.message || 'Eroare la crearea grill-ului');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        setFormData({ title: '', description: '', imageUrl: '' });
        setError('');
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={handleCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>🔥 Postează un Grătar</h2>
                    <button className="modal-close" onClick={handleCancel}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Titlu *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Numele grătarului tău"
                            value={formData.title}
                            onChange={handleChange}
                            disabled={submitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Descriere * (minim 10 caractere)</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Descrie grătarul tău în detaliu..."
                            value={formData.description}
                            onChange={handleChange}
                            disabled={submitting}
                            rows={4}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="imageFile">Imagine (opțional)</label>
                        <input
                            type="file"
                            id="imageFile"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={submitting}
                            style={{ display: 'none' }}
                        />
                        <button
                            type="button"
                            className="btn-upload"
                            onClick={() => document.getElementById('imageFile').click()}
                            disabled={submitting}
                        >
                            📷 Alege o imagine
                        </button>
                        {imagePreview && (
                            <div className="image-preview-container">
                                <img src={imagePreview} alt="Preview" className="image-preview" />
                                <button
                                    type="button"
                                    className="btn-remove-image"
                                    onClick={handleRemoveImage}
                                    disabled={submitting}
                                >
                                    ✕ Șterge imaginea
                                </button>
                            </div>
                        )}
                        <small style={{ display: 'block', marginTop: '8px', color: '#666' }}>
                            Max 5MB - JPG, PNG, GIF
                        </small>
                    </div>

                    {error && (
                        <div className="modal-error">
                            {error}
                        </div>
                    )}

                    <div className="modal-actions">
                        <button 
                            type="button" 
                            className="btn-cancel"
                            onClick={handleCancel}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn-submit"
                            disabled={submitting}
                        >
                            {submitting ? 'Se postează...' : '🔥 Post this grill!'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PostGrillModal;
