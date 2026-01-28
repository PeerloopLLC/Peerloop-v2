import React, { useState, useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaBook, FaPlay, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { AiOutlineStar, AiOutlineTeam } from 'react-icons/ai';
import { getInstructorWithCourses, getAllCourses, getInstructorById } from '../data/database';

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
  setSignupCompleted = null
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Collapsible header state
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const isHeaderCollapsedRef = useRef(false); // Ref to track current collapsed state for scroll handler
  const lastScrollY = useRef(0);
  const lastToggleTime = useRef(0);

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

  // Keep ref in sync with state
  useEffect(() => {
    isHeaderCollapsedRef.current = isHeaderCollapsed;
  }, [isHeaderCollapsed]);

  // Clear selections when user changes (for demo purposes)
  useEffect(() => {
    setSelectedInterests([]);
    setSelectedCommunities([]);
  }, [currentUser?.id]);

  // Handle scroll to collapse/expand header based on scroll position
  useEffect(() => {
    const COLLAPSE_THRESHOLD = 1; // Collapse immediately when scrolling
    const EXPAND_THRESHOLD = 5; // Expand when back at top
    const TOGGLE_COOLDOWN = 200; // Cooldown for responsive expand

    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const currentScrollY = container.scrollTop;
      const now = Date.now();

      // Always expand when at the very top (scrollTop <= 5), bypass cooldown
      if (isHeaderCollapsedRef.current && currentScrollY <= EXPAND_THRESHOLD) {
        setIsHeaderCollapsed(false);
        isHeaderCollapsedRef.current = false;
        lastToggleTime.current = now;
        lastScrollY.current = currentScrollY;
        return;
      }

      // Respect cooldown for other state changes
      if (now - lastToggleTime.current < TOGGLE_COOLDOWN) {
        return;
      }

      // Collapse: when scrolled down past threshold
      if (!isHeaderCollapsedRef.current && currentScrollY > COLLAPSE_THRESHOLD) {
        setIsHeaderCollapsed(true);
        isHeaderCollapsedRef.current = true;
        lastToggleTime.current = now;
      }
      // Expand: when scrolled back near the top
      else if (isHeaderCollapsedRef.current && currentScrollY < EXPAND_THRESHOLD) {
        setIsHeaderCollapsed(false);
        isHeaderCollapsedRef.current = false;
        lastToggleTime.current = now;
      }

      lastScrollY.current = currentScrollY;

      // Save scroll position on every scroll for restoration when returning
      sessionStorage.setItem('discoverScrollPosition', currentScrollY.toString());
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []); // Empty dependency - handler uses refs for current values

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

  // Single green gradient for all course badges (Option 5: Blue communities + Green courses)
  const getCourseGradient = () => {
    return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
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

  return (
    <div className="main-content">
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
                color: isDarkMode ? '#71717a' : '#9ca3af',
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
                  color: '#536471',
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
                  color: '#536471',
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

          {/* Results */}
          <div style={{ padding: '0' }}>
            {searchResults.length === 0 ? (
              <div style={{
                padding: 48,
                textAlign: 'center',
                color: isDarkMode ? '#71717a' : '#9ca3af'
              }}>
                No communities or courses found matching "{searchQuery}"
              </div>
            ) : (
              searchResults.map((result) => {
                const { instructor, matchingCourses, totalCourses, matchedByName } = result;
                const isFollowing = isCreatorFollowed(instructor.id);

                return (
                  <div
                    key={instructor.id}
                    style={{
                      marginBottom: 16,
                      background: isDarkMode ? '#16181c' : 'white',
                      borderRadius: 16,
                      overflow: 'hidden',
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
                    {/* Community Header - Full Width Gradient Banner */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        saveScrollPosition();
                        onViewCommunity && onViewCommunity(instructor);
                      }}
                      style={{
                        background: isDarkMode
                          ? 'linear-gradient(135deg, #1a2332 0%, #1e293b 100%)'
                          : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        padding: '14px 16px',
                        cursor: 'pointer',
                        transition: 'filter 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14
                      }}>
                        {/* Community Circle Avatar */}
                        <div style={{
                          width: 56,
                          height: 56,
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.2)',
                          border: '3px solid rgba(255,255,255,0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 26,
                          flexShrink: 0
                        }}>
                          👥
                        </div>

                        {/* Community Info - White Text */}
                        <div style={{ flex: 1, minWidth: 0, color: 'white' }}>
                          <div style={{
                            fontSize: 20,
                            fontWeight: 700
                          }}>
                            {highlightMatch(instructor.communityName || `${instructor.name} Community`, searchQuery)}
                          </div>
                          <div style={{
                            display: 'flex',
                            gap: 12,
                            fontSize: 14,
                            opacity: 0.9,
                            marginTop: 2
                          }}>
                            <span>@{(instructor.communityName || instructor.name)?.toLowerCase().replace(/\s+/g, '').replace(/\./g, '')}</span>
                            <span>👥 {(instructor.stats?.studentsTaught || 0).toLocaleString()} followers</span>
                            <span>📚 {totalCourses} courses</span>
                          </div>
                        </div>

                        {/* Follow Button in Header */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFollowInstructor(instructor.id);
                          }}
                          style={{
                            background: 'rgba(255,255,255,0.95)',
                            border: 'none',
                            color: '#1d9bf0',
                            padding: '10px 20px',
                            borderRadius: 20,
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            if (isFollowing) {
                              e.currentTarget.style.color = '#f4212e';
                              e.currentTarget.textContent = 'Unfollow';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (isFollowing) {
                              e.currentTarget.style.color = '#1d9bf0';
                              e.currentTarget.textContent = 'Following';
                            }
                          }}
                        >
                          {isFollowing ? 'Following' : 'Follow'}
                        </button>
                      </div>
                    </div>

                    {/* Community Body - Creator Row + Bio */}
                    <div style={{
                      padding: '12px 16px',
                      borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
                    }}>
                      {/* Creator Row */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 14,
                        color: isDarkMode ? '#71767b' : '#536471',
                        marginBottom: 6
                      }}>
                        {instructor.avatar ? (
                          <img
                            src={instructor.avatar}
                            alt={instructor.name}
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              objectFit: 'cover',
                              flexShrink: 0
                            }}
                          />
                        ) : (
                          <div style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: '#1d9bf0',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 11,
                            fontWeight: 700,
                            flexShrink: 0
                          }}>
                            {instructor.name?.charAt(0)}
                          </div>
                        )}
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
                        <span>• {instructor.title}</span>
                      </div>

                      {/* Bio */}
                      {instructor.bio && (
                        <div style={{
                          fontSize: 15,
                          lineHeight: 1.5,
                          color: isDarkMode ? '#e7e9ea' : '#0f1419'
                        }}>
                          {highlightMatch(instructor.bio, searchQuery)}
                        </div>
                      )}
                    </div>

                    {/* Courses Container - Gray Background */}
                    {matchingCourses.length > 0 && (
                      <div style={{
                        padding: '12px 16px 14px',
                        background: isDarkMode ? '#1d1f23' : '#fafbfc'
                      }}>
                        {/* Courses Label */}
                        <div style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: isDarkMode ? '#71767b' : '#536471',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: 10
                        }}>
                          Courses in this community
                        </div>

                        {/* Course Cards */}
                        {matchingCourses.map((course, index) => {
                          const isPurchased = isCoursePurchased && isCoursePurchased(course.id);
                          const isFollowed = isCourseFollowed && isCourseFollowed(course.id);

                          return (
                            <div
                              key={course.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                saveScrollPosition();
                                onViewCourse && onViewCourse(course);
                              }}
                              style={{
                                display: 'flex',
                                gap: 12,
                                padding: 12,
                                background: isDarkMode ? '#16181c' : 'white',
                                border: isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb',
                                borderRadius: 10,
                                marginBottom: index < matchingCourses.length - 1 ? 8 : 0,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#10b981';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.15)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = isDarkMode ? '#2f3336' : '#e5e7eb';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}
                            >
                              {/* Course Badge */}
                              <div style={{
                                width: 56,
                                height: 56,
                                borderRadius: 12,
                                flexShrink: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: getCourseGradient(course.title),
                                color: 'white',
                                fontSize: 18,
                                fontWeight: 800,
                                letterSpacing: '-0.5px'
                              }}>
                                {getCourseAbbreviation(course.title)}
                              </div>

                              {/* Course Content */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                {/* Top Row: Title + Button */}
                                <div style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'flex-start',
                                  gap: 10
                                }}>
                                  <div>
                                    <div style={{
                                      fontSize: 16,
                                      fontWeight: 600,
                                      color: '#1d9bf0',
                                      marginBottom: 4
                                    }}>
                                      {highlightMatch(course.title, searchQuery)}
                                    </div>
                                    <div style={{
                                      fontSize: 14,
                                      color: isDarkMode ? '#71767b' : '#536471',
                                      lineHeight: 1.5,
                                      marginBottom: 8
                                    }}>
                                      {highlightMatch(course.description, searchQuery)}
                                    </div>
                                  </div>

                                  {/* Enroll/Following Button */}
                                  {isPurchased ? (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (handleFollowCourse) {
                                          handleFollowCourse(course.id, course);
                                        }
                                      }}
                                      style={{
                                        background: '#1d9bf0',
                                        border: '1px solid #1d9bf0',
                                        color: 'white',
                                        padding: '8px 16px',
                                        borderRadius: 20,
                                        fontSize: 14,
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                        flexShrink: 0,
                                        transition: 'all 0.2s'
                                      }}
                                      onMouseEnter={(e) => {
                                        if (isFollowed) {
                                          e.currentTarget.style.background = '#f4212e';
                                          e.currentTarget.style.borderColor = '#f4212e';
                                          e.currentTarget.textContent = 'Unfollow';
                                        }
                                      }}
                                      onMouseLeave={(e) => {
                                        if (isFollowed) {
                                          e.currentTarget.style.background = '#1d9bf0';
                                          e.currentTarget.style.borderColor = '#1d9bf0';
                                          e.currentTarget.textContent = 'Following';
                                        }
                                      }}
                                    >
                                      {isFollowed ? 'Following' : 'Follow'}
                                    </button>
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
                                        background: isDarkMode ? '#16181c' : '#f0fdf4',
                                        border: '1px solid #10b981',
                                        color: '#059669',
                                        padding: '8px 16px',
                                        borderRadius: 20,
                                        fontSize: 14,
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                        flexShrink: 0,
                                        transition: 'all 0.2s'
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#10b981';
                                        e.currentTarget.style.color = 'white';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.background = isDarkMode ? '#16181c' : '#f0fdf4';
                                        e.currentTarget.style.color = '#059669';
                                      }}
                                    >
                                      Enroll {course.price}
                                    </button>
                                  )}
                                </div>

                                {/* Benefits Line */}
                                <div style={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: '6px 14px',
                                  marginBottom: 6,
                                  fontSize: 13,
                                  color: '#059669'
                                }}>
                                  <span>✓ 1-on-1 sessions with Student-Teacher</span>
                                  <span>✓ Access to AI Prompters Community</span>
                                  <span>✓ Certificate</span>
                                </div>

                                {/* Stats Line */}
                                <div style={{
                                  fontSize: 13,
                                  color: isDarkMode ? '#71767b' : '#536471'
                                }}>
                                  <span style={{ color: '#fbbf24' }}>★</span> 4.8 (234) • 1,250 students • {course.curriculum?.length || 5} Modules • 12 hours
                                </div>
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
                              padding: 10,
                              marginTop: 8,
                              color: '#1d9bf0',
                              fontSize: 14,
                              fontWeight: 500,
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
                        color: isDarkMode ? '#71717a' : '#9ca3af',
                        fontSize: 13,
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
                fontSize: 15,
                fontWeight: 700,
                color: isDarkMode ? '#e7e9ea' : '#0f1419'
              }}>
                Suggested Courses
              </span>
              <span style={{
                fontSize: 13,
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
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#1d9bf0',
                  marginBottom: 4
                }}>
                  {course.title}
                </div>
                <div style={{
                  fontSize: 12,
                  color: isDarkMode ? '#71767b' : '#536471',
                  marginBottom: 8
                }}>
                  1,250 students enrolled
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewCourse && onViewCourse(course);
                  }}
                  style={{
                    background: isDarkMode ? 'transparent' : 'white',
                    border: isDarkMode ? '1px solid #2f3336' : '1px solid #cfd9de',
                    color: isDarkMode ? '#e7e9ea' : '#0f1419',
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontSize: 13,
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
