import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './MainContent.css';
import { FaImage, FaSmile, FaCalendar, FaMapMarkerAlt, FaGlobe, FaSearch, FaBook, FaUser, FaFilter, FaGraduationCap, FaStar, FaUsers, FaAward, FaHeart, FaComment, FaAt, FaRetweet, FaBullhorn, FaDollarSign, FaCheckCircle, FaClock } from 'react-icons/fa';
import { AiOutlineHeart, AiOutlineBarChart, AiOutlineStar, AiOutlineTeam, AiOutlineClockCircle } from 'react-icons/ai';
import { BiRepost } from 'react-icons/bi';
import { BsThreeDots } from 'react-icons/bs';
import { IoShareOutline } from 'react-icons/io5';
import { MdChatBubbleOutline } from 'react-icons/md';
import { BsBookmark } from 'react-icons/bs';
import Dashboard from './Dashboard';
import CreatorDashboard from './CreatorDashboard';
import BrowseView from './BrowseView';
import MyCoursesView from './MyCoursesView';
import Community from './Community';
import Profile from './Profile';
import CreatorProfile from './CreatorProfile';
import CreatorMode from './CreatorMode';
import CourseListing from './CourseListing';
import JobExchange from './JobExchange';
import Settings from './Settings';
import UserProfile from './UserProfile';
import CourseDetailView from './CourseDetailView';
import PurchasedCourseDetail from './PurchasedCourseDetail';
import StudentTeacherDashboard from './StudentTeacherDashboard';
import NewUserDashboard from './NewUserDashboard';
import StudentDashboard from './StudentDashboard';
import EnrollmentFlow from './EnrollmentFlow';
import EnrollOptionsModal from './EnrollOptionsModal';
import PurchaseModal from './PurchaseModal';
import FindTeacherView from './FindTeacherView';
import RescheduleModal from './RescheduleModal';
import Notifications from './Notifications';
import AboutView from './AboutView';
import DiscoverView from './DiscoverView';
import { getAllInstructors, getInstructorWithCourses, getCourseById, getAllCourses, getInstructorById, getIndexedCourses, getIndexedInstructors } from '../data/database';
import { UserPropType } from './PropTypes';

// Guy Rymberg's course IDs - default enrollment for all users
const GUY_RYMBERG_COURSES = [15, 22, 23, 24, 25];

const MainContent = ({ activeMenu, currentUser, onSwitchUser, onMenuChange, isDarkMode, toggleDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const lastTopMenuRef = useRef('courses');

  // Track if we're handling a popstate (browser back/forward) to prevent pushing duplicate history
  const isPopstateRef = useRef(false);
  
  // Persist Browse state in localStorage so it survives menu navigation
  const [activeTopMenu, setActiveTopMenu] = useState(() => {
    try {
      return localStorage.getItem('browseActiveTopMenu') || 'courses';
    } catch { return 'courses'; }
  });
  const [selectedInstructor, setSelectedInstructor] = useState(() => {
    try {
      const saved = localStorage.getItem('browseSelectedInstructor');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [selectedCourse, setSelectedCourse] = useState(() => {
    try {
      const saved = localStorage.getItem('browseSelectedCourse');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [currentInstructorForCourse, setCurrentInstructorForCourse] = useState(() => {
    try {
      const saved = localStorage.getItem('browseCurrentInstructorForCourse');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [isReturningFromCourse, setIsReturningFromCourse] = useState(false);
  
  // Track where user came from when viewing an instructor (for proper back navigation)
  const [previousBrowseContext, setPreviousBrowseContext] = useState(null);
  // { type: 'course', course: courseObj } or { type: 'courseList' } or { type: 'creatorList' }
  
  // Creator profile tab: 'courses' or 'community'
  const [creatorProfileTab, setCreatorProfileTab] = useState('courses');
  
  // Save Browse state to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('browseActiveTopMenu', activeTopMenu);
    } catch {}
  }, [activeTopMenu]);
  
  useEffect(() => {
    try {
      localStorage.setItem('browseSelectedInstructor', JSON.stringify(selectedInstructor));
    } catch {}
  }, [selectedInstructor]);
  
  useEffect(() => {
    try {
      localStorage.setItem('browseSelectedCourse', JSON.stringify(selectedCourse));
    } catch {}
  }, [selectedCourse]);
  
  useEffect(() => {
    try {
      localStorage.setItem('browseCurrentInstructorForCourse', JSON.stringify(currentInstructorForCourse));
    } catch {}
  }, [currentInstructorForCourse]);
  
  // User profile viewing state
  const [viewingUserProfile, setViewingUserProfile] = useState(null); // username of user being viewed
  const [viewingMemberProfile, setViewingMemberProfile] = useState(null); // user object for Profile component view
  const [navigationHistory, setNavigationHistory] = useState([]); // track where user came from
  const [viewingCourseFromCommunity, setViewingCourseFromCommunity] = useState(null); // course being viewed from community
  const [commonsActiveFeed, setCommonsActiveFeed] = useState('main'); // Track which pill is active in The Commons

  // Browser History Management - enables browser back/forward buttons
  useEffect(() => {
    // Handle browser back/forward navigation
    const handlePopState = (event) => {
      if (event.state) {
        isPopstateRef.current = true;

        // Restore state from history
        if (event.state.viewingCourse) {
          setViewingCourseFromCommunity(event.state.viewingCourse);
        } else {
          setViewingCourseFromCommunity(null);
        }

        if (event.state.selectedInstructor) {
          setSelectedInstructor(event.state.selectedInstructor);
        } else {
          setSelectedInstructor(null);
        }

        if (event.state.activeMenu) {
          onMenuChange(event.state.activeMenu);
        }

        if (event.state.activeTopMenu) {
          setActiveTopMenu(event.state.activeTopMenu);
        }

        // Small delay to reset the flag
        setTimeout(() => {
          isPopstateRef.current = false;
        }, 50);
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Push initial state if none exists
    if (!window.history.state) {
      window.history.replaceState({
        activeMenu,
        viewingCourse: null,
        selectedInstructor: null,
        activeTopMenu
      }, '');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []); // Only run on mount

  // Push to browser history when viewing a course changes
  useEffect(() => {
    if (isPopstateRef.current) return; // Don't push if handling popstate

    if (viewingCourseFromCommunity) {
      window.history.pushState({
        activeMenu,
        viewingCourse: viewingCourseFromCommunity,
        selectedInstructor,
        activeTopMenu
      }, '', '');
    }
  }, [viewingCourseFromCommunity]);

  // Push to browser history when selected instructor changes (creator profile view)
  useEffect(() => {
    if (isPopstateRef.current) return; // Don't push if handling popstate

    if (selectedInstructor && !viewingCourseFromCommunity) {
      window.history.pushState({
        activeMenu,
        viewingCourse: null,
        selectedInstructor,
        activeTopMenu
      }, '', '');
    }
  }, [selectedInstructor]);

  // Push to browser history when activeMenu changes to main views
  useEffect(() => {
    if (isPopstateRef.current) return; // Don't push if handling popstate

    // Only push for significant menu changes when not viewing course/instructor detail
    const mainMenus = ['My Community', 'Discover', 'Browse', 'My Courses', 'Workspace', 'Profile'];
    if (mainMenus.includes(activeMenu) && !viewingCourseFromCommunity && !selectedInstructor) {
      window.history.pushState({
        activeMenu,
        viewingCourse: null,
        selectedInstructor: null,
        activeTopMenu
      }, '', '');
    }
  }, [activeMenu]);

  // Clear course view and enrollment states when navigating to main menus (fixes navigation staying stuck on course detail)
  useEffect(() => {
    const menusToReset = ['Discover', 'Workspace', 'My Community', 'Profile', 'Settings', 'Browse', 'My Courses'];
    if (menusToReset.includes(activeMenu)) {
      setViewingCourseFromCommunity(null);
      setViewingUserProfile(null);
      // Reset enrollment flow states to prevent stale calendar/modal showing
      setShowEnrollmentFlow(false);
      setShowEnrollOptions(false);
      setShowPurchaseModal(false);
      setShowFindTeacher(false);
      setEnrollingCourse(null);
    }
  }, [activeMenu]);

  // Function to view a user's profile
  const handleViewUserProfile = (username) => {
    // Save current location to history
    setNavigationHistory(prev => [...prev, activeMenu]);
    setViewingUserProfile(username);
  };
  
  // Function to go back from user profile
  const handleBackFromUserProfile = () => {
    const history = [...navigationHistory];
    const previousPage = history.pop() || 'My Community';
    setNavigationHistory(history);
    setViewingUserProfile(null);
    onMenuChange(previousPage);
  };

  // Function to view a member's profile (using Profile component, not UserProfile)
  const handleViewMemberProfile = (user) => {
    // Save current location AND commons feed state to history
    setNavigationHistory(prev => [...prev, { menu: activeMenu, feed: commonsActiveFeed }]);
    setViewingMemberProfile(user);
  };

  // Function to go back from member profile
  const handleBackFromMemberProfile = () => {
    const history = [...navigationHistory];
    const previousState = history.pop() || { menu: 'My Community', feed: 'main' };
    setNavigationHistory(history);
    setViewingMemberProfile(null);
    // Restore both the menu and the feed state
    if (typeof previousState === 'object' && previousState !== null) {
      setCommonsActiveFeed(previousState.feed || 'main');
      // Restore additional navigation states if they exist (for Find Teacher flow)
      if ('showFindTeacher' in previousState) {
        setShowFindTeacher(previousState.showFindTeacher);
      }
      if ('enrollingCourse' in previousState) {
        setEnrollingCourse(previousState.enrollingCourse);
      }
      if ('viewingCourseFromCommunity' in previousState) {
        setViewingCourseFromCommunity(previousState.viewingCourseFromCommunity);
        // DON'T call onMenuChange when restoring Find Teacher state!
        // There's a useEffect that clears viewingCourseFromCommunity when activeMenu changes.
        // Since viewingCourseFromCommunity check takes precedence in render order, we don't need
        // to change the menu - just restoring these states is enough.
        return;
      }
      // Only call onMenuChange for normal navigation (not Find Teacher flow)
      onMenuChange(previousState.menu || 'My Community');
    } else {
      // Backwards compatibility for old history format
      onMenuChange(previousState);
    }
  };

  // Function to view a course from community
  const handleViewCourseFromCommunity = (courseId) => {
    const course = getCourseById(courseId);
    if (course) {
      // Save current location to history
      setNavigationHistory(prev => [...prev, activeMenu]);
      setViewingCourseFromCommunity(course);
    }
  };
  
  // Function to go back from course view
  const handleBackFromCourse = () => {
    const history = [...navigationHistory];
    const previousPage = history.pop() || 'My Community';
    setNavigationHistory(history);
    setViewingCourseFromCommunity(null);
    onMenuChange(previousPage);
  };
  // Helper function to get default follows (all creators)
  const getDefaultFollows = () => {
    const allInstructors = getAllInstructors();
    return allInstructors.map(instructor => {
      const courseIds = instructor.courses || [];
      let totalStudents = 0;
      courseIds.forEach(cid => {
        const course = getCourseById(cid);
        if (course) totalStudents += course.students;
      });
      return {
        id: `creator-${instructor.id}`,
        type: 'creator',
        name: instructor.name,
        instructorId: instructor.id,
        instructorName: instructor.name,
        courseIds: courseIds,
        followedCourseIds: [], // Empty until courses are purchased
        description: instructor.bio,
        members: Math.floor(totalStudents * 0.8),
        posts: Math.floor(totalStudents * 0.24),
        avatar: instructor.avatar
      };
    });
  };

  // Helper function to get Sarah's default communities (only 2 to start)
  const getSarahDefaultCommunities = () => {
    const allInstructors = getAllInstructors();
    const allCourses = getAllCourses();

    // Sarah only starts with 2 communities joined (first 2 instructors)
    const sarahInstructors = allInstructors.slice(0, 2);

    return sarahInstructors.map(instructor => {
      const instructorCourses = allCourses.filter(c => c.instructorId === instructor.id);
      return {
        id: `creator-${instructor.id}`,
        type: 'creator', // Required for Community.js to recognize this as a creator follow
        name: instructor.name,
        avatar: instructor.avatar,
        instructorId: instructor.id,
        followedCourseIds: instructorCourses.map(c => c.id),
        isFullCreatorFollow: true
      };
    });
  };

  // Helper function to load follows for a specific user
  const loadFollowsForUser = (userId, isNewUser) => {
    // New User (demo_new) starts with no communities - completely fresh
    if (userId === 'demo_new') {
      return [];
    }

    // Sarah (demo_sarah) starts with only 2 communities joined
    if (userId === 'demo_sarah') {
      return getSarahDefaultCommunities();
    }

    // New users always start with empty follows
    if (isNewUser) {
      return [];
    }

    // Load from user-specific localStorage key
    try {
      const storageKey = `followedCommunities_${userId}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // If stored data is empty array, return defaults instead
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }

      // Check for old global key and migrate if it has data
      const oldStored = localStorage.getItem('followedCommunities');
      if (oldStored) {
        try {
          const oldParsed = JSON.parse(oldStored);
          if (Array.isArray(oldParsed) && oldParsed.length > 0) {
            // Migrate old data to new user-specific key
            localStorage.setItem(storageKey, oldStored);
            console.log(`Migrated followedCommunities to ${storageKey}`);
            return oldParsed;
          }
        } catch (e) {
          // Ignore parse errors from old key
        }
      }

      // No saved data - return default follows (all creators)
      return getDefaultFollows();
    } catch (error) {
      console.error('Error parsing followedCommunities from localStorage:', error);
      return getDefaultFollows();
    }
  };

  const [followedCommunities, setFollowedCommunities] = useState(() => {
    return loadFollowsForUser(currentUser?.id, currentUser?.isNewUser);
  });
  const [lastBrowseClick, setLastBrowseClick] = useState(0);
  const [indexedCourses, setIndexedCourses] = useState([]);
  const [indexedInstructors, setIndexedInstructors] = useState([]);
  const [isFollowDropdownOpen, setIsFollowDropdownOpen] = useState(false);
  const [followedInstructors, setFollowedInstructors] = useState(() => {
    // Start with empty set - no instructors followed by default
    return new Set();
  });
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const [openCreatorFollowDropdown, setOpenCreatorFollowDropdown] = useState(null); // Track which creator's follow dropdown is open
  const [selectedCourseForListing, setSelectedCourseForListing] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false); // Track course description expansion
  const [showEnrollmentFlow, setShowEnrollmentFlow] = useState(false); // Track enrollment modal visibility
  const [enrollingCourse, setEnrollingCourse] = useState(null); // Course being enrolled in
  const [showEnrollOptions, setShowEnrollOptions] = useState(false); // Track enroll options modal (3-option menu)
  const [showFindTeacher, setShowFindTeacher] = useState(false); // Track find teacher full screen view
  const [showPurchaseModal, setShowPurchaseModal] = useState(false); // Track purchase modal visibility
  const [preSelectedTeacher, setPreSelectedTeacher] = useState(null); // Teacher selected from FindTeacherView

  // Signup completed state - shared between Community and DiscoverView
  // This ensures the welcome card disappears in both views after completing signup
  const [signupCompleted, setSignupCompleted] = useState(false);

  // Purchased courses - courses the user has bought (enables course-level follow/unfollow)
  const [purchasedCourses, setPurchasedCourses] = useState(() => {
    // New User, Sarah, and Alex start with no courses - completely fresh
    if (currentUser?.id === 'demo_new' || currentUser?.id === 'demo_sarah' || currentUser?.id === 'demo_alex') {
      return [];
    }
    // All other users default to Guy Rymberg's courses
    try {
      const storageKey = `purchasedCourses_${currentUser?.id}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
      // Default: Guy Rymberg's courses for all users
      return GUY_RYMBERG_COURSES;
    } catch (e) {
      return GUY_RYMBERG_COURSES;
    }
  });

  // Reload purchased courses when user changes
  React.useEffect(() => {
    if (!currentUser?.id) return;

    // New User, Sarah, and Alex start with no courses - completely fresh
    if (currentUser.id === 'demo_new' || currentUser.id === 'demo_sarah' || currentUser.id === 'demo_alex') {
      // Check localStorage first - they may have purchased courses
      try {
        const storageKey = `purchasedCourses_${currentUser.id}`;
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          setPurchasedCourses(JSON.parse(stored));
        } else {
          setPurchasedCourses([]);
        }
      } catch (e) {
        setPurchasedCourses([]);
      }
      return;
    }

    try {
      const storageKey = `purchasedCourses_${currentUser.id}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setPurchasedCourses(JSON.parse(stored));
      } else {
        // Default: Guy Rymberg's courses for all users
        setPurchasedCourses(GUY_RYMBERG_COURSES);
      }
    } catch (e) {
      setPurchasedCourses(GUY_RYMBERG_COURSES);
    }
  }, [currentUser?.id]);

  // Save purchased courses to localStorage
  React.useEffect(() => {
    if (currentUser?.id && purchasedCourses.length > 0) {
      localStorage.setItem(`purchasedCourses_${currentUser.id}`, JSON.stringify(purchasedCourses));
    }
  }, [purchasedCourses, currentUser?.id]);

  // Scheduled sessions - tracks booked 1-on-1 sessions with student-teachers
  // Structure: { id, courseId, date, time, studentTeacherId, studentTeacherName, status }
  const [scheduledSessions, setScheduledSessions] = useState(() => {
    if (!currentUser?.id) return [];
    try {
      const storageKey = `scheduledSessions_${currentUser.id}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // If stored data has scheduled sessions, use it; otherwise regenerate
        if (parsed.length > 0 && parsed.some(s => s.status === 'scheduled')) {
          return parsed;
        }
      }
      // demo_new, demo_sarah, and demo_alex start with no default sessions (fresh users)
      if (currentUser.id === 'demo_new' || currentUser.id === 'demo_sarah' || currentUser.id === 'demo_alex') {
        return [];
      }
      // Default: sample sessions for other users with Guy Rymberg courses
      // These match the purchased courses: [15, 22, 23, 24, 25]
      const today = new Date();
      const defaultSessions = [
        {
          id: 'session_1',
          courseId: 15,
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2).toISOString().split('T')[0],
          time: '10:00 AM',
          studentTeacherId: 'ProductPioneer42',
          studentTeacherName: 'Patricia Parker',
          status: 'scheduled'
        },
        {
          id: 'session_2',
          courseId: 23,
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2).toISOString().split('T')[0],
          time: '2:00 PM',
          studentTeacherId: 'TechPM_Sarah',
          studentTeacherName: 'Sarah Mitchell',
          status: 'scheduled'
        },
        {
          id: 'session_3',
          courseId: 22,
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5).toISOString().split('T')[0],
          time: '11:00 AM',
          studentTeacherId: 'BackendBoss99',
          studentTeacherName: 'Brandon Blake',
          status: 'scheduled'
        },
        {
          id: 'session_4',
          courseId: 24,
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7).toISOString().split('T')[0],
          time: '3:00 PM',
          studentTeacherId: 'NeuralNetNinja',
          studentTeacherName: 'Nathan Nguyen',
          status: 'scheduled'
        },
        {
          id: 'session_5',
          courseId: 25,
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9).toISOString().split('T')[0],
          time: '1:00 PM',
          studentTeacherId: 'AIArchitect77',
          studentTeacherName: 'Amanda Adams',
          status: 'scheduled'
        }
      ];
      // Save to localStorage immediately so it persists
      localStorage.setItem(storageKey, JSON.stringify(defaultSessions));
      return defaultSessions;
    } catch (e) {
      return [];
    }
  });

  // Reload scheduled sessions when user changes
  React.useEffect(() => {
    if (!currentUser?.id) return;

    try {
      const storageKey = `scheduledSessions_${currentUser.id}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // If stored data has scheduled sessions, use it
        if (parsed.length > 0 && parsed.some(s => s.status === 'scheduled')) {
          setScheduledSessions(parsed);
          return;
        }
      }

      // demo_new, demo_sarah, and demo_alex start with no default sessions (fresh users)
      if (currentUser.id === 'demo_new' || currentUser.id === 'demo_sarah' || currentUser.id === 'demo_alex') {
        setScheduledSessions([]);
        return;
      }

      // Generate default sessions for other users with Guy Rymberg courses
      const today = new Date();
      const defaultSessions = [
        {
          id: 'session_1',
          courseId: 15,
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2).toISOString().split('T')[0],
          time: '10:00 AM',
          studentTeacherId: 'ProductPioneer42',
          studentTeacherName: 'Patricia Parker',
          status: 'scheduled'
        },
        {
          id: 'session_2',
          courseId: 23,
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2).toISOString().split('T')[0],
          time: '2:00 PM',
          studentTeacherId: 'TechPM_Sarah',
          studentTeacherName: 'Sarah Mitchell',
          status: 'scheduled'
        },
        {
          id: 'session_3',
          courseId: 22,
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5).toISOString().split('T')[0],
          time: '11:00 AM',
          studentTeacherId: 'BackendBoss99',
          studentTeacherName: 'Brandon Blake',
          status: 'scheduled'
        },
        {
          id: 'session_4',
          courseId: 24,
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7).toISOString().split('T')[0],
          time: '3:00 PM',
          studentTeacherId: 'NeuralNetNinja',
          studentTeacherName: 'Nathan Nguyen',
          status: 'scheduled'
        },
        {
          id: 'session_5',
          courseId: 25,
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9).toISOString().split('T')[0],
          time: '1:00 PM',
          studentTeacherId: 'AIArchitect77',
          studentTeacherName: 'Amanda Adams',
          status: 'scheduled'
        }
      ];
      localStorage.setItem(storageKey, JSON.stringify(defaultSessions));
      setScheduledSessions(defaultSessions);
    } catch (e) {
      setScheduledSessions([]);
    }
  }, [currentUser?.id]);

  // Save scheduled sessions to localStorage
  React.useEffect(() => {
    if (currentUser?.id && scheduledSessions.length > 0) {
      localStorage.setItem(`scheduledSessions_${currentUser.id}`, JSON.stringify(scheduledSessions));
    }
  }, [scheduledSessions, currentUser?.id]);

  // Helper to add a new scheduled session
  const addScheduledSession = (session) => {
    const newSession = {
      ...session,
      id: `session_${Date.now()}`
    };
    setScheduledSessions(prev => [...prev, newSession]);
    return newSession;
  };

  // Helper to cancel a scheduled session
  const cancelScheduledSession = (sessionId) => {
    setScheduledSessions(prev => prev.map(s =>
      s.id === sessionId ? { ...s, status: 'cancelled' } : s
    ));
  };

  // Reschedule modal state
  const [rescheduleModalSession, setRescheduleModalSession] = useState(null);
  const [rescheduleToast, setRescheduleToast] = useState(null);

  // Helper to reschedule a session (update date/time, notify teacher)
  const rescheduleSession = ({ sessionId, oldDate, oldTime, newDate, newTime, teacherId, teacherName }) => {
    // Update student's scheduled sessions
    setScheduledSessions(prev => prev.map(s =>
      s.id === sessionId ? { ...s, date: newDate, time: newTime, rescheduledFrom: { date: oldDate, time: oldTime, at: new Date().toISOString() } } : s
    ));

    // Update teacher's session list in localStorage
    if (teacherId) {
      try {
        const teacherSessionsKey = `teacherSessions_${teacherId}`;
        const existing = localStorage.getItem(teacherSessionsKey);
        const teacherSessionsList = existing ? JSON.parse(existing) : [];
        const updated = teacherSessionsList.map(s =>
          s.id === sessionId ? { ...s, date: newDate, time: newTime, rescheduledFrom: { date: oldDate, time: oldTime, at: new Date().toISOString() } } : s
        );
        localStorage.setItem(teacherSessionsKey, JSON.stringify(updated));

        // Also store a reschedule notification for the teacher
        const notifKey = `rescheduleNotifications_${teacherId}`;
        const existingNotifs = JSON.parse(localStorage.getItem(notifKey) || '[]');
        existingNotifs.push({
          id: `resched_${Date.now()}`,
          sessionId,
          studentName: currentUser?.name || 'A student',
          courseName: scheduledSessions.find(s => s.id === sessionId)?.courseName || 'Course',
          oldDate,
          oldTime,
          newDate,
          newTime,
          createdAt: new Date().toISOString(),
          acknowledged: false
        });
        localStorage.setItem(notifKey, JSON.stringify(existingNotifs));
      } catch (e) {
        console.error('Failed to update teacher sessions for reschedule:', e);
      }
    }

    // Close the modal and show toast
    setRescheduleModalSession(null);
    const formatToastDate = (d) => {
      const date = new Date(d + 'T00:00:00');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[date.getMonth()]} ${date.getDate()}`;
    };
    setRescheduleToast(`Session rescheduled to ${formatToastDate(newDate)} at ${newTime}`);
    setTimeout(() => setRescheduleToast(null), 4000);
  };

  // ========== S-T STATS DATA LAYER ==========
  // Initialize empty stats for S-T users
  const initializeStStats = () => ({
    activeStudents: [],
    completedStudents: [],
    totalEarned: 0,
    pendingBalance: 0,
    sessionsCompleted: 0,
    rating: 0,
    ratingCount: 0,
    earningsHistory: []
  });

  // S-T Teacher Stats state
  const [stTeacherStats, setStTeacherStats] = useState(() => {
    if (!currentUser?.id) return initializeStStats();
    try {
      const key = `stTeacherStats_${currentUser.id}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initializeStStats();
    } catch {
      return initializeStStats();
    }
  });

  // Track if we just loaded to avoid persist race condition
  const justLoadedStatsRef = React.useRef(false);

  // Reload stTeacherStats when user changes, sync active students from all scheduled sessions
  React.useEffect(() => {
    if (!currentUser?.id) return;
    try {
      const key = `stTeacherStats_${currentUser.id}`;
      const stored = localStorage.getItem(key);
      const loadedStats = stored ? JSON.parse(stored) : initializeStStats();

      // Sync: scan scheduledSessions_* to find students booked with this teacher
      const existingIds = new Set((loadedStats.activeStudents || []).map(s => s.id));
      let synced = false;
      for (let i = 0; i < localStorage.length; i++) {
        const storageKey = localStorage.key(i);
        if (storageKey?.startsWith('scheduledSessions_') && !storageKey.endsWith(currentUser.id)) {
          try {
            const studentSessions = JSON.parse(localStorage.getItem(storageKey) || '[]');
            studentSessions.forEach(s => {
              if (s.teacherId === currentUser.id && s.status === 'scheduled') {
                const enrollmentId = `${s.studentId}-${s.courseId}`;
                if (!existingIds.has(enrollmentId)) {
                  loadedStats.activeStudents.push({
                    id: enrollmentId,
                    name: s.studentName || 'Unknown',
                    courseName: s.courseName,
                    courseId: s.courseId,
                    enrolledDate: s.createdAt || new Date().toISOString()
                  });
                  loadedStats.pendingBalance = (loadedStats.pendingBalance || 0) + 315;
                  existingIds.add(enrollmentId);
                  synced = true;
                }
              }
            });
          } catch { /* skip malformed entries */ }
        }
      }

      if (synced) {
        localStorage.setItem(key, JSON.stringify(loadedStats));
      }

      justLoadedStatsRef.current = true;
      setStTeacherStats(loadedStats);
      console.log('Loaded stTeacherStats for', currentUser.id, loadedStats);
    } catch {
      justLoadedStatsRef.current = true;
      setStTeacherStats(initializeStStats());
    }
  }, [currentUser?.id]);

  // Persist stTeacherStats to localStorage (skip if we just loaded)
  React.useEffect(() => {
    if (justLoadedStatsRef.current) {
      justLoadedStatsRef.current = false; // Reset flag
      return; // Skip persist right after load
    }
    if (currentUser?.id) {
      localStorage.setItem(
        `stTeacherStats_${currentUser.id}`,
        JSON.stringify(stTeacherStats)
      );
      console.log('Persisted stTeacherStats for', currentUser.id, stTeacherStats);
    }
  }, [stTeacherStats, currentUser?.id]);

  // Teacher Sessions state - sessions where this user is the teacher
  const [teacherSessions, setTeacherSessions] = useState([]);

  // Load teacher sessions when user changes, and sync from all students' scheduled sessions
  React.useEffect(() => {
    if (!currentUser?.id) {
      setTeacherSessions([]);
      return;
    }
    try {
      const key = `teacherSessions_${currentUser.id}`;
      const stored = localStorage.getItem(key);
      let sessions = stored ? JSON.parse(stored) : [];

      // Sync: scan all scheduledSessions_* in localStorage to find sessions assigned to this teacher
      const existingIds = new Set(sessions.map(s => s.id));
      for (let i = 0; i < localStorage.length; i++) {
        const storageKey = localStorage.key(i);
        if (storageKey?.startsWith('scheduledSessions_') && !storageKey.endsWith(currentUser.id)) {
          try {
            const studentSessions = JSON.parse(localStorage.getItem(storageKey) || '[]');
            studentSessions.forEach(s => {
              if (s.teacherId === currentUser.id && !existingIds.has(s.id)) {
                sessions.push({
                  id: s.id,
                  courseId: s.courseId,
                  courseName: s.courseName,
                  teacherId: s.teacherId,
                  teacherName: s.teacherName || s.studentTeacherName,
                  date: s.date,
                  time: s.time,
                  status: s.status || 'scheduled',
                  studentId: s.studentId,
                  studentName: s.studentName,
                  createdAt: s.createdAt || new Date().toISOString()
                });
                existingIds.add(s.id);
              }
            });
          } catch { /* skip malformed entries */ }
        }
      }

      // Persist synced sessions
      localStorage.setItem(key, JSON.stringify(sessions));
      setTeacherSessions(sessions);
    } catch {
      setTeacherSessions([]);
    }
  }, [currentUser?.id]);

  // Helper: When student enrolls with this S-T
  const addActiveStudent = (studentId, studentName, courseName) => {
    setStTeacherStats(prev => ({
      ...prev,
      activeStudents: [...prev.activeStudents, { id: studentId, name: studentName, course: courseName }],
      pendingBalance: prev.pendingBalance + 315
    }));
  };

  // Helper: When session is completed
  const completeStSession = () => {
    setStTeacherStats(prev => ({
      ...prev,
      sessionsCompleted: prev.sessionsCompleted + 1
    }));
  };

  // Helper: When student is certified (releases $315 payout)
  const certifyStudent = (studentId, studentName, courseName) => {
    // Update S-T stats
    setStTeacherStats(prev => ({
      ...prev,
      activeStudents: prev.activeStudents.filter(s => s.id !== studentId),
      completedStudents: [...prev.completedStudents, studentId],
      pendingBalance: Math.max(0, prev.pendingBalance - 315),
      totalEarned: prev.totalEarned + 315,
      earningsHistory: [
        { studentId, studentName, courseName, amount: 315, date: new Date().toISOString() },
        ...(prev.earningsHistory || [])
      ]
    }));

    // Move student's sessions from upcoming to completed, or create a completed session if none exists
    // IMPORTANT: Read from localStorage first to get any sessions added while we were viewing
    // This prevents losing new bookings that were made while teacher had dashboard open
    setTeacherSessions(prev => {
      // Read latest from localStorage in case new sessions were added
      let currentSessions = prev;
      try {
        const key = `teacherSessions_${currentUser?.id}`;
        const stored = localStorage.getItem(key);
        if (stored) {
          currentSessions = JSON.parse(stored);
        }
      } catch (e) {
        console.error('Error reading teacherSessions from localStorage:', e);
      }

      // Parse enrollment ID to get actual studentId and courseId
      // Format: ${userId}-${courseId}
      const lastDash = studentId.lastIndexOf('-');
      const actualStudentId = lastDash > 0 ? studentId.substring(0, lastDash) : studentId;
      const courseId = lastDash > 0 ? studentId.substring(lastDash + 1) : null;

      // Check if there are any sessions for this student (match by actual user ID and course)
      const hasSessionsForStudent = currentSessions.some(s =>
        s.studentId === actualStudentId && (!courseId || String(s.courseId) === courseId)
      );

      let updated;
      if (hasSessionsForStudent) {
        // Mark matching sessions as completed
        updated = currentSessions.map(session =>
          session.studentId === actualStudentId && (!courseId || String(session.courseId) === courseId)
            ? { ...session, status: 'completed' }
            : session
        );
      } else {
        // No sessions exist - create a completed session record for certification
        const completedSession = {
          id: `cert-${studentId}-${Date.now()}`,
          studentId,
          studentName,
          teacherId: currentUser?.id,
          courseName,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          status: 'completed',
          certifiedAt: new Date().toISOString()
        };
        updated = [...currentSessions, completedSession];
      }

      // Persist to localStorage
      if (currentUser?.id) {
        localStorage.setItem(`teacherSessions_${currentUser.id}`, JSON.stringify(updated));
      }
      return updated;
    });

    // Also update the student's scheduledSessions so their My Courses shows it as completed
    // Parse enrollmentId to get actual userId and courseId
    // Format: ${userId}-${courseId}
    const lastDashIndex = studentId.lastIndexOf('-');
    if (lastDashIndex > 0) {
      const actualStudentId = studentId.substring(0, lastDashIndex);
      const courseId = studentId.substring(lastDashIndex + 1);

      // Update student's scheduled sessions
      const studentSessionsKey = `scheduledSessions_${actualStudentId}`;
      try {
        const stored = localStorage.getItem(studentSessionsKey);
        if (stored) {
          const studentSessions = JSON.parse(stored);
          const updatedStudentSessions = studentSessions.map(session =>
            String(session.courseId) === String(courseId)
              ? { ...session, status: 'completed', certifiedAt: new Date().toISOString() }
              : session
          );
          localStorage.setItem(studentSessionsKey, JSON.stringify(updatedStudentSessions));
        }
      } catch (e) {
        console.error('Error updating student sessions:', e);
      }
    }
  };
  // ========== END S-T STATS DATA LAYER ==========

  // State for BBB modal (used by S-T Dashboard Join Session)
  const [showBbbModal, setShowBbbModal] = useState(false);
  const [bbbJoinUrl, setBbbJoinUrl] = useState(null);

  // Helper to detect mobile/Safari for BBB
  const isMobileOrSafari = () => {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isIPadOS = (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    return isIOS || isIPadOS || (isSafari && 'ontouchend' in document);
  };

  // Handle joining a BBB session from S-T Dashboard
  const handleJoinBbbSession = async (session) => {
    if (!session?.courseId) {
      console.error('No course ID in session:', session);
      return;
    }

    try {
      const userName = currentUser?.name || 'Teacher';

      // Call Supabase Edge Function to create meeting and get join URL
      const response = await fetch('https://vnleonyfgwkfpvprpbqa.supabase.co/functions/v1/bbb-join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZubGVvbnlmZ3drZnB2cHJwYnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNDM2OTIsImV4cCI6MjA4MDYxOTY5Mn0.aunUqqZJTYGBIXjPT2_V_CtaBpmF61-IkEhkPvJdEu8',
        },
        body: JSON.stringify({
          courseId: session.courseId,
          courseName: session.courseName || 'Course Session',
          userName: userName
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create meeting');
      }

      // On iOS/Safari, open in new tab (iframe restrictions)
      // On desktop, use the iframe modal
      if (isMobileOrSafari()) {
        window.open(data.joinUrl, '_blank');
      } else {
        setBbbJoinUrl(null);
        setShowBbbModal(true);
        setBbbJoinUrl(data.joinUrl);
      }
    } catch (error) {
      console.error('Failed to join session:', error);
      alert('Failed to join session. Please try again.');
      setShowBbbModal(false);
    }
  };

  // Helper to check if a course is purchased
  const isCoursePurchased = (courseId) => purchasedCourses.includes(courseId);

  // Helper to check if a course is followed (in any creator's followedCourseIds)
  const isCourseFollowed = (courseId) => {
    return followedCommunities.some(c =>
      c.followedCourseIds && c.followedCourseIds.includes(courseId)
    );
  };

  // Helper to check if any course from a creator is followed
  // Check if creator is followed (regardless of course follows)
  const isCreatorFollowed = (creatorId) => {
    const idStr = String(creatorId);
    return followedCommunities.some(c => c.id === idStr || c.id === `creator-${idStr}`);
  };

  const hasAnyCreatorCourseFollowed = (creatorId) => {
    const creator = followedCommunities.find(c => c.id === creatorId || c.id === `creator-${creatorId}`);
    return creator && creator.followedCourseIds && creator.followedCourseIds.length > 0;
  };

  // Handle following/unfollowing an instructor (creator)
  const handleFollowInstructor = (instructorId) => {
    const idStr = String(instructorId);
    const creatorId = idStr.startsWith('creator-') ? idStr : `creator-${idStr}`;
    const rawId = idStr.replace('creator-', '');
    const isFollowed = followedCommunities.some(c => c.id === creatorId);

    if (isFollowed) {
      // Unfollow - remove from list
      setFollowedCommunities(prev => prev.filter(c => c.id !== creatorId));
    } else {
      // Follow - add to list
      const instructor = getInstructorById(parseInt(rawId) || rawId);
      if (instructor) {
        const courseIds = instructor.courses || [];
        setFollowedCommunities(prev => [...prev, {
          id: creatorId,
          type: 'creator',
          name: instructor.name,
          instructorId: instructor.id,
          instructorName: instructor.name,
          courseIds: courseIds,
          followedCourseIds: [], // Empty until courses are purchased
          description: instructor.bio,
          avatar: instructor.avatar
        }]);
      }
    }
  };

  // Handle following/unfollowing a specific course
  const handleFollowCourse = (courseId) => {
    const course = getCourseById(courseId);
    if (!course) return;

    const creatorId = `creator-${course.instructorId}`;
    const isFollowed = isCourseFollowed(courseId);

    if (isFollowed) {
      // Unfollow course - remove from creator's followedCourseIds
      setFollowedCommunities(prev => prev.map(c => {
        if (c.id === creatorId) {
          return {
            ...c,
            followedCourseIds: (c.followedCourseIds || []).filter(id => id !== courseId)
          };
        }
        return c;
      }));
    } else {
      // Follow course - make sure creator is followed, then add course
      const isCreatorFollowed = followedCommunities.some(c => c.id === creatorId);

      if (!isCreatorFollowed) {
        // First follow the creator, then add the course
        const instructor = getInstructorById(course.instructorId);
        if (instructor) {
          const courseIds = instructor.courses || [];
          setFollowedCommunities(prev => [...prev, {
            id: creatorId,
            type: 'creator',
            name: instructor.name,
            instructorId: instructor.id,
            instructorName: instructor.name,
            courseIds: courseIds,
            followedCourseIds: [courseId],
            description: instructor.bio,
            avatar: instructor.avatar
          }]);
        }
      } else {
        // Creator already followed - add this course
        setFollowedCommunities(prev => prev.map(c => {
          if (c.id === creatorId) {
            return {
              ...c,
              followedCourseIds: [...new Set([...(c.followedCourseIds || []), courseId])]
            };
          }
          return c;
        }));
      }
    }
  };

  // Handle course purchase - auto-follow the creator
  const handleCoursePurchase = (courseId) => {
    const course = getCourseById(courseId);
    if (!course) return;

    // Add to purchased courses
    setPurchasedCourses(prev => {
      if (prev.includes(courseId)) return prev;
      return [...prev, courseId];
    });

    // Auto-follow the creator
    const creatorId = `creator-${course.instructorId}`;
    const isCreatorFollowed = followedCommunities.some(c => c.id === creatorId);

    if (!isCreatorFollowed) {
      const instructor = getInstructorById(course.instructorId);
      if (instructor) {
        const courseIds = instructor.courses || [];
        setFollowedCommunities(prev => [...prev, {
          id: creatorId,
          type: 'creator',
          name: instructor.name,
          instructorId: instructor.id,
          instructorName: instructor.name,
          courseIds: courseIds,
          followedCourseIds: [courseId], // Start with just the purchased course
          description: instructor.bio,
          avatar: instructor.avatar
        }]);
      }
    } else {
      // Creator already followed - add this course to their followedCourseIds
      setFollowedCommunities(prev => prev.map(c => {
        if (c.id === creatorId) {
          return {
            ...c,
            followedCourseIds: [...new Set([...(c.followedCourseIds || []), courseId])]
          };
        }
        return c;
      }));
    }
  };

    // Only reset Browse state when explicitly requested (double-click Browse or Browse_Reset)
    // This preserves state when navigating away and back
    React.useEffect(() => {
      if (activeMenu === 'Browse_Reset') {
        setSelectedInstructor(null);
        setSelectedCourse(null);
        setCurrentInstructorForCourse(null);
        setActiveTopMenu('courses');
        setSearchQuery('');
        // Also clear localStorage
        try {
          localStorage.removeItem('browseSelectedInstructor');
          localStorage.removeItem('browseSelectedCourse');
          localStorage.removeItem('browseCurrentInstructorForCourse');
          localStorage.setItem('browseActiveTopMenu', 'courses');
        } catch {}
      }
    }, [activeMenu]);

    // Handle Browse_Courses and Browse_Communities from sidebar navigation
    // Don't reset selectedInstructor if coming from Discover or Feeds with a specific instructor
    React.useEffect(() => {
      if (activeMenu === 'Browse_Courses') {
        setSelectedInstructor(null);
        setSelectedCourse(null);
        setActiveTopMenu('courses');
        setSearchQuery('');
      } else if (activeMenu === 'Browse_Communities') {
        // Only reset if NOT coming from Discover or Feeds with a specific instructor
        if (previousBrowseContext?.type !== 'discover' && previousBrowseContext?.type !== 'feeds') {
          setSelectedInstructor(null);
          setSelectedCourse(null);
        }
        setActiveTopMenu('creators');
        setSearchQuery('');
      }
    }, [activeMenu, previousBrowseContext]);

    // Reset when Browse is clicked again while already on Browse page (double-click)
    React.useEffect(() => {
      if (activeMenu === 'Browse' && lastBrowseClick > 0) {
        setSelectedInstructor(null);
        setSelectedCourse(null);
        setCurrentInstructorForCourse(null);
        setActiveTopMenu('courses');
        setSearchQuery('');
      }
    }, [lastBrowseClick]);

    // Check for pending instructor navigation from Community
    React.useEffect(() => {
      if (activeMenu === 'Browse') {
        const pendingInstructor = localStorage.getItem('pendingBrowseInstructor');
        if (pendingInstructor) {
          try {
            const instructor = JSON.parse(pendingInstructor);
            setSelectedInstructor(instructor);
            setActiveTopMenu('creators');
            localStorage.removeItem('pendingBrowseInstructor');
          } catch (e) {
            console.error('Error parsing pending instructor:', e);
            localStorage.removeItem('pendingBrowseInstructor');
          }
        }
      }
    }, [activeMenu]);

    // Reset course viewing state when navigating to Feeds (My Community)
    React.useEffect(() => {
      if (activeMenu === 'My Community') {
        setViewingCourseFromCommunity(null);
      }
    }, [activeMenu]);

    // Track last selected top menu
    useEffect(() => {
      lastTopMenuRef.current = activeTopMenu;
    }, [activeTopMenu]);

    // Close creator follow dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (openCreatorFollowDropdown && !event.target.closest('.creator-follow-dropdown-wrapper')) {
          setOpenCreatorFollowDropdown(null);
        }
      };
      // Use mousedown for more reliable outside-click detection
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openCreatorFollowDropdown]);

    // On mount, build or load indexes
    useEffect(() => {
      const initializeIndexes = () => {
        try {
          // Clear cached indexes to force regeneration with new search logic
          localStorage.removeItem('indexedCourses');
          localStorage.removeItem('indexedInstructors');
          
          const courses = getIndexedCourses();
          const instructors = getIndexedInstructors();
          setIndexedCourses(courses);
          setIndexedInstructors(instructors);
          
          // Try to save to localStorage, but don't fail if it's not available
          try {
            localStorage.setItem('indexedCourses', JSON.stringify(courses));
            localStorage.setItem('indexedInstructors', JSON.stringify(instructors));
          } catch (storageError) {
            // localStorage might not be available (private browsing, etc.)
            console.warn('localStorage not available, indexes will not be cached:', storageError);
          }
        } catch (error) {
          console.error('Error initializing indexes:', error);
          // Fallback: set empty arrays to prevent crashes
          setIndexedCourses([]);
          setIndexedInstructors([]);
        }
      };
      
      initializeIndexes();
    }, []);

  // When user changes, reload their follows from user-specific storage
  useEffect(() => {
    if (currentUser?.id) {
      // New users always start fresh - clear any stored data
      if (currentUser.isNewUser || currentUser.userType === 'new_user') {
        const storageKey = `followedCommunities_${currentUser.id}`;
        localStorage.removeItem(storageKey);
        setFollowedCommunities([]);
        return;
      }

      const newFollows = loadFollowsForUser(currentUser.id, currentUser.isNewUser);
      setFollowedCommunities(newFollows);
    }
  }, [currentUser?.id]);

  // When followedCommunities changes, save to user-specific localStorage key
  useEffect(() => {
    if (!currentUser?.id) return;

    const saveFollowedCommunities = () => {
      try {
        const storageKey = `followedCommunities_${currentUser.id}`;
        localStorage.setItem(storageKey, JSON.stringify(followedCommunities));
        // Dispatch custom event so Sidebar can update
        window.dispatchEvent(new Event('communitiesUpdated'));
      } catch (error) {
        console.error('Error saving followedCommunities to localStorage:', error);
      }
    };

    saveFollowedCommunities();
  }, [followedCommunities, currentUser?.id]);

  // Sync purchased courses to their community's followedCourseIds
  // This ensures course pills show up for all enrolled courses
  useEffect(() => {
    if (!currentUser?.id || purchasedCourses.length === 0) return;

    let needsUpdate = false;
    const updatedCommunities = followedCommunities.map(community => {
      // Get the instructor ID for this community
      const instructorId = community.instructorId || parseInt(community.id?.replace('creator-', ''));
      if (!instructorId) return community;

      // Find which purchased courses belong to this instructor
      const instructorCourseIds = purchasedCourses.filter(courseId => {
        const course = getCourseById(courseId);
        return course && course.instructorId === instructorId;
      });

      // Check if any are missing from followedCourseIds
      const currentFollowed = community.followedCourseIds || [];
      const missingCourses = instructorCourseIds.filter(id => !currentFollowed.includes(id));

      if (missingCourses.length > 0) {
        needsUpdate = true;
        return {
          ...community,
          followedCourseIds: [...new Set([...currentFollowed, ...missingCourses])]
        };
      }
      return community;
    });

    if (needsUpdate) {
      setFollowedCommunities(updatedCommunities);
    }
  }, [purchasedCourses, currentUser?.id]); // Only run when purchasedCourses changes

    // 2. For each course button (dropdown and course list), use:
    // <button className={`follow-btn ${followedCourses.has(courseObj.id) ? 'following' : ''}`} ...>
    //   {followedCourses.has(courseObj.id) ? 'Following' : 'Follow'}
    // </button>
    // 3. For the top button, use:
    // <button className={`follow-btn ${isAnyCourseFollowed ? 'following' : ''}`} ...>
    //   {isAnyCourseFollowed ? 'Following' : 'Follow'}
    // </button>
    // 4. Remove any logic that could cause a stale or mismatched state.

    // Instructor data from database
  const [instructorsData, setInstructorsData] = useState(getAllInstructors());
  const instructorData = instructorsData[0]; // Default to first instructor

  // Remove embedded mock posts - all data should come from database
  const mockPosts = [];

      const [editingInstructor, setEditingInstructor] = useState(false);
    const [editedInstructorData, setEditedInstructorData] = useState({...instructorData});
    const [savedInstructorData, setSavedInstructorData] = useState(instructorData);

    // Update edited data when selected instructor changes
    React.useEffect(() => {
      if (selectedInstructor && !isReturningFromCourse) {
        // Get full instructor data with courses from database
        const fullInstructorData = getInstructorWithCourses(selectedInstructor.id);
        if (fullInstructorData) {
          setEditedInstructorData({...fullInstructorData});
          setSavedInstructorData(fullInstructorData);
        } else {
          setEditedInstructorData({...selectedInstructor});
          setSavedInstructorData(selectedInstructor);
        }
      }
      // Reset the flag after processing
      if (isReturningFromCourse) {
        setIsReturningFromCourse(false);
      }
    }, [selectedInstructor, isReturningFromCourse]);

      const handleSaveInstructor = () => {
      setEditingInstructor(false);
      const updatedInstructor = {...editedInstructorData};
      setSavedInstructorData(updatedInstructor);
      
      // Update the selected instructor with the new data
      setSelectedInstructor(updatedInstructor);
      
      // Update the instructor in the instructorsData array
      const updatedInstructorsData = instructorsData.map(instructor => 
        instructor.id === selectedInstructor.id ? updatedInstructor : instructor
      );
      setInstructorsData(updatedInstructorsData);
      
      // Here you would typically save to backend
    };

      const handleCancelEdit = () => {
      setEditingInstructor(false);
      setEditedInstructorData({...savedInstructorData});
    };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditedInstructorData({
          ...editedInstructorData,
          avatar: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };


  // Show About page
  if (activeMenu === 'About') {
    return (
      <div className="main-content">
        <AboutView
          isDarkMode={isDarkMode}
          onMenuChange={onMenuChange}
        />
      </div>
    );
  }

  // Show Discover when Discover is active - unified search for communities & courses
  // Skip if viewing a course (viewingCourseFromCommunity takes precedence)
  if (activeMenu === 'Discover' && !viewingCourseFromCommunity) {
    return (
      <DiscoverView
        isDarkMode={isDarkMode}
        currentUser={currentUser}
        onMenuChange={onMenuChange}
        indexedCourses={indexedCourses}
        indexedInstructors={indexedInstructors}
        followedCommunities={followedCommunities}
        setFollowedCommunities={setFollowedCommunities}
        isCoursePurchased={isCoursePurchased}
        isCourseFollowed={isCourseFollowed}
        handleFollowCourse={handleFollowCourse}
        isCreatorFollowed={isCreatorFollowed}
        handleFollowInstructor={handleFollowInstructor}
        signupCompleted={signupCompleted}
        setSignupCompleted={setSignupCompleted}
        onViewCourse={(course) => {
          // Push current Discover state to browser history BEFORE navigating
          // This ensures back button returns to Discover
          window.history.pushState({
            activeMenu: 'Discover',
            viewingCourse: null,
            selectedInstructor: null,
            activeTopMenu
          }, '', '');

          // Push Discover to navigation history so back button returns here
          setNavigationHistory(prev => [...prev, 'Discover']);
          // Reset enrollment flow state when viewing a new course
          setShowEnrollmentFlow(false);
          setEnrollingCourse(null);
          setViewingCourseFromCommunity(course);
        }}
        onViewCommunity={(instructor) => {
          // Push current Discover state to history BEFORE navigating
          // This ensures back button returns to Discover
          window.history.pushState({
            activeMenu: 'Discover',
            viewingCourse: null,
            selectedInstructor: null,
            activeTopMenu
          }, '', '');

          const fullData = getInstructorWithCourses(instructor.id);
          setSelectedInstructor(fullData || instructor);
          setSelectedCourse(null); // Clear any previously selected course
          setActiveTopMenu('creators');
          setPreviousBrowseContext({ type: 'discover' }); // Track that we came from Discover
          // Reset enrollment flow state
          setShowEnrollmentFlow(false);
          setEnrollingCourse(null);
          setViewingCourseFromCommunity(null);
          onMenuChange('Browse_Communities');
        }}
      />
    );
  }

  // Show Browse when Browse is active - now using BrowseView component
  if (activeMenu === 'Browse' || activeMenu === 'Browse_Reset' || activeMenu === 'Browse_Courses' || activeMenu === 'Browse_Communities') {
    return (
      <BrowseView
        isDarkMode={isDarkMode}
        currentUser={currentUser}
        onMenuChange={onMenuChange}
        activeTopMenu={activeTopMenu}
        setActiveTopMenu={setActiveTopMenu}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
        selectedInstructor={selectedInstructor}
        setSelectedInstructor={setSelectedInstructor}
        previousBrowseContext={previousBrowseContext}
        setPreviousBrowseContext={setPreviousBrowseContext}
        creatorProfileTab={creatorProfileTab}
        setCreatorProfileTab={setCreatorProfileTab}
        currentInstructorForCourse={currentInstructorForCourse}
        setCurrentInstructorForCourse={setCurrentInstructorForCourse}
        showEnrollmentFlow={showEnrollmentFlow}
        setShowEnrollmentFlow={setShowEnrollmentFlow}
        showEnrollOptions={showEnrollOptions}
        setShowEnrollOptions={setShowEnrollOptions}
        enrollingCourse={enrollingCourse}
        setEnrollingCourse={setEnrollingCourse}
        openCreatorFollowDropdown={openCreatorFollowDropdown}
        setOpenCreatorFollowDropdown={setOpenCreatorFollowDropdown}
        isFollowingLoading={isFollowingLoading}
        indexedCourses={indexedCourses}
        indexedInstructors={indexedInstructors}
        followedCommunities={followedCommunities}
        setFollowedCommunities={setFollowedCommunities}
        purchasedCourses={purchasedCourses}
        handleCoursePurchase={handleCoursePurchase}
        isCoursePurchased={isCoursePurchased}
        isCourseFollowed={isCourseFollowed}
        isCreatorFollowed={isCreatorFollowed}
        hasAnyCreatorCourseFollowed={hasAnyCreatorCourseFollowed}
        handleFollowInstructor={handleFollowInstructor}
        handleFollowCourse={handleFollowCourse}
        onRestoreCourseView={(course) => {
          // Restore course view when navigating back from creator profile
          // Need to exit Browse mode so MainContent shows PurchasedCourseDetail
          setViewingCourseFromCommunity(course);
          onMenuChange('Discover'); // Exit Browse mode - course view will take precedence
        }}
        onEnrollmentComplete={(course, booking) => {
          // Save the scheduled session (same logic as in viewingCourseFromCommunity enrollment)
          if (booking) {
            const newSession = addScheduledSession({
              courseId: course.id,
              courseName: course.title,
              teacherId: booking.teacher?.id,
              teacherName: booking.teacher?.name,
              date: booking.date,
              time: booking.time,
              status: 'scheduled',
              studentId: currentUser?.id,
              studentName: currentUser?.name
            });
            console.log('BrowseView session scheduled:', newSession);

            // Update the teacher's S-T stats (cross-user update)
            if (booking.teacher?.id) {
              const teacherStatsKey = `stTeacherStats_${booking.teacher.id}`;
              try {
                const existingStats = localStorage.getItem(teacherStatsKey);
                const stats = existingStats ? JSON.parse(existingStats) : {
                  activeStudents: [],
                  completedStudents: [],
                  totalEarned: 0,
                  pendingBalance: 0,
                  sessionsCompleted: 0,
                  rating: 0,
                  ratingCount: 0,
                  earningsHistory: []
                };

                // Check if this student+course combo already exists (not just student)
                const enrollmentId = `${currentUser?.id}-${course.id}`;
                const enrollmentExists = stats.activeStudents.some(s => s.id === enrollmentId);
                if (!enrollmentExists) {
                  stats.activeStudents.push({
                    id: enrollmentId,
                    name: currentUser?.name,
                    courseName: course.title,
                    courseId: course.id,
                    enrolledDate: new Date().toISOString()
                  });
                  stats.pendingBalance = (stats.pendingBalance || 0) + 315;
                }

                localStorage.setItem(teacherStatsKey, JSON.stringify(stats));

                // Save session to teacher's session list
                const teacherSessionsKey = `teacherSessions_${booking.teacher.id}`;
                const existingTeacherSessions = localStorage.getItem(teacherSessionsKey);
                const teacherSessionsList = existingTeacherSessions ? JSON.parse(existingTeacherSessions) : [];
                teacherSessionsList.push({
                  id: newSession.id,
                  courseId: course.id,
                  courseName: course.title,
                  teacherId: booking.teacher.id,
                  teacherName: booking.teacher.name,
                  date: booking.date,
                  time: booking.time,
                  status: 'scheduled',
                  studentId: currentUser?.id,
                  studentName: currentUser?.name,
                  createdAt: new Date().toISOString()
                });
                localStorage.setItem(teacherSessionsKey, JSON.stringify(teacherSessionsList));
              } catch (e) {
                console.error('Failed to update teacher stats:', e);
              }
            }
          }

          // Auto-join the course's community if not already following
          if (course.instructorId) {
            const creatorId = `creator-${course.instructorId}`;
            const instructor = getInstructorById(course.instructorId);

            // Use prev state inside callback to avoid stale closure issues
            setFollowedCommunities(prev => {
              const alreadyFollowing = prev.some(c => c.id === creatorId);
              if (!alreadyFollowing && instructor) {
                console.log('Auto-joined community:', instructor.name);
                return [...prev, {
                  id: creatorId,
                  type: 'creator',
                  name: instructor.name,
                  instructorId: instructor.id,
                  instructorName: instructor.name,
                  courseIds: instructor.courses || [],
                  followedCourseIds: [course.id],
                  description: instructor.bio,
                  avatar: instructor.avatar
                }];
              } else if (alreadyFollowing) {
                // Already following - just add this course to followedCourseIds if not already there
                return prev.map(c => {
                  if (c.id === creatorId && !(c.followedCourseIds || []).includes(course.id)) {
                    return {
                      ...c,
                      followedCourseIds: [...(c.followedCourseIds || []), course.id]
                    };
                  }
                  return c;
                });
              }
              return prev;
            });
          }

          // Navigate to My Courses and show the purchased course detail
          setViewingCourseFromCommunity(course);
          setNavigationHistory(prev => [...prev, 'My Courses']);
          onMenuChange('My Courses');
        }}
      />
    );
  }

  // Show Course when viewing a course (from community, dashboard, or My Courses)
  // This check must come BEFORE My Courses check so clicking a course shows detail
  if (viewingCourseFromCommunity) {
    // Check if the course is purchased - show PurchasedCourseDetail instead
    const isPurchased = isCoursePurchased(viewingCourseFromCommunity?.id);
    const previousPage = navigationHistory[navigationHistory.length - 1] || 'Discover';
    const backLabel = previousPage === 'Discover' ? 'Back to Discover' : previousPage === 'My Courses' ? 'Back to My Courses' : 'Back';

    // Consistent header wrapper for course detail views
    const CourseDetailWrapper = ({ children }) => (
      <div className="main-content" style={{ background: isDarkMode ? '#000' : '#f8fafc', minHeight: '100vh' }}>
        {/* Header with Back Button */}
        <div style={{
          padding: '16px 20px',
          borderBottom: isDarkMode ? '1px solid #27272a' : '1px solid #e5e7eb',
          background: isDarkMode ? '#0a0a0a' : '#fff'
        }}>
          <button
            onClick={handleBackFromCourse}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: isDarkMode ? '#1a1a24' : '#f3f4f6',
              border: isDarkMode ? '1px solid #3f3f46' : '1px solid #d1d5db',
              borderRadius: 8,
              padding: '10px 16px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 15,
              color: isDarkMode ? '#f5f5f7' : '#374151',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDarkMode ? '#27272a' : '#e5e7eb';
              e.currentTarget.style.borderColor = '#6366f1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isDarkMode ? '#1a1a24' : '#f3f4f6';
              e.currentTarget.style.borderColor = isDarkMode ? '#3f3f46' : '#d1d5db';
            }}
          >
            <span style={{ fontSize: 18 }}>←</span>
            {backLabel}
          </button>
        </div>
        {children}
      </div>
    );

    // Show FindTeacherView when browsing student teachers from course detail
    if (showFindTeacher && enrollingCourse) {
      return (
        <CourseDetailWrapper>
          <FindTeacherView
            course={enrollingCourse}
            isDarkMode={isDarkMode}
            onClose={() => {
              setShowFindTeacher(false);
              setEnrollingCourse(null);
            }}
            onSelectTeacher={(teacher) => {
              // Close find teacher view and open enrollment flow with pre-selected teacher
              setShowFindTeacher(false);
              setPreSelectedTeacher(teacher);
              setShowEnrollmentFlow(true);
            }}
            onViewTeacherProfile={(user) => {
              // Save FULL navigation state BEFORE modifying anything
              setNavigationHistory(prev => [...prev, {
                menu: 'Discover',
                feed: commonsActiveFeed,
                showFindTeacher: true,
                enrollingCourse: enrollingCourse,
                viewingCourseFromCommunity: viewingCourseFromCommunity
              }]);
              // Now clear the states and navigate to profile
              setShowFindTeacher(false);
              setViewingCourseFromCommunity(null);
              setEnrollingCourse(null);
              onMenuChange('Profile');
              setViewingMemberProfile(user);
            }}
          />
        </CourseDetailWrapper>
      );
    }

    if (isPurchased) {
      return (<>
        <CourseDetailWrapper>
          <CourseDetailView
            course={viewingCourseFromCommunity}
            onBack={handleBackFromCourse}
            isDarkMode={isDarkMode}
            followedCommunities={followedCommunities}
            setFollowedCommunities={setFollowedCommunities}
            onViewInstructor={(instructorId) => {
              // Navigate to creator profile in Browse, remembering the course for back navigation
              const instructor = getInstructorById(instructorId);
              setPreviousBrowseContext({ type: 'course', course: viewingCourseFromCommunity });
              setSelectedInstructor(instructor);
              setActiveTopMenu('creators');
              setViewingCourseFromCommunity(null);
              onMenuChange('Browse');
            }}
            isCoursePurchased={true}
            currentUser={currentUser}
            onMenuChange={onMenuChange}
            scheduledSessions={scheduledSessions}
            onRescheduleSession={(session) => setRescheduleModalSession(session)}
            onBrowseStudentTeachers={() => {
              setEnrollingCourse(viewingCourseFromCommunity);
              setShowFindTeacher(true);
            }}
          />
        </CourseDetailWrapper>
        {rescheduleModalSession && (
          <RescheduleModal
            session={rescheduleModalSession}
            isDarkMode={isDarkMode}
            onClose={() => setRescheduleModalSession(null)}
            onConfirm={rescheduleSession}
          />
        )}
      </>);
    }

    // Show EnrollOptionsModal when user clicks Enroll (before EnrollmentFlow)
    if (showEnrollOptions && enrollingCourse) {
      return (
        <CourseDetailWrapper>
          <CourseDetailView
            course={enrollingCourse}
            instructor={getInstructorById(enrollingCourse.instructorId)}
            isDarkMode={isDarkMode}
            onClose={() => {
              setShowEnrollOptions(false);
              setEnrollingCourse(null);
            }}
            isCoursePurchased={false}
            currentUser={currentUser}
            onMenuChange={onMenuChange}
            scheduledSessions={scheduledSessions}
            onEnroll={() => {}} // Disabled since we're already showing options
          />
          <EnrollOptionsModal
            course={enrollingCourse}
            instructor={getInstructorById(enrollingCourse.instructorId)}
            isDarkMode={isDarkMode}
            onClose={() => {
              setShowEnrollOptions(false);
              setEnrollingCourse(null);
            }}
            onSelectPurchase={() => {
              // Option 1: Purchase now, schedule later - show payment modal
              setShowEnrollOptions(false);
              setShowPurchaseModal(true);
            }}
            onSelectFindTeacher={() => {
              // Option 2: Find a student teacher (full screen list)
              setShowEnrollOptions(false);
              setShowFindTeacher(true);
            }}
            onSelectPickDate={() => {
              // Option 3: Pick a date first (existing calendar flow)
              setShowEnrollOptions(false);
              setShowEnrollmentFlow(true);
            }}
          />
        </CourseDetailWrapper>
      );
    }

    // Show PurchaseModal when user selects "Purchase Course Now, Schedule Later"
    if (showPurchaseModal && enrollingCourse) {
      return (
        <CourseDetailWrapper>
          <CourseDetailView
            course={enrollingCourse}
            instructor={getInstructorById(enrollingCourse.instructorId)}
            isDarkMode={isDarkMode}
            onClose={() => {
              setShowPurchaseModal(false);
              setEnrollingCourse(null);
            }}
            isCoursePurchased={false}
            currentUser={currentUser}
            onMenuChange={onMenuChange}
            scheduledSessions={scheduledSessions}
            onEnroll={() => {}} // Disabled since we're in purchase flow
          />
          <PurchaseModal
            course={enrollingCourse}
            instructor={getInstructorById(enrollingCourse.instructorId)}
            isDarkMode={isDarkMode}
            onClose={() => {
              setShowPurchaseModal(false);
              setEnrollingCourse(null);
            }}
            onPurchaseComplete={(destination) => {
              // Complete the purchase
              handleCoursePurchase(enrollingCourse.id);

              // Auto-join the course's community
              if (enrollingCourse.instructorId) {
                const creatorId = `creator-${enrollingCourse.instructorId}`;
                const instructor = getInstructorById(enrollingCourse.instructorId);

                setFollowedCommunities(prev => {
                  const existingCommunity = prev.find(c => c.id === creatorId);
                  if (!existingCommunity) {
                    return [...prev, {
                      id: creatorId,
                      instructorId: enrollingCourse.instructorId,
                      instructorName: instructor.name,
                      courseIds: instructor.courses || [],
                      followedCourseIds: [enrollingCourse.id],
                      description: instructor.bio,
                      avatar: instructor.avatar
                    }];
                  } else {
                    return prev.map(c => {
                      if (c.id === creatorId && !(c.followedCourseIds || []).includes(enrollingCourse.id)) {
                        return {
                          ...c,
                          followedCourseIds: [...(c.followedCourseIds || []), enrollingCourse.id]
                        };
                      }
                      return c;
                    });
                  }
                });
              }

              setShowPurchaseModal(false);

              if (destination === 'schedule') {
                // Open enrollment flow to schedule a session
                setShowEnrollmentFlow(true);
              } else {
                // Go to My Courses
                setViewingCourseFromCommunity(enrollingCourse);
                setEnrollingCourse(null);
                setNavigationHistory(prev => [...prev, 'My Courses']);
                onMenuChange('My Courses');
              }
            }}
          />
        </CourseDetailWrapper>
      );
    }

    // Show FindTeacherView when user selects "Find a Student Teacher"
    if (showFindTeacher && enrollingCourse) {
      return (
        <CourseDetailWrapper>
          <FindTeacherView
            course={enrollingCourse}
            isDarkMode={isDarkMode}
            onClose={() => {
              setShowFindTeacher(false);
              setEnrollingCourse(null);
            }}
            onSelectTeacher={(teacher) => {
              // Close find teacher view and open enrollment flow with pre-selected teacher
              setShowFindTeacher(false);
              setPreSelectedTeacher(teacher);
              setShowEnrollmentFlow(true);
            }}
            onViewTeacherProfile={(user) => {
              // Save FULL navigation state BEFORE modifying anything
              setNavigationHistory(prev => [...prev, {
                menu: 'Discover',
                feed: commonsActiveFeed,
                showFindTeacher: true,
                enrollingCourse: enrollingCourse,
                viewingCourseFromCommunity: viewingCourseFromCommunity
              }]);
              // Now clear the states and navigate to profile
              setShowFindTeacher(false);
              setViewingCourseFromCommunity(null);
              setEnrollingCourse(null);
              onMenuChange('Profile');
              setViewingMemberProfile(user);
            }}
          />
        </CourseDetailWrapper>
      );
    }

    // Show EnrollmentFlow modal when active (Pick a Date First option)
    if (showEnrollmentFlow && enrollingCourse) {
      return (
        <CourseDetailWrapper>
          <EnrollmentFlow
            course={enrollingCourse}
            instructor={getInstructorById(enrollingCourse.instructorId)}
            isDarkMode={isDarkMode}
            preSelectedTeacher={preSelectedTeacher}
            onClose={() => {
              setShowEnrollmentFlow(false);
              setEnrollingCourse(null);
              setPreSelectedTeacher(null);
            }}
            onComplete={(booking) => {
              console.log('Booking complete:', booking);
              handleCoursePurchase(enrollingCourse.id);
              setPreSelectedTeacher(null);

              // Save the scheduled session
              const newSession = addScheduledSession({
                courseId: enrollingCourse.id,
                courseName: enrollingCourse.title,
                teacherId: booking.teacher?.id,
                teacherName: booking.teacher?.name,
                date: booking.date,
                time: booking.time,
                status: 'scheduled',
                studentId: currentUser?.id,
                studentName: currentUser?.name
              });
              console.log('Session scheduled:', newSession);

              // Update the teacher's S-T stats (cross-user update)
              // This adds the student to the teacher's Active Students
              if (booking.teacher?.id) {
                const teacherStatsKey = `stTeacherStats_${booking.teacher.id}`;
                try {
                  const existingStats = localStorage.getItem(teacherStatsKey);
                  const stats = existingStats ? JSON.parse(existingStats) : {
                    activeStudents: [],
                    completedStudents: [],
                    totalEarned: 0,
                    pendingBalance: 0,
                    sessionsCompleted: 0,
                    rating: 0,
                    ratingCount: 0,
                    earningsHistory: []
                  };

                  // Add student to activeStudents if this student+course combo doesn't exist
                  const enrollmentId = `${currentUser?.id}-${enrollingCourse.id}`;
                  const enrollmentExists = stats.activeStudents.some(s => s.id === enrollmentId);
                  if (!enrollmentExists) {
                    stats.activeStudents.push({
                      id: enrollmentId,
                      name: currentUser?.name,
                      courseName: enrollingCourse.title,
                      courseId: enrollingCourse.id,
                      enrolledDate: new Date().toISOString()
                    });
                    stats.pendingBalance = (stats.pendingBalance || 0) + 315;
                  }

                  localStorage.setItem(teacherStatsKey, JSON.stringify(stats));
                  console.log('Updated teacher stats for:', booking.teacher.name, stats);

                  // If this is the current user (teacher viewing their own dashboard), update state too
                  if (currentUser?.id === booking.teacher.id) {
                    setStTeacherStats(stats);
                  }

                  // Also save the session to teacher's session list (so they can see it)
                  const teacherSessionsKey = `teacherSessions_${booking.teacher.id}`;
                  const existingTeacherSessions = localStorage.getItem(teacherSessionsKey);
                  const teacherSessionsList = existingTeacherSessions ? JSON.parse(existingTeacherSessions) : [];
                  teacherSessionsList.push({
                    id: newSession.id,
                    courseId: enrollingCourse.id,
                    courseName: enrollingCourse.title,
                    teacherId: booking.teacher.id,
                    teacherName: booking.teacher.name,
                    date: booking.date,
                    time: booking.time,
                    status: 'scheduled',
                    studentId: currentUser?.id,
                    studentName: currentUser?.name,
                    createdAt: new Date().toISOString()
                  });
                  localStorage.setItem(teacherSessionsKey, JSON.stringify(teacherSessionsList));
                  console.log('Saved session to teacher sessions:', teacherSessionsList);
                } catch (e) {
                  console.error('Failed to update teacher stats:', e);
                }
              }

              // Auto-join the course's community if not already following
              if (enrollingCourse.instructorId) {
                const creatorId = `creator-${enrollingCourse.instructorId}`;
                const instructor = getInstructorById(enrollingCourse.instructorId);

                // Use prev state inside callback to avoid stale closure issues
                setFollowedCommunities(prev => {
                  const alreadyFollowing = prev.some(c => c.id === creatorId);
                  if (!alreadyFollowing && instructor) {
                    console.log('Auto-joined community:', instructor.name);
                    return [...prev, {
                      id: creatorId,
                      type: 'creator',
                      name: instructor.name,
                      instructorId: instructor.id,
                      instructorName: instructor.name,
                      courseIds: instructor.courses || [],
                      followedCourseIds: [enrollingCourse.id],
                      description: instructor.bio,
                      avatar: instructor.avatar
                    }];
                  } else if (alreadyFollowing) {
                    // Already following - just add this course to followedCourseIds if not already there
                    return prev.map(c => {
                      if (c.id === creatorId && !(c.followedCourseIds || []).includes(enrollingCourse.id)) {
                        return {
                          ...c,
                          followedCourseIds: [...(c.followedCourseIds || []), enrollingCourse.id]
                        };
                      }
                      return c;
                    });
                  }
                  return prev;
                });
              }

              setShowEnrollmentFlow(false);
              // Show the purchased course detail
              setViewingCourseFromCommunity(enrollingCourse);
              setEnrollingCourse(null);
              // Navigate to My Courses with proper back button support
              setNavigationHistory(prev => [...prev, 'My Courses']);
              onMenuChange('My Courses');
            }}
            onViewTeacherProfile={(user) => {
              // Close enrollment flow and navigate to profile
              setShowEnrollmentFlow(false);
              setEnrollingCourse(null);
              setPreSelectedTeacher(null);
              setViewingMemberProfile(user);
            }}
          />
        </CourseDetailWrapper>
      );
    }

    return (
      <CourseDetailWrapper>
        <CourseDetailView
          course={viewingCourseFromCommunity}
          onBack={handleBackFromCourse}
          isDarkMode={isDarkMode}
          followedCommunities={followedCommunities}
          setFollowedCommunities={setFollowedCommunities}
          onViewInstructor={(instructorId) => {
            const instructor = getInstructorById(instructorId);
            setPreviousBrowseContext({ type: 'course', course: viewingCourseFromCommunity });
            setSelectedInstructor(instructor);
            setActiveTopMenu('creators');
            setViewingCourseFromCommunity(null);
            onMenuChange('Browse');
          }}
          isCoursePurchased={false}
          currentUser={currentUser}
          onMenuChange={onMenuChange}
          scheduledSessions={scheduledSessions}
          onEnroll={(course) => {
            setEnrollingCourse(course);
            setShowEnrollOptions(true); // Show options modal first
          }}
        />
      </CourseDetailWrapper>
    );
  }

  // Show EnrollmentFlow when scheduling from My Courses (Schedule Now button)
  if (showEnrollmentFlow && enrollingCourse && activeMenu === 'My Courses') {
    return (
      <div className="main-content">
        <div className="three-column-layout browse-layout">
          <EnrollmentFlow
            course={enrollingCourse}
            instructor={getInstructorById(enrollingCourse.instructorId)}
            isDarkMode={isDarkMode}
            isAlreadyPurchased={true}
            preSelectedTeacher={preSelectedTeacher}
            onClose={() => {
              setShowEnrollmentFlow(false);
              setEnrollingCourse(null);
              setPreSelectedTeacher(null);
            }}
            onComplete={(booking) => {
              console.log('Booking complete from My Courses:', booking);
              setPreSelectedTeacher(null);

              // Save the scheduled session
              const newSession = addScheduledSession({
                courseId: enrollingCourse.id,
                courseName: enrollingCourse.title,
                teacherId: booking.teacher?.id,
                teacherName: booking.teacher?.name,
                date: booking.date,
                time: booking.time,
                status: 'scheduled',
                studentId: currentUser?.id,
                studentName: currentUser?.name
              });
              console.log('Session scheduled:', newSession);

              // Update the teacher's S-T stats (cross-user update)
              if (booking.teacher?.id) {
                const teacherStatsKey = `stTeacherStats_${booking.teacher.id}`;
                try {
                  const existingStats = localStorage.getItem(teacherStatsKey);
                  const stats = existingStats ? JSON.parse(existingStats) : {
                    activeStudents: [],
                    completedStudents: [],
                    totalEarned: 0,
                    pendingBalance: 0,
                    sessionsCompleted: 0,
                    rating: 0,
                    ratingCount: 0,
                    earningsHistory: []
                  };

                  const enrollmentId = `${currentUser?.id}-${enrollingCourse.id}`;
                  const enrollmentExists = stats.activeStudents.some(s => s.id === enrollmentId);
                  if (!enrollmentExists) {
                    stats.activeStudents.push({
                      id: enrollmentId,
                      name: currentUser?.name,
                      courseName: enrollingCourse.title,
                      courseId: enrollingCourse.id,
                      enrolledDate: new Date().toISOString()
                    });
                    stats.pendingBalance = (stats.pendingBalance || 0) + 315;
                  }

                  localStorage.setItem(teacherStatsKey, JSON.stringify(stats));
                  console.log('Updated teacher stats from My Courses:', booking.teacher.name, stats);

                  if (currentUser?.id === booking.teacher.id) {
                    setStTeacherStats(stats);
                  }

                  // Save session to teacher's session list
                  const teacherSessionsKey = `teacherSessions_${booking.teacher.id}`;
                  const existingTeacherSessions = localStorage.getItem(teacherSessionsKey);
                  const teacherSessionsList = existingTeacherSessions ? JSON.parse(existingTeacherSessions) : [];
                  teacherSessionsList.push({
                    id: newSession.id,
                    courseId: enrollingCourse.id,
                    courseName: enrollingCourse.title,
                    teacherId: booking.teacher.id,
                    teacherName: booking.teacher.name,
                    date: booking.date,
                    time: booking.time,
                    status: 'scheduled',
                    studentId: currentUser?.id,
                    studentName: currentUser?.name,
                    createdAt: new Date().toISOString()
                  });
                  localStorage.setItem(teacherSessionsKey, JSON.stringify(teacherSessionsList));
                  console.log('Saved session to teacher sessions from My Courses:', teacherSessionsList);
                } catch (e) {
                  console.error('Failed to update teacher stats from My Courses:', e);
                }
              }

              setShowEnrollmentFlow(false);
              setEnrollingCourse(null);
            }}
            purchasedCourses={purchasedCourses}
            scheduledSessions={scheduledSessions}
            currentUser={currentUser}
            onViewTeacherProfile={(user) => {
              // Close enrollment flow and navigate to profile
              setShowEnrollmentFlow(false);
              setEnrollingCourse(null);
              setPreSelectedTeacher(null);
              setViewingMemberProfile(user);
            }}
          />
        </div>
      </div>
    );
  }

  // Show Profile when viewing a member (check before My Courses to allow profile from scheduling flow)
  if (viewingMemberProfile) {
    return (
      <div className="main-content">
        <Profile
          currentUser={currentUser}
          viewingUser={viewingMemberProfile}
          onBack={handleBackFromMemberProfile}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      </div>
    );
  }

  // Show My Courses when My Courses is active
  if (activeMenu === 'My Courses') {
    return (<>
      <MyCoursesView
        isDarkMode={isDarkMode}
        currentUser={currentUser}
        onMenuChange={onMenuChange}
        purchasedCourses={purchasedCourses}
        indexedCourses={indexedCourses}
        onViewCourse={(courseId) => {
          // Push current My Courses state to browser history BEFORE navigating
          // This ensures back button returns to My Courses
          window.history.pushState({
            activeMenu: 'My Courses',
            viewingCourse: null,
            selectedInstructor: null,
            activeTopMenu
          }, '', '');
          // Push My Courses to navigation history so back button returns here
          setNavigationHistory(prev => [...prev, 'My Courses']);
          // Navigate to course detail
          handleViewCourseFromCommunity(courseId);
        }}
        onViewCreatorProfile={(instructor) => {
          // Push current My Courses state to browser history BEFORE navigating
          // This ensures back button returns to My Courses
          window.history.pushState({
            activeMenu: 'My Courses',
            viewingCourse: null,
            selectedInstructor: null,
            activeTopMenu
          }, '', '');
          // Push My Courses to navigation history
          setNavigationHistory(prev => [...prev, 'My Courses']);
          // Navigate to creator profile
          const fullData = getInstructorWithCourses(instructor.id);
          setSelectedInstructor(fullData || instructor);
          setSelectedCourse(null); // Clear any selected course so profile shows
          setActiveTopMenu('creators');
          setPreviousBrowseContext({ type: 'my-courses' }); // Track that we came from My Courses
          setViewingCourseFromCommunity(null);
          onMenuChange('Browse');
        }}
        isCourseFollowed={isCourseFollowed}
        handleFollowCourse={handleFollowCourse}
        isCreatorFollowed={isCreatorFollowed}
        handleFollowInstructor={handleFollowInstructor}
        scheduledSessions={scheduledSessions}
        addScheduledSession={addScheduledSession}
        cancelScheduledSession={cancelScheduledSession}
        onRescheduleSession={(session) => setRescheduleModalSession(session)}
        onScheduleSession={(course) => {
          // Open enrollment flow for scheduling a session
          setEnrollingCourse(course);
          setShowEnrollmentFlow(true);
        }}
      />
      {rescheduleModalSession && (
        <RescheduleModal
          session={rescheduleModalSession}
          isDarkMode={isDarkMode}
          onClose={() => setRescheduleModalSession(null)}
          onConfirm={rescheduleSession}
          onMoreOptions={(session) => {
            setRescheduleModalSession(null);
            const course = getCourseById(session.courseId);
            if (course) {
              setEnrollingCourse(course);
              setShowEnrollOptions(true);
            }
          }}
        />
      )}
      {rescheduleToast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#10b981',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 600,
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <span>&#10003;</span> {rescheduleToast}
        </div>
      )}
      {showEnrollOptions && enrollingCourse && (
        <EnrollOptionsModal
          course={enrollingCourse}
          instructor={getInstructorById(enrollingCourse.instructorId)}
          isDarkMode={isDarkMode}
          onClose={() => {
            setShowEnrollOptions(false);
            setEnrollingCourse(null);
          }}
          onSelectPurchase={() => {
            setShowEnrollOptions(false);
            setShowPurchaseModal(true);
          }}
          onSelectFindTeacher={() => {
            setShowEnrollOptions(false);
            setShowFindTeacher(true);
          }}
          onSelectPickDate={() => {
            setShowEnrollOptions(false);
            setShowEnrollmentFlow(true);
          }}
        />
      )}
    </>
    );
  }

  // Show UserProfile when viewing another user's profile (legacy - from direct username lookup)
  if (viewingUserProfile) {
    return (
      <div className="main-content">
        <UserProfile
          username={viewingUserProfile}
          onBack={handleBackFromUserProfile}
          isDarkMode={isDarkMode}
        />
      </div>
    );
  }

  // Show appropriate Dashboard based on user type
  if (activeMenu === 'Workspace') {
    // New Users and Students see Student Dashboard
    if (currentUser?.isNewUser || currentUser?.userType === 'new_user' || currentUser?.userType === 'student') {
      return (
        <div className="main-content">
          <StudentDashboard
            isDarkMode={isDarkMode}
            currentUser={currentUser}
            onMenuChange={onMenuChange}
            purchasedCourses={purchasedCourses}
            onViewCourse={handleViewCourseFromCommunity}
          />
        </div>
      );
    }
    // Student-Teachers see Student-Teacher Dashboard
    if (currentUser?.userType === 'student_teacher') {
      return (
        <div className="main-content">
          <StudentTeacherDashboard
            isDarkMode={isDarkMode}
            currentUser={currentUser}
            onMenuChange={onMenuChange}
            stTeacherStats={stTeacherStats}
            onAddActiveStudent={addActiveStudent}
            onCompleteSession={completeStSession}
            onCertifyStudent={certifyStudent}
            scheduledSessions={teacherSessions}
            onJoinSession={handleJoinBbbSession}
          />
          {/* BBB Video Session Modal */}
          {showBbbModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.9)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 20px',
                background: isDarkMode ? '#16181c' : '#f8fafc',
                borderBottom: `1px solid ${isDarkMode ? '#2f3336' : '#e2e8f0'}`
              }}>
                <span style={{ color: isDarkMode ? '#e7e9ea' : '#0f172a', fontWeight: 600 }}>
                  Video Session
                </span>
                <button
                  onClick={() => { setShowBbbModal(false); setBbbJoinUrl(null); }}
                  style={{
                    background: '#ef4444',
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Leave Session
                </button>
              </div>
              <div style={{ flex: 1 }}>
                {bbbJoinUrl ? (
                  <iframe
                    src={bbbJoinUrl}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allow="camera; microphone; display-capture; fullscreen"
                    title="BigBlueButton Session"
                  />
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#fff'
                  }}>
                    Loading session...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }
    // Creators and Admins see Creator Dashboard (full-width, no sidebar)
    if (currentUser?.userType === 'creator' || currentUser?.userType === 'admin' ||
        currentUser?.roles?.includes('creator') || currentUser?.roles?.includes('instructor')) {
      return (
        <div className="main-content full-width">
          <CreatorDashboard isDarkMode={isDarkMode} currentUser={currentUser} onMenuChange={onMenuChange} />
        </div>
      );
    }
    // Default: Dashboard (Learning/Teaching toggle)
    return (
      <div className="main-content">
        <Dashboard
          isDarkMode={isDarkMode}
          currentUser={currentUser}
          onMenuChange={onMenuChange}
          purchasedCourses={purchasedCourses}
          onViewCourse={handleViewCourseFromCommunity}
        />
      </div>
    );
  }


  // Show Community when My Community is active
  if (activeMenu === 'My Community') {
    return (
      <div className="main-content">
        <Community
          followedCommunities={followedCommunities}
          setFollowedCommunities={setFollowedCommunities}
          isDarkMode={isDarkMode}
          currentUser={currentUser}
          onMenuChange={onMenuChange}
          onViewUserProfile={handleViewUserProfile}
          onViewMemberProfile={handleViewMemberProfile}
          onViewCourse={handleViewCourseFromCommunity}
          signupCompleted={signupCompleted}
          setSignupCompleted={setSignupCompleted}
          commonsActiveFeed={commonsActiveFeed}
          setCommonsActiveFeed={setCommonsActiveFeed}
          onViewCreatorProfile={(creator) => {
            // Navigate to creator profile in Browse with back navigation to Feeds
            const instructorId = creator.instructorId || (typeof creator.id === 'string' ? creator.id.replace('creator-', '') : creator.id);
            const fullData = getInstructorWithCourses(instructorId);
            setSelectedInstructor(fullData || creator);
            setSelectedCourse(null); // Clear any selected course so profile shows
            setActiveTopMenu('creators');
            // Format community object with id as "creator-{id}" for back navigation
            const communityForBack = {
              id: `creator-${instructorId}`,
              name: creator.name,
              instructorId: instructorId
            };
            setPreviousBrowseContext({ type: 'feeds', community: communityForBack });
            setNavigationHistory(prev => [...prev, 'My Community']);
            onMenuChange('Browse_Communities');
          }}
        />
      </div>
    );
  }

  // Show Notifications when Notifications is active
  if (activeMenu === 'Notifications') {
    return <Notifications isDarkMode={isDarkMode} />;
  }

  // Show Profile when Profile is active
  if (activeMenu === 'Profile') {
    return (
      <div className="main-content">
        <Profile
          currentUser={currentUser}
          onSwitchUser={typeof onSwitchUser === 'function' ? onSwitchUser : undefined}
          onMenuChange={onMenuChange}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      </div>
    );
  }

  // Show Job Exchange when Job Exchange is active
  if (activeMenu === 'Job Exchange') {
    return (
      <div className="main-content">
        <JobExchange />
      </div>
    );
  }

  // Show Settings when Settings is active
  if (activeMenu === 'Settings') {
    return (
      <div className="main-content">
        <Settings 
          currentUser={currentUser}
          onMenuChange={onMenuChange}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => {
            // Toggle dark mode via document class
            document.documentElement.classList.toggle('dark-mode');
          }}
        />
      </div>
    );
  }

  // Show CreatorProfile when CreatorProfile is active
  if (activeMenu === 'CreatorProfile') {
    return (
      <div className="main-content">
        <CreatorProfile 
          currentUser={currentUser}
          onBackToMain={() => onMenuChange('Profile')}
          onSwitchToCreatorMode={() => onMenuChange('CreatorMode')}
        />
      </div>
    );
  }

  // Show CreatorMode when in creator mode
  if (['create-course', 'edit-courses', 'preview-courses', 'analytics', 'student-management'].includes(activeMenu)) {
    return (
      <div className="main-content">
        <CreatorMode 
          activeMenu={activeMenu}
          currentUser={currentUser}
        />
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="feed-header">
        <h1>{activeMenu}</h1>
      </div>

      <div className="feed-posts">
        {mockPosts.length > 0 ? (
          mockPosts.map(post => (
            <div key={post.id} className="post">
              <div className="post-avatar">
                <img src={post.avatar} alt={post.author} />
              </div>
              <div className="post-content">
                <div className="post-header">
                  <span className="post-author">{post.author}</span>
                  <span className="post-handle">{post.handle}</span>
                  <span className="post-timestamp">· {post.timestamp}</span>
                </div>
                <div className="post-text">
                  {post.content}
                </div>
                <div className="post-actions">
                  <button className="action-btn">
                    <span className="action-icon">💬</span>
                    <span className="action-count">{post.replies}</span>
                  </button>
                  <button className="action-btn">
                    <span className="action-icon">🔄</span>
                    <span className="action-count">{post.retweets}</span>
                  </button>
                  <button className="action-btn">
                    <span className="action-icon">❤️</span>
                    <span className="action-count">{post.likes}</span>
                  </button>
                  <button className="action-btn">
                    <span className="action-icon">📊</span>
                    <span className="action-count">{post.views}</span>
                  </button>
                  <button className="action-btn">
                    <span className="action-icon">📤</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <h2>No content available</h2>
            <p>Content will appear here when available.</p>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {rescheduleModalSession && (
        <RescheduleModal
          session={rescheduleModalSession}
          isDarkMode={isDarkMode}
          onClose={() => setRescheduleModalSession(null)}
          onConfirm={rescheduleSession}
          onMoreOptions={(session) => {
            setRescheduleModalSession(null);
            const course = getCourseById(session.courseId);
            if (course) {
              setEnrollingCourse(course);
              setShowEnrollOptions(true);
            }
          }}
        />
      )}

      {/* Reschedule Toast */}
      {rescheduleToast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#10b981',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 600,
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          animation: 'fadeInUp 0.3s ease'
        }}>
          <span>&#10003;</span> {rescheduleToast}
        </div>
      )}
    </div>
  );
};

MainContent.propTypes = {
  activeMenu: PropTypes.string.isRequired,
  currentUser: UserPropType.isRequired,
  onSwitchUser: PropTypes.func.isRequired
};

export default MainContent; 