import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaSearch } from 'react-icons/fa';
import './FeedsSlideoutPanel.css';

/**
 * FeedsSlideoutPanel Component
 *
 * A Substack-style slide-out panel that shows all user's communities.
 * Slides out from the sidebar when the Feeds button is clicked (in slideout mode).
 */
const FeedsSlideoutPanel = ({ currentUser, onSelectCommunity, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [sidebarRight, setSidebarRight] = useState(240); // Default to 240px
  const [sidebarLeft, setSidebarLeft] = useState(0); // For mask positioning
  const [searchQuery, setSearchQuery] = useState('');
  const panelRef = useRef(null);
  const searchInputRef = useRef(null);

  // Calculate sidebar position dynamically (accounts for app centering)
  useEffect(() => {
    const updateSidebarPosition = () => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        const rect = sidebar.getBoundingClientRect();
        setSidebarRight(rect.right);
        setSidebarLeft(rect.left);
      }
    };

    // Initial calculation
    updateSidebarPosition();

    // Recalculate on resize
    window.addEventListener('resize', updateSidebarPosition);
    return () => window.removeEventListener('resize', updateSidebarPosition);
  }, []);

  // Load communities from localStorage
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

    // Listen for updates
    const handleCommunitiesUpdate = () => loadCommunities();
    window.addEventListener('communitiesUpdated', handleCommunitiesUpdate);
    return () => window.removeEventListener('communitiesUpdated', handleCommunitiesUpdate);
  }, [currentUser?.id]);

  // Listen for toggle event from Sidebar
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(prev => !prev);
    };
    window.addEventListener('toggleSlideoutPanel', handleToggle);
    return () => window.removeEventListener('toggleSlideoutPanel', handleToggle);
  }, []);

  // Clear search when panel closes, focus search when panel opens
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    } else {
      // Focus search input when panel opens
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300); // Wait for animation
    }
  }, [isOpen]);

  // Notify Sidebar of panel state changes
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('slideoutPanelStateChange', {
      detail: { isOpen }
    }));
  }, [isOpen]);

  // Close panel on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Close panel when clicking outside of it
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      // Check if click is inside the panel
      if (panelRef.current && panelRef.current.contains(e.target)) {
        return; // Click was inside panel, do nothing
      }
      // Click was outside panel, close it
      setIsOpen(false);
    };

    // Use a small delay to prevent the opening click from immediately closing
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  // Handle community selection
  const handleCommunityClick = (community) => {
    if (onSelectCommunity) {
      onSelectCommunity(community);
    }
    setIsOpen(false);
  };

  // Handle close
  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  // Handle overlay click (close panel)
  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  // The Commons item
  const townHall = { id: 'town-hall', name: 'The Commons', type: 'hub' };

  // Color palette for community avatars
  const avatarColors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  ];

  const getAvatarColor = (index) => avatarColors[index % avatarColors.length];

  // Filter communities based on search query
  const filteredCommunities = communities.filter(community => {
    if (!searchQuery.trim()) return true;
    const displayName = community.name || community.id?.replace('creator-', '') || 'Community';
    return displayName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Check if The Commons matches the search
  const showCommons = !searchQuery.trim() ||
    'the commons'.includes(searchQuery.toLowerCase()) ||
    'commons'.includes(searchQuery.toLowerCase());

  return (
    <>
      {/* Mask to hide panel when sliding behind sidebar (covers left margin area) */}
      <div
        className="slideout-left-mask"
        style={{ width: `${sidebarLeft}px` }}
      />

      {/* Overlay to dim main content */}
      <div
        className={`slideout-overlay ${isOpen ? 'visible' : ''}`}
        onClick={handleOverlayClick}
        style={{ left: `${sidebarRight}px` }}
      />

      {/* Slide-out Panel */}
      <div
        ref={panelRef}
        className={`feeds-slideout-panel ${isOpen ? 'open' : ''}`}
        style={{ left: `${sidebarRight}px` }}
      >
        {/* Header */}
        <div className="slideout-panel-header">
          <h3>My Feeds</h3>
          <button className="slideout-close-btn" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        {/* Search Box */}
        <div className="slideout-search-container">
          <div className="slideout-search-box">
            <FaSearch className="slideout-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="slideout-search-input"
            />
            {searchQuery && (
              <button
                className="slideout-search-clear"
                onClick={() => setSearchQuery('')}
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Community List */}
        <div className="slideout-community-list">
          {/* Public Section - only show if matches search */}
          {showCommons && (
            <>
              <div className="slideout-section-header">Public</div>
              <div
                className="slideout-community-item"
                onClick={() => handleCommunityClick(townHall)}
              >
                <img
                  src="https://images.unsplash.com/photo-1555993539-1732b0258235?w=80&h=80&fit=crop"
                  alt="The Commons"
                  className="slideout-community-avatar-img"
                />
                <div className="slideout-community-info">
                  <div className="slideout-community-name">The Commons</div>
                  <div className="slideout-community-meta">Public community feed</div>
                </div>
              </div>
            </>
          )}

          {/* My Communities Section */}
          {filteredCommunities.length > 0 && (
            <>
              <div className="slideout-section-header">My Communities</div>
              {filteredCommunities.map((community, index) => {
                const displayName = community.name || community.id?.replace('creator-', '') || 'Community';
                const initial = displayName.charAt(0).toUpperCase();

                return (
                  <div
                    key={community.id}
                    className="slideout-community-item"
                    onClick={() => handleCommunityClick(community)}
                  >
                    {community.avatar ? (
                      <img
                        src={community.avatar}
                        alt={displayName}
                        className="slideout-community-avatar-img"
                      />
                    ) : (
                      <div
                        className="slideout-community-avatar"
                        style={{ background: getAvatarColor(index) }}
                      >
                        {initial}
                      </div>
                    )}
                    <div className="slideout-community-info">
                      <div className="slideout-community-name">{displayName} Community</div>
                      <div className="slideout-community-meta">
                        {community.memberCount || Math.floor(Math.random() * 300) + 50} members
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* No search results */}
          {searchQuery && !showCommons && filteredCommunities.length === 0 && (
            <div className="slideout-empty-state">
              <p>No communities found for "{searchQuery}"</p>
            </div>
          )}

          {/* Empty state if no communities at all (and no search active) */}
          {!searchQuery && communities.length === 0 && (
            <div className="slideout-empty-state">
              <p>You haven't joined any communities yet.</p>
              <p>Discover communities to join!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

FeedsSlideoutPanel.propTypes = {
  currentUser: PropTypes.object,
  onSelectCommunity: PropTypes.func,
  onClose: PropTypes.func
};

export default FeedsSlideoutPanel;
