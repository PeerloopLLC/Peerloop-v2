import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FaUsers } from 'react-icons/fa';
import './UserHoverCard.css'; // Reuse same CSS

/**
 * CommunityHoverCard Component
 * X.com-style hover popup showing community info with Follow button
 */
const CommunityHoverCard = ({
  community,
  children,
  onFollow,
  onViewCommunity,
  isFollowing = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const cardRef = useRef(null);
  const showTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  const showCard = () => {
    clearTimeout(hideTimeoutRef.current);
    showTimeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const cardWidth = 300;
        const cardHeight = 250; // Slightly larger estimate for safety

        let left = rect.left + (rect.width / 2) - (cardWidth / 2);

        // Horizontal bounds
        if (left < 10) left = 10;
        if (left + cardWidth > window.innerWidth - 10) {
          left = window.innerWidth - cardWidth - 10;
        }

        // Vertical positioning: prefer below, but go above if not enough space
        let top;
        const spaceBelow = window.innerHeight - rect.bottom - 10;
        const spaceAbove = rect.top - 10;

        if (spaceBelow >= cardHeight) {
          // Enough space below
          top = rect.bottom + 8;
        } else if (spaceAbove >= cardHeight) {
          // Not enough below, but enough above
          top = rect.top - cardHeight - 8;
        } else {
          // Not enough space either way, position at top of viewport
          top = 10;
        }

        setPosition({ top, left });
        setIsVisible(true);
      }
    }, 300);
  };

  const hideCard = () => {
    clearTimeout(showTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 200);
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
    if (onFollow) onFollow(community);
  };

  const handleCardClick = () => {
    if (onViewCommunity) onViewCommunity(community);
  };

  // Generate display values
  const name = community?.communityName || community?.name || 'Community';
  const handle = community?.handle || `@${name.toLowerCase().replace(/\s+/g, '').replace(/\./g, '')}`;
  const creatorName = community?.creatorName || community?.instructor?.name || '';
  const followers = community?.followers || community?.stats?.studentsTaught || Math.floor(Math.random() * 5000) + 100;
  const bio = community?.bio || community?.description || '';
  const coursesCount = community?.coursesCount || community?.courses?.length || 0;

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
            zIndex: 99999,
            width: 300
          }}
          onMouseEnter={keepCardVisible}
          onMouseLeave={hideCard}
        >
          {/* Community Header */}
          <div className="hover-card-header" onClick={handleCardClick}>
            <div className="hover-card-avatar" style={{
              background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%'
            }}>
              <FaUsers style={{ color: 'white', fontSize: 20 }} />
            </div>
            <div className="hover-card-names">
              <span className="hover-card-name">{name}</span>
              <span className="hover-card-handle">{handle}</span>
            </div>
          </div>

          {/* Creator */}
          {creatorName && (
            <div style={{
              fontSize: 13,
              color: '#64748b',
              marginBottom: 8
            }}>
              Created by <span style={{ color: '#0ea5e9' }}>{creatorName}</span>
            </div>
          )}

          {/* Bio */}
          {bio && (
            <div className="hover-card-bio">
              {bio.length > 120 ? bio.substring(0, 120) + '...' : bio}
            </div>
          )}

          {/* Action Button */}
          <div className="hover-card-actions">
            <button
              className={`hover-card-btn follow-btn ${isFollowing ? 'following' : ''}`}
              onClick={handleFollowClick}
              style={{ flex: 1 }}
            >
              {isFollowing ? 'Following' : 'Follow Community'}
            </button>
          </div>

          {/* Stats */}
          <div className="hover-card-stats">
            <span><strong>{followers.toLocaleString()}</strong> followers</span>
            {coursesCount > 0 && (
              <span><strong>{coursesCount}</strong> courses</span>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default CommunityHoverCard;
