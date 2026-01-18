import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './Sidebar.css';
import {  FaSearch,  FaBell,  FaEnvelope,  FaUser,  FaUsers,  FaChalkboardTeacher,  FaBook,  FaInfoCircle,  FaCog} from 'react-icons/fa';
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

  // Track the currently selected/active community
  const [selectedCommunity, setSelectedCommunity] = useState(() => {
    try {
      const stored = localStorage.getItem('pendingCommunityCreator');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading selected community:', e);
    }
    return { id: 'town-hall', name: 'The Commons', type: 'hub' }; // Default to The Commons
  });

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

  // Click-outside handler removed - flyout now only closes when clicking a community or another menu item

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
    { icon: <FaUsers />, label: 'Feeds', displayLabel: 'My Feeds' }, // Feeds (was My Communities)
    { icon: <FaSearch />, label: 'Discover', displayLabel: 'Discover' }, // Discover (unified search for communities & courses)
    // Courses menu item removed - functionality still available via Discover
    // { icon: <FaBook />, label: 'Courses', displayLabel: 'Courses' }, // Browse courses
  ];

  /**
   * Personal menu items (middle section)
   * Dashboard is hidden for new users and students (only shown for creators, admins, student_teachers)
   */
  const showDashboard = currentUser?.userType &&
    ['creator', 'admin', 'student_teacher'].includes(currentUser.userType);

  const personalItems = [
    { icon: <FaBook />, label: 'My Courses', displayLabel: 'My Courses' }, // User's enrolled courses
    { icon: <FaEnvelope />, label: 'Messages', displayLabel: 'Messages' }, // Messaging system
    { icon: <FaBell />, label: 'Notifications', displayLabel: 'Notifications' }, // Notification center
    ...(showDashboard ? [{ icon: <FaChalkboardTeacher />, label: 'Dashboard', displayLabel: 'Dashboard' }] : []), // User dashboard (only for creators/admins)
    { icon: <FaUser />, label: 'Profile', displayLabel: 'Profile' }, // User profile
    { icon: <FaCog />, label: 'Settings', displayLabel: 'Settings' }, // Settings menu
  ];

  /**
   * Footer menu items (bottom section)
   */
  const footerItems = [];


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

  // Community navigation style preference from Profile settings
  const [communityNavStyle, setCommunityNavStyle] = useState(() => {
    const saved = localStorage.getItem('communityNavStyle');
    return saved || 'slideout'; // Default to slideout panel
  });

  // Listen for community nav style changes from Profile settings
  useEffect(() => {
    // Handle changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'communityNavStyle') {
        const newStyle = e.newValue || 'slideout';
        setCommunityNavStyle(newStyle);
        // Close flyout if switching to pills mode
        if (newStyle === 'pills') {
          setIsFlyoutOpen(false);
        }
      }
    };
    // Handle changes from same tab (custom event from Profile)
    const handleNavStyleChange = (e) => {
      const newStyle = e.detail || 'pills';
      setCommunityNavStyle(newStyle);
      // Close flyout if switching to pills mode
      if (newStyle === 'pills') {
        setIsFlyoutOpen(false);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('communityNavStyleChanged', handleNavStyleChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('communityNavStyleChanged', handleNavStyleChange);
    };
  }, []);

  // Track if slideout panel is open (to hide nav items when it's showing)
  const [isSlideoutPanelOpen, setIsSlideoutPanelOpen] = useState(false);
  useEffect(() => {
    const handleSlideoutStateChange = (e) => {
      setIsSlideoutPanelOpen(e.detail?.isOpen || false);
    };
    window.addEventListener('slideoutPanelStateChange', handleSlideoutStateChange);
    return () => window.removeEventListener('slideoutPanelStateChange', handleSlideoutStateChange);
  }, []);

  // Listen for community selection changes to update the displayed selected community
  useEffect(() => {
    const handleCommunitySelected = (e) => {
      if (e.detail) {
        setSelectedCommunity(e.detail);
      }
    };
    window.addEventListener('communitySelected', handleCommunitySelected);
    return () => window.removeEventListener('communitySelected', handleCommunitySelected);
  }, []);

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
              className={`feeds-compact-btn ${activeMenu === 'My Community' ? 'active' : ''} ${isFlyoutOpen ? 'flyout-open' : ''} ${!hasFollowedCommunities || communityNavStyle === 'pills' ? 'no-flyout' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                // Navigate to My Community (preserves current community selection)
                onMenuChange('My Community');
                // Toggle slideout panel if slideout mode is enabled
                if (hasFollowedCommunities && communityNavStyle === 'slideout') {
                  window.dispatchEvent(new CustomEvent('toggleSlideoutPanel'));
                }
                // Only toggle flyout if user has followed communities AND dropdown mode is enabled
                else if (hasFollowedCommunities && communityNavStyle === 'dropdown') {
                  const willOpen = !isFlyoutOpen;
                  setIsFlyoutOpen(willOpen);
                  if (willOpen) {
                    startGracePeriod();
                  } else {
                    clearFlyoutCloseTimer();
                  }
                }
              }}
              >
              <div className="feeds-compact-main-icon"><FaUsers /></div>
              <div className="feeds-compact-count">{allCommunities.length}</div>
              {hasFollowedCommunities && (communityNavStyle === 'dropdown' || communityNavStyle === 'slideout') && <div className="feeds-compact-arrow">{isFlyoutOpen ? '◀' : '▶'}</div>}
            </div>
          ) : (
            /* Expanded sidebar: Feeds group with shared background */
            <div className="feeds-group">
            {/* TOP: Community selector - shows selected community name + count + arrow */}
            <div
              className={`community-selector ${isFlyoutOpen ? 'flyout-open' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                // Toggle slideout panel if slideout mode is enabled
                if (hasFollowedCommunities && communityNavStyle === 'slideout') {
                  // If panel is already open, just close it (don't navigate)
                  if (isSlideoutPanelOpen) {
                    window.dispatchEvent(new CustomEvent('toggleSlideoutPanel'));
                  } else {
                    // Panel is closed - navigate to community and open panel
                    handleCommunitySelect(selectedCommunity);
                    window.dispatchEvent(new CustomEvent('toggleSlideoutPanel'));
                  }
                }
                // Or toggle flyout if dropdown mode is enabled
                else if (hasFollowedCommunities && communityNavStyle === 'dropdown') {
                  const willOpen = !isFlyoutOpen;
                  setIsFlyoutOpen(willOpen);
                  if (willOpen) {
                    startGracePeriod();
                  } else {
                    clearFlyoutCloseTimer();
                  }
                }
                // If no communities followed or pills mode, just navigate
                else {
                  handleCommunitySelect(selectedCommunity);
                }
              }}
            >
              {selectedCommunity.id === 'town-hall' ? (
                <img src="https://images.unsplash.com/photo-1555993539-1732b0258235?w=100&h=100&fit=crop" alt="The Commons" className="community-selector-avatar" />
              ) : selectedCommunity.avatar ? (
                <img
                  src={selectedCommunity.avatar}
                  alt={selectedCommunity.name}
                  className="community-selector-avatar"
                />
              ) : (
                <div className="community-selector-avatar community-selector-avatar-letter">
                  {(selectedCommunity.name || 'C').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="community-selector-info">
                <span className="community-selector-name">
                  {selectedCommunity.id === 'town-hall'
                    ? 'The Commons'
                    : `${selectedCommunity.name || 'Community'}`}
                </span>
                {hasFollowedCommunities && <span className="community-selector-count">Choose A Community Feed</span>}
              </div>
              {hasFollowedCommunities && (
                <span className="community-selector-arrow">&rarr;</span>
              )}
            </div>

            {/* SECOND: My Feeds static label - no arrow */}
            <div
              className={`nav-item feeds-label ${activeMenu === 'My Community' ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                // Close slideout panel if it's open
                if (isSlideoutPanelOpen) {
                  window.dispatchEvent(new CustomEvent('toggleSlideoutPanel'));
                }
                onMenuChange('My Community');
              }}
            >
              <div className="nav-icon"><FaUsers /></div>
              <span className="nav-label">My Feeds</span>
            </div>
            </div>
          )}

          {/* Flyout popup panel - only shown in dropdown mode */}
          {isFlyoutOpen && communityNavStyle === 'dropdown' && (
            <div
              className={`feeds-flyout ${shouldCollapse ? 'feeds-flyout-collapsed' : 'feeds-flyout-expanded'}`}
            >
              <div className="feeds-flyout-header">
                My Feeds ({allCommunities.length})
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
                  <img src="https://images.unsplash.com/photo-1555993539-1732b0258235?w=60&h=60&fit=crop" alt="The Commons" className="community-avatar community-avatar-img" />
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
                      <span className="community-name">{displayName} Community</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Divider between Feeds and Discover */}
        <div className="nav-section-divider" />

        {/* Discover item */}
        <div
          className={`nav-item ${activeMenu === 'Discover' ? 'active' : ''}`}
          onClick={() => {
            setIsFlyoutOpen(false);
            showTooltipTemporarily(1);
            handleMenuClick('Discover');
          }}
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
              setIsFlyoutOpen(false);
              showTooltipTemporarily(index + primaryItems.length);
              handleMenuClick(item.label);
            }}
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
              setIsFlyoutOpen(false);
              showTooltipTemporarily(index + primaryItems.length + personalItems.length);
              handleMenuClick(item.label);
            }}
          >
            <div className="nav-icon">{item.icon}</div>
            <span className="nav-label">{item.displayLabel || item.label}</span>
            <span className={`nav-tooltip ${visibleTooltip === index + primaryItems.length + personalItems.length ? 'tooltip-visible' : ''}`}>
              {item.displayLabel || item.label}
            </span>
          </div>
        ))}

        {/* Divider line and My Feeds - hidden when slideout panel is selected */}
        {communityNavStyle !== 'slideout' && (
          <>
            <div className="nav-section-divider" />

            {/* Scrollable Communities Section - My Feeds at bottom of sidebar */}
            <div
              className="sidebar-communities-section"
            >
              <div className="communities-header">
                <span className="communities-title">My Feeds</span>
              </div>
              <div className="communities-list">
                {/* The Commons - always first */}
                <div
                  className="community-item"
                  onClick={() => { setIsFlyoutOpen(false); handleCommunitySelect(townHall); }}
                >
                  <img src="https://images.unsplash.com/photo-1555993539-1732b0258235?w=60&h=60&fit=crop" alt="The Commons" className="community-avatar community-avatar-img" />
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
                      onClick={() => { setIsFlyoutOpen(false); handleCommunitySelect(community); }}
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
                      <span className="community-name">{displayName} Community</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

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