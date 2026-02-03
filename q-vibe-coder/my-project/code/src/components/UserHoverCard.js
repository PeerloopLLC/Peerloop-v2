import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FaEnvelope } from 'react-icons/fa';
import './UserHoverCard.css';

/**
 * UserHoverCard Component
 * X.com-style hover popup showing user info with Follow and Message buttons
 *
 * @param {Object} user - User data (name, handle, avatar, bio)
 * @param {React.ReactNode} children - The element that triggers the hover
 * @param {Function} onFollow - Callback when Follow is clicked
 * @param {Function} onMessage - Callback when Message is clicked
 * @param {Function} onViewProfile - Callback when clicking user info
 * @param {boolean} isFollowing - Whether current user follows this user
 */
const UserHoverCard = ({
  user,
  children,
  onFollow,
  onMessage,
  onViewProfile,
  isFollowing = false,
  currentUserId = null
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const cardRef = useRef(null);
  const showTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  // Don't show hover card for own profile
  const isSelf = currentUserId && user?.id === currentUserId;

  const showCard = () => {
    if (isSelf) return;

    clearTimeout(hideTimeoutRef.current);
    showTimeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const cardWidth = 280;
        const cardHeight = 200;

        // Position below the trigger, centered
        let top = rect.bottom + 8;
        let left = rect.left + (rect.width / 2) - (cardWidth / 2);

        // Keep within viewport bounds
        if (left < 10) left = 10;
        if (left + cardWidth > window.innerWidth - 10) {
          left = window.innerWidth - cardWidth - 10;
        }

        // If card would go below viewport, show above trigger instead
        if (top + cardHeight > window.innerHeight - 10) {
          top = rect.top - cardHeight - 8;
        }

        setPosition({ top, left });
        setIsVisible(true);
      }
    }, 300); // 300ms delay before showing
  };

  const hideCard = () => {
    clearTimeout(showTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 200); // Small delay to allow moving to card
  };

  const keepCardVisible = () => {
    clearTimeout(hideTimeoutRef.current);
  };

  useEffect(() => {
    return () => {
      clearTimeout(showTimeoutRef.current);
      clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const handleFollowClick = (e) => {
    e.stopPropagation();
    if (onFollow) onFollow(user);
  };

  const handleMessageClick = (e) => {
    e.stopPropagation();
    if (onMessage) onMessage(user);
  };

  const handleCardClick = () => {
    if (onViewProfile) onViewProfile(user);
  };

  // Generate display values
  const displayName = user?.name || user?.author || 'User';
  const handle = user?.handle || user?.authorHandle || `@${displayName.toLowerCase().replace(/\s+/g, '')}`;
  const avatar = user?.avatar || user?.authorAvatar;
  const bio = user?.bio || user?.shortBio || '';
  const followers = user?.followers || Math.floor(Math.random() * 500) + 20;
  const following = user?.following || Math.floor(Math.random() * 200) + 10;

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={showCard}
        onMouseLeave={hideCard}
        style={{ display: 'inline' }}
      >
        {children}
      </span>

      {isVisible && ReactDOM.createPortal(
        <div
          ref={cardRef}
          className="user-hover-card"
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            zIndex: 9999
          }}
          onMouseEnter={keepCardVisible}
          onMouseLeave={hideCard}
        >
          {/* User Info Section */}
          <div className="hover-card-header" onClick={handleCardClick}>
            <div className="hover-card-avatar">
              {avatar ? (
                <img src={avatar} alt={displayName} />
              ) : (
                <div className="hover-card-avatar-initials">
                  {displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
              )}
            </div>
            <div className="hover-card-names">
              <span className="hover-card-name">{displayName}</span>
              <span className="hover-card-handle">{handle}</span>
            </div>
          </div>

          {/* Bio */}
          {bio && (
            <div className="hover-card-bio">
              {bio.length > 100 ? bio.substring(0, 100) + '...' : bio}
            </div>
          )}

          {/* Action Buttons */}
          <div className="hover-card-actions">
            <button
              className={`hover-card-btn follow-btn ${isFollowing ? 'following' : ''}`}
              onClick={handleFollowClick}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
            <button
              className="hover-card-btn message-btn"
              onClick={handleMessageClick}
            >
              <FaEnvelope />
              <span>Message</span>
            </button>
          </div>

          {/* Stats */}
          <div className="hover-card-stats">
            <span><strong>{followers}</strong> Followers</span>
            <span><strong>{following}</strong> Following</span>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default UserHoverCard;
