import React, { useState } from 'react';
import './BottomNav.css';
import { 
  FaUsers, 
  FaSearch, 
  FaBell, 
  FaTachometerAlt,
  FaEllipsisH,
  FaEnvelope,
  FaUser,
  FaBriefcase,
  FaChalkboardTeacher,
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaTimes
} from 'react-icons/fa';

/**
 * BottomNav Component - Mobile bottom navigation bar
 * Shows on screens < 480px when sidebar is hidden
 */
const BottomNav = ({ onMenuChange, activeMenu, isDarkMode, toggleDarkMode, onLogout }) => {
  const [showMore, setShowMore] = useState(false);

  const mainNavItems = [
    { icon: <FaUsers />, label: 'My Community', displayLabel: 'Community' },
    { icon: <FaSearch />, label: 'Browse', displayLabel: 'Browse' },
    { icon: <FaBell />, label: 'Notifications', displayLabel: 'Alerts' },
    { icon: <FaTachometerAlt />, label: 'Workspace', displayLabel: 'Home' },
    { icon: <FaEllipsisH />, label: 'More', displayLabel: 'More' },
  ];

  const moreMenuItems = [
    { icon: <FaChalkboardTeacher />, label: 'Teaching', displayLabel: 'Teaching' },
    { icon: <FaEnvelope />, label: 'Messages', displayLabel: 'Messages' },
    { icon: <FaBriefcase />, label: 'Job Exchange', displayLabel: 'Jobs' },
    { icon: <FaUser />, label: 'Profile', displayLabel: 'Profile' },
    { icon: isDarkMode ? <FaSun /> : <FaMoon />, label: 'ToggleTheme', displayLabel: isDarkMode ? 'Light' : 'Dark' },
    { icon: <FaSignOutAlt />, label: 'Logout', displayLabel: 'Logout' },
  ];

  const handleNavClick = (label) => {
    if (label === 'More') {
      setShowMore(!showMore);
    } else if (label === 'ToggleTheme') {
      toggleDarkMode();
      setShowMore(false);
    } else if (label === 'Logout') {
      onLogout();
      setShowMore(false);
    } else {
      onMenuChange(label);
      setShowMore(false);
    }
  };

  return (
    <>
      {/* More Menu Overlay */}
      {showMore && (
        <div className="bottom-nav-overlay" onClick={() => setShowMore(false)}>
          <div className="bottom-nav-more-menu" onClick={(e) => e.stopPropagation()}>
            <div className="more-menu-header">
              <span>More</span>
              <button className="more-menu-close" onClick={() => setShowMore(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="more-menu-items">
              {moreMenuItems.map((item, index) => (
                <button
                  key={index}
                  className={`more-menu-item ${activeMenu === item.label ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.label)}
                >
                  <span className="more-menu-icon">{item.icon}</span>
                  <span className="more-menu-label">{item.displayLabel}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className={`bottom-nav ${isDarkMode ? 'dark' : ''}`}>
        {mainNavItems.map((item, index) => (
          <button
            key={index}
            className={`bottom-nav-item ${activeMenu === item.label ? 'active' : ''} ${item.label === 'More' && showMore ? 'active' : ''}`}
            onClick={() => handleNavClick(item.label)}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.displayLabel}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default BottomNav;


