import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import GrillCard from '../components/GrillCard';
import PostGrillModal from '../components/PostGrillModal';
import './ProfilePage.css';

function ProfilePage() {
    const { user, token } = useAuth();
    
    // State pentru grills
    const [myGrills, setMyGrills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // State pentru modal
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    // Funcție pentru încărcarea grills-urilor userului
    const loadMyGrills = useCallback(async () => {
        if (!token) return;
        
        setLoading(true);
        setError('');
        
        try {
            const response = await apiClient.get('/grills/mine', { authToken: token });
            setMyGrills(response.grills || []);
        } catch (err) {
            setError(err.message || 'Eroare la încărcarea grătarelor');
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Încarcă grills la montare
    useEffect(() => {
        loadMyGrills();
    }, [loadMyGrills]);

    // Handlers pentru modal
    const openPostModal = () => setIsPostModalOpen(true);
    const closePostModal = () => setIsPostModalOpen(false);
    
    // Callback după crearea unui grill
    const handleGrillCreated = () => {
        loadMyGrills();
    };

    if (!user) {
        return (
            <div className="profile-page">
                <div className="grills-loading">
                    <p>Se încarcă...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* Card Profil Utilizator - Stânga */}
                <div className="profile-card">
                    <h2>👤 Profilul Meu</h2>
                    
                    <div className="profile-info">
                        <div className="profile-info-item">
                            <label>Nume</label>
                            <span>{user.name}</span>
                        </div>
                        
                        <div className="profile-info-item">
                            <label>Email</label>
                            <span>{user.email}</span>
                        </div>
                        
                        {user.phone && (
                            <div className="profile-info-item">
                                <label>Telefon</label>
                                <span>{user.phone}</span>
                            </div>
                        )}
                        
                        <div className="profile-info-item">
                            <label>Rol</label>
                            <span>
                                {user.role === 'admin' ? '👑 Administrator' : '🔥 Utilizator'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Zona Grills - Dreapta */}
                <div className="grills-section">
                    <div className="grills-header">
                        <h2>🍖 Grătarele Mele</h2>
                        <button 
                            className="btn-post-grill"
                            onClick={openPostModal}
                        >
                            + Post a grill
                        </button>
                    </div>

                    {/* Stări de încărcare / eroare / gol */}
                    {loading && (
                        <div className="grills-loading">
                            <p>Se încarcă grătarele...</p>
                        </div>
                    )}

                    {error && (
                        <div className="grills-error">
                            <p>{error}</p>
                        </div>
                    )}

                    {!loading && !error && myGrills.length === 0 && (
                        <div className="grills-empty">
                            <p>
                                Nu ai încă niciun grill postat.<br />
                                Folosește butonul <strong>"Post a grill"</strong> pentru a adăuga primul tău grill.
                            </p>
                        </div>
                    )}

                    {/* Grid de Grills */}
                    {!loading && !error && myGrills.length > 0 && (
                        <div className="grills-grid">
                            {myGrills.map(grill => (
                                <GrillCard
                                    key={grill.id}
                                    title={grill.title}
                                    description={grill.description}
                                    imageUrl={grill.imageUrl}
                                    likesCount={grill.likesCount}
                                    createdAt={grill.createdAt}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal pentru postare grill */}
            <PostGrillModal
                isOpen={isPostModalOpen}
                onClose={closePostModal}
                onCreated={handleGrillCreated}
            />
        </div>
    );
}

export default ProfilePage;
