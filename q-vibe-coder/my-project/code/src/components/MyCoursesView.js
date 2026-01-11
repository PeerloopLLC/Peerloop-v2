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
  isCourseFollowed,
  handleFollowCourse,
  isCreatorFollowed,
  handleFollowInstructor
}) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'inprogress', or 'completed'
  const [searchQuery, setSearchQuery] = useState('');

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
                    {/* Instructor Profile Card */}
                    <div
                      onClick={() => {
                        // Navigate to creator profile in Browse
                        localStorage.setItem('pendingBrowseInstructor', JSON.stringify(instructor));
                        localStorage.setItem('browseActiveTopMenu', 'creators');
                        onMenuChange && onMenuChange('Browse');
                      }}
                      style={{
                        padding: 20,
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#1a1a24' : '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
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
                          <div style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: isDarkMode ? '#f5f5f7' : '#111827',
                            marginBottom: 4
                          }}>
                            {highlightMatch(instructor?.name || 'Unknown Instructor', searchQuery)}
                          </div>
                          <div style={{
                            fontSize: 14,
                            color: isDarkMode ? '#a1a1aa' : '#6b7280',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12
                          }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <AiOutlineTeam /> {(instructor?.stats?.studentsTaught || 0).toLocaleString()} followers
                            </span>
                            <span>·</span>
                            <span>{instructor?.title || 'Instructor'}</span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFollowInstructor && handleFollowInstructor(instructor?.id);
                          }}
                          style={{
                            padding: '8px 20px',
                            borderRadius: 20,
                            background: isFollowing ? 'transparent' : '#6366f1',
                            color: isFollowing ? '#6366f1' : '#fff',
                            border: isFollowing ? '1px solid #6366f1' : 'none',
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            flexShrink: 0
                          }}
                        >
                          {isFollowing ? 'Joined' : 'Join'}
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

                            {/* Course Card */}
                            <div
                              onClick={() => onViewCourse && onViewCourse(course.id)}
                              style={{
                                flex: 1,
                                padding: '12px 16px',
                                marginBottom: 8,
                                background: isDarkMode ? '#1a1a24' : '#f9fafb',
                                borderRadius: 12,
                                cursor: 'pointer',
                                border: isDarkMode ? '1px solid #27272a' : '1px solid #e5e7eb',
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
                              {/* Course Header */}
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                marginBottom: 8
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

                                {/* Status Badge */}
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  background: isCompleted
                                    ? (isDarkMode ? 'rgba(34, 197, 94, 0.2)' : '#dcfce7')
                                    : (isDarkMode ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe'),
                                  color: isCompleted ? '#22c55e' : '#3b82f6',
                                  padding: '2px 8px',
                                  borderRadius: 10,
                                  fontSize: 11,
                                  fontWeight: 600,
                                  flexShrink: 0
                                }}>
                                  {isCompleted ? (
                                    <><FaCheckCircle style={{ fontSize: 10 }} /> Done</>
                                  ) : (
                                    <><FaPlay style={{ fontSize: 8 }} /> {course.progress}%</>
                                  )}
                                </span>

                                {/* Follow/Unfollow Button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFollowCourse && handleFollowCourse(course.id);
                                  }}
                                  style={{
                                    padding: '4px 12px',
                                    borderRadius: 12,
                                    background: isFollowed ? 'transparent' : '#6366f1',
                                    color: isFollowed ? '#6366f1' : '#fff',
                                    border: isFollowed ? '1px solid #6366f1' : 'none',
                                    fontSize: 12,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    flexShrink: 0
                                  }}
                                >
                                  {isFollowed ? 'Unfollow' : 'Follow'}
                                </button>
                              </div>

                              {/* Progress Bar */}
                              <div style={{ paddingLeft: 40 }}>
                                <div style={{
                                  width: '100%',
                                  height: 4,
                                  background: isDarkMode ? '#374151' : '#e5e7eb',
                                  borderRadius: 2,
                                  overflow: 'hidden'
                                }}>
                                  <div style={{
                                    width: `${course.progress}%`,
                                    height: '100%',
                                    background: isCompleted
                                      ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                                      : 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
                                    borderRadius: 2,
                                    transition: 'width 0.3s ease'
                                  }} />
                                </div>

                                {/* Course Description */}
                                <div style={{
                                  fontSize: 13,
                                  lineHeight: 1.5,
                                  color: isDarkMode ? '#a1a1aa' : '#6b7280',
                                  marginTop: 8,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}>
                                  {highlightMatch(course.description, searchQuery)}
                                </div>

                                {/* Course Stats */}
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 12,
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
  isCourseFollowed: PropTypes.func,
  handleFollowCourse: PropTypes.func,
  isCreatorFollowed: PropTypes.func,
  handleFollowInstructor: PropTypes.func
};

export default MyCoursesView;
