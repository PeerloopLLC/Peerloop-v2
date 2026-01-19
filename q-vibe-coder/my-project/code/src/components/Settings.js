import React, { useState, useEffect } from 'react';
import './Settings.css';
import { 
  FaBookmark, 
  FaHistory, 
  FaCog, 
  FaShieldAlt, 
  FaQuestionCircle,
  FaUser,
  FaMoon,
  FaSun,
  FaBell,
  FaEye,
  FaLock,
  FaKey,
  FaEnvelope,
  FaGlobe,
  FaTrash,
  FaDownload
} from 'react-icons/fa';

const Settings = ({ currentUser, onMenuChange, isDarkMode, onToggleDarkMode }) => {
  const [activeSection, setActiveSection] = useState('settings');

  // Community navigation style preference
  const [communityNavStyle, setCommunityNavStyle] = useState(() => {
    const saved = localStorage.getItem('communityNavStyle');
    return saved || 'slideout';
  });

  // Save community navigation preference when it changes
  useEffect(() => {
    localStorage.setItem('communityNavStyle', communityNavStyle);
    window.dispatchEvent(new CustomEvent('communityNavStyleChanged', { detail: communityNavStyle }));
  }, [communityNavStyle]);

  const settingsSections = [
    { id: 'settings', label: 'Settings', icon: <FaCog /> },
    { id: 'bookmarks', label: 'Bookmarks', icon: <FaBookmark /> },
    { id: 'history', label: 'History', icon: <FaHistory /> },
    { id: 'privacy', label: 'Privacy & Security', icon: <FaShieldAlt /> },
    { id: 'help', label: 'Help & Support', icon: <FaQuestionCircle /> }
  ];

  const renderHeader = () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      borderBottom: '1px solid var(--border-color, #2f3336)',
      position: 'sticky',
      top: 0,
      background: 'var(--bg-primary, #000)',
      zIndex: 10
    }}>
      <button
        onClick={() => onMenuChange('My Community')}
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
          justifyContent: 'center',
          marginRight: 16
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
        title="Go back"
      >
        ←
      </button>
      <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary, #e7e9ea)' }}>
        Settings
      </h1>
    </div>
  );

  const renderSidebar = () => (
    <div style={{
      width: 280,
      borderRight: '1px solid var(--border-color, #2f3336)',
      padding: '16px 0',
      flexShrink: 0
    }}>
      {settingsSections.map(section => (
        <button
          key={section.id}
          onClick={() => setActiveSection(section.id)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '14px 20px',
            background: activeSection === section.id 
              ? 'rgba(29, 155, 240, 0.1)' 
              : 'transparent',
            border: 'none',
            borderRight: activeSection === section.id 
              ? '3px solid #1d9bf0' 
              : '3px solid transparent',
            color: activeSection === section.id 
              ? '#1d9bf0' 
              : 'var(--text-primary, #e7e9ea)',
            fontSize: 15,
            fontWeight: activeSection === section.id ? 700 : 400,
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
          onMouseEnter={e => {
            if (activeSection !== section.id) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }
          }}
          onMouseLeave={e => {
            if (activeSection !== section.id) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          <span style={{ fontSize: 18 }}>{section.icon}</span>
          {section.label}
        </button>
      ))}
      
      {/* Profile Link */}
      <div style={{ borderTop: '1px solid var(--border-color, #2f3336)', marginTop: 16, paddingTop: 16 }}>
        <button
          onClick={() => onMenuChange('Profile')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '14px 20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary, #71767b)',
            fontSize: 15,
            cursor: 'pointer'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <FaUser style={{ fontSize: 18 }} />
          View Profile
        </button>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, color: 'var(--text-primary, #e7e9ea)' }}>
        Account Settings
      </h2>
      
      {/* Appearance Section */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary, #e7e9ea)' }}>
          Appearance
        </h3>
        <div style={{ 
          background: 'var(--bg-secondary, #16181c)', 
          borderRadius: 12, 
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-color, #2f3336)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {isDarkMode ? <FaMoon style={{ color: '#1d9bf0' }} /> : <FaSun style={{ color: '#f59e0b' }} />}
              <span style={{ color: 'var(--text-primary, #e7e9ea)' }}>Dark Mode</span>
            </div>
            <button
              onClick={onToggleDarkMode}
              style={{
                width: 50,
                height: 28,
                borderRadius: 14,
                background: isDarkMode ? '#1d9bf0' : '#536471',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s'
              }}
            >
              <div style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: 3,
                left: isDarkMode ? 25 : 3,
                transition: 'left 0.2s'
              }} />
            </button>
          </div>
        </div>
      </div>

      {/* Community Navigation Section */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary, #e7e9ea)' }}>
          Community Navigation
        </h3>
        <div style={{
          background: 'var(--bg-secondary, #16181c)',
          borderRadius: 12,
          padding: '16px 20px'
        }}>
          <p style={{
            color: 'var(--text-secondary, #71767b)',
            fontSize: 13,
            marginBottom: 12,
            marginTop: 0
          }}>
            Choose how to switch between communities in the Feeds view
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              { value: 'pills', label: 'Pills (Top Bar)' },
              { value: 'dropdown', label: 'Dropdown (Sidebar)' },
              { value: 'selector', label: 'Selector (Card)' },
              { value: 'slideout', label: 'Slide-out (Panel)' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setCommunityNavStyle(option.value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 20,
                  border: communityNavStyle === option.value
                    ? '2px solid #1d9bf0'
                    : '1px solid var(--border-color, #2f3336)',
                  background: communityNavStyle === option.value
                    ? 'rgba(29, 155, 240, 0.15)'
                    : 'transparent',
                  color: communityNavStyle === option.value
                    ? '#1d9bf0'
                    : 'var(--text-primary, #e7e9ea)',
                  fontSize: 13,
                  fontWeight: communityNavStyle === option.value ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary, #e7e9ea)' }}>
          Notifications
        </h3>
        <div style={{
          background: 'var(--bg-secondary, #16181c)',
          borderRadius: 12,
          overflow: 'hidden'
        }}>
          {[
            { label: 'Email notifications', icon: <FaEnvelope />, defaultChecked: true },
            { label: 'Push notifications', icon: <FaBell />, defaultChecked: true },
            { label: 'Course updates', icon: <FaBookmark />, defaultChecked: false },
            { label: 'Community activity', icon: <FaGlobe />, defaultChecked: true }
          ].map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: idx < 3 ? '1px solid var(--border-color, #2f3336)' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: 'var(--text-secondary, #71767b)' }}>{item.icon}</span>
                <span style={{ color: 'var(--text-primary, #e7e9ea)' }}>{item.label}</span>
              </div>
              <input 
                type="checkbox" 
                defaultChecked={item.defaultChecked}
                style={{ 
                  width: 20, 
                  height: 20, 
                  accentColor: '#1d9bf0',
                  cursor: 'pointer'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Account Actions */}
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary, #e7e9ea)' }}>
          Account
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 20px',
            background: 'var(--bg-secondary, #16181c)',
            border: 'none',
            borderRadius: 12,
            color: 'var(--text-primary, #e7e9ea)',
            fontSize: 15,
            cursor: 'pointer'
          }}>
            <FaDownload style={{ color: '#1d9bf0' }} />
            Download your data
          </button>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 20px',
            background: 'rgba(244, 63, 94, 0.1)',
            border: 'none',
            borderRadius: 12,
            color: '#f43f5e',
            fontSize: 15,
            cursor: 'pointer'
          }}>
            <FaTrash />
            Delete account
          </button>
        </div>
      </div>
    </div>
  );

  const renderBookmarks = () => (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, color: 'var(--text-primary, #e7e9ea)' }}>
        Bookmarked Content
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { title: 'Advanced React Patterns', type: 'Course', date: 'March 15, 2024' },
          { title: 'UI/UX Design Principles', type: 'Course', date: 'March 10, 2024' },
          { title: 'JavaScript Best Practices', type: 'Article', date: 'March 5, 2024' },
          { title: 'Python Machine Learning Guide', type: 'Course', date: 'March 1, 2024' }
        ].map((item, idx) => (
          <div key={idx} style={{
            padding: '16px 20px',
            background: 'var(--bg-secondary, #16181c)',
            borderRadius: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: 'var(--text-primary, #e7e9ea)' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary, #71767b)', margin: 0 }}>
                {item.type} • Saved {item.date}
              </p>
            </div>
            <button style={{
              background: 'none',
              border: 'none',
              color: '#f43f5e',
              cursor: 'pointer',
              padding: 8
            }}>
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, color: 'var(--text-primary, #e7e9ea)' }}>
        Learning History
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          { title: 'Advanced React Patterns', status: 'Completed', date: 'March 15, 2024', hours: 15, grade: 'A+' },
          { title: 'UI/UX Design Masterclass', status: 'Completed', date: 'March 10, 2024', hours: 12, grade: 'A' },
          { title: 'JavaScript Deep Dive', status: 'In Progress', date: 'March 5, 2024', hours: 10.8, progress: 60 }
        ].map((item, idx) => (
          <div key={idx} style={{
            padding: '20px',
            background: 'var(--bg-secondary, #16181c)',
            borderRadius: 12,
            borderLeft: item.status === 'Completed' ? '4px solid #10b981' : '4px solid #1d9bf0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary, #e7e9ea)', margin: 0 }}>
                {item.title}
              </h3>
              <span style={{
                padding: '4px 10px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 600,
                background: item.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(29, 155, 240, 0.1)',
                color: item.status === 'Completed' ? '#10b981' : '#1d9bf0'
              }}>
                {item.status}
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary, #71767b)', margin: '0 0 12px 0' }}>
              {item.date} • {item.hours} hours
            </p>
            {item.status === 'Completed' ? (
              <span style={{ fontSize: 14, fontWeight: 600, color: '#10b981' }}>Grade: {item.grade}</span>
            ) : (
              <div>
                <div style={{ 
                  height: 6, 
                  background: 'var(--border-color, #2f3336)', 
                  borderRadius: 3,
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${item.progress}%`,
                    height: '100%',
                    background: '#1d9bf0',
                    borderRadius: 3
                  }} />
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-secondary, #71767b)', marginTop: 4, display: 'block' }}>
                  {item.progress}% complete
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, color: 'var(--text-primary, #e7e9ea)' }}>
        Privacy & Security
      </h2>
      
      {/* Profile Visibility */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary, #e7e9ea)' }}>
          Profile Visibility
        </h3>
        <div style={{ 
          background: 'var(--bg-secondary, #16181c)', 
          borderRadius: 12, 
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FaEye style={{ color: 'var(--text-secondary, #71767b)' }} />
            <span style={{ color: 'var(--text-primary, #e7e9ea)' }}>Who can see your profile</span>
          </div>
          <select 
            defaultValue="public"
            style={{
              background: 'var(--bg-primary, #000)',
              border: '1px solid var(--border-color, #2f3336)',
              borderRadius: 8,
              padding: '8px 12px',
              color: 'var(--text-primary, #e7e9ea)',
              cursor: 'pointer'
            }}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="friends">Connections Only</option>
          </select>
        </div>
      </div>

      {/* Security */}
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary, #e7e9ea)' }}>
          Security
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            background: 'var(--bg-secondary, #16181c)',
            border: 'none',
            borderRadius: 12,
            cursor: 'pointer'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <FaLock style={{ color: '#1d9bf0' }} />
              <span style={{ color: 'var(--text-primary, #e7e9ea)' }}>Two-Factor Authentication</span>
            </div>
            <span style={{ 
              padding: '4px 10px', 
              borderRadius: 12, 
              fontSize: 12, 
              fontWeight: 600,
              background: 'rgba(244, 63, 94, 0.1)',
              color: '#f43f5e'
            }}>
              Not enabled
            </span>
          </button>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 20px',
            background: 'var(--bg-secondary, #16181c)',
            border: 'none',
            borderRadius: 12,
            color: 'var(--text-primary, #e7e9ea)',
            cursor: 'pointer'
          }}>
            <FaKey style={{ color: '#f59e0b' }} />
            Change Password
          </button>
        </div>
      </div>
    </div>
  );

  const renderHelp = () => (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, color: 'var(--text-primary, #e7e9ea)' }}>
        Help & Support
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          { title: 'FAQ', description: 'Find answers to common questions', icon: '❓' },
          { title: 'Contact Support', description: 'Get help from our support team', icon: '💬' },
          { title: 'Documentation', description: 'Read our detailed documentation', icon: '📚' },
          { title: 'Community Forum', description: 'Connect with other learners', icon: '👥' },
          { title: 'Report a Bug', description: 'Help us improve PeerLoop', icon: '🐛' }
        ].map((item, idx) => (
          <button key={idx} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '20px',
            background: 'var(--bg-secondary, #16181c)',
            border: 'none',
            borderRadius: 12,
            cursor: 'pointer',
            textAlign: 'left'
          }}>
            <span style={{ fontSize: 28 }}>{item.icon}</span>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, color: 'var(--text-primary, #e7e9ea)' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary, #71767b)', margin: 0 }}>
                {item.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'bookmarks':
        return renderBookmarks();
      case 'history':
        return renderHistory();
      case 'privacy':
        return renderPrivacy();
      case 'help':
        return renderHelp();
      default:
        return renderSettings();
    }
  };

  return (
    <div style={{ 
      background: 'var(--bg-primary, #000)', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {renderHeader()}
      <div style={{ display: 'flex', flex: 1 }}>
        {renderSidebar()}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;

