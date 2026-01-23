import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import './Community.css';
import { FaUsers, FaStar, FaClock, FaPlay, FaBook, FaGraduationCap, FaHome, FaChevronLeft, FaChevronRight, FaHeart, FaComment, FaRetweet, FaBookmark, FaShare, FaChevronDown, FaInfoCircle, FaImage, FaLink, FaPaperclip, FaLandmark, FaSearch, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';
import { getAllCourses, getInstructorById, getCourseById, getAllInstructors } from '../data/database';
import { createPost, getPosts, likePost } from '../services/posts';
import { initGetStream } from '../services/getstream';
import { fakePosts } from '../data/communityPosts';
import { communityUsers } from '../data/users';

/**
 * MemberSearchView - Search for members (creators, student teachers, students)
 * Shows in The Commons when "Member Search" pill is selected
 * All members navigate to the same Profile page format
 */
const MemberSearchView = ({ isDarkMode, searchQuery, setSearchQuery, onViewMemberProfile }) => {
  // Get all members from communityUsers
  const allMembers = useMemo(() => {
    return Object.values(communityUsers).map(user => {
      // Determine member type from roles
      let type = 'student';
      let userType = 'student'; // For Profile component
      if (user.roles?.includes('creator')) {
        type = 'creator';
        userType = 'creator';
      } else if (user.roles?.includes('teacher') && user.roles?.includes('student')) {
        type = 'student_teacher';
        userType = 'student_teacher';
      }

      // Get specialty/expertise
      const specialty = user.expertise?.[0] || user.bio?.substring(0, 50) + '...' || 'PeerLoop Member';

      return {
        // Original user data for Profile component
        ...user,
        userType, // Add userType for Profile component
        // Display properties
        type,
        specialty,
        username: user.username?.replace('@', '') || user.id,
      };
    });
  }, []);

  // Filter members based on search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return allMembers;

    const query = searchQuery.toLowerCase();
    return allMembers.filter(member =>
      member.name.toLowerCase().includes(query) ||
      (member.specialty && member.specialty.toLowerCase().includes(query)) ||
      (member.expertise && member.expertise.some(e => e.toLowerCase().includes(query))) ||
      (member.bio && member.bio.toLowerCase().includes(query))
    );
  }, [allMembers, searchQuery]);

  // Handle viewing a member profile - ALL members go to the same Profile page
  const handleViewMember = (member) => {
    if (onViewMemberProfile) {
      // Pass the full user object to navigate to their profile
      onViewMemberProfile(member);
    }
  };

  // Get member type label and icon
  const getMemberTypeInfo = (type) => {
    switch (type) {
      case 'creator':
        return { label: 'Creator', icon: <FaChalkboardTeacher />, color: '#1d9bf0' };
      case 'student_teacher':
        return { label: 'Student Teacher', icon: <FaUserGraduate />, color: '#10b981' };
      case 'student':
        return { label: 'Student', icon: <FaUsers />, color: '#8b5cf6' };
      default:
        return { label: 'Member', icon: <FaUsers />, color: '#6b7280' };
    }
  };

  return (
    <div style={{ padding: '16px' }}>
      {/* Search Bar */}
      <div style={{
        position: 'relative',
        marginBottom: 20
      }}>
        <FaSearch style={{
          position: 'absolute',
          left: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          color: isDarkMode ? '#71767b' : '#536471',
          fontSize: 16
        }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search members, creators, student teachers..."
          style={{
            width: '100%',
            padding: '14px 14px 14px 44px',
            fontSize: 15,
            border: isDarkMode ? '1px solid #2f3336' : '1px solid #cfd9de',
            borderRadius: 9999,
            background: isDarkMode ? '#16181c' : '#f7f9f9',
            color: isDarkMode ? '#e7e9ea' : '#0f1419',
            outline: 'none',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#1d9bf0';
            e.target.style.boxShadow = '0 0 0 1px #1d9bf0';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = isDarkMode ? '#2f3336' : '#cfd9de';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Results Count */}
      <div style={{
        fontSize: 14,
        color: isDarkMode ? '#71767b' : '#536471',
        marginBottom: 16
      }}>
        {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''} found
        {searchQuery && <span> for "<strong style={{ color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>{searchQuery}</strong>"</span>}
      </div>

      {/* Results List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredMembers.map(member => {
          const typeInfo = getMemberTypeInfo(member.type);

          return (
            <div
              key={member.id}
              onClick={() => handleViewMember(member)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: 16,
                background: isDarkMode ? '#16181c' : '#fff',
                border: isDarkMode ? '1px solid #2f3336' : '1px solid #e1e8ed',
                borderRadius: 12,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDarkMode ? '#1d1f23' : '#f7f9f9';
                e.currentTarget.style.borderColor = '#1d9bf0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isDarkMode ? '#16181c' : '#fff';
                e.currentTarget.style.borderColor = isDarkMode ? '#2f3336' : '#e1e8ed';
              }}
            >
              {/* Avatar */}
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
              ) : (
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: typeInfo.color,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Member Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 4
                }}>
                  <span style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: isDarkMode ? '#e7e9ea' : '#0f1419'
                  }}>
                    {member.name}
                  </span>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '2px 8px',
                    borderRadius: 9999,
                    background: `${typeInfo.color}20`,
                    color: typeInfo.color,
                    fontSize: 12,
                    fontWeight: 600
                  }}>
                    {typeInfo.icon}
                    {typeInfo.label}
                  </span>
                </div>

                <div style={{
                  fontSize: 14,
                  color: isDarkMode ? '#71767b' : '#536471',
                  marginBottom: 6
                }}>
                  {member.specialty || (member.interests && member.interests.join(', ')) || 'PeerLoop Member'}
                </div>

                <div style={{
                  fontSize: 13,
                  color: isDarkMode ? '#71767b' : '#536471',
                  display: 'flex',
                  gap: 16
                }}>
                  {member.type === 'creator' && (
                    <>
                      <span>{member.stats.coursesCreated || 0} course{(member.stats.coursesCreated || 0) !== 1 ? 's' : ''} created</span>
                      <span>{(member.stats.studentsEnrolled || 0).toLocaleString()} students</span>
                    </>
                  )}
                  {member.type === 'student_teacher' && (
                    <>
                      <span>{member.stats.coursesTeaching || 0} course{(member.stats.coursesTeaching || 0) !== 1 ? 's' : ''} teaching</span>
                      <span>{(member.stats.studentsHelped || 0).toLocaleString()} students helped</span>
                    </>
                  )}
                  {member.type === 'student' && (
                    <span>Completed {member.stats.coursesCompleted || 0} course{(member.stats.coursesCompleted || 0) !== 1 ? 's' : ''}</span>
                  )}
                </div>
              </div>

              {/* View Profile Button */}
              <button
                style={{
                  padding: '8px 16px',
                  borderRadius: 9999,
                  border: isDarkMode ? '1px solid #536471' : '1px solid #cfd9de',
                  background: 'transparent',
                  color: isDarkMode ? '#e7e9ea' : '#0f1419',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDarkMode ? '#181818' : '#f7f9f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewMember(member);
                }}
              >
                View Profile
              </button>
            </div>
          );
        })}

        {/* No Results */}
        {filteredMembers.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: isDarkMode ? '#71767b' : '#536471'
          }}>
            <FaSearch style={{ fontSize: 32, marginBottom: 12, opacity: 0.5 }} />
            <p style={{ fontSize: 16, margin: 0 }}>
              No members found matching "{searchQuery}"
            </p>
            <p style={{ fontSize: 14, margin: '8px 0 0 0' }}>
              Try a different search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const Community = ({ followedCommunities = [], setFollowedCommunities = null, isDarkMode = false, currentUser = null, onMenuChange = null, onViewUserProfile = null, onViewMemberProfile = null, onViewCourse = null, onViewCreatorProfile = null, signupCompleted = false, setSignupCompleted = null, commonsActiveFeed = 'main', setCommonsActiveFeed = null }) => {
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [activeTab, setActiveTab] = useState('Home'); // 'Home' or community id
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const tabsContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [openCreatorDropdown, setOpenCreatorDropdown] = useState(null); // Track which creator dropdown is open
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, useRight: false }); // Track dropdown position
  const [selectedCourseFilters, setSelectedCourseFilters] = useState([]); // Filter to specific courses within creator (multi-select)
  const [newPostText, setNewPostText] = useState(''); // Text for new post
  const [isComposerFocused, setIsComposerFocused] = useState(false); // Track if composer is focused
  const [postAudience, setPostAudience] = useState('everyone'); // 'everyone' or creator id
  const [showAudienceDropdown, setShowAudienceDropdown] = useState(false); // Track audience dropdown visibility
  const [showPostingCourseDropdown, setShowPostingCourseDropdown] = useState(false); // Track course dropdown in posting section
  const [selectedPostingCourse, setSelectedPostingCourse] = useState(null); // Selected course to post to
  const [showInfoTooltip, setShowInfoTooltip] = useState(null); // Track which info tooltip is visible
  const [realPosts, setRealPosts] = useState([]); // Posts from Supabase
  const [isPosting, setIsPosting] = useState(false); // Loading state for posting
  const [postError, setPostError] = useState(null); // Error state for posting
  const [communityMode, setCommunityMode] = useState(() => {
    const saved = localStorage.getItem('activeCommunityMode');
    return saved || 'hub'; // 'hub' or 'creators'
  });
  const [selectedCreatorId, setSelectedCreatorId] = useState(() => {
    const saved = localStorage.getItem('activeCreatorId');
    return saved || null; // Selected creator in My Creators mode
  });
  const [pendingCreatorName, setPendingCreatorName] = useState(null); // Name of creator from Go to Community button (not yet followed)
  const [isDragging, setIsDragging] = useState(false); // Track if user is dragging the tabs
  const [dragStartX, setDragStartX] = useState(0); // Starting X position of drag
  const [dragScrollLeft, setDragScrollLeft] = useState(0); // Starting scroll position of drag

  // Commons feed selection - use props from MainContent for navigation persistence
  // commonsActiveFeed and setCommonsActiveFeed come from props

  // Member Search state
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  // Welcome video popup - opens when user clicks thumbnail
  const [showWelcomeVideo, setShowWelcomeVideo] = useState(false);

  const closeWelcomeVideo = () => {
    setShowWelcomeVideo(false);
  };

  // Interests modal for new user signup
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);

  const availableInterests = [
    'Culture', 'Technology', 'Health', 'Finance',
    'Education', 'Travel', 'Food', 'Fashion', 'Sports',
    'Art', 'Music', 'Environment', 'Politics', 'History',
    'Literature', 'Science', 'Philosophy', 'Community',
    'Networking', 'Sustainability', 'Wellness', 'Innovation',
    'Support', 'Growth', 'Inclusion',
    'Empowerment', 'Collaboration', 'Entrepreneurship',
    'Leadership', 'Advocacy', 'Creativity', 'Engagement',
    'Diversity', 'Service', 'Mentorship', 'Resilience'
  ];

  const toggleInterest = (interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const closeInterestsModal = () => {
    setShowInterestsModal(false);
  };

  // Communities you may like modal (step 2 of signup)
  const [showCommunitiesModal, setShowCommunitiesModal] = useState(false);
  const [selectedCommunities, setSelectedCommunities] = useState([]);

  // signupCompleted and setSignupCompleted are now passed as props from MainContent
  // This allows the state to be shared with DiscoverView

  // Top 3 communities with most courses from the database
  const suggestedCommunities = [
    {
      id: 8,
      name: 'Guy Rymberg',
      author: 'AI Prompting Specialist',
      description: 'Master AI prompting, Claude Code, n8n automation, and vibe coding',
      avatar: 'https://i.pravatar.cc/150?img=13',
      avatarColor: '#1d9bf0',
      courseCount: 5
    },
    {
      id: 2,
      name: 'Jane Doe',
      author: 'Leading AI Strategist',
      description: 'AI for Product Managers, Deep Learning, Computer Vision, and NLP',
      avatar: 'https://i.pravatar.cc/150?img=32',
      avatarColor: '#9333ea',
      courseCount: 4
    },
    {
      id: 4,
      name: 'James Wilson',
      author: 'Full-Stack & DevOps',
      description: 'Full-Stack Web Development, DevOps & CI/CD, Microservices Architecture',
      avatar: 'https://i.pravatar.cc/150?img=60',
      avatarColor: '#10b981',
      courseCount: 3
    }
  ];

  const toggleCommunity = (communityId) => {
    setSelectedCommunities(prev =>
      prev.includes(communityId)
        ? prev.filter(id => id !== communityId)
        : [...prev, communityId]
    );
  };

  const selectAllCommunities = () => {
    if (selectedCommunities.length === suggestedCommunities.length) {
      setSelectedCommunities([]);
    } else {
      setSelectedCommunities(suggestedCommunities.map(c => c.id));
    }
  };

  const closeCommunitiesModal = () => {
    setShowCommunitiesModal(false);
  };

  // Community navigation style preference from Profile settings
  const [communityNavStyle, setCommunityNavStyle] = useState(() => {
    const saved = localStorage.getItem('communityNavStyle');
    return saved || 'selector'; // Default to selector card interface
  });

  // Banner color from Profile settings
  const [userBannerColor, setUserBannerColor] = useState(() => {
    const saved = localStorage.getItem('profileBannerColor');
    return saved || 'blue';
  });

  // Available banner colors (matching Profile.js)
  const bannerColorOptions = {
    default: { start: '#e8f4f8', end: '#d0e8f0' },
    blue: { start: '#e8f4f8', end: '#d0e8f0' },
    cream: { start: '#faf5eb', end: '#f0e8d8' },
    green: { start: '#f0fdf4', end: '#dcfce7' },
    pink: { start: '#fef3f2', end: '#fecaca' },
    purple: { start: '#f5f3ff', end: '#e9d5ff' },
    teal: { start: '#f0fdfa', end: '#ccfbf1' },
    orange: { start: '#fff7ed', end: '#fed7aa' },
  };

  // Get the user's selected banner gradient
  const getUserBannerGradient = () => {
    const colors = bannerColorOptions[userBannerColor] || bannerColorOptions.default;
    return `linear-gradient(135deg, ${colors.start} 0%, ${colors.end} 100%)`;
  };

  // Pills scrolling state (course pills within a creator's community)
  const pillsContainerRef = useRef(null);
  const [showPillsLeftArrow, setShowPillsLeftArrow] = useState(false);
  const [showPillsRightArrow, setShowPillsRightArrow] = useState(false);
  const [isPillsDragging, setIsPillsDragging] = useState(false);
  const [pillsDragStartX, setPillsDragStartX] = useState(0);
  const [pillsDragScrollLeft, setPillsDragScrollLeft] = useState(0);

  // Community navigation pills scrolling state (top-level community selector)
  const communityPillsRef = useRef(null);
  const [showCommunityPillsLeftArrow, setShowCommunityPillsLeftArrow] = useState(false);
  const [showCommunityPillsRightArrow, setShowCommunityPillsRightArrow] = useState(false);
  const [isCommunityPillsDragging, setIsCommunityPillsDragging] = useState(false);
  const [communityPillsDragStartX, setCommunityPillsDragStartX] = useState(0);
  const [communityPillsDragScrollLeft, setCommunityPillsDragScrollLeft] = useState(0);

  // Collapsible profile card state
  const [isProfileCollapsed, setIsProfileCollapsed] = useState(false);
  const isProfileCollapsedRef = useRef(false); // Ref to track current collapsed state for scroll handler
  const lastScrollY = useRef(0);
  const feedContainerRef = useRef(null);
  // Selector bar dropdown state (for 'selector' nav style)
  const [showSelectorDropdown, setShowSelectorDropdown] = useState(false);
  // Slide-out panel state (for 'slideout' nav style)
  const [showSlideoutPanel, setShowSlideoutPanel] = useState(false);

  // Persist communityMode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('activeCommunityMode', communityMode);
  }, [communityMode]);

  // Persist selectedCreatorId to localStorage when it changes
  useEffect(() => {
    if (selectedCreatorId) {
      localStorage.setItem('activeCreatorId', selectedCreatorId);
    } else {
      localStorage.removeItem('activeCreatorId');
    }
  }, [selectedCreatorId]);

  // Clear selections when user changes (for demo purposes)
  useEffect(() => {
    setSelectedInterests([]);
    setSelectedCommunities([]);
  }, [currentUser?.id]);

  // Initialize GetStream and load posts on mount
  useEffect(() => {
    const init = async () => {
      // Initialize GetStream for current user
      if (currentUser?.id) {
        await initGetStream(currentUser.id);
      }
      // Load posts from Supabase
      const result = await getPosts();
      if (result.success) {
        setRealPosts(result.posts);
      }
    };
    init();
  }, [currentUser?.id]);

  // Initialize pills arrow visibility (course pills within creator)
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (pillsContainerRef.current) {
        const { scrollWidth, clientWidth } = pillsContainerRef.current;
        setShowPillsRightArrow(scrollWidth > clientWidth);
        setShowPillsLeftArrow(false);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedCreatorId, communityMode]);

  // Initialize community pills arrow visibility (top-level navigation)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (communityPillsRef.current) {
        const { scrollWidth, clientWidth } = communityPillsRef.current;
        setShowCommunityPillsRightArrow(scrollWidth > clientWidth);
        setShowCommunityPillsLeftArrow(false);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [communityNavStyle, followedCommunities]);

  // Listen for community nav style changes from Profile settings
  useEffect(() => {
    // Handle changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'communityNavStyle') {
        setCommunityNavStyle(e.newValue || 'selector');
      }
    };
    // Handle changes from same tab (custom event from Profile)
    const handleNavStyleChange = (e) => {
      setCommunityNavStyle(e.detail || 'selector');
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('communityNavStyleChanged', handleNavStyleChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('communityNavStyleChanged', handleNavStyleChange);
    };
  }, []);

  // Check for pending creator navigation from "Go to Community" button or sidebar selection
  useEffect(() => {
    const handleCommunitySelection = (creator) => {
      // Check if Town Hall was selected
      if (creator.type === 'hub' || creator.id === 'town-hall') {
        setCommunityMode('hub');
        setSelectedCreatorId(null);
        setPostAudience('everyone');
        setActiveTab('Home');
        setPendingCreatorName(null);
        setSelectedCourseFilters([]);
      }
      // Set to My Creators mode and select this creator
      else if (creator.id) {
        setCommunityMode('creators');
        setSelectedCreatorId(creator.id);
        setPostAudience(creator.id);
        setActiveTab(creator.id);
        // Store the name in case the creator isn't in groupedByCreator (not followed yet)
        setPendingCreatorName(creator.name);

        // If a specific course was passed, select it in the course filter
        if (creator.courseId && creator.courseTitle) {
          setSelectedCourseFilters([{ id: creator.courseId, name: creator.courseTitle }]);
        }
      }
      // Clear the pending creator
      localStorage.removeItem('pendingCommunityCreator');
    };

    // Check for pending creator on mount
    const pendingCreator = localStorage.getItem('pendingCommunityCreator');
    if (pendingCreator) {
      try {
        const creator = JSON.parse(pendingCreator);
        handleCommunitySelection(creator);
      } catch (e) {
        console.error('Error parsing pending creator:', e);
        localStorage.removeItem('pendingCommunityCreator');
      }
    }

    // Listen for sidebar community selection
    const handleCommunitySelected = (event) => {
      if (event.detail) {
        handleCommunitySelection(event.detail);
      }
    };

    window.addEventListener('communitySelected', handleCommunitySelected);
    return () => {
      window.removeEventListener('communitySelected', handleCommunitySelected);
    };
  }, []);

  // Scroll to selected creator in the horizontal tabs when selectedCreatorId changes
  useEffect(() => {
    if (communityMode === 'creators' && selectedCreatorId && tabsContainerRef.current) {
      // Small delay to ensure DOM is rendered
      setTimeout(() => {
        const container = tabsContainerRef.current;
        if (!container) return;
        
        // Find the div with data-creator-id matching the selected creator
        const creatorTab = container.querySelector(`[data-creator-id="${selectedCreatorId}"]`);
        
        if (creatorTab) {
          // Scroll the tab into view, centered
          const containerWidth = container.clientWidth;
          const tabLeft = creatorTab.offsetLeft;
          const tabWidth = creatorTab.offsetWidth;
          const scrollTo = tabLeft - (containerWidth / 2) + (tabWidth / 2);
          container.scrollTo({ left: Math.max(0, scrollTo), behavior: 'smooth' });
        }
      }, 150);
    }
  }, [communityMode, selectedCreatorId, pendingCreatorName]);

  // Handle scroll to collapse/expand profile card based on scroll direction
  const lastToggleTime = useRef(0);

  // Keep ref in sync with state
  useEffect(() => {
    isProfileCollapsedRef.current = isProfileCollapsed;
  }, [isProfileCollapsed]);

  useEffect(() => {
    const COLLAPSE_THRESHOLD = 1; // Collapse immediately when scrolling
    const EXPAND_THRESHOLD = 1; // Expand when back at top
    const TOGGLE_COOLDOWN = 200; // Reduced cooldown for more responsive expand

    const handleScroll = () => {
      const container = feedContainerRef.current;
      if (!container) return;

      const currentScrollY = container.scrollTop;
      const now = Date.now();

      // Always expand when at the very top (scrollTop <= 5), bypass cooldown
      if (isProfileCollapsedRef.current && currentScrollY <= 5) {
        setIsProfileCollapsed(false);
        isProfileCollapsedRef.current = false;
        lastToggleTime.current = now;
        lastScrollY.current = currentScrollY;
        return;
      }

      // Skip if we recently toggled (prevents jitter from layout shifts)
      if (now - lastToggleTime.current < TOGGLE_COOLDOWN) {
        return;
      }

      // Collapse: when scrolled down past threshold
      if (!isProfileCollapsedRef.current && currentScrollY > COLLAPSE_THRESHOLD) {
        setIsProfileCollapsed(true);
        isProfileCollapsedRef.current = true;
        lastToggleTime.current = now;
      }
      // Expand: when scrolled back near the top
      else if (isProfileCollapsedRef.current && currentScrollY < EXPAND_THRESHOLD) {
        setIsProfileCollapsed(false);
        isProfileCollapsedRef.current = false;
        lastToggleTime.current = now;
      }

      lastScrollY.current = currentScrollY;
    };

    const container = feedContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []); // Empty dependency - handler uses refs for current values

  // Reset collapsed state when changing creators
  useEffect(() => {
    setIsProfileCollapsed(false);
    isProfileCollapsedRef.current = false;
    lastScrollY.current = 0;
  }, [selectedCreatorId]);

  // Handle posting a new message
  const handleSubmitPost = async () => {
    if (!newPostText.trim() || isPosting) return;
    
    setIsPosting(true);
    setPostError(null);
    
    const result = await createPost(
      currentUser?.id || 'anonymous',
      currentUser?.name || 'Anonymous User',
      newPostText.trim(),
      postAudience
    );
    
    if (result.success) {
      // Add new post to the top of the list
      setRealPosts(prev => [result.post, ...prev]);
      setNewPostText('');
      setIsComposerFocused(false);
      console.log('✅ Post created successfully!');
    } else {
      setPostError(result.error || 'Failed to create post');
      console.error('❌ Post failed:', result.error);
    }
    
    setIsPosting(false);
  };
  
  // Get user initials from currentUser name
  const getUserInitials = () => {
    if (!currentUser?.name) return 'AS';
    return currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Format timestamp for display
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'just now';
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return new Date(timestamp).toLocaleDateString();
  };
  
  // Handle clicking on user avatar to go to profile
  const handleAvatarClick = () => {
    if (onMenuChange) {
      onMenuChange('Profile');
    }
  };
  
  // Use props directly - the parent (MainContent) manages the state and localStorage
  // This ensures consistency between Browse follows and Community display
  const actualFollowedCommunities = followedCommunities;
  const actualSetFollowedCommunities = setFollowedCommunities || (() => {});

  // Group followed communities by creator - always show creator tabs, not individual courses
  const groupedByCreator = React.useMemo(() => {
    const creatorMap = new Map();

    // Process all followed communities
    actualFollowedCommunities.forEach(community => {
      let creatorId, creatorName, followedCourseIds;

      if (community.type === 'creator') {
        // Creator follow - show creator even if no courses purchased yet (Town Hall access)
        creatorId = community.id;
        creatorName = community.name;
        followedCourseIds = community.followedCourseIds || []; // Use actual followed courses (purchased)
      } else if (community.type === 'course' || typeof community.id === 'number' || community.id?.startsWith?.('course-')) {
        // Individual course follow - get the creator
        const courseId = community.courseId || (typeof community.id === 'number' ? community.id : parseInt(community.id.replace('course-', '')));
        const course = getCourseById(courseId);
        if (!course) return;

        const instructor = getInstructorById(course.instructorId);
        if (!instructor) return;

        creatorId = `creator-${course.instructorId}`;
        creatorName = instructor.name;
        followedCourseIds = [courseId];
      } else {
        // Unknown type, skip
        return;
      }

      // Merge into existing creator entry or create new one
      if (creatorMap.has(creatorId)) {
        const existing = creatorMap.get(creatorId);
        // Merge followed course IDs, avoiding duplicates
        const mergedCourseIds = [...new Set([...existing.followedCourseIds, ...followedCourseIds])];
        existing.followedCourseIds = mergedCourseIds;
      } else {
        // Get all courses for this creator
        const instructorId = parseInt(creatorId.replace('creator-', ''));
        const instructor = getInstructorById(instructorId);
        const allCreatorCourses = getAllCourses().filter(c => c.instructorId === instructorId);

        creatorMap.set(creatorId, {
          id: creatorId,
          name: creatorName,
          instructorId: instructorId,
          allCourses: allCreatorCourses,
          followedCourseIds: followedCourseIds, // Only purchased courses
          isFullCreatorFollow: community.type === 'creator'
        });
      }
    });

    // Return all followed creators (even those with no purchased courses - they have Town Hall access)
    return Array.from(creatorMap.values());
  }, [actualFollowedCommunities]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openCreatorDropdown && 
          !event.target.closest('.community-tab-wrapper') && 
          !event.target.closest('.community-tab-dropdown')) {
        setOpenCreatorDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openCreatorDropdown]);

  // Close posting course dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPostingCourseDropdown && 
          !event.target.closest('.posting-course-dropdown') &&
          !event.target.closest('.filter-courses-dropdown-wrapper')) {
        setShowPostingCourseDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showPostingCourseDropdown]);

  // Close selector dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSelectorDropdown &&
          !event.target.closest('.community-selector-bar') &&
          !event.target.closest('.community-selector-dropdown')) {
        setShowSelectorDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showSelectorDropdown]);

  // Close slideout panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSlideoutPanel &&
          !event.target.closest('.community-slideout-panel') &&
          !event.target.closest('.sidebar-my-feeds-trigger')) {
        setShowSlideoutPanel(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showSlideoutPanel]);

  // Note: Slideout panel toggle is now handled by FeedsSlideoutPanel component in App.js
  // The old slideout panel in Community.js is deprecated

  // Dynamically generate availableCommunities from all courses
  const allCourses = getAllCourses();
  const availableCommunities = allCourses.map(course => {
    const instructor = getInstructorById(course.instructorId);
    if (!instructor) return null;
    
    // Generate community data dynamically based on course and instructor
    const communityColors = [
      '#4ECDC4', '#00D2FF', '#FF9900', '#FF6B6B', '#9B59B6', 
      '#FFD93D', '#00B894', '#6C5CE7', '#FF7675', '#74B9FF',
      '#636e72', '#0984e3', '#e17055', '#fdcb6e'
    ];
    
    const colorIndex = (course.id - 1) % communityColors.length;
    const color = communityColors[colorIndex];
    
    // Generate topic image based on course category
    const topicImage = `https://via.placeholder.com/400x200${color.replace('#', '')}/ffffff?text=${course.category.replace(/\s+/g, '')}`;
    
    // Generate instructor avatar
    const instructorAvatar = `https://via.placeholder.com/48x48${color.replace('#', '')}/ffffff?text=${instructor.name.split(' ').map(n => n[0]).join('')}`;
    
    // Calculate community stats based on course data
    const members = Math.floor(course.students * 0.8); // 80% of students are community members
    const posts = Math.floor(members * 0.3); // 30% of members have posted
    const lastActivity = '2 hours ago'; // Default activity time
    
    return {
      id: course.id, // Use course ID as community ID
      name: `${course.title} Community`,
      topic: course.category,
      members: members,
      posts: posts,
      lastActivity: lastActivity,
      instructor: instructor.name,
      instructorAvatar: instructorAvatar,
      topicImage: topicImage,
      description: course.description,
      courseId: course.id,
      isCourseSpecific: true
    };
  }).filter(Boolean); // Remove any null entries

  // Mock data for fake posts from each community
  // Course IDs: 1=AI for PM, 2=Node.js, 3=AWS, 4=Deep Learning, 5=Computer Vision, 
  // 6=NLP, 7=Data Science, 8=BI Analytics, 9=Full-Stack, 10=DevOps, 
  // 11=Microservices, 12=Robotics, 13=Medical AI, 14=Python Bootcamp

  // Note: followedCommunities save is handled in MainContent.js with user-specific localStorage keys

  // Check scroll arrows visibility
  const checkScrollArrows = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollArrows();
    window.addEventListener('resize', checkScrollArrows);
    return () => window.removeEventListener('resize', checkScrollArrows);
  }, [actualFollowedCommunities]);

  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = 200;
      tabsContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollArrows, 300);
    }
  };

  // Pills scroll functions
  const updatePillsArrows = () => {
    if (pillsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = pillsContainerRef.current;
      setShowPillsLeftArrow(scrollLeft > 0);
      setShowPillsRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollPills = (direction) => {
    if (pillsContainerRef.current) {
      const scrollAmount = 150;
      pillsContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(updatePillsArrows, 300);
    }
  };

  const handlePillsMouseDown = (e) => {
    if (!pillsContainerRef.current) return;
    setIsPillsDragging(true);
    setPillsDragStartX(e.pageX - pillsContainerRef.current.offsetLeft);
    setPillsDragScrollLeft(pillsContainerRef.current.scrollLeft);
    pillsContainerRef.current.style.cursor = 'grabbing';
  };

  const handlePillsMouseMove = (e) => {
    if (!isPillsDragging || !pillsContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - pillsContainerRef.current.offsetLeft;
    const walk = (x - pillsDragStartX) * 1.5;
    pillsContainerRef.current.scrollLeft = pillsDragScrollLeft - walk;
    updatePillsArrows();
  };

  const handlePillsMouseUp = () => {
    setIsPillsDragging(false);
    if (pillsContainerRef.current) {
      pillsContainerRef.current.style.cursor = 'grab';
    }
  };

  const handlePillsMouseLeave = () => {
    if (isPillsDragging) {
      setIsPillsDragging(false);
      if (pillsContainerRef.current) {
        pillsContainerRef.current.style.cursor = 'grab';
      }
    }
  };

  // Community navigation pills scroll functions
  const updateCommunityPillsArrows = () => {
    if (communityPillsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = communityPillsRef.current;
      setShowCommunityPillsLeftArrow(scrollLeft > 0);
      setShowCommunityPillsRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollCommunityPills = (direction) => {
    if (communityPillsRef.current) {
      const scrollAmount = 150;
      communityPillsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(updateCommunityPillsArrows, 300);
    }
  };

  const handleCommunityPillsMouseDown = (e) => {
    if (!communityPillsRef.current) return;
    setIsCommunityPillsDragging(true);
    setCommunityPillsDragStartX(e.pageX - communityPillsRef.current.offsetLeft);
    setCommunityPillsDragScrollLeft(communityPillsRef.current.scrollLeft);
    communityPillsRef.current.style.cursor = 'grabbing';
  };

  const handleCommunityPillsMouseMove = (e) => {
    if (!isCommunityPillsDragging || !communityPillsRef.current) return;
    e.preventDefault();
    const x = e.pageX - communityPillsRef.current.offsetLeft;
    const walk = (x - communityPillsDragStartX) * 1.5;
    communityPillsRef.current.scrollLeft = communityPillsDragScrollLeft - walk;
    updateCommunityPillsArrows();
  };

  const handleCommunityPillsMouseUp = () => {
    setIsCommunityPillsDragging(false);
    if (communityPillsRef.current) {
      communityPillsRef.current.style.cursor = 'grab';
    }
  };

  const handleCommunityPillsMouseLeave = () => {
    if (isCommunityPillsDragging) {
      setIsCommunityPillsDragging(false);
      if (communityPillsRef.current) {
        communityPillsRef.current.style.cursor = 'grab';
      }
    }
  };

  const handleCommunityClick = (community) => {
    setSelectedCommunity(community);
  };

  const handleBackToCommunities = () => {
    setSelectedCommunity(null);
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    // Reset course filters when switching tabs
    if (tabId !== activeTab) {
      setSelectedCourseFilters([]);
      setOpenCreatorDropdown(null);
    }
    // Auto-set post audience and switch community mode
    if (tabId === 'Home') {
      setCommunityMode('hub');
      setSelectedCreatorId(null);
      setPostAudience('everyone');
    } else {
      // tabId is the creator id when clicking a creator tab
      setCommunityMode('creators');
      setSelectedCreatorId(tabId);
      setPostAudience(tabId);
    }
  };

  const handleFollowCommunity = (communityId) => {
    if (isFollowingLoading) return; // Prevent rapid clicking
    
    try {
      setIsFollowingLoading(true);
      
      // Validate communityId
      if (!communityId || typeof communityId !== 'number') {
        console.error('Invalid communityId:', communityId);
        return;
      }

      const community = availableCommunities.find(c => c.id === communityId);
      if (!community) {
        console.error('Community not found:', communityId);
        return;
      }

      const isAlreadyFollowed = actualFollowedCommunities.some(c => c.id === communityId);
      
      if (isAlreadyFollowed) {
        // Unfollow
        actualSetFollowedCommunities(prev => prev.filter(c => c.id !== communityId));
      } else {
        // Follow
        actualSetFollowedCommunities(prev => [...prev, community]);
      }
    } catch (error) {
      console.error('Error in handleFollowCommunity:', error);
    } finally {
      setIsFollowingLoading(false);
    }
  };

  const isCommunityFollowed = (communityId) => {
    return actualFollowedCommunities.some(c => c.id === communityId);
  };

  // Filter posts based on active tab - memoized for performance
  const displayedPosts = React.useMemo(() => {
    // If in Commons hub mode and one of the placeholder feeds (1, 2, 3) is selected, show blank
    if (communityMode === 'hub' && commonsActiveFeed !== 'main') {
      return [];
    }

    // Convert real posts from Supabase to display format FIRST
    const formattedRealPosts = realPosts.map(post => ({
      id: `real-${post.id}`,
      courseId: null,
      author: post.user_name,
      authorHandle: `@${post.user_name.toLowerCase().replace(/\s/g, '')}`,
      content: post.content,
      timestamp: formatTimeAgo(post.created_at),
      likes: post.likes || 0,
      replies: post.comments || 0,
      retweets: post.shares || 0,
      community: post.audience === 'everyone' ? 'Everyone' : post.audience,
      isRealPost: true,
      supabaseId: post.id
    }));

    let filteredFakePosts;
    
    // Get all followed course IDs from grouped creators
    const allFollowedCourseIds = groupedByCreator.flatMap(c => c.followedCourseIds);
    
    if (communityMode === 'hub') {
      // Community Hub: Show Town Hall exclusive posts + posts from followed courses
      // For new users with no follows, also show all creator Town Hall posts to help them discover
      const hasNoFollows = groupedByCreator.length === 0;
      filteredFakePosts = fakePosts.filter(post =>
        post.isTownHallExclusive ||
        (hasNoFollows && post.isCreatorTownHall) ||
        allFollowedCourseIds.includes(post.courseId)
      );
    } else {
      // My Creators mode: Filter based on selected creator's followed courses
      const activeCreator = groupedByCreator.find(c => c.id === selectedCreatorId);
      if (activeCreator) {
        // Get the instructor ID from the creator entry (format: "creator-{id}")
        const creatorInstructorId = activeCreator.instructorId || (typeof selectedCreatorId === 'string' ? parseInt(selectedCreatorId.replace('creator-', '')) : selectedCreatorId);

        // If specific courses are selected in filter, only show posts from those courses
        if (selectedCourseFilters.length > 0) {
          const selectedCourseIds = selectedCourseFilters.map(c => c.id);
          filteredFakePosts = fakePosts.filter(post =>
            selectedCourseIds.includes(post.courseId)
          );
        } else {
          // Show creator's Town Hall posts + posts from this creator's followed courses
          filteredFakePosts = fakePosts.filter(post =>
            // Creator-specific Town Hall posts
            (post.isCreatorTownHall && post.instructorId === creatorInstructorId) ||
            // Course-specific posts from followed courses
            activeCreator.followedCourseIds.includes(post.courseId)
          );
        }
      } else {
        filteredFakePosts = [];
      }
    }
    
    // ALWAYS show real posts first, then filtered fake posts
    // Real posts appear regardless of followed communities
    const combinedPosts = [...formattedRealPosts, ...filteredFakePosts];
    
    // If in Hub mode and no communities followed, still show real posts
    if (communityMode === 'hub' && combinedPosts.length === 0) {
      return formattedRealPosts;
    }
    
    // Sort: Pinned first, then real posts (by time), then fake posts by engagement
    return combinedPosts.sort((a, b) => {
      // Pinned posts always come first (in both hub and creator mode)
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // Real posts come next
      if (a.isRealPost && !b.isRealPost) return -1;
      if (!a.isRealPost && b.isRealPost) return 1;

      // Among real posts, sort by most recent
      if (a.isRealPost && b.isRealPost) {
        return 0; // Keep original order (already sorted by created_at desc from Supabase)
      }

      // Town Hall posts (both global and creator-specific) come before course-specific posts
      const aIsTownHall = a.isTownHallExclusive || a.isCreatorTownHall;
      const bIsTownHall = b.isTownHallExclusive || b.isCreatorTownHall;
      if (aIsTownHall && !bIsTownHall) return -1;
      if (!aIsTownHall && bIsTownHall) return 1;

      // Among fake posts, sort by engagement
      const engagementA = a.likes + (a.replies * 10);
      const engagementB = b.likes + (b.replies * 10);
      const timeA = a.timestamp.includes('hour') ? parseInt(a.timestamp) :
                    a.timestamp.includes('minute') ? 0.1 :
                    a.timestamp.includes('day') ? parseInt(a.timestamp) * 24 : 100;
      const timeB = b.timestamp.includes('hour') ? parseInt(b.timestamp) :
                    b.timestamp.includes('minute') ? 0.1 :
                    b.timestamp.includes('day') ? parseInt(b.timestamp) * 24 : 100;
      // Combine engagement and recency (recent + high engagement first)
      return (engagementB / (timeB + 1)) - (engagementA / (timeA + 1));
    });
  }, [communityMode, selectedCreatorId, groupedByCreator, realPosts, selectedCourseFilters, commonsActiveFeed]);

  if (selectedCommunity) {
    // Get posts for this community
    const communityPosts = fakePosts.filter(post => 
      post.courseId === selectedCommunity.courseId || post.communityId === selectedCommunity.id
    );

    return (
      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: 0 }}>
        {/* Back Button */}
        <button 
          onClick={handleBackToCommunities}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '10px 16px',
            margin: '16px',
            cursor: 'pointer',
            fontWeight: 600,
            color: '#64748b'
          }}
        >
          ← Back to Communities
        </button>

        {/* Community Header Card */}
        <div style={{ background: '#fff', borderRadius: 16, margin: '0 16px 24px 16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          {/* Banner */}
          <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', height: 120 }} />
          
          {/* Content */}
          <div style={{ padding: '0 24px 24px 24px', marginTop: -40 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 16 }}>
              <div style={{ 
                width: 80, 
                height: 80, 
                borderRadius: 12, 
                background: '#fff',
                border: '4px solid #fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32
              }}>
                📚
              </div>
              <div style={{ flex: 1, paddingBottom: 8 }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{selectedCommunity.name}</h1>
                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: 14 }}>{selectedCommunity.topic}</p>
              </div>
              <button
                onClick={() => handleFollowCommunity(selectedCommunity.id)}
                style={{
                  background: '#1d9bf0',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer'
                }}
              >
                {isCommunityFollowed(selectedCommunity.id) ? 'Joined Community' : 'Join Community'}
              </button>
            </div>

            {/* Description */}
            <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.6, margin: '0 0 16px 0' }}>
              {selectedCommunity.description}
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 24, fontSize: 14, color: '#64748b' }}>
              <span><strong style={{ color: '#1e293b' }}>{selectedCommunity.members?.toLocaleString()}</strong> members</span>
              <span><strong style={{ color: '#1e293b' }}>{selectedCommunity.posts}</strong> posts</span>
              <span>Created by <strong style={{ color: '#1e293b' }}>{selectedCommunity.instructor}</strong></span>
            </div>
          </div>
        </div>

        {/* Community Feed */}
        <div style={{ margin: '0 16px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: '0 0 16px 0' }}>Community Posts</h2>
          
          {communityPosts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {communityPosts.map(post => (
                <div key={post.id} style={{ 
                  background: '#fff', 
                  borderRadius: 12, 
                  padding: 20, 
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <img 
                      src={post.authorAvatar} 
                      alt={post.author}
                      style={{ width: 40, height: 40, borderRadius: '50%' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>{post.author}</div>
                      <div style={{ color: '#64748b', fontSize: 12 }}>{post.authorHandle} • {post.timestamp}</div>
                    </div>
                  </div>
                  <p style={{ margin: '0 0 12px 0', color: '#334155', fontSize: 15, lineHeight: 1.5 }}>{post.content}</p>
                  <div style={{ display: 'flex', gap: 20, fontSize: 14, color: '#64748b' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FaComment /> {post.replies}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FaHeart /> {post.likes}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              background: '#fff', 
              borderRadius: 12, 
              padding: 40, 
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
              <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>No posts yet</h3>
              <p style={{ margin: 0, color: '#64748b' }}>Be the first to start a discussion in this community!</p>
            </div>
          )}
        </div>

        {/* Community Info */}
        <div style={{ margin: '24px 16px' }}>
          <div style={{ 
            background: '#fff', 
            borderRadius: 12, 
            padding: 20, 
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 600, color: '#1e293b' }}>Community Guidelines</h3>
            <ul style={{ margin: 0, paddingLeft: 20, color: '#475569', fontSize: 14, lineHeight: 1.8 }}>
              <li>Be respectful and inclusive in all discussions</li>
              <li>Share knowledge and help others learn</li>
              <li>Keep discussions relevant to the course topic</li>
              <li>No spam or self-promotion without value</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Get short name for community tabs
  const getShortName = (community) => {
    // Use the community name directly (already set correctly based on type)
    const name = community.name || '';
    // Truncate if needed
    return name.length > 20 ? name.substring(0, 18) + '...' : name;
  };

  return (
    <div className="community-content-outer" style={{ background: isDarkMode ? '#000' : '#fff' }}>
      {/* Welcome Video Popup Modal */}
      {showWelcomeVideo && (
        <div
          onClick={closeWelcomeVideo}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 800,
              background: isDarkMode ? '#1a1a1a' : '#fff',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Close button */}
            <button
              onClick={closeWelcomeVideo}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(0, 0, 0, 0.6)',
                color: '#fff',
                fontSize: 20,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)'}
            >
              ✕
            </button>
            {/* Video */}
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src="https://player.vimeo.com/video/1155787226?autoplay=1"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Welcome to PeerLoop"
              />
            </div>
          </div>
        </div>
      )}

      {/* Interests Selection Modal */}
      {showInterestsModal && (
        <div
          onClick={closeInterestsModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 540,
              maxHeight: '90vh',
              background: isDarkMode ? '#16181c' : '#fff',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Close button */}
            <button
              onClick={closeInterestsModal}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: 'none',
                background: isDarkMode ? '#2f3336' : '#eff3f4',
                color: isDarkMode ? '#e7e9ea' : '#0f1419',
                fontSize: 18,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              ✕
            </button>

            {/* Content */}
            <div style={{ padding: '40px 32px 32px', overflowY: 'auto', maxHeight: '90vh' }}>
              <h2 style={{
                fontSize: 24,
                fontWeight: 700,
                color: isDarkMode ? '#e7e9ea' : '#0f1419',
                margin: '0 0 8px 0',
                textAlign: 'center'
              }}>
                Dive into your interests
              </h2>
              <p style={{
                fontSize: 15,
                color: isDarkMode ? '#71767b' : '#536471',
                margin: '0 0 24px 0',
                textAlign: 'center'
              }}>
                We'll recommend top communities based on the topics you select.
              </p>

              {/* Interest Pills */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
                marginBottom: 24,
                justifyContent: 'center'
              }}>
                {availableInterests.map(interest => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: 9999,
                        border: `1px solid ${isSelected ? '#1d9bf0' : (isDarkMode ? '#2f3336' : '#cfd9de')}`,
                        background: isSelected ? '#1d9bf0' : 'transparent',
                        color: isSelected ? '#fff' : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>

              {/* Continue Button */}
              <button
                onClick={() => {
                  if (selectedInterests.length >= 3) {
                    closeInterestsModal();
                    setShowCommunitiesModal(true);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: 9999,
                  border: 'none',
                  background: selectedInterests.length >= 3 ? '#1d9bf0' : (isDarkMode ? '#2f3336' : '#cfd9de'),
                  color: selectedInterests.length >= 3 ? '#fff' : (isDarkMode ? '#71767b' : '#536471'),
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: selectedInterests.length >= 3 ? 'pointer' : 'default',
                  transition: 'all 0.2s ease'
                }}
              >
                {selectedInterests.length >= 3
                  ? 'Continue'
                  : `Select ${3 - selectedInterests.length} more to continue`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Communities You May Like Modal */}
      {showCommunitiesModal && (
        <div
          onClick={closeCommunitiesModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 480,
              maxHeight: '90vh',
              background: isDarkMode ? '#16181c' : '#fff',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Content */}
            <div style={{ padding: '32px 24px', overflowY: 'auto', maxHeight: '90vh' }}>
              <h2 style={{
                fontSize: 22,
                fontWeight: 700,
                color: isDarkMode ? '#e7e9ea' : '#0f1419',
                margin: '0 0 8px 0',
                textAlign: 'center'
              }}>
                Communities you may like
              </h2>
              <p style={{
                fontSize: 14,
                color: isDarkMode ? '#71767b' : '#536471',
                margin: '0 0 20px 0',
                textAlign: 'center'
              }}>
                We found some communities based on your interests.
              </p>

              {/* Select All */}
              <div
                onClick={selectAllCommunities}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: 16,
                  cursor: 'pointer'
                }}
              >
                <span style={{
                  fontSize: 14,
                  color: '#1d9bf0',
                  fontWeight: 500
                }}>
                  {selectedCommunities.length === suggestedCommunities.length ? 'Deselect all' : 'Select all'}
                </span>
              </div>

              {/* Community List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {suggestedCommunities.map(community => {
                  const isSelected = selectedCommunities.includes(community.id);
                  return (
                    <div
                      key={community.id}
                      onClick={() => toggleCommunity(community.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                        padding: '12px 16px',
                        borderRadius: 12,
                        border: `1px solid ${isDarkMode ? '#2f3336' : '#eff3f4'}`,
                        cursor: 'pointer',
                        background: isDarkMode ? '#16181c' : '#fff',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {/* Avatar */}
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 8,
                        background: community.avatar ? `url(${community.avatar}) center/cover` : community.avatarColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 18,
                        flexShrink: 0
                      }}>
                        {!community.avatar && community.name.charAt(0)}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: isDarkMode ? '#e7e9ea' : '#0f1419'
                        }}>
                          {community.name}
                        </div>
                        <div style={{
                          fontSize: 13,
                          color: isDarkMode ? '#71767b' : '#536471',
                          marginBottom: 4
                        }}>
                          by {community.author}
                        </div>
                        <div style={{
                          fontSize: 13,
                          color: isDarkMode ? '#71767b' : '#536471',
                          lineHeight: 1.4
                        }}>
                          {community.description}
                        </div>
                      </div>

                      {/* Checkbox */}
                      <div style={{
                        width: 22,
                        height: 22,
                        borderRadius: 4,
                        border: `2px solid ${isSelected ? '#1d9bf0' : (isDarkMode ? '#536471' : '#cfd9de')}`,
                        background: isSelected ? '#1d9bf0' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2
                      }}>
                        {isSelected && (
                          <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>✓</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Continue Button */}
              <button
                onClick={() => {
                  // Join selected instructor communities directly
                  if (selectedCommunities.length > 0 && setFollowedCommunities) {
                    const newCommunities = selectedCommunities.map(instructorId => {
                      const instructor = getInstructorById(instructorId);
                      return {
                        id: `creator-${instructorId}`,
                        name: instructor?.name || 'Community',
                        type: 'creator',
                        followedCourseIds: []
                      };
                    });
                    setFollowedCommunities(prev => {
                      const existingIds = new Set(prev.map(c => c.id));
                      const uniqueNew = newCommunities.filter(c => !existingIds.has(c.id));
                      return [...prev, ...uniqueNew];
                    });
                  }
                  closeCommunitiesModal();
                  // Mark signup as complete so welcome screen doesn't show again
                  setSignupCompleted(true);
                  // Set to The Commons view
                  setCommunityMode('hub');
                  // Navigate to My Community menu
                  onMenuChange && onMenuChange('My Community');
                }}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: 9999,
                  border: 'none',
                  background: '#1d9bf0',
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {selectedCommunities.length > 0 ? 'Continue' : 'Continue without subscribing'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="community-three-column" style={{ background: isDarkMode ? '#000' : '#fff' }}>
        <div ref={feedContainerRef} className="community-center-column" style={{ background: isDarkMode ? '#000' : '#fff' }}>

          {/* Horizontal tabs for switching between communities - AT THE VERY TOP */}
          {communityNavStyle === 'pills' && (
          <div className="community-tabs-section" style={{
            padding: '12px 16px',
            borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
            background: isDarkMode ? '#000' : '#fff',
            position: 'sticky',
            top: 0,
            zIndex: 20
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              {/* Left Arrow */}
              {showCommunityPillsLeftArrow && (
                <button
                  onClick={() => scrollCommunityPills('left')}
                  style={{
                    background: isDarkMode ? '#2f3336' : '#f7f9f9',
                    border: isDarkMode ? '1px solid #536471' : '1px solid #cfd9de',
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    color: isDarkMode ? '#e7e9ea' : '#0f1419',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <FaChevronLeft size={12} />
                </button>
              )}
              {/* Scrollable Community Pills Container */}
              <div
                ref={communityPillsRef}
                onScroll={updateCommunityPillsArrows}
                onMouseDown={handleCommunityPillsMouseDown}
                onMouseMove={handleCommunityPillsMouseMove}
                onMouseUp={handleCommunityPillsMouseUp}
                onMouseLeave={handleCommunityPillsMouseLeave}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch',
                  cursor: 'grab',
                  flex: 1,
                  userSelect: 'none'
                }}
              >
                {/* The Commons Pill */}
                <button
                  onClick={() => handleTabClick('Home')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 16px',
                    borderRadius: 20,
                    border: communityMode === 'hub'
                      ? '2px solid #1d9bf0'
                      : (isDarkMode ? '2px solid #536471' : '2px solid #cfd9de'),
                    background: communityMode === 'hub'
                      ? (isDarkMode ? 'rgba(29, 155, 240, 0.15)' : 'rgba(29, 155, 240, 0.1)')
                      : (isDarkMode ? '#2f3336' : '#f7f9f9'),
                    color: communityMode === 'hub'
                      ? '#1d9bf0'
                      : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <img src="https://images.unsplash.com/photo-1555993539-1732b0258235?w=40&h=40&fit=crop" alt="The Commons" style={{ width: 18, height: 18, borderRadius: 4, objectFit: 'cover' }} />
                  <span>The Commons</span>
                </button>

                {/* Creator Pills */}
                {groupedByCreator.map(creator => {
                  const isSelected = communityMode === 'creators' && selectedCreatorId === creator.id;
                  return (
                    <button
                      key={creator.id}
                      onClick={() => handleTabClick(creator.id)}
                      title={`${creator.name} Community - ${creator.followedCourseIds.length} course(s) joined`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '8px 16px',
                        borderRadius: 20,
                        border: isSelected
                          ? '2px solid #1d9bf0'
                          : (isDarkMode ? '2px solid #536471' : '2px solid #cfd9de'),
                        background: isSelected
                          ? (isDarkMode ? 'rgba(29, 155, 240, 0.15)' : 'rgba(29, 155, 240, 0.1)')
                          : (isDarkMode ? '#2f3336' : '#f7f9f9'),
                        color: isSelected
                          ? '#1d9bf0'
                          : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>{creator.name}</span>
                    </button>
                  );
                })}
              </div>
              {/* Right Arrow */}
              {showCommunityPillsRightArrow && (
                <button
                  onClick={() => scrollCommunityPills('right')}
                  style={{
                    background: isDarkMode ? '#2f3336' : '#f7f9f9',
                    border: isDarkMode ? '1px solid #536471' : '1px solid #cfd9de',
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    color: isDarkMode ? '#e7e9ea' : '#0f1419',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <FaChevronRight size={12} />
                </button>
              )}
            </div>
          </div>
          )}

          {/* Selector Bar - Option B Style (shows when communityNavStyle === 'selector') */}
          {communityNavStyle === 'selector' && (() => {
            return (
            <div style={{
              background: isDarkMode ? '#1f2937' : '#f9fafb',
              borderRadius: 16,
              margin: '8px 16px 0 16px',
              position: 'sticky',
              top: 0,
              zIndex: 10,
              border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
              boxShadow: isDarkMode ? '0 4px 25px 10px rgba(80, 80, 80, 0.8)' : '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <div style={{ padding: '12px 16px 12px 16px', position: 'relative', zIndex: 20 }}>
              {/* Selector Bar - Reddit-style pill */}
              <div
                className="community-selector-bar"
                onClick={() => setShowSelectorDropdown(!showSelectorDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  background: isDarkMode ? '#16181c' : '#ffffff',
                  border: `2px solid ${showSelectorDropdown ? '#1d9bf0' : (isDarkMode ? '#4a5158' : '#b0b8c1')}`,
                  borderRadius: 24,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative',
                  boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={e => {
                  if (!showSelectorDropdown) {
                    e.currentTarget.style.borderColor = '#1d9bf0';
                    e.currentTarget.style.background = isDarkMode ? '#1a2634' : '#e8f4fd';
                  }
                }}
                onMouseLeave={e => {
                  if (!showSelectorDropdown) {
                    e.currentTarget.style.borderColor = isDarkMode ? '#4a5158' : '#b0b8c1';
                    e.currentTarget.style.background = isDarkMode ? '#16181c' : '#ffffff';
                  }
                }}
              >
                {/* Search Icon */}
                <FaSearch size={14} style={{ color: isDarkMode ? '#71767b' : '#536471', flexShrink: 0 }} />

                {/* Avatar */}
                {communityMode === 'hub' ? (
                  <img src="https://images.unsplash.com/photo-1555993539-1732b0258235?w=80&h=80&fit=crop" alt="The Commons" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                ) : (() => {
                  const selectedCreator = groupedByCreator.find(c => c.id === selectedCreatorId);
                  const instructor = selectedCreator ? getInstructorById(selectedCreator.instructorId) : null;
                  return instructor?.avatar ? (
                    <img src={instructor.avatar} alt={instructor.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#1d9bf0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 600,
                      flexShrink: 0
                    }}>
                      {(selectedCreator?.name || 'C').charAt(0)}
                    </div>
                  );
                })()}

                {/* Name only */}
                <div style={{ fontSize: 14, fontWeight: 600, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>
                  {communityMode === 'hub' ? 'The Commons' : (groupedByCreator.find(c => c.id === selectedCreatorId)?.name || 'Select Community')}
                </div>

                {/* Dropdown Arrow (next to name) */}
                <FaChevronDown size={12} style={{
                  color: showSelectorDropdown ? '#1d9bf0' : (isDarkMode ? '#9ca3af' : '#71767b'),
                  transform: showSelectorDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }} />

                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* Dropdown Arrow (far right) */}
                <FaChevronDown size={12} style={{
                  color: showSelectorDropdown ? '#1d9bf0' : (isDarkMode ? '#9ca3af' : '#71767b'),
                  transform: showSelectorDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }} />

                {/* Dropdown */}
                {showSelectorDropdown && (
                  <div
                    className="community-selector-dropdown"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: isDarkMode ? '#1f2937' : '#fff',
                      borderRadius: 12,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                      marginTop: 8,
                      zIndex: 100,
                      maxHeight: 'calc(100vh - 75px)',
                      overflowY: 'auto'
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    {/* The Commons Option */}
                    <div
                      onClick={() => {
                        setCommunityMode('hub');
                        setSelectedCreatorId(null);
                        setShowSelectorDropdown(false);
                      }}
                      style={{
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        cursor: 'pointer',
                        background: communityMode === 'hub' ? (isDarkMode ? 'rgba(29, 155, 240, 0.2)' : 'rgba(29, 155, 240, 0.1)') : 'transparent',
                        borderRadius: '12px 12px 0 0',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => { if (communityMode !== 'hub') e.currentTarget.style.background = isDarkMode ? '#374151' : '#f7f9f9'; }}
                      onMouseLeave={e => { if (communityMode !== 'hub') e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{ width: 20, color: '#1d9bf0', fontWeight: 700, flexShrink: 0 }}>{communityMode === 'hub' ? '\u2713' : ''}</span>
                      <img src="https://images.unsplash.com/photo-1555993539-1732b0258235?w=60&h=60&fit=crop" alt="The Commons" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>The Commons Community</div>
                        <div style={{ fontSize: 12, color: isDarkMode ? '#9ca3af' : '#6b7280', marginTop: 2 }}>Open forum for all members</div>
                      </div>
                    </div>

                    {/* Divider */}
                    {groupedByCreator.length > 0 && (
                      <div style={{ height: 1, background: isDarkMode ? '#374151' : '#e5e7eb', margin: '4px 0' }} />
                    )}

                    {/* Creator Options */}
                    {groupedByCreator.map((creator, index) => {
                      const instructor = getInstructorById(creator.instructorId);
                      const isSelected = communityMode === 'creators' && selectedCreatorId === creator.id;
                      return (
                        <div
                          key={creator.id}
                          onClick={() => {
                            setCommunityMode('creators');
                            setSelectedCreatorId(creator.id);
                            setShowSelectorDropdown(false);
                          }}
                          style={{
                            padding: '12px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            cursor: 'pointer',
                            background: isSelected ? (isDarkMode ? 'rgba(29, 155, 240, 0.2)' : 'rgba(29, 155, 240, 0.1)') : 'transparent',
                            borderRadius: index === groupedByCreator.length - 1 ? '0 0 12px 12px' : 0,
                            transition: 'background 0.15s'
                          }}
                          onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = isDarkMode ? '#374151' : '#f7f9f9'; }}
                          onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <span style={{ width: 20, color: '#1d9bf0', fontWeight: 700, flexShrink: 0 }}>{isSelected ? '\u2713' : ''}</span>
                          {instructor?.avatar ? (
                            <img src={instructor.avatar} alt={creator.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                          ) : (
                            <div style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              background: '#1d9bf0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontSize: 12,
                              fontWeight: 600,
                              flexShrink: 0
                            }}>
                              {creator.name.charAt(0)}
                            </div>
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: 14, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>{creator.name} Community</div>
                            {instructor?.title && <div style={{ fontSize: 12, color: isDarkMode ? '#9ca3af' : '#6b7280', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{instructor.title}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              </div>
              {/* Banner Image - only for The Commons hub mode */}
              {communityMode === 'hub' && (
                <div style={{
                  maxHeight: isProfileCollapsed ? 0 : 120,
                  overflow: 'hidden',
                  transition: 'max-height 0.3s ease-out'
                }}>
                  <img
                    src={process.env.PUBLIC_URL + '/commons-banner.png'}
                    alt="The Commons"
                    style={{
                      width: '100%',
                      height: 120,
                      objectFit: 'cover'
                    }}
                  />
                </div>
              )}
              <div style={{
                padding: isProfileCollapsed ? '0 16px 8px 16px' : '0 16px 12px 16px',
                transition: 'all 0.3s ease-out',
                ...(communityMode === 'creators' && selectedCreatorId && !isProfileCollapsed ? {
                  background: isDarkMode
                    ? 'linear-gradient(135deg, #1a2332 0%, #1e293b 100%)'
                    : getUserBannerGradient()
                } : {})
              }}>
                            {/* Profile Info below selector bar */}
              {communityMode === 'hub' ? (
                /* The Commons description + feed pills */
                <div style={{ marginTop: isProfileCollapsed ? 8 : 12, transition: 'margin 0.3s ease-out' }}>
                  <div style={{
                    fontSize: 14,
                    color: isDarkMode ? '#9ca3af' : '#4a5568',
                    lineHeight: 1.4,
                    marginBottom: isProfileCollapsed ? 0 : 12,
                    maxHeight: isProfileCollapsed ? 0 : 100,
                    overflow: 'hidden',
                    opacity: isProfileCollapsed ? 0 : 1,
                    transition: 'all 0.3s ease-out'
                  }}>
                    Welcome to The Commons — the open forum where all community members come together. Share ideas, ask questions, and connect with fellow learners.
                  </div>
                  {/* Main Hall / Member Search pills */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <button
                      onClick={() => setCommonsActiveFeed('main')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '8px 16px',
                        borderRadius: 20,
                        border: commonsActiveFeed === 'main'
                          ? '2px solid #10b981'
                          : (isDarkMode ? '2px solid #536471' : '2px solid #cfd9de'),
                        background: commonsActiveFeed === 'main'
                          ? (isDarkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)')
                          : (isDarkMode ? '#2f3336' : '#f7f9f9'),
                        color: commonsActiveFeed === 'main'
                          ? '#10b981'
                          : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Main Hall
                    </button>
                    <button
                      onClick={() => setCommonsActiveFeed('Member Search')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '8px 16px',
                        borderRadius: 20,
                        border: commonsActiveFeed === 'Member Search'
                          ? '2px solid #10b981'
                          : (isDarkMode ? '2px solid #536471' : '2px solid #cfd9de'),
                        background: commonsActiveFeed === 'Member Search'
                          ? (isDarkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)')
                          : (isDarkMode ? '#2f3336' : '#f7f9f9'),
                        color: commonsActiveFeed === 'Member Search'
                          ? '#10b981'
                          : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Member Search
                    </button>
                  </div>
                </div>
              ) : (() => {
                /* Creator Profile Info - matches pills mode layout */
                const selectedCreator = groupedByCreator.find(c => c.id === selectedCreatorId);
                const instructorIdFromSelected = parseInt(selectedCreatorId?.replace('creator-', '') || '0');
                const instructor = selectedCreator
                  ? getInstructorById(selectedCreator.instructorId)
                  : getInstructorById(instructorIdFromSelected);
                if (!instructor) return null;

                const effectiveCreator = selectedCreator || {
                  id: selectedCreatorId,
                  name: pendingCreatorName || instructor.name,
                  instructorId: instructorIdFromSelected,
                  allCourses: getAllCourses().filter(c => c.instructorId === instructorIdFromSelected),
                  followedCourseIds: selectedCourseFilters.map(f => f.id),
                  isFullCreatorFollow: false
                };

                return (
                  <div style={{
                    marginTop: isProfileCollapsed ? 0 : 12,
                    maxHeight: isProfileCollapsed ? 0 : 500,
                    overflow: 'hidden',
                    opacity: isProfileCollapsed ? 0 : 1,
                    transition: 'all 0.3s ease-out'
                  }}>
                    {/* First Row: Name, Go to Profile, View All Courses */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onViewCreatorProfile) {
                            onViewCreatorProfile(effectiveCreator);
                          }
                        }}
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: '#1d9bf0',
                          cursor: 'pointer',
                          display: 'inline-block',
                          lineHeight: 1.2
                        }}
                        onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                      >
                        {instructor.name} Community
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onViewCreatorProfile) {
                            onViewCreatorProfile(effectiveCreator);
                          }
                        }}
                        style={{
                          fontSize: 12,
                          color: '#1d9bf0',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                      >
                        Go to Profile
                      </div>
                      {/* Spacer */}
                      <div style={{ flex: 1 }} />
                      {/* View All Courses Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onViewCreatorProfile) {
                            onViewCreatorProfile(effectiveCreator);
                          }
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '8px 16px',
                          borderRadius: 20,
                          border: isDarkMode ? '2px solid #536471' : '2px solid #cfd9de',
                          background: isDarkMode ? '#2f3336' : '#f7f9f9',
                          color: isDarkMode ? '#e7e9ea' : '#0f1419',
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        View All Courses
                      </button>
                    </div>
                    {/* Title */}
                    <div style={{
                      fontSize: 14,
                      color: isDarkMode ? '#9ca3af' : '#536471',
                      marginTop: 4
                    }}>
                      {instructor.title}
                    </div>
                    {/* Stats */}
                    <div style={{
                      fontSize: 12,
                      color: isDarkMode ? '#9ca3af' : '#536471',
                      marginTop: 2
                    }}>
                      {instructor.courses?.length || effectiveCreator.allCourses?.length || 0} Courses · {(instructor.stats?.studentsTaught || 0).toLocaleString()} Students · 189 Posts
                    </div>
                    {/* Bio */}
                    {instructor.bio && (
                      <div style={{
                        fontSize: 14,
                        color: isDarkMode ? '#d1d5db' : '#374151',
                        marginTop: 8,
                        lineHeight: 1.4
                      }}>
                        {instructor.bio.length > 150 ? instructor.bio.substring(0, 150) + '...' : instructor.bio}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Course Pills for selector mode - only show when a creator is selected */}
              {communityMode === 'creators' && selectedCreatorId && (() => {
                const selectedCreator = groupedByCreator.find(c => c.id === selectedCreatorId);
                const instructorIdFromSelected = typeof selectedCreatorId === 'string' ? parseInt(selectedCreatorId.replace('creator-', '')) : selectedCreatorId;
                const effectiveCreator = selectedCreator || {
                  id: selectedCreatorId,
                  name: pendingCreatorName || 'Creator',
                  instructorId: instructorIdFromSelected,
                  allCourses: getAllCourses().filter(c => c.instructorId === instructorIdFromSelected),
                  followedCourseIds: selectedCourseFilters.map(f => f.id),
                  isFullCreatorFollow: false
                };

                const allCourses = effectiveCreator.allCourses || [];
                const followedCourseIds = effectiveCreator.followedCourseIds || [];
                const purchasedCourses = allCourses.filter(course => followedCourseIds.includes(course.id));
                const isHubSelected = selectedCourseFilters.length === 0;

                return (
                  <div style={{
                    marginTop: 12,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}>
                    {/* Left Arrow */}
                    {showPillsLeftArrow && (
                      <button
                        onClick={() => scrollPills('left')}
                        style={{
                          background: isDarkMode ? '#2f3336' : '#f7f9f9',
                          border: isDarkMode ? '1px solid #536471' : '1px solid #cfd9de',
                          borderRadius: '50%',
                          width: 28,
                          height: 28,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          flexShrink: 0,
                          color: isDarkMode ? '#e7e9ea' : '#0f1419',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        <FaChevronLeft size={12} />
                      </button>
                    )}
                    {/* Scrollable Pills Container */}
                    <div
                      ref={pillsContainerRef}
                      className="course-pills-container"
                      onScroll={updatePillsArrows}
                      onMouseDown={handlePillsMouseDown}
                      onMouseMove={handlePillsMouseMove}
                      onMouseUp={handlePillsMouseUp}
                      onMouseLeave={handlePillsMouseLeave}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        paddingBottom: 4,
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch',
                        cursor: 'grab',
                        flex: 1,
                        userSelect: 'none'
                      }}
                    >
                      {/* Main Hall Pill - Always first */}
                      <button
                        onClick={() => setSelectedCourseFilters([])}
                        className={`course-pill ${isHubSelected ? 'course-pill-selected' : ''}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '8px 16px',
                          borderRadius: 20,
                          border: isHubSelected
                            ? '2px solid #1d9bf0'
                            : (isDarkMode ? '2px solid #536471' : '2px solid #cfd9de'),
                          background: isHubSelected
                            ? (isDarkMode ? 'rgba(29, 155, 240, 0.15)' : 'rgba(29, 155, 240, 0.1)')
                            : (isDarkMode ? '#2f3336' : '#f7f9f9'),
                          color: isHubSelected
                            ? '#1d9bf0'
                            : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        Main Hall
                      </button>

                      {/* Course Pills - Only purchased courses */}
                      {purchasedCourses.map(course => {
                        const isSelected = selectedCourseFilters.length === 1 && selectedCourseFilters[0].id === course.id;
                        return (
                          <button
                            key={course.id}
                            onClick={() => {
                              setSelectedCourseFilters([{ id: course.id, name: course.title }]);
                            }}
                            className={`course-pill ${isSelected ? 'course-pill-selected' : ''}`}
                            title={course.title}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '8px 16px',
                              borderRadius: 20,
                              border: isSelected
                                ? '2px solid #1d9bf0'
                                : (isDarkMode ? '2px solid #536471' : '2px solid #cfd9de'),
                              background: isSelected
                                ? (isDarkMode ? 'rgba(29, 155, 240, 0.15)' : 'rgba(29, 155, 240, 0.1)')
                                : (isDarkMode ? '#2f3336' : '#f7f9f9'),
                              color: isSelected
                                ? '#1d9bf0'
                                : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                              fontSize: 14,
                              fontWeight: 600,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              flexShrink: 0,
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {course.title}
                          </button>
                        );
                      })}
                    </div>
                    {/* Right Arrow */}
                    {showPillsRightArrow && (
                      <button
                        onClick={() => scrollPills('right')}
                        style={{
                          background: isDarkMode ? '#2f3336' : '#f7f9f9',
                          border: isDarkMode ? '1px solid #536471' : '1px solid #cfd9de',
                          borderRadius: '50%',
                          width: 28,
                          height: 28,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          flexShrink: 0,
                          color: isDarkMode ? '#e7e9ea' : '#0f1419',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        <FaChevronRight size={12} />
                      </button>
                    )}
                  </div>
                );
              })()}
              </div>
            </div>
          );
          })()}

          {/* Old slideout panel removed - now handled by FeedsSlideoutPanel in App.js */}

          {/* Town Hall Profile Card - Shows when Town Hall is selected (non-selector mode) */}
          {communityNavStyle !== 'selector' && communityMode === 'hub' && (
            <div style={{
              background: isDarkMode ? '#1f2937' : '#fff',
              borderRadius: 16,
              margin: '8px 16px 0 16px',
              position: 'sticky',
              top: communityNavStyle === 'pills' ? 57 : 0,
              zIndex: 10,
              border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
              boxShadow: isDarkMode ? '0 4px 25px 10px rgba(80, 80, 80, 0.8)' : '0 2px 8px rgba(0,0,0,0.08)',
              overflow: 'hidden'
            }}>
              {/* Collapsible Banner Section - animates height */}
              <div style={{
                maxHeight: isProfileCollapsed ? 0 : 140,
                overflow: 'hidden',
                transition: 'max-height 0.3s ease-out'
              }}>
                <img
                  src={process.env.PUBLIC_URL + '/commons-banner.png'}
                  alt="The Commons"
                  style={{
                    width: '100%',
                    height: 140,
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Header - always visible, adjusts padding */}
              <div style={{
                padding: isProfileCollapsed ? '12px 16px 8px 16px' : '16px 20px 0 20px',
                transition: 'padding 0.3s ease-out'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}>
                  {/* Small avatar only shows when collapsed */}
                  <img
                    src={process.env.PUBLIC_URL + '/commons-banner.png'}
                    alt="The Commons"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      objectFit: 'cover',
                      opacity: isProfileCollapsed ? 1 : 0,
                      maxWidth: isProfileCollapsed ? 36 : 0,
                      marginRight: isProfileCollapsed ? 0 : -12,
                      transition: 'opacity 0.3s ease-out, max-width 0.3s ease-out, margin-right 0.3s ease-out'
                    }}
                  />
                  <div style={{
                    fontSize: isProfileCollapsed ? 16 : 20,
                    fontWeight: 700,
                    color: isDarkMode ? '#e7e9ea' : '#1a365d',
                    lineHeight: 1.2,
                    transition: 'font-size 0.3s ease-out'
                  }}>
                    The Commons
                  </div>
                </div>
              </div>

              {/* Collapsible Details Section - animates height */}
              <div style={{
                maxHeight: isProfileCollapsed ? 0 : 100,
                overflow: 'hidden',
                opacity: isProfileCollapsed ? 0 : 1,
                transition: 'max-height 0.3s ease-out, opacity 0.2s ease-out',
                padding: '0 20px'
              }}>
                <div style={{
                  fontSize: 14,
                  color: isDarkMode ? '#71767b' : '#536471',
                  marginBottom: 8,
                  marginTop: 4
                }}>
                  Community Discussion Hub
                </div>
                <div style={{
                  fontSize: 14,
                  color: isDarkMode ? '#9ca3af' : '#4a5568',
                  lineHeight: 1.5
                }}>
                  Welcome to The Commons — the open forum where all community members come together. Share ideas, ask questions, and connect with fellow learners across all courses and communities.
                </div>
              </div>

              {/* Commons Feed Pills - always visible */}
              <div style={{
                padding: isProfileCollapsed ? '8px 16px 12px 16px' : '12px 20px 16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'padding 0.3s ease-out'
              }}>
                <button
                  onClick={() => setCommonsActiveFeed('main')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: isProfileCollapsed ? '6px 12px' : '8px 16px',
                    borderRadius: isProfileCollapsed ? 16 : 20,
                    border: commonsActiveFeed === 'main'
                      ? '2px solid #10b981'
                      : (isDarkMode ? '2px solid #536471' : '2px solid #cfd9de'),
                    background: commonsActiveFeed === 'main'
                      ? (isDarkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)')
                      : (isDarkMode ? '#2f3336' : '#f7f9f9'),
                    color: commonsActiveFeed === 'main'
                      ? '#10b981'
                      : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                    fontSize: isProfileCollapsed ? 13 : 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.3s ease-out'
                  }}
                >
                  Main Hall
                </button>
                {['Member Search'].map(num => (
                  <button
                    key={num}
                    onClick={() => setCommonsActiveFeed(num)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: isProfileCollapsed ? '6px 12px' : '8px 16px',
                      borderRadius: isProfileCollapsed ? 16 : 20,
                      border: commonsActiveFeed === num
                        ? '2px solid #10b981'
                        : (isDarkMode ? '2px solid #536471' : '2px solid #cfd9de'),
                      background: commonsActiveFeed === num
                        ? (isDarkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)')
                        : (isDarkMode ? '#2f3336' : '#f7f9f9'),
                      color: commonsActiveFeed === num
                        ? '#10b981'
                        : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                      fontSize: isProfileCollapsed ? 13 : 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      transition: 'all 0.3s ease-out'
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mini Creator Profile - Shows when a creator is selected (non-selector mode) */}
          {communityNavStyle !== 'selector' && communityMode === 'creators' && selectedCreatorId && (() => {
            const selectedCreator = groupedByCreator.find(c => c.id === selectedCreatorId);
            // Extract instructor ID from selectedCreatorId (format: "creator-{id}")
            const instructorIdFromSelected = typeof selectedCreatorId === 'string' ? parseInt(selectedCreatorId.replace('creator-', '')) : selectedCreatorId;
            const instructor = selectedCreator
              ? getInstructorById(selectedCreator.instructorId)
              : getInstructorById(instructorIdFromSelected);
            if (!instructor) return null;

            // For pending creators (not in groupedByCreator), create a minimal creator object
            const effectiveCreator = selectedCreator || {
              id: selectedCreatorId,
              name: pendingCreatorName || instructor.name,
              instructorId: instructorIdFromSelected,
              allCourses: getAllCourses().filter(c => c.instructorId === instructorIdFromSelected),
              followedCourseIds: selectedCourseFilters.map(f => f.id),
              isFullCreatorFollow: false
            };
            
            return (
              <div style={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, #1a2332 0%, #1e293b 100%)'
                  : getUserBannerGradient(),
                borderRadius: 16,
                padding: isProfileCollapsed ? '12px 16px' : '20px',
                margin: '8px 16px 0 16px',
                position: 'sticky',
                top: communityNavStyle === 'pills' ? 57 : 0,
                zIndex: 10,
                border: 'none',
                boxShadow: isDarkMode ? '0 4px 25px 10px rgba(80, 80, 80, 0.8)' : '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'padding 0.3s ease-out'
              }}>
                {/* Header Row - Always visible, shows avatar + name */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}>
                  {/* Avatar - shrinks when collapsed */}
                  {instructor.avatar ? (
                    <img
                      src={instructor.avatar}
                      alt={instructor.name}
                      style={{
                        width: isProfileCollapsed ? 32 : 44,
                        height: isProfileCollapsed ? 32 : 44,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        flexShrink: 0,
                        transition: 'width 0.3s ease-out, height 0.3s ease-out'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: isProfileCollapsed ? 32 : 44,
                      height: isProfileCollapsed ? 32 : 44,
                      borderRadius: '50%',
                      background: '#1d9bf0',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isProfileCollapsed ? 12 : 16,
                      fontWeight: 700,
                      flexShrink: 0,
                      transition: 'width 0.3s ease-out, height 0.3s ease-out, font-size 0.3s ease-out'
                    }}>
                      {instructor.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                  )}

                  {/* Name - always visible */}
                  <div
                    onClick={() => {
                      if (onViewCreatorProfile) {
                        onViewCreatorProfile(effectiveCreator);
                      }
                    }}
                    style={{
                      fontSize: isProfileCollapsed ? 16 : 18,
                      fontWeight: 700,
                      color: '#1d9bf0',
                      cursor: 'pointer',
                      display: 'inline-block',
                      lineHeight: 1.2,
                      transition: 'font-size 0.3s ease-out'
                    }}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                  >
                    {instructor.name} Community
                  </div>

                  {/* Go to Profile - hidden when collapsed */}
                  <div
                    onClick={() => {
                      if (onViewCreatorProfile) {
                        onViewCreatorProfile(effectiveCreator);
                      }
                    }}
                    style={{
                      fontSize: 12,
                      color: '#1d9bf0',
                      cursor: 'pointer',
                      opacity: isProfileCollapsed ? 0 : 1,
                      maxWidth: isProfileCollapsed ? 0 : 100,
                      overflow: 'hidden',
                      transition: 'opacity 0.3s ease-out, max-width 0.3s ease-out'
                    }}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                  >
                    Go to Profile
                  </div>

                  {/* Spacer */}
                  <div style={{ flex: 1 }} />

                  {/* View All Courses Button - hidden when collapsed */}
                  <button
                    onClick={() => {
                      if (onViewCreatorProfile) {
                        onViewCreatorProfile(effectiveCreator);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 14px',
                      borderRadius: 16,
                      border: '2px solid #6366f1',
                      background: isDarkMode ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)',
                      color: '#6366f1',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      opacity: isProfileCollapsed ? 0 : 1,
                      maxWidth: isProfileCollapsed ? 0 : 200,
                      overflow: 'hidden',
                      padding: isProfileCollapsed ? 0 : '6px 14px',
                      transition: 'all 0.3s ease-out'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#6366f1';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = isDarkMode ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)';
                      e.currentTarget.style.color = '#6366f1';
                    }}
                  >
                    View All Courses
                  </button>
                </div>

                {/* Collapsible Details Section */}
                <div style={{
                  maxHeight: isProfileCollapsed ? 0 : 150,
                  overflow: 'hidden',
                  opacity: isProfileCollapsed ? 0 : 1,
                  transition: 'max-height 0.3s ease-out, opacity 0.2s ease-out',
                  marginTop: isProfileCollapsed ? 0 : 4
                }}>
                  <div style={{
                    fontSize: 14,
                    color: isDarkMode ? '#9ca3af' : '#536471'
                  }}>
                    {instructor.title}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: isDarkMode ? '#9ca3af' : '#536471',
                    marginTop: 2
                  }}>
                    {instructor.courses?.length || 0} Courses · {(instructor.stats?.studentsTaught || 0).toLocaleString()} Students · 189 Posts
                  </div>
                  {instructor.bio && (
                    <div style={{
                      fontSize: 14,
                      color: isDarkMode ? '#d1d5db' : '#374151',
                      marginTop: 8,
                      lineHeight: 1.4
                    }}>
                      {instructor.bio.length > 150 ? instructor.bio.substring(0, 150) + '...' : instructor.bio}
                    </div>
                  )}
                </div>

                {/* Horizontal Scrollable Course Pills - Always visible */}
                {(() => {
                  // Show only purchased courses as pills
                  const allCourses = effectiveCreator.allCourses || [];
                  const followedCourseIds = effectiveCreator.followedCourseIds || [];

                  // Only show purchased courses as individual pills
                  const purchasedCourses = allCourses.filter(course =>
                    followedCourseIds.includes(course.id)
                  );

                  // Check if there are more courses to view
                  const hasMoreCourses = allCourses.length > 0;

                  const isHubSelected = selectedCourseFilters.length === 0;

                  return (
                    <>
                      {purchasedCourses.length > 0 && (
                        <div style={{
                          marginTop: isProfileCollapsed ? 0 : 12,
                          fontSize: 13,
                          fontWeight: 500,
                          color: isDarkMode ? '#9ca3af' : '#6b7280'
                        }}>
                          Choose a feed:
                        </div>
                      )}
                      <div style={{
                        marginTop: purchasedCourses.length > 0 ? 6 : (isProfileCollapsed ? 0 : 12),
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                      {/* Left Arrow */}
                      {showPillsLeftArrow && (
                        <button
                          onClick={() => scrollPills('left')}
                          style={{
                            background: isDarkMode ? '#2f3336' : '#f7f9f9',
                            border: isDarkMode ? '1px solid #536471' : '1px solid #cfd9de',
                            borderRadius: '50%',
                            width: 28,
                            height: 28,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            flexShrink: 0,
                            color: isDarkMode ? '#e7e9ea' : '#0f1419',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          <FaChevronLeft size={12} />
                        </button>
                      )}
                      {/* Scrollable Pills Container */}
                      <div
                        ref={pillsContainerRef}
                        className="course-pills-container"
                        onScroll={updatePillsArrows}
                        onMouseDown={handlePillsMouseDown}
                        onMouseMove={handlePillsMouseMove}
                        onMouseUp={handlePillsMouseUp}
                        onMouseLeave={handlePillsMouseLeave}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          overflowX: 'auto',
                          overflowY: 'hidden',
                          paddingBottom: 4,
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none',
                          WebkitOverflowScrolling: 'touch',
                          cursor: 'grab',
                          flex: 1,
                          userSelect: 'none'
                        }}
                      >
                        {/* Main Hall Pill - Always first */}
                        <button
                          onClick={() => setSelectedCourseFilters([])}
                          className={`course-pill ${isHubSelected ? 'course-pill-selected' : ''}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '8px 16px',
                            borderRadius: 20,
                            border: isHubSelected
                              ? '2px solid #1d9bf0'
                              : (isDarkMode ? '2px solid #536471' : '2px solid #cfd9de'),
                            background: isHubSelected
                              ? (isDarkMode ? 'rgba(29, 155, 240, 0.15)' : 'rgba(29, 155, 240, 0.1)')
                              : (isDarkMode ? '#2f3336' : '#f7f9f9'),
                            color: isHubSelected
                              ? '#1d9bf0'
                              : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Main Hall
                        </button>

                        {/* Course Pills - Only purchased courses */}
                        {purchasedCourses.map(course => {
                          const isSelected = selectedCourseFilters.length === 1 && selectedCourseFilters[0].id === course.id;
                          return (
                            <button
                              key={course.id}
                              onClick={() => {
                                setSelectedCourseFilters([{ id: course.id, name: course.title }]);
                              }}
                              className={`course-pill ${isSelected ? 'course-pill-selected' : ''}`}
                              title={course.title}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '8px 16px',
                                borderRadius: 20,
                                border: isSelected
                                  ? '2px solid #1d9bf0'
                                  : (isDarkMode ? '2px solid #536471' : '2px solid #cfd9de'),
                                background: isSelected
                                  ? (isDarkMode ? 'rgba(29, 155, 240, 0.15)' : 'rgba(29, 155, 240, 0.1)')
                                  : (isDarkMode ? '#2f3336' : '#f7f9f9'),
                                color: isSelected
                                  ? '#1d9bf0'
                                  : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {course.title}
                            </button>
                          );
                        })}

                        {/* View All Courses button moved to top right of profile card */}
                      </div>
                      {/* Right Arrow */}
                      {showPillsRightArrow && (
                        <button
                          onClick={() => scrollPills('right')}
                          style={{
                            background: isDarkMode ? '#2f3336' : '#f7f9f9',
                            border: isDarkMode ? '1px solid #536471' : '1px solid #cfd9de',
                            borderRadius: '50%',
                            width: 28,
                            height: 28,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            flexShrink: 0,
                            color: isDarkMode ? '#e7e9ea' : '#0f1419',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          <FaChevronRight size={12} />
                        </button>
                      )}
                      </div>
                    </>
                  );
                })()}
              </div>
            );
          })()}

          {/* Feed Content - slightly lighter to show card shadow */}
          <div className="community-feed-content" style={{ background: isDarkMode ? '#050505' : '#fff' }}>

            {/* Member Search View - Shows when Member Search pill is selected */}
            {communityMode === 'hub' && commonsActiveFeed === 'Member Search' && (
              <MemberSearchView
                isDarkMode={isDarkMode}
                searchQuery={memberSearchQuery}
                setSearchQuery={setMemberSearchQuery}
                onViewMemberProfile={onViewMemberProfile}
              />
            )}

            {/* Post Box - Clean Card Design (hidden when Member Search is active) */}
            {commonsActiveFeed !== 'Member Search' && <div
              className="post-composer"
              style={{
                borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
                padding: '12px 16px 16px 16px',
                background: isDarkMode ? 'rgba(29, 155, 240, 0.03)' : 'rgba(29, 155, 240, 0.02)',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              {/* Input Card */}
              <div style={{
                border: isDarkMode ? '1px solid #2f3336' : '1px solid #cfd9de',
                borderRadius: 12,
                background: isDarkMode ? '#0a0a0a' : '#fff',
                overflow: 'hidden',
                boxSizing: 'border-box',
                width: '100%',
                position: 'relative'
              }}>
                {/* Locked Overlay for new users who haven't completed signup */}
                {currentUser?.isNewUser && !signupCompleted && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: isDarkMode ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(2px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    borderRadius: 12
                  }}>
                    <div style={{
                      textAlign: 'center',
                      padding: '16px 24px'
                    }}>
                      <div style={{
                        fontSize: 24,
                        marginBottom: 8
                      }}>🔒</div>
                      <div style={{
                        color: isDarkMode ? '#e7e9ea' : '#0f1419',
                        fontSize: 15,
                        fontWeight: 600,
                        marginBottom: 4
                      }}>
                        Complete signup to share a post
                      </div>
                      <div style={{
                        color: isDarkMode ? '#71767b' : '#536471',
                        fontSize: 13
                      }}>
                        Select your interests below to unlock posting
                      </div>
                    </div>
                  </div>
                )}
                {/* Text Area with Avatar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: '12px 14px',
                  gap: 10,
                  opacity: (currentUser?.isNewUser && !signupCompleted) ? 0.4 : 1
                }}>
                  {/* User Avatar - clickable to go to profile */}
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      onClick={() => onMenuChange && onMenuChange('Profile')}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        flexShrink: 0,
                        marginTop: 2,
                        cursor: 'pointer',
                        transition: 'opacity 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      title="View your profile"
                    />
                  ) : (
                    <div
                      onClick={() => onMenuChange && onMenuChange('Profile')}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: '#1d9bf0',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: 2,
                        cursor: 'pointer',
                        transition: 'opacity 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      title="View your profile"
                    >
                      {getUserInitials()}
                    </div>
                  )}
                  <textarea
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    onFocus={() => setIsComposerFocused(true)}
                    placeholder={
                      communityMode === 'hub'
                        ? "What's on your mind? Share with the community..."
                        : selectedCourseFilters.length > 0
                          ? `Discuss ${selectedCourseFilters[0].name}...`
                          : "Ask a question or share an insight..."
                    }
                    disabled={currentUser?.isNewUser && !signupCompleted}
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      resize: 'none',
                      fontSize: 15,
                      fontWeight: 400,
                      lineHeight: 1.5,
                      background: (isDarkMode ? '#2f3336' : '#f7f9f9'),
                      color: isDarkMode ? '#e7e9ea' : '#0f1419',
                      padding: 0,
                      minHeight: 50,
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      display: 'block'
                    }}
                  />
                </div>

                {/* Bottom Action Bar */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderTop: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
                    background: isDarkMode ? '#16181c' : '#f7f9f9',
                    width: '100%',
                    boxSizing: 'border-box',
                    opacity: (currentUser?.isNewUser && !signupCompleted) ? 0.4 : 1
                  }}
                >
                  {/* Media Icons */}
                  <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        disabled={currentUser?.isNewUser && !signupCompleted}
                        style={{
                          background: isDarkMode ? 'rgba(29, 155, 240, 0.1)' : 'rgba(29, 155, 240, 0.08)',
                          border: 'none',
                          color: '#1d9bf0',
                          cursor: (currentUser?.isNewUser && !signupCompleted) ? 'not-allowed' : 'pointer',
                          padding: '6px 8px',
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 16,
                          transition: 'background 0.2s'
                        }}
                        title="Add image"
                        onMouseEnter={e => !(currentUser?.isNewUser && !signupCompleted) && (e.currentTarget.style.background = isDarkMode ? 'rgba(29, 155, 240, 0.2)' : 'rgba(29, 155, 240, 0.15)')}
                        onMouseLeave={e => e.currentTarget.style.background = isDarkMode ? 'rgba(29, 155, 240, 0.1)' : 'rgba(29, 155, 240, 0.08)'}
                      >
                        <FaImage />
                      </button>
                      <button
                        disabled={currentUser?.isNewUser && !signupCompleted}
                        style={{
                          background: isDarkMode ? 'rgba(29, 155, 240, 0.1)' : 'rgba(29, 155, 240, 0.08)',
                          border: 'none',
                          color: '#1d9bf0',
                          cursor: (currentUser?.isNewUser && !signupCompleted) ? 'not-allowed' : 'pointer',
                          padding: '6px 8px',
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 16,
                          transition: 'background 0.2s'
                        }}
                        title="Add link"
                        onMouseEnter={e => !(currentUser?.isNewUser && !signupCompleted) && (e.currentTarget.style.background = isDarkMode ? 'rgba(29, 155, 240, 0.2)' : 'rgba(29, 155, 240, 0.15)')}
                        onMouseLeave={e => e.currentTarget.style.background = isDarkMode ? 'rgba(29, 155, 240, 0.1)' : 'rgba(29, 155, 240, 0.08)'}
                      >
                        <FaLink />
                      </button>
                      <button
                        disabled={currentUser?.isNewUser && !signupCompleted}
                        style={{
                          background: isDarkMode ? 'rgba(29, 155, 240, 0.1)' : 'rgba(29, 155, 240, 0.08)',
                          border: 'none',
                          color: '#1d9bf0',
                          cursor: (currentUser?.isNewUser && !signupCompleted) ? 'not-allowed' : 'pointer',
                          padding: '6px 8px',
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 16,
                          transition: 'background 0.2s'
                        }}
                        title="Attach file"
                        onMouseEnter={e => !(currentUser?.isNewUser && !signupCompleted) && (e.currentTarget.style.background = isDarkMode ? 'rgba(29, 155, 240, 0.2)' : 'rgba(29, 155, 240, 0.15)')}
                        onMouseLeave={e => e.currentTarget.style.background = isDarkMode ? 'rgba(29, 155, 240, 0.1)' : 'rgba(29, 155, 240, 0.08)'}
                      >
                        <FaPaperclip />
                      </button>
                    </div>

                  {/* Post Button */}
                  <button
                    disabled={!newPostText.trim() || isPosting || (currentUser?.isNewUser && !signupCompleted)}
                    onClick={handleSubmitPost}
                    style={{
                      background: '#1d9bf0',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 20,
                      padding: '8px 20px',
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: (newPostText.trim() && !isPosting && !(currentUser?.isNewUser && !signupCompleted)) ? 'pointer' : 'not-allowed',
                      opacity: (newPostText.trim() && !isPosting && !(currentUser?.isNewUser && !signupCompleted)) ? 1 : 0.5,
                      transition: 'opacity 0.2s'
                    }}
                  >
                    {isPosting ? 'Posting...' : 'Post'}
                  </button>
                </div>
                {postError && (
                  <div style={{ color: '#f44', fontSize: 12, padding: '0 12px 8px' }}>{postError}</div>
                )}
              </div>
            </div>}

            {/* Welcome Post - Only for new users who haven't completed signup (hidden when Member Search is active) */}
            {commonsActiveFeed !== 'Member Search' && currentUser?.isNewUser && communityMode === 'hub' && !signupCompleted && (
              <div
                className="welcome-post-card"
                style={{
                  background: isDarkMode ? '#16181c' : '#fff',
                  border: isDarkMode ? '1px solid #2f3336' : '1px solid #e1e8ed',
                  borderRadius: 12,
                  margin: '12px 16px',
                  padding: '20px',
                  display: 'flex',
                  gap: 20,
                  position: 'sticky',
                  top: 100,
                  zIndex: 9,
                  boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                {/* Video Thumbnail - Click to open popup */}
                <div
                  onClick={() => setShowWelcomeVideo(true)}
                  style={{
                    width: 240,
                    height: 160,
                    flexShrink: 0,
                    background: isDarkMode ? '#2f3336' : '#f0f0f0',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {/* Thumbnail image from Vimeo */}
                  <img
                    src="https://vumbnail.com/1155787226.jpg"
                    alt="Welcome video thumbnail"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      position: 'absolute',
                      top: 0,
                      left: 0
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  {/* Play button overlay */}
                  <div style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2
                  }}>
                    <FaPlay style={{ fontSize: 24, color: '#fff', marginLeft: 4 }} />
                  </div>
                </div>

                {/* Content - Right Side */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
                  <h1 style={{ fontSize: 28, fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#0f1419', margin: 0 }}>
                    Welcome to PeerLoop
                  </h1>
                  <p style={{ fontSize: 17, color: isDarkMode ? '#71767b' : '#536471', margin: 0, fontWeight: 500 }}>
                    A peer-to-peer knowledge sharing community
                  </p>
                  <p style={{ fontSize: 16, color: isDarkMode ? '#e7e9ea' : '#0f1419', margin: '6px 0 0 0', lineHeight: 1.6 }}>
                    Learn from people who've been where you are. Teach what you've mastered.
                    Follow creators, take courses, and share your own knowledge when you're ready.
                  </p>
                  <button
                    onClick={() => {
                      setShowInterestsModal(true);
                    }}
                    style={{
                      background: '#1d9bf0',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 9999,
                      padding: '12px 28px',
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      marginTop: 8,
                      alignSelf: 'flex-start'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1a8cd8'}
                    onMouseLeave={e => e.currentTarget.style.background = '#1d9bf0'}
                  >
                    Create an account
                  </button>
                </div>
              </div>
            )}

            {/* Posts Feed (hidden when Member Search is active) */}
            {commonsActiveFeed !== 'Member Search' && (groupedByCreator.length > 0 || realPosts.length > 0 || communityMode === 'hub' || (communityMode === 'creators' && selectedCreatorId)) ? (
              <div className="posts-feed">
                {displayedPosts.length > 0 ? (
                  displayedPosts.map(post => {
                    const course = getCourseById(post.courseId);
                    
                    // Handle clicking on post author to view their profile
                    const handlePostAuthorClick = () => {
                      // If this is a creator post, navigate to creator profile
                      if (post.isCreatorTownHall && post.instructorId) {
                        const instructor = getInstructorById(post.instructorId);
                        if (instructor && onViewCreatorProfile) {
                          // Add instructorId property for the callback to use
                          onViewCreatorProfile({ ...instructor, instructorId: post.instructorId });
                          return;
                        }
                      }
                      // Otherwise, navigate to user profile
                      if (onViewUserProfile) {
                        onViewUserProfile(post.author);
                      }
                    };
                    
                    return (
                      <div key={post.id} className="post-card">
                        <div className="post-card-header">
                          <img 
                            className="post-card-avatar"
                            src={post.authorAvatar}
                            alt={post.author}
                            onClick={handlePostAuthorClick}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              objectFit: 'cover',
                              cursor: 'pointer',
                              transition: 'transform 0.15s, box-shadow 0.15s'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.transform = 'scale(1.05)';
                              e.currentTarget.style.boxShadow = '0 2px 8px rgba(255,255,255,0.2)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                            title={`View ${post.author}'s profile`}
                          />
                          <div className="post-card-header-info">
                            <div className="post-card-name-row">
                              <span 
                                className="post-card-author"
                                onClick={handlePostAuthorClick}
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                              >
                                {post.author}
                              </span>
                              <span 
                                className="post-card-handle"
                                onClick={handlePostAuthorClick}
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#1d9bf0'}
                                onMouseLeave={e => e.currentTarget.style.color = ''}
                              >
                                {post.authorHandle}
                              </span>
                              <span className="post-card-dot">·</span>
                              <span className="post-card-timestamp">{post.timestamp}</span>
                            </div>
                            {post.community && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                {post.isPinned && (
                                  <span style={{
                                    background: isDarkMode ? 'rgba(29, 155, 240, 0.2)' : 'rgba(29, 155, 240, 0.1)',
                                    color: '#1d9bf0',
                                    fontSize: 10,
                                    fontWeight: 600,
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 3
                                  }}>
                                    📌 Pinned
                                  </span>
                                )}
                                {(post.isTownHallExclusive || post.isCreatorTownHall) ? (
                                  <span
                                    className="post-card-community"
                                    style={{
                                      background: post.isCreatorTownHall
                                        ? (isDarkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)')
                                        : (isDarkMode ? 'rgba(29, 155, 240, 0.15)' : 'rgba(29, 155, 240, 0.1)'),
                                      color: post.isCreatorTownHall ? '#8b5cf6' : '#1d9bf0',
                                      padding: '2px 8px',
                                      borderRadius: 12,
                                      fontWeight: 500,
                                      cursor: 'default'
                                    }}
                                  >
                                    {post.community}
                                  </span>
                                ) : (
                                  <span
                                    className="post-card-community"
                                    onClick={() => {
                                      if (onViewCourse && post.courseId) {
                                        onViewCourse(post.courseId);
                                      }
                                    }}
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                                    onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                                    title={`View ${post.community} course`}
                                  >
                                    in {post.community}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="post-card-content">{post.content}</div>
                        <div className="post-card-actions">
                          <button className="post-action-btn">
                            <FaComment />
                            <span>{post.replies}</span>
                          </button>
                          <button className="post-action-btn">
                            <FaRetweet />
                            <span>{Math.floor(post.likes * 0.3)}</span>
                          </button>
                          <button className="post-action-btn">
                            <FaHeart />
                            <span>{post.likes}</span>
                          </button>
                          <button className="post-action-btn">
                            <FaBookmark />
                          </button>
                          <button className="post-action-btn">
                            <FaShare />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <FaBook />
                    </div>
                    {communityMode === 'creators' && selectedCreatorId && !groupedByCreator.find(c => c.id === selectedCreatorId) ? (
                      <>
                        <h2>Not Joined {pendingCreatorName || 'This Community'}</h2>
                        <p>
                          You haven't joined any courses from {pendingCreatorName || 'this community'} yet.
                        </p>
                        <p style={{ marginTop: 8, color: '#1d9bf0' }}>
                          Go to <strong>Browse → Communities</strong> to join their courses!
                        </p>
                      </>
                    ) : (
                      <>
                        <h2>No Posts Yet</h2>
                        <p>
                          {communityMode === 'hub'
                            ? 'Welcome to The Commons! This is where the community connects. Be the first to share something!'
                            : 'No posts in this community yet. Be the first to share!'}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FaUsers />
                </div>
                <h2>Welcome to My Community</h2>
                <p>Join courses from <strong>Browse → Courses</strong> or <strong>Communities</strong> to see their community posts here.</p>
                <p className="empty-state-hint">Communities you join will appear as tabs above ↑</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane - Removed for cleaner centered layout */}
      </div>
    </div>
  );
};

export default Community; 