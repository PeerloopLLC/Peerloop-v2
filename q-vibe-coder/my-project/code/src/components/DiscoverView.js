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
              Discover
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
                        padding: isAllPill ? '8px 20px' : '8px 16px',
                        borderRadius: 20,
                        fontSize: 14,
                        fontWeight: isAllPill ? 700 : 500,
                        border: isAllPill && !isActive
                          ? '2px solid #6366f1'
                          : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        flexShrink: 0,
                        background: isActive
                          ? '#6366f1'
                          : isAllPill
                            ? (isDarkMode ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)')
                            : (isDarkMode ? '#27272a' : '#e5e7eb'),
                        color: isActive
                          ? '#fff'
                          : isAllPill
                            ? '#6366f1'
                            : (isDarkMode ? '#a1a1aa' : '#6b7280')
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = isAllPill
                            ? (isDarkMode ? 'rgba(99, 102, 241, 0.25)' : 'rgba(99, 102, 241, 0.2)')
                            : (isDarkMode ? '#3f3f46' : '#d1d5db');
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = isAllPill
                            ? (isDarkMode ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)')
                            : (isDarkMode ? '#27272a' : '#e5e7eb');
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
                      background: isDarkMode ? '#12121a' : '#fff',
                      borderBottom: isDarkMode ? '1px solid #27272a' : '1px solid #e5e7eb'
                    }}
                  >
                    {/* Community Header */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewCommunity && onViewCommunity(instructor);
                      }}
                      style={{
                        padding: 20,
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#1a1a24' : '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Top row: Avatar, Name, Follow button */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        marginBottom: 12
                      }}>
                        <div style={{
                          width: 56,
                          height: 56,
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, #6366f1 0%, #10b981 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 24,
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

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: isDarkMode ? '#f5f5f7' : '#111827',
                            marginBottom: 4
                          }}>
                            {highlightMatch(instructor.name, searchQuery)}
                          </div>
                          <div style={{
                            fontSize: 14,
                            color: isDarkMode ? '#a1a1aa' : '#6b7280',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12
                          }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <AiOutlineTeam /> {(instructor.stats?.studentsTaught || 0).toLocaleString()} followers
                            </span>
                            <span>·</span>
                            <span>{instructor.title}</span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFollowInstructor(instructor.id);
                          }}
                          style={{
                            padding: '8px 20px',
                            borderRadius: 20,
                            background: isFollowing ? '#64748b' : '#1d9bf0',
                            color: '#fff',
                            border: 'none',
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            flexShrink: 0
                          }}
                        >
                          {isFollowing ? 'Joined Community' : 'Join Community'}
                        </button>
                      </div>

                      {/* Community Bio/Summary */}
                      {instructor.bio && (
                        <div style={{
                          fontSize: 14,
                          lineHeight: 1.6,
                          color: isDarkMode ? '#a1a1aa' : '#4b5563',
                          paddingLeft: 72,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {highlightMatch(instructor.bio, searchQuery)}
                        </div>
                      )}
                    </div>

                    {/* Matching Courses - Tree Style */}
                    {matchingCourses.length > 0 && (
                      <div style={{
                        paddingLeft: 48,
                        paddingRight: 20,
                        paddingBottom: 8
                      }}>
                        {matchingCourses.map((course, index) => {
                          const isLast = index === matchingCourses.length - 1;
                          return (
                            <div
                              key={course.id}
                              style={{
                                display: 'flex',
                                position: 'relative'
                              }}
                            >
                              {/* Tree Connector */}
                              <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: 24,
                                flexShrink: 0,
                                marginRight: 8
                              }}>
                                {/* Vertical line extending up (for all items) */}
                                <div style={{
                                  width: 2,
                                  height: 20,
                                  background: isDarkMode ? '#4b5563' : '#d1d5db'
                                }} />
                                {/* Horizontal connector */}
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  width: '100%'
                                }}>
                                  <div style={{
                                    width: 2,
                                    height: isLast ? 0 : 'calc(100% + 20px)',
                                    background: isDarkMode ? '#4b5563' : '#d1d5db',
                                    position: 'absolute',
                                    left: 11,
                                    top: 20
                                  }} />
                                  <div style={{
                                    width: 12,
                                    height: 2,
                                    background: isDarkMode ? '#4b5563' : '#d1d5db',
                                    marginLeft: 11
                                  }} />
                                </div>
                              </div>

                              {/* Course Card */}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onViewCourse && onViewCourse(course);
                                }}
                                style={{
                                  flex: 1,
                                  padding: '12px 16px',
                                  marginBottom: 8,
                                  background: isDarkMode ? '#1a1a24' : '#f9fafb',
                                  borderRadius: 10,
                                  border: isDarkMode ? '1px solid #27272a' : '1px solid #e5e7eb',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = isDarkMode ? '#27272a' : '#f3f4f6';
                                  e.currentTarget.style.borderColor = '#6366f1';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = isDarkMode ? '#1a1a24' : '#f9fafb';
                                  e.currentTarget.style.borderColor = isDarkMode ? '#27272a' : '#e5e7eb';
                                }}
                              >
                                {/* Course Title Row */}
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 10,
                                  marginBottom: 4
                                }}>
                                  <div style={{
                                    width: 28,
                                    height: 28,
                                    background: isDarkMode ? '#27272a' : '#e0e7ff',
                                    borderRadius: 6,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#6366f1',
                                    fontSize: 12,
                                    flexShrink: 0
                                  }}>
                                    <FaBook />
                                  </div>

                                  <div style={{
                                    flex: 1,
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: isDarkMode ? '#f5f5f7' : '#111827'
                                  }}>
                                    {highlightMatch(course.title, searchQuery)}
                                  </div>

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
                                            padding: '8px 16px',
                                            borderRadius: 16,
                                            background: '#1d9bf0',
                                            color: '#fff',
                                            fontSize: 14,
                                            fontWeight: 600,
                                            whiteSpace: 'nowrap',
                                            flexShrink: 0,
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                          }}
                                          onMouseEnter={(e) => {
                                            if (isFollowed) {
                                              e.currentTarget.style.background = '#ef4444';
                                              e.currentTarget.textContent = 'Unfollow';
                                            } else {
                                              e.currentTarget.style.background = '#1a8cd8';
                                            }
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#1d9bf0';
                                            if (isFollowed) {
                                              e.currentTarget.textContent = 'Followed';
                                            }
                                          }}
                                        >
                                          {isFollowed ? 'Followed' : 'Follow'}
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
                                            padding: '4px 12px',
                                            borderRadius: 12,
                                            background: '#10b981',
                                            color: '#fff',
                                            fontSize: 11,
                                            fontWeight: 600,
                                            whiteSpace: 'nowrap',
                                            flexShrink: 0,
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#059669';
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#10b981';
                                          }}
                                        >
                                          Enroll for {course.price}
                                        </button>
                                      );
                                    }
                                  })()}
                                </div>

                                {/* Course Description */}
                                <div style={{
                                  fontSize: 13,
                                  lineHeight: 1.5,
                                  color: isDarkMode ? '#a1a1aa' : '#6b7280',
                                  paddingLeft: 38,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}>
                                  {highlightMatch(course.description, searchQuery)}
                                </div>
                              </div>
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

                    {/* See All Button */}
                    {totalCourses > matchingCourses.length && (
                      <div
                        style={{
                          paddingLeft: 80,
                          paddingRight: 20,
                          paddingBottom: 16,
                          paddingTop: matchingCourses.length > 0 ? 0 : 8,
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewCommunity && onViewCommunity(instructor);
                          }}
                          style={{
                            background: isDarkMode ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)',
                            color: '#6366f1',
                            border: '2px solid #6366f1',
                            borderRadius: 20,
                            padding: '8px 16px',
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#6366f1';
                            e.currentTarget.style.color = '#fff';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = isDarkMode ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)';
                            e.currentTarget.style.color = '#6366f1';
                          }}
                        >
                          See all {totalCourses} courses →
                        </button>
                      </div>
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
