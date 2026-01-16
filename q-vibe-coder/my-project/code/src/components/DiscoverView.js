import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaBook, FaPlay } from 'react-icons/fa';
import { AiOutlineStar, AiOutlineTeam } from 'react-icons/ai';
import { getInstructorWithCourses } from '../data/database';

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
  onViewCommunity
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Banner color from Profile settings
  const userBannerColor = localStorage.getItem('profileBannerColor') || 'default';

  // Available banner colors (matching Profile.js)
  const bannerColorOptions = {
    default: { start: '#1a1a2e', end: '#0f3460' },
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
      <div className="three-column-layout">
        <div className="center-column" style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Header */}
          <div style={{
            padding: '24px 16px',
            borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb'
          }}>
            <h1 style={{
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 16,
              color: isDarkMode ? '#f5f5f7' : '#111827'
            }}>
              Discover Communities and Courses
            </h1>

            {/* Search Bar */}
            <div style={{ position: 'relative', maxWidth: 600 }}>
              <FaSearch style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: isDarkMode ? '#71717a' : '#9ca3af',
                fontSize: 18
              }} />
              <input
                type="text"
                placeholder="Search communities & courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 48px',
                  fontSize: 16,
                  border: isDarkMode ? '2px solid #27272a' : '2px solid #e5e7eb',
                  borderRadius: 9999,
                  background: isDarkMode ? '#1a1a24' : '#f9fafb',
                  color: isDarkMode ? '#f5f5f7' : '#111827',
                  outline: 'none',
                  transition: 'all 0.2s'
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

            {/* Filter Pills - Scrollable Row */}
            <div
              className="discover-pills-scroll"
              style={{
                marginTop: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                overflowX: 'auto',
                overflowY: 'hidden',
                paddingBottom: 8,
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                cursor: 'grab'
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
                      onClick={() => setActiveFilter(pill.id)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 20,
                        fontSize: 14,
                        fontWeight: 600,
                        border: isActive
                          ? '2px solid #1d9bf0'
                          : (isDarkMode ? '2px solid #536471' : '2px solid #cfd9de'),
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        flexShrink: 0,
                        background: isActive
                          ? (isDarkMode ? 'rgba(29, 155, 240, 0.15)' : 'rgba(29, 155, 240, 0.1)')
                          : (isDarkMode ? '#2f3336' : '#ffffff'),
                        color: isActive
                          ? '#1d9bf0'
                          : (isDarkMode ? '#e7e9ea' : '#0f1419')
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = isDarkMode ? '#3f3f46' : '#eef0f1';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#ffffff';
                        }
                      }}
                    >
                      {pill.label}
                    </button>
                  );
                })}
            </div>

            {searchQuery && (
              <p style={{
                marginTop: 12,
                fontSize: 14,
                color: isDarkMode ? '#71717a' : '#6b7280'
              }}>
                Showing results for "<span style={{ color: '#6366f1' }}>{searchQuery}</span>"
                {activeFilter !== 'All' && (
                  <span> filtered by <span style={{ color: '#6366f1' }}>{activeFilter}</span></span>
                )}
              </p>
            )}
          </div>

          {/* Welcome Post - Only for new users */}
          {currentUser?.isNewUser && (
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
              {/* Video Placeholder - Left Side */}
              <div style={{
                width: 240,
                height: 160,
                flexShrink: 0,
                background: isDarkMode ? '#2f3336' : '#f7f9f9',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: isDarkMode ? '1px solid #3f4448' : '1px solid #e1e8ed',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = isDarkMode ? '#3f4448' : '#eff3f4'}
              onMouseLeave={e => e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#f7f9f9'}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <FaPlay style={{ fontSize: 32, color: '#1d9bf0', opacity: 0.8 }} />
                  <span style={{ fontSize: 12, color: isDarkMode ? '#71767b' : '#536471' }}>Watch video</span>
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
                  onClick={() => onMenuChange && onMenuChange('My Community')}
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
                  Start Exploring →
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
                      padding: '0 0 20px 0',
                      borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
                      marginBottom: 20
                    }}
                  >
                    {/* Community Header - Colored Card */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewCommunity && onViewCommunity(instructor);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                        padding: 20,
                        borderRadius: 16,
                        marginBottom: 4,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: isDarkMode
                          ? 'linear-gradient(135deg, #1a2332 0%, #1e293b 100%)'
                          : getUserBannerGradient()
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      {/* Avatar */}
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        fontWeight: 700,
                        color: '#fff',
                        flexShrink: 0,
                        overflow: 'hidden'
                      }}>
                        {instructor.avatar ? (
                          <img src={instructor.avatar} alt={instructor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          instructor.name?.charAt(0) || '?'
                        )}
                      </div>

                      {/* Creator Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Name and Handle Row */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: 4
                        }}>
                          <span style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: isDarkMode ? '#e7e9ea' : '#0f1419'
                          }}>
                            {highlightMatch(instructor.name, searchQuery)}
                          </span>
                          <span style={{
                            color: isDarkMode ? '#71767b' : '#536471',
                            fontSize: 15
                          }}>
                            @{instructor.name?.toLowerCase().replace(/\s+/g, '').replace(/\./g, '')}
                          </span>
                        </div>

                        {/* Followers and Title */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          color: isDarkMode ? '#71767b' : '#536471',
                          fontSize: 14,
                          marginTop: 2
                        }}>
                          <AiOutlineTeam style={{ fontSize: 16 }} />
                          <span>{(instructor.stats?.studentsTaught || 0).toLocaleString()} followers</span>
                          <span style={{ margin: '0 4px' }}>•</span>
                          <span>{instructor.title}</span>
                        </div>

                        {/* Bio */}
                        {instructor.bio && (
                          <div style={{
                            marginTop: 8,
                            fontSize: 15,
                            lineHeight: 1.4,
                            color: isDarkMode ? '#e7e9ea' : '#0f1419'
                          }}>
                            {highlightMatch(instructor.bio, searchQuery)}
                          </div>
                        )}
                      </div>

                      {/* Join Community Button - Green */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollowInstructor(instructor.id);
                        }}
                        style={{
                          background: isFollowing ? (isDarkMode ? '#2f3336' : '#eff3f4') : '#c6f432',
                          border: 'none',
                          color: isFollowing ? (isDarkMode ? '#71767b' : '#536471') : '#0f1419',
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
                          if (!isFollowing) {
                            e.currentTarget.style.background = '#b8e62e';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isFollowing) {
                            e.currentTarget.style.background = '#c6f432';
                          }
                        }}
                      >
                        {isFollowing ? 'Joined' : 'Join Community'}
                      </button>
                    </div>

                    {/* Courses List - Card Style with Thumbnails */}
                    {matchingCourses.length > 0 && (
                      <div style={{
                        marginTop: 16,
                        marginLeft: 60,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8
                      }}>
                        {matchingCourses.map((course, index) => {
                          // Thumbnail gradient colors based on course index
                          const thumbGradients = [
                            'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #a855f7 100%)',
                            'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
                            'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
                            'linear-gradient(135deg, #0d4f6e 0%, #0891b2 100%)'
                          ];

                          return (
                            <div
                              key={course.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewCourse && onViewCourse(course);
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 12,
                                padding: 12,
                                border: isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb',
                                borderRadius: 12,
                                background: isDarkMode ? '#16181c' : '#f7f9f9',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = isDarkMode ? '#1d1f23' : '#eff3f4';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = isDarkMode ? '#16181c' : '#f7f9f9';
                              }}
                            >
                              {/* Course Thumbnail */}
                              <div style={{
                                width: 100,
                                height: 70,
                                borderRadius: 8,
                                flexShrink: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                background: thumbGradients[index % 4]
                              }}>
                              </div>

                              {/* Course Info */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  fontSize: 15,
                                  fontWeight: 600,
                                  color: '#1d9bf0'
                                }}>
                                  {highlightMatch(course.title, searchQuery)}
                                </div>
                                <div style={{
                                  fontSize: 14,
                                  color: isDarkMode ? '#71767b' : '#536471',
                                  lineHeight: 1.4,
                                  marginTop: 4,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}>
                                  {highlightMatch(course.description, searchQuery)}
                                </div>
                              </div>

                              {/* Enroll/Following Button */}
                              {(() => {
                                const isPurchased = isCoursePurchased && isCoursePurchased(course.id);
                                const isFollowed = isCourseFollowed && isCourseFollowed(course.id);

                                if (isPurchased) {
                                  return (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (handleFollowCourse) {
                                          handleFollowCourse(course.id, course);
                                        }
                                      }}
                                      style={{
                                        background: isDarkMode ? '#2f3336' : '#eff3f4',
                                        border: 'none',
                                        color: isDarkMode ? '#71767b' : '#536471',
                                        padding: '6px 16px',
                                        borderRadius: 20,
                                        fontSize: 14,
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                        flexShrink: 0,
                                        transition: 'all 0.2s'
                                      }}
                                    >
                                      {isFollowed ? 'Following' : 'Follow'}
                                    </button>
                                  );
                                } else {
                                  return (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (onViewCourse) {
                                          onViewCourse(course);
                                        }
                                      }}
                                      style={{
                                        background: isDarkMode ? 'transparent' : 'white',
                                        border: isDarkMode ? '1px solid #2f3336' : '1px solid #cfd9de',
                                        color: isDarkMode ? '#e7e9ea' : '#0f1419',
                                        padding: '6px 16px',
                                        borderRadius: 20,
                                        fontSize: 14,
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                        flexShrink: 0,
                                        transition: 'all 0.2s'
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.background = isDarkMode ? '#1d1f23' : '#f7f9f9';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.background = isDarkMode ? 'transparent' : 'white';
                                      }}
                                    >
                                      Enroll {course.price}
                                    </button>
                                  );
                                }
                              })()}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {matchedByName && matchingCourses.length === 0 && (
                      <div style={{
                        padding: '12px 20px 12px 80px',
                        color: isDarkMode ? '#71717a' : '#9ca3af',
                        fontSize: 13,
                        fontStyle: 'italic'
                      }}>
                        No courses match "{searchQuery}" — community name matches
                      </div>
                    )}

                    {/* See All Courses Link */}
                    {totalCourses > matchingCourses.length && (
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onViewCommunity && onViewCommunity(instructor);
                        }}
                        style={{
                          display: 'inline-block',
                          marginTop: 8,
                          marginLeft: 60,
                          padding: '8px 16px',
                          border: isDarkMode ? '1px solid #2f3336' : '1px solid #cfd9de',
                          borderRadius: 20,
                          fontSize: 14,
                          color: isDarkMode ? '#71767b' : '#536471',
                          textDecoration: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = isDarkMode ? '#1d1f23' : '#f7f9f9';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        See all {totalCourses} courses
                      </a>
                    )}
                  </div>
                );
              })
            )}
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
