import React from 'react';
import './Profile.css';
import { getUserByUsername, getUserInitials } from '../data/users';

/**
 * UserProfile Component
 * Displays any user's profile based on their username
 * Has a back button that returns to the previous page
 */
const UserProfile = ({ username, onBack, isDarkMode }) => {
  // Get user data from the users database
  const user = getUserByUsername(username);
  
  // If user not found, show error state
  if (!user) {
    return (
      <div style={{ 
        background: 'var(--bg-primary, #000)', 
        minHeight: '100vh',
        padding: 24
      }}>
        {/* Header with back button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 24
        }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary, #e7e9ea)',
              fontSize: 20,
              cursor: 'pointer',
              padding: 8,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            ←
          </button>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary, #e7e9ea)' }}>
            Profile
          </h1>
        </div>
        
        <div style={{ 
          textAlign: 'center', 
          padding: 48,
          color: 'var(--text-secondary, #71767b)'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h2 style={{ color: 'var(--text-primary, #e7e9ea)', marginBottom: 8 }}>User Not Found</h2>
          <p>We couldn't find a user with the username "{username}"</p>
          <button
            onClick={onBack}
            style={{
              marginTop: 24,
              background: '#1d9bf0',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: 20,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const initials = getUserInitials(user.name);

  return (
    <div style={{ 
      background: 'var(--bg-primary, #000)', 
      minHeight: '100vh'
    }}>
      {/* Header with back button */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-color, #2f3336)',
        position: 'sticky',
        top: 0,
        background: 'var(--bg-primary, #000)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary, #e7e9ea)',
              fontSize: 20,
              cursor: 'pointer',
              padding: 8,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
            title="Go back"
          >
            ←
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary, #e7e9ea)' }}>
              {user.name}
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary, #71767b)' }}>
              {user.stats?.coursesCompleted || 0} courses completed
            </p>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-overview">
        {/* Profile Header Banner */}
        <div style={{
          background: `linear-gradient(135deg, ${user.avatarColor || '#1d9bf0'} 0%, ${adjustColor(user.avatarColor || '#1d9bf0', -20)} 100%)`,
          height: 150,
          borderRadius: '16px 16px 0 0',
          marginBottom: -60,
          position: 'relative'
        }} />
        
        {/* Avatar and Basic Info */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, padding: '0 24px', marginBottom: 20 }}>
          {/* Large Avatar */}
          <div style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: user.avatar ? 'transparent' : (user.avatarColor || '#1d9bf0'),
            border: '4px solid var(--bg-primary, #000)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 40,
            fontWeight: 700,
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            overflow: 'hidden'
          }}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : initials}
          </div>
          
          {/* Name and Handle */}
          <div style={{ flex: 1, paddingBottom: 8 }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--text-primary, #e7e9ea)' }}>
              {user.name}
            </h1>
            <p style={{ margin: '4px 0 0', color: 'var(--text-secondary, #71767b)', fontSize: 15 }}>
              {user.username}
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              {user.roles?.map(role => (
                <span key={role} style={{
                  background: role === 'teacher' ? '#10b981' : role === 'student' ? '#1d9bf0' : role === 'creator' ? '#8b5cf6' : '#f59e0b',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: 'capitalize'
                }}>
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-details" style={{ padding: '0 24px' }}>
          <div className="profile-info-display">
            <p className="profile-bio" style={{ fontSize: 15, lineHeight: 1.5, color: 'var(--text-primary, #e7e9ea)', marginBottom: 16 }}>
              {user.bio}
            </p>
            
            <div className="profile-meta" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16, color: 'var(--text-secondary, #71767b)', fontSize: 14 }}>
              {user.location && (
                <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  📍 {user.location}
                </div>
              )}
              {user.website && (
                <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  🔗 <a href={user.website} target="_blank" rel="noopener noreferrer" style={{ color: '#1d9bf0' }}>{user.website}</a>
                </div>
              )}
              <div className="meta-item" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                📅 Joined {user.joinedDate || 'Recently'}
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
              gap: 12, 
              marginBottom: 24,
              padding: 16,
              background: 'var(--bg-secondary, #16181c)',
              borderRadius: 12
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#1d9bf0' }}>{user.stats?.coursesCompleted || 0}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary, #71767b)' }}>Courses</div>
              </div>
              {user.roles?.includes('teacher') && (
                <>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#10b981' }}>{user.stats?.coursesTeaching || 0}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary, #71767b)' }}>Teaching</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#f59e0b' }}>{user.stats?.studentsHelped || 0}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary, #71767b)' }}>Helped</div>
                  </div>
                </>
              )}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#8b5cf6' }}>{user.stats?.hoursLearned || 0}h</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary, #71767b)' }}>Learned</div>
              </div>
              {user.roles?.includes('teacher') && user.stats?.avgRating > 0 && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#ec4899' }}>⭐ {user.stats?.avgRating}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary, #71767b)' }}>Rating</div>
                </div>
              )}
              {user.roles?.includes('teacher') && user.stats?.totalEarnings > 0 && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#14b8a6' }}>${user.stats?.totalEarnings?.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary, #71767b)' }}>Earned</div>
                </div>
              )}
            </div>

            {/* Expertise Tags */}
            {user.expertise?.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary, #e7e9ea)' }}>Expertise</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {user.expertise.map(skill => (
                    <span key={skill} style={{
                      background: 'var(--bg-secondary, #2f3336)',
                      color: 'var(--text-primary, #e7e9ea)',
                      padding: '6px 14px',
                      borderRadius: 20,
                      fontSize: 13,
                      fontWeight: 500
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Currently Learning */}
            {user.currentlyLearning?.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary, #e7e9ea)' }}>📚 Currently Learning</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {user.currentlyLearning.map(course => (
                    <div key={course} style={{
                      background: 'rgba(29, 155, 240, 0.1)',
                      border: '1px solid rgba(29, 155, 240, 0.3)',
                      padding: '12px 16px',
                      borderRadius: 8,
                      fontSize: 14,
                      color: '#1d9bf0'
                    }}>
                      {course}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            {user.achievements?.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary, #e7e9ea)' }}>🏆 Achievements</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {user.achievements.map(achievement => (
                    <div key={achievement.id} style={{
                      background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.05) 100%)',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                      padding: '12px 16px',
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      minWidth: 180
                    }}>
                      <span style={{ fontSize: 24 }}>{achievement.icon}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#fbbf24' }}>{achievement.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary, #71767b)' }}>{achievement.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to adjust color brightness
function adjustColor(color, amount) {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default UserProfile;

