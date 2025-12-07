import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import GrillCard from '../components/GrillCard';
import GrillDetailsModal from '../components/GrillDetailsModal';
import './BestGrillsPage.css';

function BestGrillsPage() {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    
    // State pentru lista principală
    const [grills, setGrills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // State pentru leaderboard
    const [leaderboard, setLeaderboard] = useState([]);
    const [leaderboardLoading, setLeaderboardLoading] = useState(true);
    const [leaderboardError, setLeaderboardError] = useState('');
    
    // State pentru search și sort
    const [searchTerm, setSearchTerm] = useState('');
    const [sortMode, setSortMode] = useState('new');
    
    // State pentru modal detalii
    const [selectedGrill, setSelectedGrill] = useState(null);

    // Funcție pentru încărcarea listei de grills
    const loadGrills = useCallback(async () => {
        setLoading(true);
        setError('');
        
        try {
            let url = `/grills?sort=${sortMode}`;
            if (searchTerm.trim()) {
                url += `&q=${encodeURIComponent(searchTerm.trim())}`;
            }
            
            const options = {};
            if (token) {
                options.authToken = token;
            }
            
            const response = await apiClient.get(url, options);
            setGrills(response.grills || []);
        } catch (err) {
            setError(err.message || 'Eroare la încărcarea grătarelor');
        } finally {
            setLoading(false);
        }
    }, [sortMode, searchTerm, token]);

    // Funcție pentru încărcarea leaderboard-ului
    const loadLeaderboard = useCallback(async () => {
        setLeaderboardLoading(true);
        setLeaderboardError('');
        
        try {
            const options = {};
            if (token) {
                options.authToken = token;
            }
            
            const response = await apiClient.get('/grills/leaderboard?limit=5', options);
            setLeaderboard(response.grills || []);
        } catch (err) {
            setLeaderboardError(err.message || 'Eroare la încărcarea leaderboard-ului');
        } finally {
            setLeaderboardLoading(false);
        }
    }, [token]);

    // Încarcă datele la montare și când se schimbă sortMode
    useEffect(() => {
        loadGrills();
    }, [sortMode]); // Doar sortMode, nu și loadGrills pentru a evita loop

    useEffect(() => {
        loadLeaderboard();
    }, []); // O singură dată la montare

    // Handler pentru search
    const handleSearch = (e) => {
        e.preventDefault();
        loadGrills();
    };

    // Handler pentru toggle like
    const handleToggleLike = async (grillId) => {
        if (!user) {
            alert('Trebuie să fii autentificat pentru a da MIC unui grătar!');
            navigate('/login');
            return;
        }

        try {
            const response = await apiClient.post(
                `/grills/${grillId}/like`, 
                {}, 
                { authToken: token }
            );
            
            // Actualizează lista principală
            setGrills(prev => prev.map(grill => 
                grill.id === response.id 
                    ? { ...grill, likesCount: response.likesCount, likedByCurrentUser: response.likedByCurrentUser }
                    : grill
            ));
            
            // Actualizează leaderboard
            setLeaderboard(prev => prev.map(grill => 
                grill.id === response.id 
                    ? { ...grill, likesCount: response.likesCount, likedByCurrentUser: response.likedByCurrentUser }
                    : grill
            ));
            
            // Actualizează și în modal dacă e deschis
            if (selectedGrill && selectedGrill.id === response.id) {
                setSelectedGrill(prev => ({
                    ...prev,
                    likesCount: response.likesCount,
                    likedByCurrentUser: response.likedByCurrentUser
                }));
            }
            
            // Reîncarcă leaderboard pentru a actualiza pozițiile
            loadLeaderboard();
            
        } catch (err) {
            alert(err.message || 'Eroare la procesarea like-ului');
        }
    };

    // Handler pentru click pe card (deschide modal)
    const handleCardClick = (grill) => {
        setSelectedGrill(grill);
    };

    // Handler pentru închidere modal
    const handleCloseModal = () => {
        setSelectedGrill(null);
    };

    // Funcție pentru a obține clasa pentru rank
    const getRankClass = (index) => {
        if (index === 0) return 'gold';
        if (index === 1) return 'silver';
        if (index === 2) return 'bronze';
        return '';
    };

    // Funcție pentru a obține emoji pentru rank
    const getRankEmoji = (index) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return `#${index + 1}`;
    };

    return (
        <div className="best-grills-page">
            <h1>🔥 Best Grills</h1>

            {/* Search & Sort Section */}
            <div className="search-sort-section">
                <form className="search-form" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Caută grătare după nume sau descriere..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit">🔍 Caută</button>
                </form>
                
                <div className="sort-buttons">
                    <span>Sortează după:</span>
                    <button 
                        className={`sort-btn ${sortMode === 'new' ? 'active' : ''}`}
                        onClick={() => setSortMode('new')}
                    >
                        🕐 Cele mai noi
                    </button>
                    <button 
                        className={`sort-btn ${sortMode === 'top' ? 'active' : ''}`}
                        onClick={() => setSortMode('top')}
                    >
                        ⭐ Cele mai apreciate
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="best-grills-content">
                {/* Grills for Pimps - Lista principală */}
                <div className="grills-for-pimps">
                    <h2>🍖 Grills for Pimps</h2>
                    
                    {loading && (
                        <div className="loading-state">
                            <p>Se încarcă grătarele...</p>
                        </div>
                    )}
                    
                    {error && (
                        <div className="error-state">
                            <p>{error}</p>
                        </div>
                    )}
                    
                    {!loading && !error && grills.length === 0 && (
                        <div className="empty-state">
                            <p>
                                {searchTerm 
                                    ? `Nu am găsit grătare pentru "${searchTerm}".` 
                                    : 'Nu există încă grătare postate.'}
                            </p>
                        </div>
                    )}
                    
                    {!loading && !error && grills.length > 0 && (
                        <div className="grills-grid">
                            {grills.map(grill => (
                                <GrillCard
                                    key={grill.id}
                                    title={grill.title}
                                    description={grill.description}
                                    imageUrl={grill.imageUrl}
                                    likesCount={grill.likesCount}
                                    createdAt={grill.createdAt}
                                    ownerName={grill.owner?.name}
                                    likedByCurrentUser={grill.likedByCurrentUser}
                                    onToggleLike={() => handleToggleLike(grill.id)}
                                    clickable={true}
                                    onClick={() => handleCardClick(grill)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* THE BEST GRILLS - Leaderboard */}
                <div className="leaderboard-section">
                    <h2>🏆 THE BEST GRILLS</h2>
                    
                    {leaderboardLoading && (
                        <div className="loading-state" style={{ color: 'white' }}>
                            <p>Se încarcă...</p>
                        </div>
                    )}
                    
                    {leaderboardError && (
                        <div className="error-state">
                            <p>{leaderboardError}</p>
                        </div>
                    )}
                    
                    {!leaderboardLoading && !leaderboardError && leaderboard.length === 0 && (
                        <div className="empty-state" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}>
                            <p>Nu există încă grătare în clasament.</p>
                        </div>
                    )}
                    
                    {!leaderboardLoading && !leaderboardError && leaderboard.length > 0 && (
                        <div className="leaderboard-list">
                            {leaderboard.map((grill, index) => (
                                <div 
                                    key={grill.id} 
                                    className="leaderboard-card"
                                    onClick={() => handleCardClick(grill)}
                                >
                                    <div className={`leaderboard-rank ${getRankClass(index)}`}>
                                        {getRankEmoji(index)}
                                    </div>
                                    <div className="leaderboard-info">
                                        <div className="leaderboard-title">{grill.title}</div>
                                        <div className="leaderboard-owner">
                                            {grill.owner?.name || 'Anonim'}
                                        </div>
                                    </div>
                                    <div className="leaderboard-likes">
                                        🍖 {grill.likesCount}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal pentru detalii grill */}
            <GrillDetailsModal
                grill={selectedGrill}
                onClose={handleCloseModal}
                onToggleLike={handleToggleLike}
                isAuthenticated={!!user}
            />
        </div>
    );
}

export default BestGrillsPage;
