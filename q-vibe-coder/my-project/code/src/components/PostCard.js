import React from 'react';
import { FaComment, FaRetweet, FaHeart, FaBookmark, FaShare } from 'react-icons/fa';
import UserHoverCard from './UserHoverCard';

/**
 * PostCard Component
 * Displays an individual post in the community feed
 *
 * @param {Object} post - Post data including author, content, metrics
 * @param {boolean} isDarkMode - Dark mode flag
 * @param {Function} onViewUserProfile - Callback when clicking author
 * @param {Function} onViewCourse - Callback when clicking course tag
 * @param {Function} onFollowUser - Callback when following a user
 * @param {Function} onMessageUser - Callback when messaging a user
 * @param {Array} followingUsers - List of user IDs the current user follows
 * @param {string} currentUserId - Current user's ID
 */
const PostCard = ({
  post,
  isDarkMode = false,
  onViewUserProfile = null,
  onViewCourse = null,
  onFollowUser = null,
  onMessageUser = null,
  followingUsers = [],
  currentUserId = null
}) => {
  const handlePostAuthorClick = () => {
    if (onViewUserProfile) {
      onViewUserProfile(post.author);
    }
  };

  return (
    <div className="post-card">
      <div className="post-card-header">
        <img
          className="post-card-avatar"
          src={post.authorAvatar}
          alt={post.author}
          onClick={handlePostAuthorClick}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            objectFit: 'cover',
            cursor: 'pointer',
            transition: 'transform 0.15s, box-shadow 0.15s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(255,255,255,0.2)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          title={`View ${post.author}'s profile`}
        />
        <div className="post-card-header-info">
          <div className="post-card-name-row">
            <UserHoverCard
              user={{
                id: post.authorId,
                name: post.author,
                handle: post.authorHandle,
                avatar: post.authorAvatar,
                bio: post.authorBio
              }}
              onFollow={onFollowUser}
              onMessage={onMessageUser}
              onViewProfile={() => onViewUserProfile && onViewUserProfile(post.author)}
              isFollowing={followingUsers.includes(post.authorId)}
              currentUserId={currentUserId}
            >
              <span
                className="post-card-author"
                onClick={handlePostAuthorClick}
                style={{ cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
              >
                {post.author}
              </span>
            </UserHoverCard>
            <span
              className="post-card-handle"
              onClick={handlePostAuthorClick}
              style={{ cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.color = '#1d9bf0'}
              onMouseLeave={e => e.currentTarget.style.color = ''}
            >
              {post.authorHandle}
            </span>
            <span className="post-card-dot">·</span>
            <span className="post-card-timestamp">{post.timestamp}</span>
          </div>
          {post.community && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {post.isPinned && (
                <span style={{
                  background: isDarkMode ? 'rgba(29, 155, 240, 0.2)' : 'rgba(29, 155, 240, 0.1)',
                  color: '#1d9bf0',
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: 4,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3
                }}>
                  📌 Pinned
                </span>
              )}
              {(post.isTownHallExclusive || post.isCreatorTownHall) ? (
                <span
                  className="post-card-community"
                  style={{
                    background: post.isCreatorTownHall
                      ? (isDarkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)')
                      : (isDarkMode ? 'rgba(29, 155, 240, 0.15)' : 'rgba(29, 155, 240, 0.1)'),
                    color: post.isCreatorTownHall ? '#8b5cf6' : '#1d9bf0',
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontWeight: 500,
                    cursor: 'default'
                  }}
                >
                  {post.community}
                </span>
              ) : (
                <span
                  className="post-card-community"
                  onClick={() => {
                    if (onViewCourse && post.courseId) {
                      onViewCourse(post.courseId);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                  title={`View ${post.community} course`}
                >
                  in {post.community}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="post-card-content">{post.content}</div>
      <div className="post-card-actions">
        <button className="post-action-btn">
          <FaComment />
          <span>{post.replies}</span>
        </button>
        <button className="post-action-btn">
          <FaRetweet />
          <span>{Math.floor(post.likes * 0.3)}</span>
        </button>
        <button className="post-action-btn">
          <FaHeart />
          <span>{post.likes}</span>
        </button>
        <button className="post-action-btn">
          <FaBookmark />
        </button>
        <button className="post-action-btn">
          <FaShare />
        </button>
      </div>
    </div>
  );
};

export default PostCard;
