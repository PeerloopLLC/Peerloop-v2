import React, { useState, useMemo, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { FaSearch, FaBook, FaPlay, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { AiOutlineStar, AiOutlineTeam } from 'react-icons/ai';
import { getInstructorWithCourses, getAllCourses, getInstructorById } from '../data/database';
import CommunityHoverCard from './CommunityHoverCard';
import CourseHoverCard from './CourseHoverCard';
import UserHoverCard from './UserHoverCard';
import Breadcrumb from './Breadcrumb';
import { useHeaderCollapse } from '../hooks/useHeaderCollapse';

/**
 * DiscoverView - Unified search for communities and courses
 * Shows communities with their matching courses in a linear format
 */
const DiscoverView = ({
  isDarkMode,
  currentUser,
  onMenuChange,
  indexedCourses,
  indexedInstructors,
  userStatus,  // New unified status hook (optional during migration)
  followedCommunities,
  setFollowedCommunities,
  isCoursePurchased,
  isCourseFollowed,
  handleFollowCourse,
  isCreatorFollowed,
  handleFollowInstructor,
  onViewCourse,
  onViewCommunity,
  onViewCreatorProfile,
  signupCompleted = false,
  setSignupCompleted = null,
  breadcrumbItems = null,  // Breadcrumb navigation items
  onBack = null  // Back button handler
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Discover listing format preference
  const [discoverListingFormat, setDiscoverListingFormat] = useState(() => {
    return localStorage.getItem('discoverListingFormat') || 'combined';
  });

  // Compact view text scale preference
  const [compactTextScale, setCompactTextScale] = useState(() => {
    const saved = localStorage.getItem('compactTextScale');
    return saved ? parseFloat(saved) : 1.0;
  });

  // Combined card gray level preference (0-100)
  const [combinedCardGrayLevel, setCombinedCardGrayLevel] = useState(() => {
    const saved = localStorage.getItem('combinedCardGrayLevel');
    return saved ? parseInt(saved, 10) : 25; // Default 25 matches original #f0f0f0
  });

  // Community header grey level (0-100)
  const [communityHeaderGrey, setCommunityHeaderGrey] = useState(() => {
    const saved = localStorage.getItem('communityHeaderGrey');
    return saved ? parseInt(saved, 10) : 60;
  });

  // Community badge background style ('grey' or 'white')
  const [communityBadgeBg, setCommunityBadgeBg] = useState(() => {
    return localStorage.getItem('communityBadgeBg') || 'grey';
  });

  // Dropdown state for community follow menu
  const [openCommunityFollowDropdown, setOpenCommunityFollowDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Dropdown state for course follow menu
  const [openCourseFollowDropdown, setOpenCourseFollowDropdown] = useState(null);
  const [courseDropdownPosition, setCourseDropdownPosition] = useState({ top: 0, left: 0 });

  // Collapsible header - uses shared hook
  const isHeaderCollapsed = useHeaderCollapse({ collapseThreshold: 100 });

  // Pills drag scrolling state
  const discoverPillsRef = useRef(null);
  const [isPillsDragging, setIsPillsDragging] = useState(false);
  const [pillsDragStartX, setPillsDragStartX] = useState(0);
  const [pillsDragScrollLeft, setPillsDragScrollLeft] = useState(0);

  // Welcome video popup - opens when user clicks thumbnail
  const [showWelcomeVideo, setShowWelcomeVideo] = useState(false);
  const closeWelcomeVideo = () => setShowWelcomeVideo(false);

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

  const closeInterestsModal = () => setShowInterestsModal(false);

  // Communities you may like modal (step 2 of signup)
  const [showCommunitiesModal, setShowCommunitiesModal] = useState(false);
  const [selectedCommunities, setSelectedCommunities] = useState([]);

  // signupCompleted and setSignupCompleted are now passed as props from MainContent
  // This allows the state to be shared with Community.js

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

  const closeCommunitiesModal = () => setShowCommunitiesModal(false);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // Pills drag scroll handlers (match Community.js behavior)
  const handlePillsMouseDown = (e) => {
    if (!discoverPillsRef.current) return;
    setIsPillsDragging(true);
    setPillsDragStartX(e.pageX - discoverPillsRef.current.offsetLeft);
    setPillsDragScrollLeft(discoverPillsRef.current.scrollLeft);
    discoverPillsRef.current.style.cursor = 'grabbing';
  };

  const handlePillsMouseMove = (e) => {
    if (!isPillsDragging || !discoverPillsRef.current) return;
    e.preventDefault();
    const x = e.pageX - discoverPillsRef.current.offsetLeft;
    const walk = (x - pillsDragStartX) * 1.5;
    discoverPillsRef.current.scrollLeft = pillsDragScrollLeft - walk;
  };

  const handlePillsMouseUp = () => {
    setIsPillsDragging(false);
    if (discoverPillsRef.current) {
      discoverPillsRef.current.style.cursor = 'grab';
    }
  };

  const handlePillsMouseLeave = () => {
    if (isPillsDragging) {
      setIsPillsDragging(false);
      if (discoverPillsRef.current) {
        discoverPillsRef.current.style.cursor = 'grab';
      }
    }
  };

  // Ref for scroll container
  const scrollContainerRef = useRef(null);

  // Clear selections when user changes (for demo purposes)
  useEffect(() => {
    setSelectedInterests([]);
    setSelectedCommunities([]);
  }, [currentUser?.id]);

  // Listen for discover listing format changes from Settings
  useEffect(() => {
    const handleFormatChange = (e) => {
      setDiscoverListingFormat(e.detail);
    };
    window.addEventListener('discoverListingFormatChanged', handleFormatChange);
    return () => window.removeEventListener('discoverListingFormatChanged', handleFormatChange);
  }, []);

  // Listen for compact text scale changes from Settings
  useEffect(() => {
    const handleScaleChange = (e) => {
      setCompactTextScale(e.detail);
    };
    window.addEventListener('compactTextScaleChanged', handleScaleChange);
    return () => window.removeEventListener('compactTextScaleChanged', handleScaleChange);
  }, []);

  // Listen for combined card gray level changes from Settings
  useEffect(() => {
    const handleGrayLevelChange = (e) => {
      setCombinedCardGrayLevel(e.detail);
    };
    window.addEventListener('combinedCardGrayLevelChanged', handleGrayLevelChange);
    return () => window.removeEventListener('combinedCardGrayLevelChanged', handleGrayLevelChange);
  }, []);

  // Listen for community header grey changes from Settings
  useEffect(() => {
    const handleGreyChange = (e) => {
      setCommunityHeaderGrey(e.detail);
    };
    window.addEventListener('communityHeaderGreyChanged', handleGreyChange);
    return () => window.removeEventListener('communityHeaderGreyChanged', handleGreyChange);
  }, []);

  // Listen for community badge bg changes from Settings
  useEffect(() => {
    const handleBadgeBgChange = (e) => {
      setCommunityBadgeBg(e.detail);
    };
    window.addEventListener('communityBadgeBgChanged', handleBadgeBgChange);
    return () => window.removeEventListener('communityBadgeBgChanged', handleBadgeBgChange);
  }, []);

  // Restore scroll position on mount - only if returning from a detail view
  // Use sessionStorage so it clears on new browser session
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('discoverScrollPosition');
    const isReturning = sessionStorage.getItem('discoverHasVisited');

    if (savedScrollPosition && isReturning && scrollContainerRef.current) {
      // Only restore scroll if user has visited Discover before in this session
      scrollContainerRef.current.scrollTop = parseInt(savedScrollPosition, 10);
    } else if (scrollContainerRef.current) {
      // First visit - ensure we start at the top
      scrollContainerRef.current.scrollTop = 0;
    }

    // Mark that user has visited Discover in this session
    sessionStorage.setItem('discoverHasVisited', 'true');
  }, []);

  // Click-away handler for community follow dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check both the wrapper AND the portal content (portal is rendered outside wrapper)
      if (openCommunityFollowDropdown &&
          !event.target.closest('.community-follow-dropdown-wrapper') &&
          !event.target.closest('.community-follow-dropdown-portal')) {
        setOpenCommunityFollowDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openCommunityFollowDropdown]);

  // Save scroll position before navigating away
  const saveScrollPosition = () => {
    if (scrollContainerRef.current) {
      sessionStorage.setItem('discoverScrollPosition', scrollContainerRef.current.scrollTop);
    }
  };

  // Save scroll position when component unmounts (user navigates away)
  useEffect(() => {
    return () => {
      // Cleanup: save scroll position before unmounting
      if (scrollContainerRef.current) {
        sessionStorage.setItem('discoverScrollPosition', scrollContainerRef.current.scrollTop);
      }
    };
  }, []);

  // Banner color from Profile settings
  const userBannerColor = localStorage.getItem('profileBannerColor') || 'blue';

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

  // Generate course abbreviation from title
  const getCourseAbbreviation = (title) => {
    if (!title) return '??';

    // Common abbreviation mappings
    const mappings = {
      'ai': 'AI',
      'machine learning': 'ML',
      'deep learning': 'DL',
      'data science': 'DS',
      'full-stack': 'FS',
      'full stack': 'FS',
      'devops': 'DO',
      'ci/cd': 'CI',
      'github': 'GH',
      'node.js': 'NJ',
      'nodejs': 'NJ',
      'python': 'PY',
      'robotics': 'RB',
      'medical': 'MD',
      'healthcare': 'HC',
      'automation': 'AU',
      'n8n': 'N8',
      'prompt': 'PM',
      'claude': 'CC',
      'computer vision': 'CV',
      'business intelligence': 'BI',
      'microservices': 'MS',
      'cloud': 'CL',
      'aws': 'AWS'
    };

    const lowerTitle = title.toLowerCase();

    // Check for known mappings first
    for (const [key, abbr] of Object.entries(mappings)) {
      if (lowerTitle.includes(key)) return abbr;
    }

    // Fallback: Take first letters of significant words
    const words = title.split(/[\s\-:]+/).filter(w =>
      w.length > 2 && !['the', 'and', 'for', 'with', 'to', 'of', 'in', 'a', 'an'].includes(w.toLowerCase())
    );

    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return title.substring(0, 2).toUpperCase();
  };

  // Single cyan gradient for all course badges (matching community header)
  const getCourseGradient = () => {
    return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
  };

  // Filter pill options - AI Subject categories
  const filterPills = [
    { id: 'All', label: 'All' },
    { id: 'AI Fundamentals', label: 'AI Fundamentals' },
    { id: 'Machine Learning', label: 'Machine Learning' },
    { id: 'Generative AI', label: 'Generative AI' },
    { id: 'Prompt Engineering', label: 'Prompt Engineering' },
    { id: 'Data Science', label: 'Data Science' },
    { id: 'Neural Networks', label: 'Neural Networks' },
    { id: 'AI Applications', label: 'AI Applications' }
  ];

  // Filter course based on active subject filter
  const filterCourse = (course) => {
    if (activeFilter === 'All') return true;

    // Check if course title or description contains the subject keywords
    const searchText = `${course.title || ''} ${course.description || ''} ${course.tags?.join(' ') || ''}`.toLowerCase();

    switch (activeFilter) {
      case 'AI Fundamentals':
        return searchText.includes('fundamental') || searchText.includes('introduction') ||
               searchText.includes('basics') || searchText.includes('beginner') ||
               searchText.includes('ai 101') || searchText.includes('getting started');
      case 'Machine Learning':
        return searchText.includes('machine learning') || searchText.includes('ml') ||
               searchText.includes('supervised') || searchText.includes('unsupervised') ||
               searchText.includes('classification') || searchText.includes('regression');
      case 'Generative AI':
        return searchText.includes('generative') || searchText.includes('gpt') ||
               searchText.includes('chatgpt') || searchText.includes('llm') ||
               searchText.includes('large language') || searchText.includes('diffusion') ||
               searchText.includes('midjourney') || searchText.includes('dalle');
      case 'Prompt Engineering':
        return searchText.includes('prompt') || searchText.includes('prompting') ||
               searchText.includes('chain of thought') || searchText.includes('few-shot');
      case 'Data Science':
        return searchText.includes('data science') || searchText.includes('analytics') ||
               searchText.includes('visualization') || searchText.includes('pandas') ||
               searchText.includes('statistics') || searchText.includes('data analysis');
      case 'Neural Networks':
        return searchText.includes('neural') || searchText.includes('deep learning') ||
               searchText.includes('cnn') || searchText.includes('rnn') ||
               searchText.includes('transformer') || searchText.includes('pytorch') ||
               searchText.includes('tensorflow');
      case 'AI Applications':
        return searchText.includes('application') || searchText.includes('project') ||
               searchText.includes('real-world') || searchText.includes('hands-on') ||
               searchText.includes('practical') || searchText.includes('build');
      default:
        return true;
    }
  };

  // Group courses by instructor and filter based on search and active filter
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      // When no search, show all communities with their courses (filtered)
      return indexedInstructors.map(instructor => {
        const fullData = getInstructorWithCourses(instructor.id);
        const courses = fullData?.courses || [];
        const filteredCourses = courses.filter(filterCourse);
        return {
          instructor: fullData || instructor,
          matchingCourses: filteredCourses.slice(0, 3), // Show first 3 filtered courses
          totalCourses: courses.length,
          filteredTotal: filteredCourses.length,
          matchedByName: false
        };
      }).filter(result => activeFilter === 'All' || result.filteredTotal > 0);
    }

    const query = searchQuery.toLowerCase();
    const results = [];

    indexedInstructors.forEach(instructor => {
      const fullData = getInstructorWithCourses(instructor.id);
      const allCourses = fullData?.courses || [];

      // Check if community name/bio matches
      const communityMatches =
        instructor.name?.toLowerCase().includes(query) ||
        instructor.bio?.toLowerCase().includes(query) ||
        instructor.title?.toLowerCase().includes(query);

      // Find matching courses (search + filter)
      const matchingCourses = allCourses.filter(course =>
        (course.title?.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query)) &&
        filterCourse(course)
      );

      // Include community if name matches OR has matching courses
      if (communityMatches || matchingCourses.length > 0) {
        results.push({
          instructor: fullData || instructor,
          matchingCourses: matchingCourses.length > 0 ? matchingCourses : [],
          totalCourses: allCourses.length,
          filteredTotal: matchingCourses.length,
          matchedByName: communityMatches && matchingCourses.length === 0
        });
      }
    });

    return results;
  }, [searchQuery, indexedInstructors, activeFilter]);

  // Highlight matching text
  const highlightMatch = (text, query) => {
    if (!query.trim() || !text) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} style={{
          background: 'rgba(99, 102, 241, 0.3)',
          color: isDarkMode ? '#a5b4fc' : '#6366f1',
          padding: '0 2px',
          borderRadius: 2
        }}>{part}</mark>
      ) : part
    );
  };

  // Render compact course card (combined community + course)
  const renderCompactCourseCard = (course, instructor, isFollowing, isPurchased) => {
    const handle = (instructor.communityName || instructor.name)?.toLowerCase().replace(/\s+/g, '').replace(/\./g, '');
    // Scale helper for text sizes
    const s = (size) => Math.round(size * compactTextScale);
    const iconSize = Math.round(40 * compactTextScale);
    const padding = Math.round(12 * compactTextScale);

    return (
      <div
        key={`compact-${course.id}`}
        style={{
          marginBottom: 12,
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: isDarkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.08)',
          background: isDarkMode ? '#16181c' : 'white',
          border: isDarkMode ? '1px solid #2f3336' : 'none'
        }}
      >
        {/* Community Header */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            saveScrollPosition();
            onViewCommunity && onViewCommunity(instructor);
          }}
          style={{
            background: isDarkMode
              ? 'linear-gradient(135deg, #1e3a4c 0%, #1a2634 100%)'
              : 'linear-gradient(135deg, #e8f4fc 0%, #f0f8ff 100%)',
            padding: `${padding}px 16px`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: s(12),
            borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #e1e8ed',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            border: '2px solid transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDarkMode
              ? 'linear-gradient(135deg, #1e4a5c 0%, #1a3040 100%)'
              : 'linear-gradient(135deg, #d0ebf7 0%, #e4f3fc 100%)';
            e.currentTarget.style.border = isDarkMode
              ? '2px solid #0ea5e9'
              : '2px solid #0284c7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isDarkMode
              ? 'linear-gradient(135deg, #1e3a4c 0%, #1a2634 100%)'
              : 'linear-gradient(135deg, #e8f4fc 0%, #f0f8ff 100%)';
            e.currentTarget.style.border = '2px solid transparent';
          }}
        >
          {/* Community Icon */}
          <div style={{
            width: iconSize,
            height: iconSize,
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 600,
            fontSize: s(14),
            border: '2px solid white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            flexShrink: 0
          }}>
            👥
          </div>

          {/* Community Info */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: s(6) }}>
            {/* Top Row: Name, Handle, Following */}
            <div style={{ display: 'flex', alignItems: 'center', gap: s(6), flexWrap: 'wrap' }}>
              <CommunityHoverCard
                community={{
                  communityName: instructor.communityName || `${instructor.name} Community`,
                  handle: `@${handle}`,
                  creatorName: instructor.name,
                  bio: instructor.bio,
                  followers: instructor.stats?.studentsTaught || 0,
                  coursesCount: instructor.courses?.length || 0,
                  id: instructor.id
                }}
                isFollowing={isFollowing}
                onFollow={() => handleFollowInstructor(instructor.id)}
                onViewCommunity={() => onViewCommunity && onViewCommunity(instructor)}
              >
                <span
                  style={{
                    fontWeight: 700,
                    color: (() => { const v = Math.round(255 - communityHeaderGrey * 2.55); return `rgb(${v}, ${v}, ${v})`; })(),
                    fontSize: s(15),
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                    padding: '2px 6px',
                    borderRadius: 4,
                    marginLeft: -6
                  }}
                  onMouseEnter={(e) => {
                    const hv = Math.round(255 - Math.min(100, communityHeaderGrey + 20) * 2.55);
                    e.currentTarget.style.color = `rgb(${hv}, ${hv}, ${hv})`;
                    e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(150, 150, 150, 0.15)' : 'rgba(150, 150, 150, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    const v = Math.round(255 - communityHeaderGrey * 2.55);
                    e.currentTarget.style.color = `rgb(${v}, ${v}, ${v})`;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {instructor.communityName || `${instructor.name} Community`}
                </span>
              </CommunityHoverCard>
              <span style={{ color: isDarkMode ? '#71767b' : '#374151', fontSize: s(14) }}>
                @{handle}
              </span>
              <span style={{ color: isDarkMode ? '#71767b' : '#374151' }}>·</span>
              {(() => {
                // Use ALL instructor courses, not just matchingCourses (which is limited/filtered)
                const allInstructorCourses = instructor.courses || [];
                const enrolledCourses = allInstructorCourses.filter(c => isCoursePurchased(c.id));
                const hasEnrolledCourses = enrolledCourses.length > 0;

                // If no enrolled courses, just show simple follow/unfollow link
                if (!hasEnrolledCourses) {
                  return (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollowInstructor(instructor.id);
                      }}
                      style={{
                        color: '#1d9bf0',
                        fontSize: s(15),
                        fontWeight: 600,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        transition: 'color 0.15s'
                      }}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </span>
                  );
                }

                // If has enrolled courses, show dropdown
                return (
                  <div
                    className="community-follow-dropdown-wrapper"
                    style={{ position: 'relative', display: 'inline-block', zIndex: 9999 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        const dropdownId = `compact-${instructor.id}-${course.id}`;
                        const isOpening = openCommunityFollowDropdown !== dropdownId;
                        if (isOpening) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const dropdownHeight = 250;
                          const viewportHeight = window.innerHeight;
                          const spaceBelow = viewportHeight - rect.bottom;
                          const spaceAbove = rect.top;
                          const positionAbove = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;

                          setDropdownPosition({
                            top: positionAbove ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
                            left: rect.left
                          });
                        }
                        setOpenCommunityFollowDropdown(
                          openCommunityFollowDropdown === dropdownId ? null : dropdownId
                        );
                      }}
                      style={{
                        color: '#1d9bf0',
                        fontSize: s(15),
                        fontWeight: 600,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        transition: 'color 0.15s'
                      }}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                      <span style={{ fontSize: s(10), marginLeft: 4 }}>▼</span>
                    </span>

                    {/* Dropdown menu - rendered via portal to escape overflow contexts */}
                    {openCommunityFollowDropdown === `compact-${instructor.id}-${course.id}` && ReactDOM.createPortal(
                      <div
                        className="community-follow-dropdown-portal"
                        style={{
                          position: 'fixed',
                          top: dropdownPosition.top,
                          left: dropdownPosition.left,
                          background: isDarkMode ? '#16181c' : '#fff',
                          border: isDarkMode ? '1px solid #2f3336' : '1px solid #e2e8f0',
                          borderRadius: 12,
                          boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.1)',
                          zIndex: 99999,
                          minWidth: 220,
                          padding: '4px 0'
                        }}>
                        {(() => {
                          const followedCoursesCount = enrolledCourses.filter(c => isCourseFollowed(c.id)).length;
                          const hasAnyFollowed = isFollowing || followedCoursesCount > 0;

                          return (
                            <>
                              {/* Community section label */}
                              <div style={{
                                padding: '6px 16px 2px',
                                fontSize: s(11),
                                fontWeight: 600,
                                color: isDarkMode ? '#71767b' : '#374151',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}>
                                Community
                              </div>
                              {/* Community name - click to toggle community follow */}
                              <div
                                style={{
                                  padding: '8px 16px',
                                  cursor: 'pointer',
                                  fontSize: s(14),
                                  color: isFollowing ? '#1d9bf0' : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                                  fontWeight: isFollowing ? 500 : 400,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFollowInstructor(instructor.id);
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#f8fafc'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                              >
                                <span style={{ width: 16 }}>{isFollowing && '✓'}</span>
                                <span>{instructor.communityName || instructor.name}</span>
                              </div>

                              {/* Courses section label */}
                              <div style={{
                                padding: '10px 16px 2px',
                                fontSize: s(11),
                                fontWeight: 600,
                                color: isDarkMode ? '#71767b' : '#374151',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                borderTop: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
                                marginTop: 4
                              }}>
                                Courses
                              </div>
                              {/* List of enrolled courses */}
                              {enrolledCourses.map(enrolledCourse => {
                                const isFollowed = isCourseFollowed(enrolledCourse.id);
                                return (
                                  <div
                                    key={enrolledCourse.id}
                                    style={{
                                      padding: '10px 16px',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 8,
                                      fontSize: s(14),
                                      color: isFollowed ? '#1d9bf0' : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                                      fontWeight: isFollowed ? 500 : 400
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleFollowCourse(enrolledCourse.id);
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#f8fafc'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                  >
                                    <span style={{ width: 16, flexShrink: 0 }}>{isFollowed && '✓'}</span>
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{enrolledCourse.title}</span>
                                  </div>
                                );
                              })}

                              {/* Unfollow all - only show if something is followed */}
                              {hasAnyFollowed && (
                                <>
                                  <div style={{ borderTop: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4', margin: '4px 0' }} />
                                  <div
                                    style={{
                                      padding: '10px 16px',
                                      cursor: 'pointer',
                                      fontSize: s(13),
                                      color: '#f4212e',
                                      fontWeight: 500
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Unfollow all enrolled courses
                                      enrolledCourses.forEach(enrolledCourse => {
                                        if (isCourseFollowed(enrolledCourse.id)) {
                                          handleFollowCourse(enrolledCourse.id);
                                        }
                                      });
                                      // Also unfollow the community
                                      if (isFollowing) {
                                        handleFollowInstructor(instructor.id);
                                      }
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#f8fafc'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                  >
                                    Unfollow all
                                  </div>
                                </>
                              )}
                            </>
                          );
                        })()}
                      </div>,
                      document.body
                    )}
                  </div>
                );
              })()}
            </div>
            {/* Creator Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: s(6),
              fontSize: s(13),
              color: isDarkMode ? '#71767b' : '#374151',
              flexWrap: 'wrap'
            }}>
              <span>Created by</span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  if (onViewCreatorProfile) {
                    onViewCreatorProfile(instructor);
                  }
                }}
                style={{ color: '#1d9bf0', fontWeight: 500, cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                {instructor.name}
              </span>
              <span style={{ color: isDarkMode ? '#71767b' : '#374151' }}>·</span>
              <span>👥 {(instructor.stats?.studentsTaught || 0).toLocaleString()} followers</span>
              <span style={{ color: isDarkMode ? '#71767b' : '#374151' }}>·</span>
              <span style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: s(200)
              }}>{instructor.title}</span>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            saveScrollPosition();
            onViewCourse && onViewCourse(course);
          }}
          style={{
            padding: `${padding}px 16px`,
            cursor: 'pointer',
            transition: 'background 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDarkMode ? '#1c1f23' : '#f8f9fa';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          {/* Title Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: s(4),
            gap: s(10)
          }}>
            <CourseHoverCard
              course={{
                ...course,
                instructorName: instructor.name
              }}
              isEnrolled={isPurchased}
              onEnroll={() => onViewCourse && onViewCourse(course)}
              onViewCourse={() => onViewCourse && onViewCourse(course)}
            >
              <span
                style={{
                  fontSize: s(17),
                  fontWeight: 600,
                  color: isDarkMode ? '#e7e9ea' : '#0f1419',
                  transition: 'color 0.15s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#1d9bf0'}
                onMouseLeave={(e) => e.currentTarget.style.color = isDarkMode ? '#e7e9ea' : '#0f1419'}
              >
                {course.title}
              </span>
            </CourseHoverCard>
            {isPurchased ? (
              <span style={{
                background: isDarkMode ? '#2f3336' : '#f7f9f9',
                border: isDarkMode ? '2px solid #374151' : '2px solid #cfd9de',
                color: isDarkMode ? '#e7e9ea' : '#0f1419',
                padding: `${s(8)}px ${s(16)}px`,
                borderRadius: s(20),
                fontSize: s(14),
                fontWeight: 500,
                whiteSpace: 'nowrap'
              }}>
                Enrolled
              </span>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  saveScrollPosition();
                  if (onViewCourse) {
                    onViewCourse(course);
                  }
                }}
                style={{
                  background: '#22c55e',
                  border: '2px solid #22c55e',
                  color: 'white',
                  padding: `${s(8)}px ${s(16)}px`,
                  borderRadius: s(20),
                  fontSize: s(14),
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#16a34a'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#22c55e'}
              >
                Enroll {course.price}
              </button>
            )}
          </div>

          {/* Description */}
          <p style={{
            color: isDarkMode ? '#8b98a5' : '#374151',
            fontSize: s(14),
            lineHeight: 1.3,
            marginBottom: s(6),
            margin: 0
          }}>
            {course.description}
          </p>

          {/* Meta Line */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: s(6),
            flexWrap: 'wrap',
            color: isDarkMode ? '#71767b' : '#71767b',
            fontSize: s(13)
          }}>
            <span style={{ color: isDarkMode ? '#e7e9ea' : '#1a1a1a', fontWeight: 500 }}>
              <span style={{ color: '#ffc107' }}>★</span> {course.rating || '4.7'} ({course.students || 142})
            </span>
            <span style={{ color: '#ccc' }}>·</span>
            <span>{course.level || 'Beginner'}</span>
            <span style={{ color: '#ccc' }}>·</span>
            <span>{course.sessions?.count || 2} sessions</span>
            <span style={{ color: '#ccc' }}>·</span>
            <span>{typeof course.duration === 'string' ? course.duration : (course.sessions?.duration || '3 hrs')}</span>
            <span style={{ color: '#ccc' }}>·</span>
            <span style={{ color: course.price === 'Free' ? '#00ba7c' : (isDarkMode ? '#e7e9ea' : '#1a1a1a'), fontWeight: 600 }}>
              {course.price}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="main-content">
      {/* Breadcrumb Navigation */}
      {breadcrumbItems && <Breadcrumb items={breadcrumbItems} onBack={onBack} isDarkMode={isDarkMode} />}
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
                fontSize: 'var(--fs-18)',
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
                fontSize: 'var(--fs-15)',
                color: isDarkMode ? '#71767b' : '#374151',
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
                        fontSize: 'var(--fs-14)',
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
                  color: selectedInterests.length >= 3 ? '#fff' : (isDarkMode ? '#71767b' : '#374151'),
                  fontSize: 'var(--fs-15)',
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
                fontSize: 'var(--fs-14)',
                color: isDarkMode ? '#71767b' : '#374151',
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
                  fontSize: 'var(--fs-14)',
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
                        fontSize: 'var(--fs-18)',
                        flexShrink: 0
                      }}>
                        {!community.avatar && community.name.charAt(0)}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 'var(--fs-15)',
                          fontWeight: 600,
                          color: isDarkMode ? '#e7e9ea' : '#0f1419'
                        }}>
                          {community.name}
                        </div>
                        <div style={{
                          fontSize: 'var(--fs-13)',
                          color: isDarkMode ? '#71767b' : '#374151',
                          marginBottom: 4
                        }}>
                          by {community.author}
                        </div>
                        <div style={{
                          fontSize: 'var(--fs-13)',
                          color: isDarkMode ? '#71767b' : '#374151',
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
                        border: `2px solid ${isSelected ? '#1d9bf0' : (isDarkMode ? '#374151' : '#cfd9de')}`,
                        background: isSelected ? '#1d9bf0' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2
                      }}>
                        {isSelected && (
                          <span style={{ color: '#fff', fontSize: 'var(--fs-14)', fontWeight: 700 }}>✓</span>
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
                  // Navigate to My Community menu (will show The Commons by default)
                  onMenuChange && onMenuChange('My Community');
                }}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: 9999,
                  border: 'none',
                  background: '#1d9bf0',
                  color: '#fff',
                  fontSize: 'var(--fs-15)',
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

      <div className="three-column-layout">
        <div className="center-column" ref={scrollContainerRef} style={{ maxWidth: 800, flex: '0 0 auto', width: '100%' }}>
          {/* Sticky Collapsible Header */}
          <div style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            padding: isHeaderCollapsed ? '8px 0' : '16px 0',
            borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb',
            background: isDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'saturate(180%) blur(20px)',
            WebkitBackdropFilter: 'saturate(180%) blur(20px)',
            transition: 'padding 0.3s ease-out'
          }}>
            {/* Search Bar - Above the card, always visible */}
            <div style={{ position: 'relative', marginBottom: isHeaderCollapsed ? 8 : 12, transition: 'margin 0.3s ease-out' }}>
              <FaSearch style={{
                position: 'absolute',
                left: isHeaderCollapsed ? 12 : 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: isDarkMode ? '#71717a' : '#6b7280',
                fontSize: isHeaderCollapsed ? 16 : 18,
                transition: 'all 0.3s ease-out'
              }} />
              <input
                type="text"
                placeholder="Search communities & courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: isHeaderCollapsed ? '10px 14px 10px 40px' : '14px 16px 14px 48px',
                  fontSize: isHeaderCollapsed ? 14 : 16,
                  border: isDarkMode ? '2px solid #27272a' : '2px solid #e5e7eb',
                  borderRadius: 0,
                  background: isDarkMode ? '#1a1a24' : '#f9fafb',
                  color: isDarkMode ? '#f5f5f7' : '#111827',
                  outline: 'none',
                  transition: 'all 0.3s ease-out'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDarkMode ? '#27272a' : '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Pills with scroll arrows - above the card */}
            <div style={{
              padding: isHeaderCollapsed ? '8px 0' : '0 0 12px 0',
              transition: 'padding 0.3s ease-out',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              {/* Left scroll arrow */}
              <button
                onClick={() => {
                  if (discoverPillsRef.current) {
                    discoverPillsRef.current.scrollBy({ left: -150, behavior: 'smooth' });
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#374151',
                  flexShrink: 0
                }}
              >
                <FaChevronLeft size={12} />
              </button>
              <div
                ref={discoverPillsRef}
                className="discover-pills-scroll"
                onMouseDown={handlePillsMouseDown}
                onMouseMove={handlePillsMouseMove}
                onMouseUp={handlePillsMouseUp}
                onMouseLeave={handlePillsMouseLeave}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isHeaderCollapsed ? 6 : 8,
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  paddingBottom: 4,
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch',
                  cursor: 'grab',
                  transition: 'all 0.3s ease-out',
                  userSelect: 'none'
                }}
              >
                <style>{`
                  .discover-pills-scroll::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                  {filterPills.map((pill) => {
                    const isActive = activeFilter === pill.id;
                    const isAllPill = pill.id === 'All';
                    return (
                      <button
                        key={pill.id}
                        className={`course-pill ${isActive ? 'course-pill-selected' : ''}`}
                        onClick={() => handleFilterChange(pill.id)}
                        style={{
                          padding: isHeaderCollapsed ? '6px 12px' : '8px 16px',
                          borderRadius: isHeaderCollapsed ? 16 : 20,
                          fontSize: isHeaderCollapsed ? 13 : 14,
                          fontWeight: 600,
                          border: isActive
                            ? '2px solid #1d9bf0'
                            : '2px solid #cfd9de',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          flexShrink: 0,
                          background: isActive
                            ? 'rgba(29, 155, 240, 0.1)'
                            : '#f7f9f9',
                          color: isActive ? '#1d9bf0' : '#0f1419',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = '#eef1f2';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = '#f7f9f9';
                          }
                        }}
                      >
                        {pill.label}
                      </button>
                    );
                  })}
              </div>
              {/* Right scroll arrow */}
              <button
                onClick={() => {
                  if (discoverPillsRef.current) {
                    discoverPillsRef.current.scrollBy({ left: 150, behavior: 'smooth' });
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#374151',
                  flexShrink: 0
                }}
              >
                <FaChevronRight size={12} />
              </button>
            </div>

          </div>

          {/* Welcome Post - Only for new users who haven't completed signup */}
          {currentUser?.isNewUser && !signupCompleted && (
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
                top: 0,
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
                <p style={{ fontSize: 17, color: isDarkMode ? '#71767b' : '#374151', margin: 0, fontWeight: 500 }}>
                  A peer-to-peer knowledge sharing community
                </p>
                <p style={{ fontSize: 'var(--fs-16)', color: isDarkMode ? '#e7e9ea' : '#0f1419', margin: '6px 0 0 0', lineHeight: 1.6 }}>
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
                    fontSize: 'var(--fs-15)',
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

          {/* Results */}
          <div style={{ padding: '0' }}>
            {searchResults.length === 0 ? (
              <div style={{
                padding: 48,
                textAlign: 'center',
                color: isDarkMode ? '#71717a' : '#6b7280'
              }}>
                No communities or courses found matching "{searchQuery}"
              </div>
            ) : (
              searchResults.map((result) => {
                const { instructor, matchingCourses, totalCourses, matchedByName } = result;
                const isFollowing = isCreatorFollowed(instructor.id);

                // Compact Listing Format - render each course as combined card
                if (discoverListingFormat === 'compact') {
                  return (
                    <React.Fragment key={`compact-group-${instructor.id}`}>
                      {matchingCourses.map((course) => {
                        const isPurchased = isCoursePurchased && isCoursePurchased(course.id);
                        return renderCompactCourseCard(course, instructor, isFollowing, isPurchased);
                      })}
                    </React.Fragment>
                  );
                }

                // Third Try Listing Format - card-based with gradient headers and timeline (compact)
                if (discoverListingFormat === 'thirdtry') {
                  const handle = (instructor.communityName || instructor.name)?.toLowerCase().replace(/\s+/g, '').replace(/\./g, '');

                  // Color gradients for course icons
                  const courseGradients = [
                    { bg: 'linear-gradient(135deg, #7dd3fc 0%, #38bdf8 100%)', color: '#1e40af' },
                    { bg: 'linear-gradient(135deg, #5eead4 0%, #2dd4bf 100%)', color: '#0f766e' },
                    { bg: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)', color: '#5b21b6' },
                    { bg: 'linear-gradient(135deg, #fda4af 0%, #fb7185 100%)', color: '#be123c' },
                    { bg: 'linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%)', color: '#b45309' }
                  ];

                  return (
                    <div
                      key={instructor.id}
                      style={{
                        background: isDarkMode ? '#1e293b' : '#ffffff',
                        borderRadius: 12,
                        border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                        boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
                        marginBottom: 12,
                        overflow: 'hidden',
                        transition: 'box-shadow 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isDarkMode) e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isDarkMode) e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)';
                      }}
                    >
                      {/* Community Header */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          saveScrollPosition();
                          onViewCommunity && onViewCommunity(instructor);
                        }}
                        style={{
                          background: isDarkMode
                            ? 'linear-gradient(135deg, #1e3a5f 0%, #1e293b 100%)'
                            : 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
                          padding: '10px 16px',
                          borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          border: '2px solid transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = isDarkMode
                            ? 'linear-gradient(135deg, #254a6f 0%, #2a3a4b 100%)'
                            : 'linear-gradient(135deg, #cce8f4 0%, #e0f0fa 100%)';
                          e.currentTarget.style.border = isDarkMode
                            ? '2px solid #0ea5e9'
                            : '2px solid #0284c7';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = isDarkMode
                            ? 'linear-gradient(135deg, #1e3a5f 0%, #1e293b 100%)'
                            : 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)';
                          e.currentTarget.style.border = '2px solid transparent';
                        }}
                      >
                        {/* Header Top Row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                          {/* Community Avatar */}
                          <div style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #7dd3fc 0%, #38bdf8 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            fontSize: 18
                          }}>
                            👥
                          </div>

                          {/* Community Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            {/* Name Row */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1, flexWrap: 'wrap' }}>
                              <CommunityHoverCard
                                community={{
                                  communityName: instructor.communityName || `${instructor.name} Community`,
                                  handle: `@${handle}`,
                                  creatorName: instructor.name,
                                  bio: instructor.bio,
                                  followers: instructor.stats?.studentsTaught || 0,
                                  coursesCount: instructor.courses?.length || 0,
                                  id: instructor.id
                                }}
                                isFollowing={isFollowing}
                                onFollow={() => handleFollowInstructor(instructor.id)}
                                onViewCommunity={() => onViewCommunity && onViewCommunity(instructor)}
                              >
                                <span
                                  style={{
                                    fontSize: 'var(--fs-16)',
                                    fontWeight: 700,
                                    color: (() => { const v = Math.round(255 - communityHeaderGrey * 2.55); return `rgb(${v}, ${v}, ${v})`; })(),
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    padding: '2px 8px',
                                    borderRadius: 4,
                                    marginLeft: -8
                                  }}
                                  onMouseEnter={(e) => {
                                    const hv = Math.round(255 - Math.min(100, communityHeaderGrey + 20) * 2.55);
                                    e.currentTarget.style.color = `rgb(${hv}, ${hv}, ${hv})`;
                                    e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(150, 150, 150, 0.2)' : 'rgba(150, 150, 150, 0.12)';
                                  }}
                                  onMouseLeave={(e) => {
                                    const v = Math.round(255 - communityHeaderGrey * 2.55);
                                    e.currentTarget.style.color = `rgb(${v}, ${v}, ${v})`;
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  {instructor.communityName || `${instructor.name} Community`}
                                </span>
                              </CommunityHoverCard>
                              <span style={{ fontSize: 'var(--fs-13)', color: isDarkMode ? '#64748b' : '#94a3b8' }}>
                                @{handle}
                              </span>
                              {(() => {
                                // Use ALL instructor courses, not just matchingCourses
                                const allInstructorCourses = instructor.courses || [];
                                const enrolledCourses = allInstructorCourses.filter(c => isCoursePurchased(c.id));
                                const hasEnrolledCourses = enrolledCourses.length > 0;

                                // If no enrolled courses, just show simple follow/unfollow link
                                if (!hasEnrolledCourses) {
                                  return (
                                    <span
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleFollowInstructor(instructor.id);
                                      }}
                                      style={{
                                        fontSize: 'var(--fs-13)',
                                        fontWeight: 600,
                                        color: '#0ea5e9',
                                        cursor: 'pointer',
                                        transition: 'color 0.2s'
                                      }}
                                      onMouseEnter={(e) => e.currentTarget.style.color = '#0284c7'}
                                      onMouseLeave={(e) => e.currentTarget.style.color = '#0ea5e9'}
                                    >
                                      {isFollowing ? 'Following' : 'Follow'}
                                    </span>
                                  );
                                }

                                // If has enrolled courses, show dropdown
                                return (
                                  <div
                                    className="community-follow-dropdown-wrapper"
                                    style={{ position: 'relative', display: 'inline-block', zIndex: 9999 }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <span
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const dropdownId = `thirdtry-${instructor.id}`;
                                        const isOpening = openCommunityFollowDropdown !== dropdownId;
                                        if (isOpening) {
                                          const rect = e.currentTarget.getBoundingClientRect();
                                          const dropdownHeight = 250;
                                          const viewportHeight = window.innerHeight;
                                          const spaceBelow = viewportHeight - rect.bottom;
                                          const spaceAbove = rect.top;
                                          const positionAbove = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;

                                          setDropdownPosition({
                                            top: positionAbove ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
                                            left: rect.left
                                          });
                                        }
                                        setOpenCommunityFollowDropdown(
                                          openCommunityFollowDropdown === dropdownId ? null : dropdownId
                                        );
                                      }}
                                      style={{
                                        fontSize: 'var(--fs-13)',
                                        fontWeight: 600,
                                        color: '#0ea5e9',
                                        cursor: 'pointer',
                                        transition: 'color 0.2s'
                                      }}
                                      onMouseEnter={(e) => e.currentTarget.style.color = '#0284c7'}
                                      onMouseLeave={(e) => e.currentTarget.style.color = '#0ea5e9'}
                                    >
                                      {isFollowing ? 'Following' : 'Follow'}
                                      <span style={{ fontSize: 10, marginLeft: 4 }}>▼</span>
                                    </span>

                                    {/* Dropdown menu - rendered via portal */}
                                    {openCommunityFollowDropdown === `thirdtry-${instructor.id}` && ReactDOM.createPortal(
                                      <div
                                        className="community-follow-dropdown-portal"
                                        style={{
                                          position: 'fixed',
                                          top: dropdownPosition.top,
                                          left: dropdownPosition.left,
                                          background: isDarkMode ? '#16181c' : '#fff',
                                          border: isDarkMode ? '1px solid #2f3336' : '1px solid #e2e8f0',
                                          borderRadius: 12,
                                          boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.1)',
                                          zIndex: 99999,
                                          minWidth: 220,
                                          padding: '4px 0'
                                        }}>
                                        {(() => {
                                          const followedCoursesCount = enrolledCourses.filter(c => isCourseFollowed(c.id)).length;
                                          const hasAnyFollowed = isFollowing || followedCoursesCount > 0;

                                          return (
                                            <>
                                              {/* Community section label */}
                                              <div style={{
                                                padding: '6px 16px 2px',
                                                fontSize: 11,
                                                fontWeight: 600,
                                                color: isDarkMode ? '#71767b' : '#374151',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                              }}>
                                                Community
                                              </div>

                                              {/* Community follow toggle */}
                                              <div
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleFollowInstructor(instructor.id);
                                                }}
                                                style={{
                                                  padding: '8px 16px',
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  justifyContent: 'space-between',
                                                  cursor: 'pointer',
                                                  transition: 'background 0.15s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#1c1f23' : '#f8f9fa'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                              >
                                                <span style={{
                                                  fontSize: 'var(--fs-14)',
                                                  color: isDarkMode ? '#e7e9ea' : '#0f1419',
                                                  fontWeight: 500
                                                }}>
                                                  {instructor.communityName || `${instructor.name} Community`}
                                                </span>
                                                <span style={{
                                                  fontSize: 'var(--fs-12)',
                                                  color: isFollowing ? '#00ba7c' : '#71767b',
                                                  fontWeight: 600
                                                }}>
                                                  {isFollowing ? '✓ Following' : 'Follow'}
                                                </span>
                                              </div>

                                              {/* Divider */}
                                              <div style={{
                                                height: 1,
                                                background: isDarkMode ? '#2f3336' : '#e2e8f0',
                                                margin: '4px 0'
                                              }} />

                                              {/* Courses section label */}
                                              <div style={{
                                                padding: '6px 16px 2px',
                                                fontSize: 11,
                                                fontWeight: 600,
                                                color: isDarkMode ? '#71767b' : '#374151',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                              }}>
                                                Enrolled Courses ({enrolledCourses.length})
                                              </div>

                                              {/* List of enrolled courses */}
                                              {enrolledCourses.map(enrolledCourse => {
                                                const courseFollowed = isCourseFollowed(enrolledCourse.id);
                                                return (
                                                  <div
                                                    key={enrolledCourse.id}
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleFollowCourse(enrolledCourse.id);
                                                    }}
                                                    style={{
                                                      padding: '8px 16px',
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      justifyContent: 'space-between',
                                                      cursor: 'pointer',
                                                      transition: 'background 0.15s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#1c1f23' : '#f8f9fa'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                  >
                                                    <span style={{
                                                      fontSize: 'var(--fs-14)',
                                                      color: isDarkMode ? '#e7e9ea' : '#0f1419',
                                                      overflow: 'hidden',
                                                      textOverflow: 'ellipsis',
                                                      whiteSpace: 'nowrap',
                                                      maxWidth: 150
                                                    }}>
                                                      {enrolledCourse.title}
                                                    </span>
                                                    <span style={{
                                                      fontSize: 'var(--fs-12)',
                                                      color: courseFollowed ? '#00ba7c' : '#71767b',
                                                      fontWeight: 600
                                                    }}>
                                                      {courseFollowed ? '✓ Following' : 'Follow'}
                                                    </span>
                                                  </div>
                                                );
                                              })}

                                              {/* Unfollow All option */}
                                              {hasAnyFollowed && (
                                                <>
                                                  <div style={{
                                                    height: 1,
                                                    background: isDarkMode ? '#2f3336' : '#e2e8f0',
                                                    margin: '4px 0'
                                                  }} />
                                                  <div
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      // Unfollow community
                                                      if (isFollowing) {
                                                        handleFollowInstructor(instructor.id);
                                                      }
                                                      // Unfollow all enrolled courses
                                                      enrolledCourses.forEach(c => {
                                                        if (isCourseFollowed(c.id)) {
                                                          handleFollowCourse(c.id);
                                                        }
                                                      });
                                                      setOpenCommunityFollowDropdown(null);
                                                    }}
                                                    style={{
                                                      padding: '8px 16px',
                                                      fontSize: 'var(--fs-14)',
                                                      color: '#f4212e',
                                                      fontWeight: 500,
                                                      cursor: 'pointer',
                                                      transition: 'background 0.15s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#1c1f23' : '#f8f9fa'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                  >
                                                    Unfollow All
                                                  </div>
                                                </>
                                              )}
                                            </>
                                          );
                                        })()}
                                      </div>,
                                      document.body
                                    )}
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Meta Row */}
                            <div style={{
                              fontSize: 'var(--fs-13)',
                              color: isDarkMode ? '#94a3b8' : '#64748b',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              flexWrap: 'wrap'
                            }}>
                              <span>Created by{' '}
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onViewCreatorProfile && onViewCreatorProfile(instructor);
                                  }}
                                  style={{ color: '#0ea5e9', cursor: 'pointer' }}
                                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                                >
                                  {instructor.name}
                                </span>
                              </span>
                              <span style={{
                                width: 3,
                                height: 3,
                                borderRadius: '50%',
                                background: isDarkMode ? '#64748b' : '#94a3b8'
                              }} />
                              <span>👥 {(instructor.stats?.studentsTaught || 0).toLocaleString()} followers</span>
                              <span style={{
                                width: 3,
                                height: 3,
                                borderRadius: '50%',
                                background: isDarkMode ? '#64748b' : '#94a3b8'
                              }} />
                              <span style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: 180
                              }}>{instructor.title}</span>
                            </div>
                          </div>
                        </div>

                        {/* Community Description - 2 lines max */}
                        <div style={{
                          fontSize: 'var(--fs-14)',
                          color: isDarkMode ? '#94a3b8' : '#64748b',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {instructor.bio || `${instructor.name} is an expert educator sharing knowledge through engaging courses. Join the community to learn from industry professionals and connect with fellow learners.`}
                        </div>
                      </div>

                      {/* Course List with Timeline */}
                      <div style={{ padding: '2px 0 6px', position: 'relative' }}>
                        {/* Timeline Line */}
                        {matchingCourses.length > 1 && (
                          <div style={{
                            position: 'absolute',
                            left: 26,
                            top: 18,
                            bottom: 20,
                            width: 2,
                            background: isDarkMode ? '#334155' : '#e2e8f0'
                          }} />
                        )}

                        {matchingCourses.map((course, index) => {
                          const isPurchased = isCoursePurchased && isCoursePurchased(course.id);
                          const gradient = courseGradients[index % courseGradients.length];
                          const abbrev = (course.title || '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

                          return (
                            <div
                              key={course.id}
                              style={{ position: 'relative', paddingLeft: 4 }}
                            >
                              {/* Timeline Dot */}
                              <div style={{
                                position: 'absolute',
                                left: 21,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: isDarkMode ? '#475569' : '#cbd5e1',
                                border: '2px solid ' + (isDarkMode ? '#1e293b' : 'white'),
                                zIndex: 1
                              }} />

                              {/* Course Card */}
                              <div
                                onClick={() => {
                                  saveScrollPosition();
                                  onViewCourse && onViewCourse(course);
                                }}
                                style={{
                                  padding: '10px 12px',
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: 10,
                                  transition: 'background 0.15s ease, border-color 0.15s ease',
                                  cursor: 'pointer',
                                  background: isDarkMode ? '#1e293b' : '#ffffff',
                                  borderRadius: 8,
                                  margin: '4px 10px',
                                  border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = isDarkMode ? '#3b4a5a' : '#f1f5f9';
                                  e.currentTarget.style.borderColor = isDarkMode ? '#64748b' : '#94a3b8';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = isDarkMode ? '#1e293b' : '#ffffff';
                                  e.currentTarget.style.borderColor = isDarkMode ? '#334155' : '#e2e8f0';
                                }}
                              >
                                {/* Course Icon */}
                                <div style={{
                                  width: 42,
                                  height: 42,
                                  borderRadius: 10,
                                  background: gradient.bg,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  fontSize: 'var(--fs-13)',
                                  fontWeight: 700,
                                  color: gradient.color
                                }}>
                                  {abbrev}
                                </div>

                                {/* Course Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  {/* Course Title */}
                                  <CourseHoverCard
                                    course={{
                                      ...course,
                                      instructorName: instructor.name
                                    }}
                                    isEnrolled={isPurchased}
                                    onEnroll={() => onViewCourse && onViewCourse(course)}
                                    onViewCourse={() => onViewCourse && onViewCourse(course)}
                                    gradient={gradient.bg}
                                  >
                                    <div
                                      style={{
                                        fontSize: 'var(--fs-16)',
                                        fontWeight: 600,
                                        color: isDarkMode ? '#f1f5f9' : '#1e293b',
                                        marginBottom: 2,
                                        lineHeight: 1.25,
                                        cursor: 'pointer',
                                        transition: 'color 0.2s'
                                      }}
                                      onMouseEnter={(e) => e.currentTarget.style.color = '#1d9bf0'}
                                      onMouseLeave={(e) => e.currentTarget.style.color = isDarkMode ? '#f1f5f9' : '#1e293b'}
                                    >
                                      {course.title}
                                    </div>
                                  </CourseHoverCard>

                                  {/* Course Description - 2 lines */}
                                  <div style={{
                                    fontSize: 'var(--fs-14)',
                                    color: isDarkMode ? '#94a3b8' : '#64748b',
                                    marginBottom: 3,
                                    lineHeight: 1.35,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                  }}>
                                    {course.description || `Learn essential skills and techniques in this comprehensive course. Master practical applications through hands-on projects and expert guidance.`}
                                  </div>

                                  {/* Course Meta */}
                                  <div style={{
                                    fontSize: 'var(--fs-13)',
                                    color: isDarkMode ? '#64748b' : '#94a3b8',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    flexWrap: 'wrap'
                                  }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                      <span style={{ color: '#fbbf24' }}>★</span> {course.rating || '4.7'}
                                    </span>
                                    <span>{(course.students || 980).toLocaleString()} students</span>
                                    <span>{typeof course.duration === 'string' ? course.duration : '6 weeks'}</span>
                                  </div>
                                </div>

                                {/* Enroll Button */}
                                {isPurchased ? (
                                  <span style={{
                                    background: isDarkMode ? '#334155' : '#f1f5f9',
                                    border: isDarkMode ? '2px solid #475569' : '2px solid #e2e8f0',
                                    color: isDarkMode ? '#f1f5f9' : '#1e293b',
                                    padding: '7px 14px',
                                    borderRadius: 16,
                                    fontSize: 'var(--fs-13)',
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                    alignSelf: 'center'
                                  }}>
                                    Enrolled
                                  </span>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onViewCourse && onViewCourse(course);
                                    }}
                                    style={{
                                      background: '#22c55e',
                                      color: 'white',
                                      fontSize: 'var(--fs-13)',
                                      fontWeight: 600,
                                      padding: '7px 14px',
                                      borderRadius: 16,
                                      border: 'none',
                                      whiteSpace: 'nowrap',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease',
                                      flexShrink: 0,
                                      alignSelf: 'center'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background = '#16a34a';
                                      e.currentTarget.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background = '#22c55e';
                                      e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                  >
                                    Enroll {course.price}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {/* View All Link */}
                        {totalCourses > matchingCourses.length && (
                          <div style={{ padding: '4px 12px 8px', textAlign: 'center' }}>
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                saveScrollPosition();
                                onViewCommunity && onViewCommunity(instructor);
                              }}
                              style={{
                                fontSize: 'var(--fs-14)',
                                fontWeight: 600,
                                color: '#0ea5e9',
                                cursor: 'pointer',
                                transition: 'color 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#0284c7'}
                              onMouseLeave={(e) => e.currentTarget.style.color = '#0ea5e9'}
                            >
                              View all {totalCourses} courses →
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                // Combined Card Format - Course info LEFT, Glassmorphism community badge RIGHT
                if (discoverListingFormat === 'combined') {
                  const handle = (instructor.communityName || instructor.name)?.toLowerCase().replace(/\s+/g, '').replace(/\./g, '');

                  return (
                    <React.Fragment key={`combined-group-${instructor.id}`}>
                      {matchingCourses.map((course, courseIndex) => {
                        const isPurchased = isCoursePurchased && isCoursePurchased(course.id);
                        const courseGradients = [
                          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                          'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                          'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
                        ];
                        const courseGradient = courseGradients[courseIndex % courseGradients.length];
                        const initials = course.title?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'CC';

                        return (
                          <div
                            key={`combined-${course.id}`}
                            style={{
                              borderRadius: 14,
                              overflow: 'hidden',
                              background: isDarkMode ? '#16181c' : '#fff',
                              border: isDarkMode ? '1px solid #2f3336' : 'none',
                              boxShadow: isDarkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.08)',
                              marginBottom: 14,
                              display: 'flex',
                              transition: 'box-shadow 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              if (!isDarkMode) e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
                            }}
                            onMouseLeave={(e) => {
                              if (!isDarkMode) e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                            }}
                          >
                            {/* Course Content - LEFT */}
                            {(() => {
                              // Calculate gray colors from setting (0-100)
                              const grayValue = 255 - Math.round(combinedCardGrayLevel * 0.6);
                              const hoverGrayValue = Math.max(0, grayValue - 15);
                              const bgColor = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
                              const hoverColor = `rgb(${hoverGrayValue}, ${hoverGrayValue}, ${hoverGrayValue})`;
                              return (
                            <div
                              onClick={() => {
                                saveScrollPosition();
                                onViewCourse && onViewCourse(course, instructor);
                              }}
                              style={{
                                flex: 1,
                                padding: '16px 18px',
                                display: 'flex',
                                gap: 14,
                                cursor: 'pointer',
                                transition: 'background 0.15s ease',
                                background: isDarkMode ? '#16181c' : bgColor
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.03)' : hoverColor;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = isDarkMode ? '#16181c' : bgColor;
                              }}
                            >
                              {/* Course Icon */}
                              <div style={{
                                width: 48,
                                height: 48,
                                borderRadius: 12,
                                background: courseGradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: 16,
                                color: 'white',
                                flexShrink: 0
                              }}>
                                {initials}
                              </div>

                              {/* Course Info */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <CourseHoverCard
                                  course={{
                                    ...course,
                                    instructorName: instructor.name,
                                    instructorTitle: instructor.title
                                  }}
                                  onViewCourse={() => {
                                    saveScrollPosition();
                                    onViewCourse && onViewCourse(course, instructor);
                                  }}
                                  onEnroll={() => handleEnrollClick(course, instructor)}
                                >
                                  <div
                                    style={{
                                      fontSize: 'var(--fs-16)',
                                      fontWeight: 600,
                                      color: isDarkMode ? '#e7e9ea' : '#1a1a1a',
                                      marginBottom: 6,
                                      transition: 'color 0.15s',
                                      cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#1d9bf0'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = isDarkMode ? '#e7e9ea' : '#1a1a1a'}
                                  >
                                    {course.title}
                                  </div>
                                </CourseHoverCard>

                                <p style={{
                                  fontSize: 'var(--fs-14)',
                                  color: isDarkMode ? '#8b98a5' : '#536471',
                                  lineHeight: 1.45,
                                  marginBottom: 10,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  margin: '0 0 10px 0'
                                }}>
                                  {course.description}
                                </p>

                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 10,
                                  fontSize: 'var(--fs-13)',
                                  color: isDarkMode ? '#71767b' : '#71767b',
                                  flexWrap: 'wrap'
                                }}>
                                  <span><span style={{ color: '#ffc107' }}>★</span> {course.rating?.toFixed(1) || '4.5'} ({course.reviews || 0})</span>
                                  <span>{course.level || 'Beginner'}</span>
                                  <span>{course.sessions?.length || 0} sessions</span>
                                  <span>{course.duration || '3 hrs'}</span>
                                  <span style={{
                                    color: course.price === 0 || course.price === 'Free' ? '#00ba7c' : (isDarkMode ? '#e7e9ea' : '#1a1a1a'),
                                    fontWeight: 600
                                  }}>
                                    {course.price === 0 || course.price === 'Free' ? 'Free' : `$${course.price}`}
                                  </span>
                                </div>
                              </div>

                              {/* Enroll Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEnrollClick(course, instructor);
                                }}
                                style={{
                                  background: isPurchased ? 'transparent' : '#22c55e',
                                  color: isPurchased ? '#22c55e' : 'white',
                                  border: isPurchased ? '2px solid #22c55e' : 'none',
                                  padding: '9px 18px',
                                  borderRadius: 20,
                                  fontSize: 'var(--fs-14)',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap',
                                  transition: 'all 0.2s',
                                  flexShrink: 0,
                                  alignSelf: 'flex-start',
                                  marginTop: 2
                                }}
                                onMouseEnter={(e) => {
                                  if (!isPurchased) e.currentTarget.style.background = '#16a34a';
                                }}
                                onMouseLeave={(e) => {
                                  if (!isPurchased) e.currentTarget.style.background = '#22c55e';
                                }}
                              >
                                {isPurchased ? 'Enrolled' : (course.price === 0 || course.price === 'Free' ? 'Enroll' : `$${course.price}`)}
                              </button>
                            </div>
                              );
                            })()}

                            {/* Community Badge - RIGHT - Blue Glassmorphism */}
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                saveScrollPosition();
                                onViewCommunity && onViewCommunity(instructor);
                              }}
                              style={{
                                width: 180,
                                flexShrink: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                padding: '16px 14px',
                                cursor: 'pointer',
                                background: communityBadgeBg === 'white'
                                  ? (isDarkMode ? '#1e293b' : '#ffffff')
                                  : (() => {
                                      const v = Math.max(30, Math.round(communityHeaderGrey * 1.8));
                                      return `linear-gradient(135deg, rgb(${v}, ${v}, ${v + 5}) 0%, rgb(${v + 30}, ${v + 30}, ${v + 35}) 100%)`;
                                    })(),
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'filter 0.15s',
                                borderLeft: communityBadgeBg === 'white' ? '1px solid #e5e7eb' : 'none'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.filter = communityBadgeBg === 'white' ? 'brightness(0.97)' : 'brightness(1.1)'}
                              onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                            >
                              {/* Geometric shapes - 3B Pattern */}
                              <div style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                width: 50,
                                height: 50,
                                border: communityBadgeBg === 'white' ? '2px solid rgba(0,0,0,0.06)' : '2px solid rgba(255,255,255,0.15)',
                                borderRadius: 10,
                                transform: 'rotate(15deg)'
                              }} />
                              <div style={{
                                position: 'absolute',
                                bottom: 15,
                                left: -10,
                                width: 60,
                                height: 60,
                                border: communityBadgeBg === 'white' ? '2px solid rgba(0,0,0,0.04)' : '2px solid rgba(255,255,255,0.1)',
                                borderRadius: '50%'
                              }} />
                              <div style={{
                                position: 'absolute',
                                top: '50%',
                                right: -15,
                                width: 30,
                                height: 30,
                                background: communityBadgeBg === 'white' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.08)',
                                transform: 'rotate(45deg)'
                              }} />

                              {/* Community Icon */}
                              <div style={{
                                width: 44,
                                height: 44,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 18,
                                background: communityBadgeBg === 'white' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.2)',
                                marginBottom: 10,
                                position: 'relative',
                                zIndex: 1,
                                fontWeight: 600,
                                color: communityBadgeBg === 'white' ? '#1a1a1a' : 'white'
                              }}>
                                {(instructor.communityName || instructor.name)?.slice(0, 2).toUpperCase()}
                              </div>

                              <CommunityHoverCard
                                community={{
                                  communityName: instructor.communityName || `${instructor.name} Community`,
                                  handle: `@${handle}`,
                                  creatorName: instructor.name,
                                  bio: instructor.bio,
                                  followers: instructor.stats?.studentsTaught || 0,
                                  coursesCount: instructor.courses?.length || 0,
                                  id: instructor.id
                                }}
                                isFollowing={isFollowing}
                                onFollow={() => handleFollowInstructor(instructor.id)}
                                onViewCommunity={() => onViewCommunity && onViewCommunity(instructor)}
                              >
                                <div style={{
                                  fontSize: 'var(--fs-14)',
                                  fontWeight: 600,
                                  color: communityBadgeBg === 'white' ? '#1a1a1a' : '#fff',
                                  marginBottom: 3,
                                  position: 'relative',
                                  zIndex: 1,
                                  cursor: 'pointer'
                                }}>
                                  {instructor.communityName || `${instructor.name}`}
                                </div>
                              </CommunityHoverCard>

                              <div style={{
                                fontSize: 'var(--fs-12)',
                                color: communityBadgeBg === 'white' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.75)',
                                marginBottom: 4,
                                position: 'relative',
                                zIndex: 1
                              }}>
                                {instructor.stats?.studentsTaught?.toLocaleString() || 0} followers
                              </div>

                              <UserHoverCard
                                user={{
                                  id: instructor.id,
                                  name: instructor.name,
                                  handle: `@${(instructor.name || '').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
                                  avatar: instructor.avatar,
                                  bio: instructor.bio,
                                  stats: instructor.stats
                                }}
                                onViewProfile={() => {
                                  saveScrollPosition();
                                  onViewCreatorProfile && onViewCreatorProfile(instructor);
                                }}
                                isFollowing={isCreatorFollowed ? isCreatorFollowed(instructor.id) : false}
                                onFollow={() => handleFollowInstructor && handleFollowInstructor(instructor.id)}
                              >
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    saveScrollPosition();
                                    onViewCreatorProfile && onViewCreatorProfile(instructor);
                                  }}
                                  style={{
                                    fontSize: 'var(--fs-11)',
                                    color: communityBadgeBg === 'white' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.85)',
                                    marginBottom: 6,
                                    position: 'relative',
                                    zIndex: 1,
                                    cursor: 'pointer'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.querySelector('span').style.textDecoration = 'underline'}
                                  onMouseLeave={(e) => e.currentTarget.querySelector('span').style.textDecoration = 'none'}
                                >
                                  Created by <span style={{ fontWeight: 600 }}>{instructor.name}</span>
                                </div>
                              </UserHoverCard>
                            </div>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                }

                // Standard Listing Format - existing layout
                return (
                  <div
                    key={instructor.id}
                    style={{
                      marginBottom: 16,
                      background: isDarkMode ? '#16181c' : 'white',
                      borderRadius: 16,
                      boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.08)',
                      border: isDarkMode ? '1px solid #2f3336' : 'none',
                      transition: 'box-shadow 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = isDarkMode ? 'none' : '0 4px 12px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.08)';
                    }}
                  >
                    {/* Community Header - Light Cyan Gradient (X.com Style with Connector Lines) */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        saveScrollPosition();
                        onViewCommunity && onViewCommunity(instructor);
                      }}
                      style={{
                        background: isDarkMode
                          ? 'linear-gradient(135deg, #1a2332 0%, #1e293b 100%)'
                          : 'linear-gradient(135deg, #e8f4f8 0%, #d0e8f0 100%)',
                        padding: 20,
                        borderRadius: 16,
                        marginBottom: 4,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        border: '2px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isDarkMode
                          ? 'linear-gradient(135deg, #253342 0%, #2a3a4b 100%)'
                          : 'linear-gradient(135deg, #d8ecf2 0%, #c4e0ea 100%)';
                        e.currentTarget.style.border = isDarkMode
                          ? '2px solid #0ea5e9'
                          : '2px solid #0284c7';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isDarkMode
                          ? 'linear-gradient(135deg, #1a2332 0%, #1e293b 100%)'
                          : 'linear-gradient(135deg, #e8f4f8 0%, #d0e8f0 100%)';
                        e.currentTarget.style.border = '2px solid transparent';
                      }}
                    >
                      {/* Top Row: Avatar + Info + Button */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        marginBottom: 12
                      }}>
                        {/* Community Circle Avatar - Teal/Cyan Gradient */}
                        <div style={{
                          width: 56,
                          height: 56,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                          border: '3px solid rgba(255,255,255,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 26,
                          flexShrink: 0
                        }}>
                          👥
                        </div>

                        {/* Community Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {/* Name Row */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 4
                          }}>
                            <CommunityHoverCard
                              community={{
                                communityName: instructor.communityName || `${instructor.name} Community`,
                                handle: `@${(instructor.communityName || instructor.name)?.toLowerCase().replace(/\s+/g, '').replace(/\./g, '')}`,
                                creatorName: instructor.name,
                                bio: instructor.bio,
                                followers: instructor.stats?.studentsTaught || 0,
                                coursesCount: instructor.courses?.length || 0,
                                id: instructor.id
                              }}
                              isFollowing={isFollowing}
                              onFollow={() => handleFollowInstructor(instructor.id)}
                              onViewCommunity={() => onViewCommunity && onViewCommunity(instructor)}
                            >
                              <span
                                style={{
                                  fontSize: 'var(--fs-15)',
                                  fontWeight: 700,
                                  color: (() => { const v = Math.round(255 - communityHeaderGrey * 2.55); return `rgb(${v}, ${v}, ${v})`; })(),
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                  padding: '2px 6px',
                                  borderRadius: 4,
                                  marginLeft: -6
                                }}
                                onMouseEnter={(e) => {
                                  const hv = Math.round(255 - Math.min(100, communityHeaderGrey + 20) * 2.55);
                                  e.currentTarget.style.color = `rgb(${hv}, ${hv}, ${hv})`;
                                  e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(150, 150, 150, 0.15)' : 'rgba(150, 150, 150, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                  const v = Math.round(255 - communityHeaderGrey * 2.55);
                                  e.currentTarget.style.color = `rgb(${v}, ${v}, ${v})`;
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                {highlightMatch(instructor.communityName || `${instructor.name} Community`, searchQuery)}
                              </span>
                            </CommunityHoverCard>
                            <span style={{
                              fontSize: 'var(--fs-15)',
                              color: isDarkMode ? '#71767b' : '#374151'
                            }}>
                              @{(instructor.communityName || instructor.name)?.toLowerCase().replace(/\s+/g, '').replace(/\./g, '')}
                            </span>
                            <span style={{ color: isDarkMode ? '#71767b' : '#374151' }}>·</span>
                            {(() => {
                              // Use ALL instructor courses, not just matchingCourses (which is limited/filtered)
                              const allInstructorCourses = instructor.courses || [];
                              const enrolledCourses = allInstructorCourses.filter(course => isCoursePurchased(course.id));
                              const hasEnrolledCourses = enrolledCourses.length > 0;
                              console.log('DEBUG dropdown:', instructor.name, 'allCourses:', allInstructorCourses.length, 'enrolled:', enrolledCourses.map(c => c.title));

                              // If no enrolled courses, just show simple follow/unfollow link
                              if (!hasEnrolledCourses) {
                                return (
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleFollowInstructor(instructor.id);
                                    }}
                                    style={{
                                      color: '#1d9bf0',
                                      fontSize: 'var(--fs-15)',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      textDecoration: 'underline',
                                      transition: 'color 0.15s'
                                    }}
                                  >
                                    {isFollowing ? 'Following' : 'Follow'}
                                  </span>
                                );
                              }

                              // If has enrolled courses, show dropdown
                              return (
                                <div
                                  className="community-follow-dropdown-wrapper"
                                  style={{ position: 'relative', display: 'inline-block', zIndex: 9999 }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const isOpening = openCommunityFollowDropdown !== `discover-${instructor.id}`;
                                      if (isOpening) {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const dropdownHeight = 250; // Approximate height
                                        const viewportHeight = window.innerHeight;
                                        const spaceBelow = viewportHeight - rect.bottom;
                                        const spaceAbove = rect.top;

                                        // Position above if not enough space below, and there's space above
                                        const positionAbove = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;

                                        setDropdownPosition({
                                          top: positionAbove ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
                                          left: rect.left
                                        });
                                      }
                                      setOpenCommunityFollowDropdown(
                                        openCommunityFollowDropdown === `discover-${instructor.id}`
                                          ? null
                                          : `discover-${instructor.id}`
                                      );
                                    }}
                                    style={{
                                      color: '#1d9bf0',
                                      fontSize: 'var(--fs-15)',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      textDecoration: 'underline',
                                      transition: 'color 0.15s'
                                    }}
                                  >
                                    {isFollowing ? 'Following' : 'Follow'}
                                    <span style={{ fontSize: 10, marginLeft: 4 }}>▼</span>
                                  </span>

                                  {/* Dropdown menu - rendered via portal to escape overflow contexts */}
                                  {openCommunityFollowDropdown === `discover-${instructor.id}` && ReactDOM.createPortal(
                                    <div
                                      className="community-follow-dropdown-portal"
                                      style={{
                                        position: 'fixed',
                                        top: dropdownPosition.top,
                                        left: dropdownPosition.left,
                                        background: isDarkMode ? '#16181c' : '#fff',
                                        border: isDarkMode ? '1px solid #2f3336' : '1px solid #e2e8f0',
                                        borderRadius: 12,
                                        boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.1)',
                                        zIndex: 99999,
                                        minWidth: 220,
                                        padding: '4px 0'
                                      }}>
                                      {(() => {
                                        const followedCoursesCount = enrolledCourses.filter(c => isCourseFollowed(c.id)).length;
                                        const hasAnyFollowed = isFollowing || followedCoursesCount > 0;

                                        return (
                                          <>
                                            {/* Community section label */}
                                            <div style={{
                                              padding: '6px 16px 2px',
                                              fontSize: 11,
                                              fontWeight: 600,
                                              color: isDarkMode ? '#71767b' : '#374151',
                                              textTransform: 'uppercase',
                                              letterSpacing: '0.5px'
                                            }}>
                                              Community
                                            </div>
                                            {/* Community name - click to toggle community follow */}
                                            <div
                                              style={{
                                                padding: '8px 16px',
                                                cursor: 'pointer',
                                                fontSize: 'var(--fs-14)',
                                                color: isFollowing ? '#1d9bf0' : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                                                fontWeight: isFollowing ? 500 : 400,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 8
                                              }}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleFollowInstructor(instructor.id);
                                              }}
                                              onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#f8fafc'}
                                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                            >
                                              <span style={{ width: 16 }}>{isFollowing && '✓'}</span>
                                              <span>{instructor.communityName || instructor.name}</span>
                                            </div>

                                            {/* Courses section label */}
                                            <div style={{
                                              padding: '10px 16px 2px',
                                              fontSize: 11,
                                              fontWeight: 600,
                                              color: isDarkMode ? '#71767b' : '#374151',
                                              textTransform: 'uppercase',
                                              letterSpacing: '0.5px',
                                              borderTop: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
                                              marginTop: 4
                                            }}>
                                              Courses
                                            </div>
                                            {/* List of enrolled courses */}
                                            {enrolledCourses.map(course => {
                                              const isFollowed = isCourseFollowed(course.id);
                                              return (
                                                <div
                                                  key={course.id}
                                                  style={{
                                                    padding: '10px 16px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 8,
                                                    fontSize: 'var(--fs-14)',
                                                    color: isFollowed ? '#1d9bf0' : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                                                    fontWeight: isFollowed ? 500 : 400
                                                  }}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleFollowCourse(course.id);
                                                  }}
                                                  onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#f8fafc'}
                                                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                >
                                                  <span style={{ width: 16, flexShrink: 0 }}>{isFollowed && '✓'}</span>
                                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</span>
                                                </div>
                                              );
                                            })}

                                            {/* Unfollow all - only show if something is followed */}
                                            {hasAnyFollowed && (
                                              <>
                                                <div style={{ borderTop: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4', margin: '4px 0' }} />
                                                <div
                                                  style={{
                                                    padding: '10px 16px',
                                                    cursor: 'pointer',
                                                    fontSize: 'var(--fs-13)',
                                                    color: '#f4212e',
                                                    fontWeight: 500
                                                  }}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Unfollow all enrolled courses
                                                    enrolledCourses.forEach(course => {
                                                      if (isCourseFollowed(course.id)) {
                                                        handleFollowCourse(course.id);
                                                      }
                                                    });
                                                    // Also unfollow the community
                                                    if (isFollowing) {
                                                      handleFollowInstructor(instructor.id);
                                                    }
                                                  }}
                                                  onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#f8fafc'}
                                                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                >
                                                  Unfollow all
                                                </div>
                                              </>
                                            )}
                                          </>
                                        );
                                      })()}
                                    </div>,
                                    document.body
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                          {/* Creator + Meta Row (combined) */}
                          <div style={{
                            fontSize: 'var(--fs-13)',
                            color: isDarkMode ? '#71767b' : '#374151',
                            marginTop: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            flexWrap: 'wrap'
                          }}>
                            <span>Created by{' '}
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onViewCreatorProfile) {
                                    onViewCreatorProfile(instructor);
                                  }
                                }}
                                style={{
                                  color: '#1d9bf0',
                                  fontWeight: 500,
                                  cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                              >
                                {instructor.name}
                              </span>
                            </span>
                            <span>·</span>
                            <span>👥 {(instructor.stats?.studentsTaught || 0).toLocaleString()} followers</span>
                            <span>·</span>
                            <span style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: 200
                            }}>{instructor.title}</span>
                          </div>
                        </div>

                      </div>

                      {/* Bio - Indented under avatar */}
                      {instructor.bio && (
                        <div style={{
                          fontSize: 'var(--fs-14)',
                          lineHeight: 1.6,
                          color: isDarkMode ? '#a0a0a0' : '#4b5563',
                          paddingLeft: 72
                        }}>
                          {highlightMatch(instructor.bio, searchQuery)}
                        </div>
                      )}
                    </div>

                    {/* Courses Section with Connector Lines */}
                    {matchingCourses.length > 0 && (
                      <div style={{
                        position: 'relative',
                        padding: '8px 20px 12px'
                      }}>
                        {/* Vertical Connector Line */}
                        <div style={{
                          position: 'absolute',
                          left: 28,
                          top: 0,
                          bottom: 24,
                          width: 2,
                          background: isDarkMode ? '#2f3336' : '#d0e8f0'
                        }} />

                        {/* Course Cards */}
                        {matchingCourses.map((course, index) => {
                          const isPurchased = isCoursePurchased && isCoursePurchased(course.id);
                          const isFollowed = isCourseFollowed && isCourseFollowed(course.id);

                          return (
                            <div
                              key={course.id}
                              style={{
                                position: 'relative',
                                marginLeft: 20,
                                marginBottom: index < matchingCourses.length - 1 ? 8 : 0
                              }}
                            >
                              {/* Horizontal Connector Line */}
                              <div style={{
                                position: 'absolute',
                                left: -12,
                                top: '50%',
                                width: 10,
                                height: 2,
                                background: isDarkMode ? '#2f3336' : '#d0e8f0'
                              }} />
                              {/* Connector Dot */}
                              <div style={{
                                position: 'absolute',
                                left: -16,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: isDarkMode ? '#4facfe' : '#4facfe',
                                border: '2px solid #fff',
                                boxShadow: isDarkMode ? '0 0 0 2px #2f3336' : '0 0 0 2px #d0e8f0',
                                zIndex: 1
                              }} />
                              {/* Course Card */}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  saveScrollPosition();
                                  onViewCourse && onViewCourse(course);
                                }}
                                style={{
                                  position: 'relative',
                                  display: 'flex',
                                  gap: 12,
                                  padding: 12,
                                  background: isDarkMode ? '#16181c' : '#f7f9f9',
                                  border: isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb',
                                  borderRadius: 12,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = '#22c55e';
                                  e.currentTarget.style.background = isDarkMode ? '#1d1f23' : '#eff3f4';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = isDarkMode ? '#2f3336' : '#e5e7eb';
                                  e.currentTarget.style.background = isDarkMode ? '#16181c' : '#f7f9f9';
                                }}
                              >
                                {/* Course Badge - Green Square */}
                                <div style={{
                                  width: 56,
                                  height: 56,
                                  borderRadius: 10,
                                  flexShrink: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: getCourseGradient(),
                                  color: 'white',
                                  fontSize: 'var(--fs-16)',
                                  fontWeight: 700
                                }}>
                                  {getCourseAbbreviation(course.title)}
                                </div>

                                {/* Course Content */}
                                <div style={{ flex: 1, minWidth: 0, paddingRight: 100 }}>
                                  {/* Course Title */}
                                  <div style={{
                                    fontSize: 'var(--fs-15)',
                                    fontWeight: 600,
                                    color: isDarkMode ? '#e7e9ea' : '#0f1419',
                                    marginBottom: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: 6
                                  }}>
                                    <CourseHoverCard
                                      course={{
                                        ...course,
                                        instructorName: instructor.name
                                      }}
                                      isEnrolled={isPurchased}
                                      onEnroll={() => onViewCourse && onViewCourse(course)}
                                      onViewCourse={() => onViewCourse && onViewCourse(course)}
                                    >
                                      <span
                                        style={{
                                          cursor: 'pointer',
                                          transition: 'color 0.15s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = '#1d9bf0'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = isDarkMode ? '#e7e9ea' : '#0f1419'}
                                      >
                                        {highlightMatch(course.title, searchQuery)}
                                      </span>
                                    </CourseHoverCard>
                                    {isPurchased && (
                                      <>
                                        <span style={{ color: isDarkMode ? '#71767b' : '#374151', fontWeight: 400 }}>·</span>
                                        <span
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (handleFollowCourse) {
                                              handleFollowCourse(course.id, course);
                                            }
                                          }}
                                          style={{
                                            color: '#1d9bf0',
                                            fontSize: 'var(--fs-15)',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            transition: 'color 0.15s'
                                          }}
                                          onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                          onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                                        >
                                          {isFollowed ? 'Following' : 'Follow'}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  {/* Course Description */}
                                  <div style={{
                                    fontSize: 'var(--fs-14)',
                                    color: isDarkMode ? '#a0a0a0' : '#374151',
                                    lineHeight: 1.4,
                                    marginBottom: 6
                                  }}>
                                    {highlightMatch(course.description, searchQuery)}
                                  </div>
                                  {/* Stats Line */}
                                  <div style={{
                                    fontSize: 'var(--fs-14)',
                                    color: isDarkMode ? '#71767b' : '#6b7280',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4
                                  }}>
                                    <span style={{ color: '#fbbf24' }}>★</span> {course.rating || '4.7'} · {(course.students || 980).toLocaleString()} students · {course.duration || '6 weeks'}
                                  </div>
                                </div>

                                {/* Enroll/Enrolled Button - Top Right Corner */}
                                {isPurchased ? (
                                  <span
                                    className="course-pill"
                                    style={{
                                      position: 'absolute',
                                      top: 12,
                                      right: 12,
                                      background: isDarkMode ? '#2f3336' : '#f7f9f9',
                                      border: isDarkMode ? '2px solid #374151' : '2px solid #cfd9de',
                                      color: isDarkMode ? '#e7e9ea' : '#0f1419',
                                      padding: '8px 16px',
                                      borderRadius: 20,
                                      fontSize: 'var(--fs-14)',
                                      fontWeight: 500,
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    Enrolled
                                  </span>
                                ) : (
                                  <button
                                    className="course-pill"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      saveScrollPosition();
                                      if (onViewCourse) {
                                        onViewCourse(course);
                                      }
                                    }}
                                    style={{
                                      position: 'absolute',
                                      top: 12,
                                      right: 12,
                                      background: '#22c55e',
                                      border: '2px solid #22c55e',
                                      color: 'white',
                                      padding: '8px 16px',
                                      borderRadius: 20,
                                      fontSize: 'var(--fs-14)',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      whiteSpace: 'nowrap',
                                      transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background = '#16a34a';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background = '#22c55e';
                                    }}
                                  >
                                    Enroll {course.price}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {/* See All Link */}
                        {totalCourses > matchingCourses.length && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              saveScrollPosition();
                              onViewCommunity && onViewCommunity(instructor);
                            }}
                            style={{
                              textAlign: 'center',
                              padding: 12,
                              marginTop: 8,
                              color: '#1d9bf0',
                              fontSize: 'var(--fs-16)',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                          >
                            See all {totalCourses} courses →
                          </div>
                        )}
                      </div>
                    )}

                    {matchedByName && matchingCourses.length === 0 && (
                      <div style={{
                        padding: '12px 16px',
                        background: isDarkMode ? '#1d1f23' : '#fafbfc',
                        color: isDarkMode ? '#71717a' : '#6b7280',
                        fontSize: 'var(--fs-13)',
                        fontStyle: 'italic'
                      }}>
                        No courses match "{searchQuery}" — community name matches
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Sidebar - Suggested Courses */}
        <div style={{
          width: 280,
          flexShrink: 0,
          padding: '16px 16px 16px 16px'
        }} className="discover-right-sidebar">
          <div style={{
            position: 'sticky',
            top: 16
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16
            }}>
              <span style={{
                fontSize: 'var(--fs-15)',
                fontWeight: 700,
                color: isDarkMode ? '#e7e9ea' : '#0f1419'
              }}>
                Suggested Courses
              </span>
              <span style={{
                fontSize: 'var(--fs-13)',
                color: '#1d9bf0',
                cursor: 'pointer'
              }}>
                See all
              </span>
            </div>

            {indexedCourses.filter(c => !isCoursePurchased(c.id)).slice(0, 2).map((course, index) => (
              <div
                key={course.id}
                onClick={() => onViewCourse && onViewCourse(course)}
                style={{
                  padding: 12,
                  border: isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb',
                  borderRadius: 12,
                  marginBottom: 12,
                  cursor: 'pointer',
                  background: isDarkMode ? '#16181c' : '#f9fafb',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDarkMode ? '#1d1f23' : '#eff3f4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDarkMode ? '#16181c' : '#f9fafb';
                }}
              >
                <div style={{
                  fontSize: 'var(--fs-14)',
                  fontWeight: 600,
                  color: '#1d9bf0',
                  marginBottom: 4
                }}>
                  {course.title}
                </div>
                <div style={{
                  fontSize: 'var(--fs-12)',
                  color: isDarkMode ? '#71767b' : '#374151',
                  marginBottom: 8
                }}>
                  1,250 students enrolled
                </div>
                <button
                  className="course-pill"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewCourse && onViewCourse(course);
                  }}
                  style={{
                    background: isDarkMode ? 'transparent' : 'white',
                    border: isDarkMode ? '2px solid #2f3336' : '2px solid #cfd9de',
                    color: isDarkMode ? '#e7e9ea' : '#0f1419',
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontSize: 'var(--fs-13)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Enroll {course.price}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

DiscoverView.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
  onMenuChange: PropTypes.func,
  indexedCourses: PropTypes.array.isRequired,
  indexedInstructors: PropTypes.array.isRequired,
  followedCommunities: PropTypes.array.isRequired,
  setFollowedCommunities: PropTypes.func.isRequired,
  isCoursePurchased: PropTypes.func.isRequired,
  isCourseFollowed: PropTypes.func,
  handleFollowCourse: PropTypes.func,
  isCreatorFollowed: PropTypes.func.isRequired,
  handleFollowInstructor: PropTypes.func.isRequired,
  onViewCourse: PropTypes.func,
  onViewCommunity: PropTypes.func
};

export default DiscoverView;
