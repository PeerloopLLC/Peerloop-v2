import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FaBook, FaSearch, FaCheckCircle, FaPlay } from 'react-icons/fa';
import { AiOutlineStar, AiOutlineTeam } from 'react-icons/ai';
import { getInstructorById } from '../data/database';

/**
 * MyCoursesView - Displays the user's purchased courses grouped by instructor
 * Layout matches DiscoverView - profile card with courses underneath
 */
const MyCoursesView = ({
  isDarkMode,
  currentUser,
  onMenuChange,
  purchasedCourses,
  indexedCourses,
  onViewCourse,
  onViewCreatorProfile,
  isCourseFollowed,
  handleFollowCourse,
  isCreatorFollowed,
  handleFollowInstructor
}) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'inprogress', or 'completed'
  const [searchQuery, setSearchQuery] = useState('');

  // Banner color from Profile settings (same as DiscoverView)
  const userBannerColor = localStorage.getItem('profileBannerColor') || 'default';

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

  const getUserBannerGradient = () => {
    const colors = bannerColorOptions[userBannerColor] || bannerColorOptions.default;
    return `linear-gradient(135deg, ${colors.start} 0%, ${colors.end} 100%)`;
  };

  // Get full course data for purchased courses with mock progress
  const myCoursesData = useMemo(() => {
    return purchasedCourses.map(purchasedId => {
      const course = indexedCourses.find(c => c.id === purchasedId);
      if (!course) return null;

      return {
        ...course,
        progress: Math.floor(Math.random() * 100),
        lessonsCompleted: Math.floor(Math.random() * 20),
        totalLessons: 20,
        lastAccessed: '2 days ago'
      };
    }).filter(Boolean);
  }, [purchasedCourses, indexedCourses]);

  // Group courses by instructor
  const coursesGroupedByInstructor = useMemo(() => {
    const groups = {};

    myCoursesData.forEach(course => {
      const instructorId = course.instructorId;
      if (!groups[instructorId]) {
        const instructor = getInstructorById(instructorId);
        groups[instructorId] = {
          instructor,
          courses: []
        };
      }
      groups[instructorId].courses.push(course);
    });

    return Object.values(groups);
  }, [myCoursesData]);

  // Filter based on tab and search
  const filteredGroups = useMemo(() => {
    return coursesGroupedByInstructor.map(group => {
      const filteredCourses = group.courses.filter(course => {
        const matchesSearch = !searchQuery ||
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.instructor?.name?.toLowerCase().includes(searchQuery.toLowerCase());

        if (activeTab === 'inprogress') {
          return matchesSearch && course.progress < 100;
        }
        if (activeTab === 'completed') {
          return matchesSearch && course.progress === 100;
        }
        return matchesSearch;
      });

      return {
        ...group,
        courses: filteredCourses
      };
    }).filter(group => group.courses.length > 0);
  }, [coursesGroupedByInstructor, searchQuery, activeTab]);

  // Count totals for tabs
  const allInProgressCount = myCoursesData.filter(c => c.progress < 100).length;
  const allCompletedCount = myCoursesData.filter(c => c.progress === 100).length;

  // Highlight search matches
  const highlightMatch = (text, query) => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} style={{ background: '#fef08a', color: '#000', borderRadius: 2, padding: '0 2px' }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Empty state
  if (myCoursesData.length === 0) {
    return (
      <div className="main-content">
        <div className="three-column-layout browse-layout">
          <div className="center-column">
            <div style={{
              padding: '60px 20px',
              textAlign: 'center'
            }}>
              <FaBook style={{
                fontSize: 64,
                color: isDarkMode ? '#374151' : '#d1d5db',
                marginBottom: 16
              }} />
              <h2 style={{
                fontSize: 24,
                fontWeight: 700,
                color: isDarkMode ? '#e7e9ea' : '#111827',
                marginBottom: 8
              }}>
                No courses yet
              </h2>
              <p style={{
                fontSize: 16,
                color: isDarkMode ? '#9ca3af' : '#6b7280',
                marginBottom: 24
              }}>
                Browse our catalog and enroll in your first course!
              </p>
              <button
                onClick={() => onMenuChange && onMenuChange('Discover')}
                style={{
                  background: '#1d9bf0',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: 24,
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: 'pointer'
                }}
              >
                Discover Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="three-column-layout browse-layout">
        <div className="center-column">
          {/* Header Tabs */}
          <div className="top-menu-section" style={{
            borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
            padding: '0 16px',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: isDarkMode ? '#000' : '#fff',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            flexWrap: 'nowrap',
            minHeight: 52
          }}>
            {/* Left spacer */}
            <div style={{ flex: '1 1 0', minWidth: 0, maxWidth: 150 }} />

            {/* Centered tabs */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              flex: '0 0 auto'
            }}>
              {[
                { id: 'all', label: `All (${myCoursesData.length})` },
                { id: 'inprogress', label: `In Progress (${allInProgressCount})` },
                { id: 'completed', label: `Completed (${allCompletedCount})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: '0 0 auto',
                    padding: '16px 12px',
                    border: 'none',
                    background: 'transparent',
                    color: activeTab === tab.id
                      ? (isDarkMode ? '#e7e9ea' : '#0f1419')
                      : (isDarkMode ? '#71767b' : '#536471'),
                    fontWeight: activeTab === tab.id ? 700 : 500,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    borderBottom: activeTab === tab.id
                      ? '4px solid #1d9bf0'
                      : '4px solid transparent',
                    marginBottom: -1,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search box on right */}
            <div style={{
              flex: '1 1 0',
              minWidth: 80,
              maxWidth: 150,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}>
              <div className="search-container" style={{ width: '100%', marginLeft: 0 }}>
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>

          {/* Course List - Grouped by Instructor */}
          <div style={{ padding: '0' }}>
            {filteredGroups.length === 0 ? (
              <div style={{
                padding: 48,
                textAlign: 'center',
                color: isDarkMode ? '#71717a' : '#9ca3af'
              }}>
                {searchQuery ? (
                  <>No courses found matching "{searchQuery}"</>
                ) : activeTab === 'inprogress' ? (
                  <>
                    <FaPlay style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }} />
                    <p>No courses in progress. Start a new course!</p>
                  </>
                ) : (
                  <>
                    <FaCheckCircle style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }} />
                    <p>No completed courses yet. Keep learning!</p>
                  </>
                )}
              </div>
            ) : (
              filteredGroups.map((group) => {
                const { instructor, courses } = group;
                const isFollowing = isCreatorFollowed ? isCreatorFollowed(instructor?.id) : false;

                return (
                  <div
                    key={instructor?.id || 'unknown'}
                    style={{
                      background: isDarkMode ? '#12121a' : '#fff',
                      borderBottom: isDarkMode ? '1px solid #27272a' : '1px solid #e5e7eb'
                    }}
                  >
                    {/* Instructor Profile Card - Discovery Style with Gradient Background */}
                    <div
                      onClick={() => {
                        // Navigate to creator profile via callback (handles history)
                        if (onViewCreatorProfile) {
                          onViewCreatorProfile(instructor);
                        } else {
                          // Fallback to old behavior
                          localStorage.setItem('pendingBrowseInstructor', JSON.stringify(instructor));
                          localStorage.setItem('browseActiveTopMenu', 'creators');
                          onMenuChange && onMenuChange('Browse');
                        }
                      }}
                      style={{
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
                      {/* Top row: Avatar, Name, Join button */}
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
                          {instructor?.avatar ? (
                            <img src={instructor.avatar} alt={instructor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            instructor?.name?.charAt(0) || '?'
                          )}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          {/* Name and Handle Row */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 4,
                            marginBottom: 4
                          }}>
                            <span style={{
                              fontSize: 18,
                              fontWeight: 600,
                              color: isDarkMode ? '#f5f5f7' : '#111827'
                            }}>
                              {highlightMatch(instructor?.name || 'Unknown Instructor', searchQuery)}
                            </span>
                            <span style={{
                              color: isDarkMode ? '#71767b' : '#536471',
                              fontSize: 15
                            }}>
                              @{instructor?.name?.toLowerCase().replace(/\s+/g, '').replace(/\./g, '') || 'unknown'}
                            </span>
                          </div>
                          <div style={{
                            fontSize: 14,
                            color: isDarkMode ? '#a1a1aa' : '#6b7280',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4
                          }}>
                            <AiOutlineTeam style={{ fontSize: 16 }} />
                            <span>{(instructor?.stats?.studentsTaught || 0).toLocaleString()} followers</span>
                            <span style={{ margin: '0 4px' }}>•</span>
                            <span>{instructor?.title || 'Instructor'}</span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFollowInstructor && handleFollowInstructor(instructor?.id);
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

                      {/* Instructor Bio */}
                      {instructor?.bio && (
                        <div style={{
                          fontSize: 14,
                          lineHeight: 1.6,
                          color: isDarkMode ? '#a1a1aa' : '#4b5563',
                          paddingLeft: 72,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {highlightMatch(instructor.bio, searchQuery)}
                        </div>
                      )}
                    </div>

                    {/* Courses List - Tree Style */}
                    <div style={{
                      paddingLeft: 48,
                      paddingRight: 20,
                      paddingBottom: 8
                    }}>
                      {courses.map((course, index) => {
                        const isLast = index === courses.length - 1;
                        const isCompleted = course.progress === 100;
                        const isFollowed = isCourseFollowed ? isCourseFollowed(course.id) : false;

                        return (
                          <div
                            key={course.id}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              position: 'relative',
                              paddingLeft: 24
                            }}
                          >
                            {/* Tree connector lines */}
                            <div style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              bottom: isLast ? '50%' : 0,
                              width: 1,
                              background: isDarkMode ? '#3f3f46' : '#e5e7eb'
                            }} />
                            <div style={{
                              position: 'absolute',
                              left: 0,
                              top: '50%',
                              width: 16,
                              height: 1,
                              background: isDarkMode ? '#3f3f46' : '#e5e7eb'
                            }} />

                            {/* Course Card - Discovery Style */}
                            <div
                              onClick={() => onViewCourse && onViewCourse(course.id)}
                              style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 12,
                                padding: 12,
                                marginBottom: 8,
                                background: isDarkMode ? '#16181c' : '#f7f9f9',
                                borderRadius: 12,
                                cursor: 'pointer',
                                border: isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = isDarkMode ? '#1d1f23' : '#eff3f4';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = isDarkMode ? '#16181c' : '#f7f9f9';
                              }}
                            >
                              {/* Course Thumbnail - Gradient like Discovery */}
                              {(() => {
                                const thumbGradients = [
                                  'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #a855f7 100%)',
                                  'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
                                  'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
                                  'linear-gradient(135deg, #0d4f6e 0%, #0891b2 100%)'
                                ];
                                return (
                                  <div style={{
                                    width: 100,
                                    height: 70,
                                    borderRadius: 8,
                                    flexShrink: 0,
                                    background: thumbGradients[index % 4]
                                  }} />
                                );
                              })()}

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

                                {/* Course Stats - Kept per user request */}
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                  marginTop: 8,
                                  fontSize: 12,
                                  color: isDarkMode ? '#71717a' : '#9ca3af'
                                }}>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <AiOutlineStar style={{ color: '#fbbf24' }} /> {course.rating}
                                  </span>
                                  <span>·</span>
                                  <span>{course.students?.toLocaleString()} students</span>
                                  <span>·</span>
                                  <span>{course.duration}</span>
                                </div>
                              </div>

                              {/* Follow/Unfollow Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFollowCourse && handleFollowCourse(course.id);
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
                                {isFollowed ? 'Unfollow Course' : 'Follow Course'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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

MyCoursesView.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
  onMenuChange: PropTypes.func,
  purchasedCourses: PropTypes.array.isRequired,
  indexedCourses: PropTypes.array.isRequired,
  onViewCourse: PropTypes.func,
  onViewCreatorProfile: PropTypes.func,
  isCourseFollowed: PropTypes.func,
  handleFollowCourse: PropTypes.func,
  isCreatorFollowed: PropTypes.func,
  handleFollowInstructor: PropTypes.func
};

export default MyCoursesView;
