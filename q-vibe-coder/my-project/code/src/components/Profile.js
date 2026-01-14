import React, { useState, useEffect } from 'react';
import './Profile.css';
import {
  FaUserEdit,
  FaBookmark,
  FaHistory,
  FaCog,
  FaShieldAlt,
  FaQuestionCircle,
  FaSignOutAlt,
  FaCamera,
  FaEdit,
  FaSave,
  FaTimes,
  FaGraduationCap,
  FaTrophy,
  FaCalendar,
  FaClock,
  FaStar,
  FaMoon,
  FaSun,
  FaUsers
} from 'react-icons/fa';

const Profile = ({ currentUser, onSwitchUser, onMenuChange, isDarkMode, toggleDarkMode }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Albert Einstein',
    handle: '@alberteinstein',
    email: 'albert.einstein@physics.edu',
    bio: 'Theoretical physicist who developed the theory of relativity, one of the two pillars of modern physics. Nobel Prize laureate in Physics for his explanation of the photoelectric effect.',
    location: 'Princeton, NJ',
    website: 'https://einstein-archive.org',
    avatar: 'https://via.placeholder.com/120x120/FFD700/000000?text=AE'
  });

  // Text darkness level for light mode (1-5, where 1 is lightest, 5 is darkest)
  const [textDarkness, setTextDarkness] = useState(() => {
    const saved = localStorage.getItem('textDarknessLevel');
    return saved ? parseInt(saved, 10) : 3; // Default to level 3 (medium)
  });

  // Community navigation style preference: 'pills' (top bar) or 'dropdown' (sidebar flyout)
  const [communityNavStyle, setCommunityNavStyle] = useState(() => {
    const saved = localStorage.getItem('communityNavStyle');
    return saved || 'slideout'; // Default to slideout panel
  });

  // Text darkness color mapping (1=light, 7=pure black)
  const darknessColors = {
    1: '#6b7280', // Light gray
    2: '#4b5563', // Medium gray
    3: '#374151', // Dark gray
    4: '#1f2937', // Very dark gray
    5: '#111827', // Near black
    6: '#0a0a0a', // Almost black
    7: '#000000'  // Pure black
  };

  // Apply text darkness CSS variable when it changes (only in light mode)
  useEffect(() => {
    localStorage.setItem('textDarknessLevel', textDarkness.toString());
    document.documentElement.style.setProperty('--text-darkness', darknessColors[textDarkness]);
  }, [textDarkness]);

  // Save community navigation preference when it changes
  useEffect(() => {
    localStorage.setItem('communityNavStyle', communityNavStyle);
    // Dispatch custom event so other components in same tab can update
    window.dispatchEvent(new CustomEvent('communityNavStyleChanged', { detail: communityNavStyle }));
  }, [communityNavStyle]);

  // Apply on mount
  useEffect(() => {
    document.documentElement.style.setProperty('--text-darkness', darknessColors[textDarkness]);
  }, []);

  const profileSections = [
    { id: 'overview', label: 'Overview', icon: <FaUserEdit /> },
    { id: 'bookmarks', label: 'Bookmarks', icon: <FaBookmark /> },
    { id: 'history', label: 'History', icon: <FaHistory /> },
    { id: 'settings', label: 'Settings', icon: <FaCog /> },
    { id: 'privacy', label: 'Privacy & Security', icon: <FaShieldAlt /> },
    { id: 'help', label: 'Help & Support', icon: <FaQuestionCircle /> }
  ];

  // Render horizontal tab bar with Edit Profile button
  const renderTabBar = () => (
    <div className="profile-tab-bar">
      {profileSections.map(section => (
        <button
          key={section.id}
          className={`profile-tab-item${activeSection === section.id ? ' active' : ''}`}
          onClick={() => setActiveSection(section.id)}
        >
          <span className="tab-icon">{section.icon}</span>
          <span>{section.label}</span>
        </button>
      ))}
      {/* Edit Profile button in tab bar */}
      {!isEditing ? (
        <button className="profile-tab-item edit-profile-tab-btn" onClick={() => setIsEditing(true)} title="Edit Profile">
          <FaEdit style={{marginRight: 4}} />
          <span className="hide-on-narrow">Edit</span>
        </button>
      ) : (
        <span className="edit-actions-inline">
          <button className="save-btn small" onClick={handleSave} title="Save"><FaSave /></button>
          <button className="cancel-btn small" onClick={handleCancel} title="Cancel"><FaTimes /></button>
        </span>
      )}
    </div>
  );

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    console.log('Profile saved:', profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
  };

  // Add a switch user button and creator profile link at the bottom
  const renderSwitchUserButton = () => (
    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
      <button onClick={onSwitchUser} style={{ background: '#444', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.7rem 2rem', fontSize: '1.1rem', cursor: 'pointer', marginRight: '1rem' }}>
        Switch User
      </button>
      {currentUser.roles.includes('creator') && (
        <button 
          onClick={() => onMenuChange('CreatorProfile')} 
          style={{ 
            background: '#4A90E2', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '4px', 
            padding: '0.7rem 2rem', 
            fontSize: '1.1rem', 
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Creator Studio
        </button>
      )}
      <div style={{ marginTop: '0.5rem', color: '#888', fontSize: '0.95rem' }}>
        Current: <strong>{currentUser.name}</strong> ({currentUser.roles.join(', ')})
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="profile-overview">
      <div className="profile-details">
        {isEditing ? (
          <div className="edit-form">
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Handle</label>
              <input 
                type="text" 
                value={profileData.handle}
                onChange={(e) => setProfileData({...profileData, handle: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea 
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input 
                type="text" 
                value={profileData.location}
                onChange={(e) => setProfileData({...profileData, location: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input 
                type="url" 
                value={profileData.website}
                onChange={(e) => setProfileData({...profileData, website: e.target.value})}
              />
            </div>
          </div>
        ) : (
          <div className="profile-info-display">
            <h2>{profileData.name}</h2>
            <p className="profile-handle">{profileData.handle}</p>
            <p className="profile-bio">{profileData.bio}</p>
            <div className="profile-meta">
              <div className="meta-item">
                <FaCalendar />
                <span>Joined January 2023</span>
              </div>
              <div className="meta-item">
                <FaClock />
                <span>Last active 2 hours ago</span>
              </div>
            </div>
            <div className="profile-links">
              <div className="link-item">
                <strong>Email:</strong> {profileData.email}
              </div>
              <div className="link-item">
                <strong>Location:</strong> {profileData.location}
              </div>
              <div className="link-item">
                <strong>Website:</strong> <a href={profileData.website} target="_blank" rel="noopener noreferrer">{profileData.website}</a>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Avatar at the bottom (temporarily removed for debugging) */}
      {/* Stats row at the bottom */}
      <div className="profile-stats-inline" style={{marginTop: 8}}>
        <span><FaGraduationCap style={{marginRight: 4}}/> 12 Content Created</span>
        <span style={{marginLeft: 18}}><FaTrophy style={{marginRight: 4}}/> 2,500 Students</span>
        <span style={{marginLeft: 18}}><FaStar style={{marginRight: 4}}/> 4.9 Rating</span>
      </div>
      {renderSwitchUserButton()}
    </div>
  );

  const renderBookmarks = () => (
    <div className="bookmarks-section">
      <h2>Bookmarked Content</h2>
      <div className="bookmarks-grid">
        <div className="bookmark-item">
          <div className="bookmark-content">
            <h3>Advanced React Patterns</h3>
            <p>Bookmarked on March 15, 2024</p>
            <div className="bookmark-meta">
              <span className="course-type">Course</span>
              <span className="bookmark-time">2 hours ago</span>
            </div>
          </div>
        </div>
        <div className="bookmark-item">
          <div className="bookmark-content">
            <h3>UI/UX Design Principles</h3>
            <p>Bookmarked on March 10, 2024</p>
            <div className="bookmark-meta">
              <span className="course-type">Course</span>
              <span className="bookmark-time">5 days ago</span>
            </div>
          </div>
        </div>
        <div className="bookmark-item">
          <div className="bookmark-content">
            <h3>JavaScript Best Practices</h3>
            <p>Bookmarked on March 5, 2024</p>
            <div className="bookmark-meta">
              <span className="course-type">Article</span>
              <span className="bookmark-time">1 week ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );



  const renderHistory = () => (
    <div className="history-section">
      <h2>Learning History</h2>
      <div className="history-timeline">
        <div className="history-item">
          <div className="history-date">March 15, 2024</div>
          <div className="history-content">
            <h3>Completed: Advanced React Patterns</h3>
            <p>Finished all modules and received certificate</p>
            <div className="history-meta">
              <span className="completion-time">15 hours</span>
              <span className="grade">Grade: A+</span>
            </div>
          </div>
        </div>
        <div className="history-item">
          <div className="history-date">March 10, 2024</div>
          <div className="history-content">
            <h3>Completed: UI/UX Design Masterclass</h3>
            <p>Finished all modules and received certificate</p>
            <div className="history-meta">
              <span className="completion-time">12 hours</span>
              <span className="grade">Grade: A</span>
            </div>
          </div>
        </div>
        <div className="history-item">
          <div className="history-date">March 5, 2024</div>
          <div className="history-content">
            <h3>Started: JavaScript Deep Dive</h3>
            <p>Progress: 60% complete</p>
            <div className="history-meta">
              <span className="completion-time">10.8 hours</span>
              <span className="progress">Progress: 60%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="settings-section">
      <h2>Account Settings</h2>
      <div className="settings-grid">
        <div className="setting-group">
          <h3>Notifications</h3>
          <div className="setting-item">
            <span>Email notifications</span>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="setting-item">
            <span>Push notifications</span>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="setting-item">
            <span>Course updates</span>
            <input type="checkbox" />
          </div>
        </div>

        <div className="setting-group">
          <h3>Display</h3>
          <div className="setting-item theme-toggle-item">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isDarkMode ? <FaMoon style={{ color: '#1d9bf0' }} /> : <FaSun style={{ color: '#f59e0b' }} />}
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
            <button
              onClick={toggleDarkMode}
              style={{
                background: isDarkMode ? '#1d9bf0' : '#e2e8f0',
                color: isDarkMode ? '#fff' : '#0f1419',
                border: 'none',
                borderRadius: '20px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
              Switch to {isDarkMode ? 'Light' : 'Dark'}
            </button>
          </div>
          
          {/* Text Darkness control - only shown in Light Mode */}
          {!isDarkMode && (
            <div className="setting-item text-darkness-item">
              <div style={{ marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>Aa</span>
                  Text Darkness (Light Mode)
                </span>
              </div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5, 6, 7].map((level) => (
                  <button
                    key={level}
                    onClick={() => setTextDarkness(level)}
                    style={{
                      width: '32px',
                      height: '32px',
                      border: textDarkness === level ? '2px solid #1d9bf0' : '1px solid #d1d5db',
                      borderRadius: '6px',
                      background: textDarkness === level ? '#e0f2fe' : '#fff',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: textDarkness === level ? '700' : '500',
                      color: darknessColors[level],
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '11px', 
                color: '#9ca3af',
                marginTop: '4px',
                paddingLeft: '4px',
                paddingRight: '4px'
              }}>
                <span>Light</span>
                <span>Dark</span>
              </div>
            </div>
          )}

          {/* Community Navigation Style */}
          <div className="setting-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaUsers style={{ color: '#1d9bf0' }} />
              Community Navigation
            </span>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                onClick={() => setCommunityNavStyle('pills')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: communityNavStyle === 'pills' ? '2px solid #1d9bf0' : '1px solid #d1d5db',
                  background: communityNavStyle === 'pills' ? (isDarkMode ? 'rgba(29, 155, 240, 0.15)' : '#e0f2fe') : (isDarkMode ? '#2f3336' : '#fff'),
                  color: communityNavStyle === 'pills' ? '#1d9bf0' : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Pills (Top Bar)
              </button>
              <button
                onClick={() => setCommunityNavStyle('dropdown')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: communityNavStyle === 'dropdown' ? '2px solid #1d9bf0' : '1px solid #d1d5db',
                  background: communityNavStyle === 'dropdown' ? (isDarkMode ? 'rgba(29, 155, 240, 0.15)' : '#e0f2fe') : (isDarkMode ? '#2f3336' : '#fff'),
                  color: communityNavStyle === 'dropdown' ? '#1d9bf0' : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Dropdown (Sidebar)
              </button>
              <button
                onClick={() => setCommunityNavStyle('selector')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: communityNavStyle === 'selector' ? '2px solid #1d9bf0' : '1px solid #d1d5db',
                  background: communityNavStyle === 'selector' ? (isDarkMode ? 'rgba(29, 155, 240, 0.15)' : '#e0f2fe') : (isDarkMode ? '#2f3336' : '#fff'),
                  color: communityNavStyle === 'selector' ? '#1d9bf0' : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Selector (Card)
              </button>
              <button
                onClick={() => setCommunityNavStyle('slideout')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: communityNavStyle === 'slideout' ? '2px solid #1d9bf0' : '1px solid #d1d5db',
                  background: communityNavStyle === 'slideout' ? (isDarkMode ? 'rgba(29, 155, 240, 0.15)' : '#e0f2fe') : (isDarkMode ? '#2f3336' : '#fff'),
                  color: communityNavStyle === 'slideout' ? '#1d9bf0' : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Slide-out (Panel)
              </button>
            </div>
            <span style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
              Choose how to switch between communities in the Feeds view
            </span>
          </div>

          <div className="setting-item">
            <span>Show progress bars</span>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="privacy-section">
      <h2>Privacy & Security</h2>
      <div className="privacy-options">
        <div className="privacy-item">
          <h3>Profile Visibility</h3>
          <select defaultValue="public">
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="friends">Friends Only</option>
          </select>
        </div>
        
        <div className="privacy-item">
          <h3>Two-Factor Authentication</h3>
          <button className="enable-2fa-btn">Enable 2FA</button>
        </div>
        
        <div className="privacy-item">
          <h3>Password</h3>
          <button className="change-password-btn">Change Password</button>
        </div>
      </div>
    </div>
  );

  const renderHelp = () => (
    <div className="help-section">
      <h2>Help & Support</h2>
      <div className="help-options">
        <div className="help-item">
          <h3>FAQ</h3>
          <p>Find answers to common questions</p>
          <button className="help-btn">Browse FAQ</button>
        </div>
        
        <div className="help-item">
          <h3>Contact Support</h3>
          <p>Get help from our support team</p>
          <button className="help-btn">Contact Us</button>
        </div>
        
        <div className="help-item">
          <h3>Documentation</h3>
          <p>Read our detailed documentation</p>
          <button className="help-btn">View Docs</button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'bookmarks':
        return renderBookmarks();
      case 'history':
        return renderHistory();
      case 'settings':
        return renderSettings();
      case 'privacy':
        return renderPrivacy();
      case 'help':
        return renderHelp();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="profile">
      {renderTabBar()}
      <div className="profile-main">
        {renderContent()}
      </div>
    </div>
  );
};

export default Profile; 