import React from 'react';
import { FaComment, FaHeart } from 'react-icons/fa';

/**
 * SelectedCommunityView Component
 * Full page view of a selected community with header, posts, and guidelines
 *
 * @param {Object} community - Selected community data
 * @param {Array} posts - Posts for this community
 * @param {Function} onBack - Callback to go back
 * @param {Function} onFollowCommunity - Toggle follow callback
 * @param {boolean} isFollowed - Whether user follows this community
 */
const SelectedCommunityView = ({
  community,
  posts = [],
  onBack,
  onFollowCommunity,
  isFollowed = false
}) => {
  if (!community) return null;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: 0 }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: '10px 16px',
          margin: '16px',
          cursor: 'pointer',
          fontWeight: 600,
          color: '#64748b'
        }}
      >
        ← Back to Communities
      </button>

      {/* Community Header Card */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        margin: '0 16px 24px 16px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        {/* Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          height: 120
        }} />

        {/* Content */}
        <div style={{ padding: '0 24px 24px 24px', marginTop: -40 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 16 }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: 12,
              background: '#fff',
              border: '4px solid #fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32
            }}>
              📚
            </div>
            <div style={{ flex: 1, paddingBottom: 8 }}>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#1e293b' }}>
                {community.name}
              </h1>
              <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: 14 }}>
                {community.topic}
              </p>
            </div>
            <button
              onClick={() => onFollowCommunity(community.id)}
              style={{
                background: isFollowed ? '#e2e8f0' : '#3b82f6',
                color: isFollowed ? '#64748b' : '#fff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer'
              }}
            >
              {isFollowed ? 'Joined Community' : 'Join Community'}
            </button>
          </div>

          {/* Description */}
          <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.6, margin: '0 0 16px 0' }}>
            {community.description}
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 24, fontSize: 14, color: '#64748b' }}>
            <span>
              <strong style={{ color: '#1e293b' }}>{community.members?.toLocaleString()}</strong> members
            </span>
            <span>
              <strong style={{ color: '#1e293b' }}>{community.posts}</strong> posts
            </span>
            <span>
              Created by <strong style={{ color: '#1e293b' }}>{community.instructor}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Community Feed */}
      <div style={{ margin: '0 16px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: '0 0 16px 0' }}>
          Community Posts
        </h2>

        {posts.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {posts.map(post => (
              <div key={post.id} style={{
                background: '#fff',
                borderRadius: 12,
                padding: 20,
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <img
                    src={post.authorAvatar}
                    alt={post.author}
                    style={{ width: 40, height: 40, borderRadius: '50%' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>
                      {post.author}
                    </div>
                    <div style={{ color: '#64748b', fontSize: 12 }}>
                      {post.authorHandle} • {post.timestamp}
                    </div>
                  </div>
                </div>
                <p style={{ margin: '0 0 12px 0', color: '#334155', fontSize: 15, lineHeight: 1.5 }}>
                  {post.content}
                </p>
                <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#64748b' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FaComment /> {post.replies}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FaHeart /> {post.likes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 40,
            textAlign: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>No posts yet</h3>
            <p style={{ margin: 0, color: '#64748b' }}>
              Be the first to start a discussion in this community!
            </p>
          </div>
        )}
      </div>

      {/* Community Info */}
      <div style={{ margin: '24px 16px' }}>
        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: 20,
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 600, color: '#1e293b' }}>
            Community Guidelines
          </h3>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#475569', fontSize: 14, lineHeight: 1.8 }}>
            <li>Be respectful and inclusive in all discussions</li>
            <li>Share knowledge and help others learn</li>
            <li>Keep discussions relevant to the course topic</li>
            <li>No spam or self-promotion without value</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SelectedCommunityView;
