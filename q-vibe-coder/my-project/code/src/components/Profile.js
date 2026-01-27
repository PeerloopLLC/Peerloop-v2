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

const Profile = ({ currentUser, onSwitchUser, onMenuChange, isDarkMode, toggleDarkMode, viewingUser, onBack }) => {
  // Determine which user to display - viewingUser (from Member Search) or currentUser (own profile)
  const displayUser = viewingUser || currentUser;
  const isViewingOther = !!viewingUser;

  const [activeSection, setActiveSection] = useState('edit-profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: displayUser?.name || '',
    handle: displayUser?.username || '',
    email: displayUser?.email || '',
    bio: displayUser?.bio || '',
    location: displayUser?.location || '',
    website: displayUser?.website || '',
    avatar: displayUser?.avatar || ''
  });

  // Sync profileData when displayUser changes
  useEffect(() => {
    if (displayUser) {
      setProfileData({
        name: displayUser.name || '',
        handle: displayUser.username || '',
        email: displayUser.email || '',
        bio: displayUser.bio || '',
        location: displayUser.location || '',
        website: displayUser.website || '',
        avatar: displayUser.avatar || ''
      });
    }
  }, [displayUser]);

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

  // Banner color for profile header
  const [bannerColor, setBannerColor] = useState(() => {
    const saved = localStorage.getItem('profileBannerColor');
    return saved || 'blue'; // Default to blue
  });

  // Available banner colors
  const bannerColors = [
    { id: 'blue', label: 'Blue', color: '#e8f4f8', gradient: 'linear-gradient(135deg, #e8f4f8 0%, #d0e8f0 100%)' },
    { id: 'cream', label: 'Cream', color: '#faf5eb', gradient: 'linear-gradient(135deg, #faf5eb 0%, #f0e8d8 100%)' },
    { id: 'green', label: 'Green', color: '#f0fdf4', gradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' },
    { id: 'pink', label: 'Pink', color: '#fef3f2', gradient: 'linear-gradient(135deg, #fef3f2 0%, #fecaca 100%)' },
    { id: 'purple', label: 'Purple', color: '#f5f3ff', gradient: 'linear-gradient(135deg, #f5f3ff 0%, #e9d5ff 100%)' },
    { id: 'teal', label: 'Teal', color: '#f0fdfa', gradient: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)' },
    { id: 'orange', label: 'Orange', color: '#fff7ed', gradient: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)' },
  ];

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

  // Save banner color preference when it changes
  useEffect(() => {
    localStorage.setItem('profileBannerColor', bannerColor);
  }, [bannerColor]);

  // Apply on mount
  useEffect(() => {
    document.documentElement.style.setProperty('--text-darkness', darknessColors[textDarkness]);
  }, []);

  const profileSections = [
    { id: 'edit-profile', label: 'Profile', icon: <FaEdit /> }
  ];

  // Sub-tab state for Edit Profile section
  const [profileSubTab, setProfileSubTab] = useState('posts');

  // User-specific profile data - pulls from actual user data
  const getUserProfileData = () => {
    const userType = displayUser?.userType || 'student';

    // Role labels and colors by user type
    const roleConfig = {
      new_user: { role: 'New User', roleColor: '#6b7280' },
      student: { role: 'Student', roleColor: '#1d9bf0' },
      student_teacher: { role: 'Student-Teacher', roleColor: '#22c55e' },
      creator: { role: 'Creator', roleColor: '#a855f7' },
      admin: { role: 'Admin', roleColor: '#f59e0b' }
    };

    const { role, roleColor } = roleConfig[userType] || roleConfig.student;

    // Use actual user data with sensible fallbacks
    return {
      role,
      roleColor,
      followers: displayUser?.stats?.followers || Math.floor(Math.random() * 100) + 10,
      following: displayUser?.stats?.following || Math.floor(Math.random() * 50) + 5,
      joinedDate: displayUser?.joinedDate || 'January 2025',
      website: displayUser?.website ? displayUser.website.replace(/^https?:\/\//, '') : '',
      // Use actual posts from user data, or empty array
      posts: displayUser?.posts || [],
      // Use actual courses data
      coursesTaken: displayUser?.coursesTaken || [],
      coursesTaught: displayUser?.coursesTaught || [],
      // Teaching stats for student-teachers and creators
      teachingStats: displayUser?.teachingStats || (displayUser?.stats ? {
        students: displayUser.stats.studentsHelped || 0,
        rating: displayUser.stats.avgRating || 0,
        comeback: 85,
        earned: displayUser.stats.totalEarnings || 0
      } : null),
      // Courses they can teach (for student-teachers)
      canTeach: displayUser?.canTeach || []
    };
  };

  const userProfileData = getUserProfileData();

  // Render horizontal tab bar (Edit Profile is now a regular tab)
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

  // Log out button
  const renderLogoutButton = () => (
    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
      <button
        onClick={onSwitchUser}
        style={{
          background: isDarkMode ? '#374151' : '#f3f4f6',
          color: isDarkMode ? '#f87171' : '#dc2626',
          border: isDarkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '0.7rem 2rem',
          fontSize: '1rem',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '500'
        }}
      >
        <FaSignOutAlt />
        Log Out
      </button>
    </div>
  );

  const renderOverview = () => (
    <div className="profile-overview">
      <div className="profile-details">
        {isEditing ? (
          <div className="edit-form">
            {/* Avatar edit section */}
            <div className="form-group avatar-edit-group" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={profileData.avatar || 'https://via.placeholder.com/80'}
                  alt="Profile"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #e5e7eb'
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newUrl = prompt('Enter new avatar URL:', profileData.avatar);
                    if (newUrl) {
                      setProfileData({...profileData, avatar: newUrl});
                    }
                  }}
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#1d9bf0',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Change avatar"
                >
                  <FaCamera size={12} />
                </button>
              </div>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Profile Photo</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>Click the camera icon to change</div>
              </div>
            </div>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <img
                src={profileData.avatar || 'https://via.placeholder.com/80'}
                alt="Profile"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #e5e7eb'
                }}
              />
              <div>
                <h2 style={{ margin: 0 }}>{profileData.name}</h2>
                <p className="profile-handle" style={{ margin: '4px 0 0 0' }}>{profileData.handle}</p>
              </div>
            </div>
            <p className="profile-bio">{profileData.bio}</p>
            <div className="profile-meta">
              <div className="meta-item">
                <FaCalendar />
                <span>Joined {displayUser?.joinedDate || 'Unknown'}</span>
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
      {/* Stats row at the bottom */}
      <div className="profile-stats-inline" style={{marginTop: 8}}>
        <span><FaGraduationCap style={{marginRight: 4}}/> {displayUser?.stats?.coursesCompleted || 0} Courses</span>
        <span style={{marginLeft: 18}}><FaTrophy style={{marginRight: 4}}/> {displayUser?.stats?.studentsHelped || 0} Students Helped</span>
        <span style={{marginLeft: 18}}><FaStar style={{marginRight: 4}}/> {displayUser?.stats?.avgRating || 'N/A'} Rating</span>
      </div>
      {!isViewingOther && renderLogoutButton()}
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
            <button
              onClick={() => {
                if (onMenuChange) onMenuChange('Browse_Communities');
              }}
              style={{
                marginTop: '8px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: isDarkMode ? '#2f3336' : '#f3f4f6',
                color: '#1d9bf0',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Browse All Communities →
            </button>
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

  // Render Edit Profile section with X/Twitter-style layout
  const renderEditProfile = () => {
    const showTeachingTab = displayUser?.userType !== 'student' && displayUser?.userType !== 'new_user';

    // Get the selected banner gradient
    const selectedBanner = bannerColors.find(c => c.id === bannerColor) || bannerColors[0];

    return (
      <div className="edit-profile-section">
        {/* Cover Image */}
        <div className="ep-cover-image" style={{ position: 'relative' }}>
          <div
            className="ep-cover-gradient"
            style={{ background: selectedBanner.gradient }}
          ></div>

          {/* Color Swatches - shown when editing */}
          {isEditing && (
            <div style={{
              position: 'absolute',
              bottom: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 8,
              background: 'rgba(255,255,255,0.95)',
              padding: '8px 16px',
              borderRadius: 24,
              boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', alignSelf: 'center', marginRight: 4 }}>Banner:</span>
              {bannerColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setBannerColor(color.id)}
                  title={color.label}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    border: bannerColor === color.id ? '3px solid #1d9bf0' : '2px solid #e5e7eb',
                    background: color.id === 'default'
                      ? 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)'
                      : color.color,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: bannerColor === color.id ? '0 0 0 2px rgba(29,155,240,0.3)' : 'none'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="ep-profile-info">
          {/* Avatar */}
          <div className="ep-avatar-container">
            <img
              src={displayUser?.avatar || 'https://via.placeholder.com/120'}
              alt="Profile"
              className="ep-avatar"
            />
          </div>

          {/* Edit Profile Button (own profile only) */}
          {!isViewingOther && (
            !isEditing ? (
              <button className="ep-edit-btn" onClick={() => setIsEditing(true)}>
                Edit profile
              </button>
            ) : (
              <div style={{ position: 'absolute', top: 12, right: 16, display: 'flex', gap: 8 }}>
                <button
                  onClick={handleCancel}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 9999,
                    border: '1px solid #ccc',
                    background: '#fff',
                    color: '#374151',
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 9999,
                    border: 'none',
                    background: '#1d9bf0',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer'
                  }}
                >
                  Save
                </button>
              </div>
            )
          )}

          {/* Profile Details */}
          <div className="ep-profile-details">
            <h1 className="ep-profile-name">{displayUser?.name || 'User'}</h1>
            <p className="ep-profile-handle">{displayUser?.username || '@user'}</p>
            <span className="ep-profile-role" style={{ background: `${userProfileData.roleColor}15`, color: userProfileData.roleColor }}>
              {userProfileData.role}
            </span>
            <p className="ep-profile-bio">{displayUser?.bio || 'No bio yet.'}</p>

            {/* Meta Info */}
            <div className="ep-profile-meta">
              {displayUser?.location && <span>📍 {displayUser.location}</span>}
              {userProfileData.website && <span>🔗 <a href={`https://${userProfileData.website}`} target="_blank" rel="noopener noreferrer">{userProfileData.website}</a></span>}
              <span>📅 Joined {userProfileData.joinedDate}</span>
            </div>

            {/* Followers/Following */}
            <div className="ep-follow-stats">
              <span className="ep-follow-stat">
                <span className="ep-follow-value">{userProfileData.following}</span>
                <span className="ep-follow-label"> Following</span>
              </span>
              <span className="ep-follow-stat">
                <span className="ep-follow-value">{userProfileData.followers}</span>
                <span className="ep-follow-label"> Followers</span>
              </span>
            </div>

            {/* Stats Row */}
            <div className="ep-stats-row">
              <div className="ep-stat-item">
                <span className="ep-stat-value">{displayUser?.stats?.coursesCompleted || 0}</span>
                <span className="ep-stat-label">Courses Taken</span>
              </div>
              <div className="ep-stat-item">
                <span className="ep-stat-value">{displayUser?.stats?.studentsHelped || 0}</span>
                <span className="ep-stat-label">Students Helped</span>
              </div>
              <div className="ep-stat-item">
                <span className="ep-stat-value">{displayUser?.stats?.avgRating || 'N/A'}</span>
                <span className="ep-stat-label">Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="ep-tabs">
          <div
            className={`ep-tab${profileSubTab === 'posts' ? ' active' : ''}`}
            onClick={() => setProfileSubTab('posts')}
          >
            Posts
          </div>
          <div
            className={`ep-tab${profileSubTab === 'courses-taken' ? ' active' : ''}`}
            onClick={() => setProfileSubTab('courses-taken')}
          >
            Courses Taken
          </div>
          {showTeachingTab && (
            <div
              className={`ep-tab${profileSubTab === 'courses-taught' ? ' active' : ''}`}
              onClick={() => setProfileSubTab('courses-taught')}
            >
              Courses Taught
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="ep-tab-content">
          {profileSubTab === 'posts' && renderPostsTab()}
          {profileSubTab === 'courses-taken' && renderCoursesTakenTab()}
          {profileSubTab === 'courses-taught' && showTeachingTab && renderCoursesTaughtTab()}
        </div>
      </div>
    );
  };

  // Render Posts sub-tab
  const renderPostsTab = () => (
    <div className="ep-posts">
      {userProfileData.posts.map((post, index) => (
        <div key={index} className="ep-post-item">
          <span className="ep-post-time">{post.time}</span>
          <div className={`ep-post-type ${post.type}`}>
            {post.type === 'answer' && '✅ HELPFUL'}
            {post.type === 'win' && '🎉 WIN'}
            {post.type === 'question' && '❓ QUESTION'}
            {post.type === 'tip' && '💡 TIP'}
          </div>
          <div className="ep-post-context">{post.context}</div>
          <div className="ep-post-content">"{post.content}"</div>
          {post.replyTo && (
            <div className="ep-post-reply-to">↩️ Reply to: "{post.replyTo}"</div>
          )}
          {post.badge && (
            <div className="ep-post-badge">🏆 {post.badge}</div>
          )}
          <div className="ep-post-stats">
            {post.stats.helpful && <span>👍 {post.stats.helpful} Helpful</span>}
            {post.stats.likes && <span>👍 {post.stats.likes}</span>}
            {post.stats.replies && <span>💬 {post.stats.replies}</span>}
            {post.stats.goodwill && <span style={{ color: '#22c55e' }}>+{post.stats.goodwill} Goodwill</span>}
            {post.stats.resolved !== undefined && (
              <span style={{ color: post.stats.resolved ? '#22c55e' : '#71767b' }}>
                {post.stats.resolved ? '✅ Resolved' : '⏳ Open'}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // Render Courses Taken sub-tab
  const renderCoursesTakenTab = () => (
    <div className="ep-courses-taken">
      {userProfileData.coursesTaken.map((community, cIndex) => (
        <div key={cIndex} className="ep-community-section">
          <div className="ep-community-header">
            <span className="ep-community-name">{community.community}</span>
            <span className="ep-community-count">{community.courses.length} courses</span>
          </div>
          {community.courses.map((course, courseIndex) => (
            <div key={courseIndex} className="ep-course-item">
              <div className={`ep-course-badge ${course.status}`}>
                <span>{course.status === 'completed' ? '🏆' : '📚'}</span>
                <span className="ep-course-badge-label">
                  {course.status === 'completed' ? 'CERT' : `${course.progress}%`}
                </span>
              </div>
              <div className="ep-course-details">
                <h3 className="ep-course-title">{course.title}</h3>
                <div className={`ep-course-status ${course.status}`}>
                  {course.status === 'completed' ? '✅ Completed • Certificate Earned' : '🔄 In Progress'}
                </div>
                <div className="ep-course-meta">
                  <span>{course.hours}h</span>
                  {course.date && <span>{course.date}</span>}
                  {course.score && <span>Score: {course.score}%</span>}
                  {course.rank && <span>{course.rank}</span>}
                </div>
                <div className="ep-skill-tags">
                  {course.skills.map((skill, sIndex) => (
                    <span key={sIndex} className="ep-skill-tag">{skill}</span>
                  ))}
                </div>
                <div className="ep-course-actions">
                  {course.status === 'completed' ? (
                    <>
                      <button className="ep-course-btn primary">View Certificate</button>
                      <button className="ep-course-btn secondary">Share</button>
                    </>
                  ) : (
                    <button className="ep-course-btn primary">Continue →</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  // Render Courses Taught sub-tab
  const renderCoursesTaughtTab = () => (
    <div className="ep-courses-taught">
      {/* Teaching Summary */}
      {userProfileData.teachingStats && (
        <div className="ep-teaching-summary">
          <div className="ep-teaching-stat">
            <span className="ep-teaching-value">{userProfileData.teachingStats.students}</span>
            <span className="ep-teaching-label">Students</span>
          </div>
          <div className="ep-teaching-stat">
            <span className="ep-teaching-value">{userProfileData.teachingStats.rating}⭐</span>
            <span className="ep-teaching-label">Rating</span>
          </div>
          <div className="ep-teaching-stat">
            <span className="ep-teaching-value">{userProfileData.teachingStats.comeback}%</span>
            <span className="ep-teaching-label">Comeback</span>
          </div>
          <div className="ep-teaching-stat">
            <span className="ep-teaching-value">${userProfileData.teachingStats.earned.toLocaleString()}</span>
            <span className="ep-teaching-label">Earned</span>
          </div>
        </div>
      )}

      {/* Courses I Tutor */}
      {userProfileData.coursesTaught.length > 0 && (
        <>
          <div className="ep-section-header">Courses I Tutor</div>
          {userProfileData.coursesTaught.map((course, index) => (
            <div key={index} className="ep-course-item">
              <div className="ep-course-badge tutor">
                <span>🎓</span>
                <span className="ep-course-badge-label">TUTOR</span>
              </div>
              <div className="ep-course-details">
                <h3 className="ep-course-title">{course.title}</h3>
                <p className="ep-course-community">{course.community}</p>
                <div className="ep-course-meta">
                  <span>{course.students} students</span>
                  <span>{course.rating}⭐ ({course.reviews} reviews)</span>
                  <span>{course.hoursTaught}h taught</span>
                </div>
                {course.topReview && (
                  <div className="ep-review-item">
                    <div className="ep-review-stars">{'⭐'.repeat(course.topReview.stars)}</div>
                    <div className="ep-review-text">"{course.topReview.text}"</div>
                    <div className="ep-review-author">- {course.topReview.author}</div>
                  </div>
                )}
                <div className="ep-course-actions">
                  <button className="ep-course-btn secondary">All Reviews</button>
                  <button className="ep-course-btn primary">Availability</button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Can Also Teach */}
      {userProfileData.canTeach && userProfileData.canTeach.length > 0 && (
        <>
          <div className="ep-section-header">Can Also Teach</div>
          <div className="ep-can-teach-list">
            {userProfileData.canTeach.map((course, index) => (
              <div key={index} className="ep-can-teach-item">
                <span className="ep-can-teach-title">{course.title}</span>
                <span className="ep-can-teach-score">{course.score}%</span>
                <button className="ep-course-btn primary small">Apply</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'edit-profile':
        return renderEditProfile();
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
        return renderEditProfile();
    }
  };

  return (
    <div className="profile">
      {/* Back button header when viewing another user */}
      {isViewingOther && onBack && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '12px 16px',
          borderBottom: `1px solid ${isDarkMode ? '#2f3336' : '#e5e7eb'}`,
          background: isDarkMode ? '#000' : '#fff',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: isDarkMode ? '#e7e9ea' : '#0f1419',
              fontSize: 20,
              cursor: 'pointer',
              padding: 8,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={e => e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
            title="Go back"
          >
            ←
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>
              {displayUser?.name || 'Profile'}
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: isDarkMode ? '#71767b' : '#536471' }}>
              {displayUser?.stats?.coursesCompleted || 0} courses completed
            </p>
          </div>
        </div>
      )}
      {!isViewingOther && renderTabBar()}
      <div className="profile-main">
        {renderContent()}
      </div>
    </div>
  );
};

export default Profile; 