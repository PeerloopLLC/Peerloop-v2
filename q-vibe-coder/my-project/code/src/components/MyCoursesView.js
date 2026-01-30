import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { FaBook, FaSearch, FaCheckCircle, FaPlay, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { AiOutlineStar, AiOutlineTeam } from 'react-icons/ai';
import { getInstructorById, iconConfig } from '../data/database';

// Course abbreviation helper - matches DiscoverView
const getCourseAbbreviation = (title) => {
  if (!title) return '??';

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

  for (const [key, abbr] of Object.entries(mappings)) {
    if (lowerTitle.includes(key)) return abbr;
  }

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
                fontSize: 14,
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
  userStatus,  // New unified status hook (optional during migration)
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
  cancelScheduledSession,
  onRescheduleSession,
  onScheduleSession
}) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'inprogress', or 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(null); // Selected date for filtering
  const [courseViewTab, setCourseViewTab] = useState('active'); // 'active' or 'completed'

  // Dropdown state for community follow menu
  const [openCommunityFollowDropdown, setOpenCommunityFollowDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Reschedule dropdown state
  const [openRescheduleDropdown, setOpenRescheduleDropdown] = useState(null); // { session, course } or null
  const [rescheduleDropdownPosition, setRescheduleDropdownPosition] = useState({ top: 0, left: 0 });

  // Apply to Teach dropdown state
  const [openApplyToTeachDropdown, setOpenApplyToTeachDropdown] = useState(null); // course id or null
  const [applyToTeachDropdownPosition, setApplyToTeachDropdownPosition] = useState({ top: 0, left: 0 });

  // Apply to Teach modal state (for confirmation after dropdown)
  const [applyToTeachModal, setApplyToTeachModal] = useState(null); // course object or null
  const [applyToTeachStep, setApplyToTeachStep] = useState('confirm'); // 'confirm' or 'submitted'
  const [teachingApplications, setTeachingApplications] = useState(() => {
    // Load from localStorage
    const saved = localStorage.getItem('teachingApplications');
    return saved ? JSON.parse(saved) : {};
  });

  // Save teaching applications to localStorage when changed
  useEffect(() => {
    localStorage.setItem('teachingApplications', JSON.stringify(teachingApplications));
  }, [teachingApplications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openCommunityFollowDropdown &&
          !event.target.closest('.community-follow-dropdown-wrapper') &&
          !event.target.closest('.community-follow-dropdown-menu')) {
        setOpenCommunityFollowDropdown(null);
      }
      if (openRescheduleDropdown &&
          !event.target.closest('.reschedule-dropdown-wrapper') &&
          !event.target.closest('.reschedule-dropdown-menu')) {
        setOpenRescheduleDropdown(null);
      }
      if (openApplyToTeachDropdown &&
          !event.target.closest('.apply-to-teach-dropdown-wrapper') &&
          !event.target.closest('.apply-to-teach-dropdown-menu')) {
        setOpenApplyToTeachDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openCommunityFollowDropdown, openRescheduleDropdown, openApplyToTeachDropdown]);

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

  // Check if a course is completed (certified) based on sessions
  const isCourseCompleted = (courseId) => {
    const courseSessions = scheduledSessions.filter(s => s.courseId === courseId);
    if (courseSessions.length === 0) return false;
    // Course is completed if ALL sessions are completed (none scheduled)
    const hasScheduled = courseSessions.some(s => s.status === 'scheduled');
    const hasCompleted = courseSessions.some(s => s.status === 'completed');
    return !hasScheduled && hasCompleted;
  };

  // Split courses into Active and Completed groups by instructor
  const { activeCoursesGroups, completedCoursesGroups } = useMemo(() => {
    const activeGroups = {};
    const completedGroups = {};

    myCoursesData.forEach(course => {
      const instructorId = course.instructorId;
      const instructor = getInstructorById(instructorId);
      const isCompleted = isCourseCompleted(course.id) || course.progress === 100;

      // Determine which group to add to
      const targetGroups = isCompleted ? completedGroups : activeGroups;

      if (!targetGroups[instructorId]) {
        targetGroups[instructorId] = {
          instructor,
          courses: []
        };
      }
      targetGroups[instructorId].courses.push(course);
    });

    return {
      activeCoursesGroups: Object.values(activeGroups),
      completedCoursesGroups: Object.values(completedGroups)
    };
  }, [myCoursesData, scheduledSessions]);

  // Count active and completed courses
  const activeCoursesCount = activeCoursesGroups.reduce((sum, g) => sum + g.courses.length, 0);
  const completedCoursesCount = completedCoursesGroups.reduce((sum, g) => sum + g.courses.length, 0);

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

  // Get teaching application status for a course
  const getTeachingStatus = (courseId) => {
    return teachingApplications[courseId] || null; // null, 'pending', or 'approved'
  };

  // Handle Apply to Teach button click
  const handleApplyToTeachClick = (course, e) => {
    e.stopPropagation();
    const status = getTeachingStatus(course.id);
    if (!status) {
      // Not applied yet - open modal
      setApplyToTeachModal(course);
      setApplyToTeachStep('confirm');
    }
    // If already pending or approved, button is just informational
  };

  // Handle submitting application
  const handleSubmitApplication = () => {
    if (applyToTeachModal) {
      setTeachingApplications(prev => ({
        ...prev,
        [applyToTeachModal.id]: 'pending'
      }));
      setApplyToTeachStep('submitted');
    }
  };

  // Close modal
  const closeApplyToTeachModal = () => {
    setApplyToTeachModal(null);
    setApplyToTeachStep('confirm');
  };

  // Get instructor for a course
  const getInstructorForCourse = (course) => {
    return getInstructorById(course?.instructorId);
  };

  // Render Apply to Teach Modal
  const renderApplyToTeachModal = () => {
    if (!applyToTeachModal) return null;

    const course = applyToTeachModal;
    const instructor = getInstructorForCourse(course);

    return ReactDOM.createPortal(
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000
        }}
        onClick={closeApplyToTeachModal}
      >
        <div
          style={{
            background: isDarkMode ? '#16181c' : '#fff',
            borderRadius: 16,
            width: '100%',
            maxWidth: 380,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div style={{
            padding: 20,
            borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <button
              onClick={closeApplyToTeachModal}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: 'none',
                background: 'transparent',
                fontSize: 20,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDarkMode ? '#e7e9ea' : '#0f1419'
              }}
            >
              ×
            </button>
            <h3 style={{
              fontSize: 20,
              fontWeight: 700,
              color: isDarkMode ? '#e7e9ea' : '#0f1419',
              margin: 0
            }}>
              {applyToTeachStep === 'confirm' ? 'Become a Teacher' : ''}
            </h3>
          </div>

          {/* Modal Body */}
          <div style={{ padding: 20 }}>
            {applyToTeachStep === 'confirm' ? (
              <>
                {/* Course Card */}
                <div style={{
                  background: isDarkMode ? '#2f3336' : '#f7f9f9',
                  borderRadius: 12,
                  padding: 16,
                  display: 'flex',
                  gap: 12,
                  marginBottom: 20
                }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    background: course.thumbnailGradient || 'linear-gradient(135deg, #06b6d4, #0891b2)',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 14,
                    flexShrink: 0
                  }}>
                    {getCourseAbbreviation(course.title)}
                  </div>
                  <div>
                    <div style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: isDarkMode ? '#e7e9ea' : '#0f1419',
                      marginBottom: 4
                    }}>
                      {course.title}
                    </div>
                    <div style={{
                      fontSize: 13,
                      color: isDarkMode ? '#71767b' : '#536471'
                    }}>
                      by {instructor?.name || 'Unknown'}
                    </div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      background: '#dcfce7',
                      color: '#15803d',
                      padding: '4px 10px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      marginTop: 8
                    }}>
                      ✓ Certified
                    </div>
                  </div>
                </div>

                {/* Checklist */}
                <div style={{ marginBottom: 20 }}>
                  {[
                    'You completed this course',
                    "You're certified to teach",
                    'Earn 70% per session'
                  ].map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 0',
                      fontSize: 14,
                      color: isDarkMode ? '#e7e9ea' : '#0f1419'
                    }}>
                      <span style={{
                        width: 20,
                        height: 20,
                        background: '#10b981',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 12
                      }}>
                        ✓
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Earnings Preview */}
                <div style={{
                  background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 20,
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: 12,
                    color: '#92400e',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: 4
                  }}>
                    Potential Earnings
                  </div>
                  <div style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: '#78350f'
                  }}>
                    $35/session
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: '#a16207',
                    marginTop: 4
                  }}>
                    Based on $50 session price
                  </div>
                </div>

                {/* Buttons */}
                <button
                  onClick={handleSubmitApplication}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: 25,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                    background: '#10b981',
                    color: '#fff',
                    transition: 'all 0.2s'
                  }}
                >
                  Yes, I Want to Teach
                </button>
                <button
                  onClick={closeApplyToTeachModal}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: 25,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                    background: 'transparent',
                    color: isDarkMode ? '#71767b' : '#536471',
                    marginTop: 10,
                    transition: 'all 0.2s'
                  }}
                >
                  Not Now
                </button>
              </>
            ) : (
              /* Step 2: Application Submitted */
              <>
                {/* Green Submitted Box */}
                <div style={{
                  background: '#dcfce7',
                  borderRadius: 12,
                  padding: 20,
                  marginBottom: 20,
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
                  <div style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#15803d'
                  }}>
                    Application Submitted
                  </div>
                </div>

                {/* Course Card */}
                <div style={{
                  background: isDarkMode ? '#2f3336' : '#f7f9f9',
                  borderRadius: 12,
                  padding: 16,
                  display: 'flex',
                  gap: 12,
                  marginBottom: 20
                }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    background: course.thumbnailGradient || 'linear-gradient(135deg, #06b6d4, #0891b2)',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 14,
                    flexShrink: 0
                  }}>
                    {getCourseAbbreviation(course.title)}
                  </div>
                  <div>
                    <div style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: isDarkMode ? '#e7e9ea' : '#0f1419',
                      marginBottom: 4
                    }}>
                      {course.title}
                    </div>
                    <div style={{
                      fontSize: 13,
                      color: isDarkMode ? '#71767b' : '#536471'
                    }}>
                      by {instructor?.name || 'Unknown'}
                    </div>
                  </div>
                </div>

                {/* Go To Workspace Button */}
                <button
                  onClick={() => {
                    closeApplyToTeachModal();
                    // Navigate to workspace/home
                    onMenuChange && onMenuChange('Home');
                  }}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: 25,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                    background: '#10b981',
                    color: '#fff',
                    transition: 'all 0.2s'
                  }}
                >
                  Go To Workspace
                </button>

                {/* Notification Note */}
                <p style={{
                  textAlign: 'center',
                  fontSize: 13,
                  color: isDarkMode ? '#71767b' : '#536471',
                  marginTop: 12,
                  marginBottom: 0
                }}>
                  Look for notifications for approval
                </p>
              </>
            )}
          </div>
        </div>
      </div>,
      document.body
    );
  };

  // Helper function to render an instructor group with courses
  const renderInstructorGroup = (group, keyPrefix, isCompletedSection = false) => {
    const { instructor, courses } = group;
    const isFollowing = isCreatorFollowed ? isCreatorFollowed(instructor?.id) : false;

    return (
      <div
        key={`${keyPrefix}-${instructor?.id || 'unknown'}`}
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
            {/* Community Circle Avatar */}
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

            <div style={{ flex: 1, minWidth: 0 }}>
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
                  {highlightMatch(instructor?.communityName || `${instructor?.name} Community`, searchQuery)}
                </span>
                <span style={{
                  color: isDarkMode ? '#71767b' : '#536471',
                  fontSize: 15
                }}>
                  @{(instructor?.communityName || instructor?.name)?.toLowerCase().replace(/\s+/g, '').replace(/\./g, '') || 'unknown'}
                </span>
                <span style={{ color: isDarkMode ? '#71767b' : '#536471' }}>·</span>
                {/* Following dropdown - inline after @handle */}
                <div
                  className="community-follow-dropdown-wrapper"
                  style={{ position: 'relative', display: 'inline-block', zIndex: 9999 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      const dropdownKey = `mycourses-${instructor?.id}`;
                      const isOpening = openCommunityFollowDropdown !== dropdownKey;
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
                        openCommunityFollowDropdown === dropdownKey ? null : dropdownKey
                      );
                    }}
                    style={{
                      color: '#1d9bf0',
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      transition: 'color 0.15s'
                    }}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                    <span style={{ fontSize: 10, marginLeft: 4 }}>▼</span>
                  </span>
                  {/* Dropdown menu portal */}
                  {openCommunityFollowDropdown === `mycourses-${instructor?.id}` && ReactDOM.createPortal(
                    <div className="community-follow-dropdown-portal community-follow-dropdown-menu" style={{
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
                        const followedCoursesCount = courses.filter(c => isCourseFollowed && isCourseFollowed(c.id)).length;
                        const hasAnyFollowed = isFollowing || followedCoursesCount > 0;

                        return (
                          <>
                            {/* Community section */}
                            <div style={{
                              padding: '6px 16px 2px',
                              fontSize: 11,
                              fontWeight: 600,
                              color: isDarkMode ? '#71767b' : '#536471',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              Community
                            </div>
                            <div
                              style={{
                                padding: '8px 16px',
                                cursor: 'pointer',
                                fontSize: 14,
                                color: isFollowing ? '#1d9bf0' : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                                fontWeight: isFollowing ? 500 : 400,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFollowInstructor && handleFollowInstructor(instructor?.id);
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#f8fafc'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              <span style={{ width: 16 }}>{isFollowing && '✓'}</span>
                              <span>{instructor?.communityName || instructor?.name}</span>
                            </div>

                            {/* Courses section */}
                            <div style={{
                              padding: '10px 16px 2px',
                              fontSize: 11,
                              fontWeight: 600,
                              color: isDarkMode ? '#71767b' : '#536471',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              borderTop: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
                              marginTop: 4
                            }}>
                              Courses
                            </div>
                            {courses.map(course => {
                              const isCourseFollowedState = isCourseFollowed ? isCourseFollowed(course.id) : false;
                              return (
                                <div
                                  key={course.id}
                                  style={{
                                    padding: '10px 16px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    fontSize: 14,
                                    color: isCourseFollowedState ? '#1d9bf0' : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                                    fontWeight: isCourseFollowedState ? 500 : 400
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFollowCourse && handleFollowCourse(course.id);
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#f8fafc'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                  <span style={{ width: 16, flexShrink: 0 }}>{isCourseFollowedState && '✓'}</span>
                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</span>
                                </div>
                              );
                            })}

                            {/* Unfollow all */}
                            {hasAnyFollowed && (
                              <>
                                <div style={{ borderTop: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4', margin: '4px 0' }} />
                                <div
                                  style={{
                                    padding: '10px 16px',
                                    cursor: 'pointer',
                                    fontSize: 13,
                                    color: '#f4212e',
                                    fontWeight: 500
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    courses.forEach(c => {
                                      if (isCourseFollowed && isCourseFollowed(c.id)) {
                                        handleFollowCourse && handleFollowCourse(c.id);
                                      }
                                    });
                                    if (isFollowing) {
                                      handleFollowInstructor && handleFollowInstructor(instructor?.id);
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
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 2
              }}>
                <span style={{ fontSize: 13, color: isDarkMode ? '#71767b' : '#536471' }}>Created by</span>
                <span style={{ fontSize: 13, color: '#1d9bf0', fontWeight: 500 }}>{instructor?.name}</span>
              </div>
              <div style={{
                fontSize: 14,
                color: isDarkMode ? '#a1a1aa' : '#6b7280',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 2
              }}>
                <AiOutlineTeam style={{ fontSize: 16 }} />
                <span>{(instructor?.stats?.studentsTaught || 0).toLocaleString()} followers</span>
                <span style={{ margin: '0 4px' }}>•</span>
                <span>{instructor?.title || 'Instructor'}</span>
              </div>
            </div>
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
              {highlightMatch(instructor.bio, searchQuery)}
            </div>
          )}
        </div>

        {/* Courses Section with Connector Lines - Matches Discover */}
        <div style={{
          position: 'relative',
          paddingLeft: 48,
          paddingRight: 20,
          paddingBottom: 16,
          marginLeft: 20
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

          {courses.map((course, index) => {
            const isLast = index === courses.length - 1;
            const courseIsCompleted = isCourseCompleted(course.id) || course.progress === 100;
            const isFollowed = isCourseFollowed ? isCourseFollowed(course.id) : false;

            // Get completion date for completed courses
            const completedSession = scheduledSessions
              .filter(s => s.courseId === course.id && s.status === 'completed')
              .sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0];

            return (
              <div
                key={course.id}
                style={{
                  position: 'relative',
                  marginBottom: 12
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
                  background: '#4facfe',
                  border: '2px solid #fff',
                  boxShadow: isDarkMode ? '0 0 0 2px #2f3336' : '0 0 0 2px #d0e8f0',
                  zIndex: 1
                }} />

                {/* Course Card */}
                <div
                  onClick={() => onViewCourse && onViewCourse(course.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: 16,
                    background: isDarkMode ? '#16181c' : '#f7f9f9',
                    borderRadius: 12,
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
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    flexShrink: 0,
                    background: course.thumbnailGradient || iconConfig.course.gradient,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* Course Letter Badge */}
                    <span style={{
                      color: '#fff',
                      fontSize: 18,
                      fontWeight: 700,
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}>
                      {getCourseAbbreviation(course.title)}
                    </span>
                    {/* Certified Badge for completed courses */}
                    {isCompletedSection && (
                      <div style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        background: '#10b981',
                        color: '#fff',
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontSize: 9,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3
                      }}>
                        <FaCheckCircle style={{ fontSize: 8 }} /> CERTIFIED
                      </div>
                    )}
                  </div>

                  {/* Course Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: isDarkMode ? '#e7e9ea' : '#0f1419',
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 6
                    }}>
                      <span
                        style={{ color: '#1d9bf0', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                      >
                        {highlightMatch(course.title, searchQuery)}
                      </span>
                      <span style={{ color: isDarkMode ? '#71767b' : '#536471', fontWeight: 400 }}>·</span>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollowCourse && handleFollowCourse(course.id);
                        }}
                        style={{
                          color: '#1d9bf0',
                          fontSize: 15,
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'color 0.15s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                      >
                        {isFollowed ? 'Following' : 'Follow'}
                      </span>
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

                    {/* Session Display - different for active vs completed */}
                    {isCompletedSection ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        marginTop: 8,
                        fontSize: 12,
                        color: '#10b981'
                      }}>
                        <FaCheckCircle />
                        <span>Completed: {completedSession ? formatDateForDisplay(completedSession.date) : 'Recently'}</span>
                      </div>
                    ) : (
                      (() => {
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
                              color: '#1d9bf0',
                              flexWrap: 'wrap'
                            }}>
                              <span>📅</span>
                              <span>
                                Next: {formatDateForDisplay(nextSession.date)} at {nextSession.time}
                              </span>
                              <span style={{ color: isDarkMode ? '#71767b' : '#536471' }}>
                                with {nextSession.teacherName || nextSession.studentTeacherName || 'your teacher'}
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
                      })()
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                    {/* Schedule Now button - only show for active courses without scheduled sessions */}
                    {!isCompletedSection && (() => {
                      const scheduledSession = scheduledSessions
                        .filter(s => s.courseId === course.id && s.status === 'scheduled')
                        .sort((a, b) => a.date.localeCompare(b.date))[0];

                      if (!scheduledSession) {
                        return (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onScheduleSession && onScheduleSession(course);
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
                              transition: 'all 0.2s'
                            }}
                          >
                            Schedule Now
                          </button>
                        );
                      }
                      return (
                        <div className="reschedule-dropdown-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = e.currentTarget.getBoundingClientRect();
                              setRescheduleDropdownPosition({
                                top: rect.bottom + window.scrollY + 4,
                                left: rect.left + window.scrollX
                              });
                              setOpenRescheduleDropdown(
                                openRescheduleDropdown?.session?.id === scheduledSession.id
                                  ? null
                                  : { session: scheduledSession, course }
                              );
                            }}
                            style={{
                              color: '#1d9bf0',
                              fontSize: 15,
                              fontWeight: 600,
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              transition: 'color 0.15s'
                            }}
                          >
                            Reschedule
                            <span style={{ fontSize: 10, marginLeft: 4 }}>▼</span>
                          </span>
                          {openRescheduleDropdown?.session?.id === scheduledSession.id && ReactDOM.createPortal(
                            <div
                              className="reschedule-dropdown-menu"
                              style={{
                                position: 'absolute',
                                top: rescheduleDropdownPosition.top,
                                left: rescheduleDropdownPosition.left,
                                background: isDarkMode ? '#000' : '#fff',
                                border: `1px solid ${isDarkMode ? '#2f3336' : '#e2e8f0'}`,
                                borderRadius: 16,
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                zIndex: 99999,
                                minWidth: 320,
                                overflow: 'hidden'
                              }}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const session = openRescheduleDropdown.session;
                                  setOpenRescheduleDropdown(null);
                                  onRescheduleSession && onRescheduleSession({ ...session, rescheduleMode: 'teacher' });
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  width: '100%',
                                  padding: '16px 24px',
                                  background: 'none',
                                  border: 'none',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  transition: 'background 0.15s ease'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                              >
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>Choose Your Teacher</div>
                                  <div style={{ fontSize: 13, color: isDarkMode ? '#71767b' : '#536471', lineHeight: 1.4 }}>
                                    Browse student teachers. See availability and book sessions.
                                  </div>
                                </div>
                                <span style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 20, marginLeft: 12 }}>›</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const session = openRescheduleDropdown.session;
                                  setOpenRescheduleDropdown(null);
                                  onRescheduleSession && onRescheduleSession({ ...session, rescheduleMode: 'time' });
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  width: '100%',
                                  padding: '16px 24px',
                                  background: 'none',
                                  border: 'none',
                                  borderTop: `1px solid ${isDarkMode ? '#2f3336' : '#e2e8f0'}`,
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  transition: 'background 0.15s ease'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                              >
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>Choose Your Schedule</div>
                                  <div style={{ fontSize: 13, color: isDarkMode ? '#71767b' : '#536471', lineHeight: 1.4 }}>
                                    Pick dates that work for you. See who's available.
                                  </div>
                                </div>
                                <span style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 20, marginLeft: 12 }}>›</span>
                              </button>
                            </div>,
                            document.body
                          )}
                        </div>
                      );
                    })()}

                    {isCompletedSection && (
                      // Apply to Teach button/dropdown with status
                      (() => {
                        const teachStatus = getTeachingStatus(course.id);

                        // Already pending or approved - show status button (no dropdown)
                        if (teachStatus === 'pending') {
                          return (
                            <button
                              style={{
                                background: '#fef3c7',
                                border: 'none',
                                color: '#92400e',
                                cursor: 'default',
                                padding: '6px 16px',
                                borderRadius: 20,
                                fontSize: 14,
                                fontWeight: 600,
                                whiteSpace: 'nowrap'
                              }}
                            >
                              Pending Approval
                            </button>
                          );
                        }

                        if (teachStatus === 'approved') {
                          return (
                            <button
                              style={{
                                background: '#fff',
                                border: '2px solid #10b981',
                                color: '#10b981',
                                cursor: 'default',
                                padding: '6px 16px',
                                borderRadius: 20,
                                fontSize: 14,
                                fontWeight: 600,
                                whiteSpace: 'nowrap'
                              }}
                            >
                              Approved
                            </button>
                          );
                        }

                        // Not applied yet - show dropdown button
                        return (
                          <div className="apply-to-teach-dropdown-wrapper" style={{ position: 'relative' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const rect = e.currentTarget.getBoundingClientRect();
                                setApplyToTeachDropdownPosition({
                                  top: rect.bottom + window.scrollY + 4,
                                  left: rect.left + window.scrollX
                                });
                                setOpenApplyToTeachDropdown(
                                  openApplyToTeachDropdown === course.id ? null : course.id
                                );
                              }}
                              style={{
                                background: '#10b981',
                                border: 'none',
                                color: '#fff',
                                cursor: 'pointer',
                                padding: '6px 16px',
                                borderRadius: 20,
                                fontSize: 14,
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s'
                              }}
                            >
                              Apply to Teach
                            </button>
                            {openApplyToTeachDropdown === course.id && ReactDOM.createPortal(
                              <div
                                className="apply-to-teach-dropdown-menu"
                                style={{
                                  position: 'absolute',
                                  top: applyToTeachDropdownPosition.top,
                                  left: applyToTeachDropdownPosition.left,
                                  background: isDarkMode ? '#16181c' : '#fff',
                                  border: `1px solid ${isDarkMode ? '#2f3336' : '#e1e8ed'}`,
                                  borderRadius: 12,
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                  zIndex: 99999,
                                  minWidth: 280,
                                  overflow: 'hidden'
                                }}
                              >
                                <div style={{ padding: '12px 16px', borderBottom: `1px solid ${isDarkMode ? '#2f3336' : '#e1e8ed'}` }}>
                                  <div style={{ fontSize: 14, fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>
                                    Apply to Teach
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenApplyToTeachDropdown(null);
                                    handleApplyToTeachClick(course, e);
                                  }}
                                  style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '12px 16px',
                                    background: 'none',
                                    border: 'none',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    color: isDarkMode ? '#e7e9ea' : '#0f1419',
                                    fontSize: 14
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#f7f9f9'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                                >
                                  <div style={{ fontWeight: 600, marginBottom: 2 }}>Send request to become a student teacher</div>
                                  <div style={{ fontSize: 12, color: isDarkMode ? '#71767b' : '#536471' }}>
                                    Apply to help others learn this course
                                  </div>
                                </button>
                              </div>,
                              document.body
                            )}
                          </div>
                        );
                      })()
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
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
          {/* Header - Title and Search */}
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
            minHeight: 52
          }}>
            {/* Title */}
            <h1 style={{
              fontSize: 18,
              fontWeight: 700,
              color: isDarkMode ? '#e7e9ea' : '#0f1419',
              margin: 0
            }}>
              My Courses
            </h1>

            {/* Search box on right */}
            <div style={{
              width: 150,
              display: 'flex',
              alignItems: 'center'
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

          {/* Active/Completed Tabs - Pill Style (matching Community.js pills) */}
          <div style={{
            padding: '12px 20px',
            borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
            background: isDarkMode ? '#000' : '#fff'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <button
                onClick={() => setCourseViewTab('active')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 20,
                  border: courseViewTab === 'active'
                    ? '2px solid #1d9bf0'
                    : (isDarkMode ? '2px solid #536471' : '2px solid #cfd9de'),
                  background: courseViewTab === 'active'
                    ? (isDarkMode ? 'rgba(29, 155, 240, 0.15)' : 'rgba(29, 155, 240, 0.1)')
                    : (isDarkMode ? '#2f3336' : '#f7f9f9'),
                  color: courseViewTab === 'active'
                    ? '#1d9bf0'
                    : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                Active Courses ({activeCoursesCount})
              </button>
              <button
                onClick={() => setCourseViewTab('completed')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 20,
                  border: courseViewTab === 'completed'
                    ? '2px solid #1d9bf0'
                    : (isDarkMode ? '2px solid #536471' : '2px solid #cfd9de'),
                  background: courseViewTab === 'completed'
                    ? (isDarkMode ? 'rgba(29, 155, 240, 0.15)' : 'rgba(29, 155, 240, 0.1)')
                    : (isDarkMode ? '#2f3336' : '#f7f9f9'),
                  color: courseViewTab === 'completed'
                    ? '#1d9bf0'
                    : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                Completed Courses ({completedCoursesCount})
              </button>
            </div>
          </div>

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
                        {/* Community Circle Avatar */}
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

                        <div style={{ flex: 1, minWidth: 0 }}>
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
                              {instructor?.communityName || `${instructor?.name} Community`}
                            </span>
                            <span style={{
                              color: isDarkMode ? '#71767b' : '#536471',
                              fontSize: 15
                            }}>
                              @{(instructor?.communityName || instructor?.name)?.toLowerCase().replace(/\s+/g, '').replace(/\./g, '') || 'unknown'}
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            marginTop: 2
                          }}>
                            <span style={{ fontSize: 13, color: isDarkMode ? '#71767b' : '#536471' }}>Created by</span>
                            <span style={{ fontSize: 13, color: '#1d9bf0', fontWeight: 500 }}>{instructor?.name}</span>
                          </div>
                          <div style={{
                            fontSize: 14,
                            color: isDarkMode ? '#a1a1aa' : '#6b7280',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            marginTop: 2
                          }}>
                            <AiOutlineTeam style={{ fontSize: 16 }} />
                            <span>{(instructor?.stats?.studentsTaught || 0).toLocaleString()} followers</span>
                            <span style={{ margin: '0 4px' }}>•</span>
                            <span>{instructor?.title || 'Instructor'}</span>
                          </div>
                        </div>

                        {/* Follow dropdown - shows community and enrolled courses */}
                        <div
                          className="community-follow-dropdown-wrapper"
                          style={{ position: 'relative', display: 'inline-block', zIndex: 9999 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              const dropdownKey = `scheduled-${instructor?.id}`;
                              const isOpening = openCommunityFollowDropdown !== dropdownKey;
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
                                openCommunityFollowDropdown === dropdownKey ? null : dropdownKey
                              );
                            }}
                            style={{
                              color: '#1d9bf0',
                              fontSize: 15,
                              fontWeight: 600,
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              transition: 'color 0.15s'
                            }}
                          >
                            {isFollowing ? 'Following' : 'Follow'}
                            <span style={{ fontSize: 10, marginLeft: 4 }}>▼</span>
                          </span>

                          {/* Dropdown menu */}
                          {openCommunityFollowDropdown === `scheduled-${instructor?.id}` && ReactDOM.createPortal(
                            <div className="community-follow-dropdown-menu" style={{
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
                                const followedCoursesCount = courses.filter(c => isCourseFollowed && isCourseFollowed(c.id)).length;
                                const hasAnyFollowed = isFollowing || followedCoursesCount > 0;

                                return (
                                  <>
                                    {/* Community section */}
                                    <div style={{
                                      padding: '6px 16px 2px',
                                      fontSize: 11,
                                      fontWeight: 600,
                                      color: isDarkMode ? '#71767b' : '#536471',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.5px'
                                    }}>
                                      Community
                                    </div>
                                    <div
                                      style={{
                                        padding: '8px 16px',
                                        cursor: 'pointer',
                                        fontSize: 14,
                                        color: isFollowing ? '#1d9bf0' : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                                        fontWeight: isFollowing ? 500 : 400,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleFollowInstructor && handleFollowInstructor(instructor?.id);
                                      }}
                                      onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#f8fafc'}
                                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                      <span style={{ width: 16 }}>{isFollowing && '✓'}</span>
                                      <span>{instructor?.communityName || instructor?.name}</span>
                                    </div>

                                    {/* Courses section */}
                                    <div style={{
                                      padding: '10px 16px 2px',
                                      fontSize: 11,
                                      fontWeight: 600,
                                      color: isDarkMode ? '#71767b' : '#536471',
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.5px',
                                      borderTop: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
                                      marginTop: 4
                                    }}>
                                      Courses
                                    </div>
                                    {courses.map(course => {
                                      const isFollowed = isCourseFollowed ? isCourseFollowed(course.id) : false;
                                      return (
                                        <div
                                          key={course.id}
                                          style={{
                                            padding: '10px 16px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            fontSize: 14,
                                            color: isFollowed ? '#1d9bf0' : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                                            fontWeight: isFollowed ? 500 : 400
                                          }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleFollowCourse && handleFollowCourse(course.id);
                                          }}
                                          onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#f8fafc'}
                                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                          <span style={{ width: 16, flexShrink: 0 }}>{isFollowed && '✓'}</span>
                                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</span>
                                        </div>
                                      );
                                    })}

                                    {/* Unfollow all */}
                                    {hasAnyFollowed && (
                                      <>
                                        <div style={{ borderTop: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4', margin: '4px 0' }} />
                                        <div
                                          style={{
                                            padding: '10px 16px',
                                            cursor: 'pointer',
                                            fontSize: 13,
                                            color: '#f4212e',
                                            fontWeight: 500
                                          }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            courses.forEach(course => {
                                              if (isCourseFollowed && isCourseFollowed(course.id)) {
                                                handleFollowCourse && handleFollowCourse(course.id);
                                              }
                                            });
                                            if (isFollowing) {
                                              handleFollowInstructor && handleFollowInstructor(instructor?.id);
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

                    {/* Courses Section with Connector Lines - Matches Discover */}
                    <div style={{
                      position: 'relative',
                      paddingLeft: 48,
                      paddingRight: 20,
                      paddingBottom: 16,
                      marginLeft: 20
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

                      {courses.map((course, index) => {
                        const isLast = index === courses.length - 1;
                        const isFollowed = isCourseFollowed ? isCourseFollowed(course.id) : false;

                        return (
                          <div
                            key={course.id}
                            style={{
                              position: 'relative',
                              marginBottom: 12
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
                              background: '#4facfe',
                              border: '2px solid #fff',
                              boxShadow: isDarkMode ? '0 0 0 2px #2f3336' : '0 0 0 2px #d0e8f0',
                              zIndex: 1
                            }} />

                            {/* Course Card */}
                            <div
                              onClick={() => onViewCourse && onViewCourse(course.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 12,
                                padding: 16,
                                background: isDarkMode ? '#16181c' : '#f7f9f9',
                                borderRadius: 12,
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
                                width: 56,
                                height: 56,
                                borderRadius: 12,
                                flexShrink: 0,
                                background: course.thumbnailGradient || iconConfig.course.gradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <span style={{
                                  color: '#fff',
                                  fontSize: 18,
                                  fontWeight: 700,
                                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                }}>
                                  {getCourseAbbreviation(course.title)}
                                </span>
                              </div>

                              {/* Course Info */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  fontSize: 15,
                                  fontWeight: 600,
                                  color: isDarkMode ? '#e7e9ea' : '#0f1419',
                                  display: 'flex',
                                  alignItems: 'center',
                                  flexWrap: 'wrap',
                                  gap: 6
                                }}>
                                  <span style={{ color: '#1d9bf0', cursor: 'pointer' }}>
                                    {course.title}
                                  </span>
                                  <span style={{ color: isDarkMode ? '#71767b' : '#536471', fontWeight: 400 }}>·</span>
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleFollowCourse && handleFollowCourse(course.id);
                                    }}
                                    style={{
                                      color: '#1d9bf0',
                                      fontSize: 15,
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      transition: 'color 0.15s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                                  >
                                    {isFollowed ? 'Following' : 'Follow'}
                                  </span>
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
                                      with {course.session.teacherName || course.session.studentTeacherName}
                                    </span>
                                    <div className="reschedule-dropdown-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const rect = e.currentTarget.getBoundingClientRect();
                                          setRescheduleDropdownPosition({
                                            top: rect.bottom + window.scrollY + 4,
                                            left: rect.left + window.scrollX
                                          });
                                          setOpenRescheduleDropdown(
                                            openRescheduleDropdown?.session?.id === course.session.id
                                              ? null
                                              : { session: course.session, course }
                                          );
                                        }}
                                        style={{
                                          background: 'none',
                                          border: 'none',
                                          color: isDarkMode ? '#71767b' : '#6b7280',
                                          fontSize: 11,
                                          cursor: 'pointer',
                                          padding: '2px 6px',
                                          textDecoration: 'underline',
                                          fontWeight: 400
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = '#1d9bf0'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = isDarkMode ? '#71767b' : '#6b7280'; }}
                                      >
                                        Reschedule
                                      </button>
                                      {openRescheduleDropdown?.session?.id === course.session.id && ReactDOM.createPortal(
                                        <div
                                          className="reschedule-dropdown-menu"
                                          style={{
                                            position: 'absolute',
                                            top: rescheduleDropdownPosition.top,
                                            left: rescheduleDropdownPosition.left,
                                            background: isDarkMode ? '#000' : '#fff',
                                            border: `1px solid ${isDarkMode ? '#2f3336' : '#e2e8f0'}`,
                                            borderRadius: 16,
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                            zIndex: 99999,
                                            minWidth: 320,
                                            overflow: 'hidden'
                                          }}
                                        >
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const session = openRescheduleDropdown.session;
                                              setOpenRescheduleDropdown(null);
                                              onRescheduleSession && onRescheduleSession({ ...session, rescheduleMode: 'teacher' });
                                            }}
                                            style={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'space-between',
                                              width: '100%',
                                              padding: '16px 24px',
                                              background: 'none',
                                              border: 'none',
                                              textAlign: 'left',
                                              cursor: 'pointer',
                                              transition: 'background 0.15s ease'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                                          >
                                            <div style={{ flex: 1 }}>
                                              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>Choose Your Teacher</div>
                                              <div style={{ fontSize: 13, color: isDarkMode ? '#71767b' : '#536471', lineHeight: 1.4 }}>
                                                Browse student teachers. See availability and book sessions.
                                              </div>
                                            </div>
                                            <span style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 20, marginLeft: 12 }}>›</span>
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const session = openRescheduleDropdown.session;
                                              setOpenRescheduleDropdown(null);
                                              onRescheduleSession && onRescheduleSession({ ...session, rescheduleMode: 'time' });
                                            }}
                                            style={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'space-between',
                                              width: '100%',
                                              padding: '16px 24px',
                                              background: 'none',
                                              border: 'none',
                                              borderTop: `1px solid ${isDarkMode ? '#2f3336' : '#e2e8f0'}`,
                                              textAlign: 'left',
                                              cursor: 'pointer',
                                              transition: 'background 0.15s ease'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                                          >
                                            <div style={{ flex: 1 }}>
                                              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>Choose Your Schedule</div>
                                              <div style={{ fontSize: 13, color: isDarkMode ? '#71767b' : '#536471', lineHeight: 1.4 }}>
                                                Pick dates that work for you. See who's available.
                                              </div>
                                            </div>
                                            <span style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 20, marginLeft: 12 }}>›</span>
                                          </button>
                                        </div>,
                                        document.body
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
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

          {/* Course List - Based on Selected Tab */}
          <div>
            {courseViewTab === 'active' ? (
              // ACTIVE COURSES
              activeCoursesGroups.length === 0 ? (
                <div style={{
                  padding: 48,
                  textAlign: 'center',
                  color: isDarkMode ? '#71717a' : '#9ca3af'
                }}>
                  <FaPlay style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }} />
                  <p>No active courses. Start learning something new!</p>
                </div>
              ) : (
                activeCoursesGroups.map(group => renderInstructorGroup(group, 'active', false))
              )
            ) : (
              // COMPLETED COURSES
              completedCoursesGroups.length === 0 ? (
                <div style={{
                  padding: 48,
                  textAlign: 'center',
                  color: isDarkMode ? '#71717a' : '#9ca3af'
                }}>
                  <FaCheckCircle style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }} />
                  <p>No completed courses yet. Keep learning!</p>
                </div>
              ) : (
                completedCoursesGroups.map(group => renderInstructorGroup(group, 'completed', true))
              )
            )}
          </div>
        </div>
      </div>

      {/* Apply to Teach Modal */}
      {renderApplyToTeachModal()}
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
  cancelScheduledSession: PropTypes.func,
  onScheduleSession: PropTypes.func
};

export default MyCoursesView;
