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
  FaBriefcase,
  FaMoon,
  FaSun,
  FaTachometerAlt,
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
const Sidebar = ({ onMenuChange, activeMenu, currentUser, isDarkMode, toggleDarkMode, onLogout }) => {
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
    { icon: <FaUsers />, label: 'My Community', displayLabel: 'Community' }, // Community features
    { icon: <FaSearch />, label: 'Browse', displayLabel: 'Browse' }, // Browse courses and instructors
    { icon: <FaBell />, label: 'Notifications', displayLabel: 'Notifications' }, // Notification center
    { icon: <FaTachometerAlt />, label: 'Dashboard', displayLabel: 'Dashboard' }, // User's learning dashboard
    { icon: <FaChalkboardTeacher />, label: 'Teaching', displayLabel: 'Teaching' }, // Student-Teacher dashboard
    { icon: <FaEnvelope />, label: 'Messages', displayLabel: 'Messages' }, // Messaging system
    { icon: <FaBriefcase />, label: 'Job Exchange', displayLabel: 'Job Exchange' }, // Job exchange system
    { icon: <FaUser />, label: 'Profile', displayLabel: 'Profile' }, // User profile
    { icon: isDarkMode ? <FaSun /> : <FaMoon />, label: 'ToggleTheme', displayLabel: isDarkMode ? 'Light Mode' : 'Dark Mode' }, // Theme toggle
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