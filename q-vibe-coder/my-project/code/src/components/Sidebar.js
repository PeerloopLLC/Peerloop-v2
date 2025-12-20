import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './Sidebar.css';
import { 
  FaHome, 
  FaSearch, 
  FaBell, 
  FaEnvelope, 
  FaUser, 
  FaEllipsisH,
  FaFeatherAlt,
  FaCog,
  FaSignOutAlt,
  FaUserEdit,
  FaShieldAlt,
  FaBookmark,
  FaHeart,
  FaHistory,
  FaQuestionCircle,
  FaMoon,
  FaSun,
  FaUsers,
  FaChalkboardTeacher
} from 'react-icons/fa';
import { UserPropType } from './PropTypes';
import useDeviceDetect from '../hooks/useDeviceDetect';

/**
 * Sidebar Component
 * 
 * This component renders the left navigation sidebar with menu items and user profile.
 * It handles navigation between different sections of the application and displays
 * the current user's profile information.
 * 
 * @param {Function} onMenuChange - Callback function to handle menu item clicks
 * @param {string} activeMenu - The currently active menu item
 */
const Sidebar = ({ onMenuChange, activeMenu, currentUser, isDarkMode, toggleDarkMode, onLogout, communityData }) => {
  // Track which tooltip is visible (by index)
  const [visibleTooltip, setVisibleTooltip] = useState(null);
  const timerRef = useRef(null);
  
  // Detect device type - collapse sidebar on non-desktop devices
  const { isWindows, isMac, isDesktop } = useDeviceDetect();
  const isDesktopComputer = (isWindows || isMac) && isDesktop;
  const shouldCollapse = !isDesktopComputer;

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  /**
   * Shows tooltip for 5 seconds then hides it
   * @param {number} index - The index of the menu item
   */
  const showTooltipTemporarily = (index) => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Show the tooltip
    setVisibleTooltip(index);
    
    // Hide after half a second
    timerRef.current = setTimeout(() => {
      setVisibleTooltip(null);
    }, 500);
  };

  /**
   * Main navigation menu items
   * Each item has an icon, label (for internal logic), and optional displayLabel (for UI)
   */
  const menuItems = [
    { icon: <FaSearch />, label: 'Browse', displayLabel: 'Browse Courses' }, // Browse courses and instructors
    { icon: <FaUsers />, label: 'My Community', displayLabel: 'Community' }, // Community features
    { icon: <FaBell />, label: 'Notifications', displayLabel: 'Notifications' }, // Notification center
    { icon: <FaChalkboardTeacher />, label: 'Teaching', displayLabel: 'Dashboard' }, // Student-Teacher dashboard
    { icon: <FaEnvelope />, label: 'Messages', displayLabel: 'Messages' }, // Messaging system
    { icon: <FaUser />, label: 'Profile', displayLabel: 'Profile' }, // User profile
    { icon: isDarkMode ? <FaSun /> : <FaMoon />, label: 'ToggleTheme', displayLabel: isDarkMode ? 'Light Mode' : 'Dark Mode' }, // Theme toggle
    { icon: <FaFeatherAlt />, label: 'Mockup', displayLabel: 'NEW Mockup' }, // Design mockup (temp)
  ];

  /**
   * Profile dropdown menu items
   * These appear when the user profile is clicked
   */
  const profileMenuItems = [
    { icon: <FaUserEdit />, label: 'Edit Profile', action: 'edit-profile' },
    { icon: <FaBookmark />, label: 'Bookmarks', action: 'bookmarks' },
    { icon: <FaHistory />, label: 'History', action: 'history' },
    { icon: <FaCog />, label: 'Settings', action: 'settings' },
    { icon: isDarkMode ? <FaSun /> : <FaMoon />, label: isDarkMode ? 'Light Mode' : 'Dark Mode', action: 'toggle-theme' },
    { icon: <FaShieldAlt />, label: 'Privacy & Security', action: 'privacy' },
    { icon: <FaQuestionCircle />, label: 'Help & Support', action: 'help' },
    { icon: <FaSignOutAlt />, label: 'Sign Out', action: 'signout' },
  ];

  /**
   * Handles clicks on the user profile section
   * Navigates to the Profile page
   */
  const handleProfileClick = () => {
    onMenuChange('Profile');
  };

  /**
   * Handles actions from the profile dropdown menu
   * @param {string} action - The action to perform
   */
  const handleProfileMenuAction = (action) => {
    if (action === 'signout') {
      // Handle logout/switch user
      if (onLogout) {
        onLogout();
      }
    } else if (action === 'settings') {
      onMenuChange('Settings');
    } else if (action === 'toggle-theme') {
      // Toggle dark/light mode
      if (toggleDarkMode) {
        toggleDarkMode();
      }
    } else {
      onMenuChange('Profile');
    }
  };

  /**
   * Handles clicks on main navigation menu items
   * @param {string} label - The label of the clicked menu item
   */
  const handleMenuClick = (label) => {
    if (label === 'ToggleTheme') {
      // Handle theme toggle
      if (toggleDarkMode) {
        toggleDarkMode();
      }
    } else if (label === 'Browse' && activeMenu === 'Browse') {
      // If already on Browse page, pass a special signal to reset the view
      onMenuChange('Browse_Reset');
    } else {
      onMenuChange(label);
    }
  };

  return (
    <div className={`sidebar ${shouldCollapse ? 'sidebar-collapsed' : ''}`}>
      {/* Header section with logo */}
      <div className="sidebar-header" style={{ padding: '4px 8px', marginBottom: '0px' }}>
        <div className="logo" style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '6px 4px 4px 4px',
          gap: '0px'
        }}>
          <span style={{ 
            fontSize: '26px', 
            color: '#1d9bf0',
            lineHeight: 1
          }}>
            ∞
          </span>
          <span style={{ 
            fontSize: '9px', 
            fontWeight: '600', 
            color: '#94a3b8',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>
            PeerLoop
          </span>
        </div>
      </div>
      
      {/* Main navigation menu */}
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`nav-item ${activeMenu === item.label ? 'active' : ''}`}
            onClick={() => {
              showTooltipTemporarily(index);
              handleMenuClick(item.label);
            }}
          >
            <div className="nav-icon">{item.icon}</div>
            {/* Use displayLabel if available, otherwise use label */}
            <span className="nav-label">{item.displayLabel || item.label}</span>
            {/* Tooltip for collapsed sidebar - shown on click for 5 seconds */}
            <span className={`nav-tooltip ${visibleTooltip === index ? 'tooltip-visible' : ''}`}>
              {item.displayLabel || item.label}
            </span>
          </div>
        ))}
      </nav>

      {/* Your Creators Section - Always visible */}
      {communityData && !shouldCollapse && (
        <div className="sidebar-creators-section">
          <div className="sidebar-divider" style={{ height: 1, background: isDarkMode ? '#2f3336' : '#eff3f4', margin: '8px 12px 16px' }} />
          <div className="creators-section-title" style={{ fontSize: 11, fontWeight: 600, color: '#71767b', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '0 14px', marginBottom: 12 }}>
            Your Creators
          </div>
          <div className="creators-list" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Individual Creators */}
            {communityData.creators?.map(creator => {
              const isActive = communityData.selectedCreatorId === creator.id;
              return (
                <div
                  key={creator.id}
                  onClick={() => {
                    // Store pending creator for Community to pick up
                    localStorage.setItem('pendingSidebarCreator', JSON.stringify({ id: creator.id, name: creator.name }));
                    communityData.onSelectCreator(creator);
                    onMenuChange('My Community');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 14px',
                    borderRadius: 12,
                    cursor: 'pointer',
                    background: isActive ? 'rgba(29, 155, 240, 0.1)' : 'transparent'
                  }}
                >
                  {creator.instructor?.avatar ? (
                    <img
                      src={creator.instructor.avatar}
                      alt={creator.name}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: isActive ? '2px solid #1d9bf0' : '2px solid transparent'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: '#1d9bf0',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 600,
                      border: isActive ? '2px solid #1d9bf0' : '2px solid transparent'
                    }}>
                      {creator.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: isDarkMode ? '#e7e9ea' : '#0f1419', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {creator.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#71767b' }}>
                      {creator.followedCourseIds?.length || 0} courses
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Browse Creators Link */}
            <div
              onClick={() => {
                localStorage.setItem('browseActiveTopMenu', 'creators');
                onMenuChange('Browse');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                color: '#71767b',
                fontSize: 14,
                cursor: 'pointer',
                borderRadius: 12,
                marginTop: 4
              }}
            >
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: isDarkMode ? '#2f3336' : '#eff3f4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18
              }}>+</div>
              <span>Browse creators</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Sidebar.propTypes = {
  onMenuChange: PropTypes.func.isRequired,
  activeMenu: PropTypes.string.isRequired,
  currentUser: UserPropType,
  isDarkMode: PropTypes.bool,
  toggleDarkMode: PropTypes.func
};

Sidebar.defaultProps = {
  currentUser: null,
  isDarkMode: false,
  toggleDarkMode: () => {}
};

export default Sidebar; 