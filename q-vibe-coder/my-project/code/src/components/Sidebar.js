import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './Sidebar.css';
import {  FaSearch,  FaBell,  FaEnvelope,  FaUser,  FaUsers,  FaChalkboardTeacher,  FaBook,  FaInfoCircle} from 'react-icons/fa';
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
 * @param {Object} currentUser - Current user object with id
 * @param {Function} onSelectCommunity - Callback when a community is selected from sidebar
 */
const Sidebar = ({ onMenuChange, activeMenu, currentUser, onSelectCommunity }) => {
  // Track which tooltip is visible (by index)
  const [visibleTooltip, setVisibleTooltip] = useState(null);
  const timerRef = useRef(null);

  // Load communities from localStorage
  const [communities, setCommunities] = useState([]);

  // Track if communities list is expanded (Show More)
  const [isCommunitiesExpanded, setIsCommunitiesExpanded] = useState(false);

  // Track if flyout is open
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);

  // Timer for auto-closing flyout after inactivity
  const flyoutInactivityTimerRef = useRef(null);
  const FLYOUT_INACTIVITY_TIMEOUT = 1000; // 1 second
  
  // Grace period - flyout stays open for 1 second after opening regardless of mouse position
  const isInGracePeriodRef = useRef(false);
  const gracePeriodTimerRef = useRef(null);
  const GRACE_PERIOD_DURATION = 1000; // 1 second grace period

  // Number of communities to always show (just The Commons)
  const VISIBLE_COMMUNITY_COUNT = 1;

  // Detect device type - collapse sidebar on non-desktop devices
  const { isWindows, isMac, isDesktop } = useDeviceDetect();
  const isDesktopComputer = (isWindows || isMac) && isDesktop;
  const shouldCollapse = !isDesktopComputer;

  // Start the flyout close timer (only if not in grace period)
  const startFlyoutCloseTimer = () => {
    // Don't start close timer during grace period
    if (isInGracePeriodRef.current) return;
    
    if (flyoutInactivityTimerRef.current) {
      clearTimeout(flyoutInactivityTimerRef.current);
    }
    flyoutInactivityTimerRef.current = setTimeout(() => {
      setIsFlyoutOpen(false);
    }, FLYOUT_INACTIVITY_TIMEOUT);
  };

  // Clear the flyout close timer (keeps flyout open)
  const clearFlyoutCloseTimer = () => {
    if (flyoutInactivityTimerRef.current) {
      clearTimeout(flyoutInactivityTimerRef.current);
      flyoutInactivityTimerRef.current = null;
    }
  };
  
  // Start grace period when flyout opens
  const startGracePeriod = () => {
    isInGracePeriodRef.current = true;
    if (gracePeriodTimerRef.current) {
      clearTimeout(gracePeriodTimerRef.current);
    }
    gracePeriodTimerRef.current = setTimeout(() => {
      isInGracePeriodRef.current = false;
      // After grace period, start close timer (will be cancelled if hovering)
      startFlyoutCloseTimer();
    }, GRACE_PERIOD_DURATION);
  };

  // Flyout hover handler (desktop only - opens on hover)
  const handleFlyoutMouseEnter = () => {
    if (isDesktopComputer) {
      setIsFlyoutOpen(true);
      clearFlyoutCloseTimer(); // Keep open while hovering
    }
  };

  // Handle mouse leaving the flyout area - start close timer
  const handleFlyoutMouseLeave = () => {
    startFlyoutCloseTimer();
  };

  // Close flyout when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Don't close if clicking on feeds-section or The Commons sub-item
      if (isFlyoutOpen && !e.target.closest('.feeds-section') && !e.target.closest('.nav-sub-item')) {
        setIsFlyoutOpen(false);
        if (flyoutInactivityTimerRef.current) {
          clearTimeout(flyoutInactivityTimerRef.current);
        }
      }
    };
    if (isFlyoutOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isFlyoutOpen]);

  // Load communities from localStorage when user changes
  useEffect(() => {
    const loadCommunities = () => {
      if (!currentUser?.id) {
        setCommunities([]);
        return;
      }
      try {
        const storageKey = `followedCommunities_${currentUser.id}`;
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setCommunities(parsed);
          }
        }
      } catch (error) {
        console.error('Error loading communities:', error);
      }
    };

    loadCommunities();

    // Listen for storage changes (when MainContent updates communities)
    const handleStorageChange = (e) => {
      if (e.key === `followedCommunities_${currentUser?.id}`) {
        loadCommunities();
      }
    };

    // Also listen for custom event from MainContent
    const handleCommunitiesUpdate = () => {
      loadCommunities();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('communitiesUpdated', handleCommunitiesUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('communitiesUpdated', handleCommunitiesUpdate);
    };
  }, [currentUser?.id]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (flyoutInactivityTimerRef.current) {
        clearTimeout(flyoutInactivityTimerRef.current);
      }
      if (gracePeriodTimerRef.current) {
        clearTimeout(gracePeriodTimerRef.current);
      }
    };
  }, []);

  /**
   * Shows tooltip for 5 seconds then hides it
   * @param {number} index - The index of the menu item
   */
  const showTooltipTemporarily = (index) => {
    // Only show tooltips in collapsed mode (labels are hidden)
    if (!shouldCollapse) return;

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
   * Primary menu items (top section)
   */
  const primaryItems = [
    { icon: <FaUsers />, label: 'Feeds', displayLabel: 'Feeds' }, // Feeds (was My Communities)
    { icon: <FaSearch />, label: 'Discover', displayLabel: 'Discover' }, // Discover (unified search for communities & courses)
    // Courses menu item removed - functionality still available via Discover
    // { icon: <FaBook />, label: 'Courses', displayLabel: 'Courses' }, // Browse courses
  ];

  /**
   * Personal menu items (middle section)
   */
  const personalItems = [
    { icon: <FaBook />, label: 'My Courses', displayLabel: 'My Courses' }, // User's enrolled courses
    { icon: <FaEnvelope />, label: 'Messages', displayLabel: 'Messages' }, // Messaging system
    { icon: <FaBell />, label: 'Notifications', displayLabel: 'Notifications' }, // Notification center
    { icon: <FaChalkboardTeacher />, label: 'Dashboard', displayLabel: 'Dashboard' }, // User dashboard (varies by role)
    { icon: <FaUser />, label: 'Profile', displayLabel: 'Profile' }, // User profile
  ];

  /**
   * Footer menu items (bottom section)
   */
  const footerItems = [
    { icon: <FaInfoCircle />, label: 'About', displayLabel: 'How It Works' }, // How PeerLoop works
  ];


  /**
   * Handles clicks on main navigation menu items
   * @param {string} label - The label of the clicked menu item
   */
  const handleMenuClick = (label) => {
    if (label === 'About') {
      onMenuChange('About');
    } else if (label === 'Courses') {
      onMenuChange('Browse_Courses');
    } else if (label === 'Discover') {
      onMenuChange('Discover');
    } else if (label === 'Feeds') {
      onMenuChange('My Community'); // Feeds maps to existing My Community view
    } else {
      onMenuChange(label);
    }
  };

  /**
   * Toggle communities list expanded/collapsed state
   */
  const toggleCommunitiesExpanded = (e) => {
    e.stopPropagation();
    setIsCommunitiesExpanded(!isCommunitiesExpanded);
  };

  /**
   * Handle community selection from the Feeds sub-menu
   */
  const handleCommunitySelect = (community) => {
    localStorage.setItem('pendingCommunityCreator', JSON.stringify(community));
    window.dispatchEvent(new CustomEvent('communitySelected', { detail: community }));
    if (onSelectCommunity) {
      onSelectCommunity(community);
    }
    onMenuChange('My Community');
  };

  // Calculate visible and hidden communities
  const townHall = { id: 'town-hall', name: 'The Commons', type: 'hub' };
  const allCommunities = [townHall, ...communities];
  const visibleCommunities = allCommunities.slice(0, VISIBLE_COMMUNITY_COUNT);
  const hiddenCommunities = allCommunities.slice(VISIBLE_COMMUNITY_COUNT);
  const hiddenCount = hiddenCommunities.length;

  // Flyout only works when user has followed at least one community
  const hasFollowedCommunities = communities.length > 0;

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
        {/* Feeds Section with scrollable communities */}
        <div
          className="feeds-section"
        >
          {/* Feeds header - works for both collapsed and expanded sidebar */}
          {shouldCollapse ? (
            /* Collapsed sidebar: Compact feed button */
            <div
              className={`feeds-compact-btn ${activeMenu === 'My Community' ? 'active' : ''} ${isFlyoutOpen ? 'flyout-open' : ''} ${!hasFollowedCommunities ? 'no-flyout' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                // Navigate to The Commons
                handleCommunitySelect(townHall);
                // Only toggle flyout if user has followed communities
                if (hasFollowedCommunities) {
                  const willOpen = !isFlyoutOpen;
                  setIsFlyoutOpen(willOpen);
                  if (willOpen) {
                    startGracePeriod();
                  } else {
                    clearFlyoutCloseTimer();
                  }
                }
              }}
              onMouseEnter={() => hasFollowedCommunities && clearFlyoutCloseTimer()}
              onMouseLeave={() => hasFollowedCommunities && isFlyoutOpen && startFlyoutCloseTimer()}
            >
              <div className="feeds-compact-main-icon"><FaUsers /></div>
              <div className="feeds-compact-count">{allCommunities.length}</div>
              {hasFollowedCommunities && <div className="feeds-compact-arrow">{isFlyoutOpen ? '◀' : '▶'}</div>}
            </div>
          ) : (
            /* Expanded sidebar: Feeds header with popup */
            <div
              className={`nav-item feeds-header ${activeMenu === 'My Community' ? 'active' : ''} ${isFlyoutOpen ? 'flyout-open' : ''} ${!hasFollowedCommunities ? 'no-flyout' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                // Navigate to The Commons
                handleCommunitySelect(townHall);
                // Only toggle flyout if user has followed communities
                if (hasFollowedCommunities) {
                  const willOpen = !isFlyoutOpen;
                  setIsFlyoutOpen(willOpen);
                  if (willOpen) {
                    startGracePeriod();
                  } else {
                    clearFlyoutCloseTimer();
                  }
                }
              }}
              onMouseEnter={() => hasFollowedCommunities && clearFlyoutCloseTimer()}
              onMouseLeave={() => hasFollowedCommunities && isFlyoutOpen && startFlyoutCloseTimer()}
            >
              <div className="nav-icon"><FaUsers /></div>
              <span className="nav-label">Feeds ({allCommunities.length})</span>
              {hasFollowedCommunities && (
                <span className="feeds-arrow-toggle">
                  <span className="arrow-up">▴</span>
                  <span className="arrow-down">▾</span>
                </span>
              )}
            </div>
          )}

          {/* Flyout popup panel - works for both collapsed and expanded sidebar */}
          {isFlyoutOpen && (
            <div
              className={`feeds-flyout ${shouldCollapse ? 'feeds-flyout-collapsed' : 'feeds-flyout-expanded'}`}
              onMouseEnter={clearFlyoutCloseTimer}
              onMouseLeave={startFlyoutCloseTimer}
            >
              <div className="feeds-flyout-header">
                Feeds ({allCommunities.length})
              </div>
              <div className="feeds-flyout-list">
                {/* The Commons - always first in the list */}
                <div
                  className="feeds-flyout-item"
                  onClick={() => {
                    handleCommunitySelect(townHall);
                    setIsFlyoutOpen(false);
                  }}
                >
                  <div className="community-avatar" style={{ background: '#64748b', fontSize: '14px' }}>🏛</div>
                  <span className="community-name">The Commons</span>
                </div>
                {/* Creator communities */}
                {communities.map((community) => {
                  const displayName = community.name || community.id?.replace('creator-', '') || 'Community';
                  const initial = displayName.charAt(0).toUpperCase();

                  return (
                    <div
                      key={community.id}
                      className="feeds-flyout-item"
                      onClick={() => {
                        handleCommunitySelect(community);
                        setIsFlyoutOpen(false);
                      }}
                    >
                      {community.avatar ? (
                        <img
                          src={community.avatar}
                          alt={displayName}
                          className="community-avatar community-avatar-img"
                        />
                      ) : (
                        <div className="community-avatar">{initial}</div>
                      )}
                      <span className="community-name">{displayName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Discover item */}
        <div
          className={`nav-item ${activeMenu === 'Discover' ? 'active' : ''}`}
          onClick={() => {
            showTooltipTemporarily(1);
            handleMenuClick('Discover');
          }}
          onMouseEnter={() => isFlyoutOpen && !isInGracePeriodRef.current && setIsFlyoutOpen(false)}
        >
          <div className="nav-icon"><FaSearch /></div>
          <span className="nav-label">Discover</span>
          <span className={`nav-tooltip ${visibleTooltip === 1 ? 'tooltip-visible' : ''}`}>
            Discover
          </span>
        </div>

        {/* Personal items - My Courses, Notifications, Dashboard, Messages, Profile */}
        {personalItems.map((item, index) => (
          <div
            key={index + primaryItems.length}
            className={`nav-item ${activeMenu === item.label ? 'active' : ''}`}
            onClick={() => {
              showTooltipTemporarily(index + primaryItems.length);
              handleMenuClick(item.label);
            }}
            onMouseEnter={() => isFlyoutOpen && !isInGracePeriodRef.current && setIsFlyoutOpen(false)}
          >
            <div className="nav-icon">{item.icon}</div>
            <span className="nav-label">{item.displayLabel || item.label}</span>
            <span className={`nav-tooltip ${visibleTooltip === index + primaryItems.length ? 'tooltip-visible' : ''}`}>
              {item.displayLabel || item.label}
            </span>
          </div>
        ))}

        {/* Footer items - How It Works */}
        {footerItems.map((item, index) => (
          <div
            key={index + primaryItems.length + personalItems.length}
            className={`nav-item ${activeMenu === 'About' ? 'active' : ''}`}
            onClick={() => {
              showTooltipTemporarily(index + primaryItems.length + personalItems.length);
              handleMenuClick(item.label);
            }}
            onMouseEnter={() => isFlyoutOpen && !isInGracePeriodRef.current && setIsFlyoutOpen(false)}
          >
            <div className="nav-icon">{item.icon}</div>
            <span className="nav-label">{item.displayLabel || item.label}</span>
            <span className={`nav-tooltip ${visibleTooltip === index + primaryItems.length + personalItems.length ? 'tooltip-visible' : ''}`}>
              {item.displayLabel || item.label}
            </span>
          </div>
        ))}

        {/* Divider line */}
        <div className="nav-section-divider" />

        {/* Scrollable Communities Section */}
        <div 
          className="sidebar-communities-section"
          onMouseEnter={() => isFlyoutOpen && !isInGracePeriodRef.current && setIsFlyoutOpen(false)}
        >
          <div className="communities-header">
            <span className="communities-title">My Feeds</span>
          </div>
          <div className="communities-list">
            {/* The Commons - always first */}
            <div
              className="community-item"
              onClick={() => handleCommunitySelect(townHall)}
            >
              <div className="community-avatar town-hall-avatar">🏛</div>
              <span className="community-name">The Commons</span>
            </div>
            {/* Followed creator communities */}
            {communities.map((community) => {
              const displayName = community.name || community.id?.replace('creator-', '') || 'Community';
              const initial = displayName.charAt(0).toUpperCase();
              return (
                <div
                  key={community.id}
                  className="community-item"
                  onClick={() => handleCommunitySelect(community)}
                >
                  {community.avatar ? (
                    <img
                      src={community.avatar}
                      alt={displayName}
                      className="community-avatar community-avatar-img"
                    />
                  ) : (
                    <div className="community-avatar">{initial}</div>
                  )}
                  <span className="community-name">{displayName}</span>
                </div>
              );
            })}
          </div>
        </div>

      </nav>
    </div>
  );
};

Sidebar.propTypes = {
  onMenuChange: PropTypes.func.isRequired,
  activeMenu: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
  onSelectCommunity: PropTypes.func
};

export default Sidebar; 