import React from 'react';
import './GrillDetailsModal.css';

/**
 * Modal pentru afișarea detaliilor complete ale unui grill
 * Layout: două coloane (imagine stânga, conținut dreapta)
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
        <div className="grill-modal-overlay" onClick={handleOverlayClick}>
            <div className="grill-modal-panel">
                {/* Buton X de închidere */}
                <button className="grill-modal-close" onClick={onClose} aria-label="Închide">
                    ×
                </button>

                {/* Layout cu două coloane */}
                <div className="grill-modal-content">
                    {/* Stânga: Imagine mare */}
                    <div className="grill-modal-left">
                        {grill.imageUrl ? (
                            <img 
                                src={grill.imageUrl} 
                                alt={grill.title} 
                                className="grill-modal-image"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<div class="grill-modal-placeholder"><span class="placeholder-icon">🔥</span></div>';
                                }}
                            />
                        ) : (
                            <div className="grill-modal-placeholder">
                                <span className="placeholder-icon">🔥</span>
                            </div>
                        )}
                    </div>

                    {/* Dreapta: Informații și conținut */}
                    <div className="grill-modal-right">
                        {/* Titlu */}
                        <h1 className="grill-modal-title">{grill.title}</h1>

                        {/* Zonă informații (Owner, Data, Likes count) */}
                        <div className="grill-modal-info">
                            {grill.owner && (
                                <div className="grill-info-item">
                                    <span className="info-icon">👤</span>
                                    <span className="info-text">{grill.owner.name}</span>
                                </div>
                            )}
                            
                            <div className="grill-info-item">
                                <span className="info-icon">📅</span>
                                <span className="info-text">{formatDate(grill.createdAt)}</span>
                            </div>

                            <div className="grill-info-item">
                                <span className="info-icon">🍖</span>
                                <span className="info-text info-highlight">
                                    {grill.likesCount || 0} MICI
                                </span>
                            </div>
                        </div>

                        {/* Descriere scrollabilă */}
                        <div className="grill-modal-description">
                            <h3 className="description-label">Descriere</h3>
                            <div className="description-text">
                                {grill.description || 'Fără descriere disponibilă pentru acest grătar.'}
                            </div>
                        </div>

                        {/* Warning pentru utilizatori neautentificați */}
                        {!isAuthenticated && (
                            <div className="grill-modal-warning">
                                ⚠️ Trebuie să fii autentificat pentru a da MIC
                            </div>
                        )}

                        {/* Butoane acțiuni */}
                        <div className="grill-modal-actions">
                            {/* Buton principal MIC */}
                            <button 
                                className={`grill-btn-primary ${grill.likedByCurrentUser ? 'liked' : ''}`}
                                onClick={handleLikeClick}
                                disabled={!isAuthenticated}
                                title={!isAuthenticated ? 'Trebuie să fii autentificat pentru a da MIC' : ''}
                            >
                                <span className="btn-icon">🍖</span>
                                <span className="btn-text">
                                    {grill.likedByCurrentUser ? 'Ai dat MIC!' : 'Dă un MIC!'}
                                </span>
                            </button>

                            {/* Buton secundar Close (opțional) */}
                            <button 
                                className="grill-btn-secondary"
                                onClick={onClose}
                            >
                                Închide
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GrillDetailsModal;
