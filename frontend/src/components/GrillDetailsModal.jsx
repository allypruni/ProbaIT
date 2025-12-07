import React from 'react';

/**
 * Modal pentru afișarea detaliilor complete ale unui grill
 */
function GrillDetailsModal({ grill, onClose, onToggleLike, isAuthenticated }) {
    // Nu afișa nimic dacă nu există grill
    if (!grill) return null;

    // Formatează data
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ro-RO', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleLikeClick = () => {
        if (onToggleLike) {
            onToggleLike(grill.id);
        }
    };

    return (
        <div className="grill-details-overlay" onClick={handleOverlayClick}>
            <div className="grill-details-modal">
                {/* Header cu buton close */}
                <div className="grill-details-header">
                    <h2>🔥 Detalii Grătar</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {/* Imagine */}
                <div className="grill-details-image">
                    {grill.imageUrl ? (
                        <img src={grill.imageUrl} alt={grill.title} />
                    ) : (
                        <div className="grill-details-placeholder">
                            🔥
                        </div>
                    )}
                </div>

                {/* Conținut */}
                <div className="grill-details-content">
                    <h1 className="grill-details-title">{grill.title}</h1>
                    
                    {/* Owner info */}
                    {grill.owner && (
                        <div className="grill-details-owner">
                            <span className="owner-icon">👤</span>
                            <span className="owner-name">{grill.owner.name}</span>
                        </div>
                    )}

                    {/* Descriere completă */}
                    <div className="grill-details-description">
                        <h3>Descriere</h3>
                        <p>{grill.description || 'Fără descriere.'}</p>
                    </div>

                    {/* Footer cu likes și data */}
                    <div className="grill-details-footer">
                        <div className="grill-details-stats">
                            {/* Buton MIC */}
                            <button 
                                className={`mic-button ${grill.likedByCurrentUser ? 'liked' : ''}`}
                                onClick={handleLikeClick}
                                disabled={!isAuthenticated}
                                title={!isAuthenticated ? 'Trebuie să fii autentificat pentru a da MIC' : ''}
                            >
                                <span className="mic-icon">🍖</span>
                                <span className="mic-count">{grill.likesCount || 0}</span>
                                <span className="mic-label">
                                    {grill.likedByCurrentUser ? 'Ai dat MIC!' : 'Dă un MIC!'}
                                </span>
                            </button>
                        </div>
                        
                        <div className="grill-details-date">
                            📅 Postat pe {formatDate(grill.createdAt)}
                        </div>
                    </div>

                    {!isAuthenticated && (
                        <p className="auth-warning">
                            ⚠️ Trebuie să fii autentificat pentru a da MIC unui grătar.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GrillDetailsModal;
