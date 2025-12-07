import React from 'react';

/**
 * Componentă pentru afișarea unui grill în format card
 * Poate fi reutilizată în ProfilePage și BestGrillsPage
 */
function GrillCard({ 
    title, 
    description, 
    imageUrl, 
    likesCount = 0, 
    createdAt, 
    ownerName,
    likedByCurrentUser = false,
    onToggleLike,
    clickable = false,
    onClick
}) {
    // Formatează data
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ro-RO', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Trunchiază descrierea dacă e prea lungă
    const truncateDescription = (text, maxLength = 120) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    // Handler pentru click pe butonul de like
    const handleLikeClick = (e) => {
        e.stopPropagation(); // Previne click pe card
        if (onToggleLike) {
            onToggleLike();
        }
    };

    // Handler pentru click pe card
    const handleCardClick = () => {
        if (clickable && onClick) {
            onClick();
        }
    };

    return (
        <div 
            className={`grill-card ${clickable ? 'grill-card-clickable' : ''}`}
            onClick={handleCardClick}
            style={clickable ? { cursor: 'pointer' } : {}}
        >
            {/* Imagine sau placeholder */}
            <div className="grill-card-image">
                {imageUrl ? (
                    <img 
                        src={imageUrl} 
                        alt={title}
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div class="grill-card-placeholder">🔥</div>';
                        }}
                    />
                ) : (
                    <div className="grill-card-placeholder">
                        🔥
                    </div>
                )}
            </div>

            {/* Conținut */}
            <div className="grill-card-content">
                <h3 className="grill-card-title">{title}</h3>
                <p className="grill-card-description">
                    {truncateDescription(description)}
                </p>
                
                <div className="grill-card-footer">
                    {/* Buton MIC / Like */}
                    <div 
                        className={`grill-card-likes ${likedByCurrentUser ? 'liked' : ''} ${onToggleLike ? 'clickable' : ''}`}
                        onClick={onToggleLike ? handleLikeClick : undefined}
                        style={onToggleLike ? { cursor: 'pointer' } : {}}
                    >
                        <span className="mic-icon">🍖</span>
                        <strong>{likesCount}</strong>
                        <span className="mic-text">MICI</span>
                        {onToggleLike && (
                            <span className="like-action">
                                {likedByCurrentUser ? '✓' : '+'}
                            </span>
                        )}
                    </div>
                    <div className="grill-card-date">
                        {formatDate(createdAt)}
                    </div>
                </div>
                
                {ownerName && (
                    <div className="grill-card-owner">
                        👤 {ownerName}
                    </div>
                )}
            </div>
        </div>
    );
}

export default GrillCard;
