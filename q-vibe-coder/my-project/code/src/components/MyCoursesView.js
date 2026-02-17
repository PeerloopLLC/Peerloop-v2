import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { FaBook, FaSearch, FaCheckCircle, FaPlay, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { AiOutlineStar, AiOutlineTeam } from 'react-icons/ai';
import { getInstructorById, iconConfig } from '../data/database';
import Breadcrumb from './Breadcrumb';

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
          fontSize: 'var(--fs-13)',
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
                fontSize: 'var(--fs-14)',
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
  onScheduleSession,
  breadcrumbItems = null,  // Breadcrumb navigation items
  onBack = null  // Back button handler
}) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'inprogress', or 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(null); // Selected date for filtering
  const [courseMode, setCourseMode] = useState('taking'); // 'taking', 'teaching', 'took', 'taught'

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

  // Community badge settings (match DiscoverView)
  const [communityBadgeBg, setCommunityBadgeBg] = useState(() => {
    return localStorage.getItem('communityBadgeBg') || 'color';
  });
  const [communityHeaderGrey, setCommunityHeaderGrey] = useState(() => {
    const saved = localStorage.getItem('communityHeaderGrey');
    return saved ? parseInt(saved, 10) : 60;
  });
  const [combinedCardGrayLevel, setCombinedCardGrayLevel] = useState(() => {
    const saved = localStorage.getItem('combinedCardGrayLevel');
    return saved ? parseInt(saved, 10) : 25;
  });

  // Listen for settings changes
  useEffect(() => {
    const handleBadgeBgChange = (e) => setCommunityBadgeBg(e.detail);
    const handleGreyChange = (e) => setCommunityHeaderGrey(e.detail);
    const handleGrayLevelChange = (e) => setCombinedCardGrayLevel(e.detail);
    window.addEventListener('communityBadgeBgChanged', handleBadgeBgChange);
    window.addEventListener('communityHeaderGreyChanged', handleGreyChange);
    window.addEventListener('combinedCardGrayLevelChanged', handleGrayLevelChange);
    return () => {
      window.removeEventListener('communityBadgeBgChanged', handleBadgeBgChange);
      window.removeEventListener('communityHeaderGreyChanged', handleGreyChange);
      window.removeEventListener('combinedCardGrayLevelChanged', handleGrayLevelChange);
    };
  }, []);

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

  // Get today's date key in YYYY-MM-DD format
  const getTodayDateKey = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayDateKey = getTodayDateKey();

  // Get sessions for today
  const sessionsForToday = useMemo(() => {
    return scheduledSessions.filter(s => s.date === todayDateKey && s.status === 'scheduled');
  }, [todayDateKey, scheduledSessions]);

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
  // A course requires BOTH session 1 and session 2 to be certified
  const isCourseCompleted = (courseId) => {
    // Primary check: sessionCompletion data (set by teacher when certifying)
    if (currentUser?.id) {
      try {
        const stored = localStorage.getItem(`sessionCompletion_${currentUser.id}`);
        if (stored) {
          const sessionCompletion = JSON.parse(stored);
          const courseCompletion = sessionCompletion[courseId] || {};
          // Course requires both sessions to be certified
          const session1Done = courseCompletion[1]?.completed === true;
          const session2Done = courseCompletion[2]?.completed === true;
          if (session1Done && session2Done) {
            return true;
          }
          // If we have session data but not both done, course is NOT complete
          if (session1Done || session2Done) {
            return false;
          }
        }
      } catch (e) {
        // Fall through to legacy check
      }
    }

    // Legacy fallback: check scheduled sessions (need 2+ completed)
    const courseSessions = scheduledSessions.filter(s => s.courseId === courseId);
    if (courseSessions.length === 0) return false;
    const completedCount = courseSessions.filter(s => s.status === 'completed').length;
    const hasScheduled = courseSessions.some(s => s.status === 'scheduled');
    return !hasScheduled && completedCount >= 2;
  };

  // Split courses into Active and Completed groups by instructor
  const { activeCoursesGroups, completedCoursesGroups } = useMemo(() => {
    const activeGroups = {};
    const completedGroups = {};

    myCoursesData.forEach(course => {
      const instructorId = course.instructorId;
      const instructor = getInstructorById(instructorId);
      const isCompleted = isCourseCompleted(course.id);

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

  // Find courses where current user is scheduled as a student-teacher (Teaching mode)
  const teachingCoursesData = useMemo(() => {
    if (!currentUser?.id) return [];

    const teachingSessions = [];

    // Scan all scheduledSessions_* in localStorage to find sessions where we are the teacher
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('scheduledSessions_') && !key.endsWith(currentUser.id)) {
          const sessions = JSON.parse(localStorage.getItem(key) || '[]');
          sessions.forEach(session => {
            // Check if this session has us as the teacher (handles both field naming conventions)
            if (session.studentTeacherId === currentUser.id ||
                session.studentTeacherId === currentUser.name ||
                session.studentTeacherName === currentUser.name ||
                session.teacherId === currentUser.id ||
                session.teacherId === currentUser.name ||
                session.teacherName === currentUser.name) {
              // Get the student's ID from the storage key
              const studentId = key.replace('scheduledSessions_', '');
              teachingSessions.push({
                ...session,
                studentId,
                studentName: session.studentName || studentId
              });
            }
          });
        }
      }
    } catch (e) {
      console.error('Error scanning teaching sessions:', e);
    }

    // Group by course and get course data
    const courseMap = {};
    teachingSessions.forEach(session => {
      if (!courseMap[session.courseId]) {
        const course = indexedCourses.find(c => c.id === session.courseId);
        if (course) {
          courseMap[session.courseId] = {
            ...course,
            teachingSessions: []
          };
        }
      }
      if (courseMap[session.courseId]) {
        courseMap[session.courseId].teachingSessions.push(session);
      }
    });

    return Object.values(courseMap);
  }, [currentUser?.id, currentUser?.name, indexedCourses]);

  // Group teaching courses by instructor
  const teachingCoursesGroups = useMemo(() => {
    const groups = {};

    teachingCoursesData.forEach(course => {
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
  }, [teachingCoursesData]);

  const teachingCoursesCount = teachingCoursesData.length;

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
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 'var(--fs-14)',
                    flexShrink: 0
                  }}>
                    {getCourseAbbreviation(course.title)}
                  </div>
                  <div>
                    <div style={{
                      fontSize: 'var(--fs-15)',
                      fontWeight: 600,
                      color: isDarkMode ? '#e7e9ea' : '#0f1419',
                      marginBottom: 4
                    }}>
                      {course.title}
                    </div>
                    <div style={{
                      fontSize: 'var(--fs-13)',
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
                      fontSize: 'var(--fs-12)',
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
                      fontSize: 'var(--fs-14)',
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
                    fontSize: 'var(--fs-12)',
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
                    fontSize: 'var(--fs-12)',
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
                    fontSize: 'var(--fs-15)',
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
                    fontSize: 'var(--fs-15)',
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
                    fontSize: 'var(--fs-18)',
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
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 'var(--fs-14)',
                    flexShrink: 0
                  }}>
                    {getCourseAbbreviation(course.title)}
                  </div>
                  <div>
                    <div style={{
                      fontSize: 'var(--fs-15)',
                      fontWeight: 600,
                      color: isDarkMode ? '#e7e9ea' : '#0f1419',
                      marginBottom: 4
                    }}>
                      {course.title}
                    </div>
                    <div style={{
                      fontSize: 'var(--fs-13)',
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
                    fontSize: 'var(--fs-15)',
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
                  fontSize: 'var(--fs-13)',
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

  // Helper function to render an instructor group with courses - COMPACT DESIGN
  const renderInstructorGroup = (group, keyPrefix, isCompletedSection = false) => {
    const { instructor, courses } = group;
    const isFollowing = isCreatorFollowed ? isCreatorFollowed(instructor?.id) : false;
    const courseGradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    ];

    return (
      <React.Fragment key={`${keyPrefix}-${instructor?.id || 'unknown'}`}>
        {courses.map((course, courseIndex) => {
          const courseGradient = courseGradients[courseIndex % courseGradients.length];
          const initials = course.title?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'CC';
          const nextSession = scheduledSessions
            .filter(s => s.courseId === course.id && s.status === 'scheduled')
            .sort((a, b) => a.date.localeCompare(b.date))[0];
          const completedSession = scheduledSessions
            .filter(s => s.courseId === course.id && s.status === 'completed')
            .sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0];

          const grayValue = 255 - Math.round(combinedCardGrayLevel * 0.6);
          const hoverGrayValue = Math.max(0, grayValue - 15);
          const bgColor = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
          const hoverColor = `rgb(${hoverGrayValue}, ${hoverGrayValue}, ${hoverGrayValue})`;

          return (
            <div
              key={`${keyPrefix}-${course.id}`}
              style={{
                borderRadius: 14,
                overflow: 'hidden',
                background: isDarkMode ? '#16181c' : '#fff',
                border: isDarkMode ? '1px solid #2f3336' : 'none',
                boxShadow: isDarkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.08)',
                margin: '0 12px 14px 12px',
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
              <div
                onClick={() => onViewCourse && onViewCourse(course.id)}
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
                  flexShrink: 0,
                  position: 'relative'
                }}>
                  {initials}
                  {isCompletedSection && (
                    <div style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      background: '#10b981',
                      color: '#fff',
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10
                    }}>
                      ✓
                    </div>
                  )}
                </div>

                {/* Course Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
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

                  <p style={{
                    fontSize: 'var(--fs-14)',
                    color: isDarkMode ? '#8b98a5' : '#536471',
                    lineHeight: 1.45,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
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
                    {isCompletedSection ? (
                      <span style={{ color: '#10b981', fontWeight: 600 }}>
                        ✓ Completed{completedSession ? `: ${formatDateForDisplay(completedSession.date)}` : ''}
                      </span>
                    ) : nextSession ? (
                      <span style={{ color: '#1d9bf0' }}>
                        📅 Next: {formatDateForDisplay(nextSession.date)} at {nextSession.time}
                      </span>
                    ) : (
                      <span style={{ fontStyle: 'italic' }}>No scheduled session</span>
                    )}
                    <span><span style={{ color: '#ffc107' }}>★</span> {course.rating?.toFixed(1) || '4.5'}</span>
                    <span>{course.level || 'Beginner'}</span>
                    <span>{course.sessions?.length || 0} sessions</span>
                  </div>
                </div>

                {/* Action Button */}
                <div style={{ flexShrink: 0, alignSelf: 'flex-start', marginTop: 2 }}>
                  {isCompletedSection ? (
                    (() => {
                      const teachStatus = getTeachingStatus(course.id);
                      if (teachStatus === 'pending') {
                        return (
                          <button onClick={(e) => e.stopPropagation()} style={{
                            background: '#fef3c7', border: 'none', color: '#92400e', cursor: 'default',
                            padding: '9px 18px', borderRadius: 20, fontSize: 'var(--fs-14)', fontWeight: 600, whiteSpace: 'nowrap'
                          }}>Pending</button>
                        );
                      }
                      if (teachStatus === 'approved') {
                        return (
                          <button onClick={(e) => e.stopPropagation()} style={{
                            background: '#dcfce7', border: 'none', color: '#15803d', cursor: 'default',
                            padding: '9px 18px', borderRadius: 20, fontSize: 'var(--fs-14)', fontWeight: 600, whiteSpace: 'nowrap'
                          }}>Approved</button>
                        );
                      }
                      return (
                        <button onClick={(e) => { e.stopPropagation(); handleApplyToTeachClick(course, e); }} style={{
                          background: '#10b981', border: 'none', color: '#fff', cursor: 'pointer',
                          padding: '9px 18px', borderRadius: 20, fontSize: 'var(--fs-14)', fontWeight: 600, whiteSpace: 'nowrap', transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
                        >Apply to Teach</button>
                      );
                    })()
                  ) : nextSession ? (
                    <button onClick={(e) => { e.stopPropagation(); onViewCourse && onViewCourse(course.id); }} style={{
                      background: '#10b981', border: 'none', color: '#fff', cursor: 'pointer',
                      padding: '9px 18px', borderRadius: 20, fontSize: 'var(--fs-14)', fontWeight: 600, whiteSpace: 'nowrap', transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
                    >Join Session</button>
                  ) : (
                    <button onClick={(e) => { e.stopPropagation(); onScheduleSession && onScheduleSession(course); }} style={{
                      background: isDarkMode ? '#2f3336' : '#f7f9f9',
                      border: isDarkMode ? '1px solid #536471' : '1px solid #cfd9de',
                      color: isDarkMode ? '#e7e9ea' : '#0f1419', cursor: 'pointer',
                      padding: '9px 18px', borderRadius: 20, fontSize: 'var(--fs-14)', fontWeight: 600, whiteSpace: 'nowrap', transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#3a3f44' : '#e7e9ea'}
                    onMouseLeave={(e) => e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#f7f9f9'}
                    >Schedule</button>
                  )}
                </div>
              </div>

              {/* Community Badge - RIGHT */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onViewCreatorProfile && onViewCreatorProfile(instructor);
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
                    : communityBadgeBg === 'color'
                    ? (isDarkMode
                        ? 'linear-gradient(135deg, #1e40af 0%, #5b21b6 50%, #7c3aed 100%)'
                        : 'linear-gradient(135deg, #4f7df3 0%, #764ba2 50%, #c084fc 100%)')
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
                {/* Geometric shapes */}
                <div style={{
                  position: 'absolute', top: 10, right: 10, width: 50, height: 50,
                  border: communityBadgeBg === 'white' ? '2px solid rgba(0,0,0,0.06)' : '2px solid rgba(255,255,255,0.15)',
                  borderRadius: 10, transform: 'rotate(15deg)'
                }} />
                <div style={{
                  position: 'absolute', bottom: 15, left: -10, width: 60, height: 60,
                  border: communityBadgeBg === 'white' ? '2px solid rgba(0,0,0,0.04)' : '2px solid rgba(255,255,255,0.1)',
                  borderRadius: '50%'
                }} />
                <div style={{
                  position: 'absolute', top: '50%', right: -15, width: 30, height: 30,
                  background: communityBadgeBg === 'white' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.08)',
                  transform: 'rotate(45deg)'
                }} />

                {/* Community Icon */}
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                  background: communityBadgeBg === 'white' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.2)',
                  marginBottom: 10, position: 'relative', zIndex: 1,
                  fontWeight: 600,
                  color: communityBadgeBg === 'white' ? '#1a1a1a' : 'white'
                }}>
                  {(instructor?.communityName || instructor?.name)?.slice(0, 2).toUpperCase()}
                </div>

                <div style={{
                  fontSize: 'var(--fs-14)', fontWeight: 600,
                  color: communityBadgeBg === 'white' ? '#1a1a1a' : '#fff',
                  marginBottom: 3, position: 'relative', zIndex: 1
                }}>
                  {instructor?.communityName || `${instructor?.name}`}
                </div>

                <div style={{
                  fontSize: 'var(--fs-12)',
                  color: communityBadgeBg === 'white' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.75)',
                  marginBottom: 4, position: 'relative', zIndex: 1
                }}>
                  {instructor?.stats?.studentsTaught?.toLocaleString() || 0} followers
                </div>

                <div style={{
                  fontSize: 'var(--fs-11)',
                  color: communityBadgeBg === 'white' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.85)',
                  marginBottom: 6, position: 'relative', zIndex: 1
                }}>
                  Created by <span style={{ fontWeight: 600 }}>{instructor?.name}</span>
                </div>
              </div>
            </div>
          );
        })}
      </React.Fragment>
    );
  };

  // Empty state - only show if no learning courses AND no teaching courses
  // Get featured courses from Guy Rymberg (instructor ID 8) for promotion
  const featuredCourses = useMemo(() => {
    const guyCourses = indexedCourses.filter(c => c.instructorId === 8);
    return guyCourses.slice(0, 3); // Show up to 3 featured courses
  }, [indexedCourses]);

  if (myCoursesData.length === 0 && teachingCoursesData.length === 0) {
    const guyInstructor = getInstructorById(8);

    return (
      <div className="main-content">
        {/* Breadcrumb Navigation */}
        {breadcrumbItems && <Breadcrumb items={breadcrumbItems} onBack={onBack} isDarkMode={isDarkMode} />}
        <div className="three-column-layout browse-layout">
          <div className="center-column">
            {/* Promotional Header */}
            {/* Page Header - 3B Blue Geometric Pattern */}
            <div style={{
              background: isDarkMode
                ? 'linear-gradient(135deg, #0a1628 0%, #1e293b 100%)'
                : 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
              padding: '28px 24px',
              borderRadius: 0,
              marginBottom: 0,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Geometric Shapes */}
              {!isDarkMode && (
                <>
                  <div style={{
                    position: 'absolute',
                    top: -15,
                    right: 80,
                    width: 70,
                    height: 70,
                    border: '2px solid rgba(255,255,255,0.15)',
                    borderRadius: 14,
                    transform: 'rotate(15deg)',
                    pointerEvents: 'none'
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: -25,
                    left: 60,
                    width: 60,
                    height: 60,
                    border: '2px solid rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    pointerEvents: 'none'
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: 20,
                    right: 40,
                    width: 35,
                    height: 35,
                    background: 'rgba(255,255,255,0.08)',
                    transform: 'rotate(45deg)',
                    pointerEvents: 'none'
                  }} />
                </>
              )}
              <h1 style={{
                fontSize: 'var(--fs-24)',
                fontWeight: 700,
                color: '#fff',
                marginBottom: 8,
                position: 'relative',
                zIndex: 1
              }}>
                Start Your Learning Journey
              </h1>
              <p style={{
                fontSize: 'var(--fs-16)',
                color: 'rgba(255, 255, 255, 0.85)',
                margin: 0,
                position: 'relative',
                zIndex: 1
              }}>
                Master AI tools and workflows with hands-on courses
              </p>
            </div>

            {/* Featured Courses Section */}
            {featuredCourses.length > 0 ? (
              <div style={{ padding: '24px 16px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16
                }}>
                  <h2 style={{
                    fontSize: 'var(--fs-18)',
                    fontWeight: 700,
                    color: isDarkMode ? '#e7e9ea' : '#0f1419',
                    margin: 0
                  }}>
                    Featured Courses
                  </h2>
                  <button
                    onClick={() => onMenuChange && onMenuChange('Discover')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#1d9bf0',
                      fontSize: 'var(--fs-14)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '4px 8px'
                    }}
                  >
                    See all courses
                  </button>
                </div>

                {/* Course Cards - Combined Card Format (matching Discover) */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14
                }}>
                  {featuredCourses.map((course, index) => {
                    const courseGradients = [
                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                    ];
                    const courseGradient = courseGradients[index % courseGradients.length];
                    const initials = course.title?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'CC';

                    return (
                      <div
                        key={course.id}
                        style={{
                          borderRadius: 14,
                          overflow: 'hidden',
                          background: isDarkMode ? '#16181c' : '#fff',
                          border: isDarkMode ? '1px solid #2f3336' : 'none',
                          boxShadow: isDarkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.08)',
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
                        <div
                          onClick={() => onViewCourse && onViewCourse(course.id)}
                          style={{
                            flex: 1,
                            padding: '16px 18px',
                            display: 'flex',
                            gap: 14,
                            cursor: 'pointer',
                            transition: 'background 0.15s ease',
                            background: isDarkMode ? '#16181c' : '#fff'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.03)' : '#f8f9fa';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = isDarkMode ? '#16181c' : '#fff';
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
                            <div
                              style={{
                                fontSize: 'var(--fs-16)',
                                fontWeight: 600,
                                color: isDarkMode ? '#e7e9ea' : '#1a1a1a',
                                marginBottom: 6,
                                transition: 'color 0.15s'
                              }}
                            >
                              {course.title}
                            </div>

                            <p style={{
                              fontSize: 'var(--fs-14)',
                              color: isDarkMode ? '#8b98a5' : '#536471',
                              lineHeight: 1.45,
                              marginBottom: 10,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
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
                              <span><span style={{ color: '#ffc107' }}>★</span> {course.rating?.toFixed?.(1) || '4.7'} (0)</span>
                              <span style={{
                                background: isDarkMode ? '#2d3748' : '#e0f2fe',
                                color: isDarkMode ? '#90cdf4' : '#0369a1',
                                padding: '2px 10px',
                                borderRadius: 12,
                                fontSize: 'var(--fs-11)',
                                fontWeight: 500
                              }}>{course.level || 'Beginner'}</span>
                              <span>0 sessions</span>
                              <span>{course.duration || '3 hours'}</span>
                              <span style={{
                                color: isDarkMode ? '#e7e9ea' : '#1a1a1a',
                                fontWeight: 600
                              }}>
                                ${course.price || 249}
                              </span>
                            </div>
                          </div>

                          {/* Enroll Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewCourse && onViewCourse(course.id);
                            }}
                            style={{
                              background: '#22c55e',
                              color: 'white',
                              border: 'none',
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
                            onMouseEnter={(e) => e.currentTarget.style.background = '#16a34a'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#22c55e'}
                          >
                            ${course.price || 249}
                          </button>
                        </div>

                        {/* Community Badge - RIGHT - 3B Blue Geometric Pattern */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            if (guyInstructor && onViewCreatorProfile) {
                              onViewCreatorProfile(guyInstructor);
                            }
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
                            background: isDarkMode
                              ? 'linear-gradient(135deg, #0a1628 0%, #1e293b 100%)'
                              : 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'filter 0.15s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                        >
                          {/* Geometric shapes - 3B Pattern */}
                          {!isDarkMode && (
                            <>
                              <div style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                width: 50,
                                height: 50,
                                border: '2px solid rgba(255,255,255,0.15)',
                                borderRadius: 10,
                                transform: 'rotate(15deg)',
                                pointerEvents: 'none'
                              }} />
                              <div style={{
                                position: 'absolute',
                                bottom: 15,
                                left: -10,
                                width: 60,
                                height: 60,
                                border: '2px solid rgba(255,255,255,0.1)',
                                borderRadius: '50%',
                                pointerEvents: 'none'
                              }} />
                              <div style={{
                                position: 'absolute',
                                top: '50%',
                                right: -15,
                                width: 30,
                                height: 30,
                                background: 'rgba(255,255,255,0.08)',
                                transform: 'rotate(45deg)',
                                pointerEvents: 'none'
                              }} />
                            </>
                          )}

                          {/* Community Icon */}
                          <div style={{
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 18,
                            background: 'rgba(255,255,255,0.2)',
                            marginBottom: 10,
                            position: 'relative',
                            zIndex: 1,
                            fontWeight: 600,
                            color: 'white'
                          }}>
                            PR
                          </div>

                          <div style={{
                            fontSize: 'var(--fs-14)',
                            fontWeight: 600,
                            color: '#fff',
                            marginBottom: 3,
                            position: 'relative',
                            zIndex: 1
                          }}>
                            {guyInstructor?.communityName || 'Prompt Masters'}
                          </div>

                          <div style={{
                            fontSize: 'var(--fs-12)',
                            color: 'rgba(255,255,255,0.75)',
                            marginBottom: 4,
                            position: 'relative',
                            zIndex: 1
                          }}>
                            {guyInstructor?.stats?.studentsTaught?.toLocaleString() || 527} followers
                          </div>

                          <div style={{
                            fontSize: 'var(--fs-11)',
                            color: 'rgba(255,255,255,0.6)',
                            position: 'relative',
                            zIndex: 1
                          }}>
                            Created by {guyInstructor?.name || 'Guy Rymberg'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Instructor Attribution */}
                {guyInstructor && (
                  <div
                    onClick={() => onViewCreatorProfile && onViewCreatorProfile(guyInstructor)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      marginTop: 20,
                      padding: '12px 16px',
                      background: isDarkMode ? '#16181c' : '#f7f9f9',
                      borderRadius: 12,
                      cursor: 'pointer'
                    }}
                  >
                    <img
                      src={guyInstructor.avatar}
                      alt={guyInstructor.name}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 'var(--fs-14)',
                        fontWeight: 600,
                        color: isDarkMode ? '#e7e9ea' : '#0f1419'
                      }}>
                        {guyInstructor.name}
                      </div>
                      <div style={{
                        fontSize: 'var(--fs-13)',
                        color: isDarkMode ? '#71767b' : '#536471'
                      }}>
                        {guyInstructor.title}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 'var(--fs-13)',
                      color: '#1d9bf0',
                      fontWeight: 600
                    }}>
                      View Profile
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* Fallback if no featured courses */
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
                  fontSize: 'var(--fs-16)',
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
                    fontSize: 'var(--fs-15)',
                    cursor: 'pointer'
                  }}
                >
                  Discover Courses
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* Breadcrumb Navigation */}
      {breadcrumbItems && <Breadcrumb items={breadcrumbItems} onBack={onBack} isDarkMode={isDarkMode} />}
      <div className="three-column-layout browse-layout">
        <div className="center-column">
          {/* Header - Title and Search (scrolls away) */}
          <div className="top-menu-section" style={{
            borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
            padding: '0 16px',
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
              fontSize: 'var(--fs-18)',
              fontWeight: 700,
              color: isDarkMode ? '#e7e9ea' : '#0f1419',
              margin: 0
            }}>
              My Courses
            </h1>

            {/* Search box */}
            <div style={{ width: 120 }}>
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

          {/* Calendar Section (scrolls away) */}
          <CourseCalendar
            isDarkMode={isDarkMode}
            scheduledDates={scheduledDates}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          {/* Course Mode Pills - STICKY */}
          <div style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            padding: '12px 20px',
            borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
            background: isDarkMode ? '#000' : '#fff'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              {/* Taking pill */}
              <button
                onClick={() => setCourseMode('taking')}
                style={{
                  padding: '8px 16px',
                  borderRadius: 20,
                  border: courseMode === 'taking'
                    ? '2px solid #1d9bf0'
                    : (isDarkMode ? '2px solid #536471' : '2px solid #cfd9de'),
                  background: courseMode === 'taking'
                    ? (isDarkMode ? 'rgba(29, 155, 240, 0.15)' : 'rgba(29, 155, 240, 0.1)')
                    : (isDarkMode ? '#2f3336' : '#f7f9f9'),
                  color: courseMode === 'taking'
                    ? '#1d9bf0'
                    : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                  fontSize: 'var(--fs-14)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                Taking ({activeCoursesCount})
              </button>
              {/* Teaching pill */}
              <button
                onClick={() => setCourseMode('teaching')}
                style={{
                  padding: '8px 16px',
                  borderRadius: 20,
                  border: courseMode === 'teaching'
                    ? '2px solid #10b981'
                    : (isDarkMode ? '2px solid #536471' : '2px solid #cfd9de'),
                  background: courseMode === 'teaching'
                    ? (isDarkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)')
                    : (isDarkMode ? '#2f3336' : '#f7f9f9'),
                  color: courseMode === 'teaching'
                    ? '#10b981'
                    : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                  fontSize: 'var(--fs-14)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                Teaching ({teachingCoursesCount})
              </button>
              {/* Took pill */}
              <button
                onClick={() => setCourseMode('took')}
                style={{
                  padding: '8px 16px',
                  borderRadius: 20,
                  border: courseMode === 'took'
                    ? '2px solid #8b5cf6'
                    : (isDarkMode ? '2px solid #536471' : '2px solid #cfd9de'),
                  background: courseMode === 'took'
                    ? (isDarkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)')
                    : (isDarkMode ? '#2f3336' : '#f7f9f9'),
                  color: courseMode === 'took'
                    ? '#8b5cf6'
                    : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                  fontSize: 'var(--fs-14)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                Took ({completedCoursesCount})
              </button>
              {/* Taught pill */}
              <button
                onClick={() => setCourseMode('taught')}
                style={{
                  padding: '8px 16px',
                  borderRadius: 20,
                  border: courseMode === 'taught'
                    ? '2px solid #f59e0b'
                    : (isDarkMode ? '2px solid #536471' : '2px solid #cfd9de'),
                  background: courseMode === 'taught'
                    ? (isDarkMode ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)')
                    : (isDarkMode ? '#2f3336' : '#f7f9f9'),
                  color: courseMode === 'taught'
                    ? '#f59e0b'
                    : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                  fontSize: 'var(--fs-14)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                Taught (0)
              </button>
            </div>
          </div>

          {/* Today's Sessions / Selected Date Sessions - Highlighted Box - Only show in Taking mode */}
          {courseMode === 'taking' && (() => {
            // Determine which sessions to show
            const displayDate = selectedDate || (sessionsForToday.length > 0 ? todayDateKey : null);
            const displaySessions = selectedDate ? sessionsForSelectedDate : sessionsForToday;
            const isToday = displayDate === todayDateKey;

            if (!displayDate || displaySessions.length === 0) return null;

            return (
              <>
                {/* Highlighted Sessions Box */}
                <div style={{
                  margin: '16px 20px',
                  background: isDarkMode
                    ? 'linear-gradient(135deg, #1a2332 0%, #1e293b 100%)'
                    : 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
                  border: isDarkMode ? '1px solid #2f3336' : '1px solid #e2e8f0',
                  borderRadius: 12,
                  overflow: 'hidden'
                }}>
                  {/* Box Header */}
                  <div style={{
                    padding: '12px 16px',
                    borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #bae6fd',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                  }}>
                    {/* Clock Icon */}
                    <div style={{
                      width: 32,
                      height: 32,
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: '#fff' }}>
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{
                        fontSize: 'var(--fs-14)',
                        fontWeight: 700,
                        color: isDarkMode ? '#93c5fd' : '#1e40af'
                      }}>
                        {isToday ? "Today's Sessions" : `Sessions for ${formatDateForDisplay(displayDate)}`}
                      </div>
                      <div style={{
                        fontSize: 11,
                        color: isDarkMode ? '#60a5fa' : '#3b82f6'
                      }}>
                        {isToday ? formatDateForDisplay(displayDate) : `${displaySessions.length} session${displaySessions.length > 1 ? 's' : ''}`}
                      </div>
                    </div>
                  </div>

                  {/* Session Cards */}
                  <div style={{ padding: '12px 16px' }}>
                    {displaySessions.map((session, index) => {
                      const course = indexedCourses.find(c => c.id === session.courseId);
                      const instructor = course ? getInstructorById(course.instructorId) : null;

                      return (
                        <div
                          key={session.id || `${session.courseId}-${session.date}-${index}`}
                          onClick={() => onViewCourse && onViewCourse(session.courseId)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '10px 12px',
                            background: isDarkMode ? '#1e293b' : '#fff',
                            borderRadius: 8,
                            marginBottom: index < displaySessions.length - 1 ? 8 : 0,
                            border: isDarkMode ? '1px solid #2f3336' : '1px solid #e2e8f0',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = isDarkMode ? '#1d1f23' : '#f8fafc';
                            e.currentTarget.style.borderColor = isDarkMode ? '#3f4347' : '#cbd5e1';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = isDarkMode ? '#1e293b' : '#fff';
                            e.currentTarget.style.borderColor = isDarkMode ? '#2f3336' : '#e2e8f0';
                          }}
                        >
                          {/* Session Time */}
                          <div style={{
                            fontSize: 'var(--fs-12)',
                            fontWeight: 700,
                            color: isDarkMode ? '#60a5fa' : '#1d4ed8',
                            minWidth: 60
                          }}>
                            {session.time || '—'}
                          </div>

                          {/* Session Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: 'var(--fs-13)',
                              fontWeight: 600,
                              color: isDarkMode ? '#e7e9ea' : '#0f1419',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {course?.title || 'Unknown Course'}
                            </div>
                            <div style={{
                              fontSize: 11,
                              color: isDarkMode ? '#71767b' : '#536471'
                            }}>
                              {instructor?.communityName || instructor?.name || 'Unknown'}
                            </div>
                          </div>

                          {/* Join + Reschedule Buttons */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewCourse && onViewCourse(session.courseId);
                              }}
                              style={{
                                background: '#10b981',
                                color: '#fff',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: 14,
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.15s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                              onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
                            >
                              Join Session
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewCourse && onViewCourse(session.courseId);
                              }}
                              style={{
                                background: isDarkMode ? '#2f3336' : '#f7f9f9',
                                border: isDarkMode ? '1px solid #536471' : '1px solid #cfd9de',
                                color: isDarkMode ? '#e7e9ea' : '#0f1419',
                                cursor: 'pointer',
                                padding: '6px 12px',
                                borderRadius: 14,
                                fontSize: 11,
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                transition: 'all 0.15s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = isDarkMode ? '#3a3f44' : '#e7e9ea';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#f7f9f9';
                              }}
                            >
                              Reschedule
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section Separator */}
                <div style={{
                  height: 8,
                  background: isDarkMode ? '#16181c' : '#f7f9f9',
                  borderTop: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
                  borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
                }} />

                {/* All My Courses Header */}
                <div style={{
                  padding: '16px 20px 8px',
                  fontSize: 'var(--fs-13)',
                  fontWeight: 600,
                  color: isDarkMode ? '#71767b' : '#536471',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Courses I'm Taking
                </div>
              </>
            );
          })()}

          {/* Course List - Based on Selected Tab and Mode */}
          <div>
            {courseMode === 'teaching' ? (
              // TEACHING COURSES
              teachingCoursesGroups.length === 0 ? (
                <div style={{
                  padding: 48,
                  textAlign: 'center',
                  color: isDarkMode ? '#71717a' : '#9ca3af'
                }}>
                  <svg viewBox="0 0 24 24" style={{ width: 48, height: 48, marginBottom: 16, opacity: 0.5, fill: 'currentColor' }}>
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                  </svg>
                  <p>No teaching assignments yet.</p>
                  <p style={{ fontSize: 'var(--fs-12)', marginTop: 8 }}>When an instructor schedules you as a student-teacher, courses will appear here.</p>
                </div>
              ) : (
                teachingCoursesGroups.map(group => (
                  <div key={group.instructorId} style={{ marginBottom: 16 }}>
                    {/* Instructor Header */}
                    <div style={{
                      padding: '12px 20px',
                      background: isDarkMode ? '#16181c' : '#f7f9f9',
                      borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12
                    }}>
                      <img
                        src={group.instructor?.avatar || '/default-avatar.png'}
                        alt={group.instructor?.name}
                        style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: 'var(--fs-14)', fontWeight: 600, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>
                          {group.instructor?.communityName || group.instructor?.name || 'Unknown Instructor'}
                        </div>
                        <div style={{ fontSize: 'var(--fs-12)', color: '#10b981' }}>
                          Teaching {group.courses.length} course{group.courses.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    {/* Course Cards */}
                    {group.courses.map(course => (
                      <div
                        key={course.id}
                        onClick={() => onViewCourse && onViewCourse(course.id)}
                        style={{
                          padding: '16px 20px',
                          borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
                          cursor: 'pointer',
                          transition: 'background 0.15s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#1d1f23' : '#f7f9f9'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ display: 'flex', gap: 12 }}>
                          <img
                            src={course.image || course.thumbnail}
                            alt={course.title}
                            style={{ width: 80, height: 45, borderRadius: 6, objectFit: 'cover' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 'var(--fs-14)', fontWeight: 600, color: isDarkMode ? '#e7e9ea' : '#0f1419', marginBottom: 4 }}>
                              {course.title}
                            </div>
                            {course.teachingSessions && course.teachingSessions.length > 0 && (
                              <div style={{ fontSize: 'var(--fs-12)', color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, fill: 'currentColor' }}>
                                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
                                </svg>
                                {course.teachingSessions.length} session{course.teachingSessions.length > 1 ? 's' : ''} scheduled
                                {course.teachingSessions[0]?.studentName && (
                                  <span style={{ color: isDarkMode ? '#71767b' : '#536471' }}>
                                    {' '}with {course.teachingSessions[0].studentName}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div style={{
                            background: '#10b981',
                            color: '#fff',
                            padding: '4px 10px',
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 600,
                            alignSelf: 'center'
                          }}>
                            Teaching
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )
            ) : courseMode === 'taking' ? (
              // TAKING COURSES (active learning)
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
            ) : courseMode === 'took' ? (
              // TOOK COURSES (completed learning)
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
            ) : (
              // TAUGHT COURSES (past teaching - placeholder for now)
              <div style={{
                padding: 48,
                textAlign: 'center',
                color: isDarkMode ? '#71717a' : '#9ca3af'
              }}>
                <svg viewBox="0 0 24 24" style={{ width: 48, height: 48, marginBottom: 16, opacity: 0.5, fill: 'currentColor' }}>
                  <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                </svg>
                <p>No past teaching sessions yet.</p>
                <p style={{ fontSize: 'var(--fs-12)', marginTop: 8 }}>Completed teaching assignments will appear here.</p>
              </div>
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
