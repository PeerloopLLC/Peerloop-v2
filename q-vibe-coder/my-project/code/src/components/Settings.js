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

  // Discover listing format preference
  const [discoverListingFormat, setDiscoverListingFormat] = useState(() => {
    const saved = localStorage.getItem('discoverListingFormat');
    return saved || 'standard';
  });

  // Compact view text scale preference (0.8 to 1.5)
  const [compactTextScale, setCompactTextScale] = useState(() => {
    const saved = localStorage.getItem('compactTextScale');
    return saved ? parseFloat(saved) : 1.0;
  });

  // Global font size preference (0-4, like X.com: Extra small to Extra large)
  const [fontSizeLevel, setFontSizeLevel] = useState(() => {
    const saved = localStorage.getItem('fontSizeLevel');
    return saved ? parseInt(saved, 10) : 2; // Default is level 2 (15px)
  });

  // Combined Card gray level (0-100, where 0 = white, 100 = darker gray)
  const [combinedCardGrayLevel, setCombinedCardGrayLevel] = useState(() => {
    const saved = localStorage.getItem('combinedCardGrayLevel');
    return saved ? parseInt(saved, 10) : 25; // Default 25 matches original #f0f0f0
  });

  // Community view mode preference (classic or hub)
  const [communityViewMode, setCommunityViewMode] = useState(() => {
    const saved = localStorage.getItem('communityViewMode');
    return saved || 'classic';
  });

  // Breadcrumb font size preference (11-18px)
  const [breadcrumbFontSize, setBreadcrumbFontSize] = useState(() => {
    const saved = localStorage.getItem('breadcrumbFontSize');
    return saved ? parseInt(saved, 10) : 14; // Default 14px
  });

  // Save community navigation preference when it changes
  useEffect(() => {
    localStorage.setItem('communityNavStyle', communityNavStyle);
    window.dispatchEvent(new CustomEvent('communityNavStyleChanged', { detail: communityNavStyle }));
  }, [communityNavStyle]);

  // Save discover listing format preference when it changes
  useEffect(() => {
    localStorage.setItem('discoverListingFormat', discoverListingFormat);
    window.dispatchEvent(new CustomEvent('discoverListingFormatChanged', { detail: discoverListingFormat }));
  }, [discoverListingFormat]);

  // Save compact text scale preference when it changes
  useEffect(() => {
    localStorage.setItem('compactTextScale', compactTextScale.toString());
    window.dispatchEvent(new CustomEvent('compactTextScaleChanged', { detail: compactTextScale }));
  }, [compactTextScale]);

  // Save combined card gray level preference when it changes
  useEffect(() => {
    localStorage.setItem('combinedCardGrayLevel', combinedCardGrayLevel.toString());
    window.dispatchEvent(new CustomEvent('combinedCardGrayLevelChanged', { detail: combinedCardGrayLevel }));
  }, [combinedCardGrayLevel]);

  // Save community view mode preference when it changes
  useEffect(() => {
    localStorage.setItem('communityViewMode', communityViewMode);
    window.dispatchEvent(new CustomEvent('communityViewModeChanged', { detail: communityViewMode }));
  }, [communityViewMode]);

  // Save breadcrumb font size preference when it changes
  useEffect(() => {
    localStorage.setItem('breadcrumbFontSize', breadcrumbFontSize.toString());
    window.dispatchEvent(new CustomEvent('breadcrumbFontSizeChanged', { detail: breadcrumbFontSize }));
  }, [breadcrumbFontSize]);

  // Font size levels (like X.com): 13px, 14px, 15px, 17px, 19px
  const fontSizeLevels = [
    { level: 0, label: 'Extra small', size: 13 },
    { level: 1, label: 'Small', size: 14 },
    { level: 2, label: 'Default', size: 15 },
    { level: 3, label: 'Large', size: 17 },
    { level: 4, label: 'Extra large', size: 19 }
  ];

  // Save and apply font size preference when it changes
  useEffect(() => {
    localStorage.setItem('fontSizeLevel', fontSizeLevel.toString());
    const size = fontSizeLevels[fontSizeLevel]?.size || 15;
    document.documentElement.style.fontSize = `${size}px`;
    window.dispatchEvent(new CustomEvent('fontSizeChanged', { detail: { level: fontSizeLevel, size } }));
  }, [fontSizeLevel]);

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
          fontSize: 'var(--fs-20)',
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
      <h1 style={{ margin: 0, fontSize: 'var(--fs-20)', fontWeight: 700, color: 'var(--text-primary, #e7e9ea)' }}>
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
            fontSize: 'var(--fs-15)',
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
            fontSize: 'var(--fs-15)',
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
      <h2 style={{ fontSize: 'var(--fs-20)', fontWeight: 700, marginBottom: 24, color: 'var(--text-primary, #e7e9ea)' }}>
        Account Settings
      </h2>
      
      {/* Appearance Section */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 'var(--fs-16)', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary, #e7e9ea)' }}>
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

          {/* Font Size Setting */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-color, #2f3336)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 16 }}>Aa</span>
                <span style={{ color: 'var(--text-primary, #e7e9ea)' }}>Font Size</span>
              </div>
              <span style={{
                color: '#1d9bf0',
                fontWeight: 600,
                fontSize: 13
              }}>
                {fontSizeLevels[fontSizeLevel]?.label}
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary, #71767b)' }}>Aa</span>
              <input
                type="range"
                min="0"
                max="4"
                step="1"
                value={fontSizeLevel}
                onChange={(e) => setFontSizeLevel(parseInt(e.target.value, 10))}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  appearance: 'none',
                  background: `linear-gradient(to right, #1d9bf0 0%, #1d9bf0 ${(fontSizeLevel / 4) * 100}%, var(--border-color, #2f3336) ${(fontSizeLevel / 4) * 100}%, var(--border-color, #2f3336) 100%)`,
                  cursor: 'pointer'
                }}
              />
              <span style={{ fontSize: 'var(--fs-18)', color: 'var(--text-secondary, #71767b)' }}>Aa</span>
            </div>
            <p style={{
              color: 'var(--text-secondary, #71767b)',
              fontSize: 'var(--fs-12)',
              marginTop: 12,
              marginBottom: 0
            }}>
              Adjusts text size across the app. Components using CSS variables will scale with this setting.
            </p>
          </div>

          {/* Breadcrumb Font Size Setting */}
          <div style={{
            padding: '16px 20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 14 }}>🔗</span>
                <span style={{ color: 'var(--text-primary, #e7e9ea)' }}>Breadcrumb Link Size</span>
              </div>
              <span style={{
                color: '#1d9bf0',
                fontWeight: 600,
                fontSize: 13
              }}>
                {breadcrumbFontSize}px
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              {[11, 12, 13, 14, 15, 16, 18].map(size => (
                <button
                  key={size}
                  onClick={() => setBreadcrumbFontSize(size)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: breadcrumbFontSize === size
                      ? '2px solid #1d9bf0'
                      : '1px solid var(--border-color, #2f3336)',
                    background: breadcrumbFontSize === size
                      ? 'rgba(29, 155, 240, 0.15)'
                      : 'transparent',
                    color: breadcrumbFontSize === size
                      ? '#1d9bf0'
                      : 'var(--text-primary, #e7e9ea)',
                    fontSize: size,
                    fontWeight: breadcrumbFontSize === size ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Aa
                </button>
              ))}
            </div>
            <p style={{
              color: 'var(--text-secondary, #71767b)',
              fontSize: 'var(--fs-12)',
              marginTop: 12,
              marginBottom: 0
            }}>
              Adjusts the font size of the navigation breadcrumb (e.g., PeerLoop \ My Feeds).
            </p>
          </div>

        </div>
      </div>

      {/* Community Navigation Section */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 'var(--fs-16)', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary, #e7e9ea)' }}>
          Community Navigation
        </h3>
        <div style={{
          background: 'var(--bg-secondary, #16181c)',
          borderRadius: 12,
          padding: '16px 20px'
        }}>
          <p style={{
            color: 'var(--text-secondary, #71767b)',
            fontSize: 'var(--fs-13)',
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
                  fontSize: 'var(--fs-13)',
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

      {/* Community View Mode Section */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 'var(--fs-16)', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary, #e7e9ea)' }}>
          Community View Mode
        </h3>
        <div style={{
          background: 'var(--bg-secondary, #16181c)',
          borderRadius: 12,
          padding: '16px 20px'
        }}>
          <p style={{
            color: 'var(--text-secondary, #71767b)',
            fontSize: 'var(--fs-13)',
            marginBottom: 12,
            marginTop: 0
          }}>
            Choose how creator communities are displayed
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { value: 'classic', label: 'Classic', description: 'Traditional feed layout with profile card and course pills' },
              { value: 'hub', label: 'Hub', description: 'Tabbed layout with Feeds, Courses, Content, and Calendar views' }
            ].map(option => (
              <label
                key={option.value}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: communityViewMode === option.value
                    ? '2px solid #1d9bf0'
                    : '1px solid var(--border-color, #2f3336)',
                  background: communityViewMode === option.value
                    ? 'rgba(29, 155, 240, 0.1)'
                    : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <input
                  type="radio"
                  name="communityViewMode"
                  value={option.value}
                  checked={communityViewMode === option.value}
                  onChange={(e) => setCommunityViewMode(e.target.value)}
                  style={{
                    width: 18,
                    height: 18,
                    accentColor: '#1d9bf0',
                    marginTop: 2
                  }}
                />
                <div>
                  <div style={{
                    color: communityViewMode === option.value ? '#1d9bf0' : 'var(--text-primary, #e7e9ea)',
                    fontWeight: communityViewMode === option.value ? 600 : 400,
                    fontSize: 'var(--fs-14)',
                    marginBottom: 2
                  }}>
                    {option.label}
                  </div>
                  <div style={{
                    color: 'var(--text-secondary, #71767b)',
                    fontSize: 12
                  }}>
                    {option.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Discover Listing Format Section */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 'var(--fs-16)', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary, #e7e9ea)' }}>
          Discover Listing Format
        </h3>
        <div style={{
          background: 'var(--bg-secondary, #16181c)',
          borderRadius: 12,
          padding: '16px 20px'
        }}>
          <p style={{
            color: 'var(--text-secondary, #71767b)',
            fontSize: 'var(--fs-13)',
            marginBottom: 12,
            marginTop: 0
          }}>
            Choose how courses are displayed in Discover
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { value: 'standard', label: 'Standard Listing', description: 'Community header and course cards shown separately' },
              { value: 'compact', label: 'Compact Listing', description: 'Combined community + course in single card' },
              { value: 'thirdtry', label: 'Third Try', description: 'Card-based layout with gradient headers and timeline' },
              { value: 'combined', label: 'Combined Card', description: 'Course info with glassmorphism community badge' }
            ].map(option => (
              <label
                key={option.value}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: discoverListingFormat === option.value
                    ? '2px solid #1d9bf0'
                    : '1px solid var(--border-color, #2f3336)',
                  background: discoverListingFormat === option.value
                    ? 'rgba(29, 155, 240, 0.1)'
                    : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <input
                  type="radio"
                  name="discoverListingFormat"
                  value={option.value}
                  checked={discoverListingFormat === option.value}
                  onChange={(e) => setDiscoverListingFormat(e.target.value)}
                  style={{
                    width: 18,
                    height: 18,
                    accentColor: '#1d9bf0',
                    marginTop: 2
                  }}
                />
                <div>
                  <div style={{
                    color: discoverListingFormat === option.value ? '#1d9bf0' : 'var(--text-primary, #e7e9ea)',
                    fontWeight: discoverListingFormat === option.value ? 600 : 400,
                    fontSize: 'var(--fs-14)',
                    marginBottom: 2
                  }}>
                    {option.label}
                  </div>
                  <div style={{
                    color: 'var(--text-secondary, #71767b)',
                    fontSize: 12
                  }}>
                    {option.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Combined Card Gray Level (only shown when combined is selected) */}
      {discoverListingFormat === 'combined' && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 'var(--fs-16)', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary, #e7e9ea)' }}>
            Combined Card Background
          </h3>
          <div style={{
            background: 'var(--bg-secondary, #16181c)',
            borderRadius: 12,
            padding: '16px 20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12
            }}>
              <span style={{ color: 'var(--text-secondary, #71767b)', fontSize: 13 }}>
                Adjust gray level for card background
              </span>
              <span style={{
                color: '#1d9bf0',
                fontWeight: 600,
                fontSize: 'var(--fs-14)',
                minWidth: 50,
                textAlign: 'right'
              }}>
                {combinedCardGrayLevel}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={combinedCardGrayLevel}
              onChange={(e) => setCombinedCardGrayLevel(parseInt(e.target.value, 10))}
              style={{
                width: '100%',
                height: 6,
                borderRadius: 3,
                appearance: 'none',
                background: `linear-gradient(to right, #1d9bf0 0%, #1d9bf0 ${combinedCardGrayLevel}%, var(--border-color, #2f3336) ${combinedCardGrayLevel}%, var(--border-color, #2f3336) 100%)`,
                cursor: 'pointer',
                accentColor: '#1d9bf0'
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 8,
              fontSize: 'var(--fs-11)',
              color: 'var(--text-secondary, #71767b)'
            }}>
              <span>White (0%)</span>
              <span>Light gray (50%)</span>
              <span>Dark gray (100%)</span>
            </div>
            {/* Preview swatch */}
            <div style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 8,
              background: `rgb(${255 - Math.round(combinedCardGrayLevel * 0.6)}, ${255 - Math.round(combinedCardGrayLevel * 0.6)}, ${255 - Math.round(combinedCardGrayLevel * 0.6)})`,
              border: '1px solid var(--border-color, #2f3336)',
              textAlign: 'center',
              color: combinedCardGrayLevel > 50 ? '#fff' : '#333',
              fontSize: 'var(--fs-12)'
            }}>
              Preview: Background color
            </div>
          </div>
        </div>
      )}

      {/* Compact View Text Size (only shown when compact is selected) */}
      {discoverListingFormat === 'compact' && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 'var(--fs-16)', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary, #e7e9ea)' }}>
            Compact View Text Size
          </h3>
          <div style={{
            background: 'var(--bg-secondary, #16181c)',
            borderRadius: 12,
            padding: '16px 20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12
            }}>
              <span style={{ color: 'var(--text-secondary, #71767b)', fontSize: 13 }}>
                Adjust text size for compact listings
              </span>
              <span style={{
                color: '#1d9bf0',
                fontWeight: 600,
                fontSize: 'var(--fs-14)',
                minWidth: 50,
                textAlign: 'right'
              }}>
                {Math.round(compactTextScale * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.6"
              step="0.05"
              value={compactTextScale}
              onChange={(e) => setCompactTextScale(parseFloat(e.target.value))}
              style={{
                width: '100%',
                height: 6,
                borderRadius: 3,
                appearance: 'none',
                background: `linear-gradient(to right, #1d9bf0 0%, #1d9bf0 ${((compactTextScale - 0.8) / 0.8) * 100}%, var(--border-color, #2f3336) ${((compactTextScale - 0.8) / 0.8) * 100}%, var(--border-color, #2f3336) 100%)`,
                cursor: 'pointer',
                accentColor: '#1d9bf0'
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 8,
              fontSize: 'var(--fs-11)',
              color: 'var(--text-secondary, #71767b)'
            }}>
              <span>Small (80%)</span>
              <span>Normal (100%)</span>
              <span>Large (160%)</span>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Section */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 'var(--fs-16)', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary, #e7e9ea)' }}>
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
        <h3 style={{ fontSize: 'var(--fs-16)', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary, #e7e9ea)' }}>
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
            fontSize: 'var(--fs-15)',
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
            fontSize: 'var(--fs-15)',
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
      <h2 style={{ fontSize: 'var(--fs-20)', fontWeight: 700, marginBottom: 24, color: 'var(--text-primary, #e7e9ea)' }}>
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
              <h3 style={{ fontSize: 'var(--fs-15)', fontWeight: 600, marginBottom: 4, color: 'var(--text-primary, #e7e9ea)' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary, #71767b)', margin: 0 }}>
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
      <h2 style={{ fontSize: 'var(--fs-20)', fontWeight: 700, marginBottom: 24, color: 'var(--text-primary, #e7e9ea)' }}>
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
              <h3 style={{ fontSize: 'var(--fs-16)', fontWeight: 600, color: 'var(--text-primary, #e7e9ea)', margin: 0 }}>
                {item.title}
              </h3>
              <span style={{
                padding: '4px 10px',
                borderRadius: 12,
                fontSize: 'var(--fs-12)',
                fontWeight: 600,
                background: item.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(29, 155, 240, 0.1)',
                color: item.status === 'Completed' ? '#10b981' : '#1d9bf0'
              }}>
                {item.status}
              </span>
            </div>
            <p style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary, #71767b)', margin: '0 0 12px 0' }}>
              {item.date} • {item.hours} hours
            </p>
            {item.status === 'Completed' ? (
              <span style={{ fontSize: 'var(--fs-14)', fontWeight: 600, color: '#10b981' }}>Grade: {item.grade}</span>
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
                <span style={{ fontSize: 'var(--fs-12)', color: 'var(--text-secondary, #71767b)', marginTop: 4, display: 'block' }}>
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
      <h2 style={{ fontSize: 'var(--fs-20)', fontWeight: 700, marginBottom: 24, color: 'var(--text-primary, #e7e9ea)' }}>
        Privacy & Security
      </h2>
      
      {/* Profile Visibility */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 'var(--fs-16)', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary, #e7e9ea)' }}>
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
        <h3 style={{ fontSize: 'var(--fs-16)', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary, #e7e9ea)' }}>
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
              fontSize: 'var(--fs-12)', 
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
      <h2 style={{ fontSize: 'var(--fs-20)', fontWeight: 700, marginBottom: 24, color: 'var(--text-primary, #e7e9ea)' }}>
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
              <h3 style={{ fontSize: 'var(--fs-16)', fontWeight: 600, marginBottom: 4, color: 'var(--text-primary, #e7e9ea)' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: 'var(--fs-13)', color: 'var(--text-secondary, #71767b)', margin: 0 }}>
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

