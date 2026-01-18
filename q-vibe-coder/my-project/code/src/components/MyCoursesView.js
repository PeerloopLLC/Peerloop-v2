import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FaBook, FaSearch, FaCheckCircle, FaPlay, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { AiOutlineStar, AiOutlineTeam } from 'react-icons/ai';
import { getInstructorById } from '../data/database';

// Calendar Component
const CourseCalendar = ({ isDarkMode, scheduledDates, selectedDate, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getSessionCount = (day) => {
    if (!day) return 0;
    const dateKey = formatDateKey(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return scheduledDates[dateKey] || 0;
  };

  const isSelected = (day) => {
    if (!day || !selectedDate) return false;
    const dateKey = formatDateKey(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return selectedDate === dateKey;
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return day === today.getDate() &&
           currentMonth.getMonth() === today.getMonth() &&
           currentMonth.getFullYear() === today.getFullYear();
  };

  const handleDayClick = (day) => {
    if (!day) return;
    const dateKey = formatDateKey(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (selectedDate === dateKey) {
      onSelectDate(null); // Deselect if clicking same day
    } else {
      onSelectDate(dateKey);
    }
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div style={{
      padding: '8px 16px',
      borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
      background: isDarkMode ? '#000' : '#fff'
    }}>
      {/* Month Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6
      }}>
        <button
          onClick={prevMonth}
          style={{
            background: 'transparent',
            border: 'none',
            color: isDarkMode ? '#71767b' : '#536471',
            cursor: 'pointer',
            padding: 4,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12
          }}
        >
          <FaChevronLeft />
        </button>
        <span style={{
          fontSize: 13,
          fontWeight: 600,
          color: isDarkMode ? '#e7e9ea' : '#0f1419'
        }}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button
          onClick={nextMonth}
          style={{
            background: 'transparent',
            border: 'none',
            color: isDarkMode ? '#71767b' : '#536471',
            cursor: 'pointer',
            padding: 4,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12
          }}
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Day Headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 1,
        marginBottom: 2
      }}>
        {dayNames.map(day => (
          <div key={day} style={{
            textAlign: 'center',
            fontSize: 10,
            fontWeight: 500,
            color: isDarkMode ? '#71767b' : '#536471',
            padding: '2px 0'
          }}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 1
      }}>
        {days.map((day, index) => {
          const sessionCount = getSessionCount(day);
          const selected = isSelected(day);
          const today = isToday(day);

          return (
            <div
              key={index}
              onClick={() => handleDayClick(day)}
              style={{
                height: 32,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: day ? 'pointer' : 'default',
                borderRadius: 6,
                background: selected
                  ? '#1d9bf0'
                  : today
                    ? (isDarkMode ? '#2f3336' : '#eff3f4')
                    : 'transparent',
                transition: 'all 0.15s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (day && !selected) {
                  e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#eff3f4';
                }
              }}
              onMouseLeave={(e) => {
                if (day && !selected && !today) {
                  e.currentTarget.style.background = 'transparent';
                } else if (today && !selected) {
                  e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#eff3f4';
                }
              }}
            >
              <span style={{
                fontSize: 11,
                fontWeight: today || selected ? 600 : 400,
                color: selected
                  ? '#fff'
                  : (isDarkMode ? '#e7e9ea' : '#0f1419')
              }}>
                {day || ''}
              </span>
              {/* Session dots - larger */}
              {sessionCount > 0 && (
                <div style={{
                  display: 'flex',
                  gap: 2,
                  marginTop: 1
                }}>
                  {sessionCount === 1 && (
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: selected ? '#fff' : '#1d9bf0'
                    }} />
                  )}
                  {sessionCount >= 2 && (
                    <>
                      <div style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: selected ? '#fff' : '#1d9bf0'
                      }} />
                      <div style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: selected ? '#fff' : '#1d9bf0'
                      }} />
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend - compact */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginTop: 6,
        fontSize: 10,
        color: isDarkMode ? '#71767b' : '#536471'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1d9bf0' }} />
          scheduled
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <div style={{ display: 'flex', gap: 2 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1d9bf0' }} />
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1d9bf0' }} />
          </div>
          multiple
        </span>
      </div>
    </div>
  );
};

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
  handleFollowInstructor,
  scheduledSessions = [],
  addScheduledSession,
  cancelScheduledSession
}) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'inprogress', or 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(null); // Selected date for filtering

  // Calculate scheduled dates from sessions (for calendar dots)
  const scheduledDates = useMemo(() => {
    const dates = {};
    scheduledSessions
      .filter(s => s.status === 'scheduled')
      .forEach(session => {
        if (dates[session.date]) {
          dates[session.date]++;
        } else {
          dates[session.date] = 1;
        }
      });
    return dates;
  }, [scheduledSessions]);

  // Get sessions for selected date
  const sessionsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return scheduledSessions.filter(s => s.date === selectedDate && s.status === 'scheduled');
  }, [selectedDate, scheduledSessions]);

  // Get course IDs that have sessions on selected date
  const courseIdsForSelectedDate = useMemo(() => {
    return new Set(sessionsForSelectedDate.map(s => s.courseId));
  }, [sessionsForSelectedDate]);

  // Group scheduled sessions by instructor for selected date (same format as filteredGroups)
  const scheduledGroupsByInstructor = useMemo(() => {
    if (!selectedDate || sessionsForSelectedDate.length === 0) return [];

    const groups = {};

    sessionsForSelectedDate.forEach(session => {
      const course = indexedCourses.find(c => c.id === session.courseId);
      if (!course) return;

      const instructorId = course.instructorId;
      if (!groups[instructorId]) {
        const instructor = getInstructorById(instructorId);
        groups[instructorId] = {
          instructor,
          courses: []
        };
      }

      // Add course with session info
      const existingCourse = groups[instructorId].courses.find(c => c.id === course.id);
      if (!existingCourse) {
        groups[instructorId].courses.push({
          ...course,
          session: session, // Attach the session info
          progress: Math.floor(Math.random() * 100),
          lessonsCompleted: Math.floor(Math.random() * 20),
          totalLessons: 20,
          lastAccessed: '2 days ago'
        });
      }
    });

    return Object.values(groups);
  }, [selectedDate, sessionsForSelectedDate, indexedCourses]);

  // Format date for display
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  // Banner color from Profile settings (same as DiscoverView)
  const userBannerColor = localStorage.getItem('profileBannerColor') || 'blue';

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

  // Get earliest scheduled session date for a course
  const getEarliestSessionDate = (courseId) => {
    const sessions = scheduledSessions
      .filter(s => s.courseId === courseId && s.status === 'scheduled')
      .map(s => s.date)
      .sort();
    return sessions.length > 0 ? sessions[0] : null;
  };

  // Filter based on tab and search, then sort by scheduled date
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

      // Sort courses by earliest scheduled session date (courses with sessions first)
      const sortedCourses = [...filteredCourses].sort((a, b) => {
        const dateA = getEarliestSessionDate(a.id);
        const dateB = getEarliestSessionDate(b.id);

        // Courses with sessions come before courses without
        if (dateA && !dateB) return -1;
        if (!dateA && dateB) return 1;
        if (!dateA && !dateB) return 0;

        // Both have sessions, sort by date
        return dateA.localeCompare(dateB);
      });

      return {
        ...group,
        courses: sortedCourses
      };
    }).filter(group => group.courses.length > 0);
  }, [coursesGroupedByInstructor, searchQuery, activeTab, scheduledSessions]);

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

          {/* Calendar Section */}
          <CourseCalendar
            isDarkMode={isDarkMode}
            scheduledDates={scheduledDates}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          {/* Sessions for Selected Date - Grouped by Instructor */}
          {selectedDate && scheduledGroupsByInstructor.length > 0 && (
            <>
              {/* Header */}
              <div style={{
                padding: '12px 20px',
                background: isDarkMode ? 'rgba(29, 155, 240, 0.08)' : 'rgba(29, 155, 240, 0.05)',
                borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
              }}>
                <h3 style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#1d9bf0',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  📅 Scheduled for {formatDateForDisplay(selectedDate)}
                </h3>
              </div>

              {/* Scheduled Courses - Grouped by Instructor */}
              {scheduledGroupsByInstructor.map((group) => {
                const { instructor, courses } = group;
                const isFollowing = isCreatorFollowed ? isCreatorFollowed(instructor?.id) : false;

                return (
                  <div
                    key={`scheduled-${instructor?.id || 'unknown'}`}
                    style={{
                      background: isDarkMode ? '#12121a' : '#fff',
                      borderBottom: isDarkMode ? '1px solid #27272a' : '1px solid #e5e7eb'
                    }}
                  >
                    {/* Instructor Profile Card */}
                    <div
                      onClick={() => {
                        if (onViewCreatorProfile) {
                          onViewCreatorProfile(instructor);
                        } else {
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
                              {instructor?.name || 'Unknown Instructor'}
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
                        >
                          {isFollowing ? 'Joined' : 'Join Community'}
                        </button>
                      </div>

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
                          {instructor.bio}
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
                        const isFollowed = isCourseFollowed ? isCourseFollowed(course.id) : false;
                        const thumbGradients = [
                          'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #a855f7 100%)',
                          'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
                          'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
                          'linear-gradient(135deg, #0d4f6e 0%, #0891b2 100%)'
                        ];

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
                              {/* Course Thumbnail */}
                              <div style={{
                                width: 100,
                                height: 70,
                                borderRadius: 8,
                                flexShrink: 0,
                                background: thumbGradients[index % 4]
                              }} />

                              {/* Course Info */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  fontSize: 15,
                                  fontWeight: 600,
                                  color: '#1d9bf0'
                                }}>
                                  {course.title}
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
                                  {course.description}
                                </div>

                                {/* Course Stats */}
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

                                {/* Session Time Badge */}
                                {course.session && (
                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    marginTop: 8,
                                    fontSize: 12,
                                    color: '#1d9bf0',
                                    fontWeight: 600
                                  }}>
                                    <span>🕐</span>
                                    <span>{course.session.time}</span>
                                    <span style={{ color: isDarkMode ? '#71767b' : '#536471', fontWeight: 400 }}>
                                      with {course.session.studentTeacherName}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Follow Button */}
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
              })}

              {/* Divider before All Courses */}
              <div style={{
                padding: '12px 20px',
                background: isDarkMode ? '#16181c' : '#f7f9f9',
                borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
              }}>
                <div style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: isDarkMode ? '#71767b' : '#536471'
                }}>
                  All Courses
                </div>
              </div>
            </>
          )}

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

                                {/* Scheduled Session Display */}
                                {(() => {
                                  const nextSession = scheduledSessions
                                    .filter(s => s.courseId === course.id && s.status === 'scheduled')
                                    .sort((a, b) => a.date.localeCompare(b.date))[0];

                                  if (nextSession) {
                                    return (
                                      <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        marginTop: 8,
                                        fontSize: 12,
                                        color: '#1d9bf0'
                                      }}>
                                        <span>📅</span>
                                        <span>
                                          Next: {formatDateForDisplay(nextSession.date)} at {nextSession.time}
                                        </span>
                                        <span style={{ color: isDarkMode ? '#71767b' : '#536471' }}>
                                          with {nextSession.studentTeacherName}
                                        </span>
                                      </div>
                                    );
                                  }
                                  return (
                                    <div style={{
                                      marginTop: 8,
                                      fontSize: 12,
                                      color: isDarkMode ? '#71767b' : '#9ca3af',
                                      fontStyle: 'italic'
                                    }}>
                                      No scheduled session
                                    </div>
                                  );
                                })()}
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
  handleFollowInstructor: PropTypes.func,
  scheduledSessions: PropTypes.array,
  addScheduledSession: PropTypes.func,
  cancelScheduledSession: PropTypes.func
};

export default MyCoursesView;
