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
  const [navigationHistory, setNavigationHistory] = useState([]); // track where user came from
  const [viewingCourseFromCommunity, setViewingCourseFromCommunity] = useState(null); // course being viewed from community

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
    const mainMenus = ['My Community', 'Discover', 'Browse', 'My Courses', 'Dashboard', 'Profile'];
    if (mainMenus.includes(activeMenu) && !viewingCourseFromCommunity && !selectedInstructor) {
      window.history.pushState({
        activeMenu,
        viewingCourse: null,
        selectedInstructor: null,
        activeTopMenu
      }, '', '');
    }
  }, [activeMenu]);

  // Clear course view when navigating to main menus (fixes navigation staying stuck on course detail)
  useEffect(() => {
    const menusToReset = ['Discover', 'Dashboard', 'My Community', 'Profile', 'Settings', 'Browse', 'My Courses'];
    if (menusToReset.includes(activeMenu)) {
      setViewingCourseFromCommunity(null);
      setViewingUserProfile(null);
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

  // Purchased courses - courses the user has bought (enables course-level follow/unfollow)
  const [purchasedCourses, setPurchasedCourses] = useState(() => {
    // New User (demo_new) starts with no courses - completely fresh
    if (currentUser?.id === 'demo_new') {
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

    // New User (demo_new) has no courses - completely fresh
    if (currentUser.id === 'demo_new') {
      setPurchasedCourses([]);
      return;
    }

    // Alex (demo_alex) always has all of Guy Rymberg's courses - hardcoded
    if (currentUser.id === 'demo_alex') {
      setPurchasedCourses(GUY_RYMBERG_COURSES);
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

    if (isPurchased) {
      return (
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
          />
        </CourseDetailWrapper>
      );
    }

    // Show EnrollmentFlow modal when active
    if (showEnrollmentFlow && enrollingCourse) {
      return (
        <CourseDetailWrapper>
          <EnrollmentFlow
            course={enrollingCourse}
            instructor={getInstructorById(enrollingCourse.instructorId)}
            isDarkMode={isDarkMode}
            onClose={() => {
              setShowEnrollmentFlow(false);
              setEnrollingCourse(null);
            }}
            onComplete={(booking) => {
              console.log('Booking complete:', booking);
              handleCoursePurchase(enrollingCourse.id);
              setShowEnrollmentFlow(false);
              setEnrollingCourse(null);
              onMenuChange('Dashboard');
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
          onEnroll={(course) => {
            setEnrollingCourse(course);
            setShowEnrollmentFlow(true);
          }}
        />
      </CourseDetailWrapper>
    );
  }

  // Show My Courses when My Courses is active
  if (activeMenu === 'My Courses') {
    return (
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
      />
    );
  }

  // Show UserProfile when viewing another user's profile
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
  if (activeMenu === 'Dashboard') {
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
          />
        </div>
      );
    }
    // Creators and Admins see Creator Dashboard
    if (currentUser?.userType === 'creator' || currentUser?.userType === 'admin' ||
        currentUser?.roles?.includes('creator') || currentUser?.roles?.includes('instructor')) {
      return (
        <div className="main-content">
          <CreatorDashboard isDarkMode={isDarkMode} currentUser={currentUser} />
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
          onViewCourse={handleViewCourseFromCommunity}
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
    </div>
  );
};

MainContent.propTypes = {
  activeMenu: PropTypes.string.isRequired,
  currentUser: UserPropType.isRequired,
  onSwitchUser: PropTypes.func.isRequired
};

export default MainContent; 