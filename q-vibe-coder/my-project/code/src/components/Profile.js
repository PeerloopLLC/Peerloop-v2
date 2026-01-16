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
  const [activeSection, setActiveSection] = useState('edit-profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    handle: currentUser?.username || '',
    email: currentUser?.email || '',
    bio: currentUser?.bio || '',
    location: currentUser?.location || '',
    website: currentUser?.website || '',
    avatar: currentUser?.avatar || ''
  });

  // Sync profileData when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        handle: currentUser.username || '',
        email: currentUser.email || '',
        bio: currentUser.bio || '',
        location: currentUser.location || '',
        website: currentUser.website || '',
        avatar: currentUser.avatar || ''
      });
    }
  }, [currentUser]);

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
    return saved || 'default'; // Default is the gradient
  });

  // Available banner colors
  const bannerColors = [
    { id: 'default', label: 'Default', gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' },
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
    { id: 'edit-profile', label: 'Profile', icon: <FaEdit /> },
    { id: 'bookmarks', label: 'Bookmarks', icon: <FaBookmark /> },
    { id: 'history', label: 'History', icon: <FaHistory /> },
    { id: 'settings', label: 'Settings', icon: <FaCog /> },
    { id: 'privacy', label: 'Privacy & Security', icon: <FaShieldAlt /> },
    { id: 'help', label: 'Help & Support', icon: <FaQuestionCircle /> }
  ];

  // Sub-tab state for Edit Profile section
  const [profileSubTab, setProfileSubTab] = useState('posts');

  // User-specific profile data based on user type
  const getUserProfileData = () => {
    const userType = currentUser?.userType || 'student';

    // Profile data for each user type
    const profileDataByType = {
      student: {
        role: 'Student',
        roleColor: '#1d9bf0',
        followers: 23,
        following: 45,
        joinedDate: 'January 2025',
        website: '',
        posts: [
          { type: 'question', time: '2h ago', context: 'The Commons > Web Development', content: 'What\'s the best way to learn React hooks?', stats: { replies: 5, resolved: false } },
          { type: 'win', time: '1d ago', context: 'Code Academy > JavaScript', content: 'Just completed my first JavaScript course!', badge: 'JavaScript Basics', stats: { likes: 12, replies: 3 } }
        ],
        coursesTaken: [
          { community: 'Code Academy', courses: [
            { title: 'JavaScript Basics', status: 'completed', hours: 15, date: 'Jan 2025', score: 88, rank: 'Top 15%', skills: ['Variables', 'Functions', 'Arrays'] },
            { title: 'HTML & CSS Fundamentals', status: 'completed', hours: 10, date: 'Dec 2024', score: 92, rank: 'Top 10%', skills: ['HTML5', 'CSS3', 'Flexbox'] },
            { title: 'React Basics', status: 'in-progress', hours: 8, progress: 45, skills: ['Components', 'Props', 'State'] }
          ]}
        ],
        coursesTaught: [] // Students don't teach
      },
      student_teacher: {
        role: 'Student-Teacher',
        roleColor: '#22c55e',
        followers: 847,
        following: 128,
        joinedDate: 'March 2024',
        website: 'alexsanders.dev',
        posts: [
          { type: 'answer', time: '2h ago', context: 'Einstein Community > Relativity 101', content: 'The key to understanding E=mc² is thinking about mass and energy as two forms of the same thing...', replyTo: 'Can someone explain E=mc² simply?', stats: { helpful: 12, replies: 3, goodwill: 15 } },
          { type: 'win', time: '1d ago', context: 'Jane\'s AI Academy > Deep Learning', content: 'Just completed the Neural Networks module! Finally understand backpropagation!', badge: 'Neural Network Basics', stats: { likes: 8, replies: 5 } },
          { type: 'question', time: '3d ago', context: 'The Commons > General', content: 'What\'s the best way to visualize gradient descent? Looking for intuitive explanations.', stats: { replies: 7, resolved: true } },
          { type: 'tip', time: '5d ago', context: 'The Commons > Python', content: 'Pro tip: Use print(type(variable)) to debug. 90% of beginner errors are type mismatches!', stats: { helpful: 24, replies: 8, goodwill: 20 } }
        ],
        coursesTaken: [
          { community: 'Einstein Community', courses: [
            { title: 'Relativity 101: Understanding Space-Time', status: 'completed', hours: 18, date: 'Dec 2024', score: 94, rank: 'Top 5%', skills: ['Special Relativity', 'Spacetime', 'Lorentz'] },
            { title: 'Quantum Mechanics Fundamentals', status: 'in-progress', hours: 12, progress: 60, skills: ['Wave Functions', 'Uncertainty'] }
          ]},
          { community: 'Jane\'s AI Academy', courses: [
            { title: 'Deep Learning Fundamentals', status: 'completed', hours: 24, date: 'Nov 2024', score: 91, rank: 'Top 10%', skills: ['Neural Networks', 'Backprop', 'TensorFlow'] }
          ]}
        ],
        coursesTaught: [
          { title: 'Python Basics for Beginners', community: 'The Commons', students: 28, rating: 4.9, reviews: 89, hoursTaught: 45, topReview: { stars: 5, text: 'Alex explained loops so clearly!', author: '@newcoder' } }
        ],
        teachingStats: { students: 47, rating: 4.9, comeback: 89, earned: 2340 },
        canTeach: [
          { title: 'Relativity 101', score: 94 },
          { title: 'Deep Learning', score: 91 }
        ]
      },
      creator: {
        role: 'Creator',
        roleColor: '#a855f7',
        followers: 2340,
        following: 156,
        joinedDate: 'June 2023',
        website: 'jamiechen.io',
        posts: [
          { type: 'tip', time: '4h ago', context: 'Jamie\'s Coding Academy > Full Stack', content: 'New course module released! Check out the advanced TypeScript patterns section.', stats: { helpful: 45, replies: 12, goodwill: 30 } },
          { type: 'answer', time: '1d ago', context: 'The Commons > Career Advice', content: 'The best investment in your career is building projects, not just watching tutorials. Ship something!', stats: { helpful: 89, replies: 23, goodwill: 50 } },
          { type: 'win', time: '3d ago', context: 'Jamie\'s Coding Academy', content: 'Just hit 1000 students in my React course! Thank you all for the amazing support!', stats: { likes: 234, replies: 67 } }
        ],
        coursesTaken: [
          { community: 'AI Masters', courses: [
            { title: 'Advanced Machine Learning', status: 'completed', hours: 40, date: 'Oct 2024', score: 96, rank: 'Top 2%', skills: ['Deep Learning', 'NLP', 'Computer Vision'] }
          ]}
        ],
        coursesTaught: [
          { title: 'Full Stack Web Development', community: 'Jamie\'s Coding Academy', students: 1234, rating: 4.95, reviews: 567, hoursTaught: 450, topReview: { stars: 5, text: 'Best web dev course on the platform!', author: '@devpro' } },
          { title: 'React Masterclass', community: 'Jamie\'s Coding Academy', students: 890, rating: 4.92, reviews: 412, hoursTaught: 320, topReview: { stars: 5, text: 'Finally understand React hooks!', author: '@learner42' } },
          { title: 'TypeScript Deep Dive', community: 'Jamie\'s Coding Academy', students: 456, rating: 4.88, reviews: 198, hoursTaught: 180, topReview: { stars: 5, text: 'Production-ready TypeScript skills!', author: '@codewiz' } }
        ],
        teachingStats: { students: 234, rating: 4.95, comeback: 94, earned: 12500 },
        canTeach: []
      },
      admin: {
        role: 'Admin',
        roleColor: '#f59e0b',
        followers: 5670,
        following: 234,
        joinedDate: 'January 2023',
        website: 'peerloop.com/team',
        posts: [
          { type: 'tip', time: '1h ago', context: 'Platform Updates', content: 'New feature alert: Video rooms are now available in all communities! Start live sessions with your students.', stats: { helpful: 156, replies: 34, goodwill: 100 } },
          { type: 'answer', time: '6h ago', context: 'The Commons > Support', content: 'If you\'re experiencing issues with video playback, try clearing your cache and refreshing. We\'ve pushed a fix.', stats: { helpful: 23, replies: 8, goodwill: 15 } },
          { type: 'win', time: '2d ago', context: 'PeerLoop Milestones', content: 'PeerLoop just crossed 100,000 active learners! Thank you for being part of this journey!', stats: { likes: 890, replies: 234 } }
        ],
        coursesTaken: [
          { community: 'Leadership Academy', courses: [
            { title: 'Educational Platform Management', status: 'completed', hours: 30, date: 'Aug 2024', score: 98, rank: 'Top 1%', skills: ['EdTech', 'UX', 'Community'] }
          ]},
          { community: 'AI Masters', courses: [
            { title: 'AI in Education', status: 'completed', hours: 25, date: 'Sep 2024', score: 95, rank: 'Top 3%', skills: ['AI', 'Personalization', 'Analytics'] }
          ]}
        ],
        coursesTaught: [
          { title: 'Platform Best Practices', community: 'PeerLoop Official', students: 890, rating: 4.98, reviews: 456, hoursTaught: 200, topReview: { stars: 5, text: 'Essential for new creators!', author: '@newcreator' } },
          { title: 'Community Building 101', community: 'PeerLoop Official', students: 567, rating: 4.96, reviews: 234, hoursTaught: 150, topReview: { stars: 5, text: 'Built my community using these tips!', author: '@educator' } }
        ],
        teachingStats: { students: 890, rating: 4.98, comeback: 96, earned: 45000 },
        canTeach: []
      }
    };

    return profileDataByType[userType] || profileDataByType.student;
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
                <span>Joined {currentUser?.joinedDate || 'Unknown'}</span>
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
        <span><FaGraduationCap style={{marginRight: 4}}/> {currentUser?.stats?.coursesCompleted || 0} Courses</span>
        <span style={{marginLeft: 18}}><FaTrophy style={{marginRight: 4}}/> {currentUser?.stats?.studentsHelped || 0} Students Helped</span>
        <span style={{marginLeft: 18}}><FaStar style={{marginRight: 4}}/> {currentUser?.stats?.avgRating || 'N/A'} Rating</span>
      </div>
      {renderLogoutButton()}
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
    const showTeachingTab = currentUser?.userType !== 'student' && currentUser?.userType !== 'new_user';

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
              src={currentUser?.avatar || 'https://via.placeholder.com/120'}
              alt="Profile"
              className="ep-avatar"
            />
          </div>

          {/* Edit Profile Button (own profile only) */}
          {!isEditing ? (
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
          )}

          {/* Profile Details */}
          <div className="ep-profile-details">
            <h1 className="ep-profile-name">{currentUser?.name || 'User'}</h1>
            <p className="ep-profile-handle">{currentUser?.username || '@user'}</p>
            <span className="ep-profile-role" style={{ background: `${userProfileData.roleColor}15`, color: userProfileData.roleColor }}>
              {userProfileData.role}
            </span>
            <p className="ep-profile-bio">{currentUser?.bio || 'No bio yet.'}</p>

            {/* Meta Info */}
            <div className="ep-profile-meta">
              {currentUser?.location && <span>📍 {currentUser.location}</span>}
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
                <span className="ep-stat-value">{currentUser?.stats?.coursesCompleted || 0}</span>
                <span className="ep-stat-label">Courses Taken</span>
              </div>
              <div className="ep-stat-item">
                <span className="ep-stat-value">{currentUser?.stats?.studentsHelped || 0}</span>
                <span className="ep-stat-label">Students Helped</span>
              </div>
              <div className="ep-stat-item">
                <span className="ep-stat-value">{currentUser?.stats?.avgRating || 'N/A'}</span>
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
      {renderTabBar()}
      <div className="profile-main">
        {renderContent()}
      </div>
    </div>
  );
};

export default Profile; 