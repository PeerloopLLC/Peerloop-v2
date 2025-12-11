import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './MainContent.css';
import { FaImage, FaSmile, FaCalendar, FaMapMarkerAlt, FaGlobe, FaSearch, FaBook, FaUser, FaFilter, FaGraduationCap, FaStar, FaUsers, FaAward, FaHeart, FaComment, FaAt, FaRetweet, FaBullhorn, FaDollarSign, FaCheckCircle, FaClock } from 'react-icons/fa';
import { AiOutlineHeart, AiOutlineBarChart } from 'react-icons/ai';
import { BiRepost } from 'react-icons/bi';
import { BsThreeDots } from 'react-icons/bs';
import { IoShareOutline } from 'react-icons/io5';
import { MdChatBubbleOutline } from 'react-icons/md';
import { BsBookmark } from 'react-icons/bs';
import Dashboard from './Dashboard';
import CreatorDashboard from './CreatorDashboard';
import Community from './Community';
import Profile from './Profile';
import CreatorProfile from './CreatorProfile';
import CreatorMode from './CreatorMode';
import CourseListing from './CourseListing';
import JobExchange from './JobExchange';
import Settings from './Settings';
import UserProfile from './UserProfile';
import CourseDetailView from './CourseDetailView';
import StudentTeacherDashboard from './StudentTeacherDashboard';
import EnrollmentFlow from './EnrollmentFlow';
import { getAllInstructors, getInstructorWithCourses, getCourseById, getAllCourses, getInstructorById, getIndexedCourses, getIndexedInstructors } from '../data/database';
import { UserPropType } from './PropTypes';

const MainContent = ({ activeMenu, currentUser, onSwitchUser, onMenuChange, isDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const lastTopMenuRef = useRef('courses');
  
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
  const [followedCommunities, setFollowedCommunities] = useState(() => {
    // Load existing follow states from localStorage
    try {
      const stored = localStorage.getItem('followedCommunities');
      if (stored) {
        return JSON.parse(stored);
      }
      // Default: Follow all creators (Jane Doe and Albert Einstein are the main ones)
      const allInstructors = getAllInstructors();
      const defaultFollowed = allInstructors.map(instructor => {
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
          followedCourseIds: courseIds, // Follow all their courses by default
          description: instructor.bio,
          members: Math.floor(totalStudents * 0.8),
          posts: Math.floor(totalStudents * 0.24),
          avatar: instructor.avatar
        };
      });
      return defaultFollowed;
    } catch (error) {
      console.error('Error parsing followedCommunities from localStorage:', error);
      return [];
    }
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

      // When followedCommunities changes, save to localStorage
  useEffect(() => {
    const saveFollowedCommunities = () => {
      try {
        localStorage.setItem('followedCommunities', JSON.stringify(followedCommunities));
      } catch (error) {
        console.error('Error saving followedCommunities to localStorage:', error);
        // Fallback: try to save a minimal version
        try {
          localStorage.setItem('followedCommunities', JSON.stringify([]));
        } catch (fallbackError) {
          console.error('Error saving fallback followedCommunities to localStorage:', fallbackError);
        }
      }
    };
    
    saveFollowedCommunities();
  }, [followedCommunities]);

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

    const renderInstructorProfile = () => {
    const creator = selectedInstructor;
    const creatorCourses = creator.courses ? creator.courses.map(c => typeof c === 'object' ? c : indexedCourses.find(course => course.id === c)).filter(Boolean) : [];

    // Mock community posts for this creator
    const creatorPosts = [
      { id: 1, author: 'TechLearner99', handle: '@techlearner99', content: `Just finished ${creator.name}'s course! The 1-on-1 sessions were amazing. Highly recommend! 🚀`, timestamp: '2 hours ago', likes: 45, replies: 8 },
      { id: 2, author: 'CodeNewbie_Sam', handle: '@codenewbie_sam', content: `Can anyone help me with the week 3 assignment? Having trouble with the implementation.`, timestamp: '5 hours ago', likes: 12, replies: 15 },
      { id: 3, author: 'DataDriven_Dan', handle: '@datadriven_dan', content: `Just became a Student-Teacher for this course! Excited to help others learn while earning 70% 💪`, timestamp: '1 day ago', likes: 89, replies: 23 },
      { id: 4, author: 'MLEnthusiast', handle: '@mlenthusiast', content: `The community here is so supportive. Got my question answered in minutes. Thank you ${creator.name}!`, timestamp: '2 days ago', likes: 56, replies: 11 },
    ];

    return (
      <div style={{ background: isDarkMode ? '#000' : '#f8fafc', minHeight: '100vh', padding: '0' }}>
        {/* Back Button */}
        <button 
          onClick={() => {
            setCreatorProfileTab('courses'); // Reset tab when leaving
            if (previousBrowseContext?.type === 'course' && previousBrowseContext.course) {
              setSelectedInstructor(null);
              setSelectedCourse(previousBrowseContext.course);
              setActiveTopMenu('courses');
              setPreviousBrowseContext(null);
            } else if (previousBrowseContext?.type === 'courseList') {
              setSelectedInstructor(null);
              setActiveTopMenu('courses');
              setPreviousBrowseContext(null);
            } else {
              setSelectedInstructor(null);
              setPreviousBrowseContext(null);
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'transparent',
            border: 'none',
            padding: '12px 16px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 14,
            color: isDarkMode ? '#71767b' : '#64748b'
          }}
        >
          ← {previousBrowseContext?.type === 'course' ? 'Back to Course' : previousBrowseContext?.type === 'courseList' ? 'Back to Courses' : 'Back'}
        </button>

        {/* Compact Creator Header */}
        <div style={{ 
          background: isDarkMode ? '#16181c' : '#fff', 
          borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #e2e8f0',
          padding: '16px'
        }}>
          {/* Avatar + Name + Stats Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <img 
              src={creator.avatar} 
              alt={creator.name}
              style={{ 
                width: 56, 
                height: 56, 
                borderRadius: '50%', 
                objectFit: 'cover',
                flexShrink: 0
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>{creator.name}</h1>
                <span style={{ background: isDarkMode ? 'rgba(29, 155, 240, 0.2)' : '#e0f2fe', color: '#1d9bf0', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 12 }}>CREATOR</span>
              </div>
              <p style={{ margin: '2px 0 0 0', color: isDarkMode ? '#71767b' : '#536471', fontSize: 13 }}>{creator.title}</p>
              {/* Inline Stats */}
              <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: 13, color: isDarkMode ? '#71767b' : '#536471' }}>
                <span>⭐ {creator.stats?.averageRating || '4.8'}</span>
                <span>👥 {(creator.stats?.studentsTaught || 0).toLocaleString()} students</span>
                <span>📚 {creator.stats?.coursesCreated || creatorCourses.length} courses</span>
              </div>
            </div>
          </div>
          
          {/* Bio */}
          {creator.bio && (
            <p style={{ 
              margin: 0, 
              color: isDarkMode ? '#e7e9ea' : '#0f1419', 
              fontSize: 15, 
              lineHeight: 1.5 
            }}>
              {creator.bio}
            </p>
          )}
        </div>

        {/* Segmented Control: Courses | Community | About | Following */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          padding: '12px 16px',
          background: isDarkMode ? '#000' : '#fff',
          borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #e2e8f0'
        }}>
          <div style={{ 
            display: 'inline-flex',
            border: isDarkMode ? '1px solid #2f3336' : '1px solid #cfd9de',
            borderRadius: 8,
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* Courses */}
            <button
              onClick={() => setCreatorProfileTab('courses')}
              style={{
                padding: '10px 20px',
                background: creatorProfileTab === 'courses' ? '#1d9bf0' : 'transparent',
                border: 'none',
                borderRight: isDarkMode ? '1px solid #2f3336' : '1px solid #cfd9de',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                color: creatorProfileTab === 'courses' ? '#fff' : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                transition: 'all 0.15s ease'
              }}
            >
              Courses
            </button>
            
            {/* Community */}
            <button
              onClick={() => setCreatorProfileTab('community')}
              style={{
                padding: '10px 20px',
                background: creatorProfileTab === 'community' ? '#1d9bf0' : 'transparent',
                border: 'none',
                borderRight: isDarkMode ? '1px solid #2f3336' : '1px solid #cfd9de',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                color: creatorProfileTab === 'community' ? '#fff' : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                transition: 'all 0.15s ease'
              }}
            >
              Community
            </button>
            
            {/* About */}
            <button
              onClick={() => setCreatorProfileTab('about')}
              style={{
                padding: '10px 20px',
                background: creatorProfileTab === 'about' ? '#1d9bf0' : 'transparent',
                border: 'none',
                borderRight: isDarkMode ? '1px solid #2f3336' : '1px solid #cfd9de',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                color: creatorProfileTab === 'about' ? '#fff' : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                transition: 'all 0.15s ease'
              }}
            >
              About
            </button>
            
            {/* Following - integrated into segmented control */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setOpenCreatorFollowDropdown(openCreatorFollowDropdown === `detail-${creator.id}` ? null : `detail-${creator.id}`);
              }}
              style={{ 
                padding: '10px 20px',
                background: hasAnyCreatorCourseFollowed(creator.id) ? '#1d9bf0' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                color: hasAnyCreatorCourseFollowed(creator.id) ? '#fff' : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                transition: 'all 0.15s ease'
              }}
            >
              {hasAnyCreatorCourseFollowed(creator.id) ? '✓ Following' : 'Follow'}
              <span style={{ fontSize: 10 }}>▼</span>
            </button>
          </div>
          
          {/* Follow Dropdown - positioned below the segmented control */}
          {openCreatorFollowDropdown === `detail-${creator.id}` && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: 4,
              background: isDarkMode ? '#16181c' : '#fff',
              border: isDarkMode ? '1px solid #2f3336' : '1px solid #e2e8f0',
              borderRadius: 12,
              boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 1000,
              minWidth: 220,
              padding: '4px 0'
            }}>
              <button 
                type="button"
                style={{ 
                  padding: '10px 16px',
                  cursor: 'pointer',
                  fontSize: 14,
                  color: hasAnyCreatorCourseFollowed(creator.id) ? '#f4212e' : '#1d9bf0',
                  fontWeight: 500,
                  background: 'transparent',
                  border: 'none',
                  width: '100%',
                  textAlign: 'left'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFollowInstructor(creator.id);
                  setOpenCreatorFollowDropdown(null);
                }}
              >
                {hasAnyCreatorCourseFollowed(creator.id) ? 'Unfollow All' : 'Follow All Courses'}
              </button>
              <div style={{ borderTop: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4', margin: '4px 0' }} />
              {creatorCourses.map(course => {
                const isFollowed = isCourseFollowed(course.id);
                return (
                  <div 
                    key={course.id}
                    style={{ 
                      padding: '10px 16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: 14,
                      color: isDarkMode ? '#e7e9ea' : '#0f1419'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollowCourse(course.id);
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</span>
                    {isFollowed && <span style={{ color: '#1d9bf0' }}>✓</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '0' }}>
          
          {/* COURSES TAB */}
          {creatorProfileTab === 'courses' && creatorCourses.length > 0 && (
            <div style={{ padding: '0' }}>
              {creatorCourses.map(course => {
                const isFollowed = isCourseFollowed(course.id);
                return (
                  <div 
                    key={course.id} 
                    onClick={() => {
                      setSelectedCourse(course);
                      setCurrentInstructorForCourse(creator);
                    }}
                    style={{ 
                      background: isDarkMode ? '#000' : '#fff', 
                      padding: '16px',
                      cursor: 'pointer',
                      borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
                      display: 'flex',
                      gap: 12,
                      alignItems: 'flex-start'
                    }}
                  >
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      style={{ width: 120, height: 68, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>{course.title}</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 13, color: isDarkMode ? '#71767b' : '#536471' }}>
                        <span>⭐ {course.rating}</span>
                        <span>👥 {course.students?.toLocaleString()}</span>
                        <span>{course.level}</span>
                        <span style={{ color: '#1d9bf0', fontWeight: 700 }}>{course.price}</span>
                      </div>
                    </div>
                    <button 
                      onClick={e => { e.stopPropagation(); handleFollowCourse(course.id); }}
                      disabled={isFollowingLoading}
                      style={{ 
                        background: isFollowed ? 'transparent' : '#1d9bf0',
                        color: isFollowed ? (isDarkMode ? '#e7e9ea' : '#0f1419') : '#fff',
                        border: isFollowed ? (isDarkMode ? '1px solid #536471' : '1px solid #cfd9de') : 'none', 
                        padding: '6px 16px', 
                        borderRadius: 20, 
                        fontWeight: 700, 
                        fontSize: 13, 
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      {isFollowed ? 'Following' : 'Follow'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* COMMUNITY TAB */}
          {creatorProfileTab === 'community' && (
            <div style={{ padding: '0' }}>
              {/* Post Composer */}
              <div style={{ 
                padding: '16px', 
                borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
                background: isDarkMode ? '#000' : '#fff'
              }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#1d9bf0',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {currentUser?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <textarea
                      placeholder={`Post to ${creator.name}'s community...`}
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        resize: 'none',
                        fontSize: 15,
                        background: 'transparent',
                        color: isDarkMode ? '#e7e9ea' : '#0f1419',
                        padding: '8px 0',
                        minHeight: 48,
                        fontFamily: 'inherit'
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button style={{
                        background: '#1d9bf0',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 20px',
                        borderRadius: 20,
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: 'pointer',
                        opacity: 0.5
                      }}>
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Community Posts */}
              {creatorPosts.map(post => (
                <div key={post.id} style={{ 
                  padding: '16px', 
                  borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
                  background: isDarkMode ? '#000' : '#fff'
                }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: '#536471',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 700,
                      flexShrink: 0
                    }}>
                      {post.author.substring(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 15, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>{post.author}</span>
                        <span style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 15 }}>{post.handle}</span>
                        <span style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 15 }}>·</span>
                        <span style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 15 }}>{post.timestamp}</span>
                      </div>
                      <p style={{ margin: '0 0 12px 0', fontSize: 15, lineHeight: 1.4, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>{post.content}</p>
                      <div style={{ display: 'flex', gap: 24, fontSize: 13, color: isDarkMode ? '#71767b' : '#536471' }}>
                        <span style={{ cursor: 'pointer' }}>💬 {post.replies}</span>
                        <span style={{ cursor: 'pointer' }}>❤️ {post.likes}</span>
                        <span style={{ cursor: 'pointer' }}>🔗 Share</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ABOUT TAB */}
          {creatorProfileTab === 'about' && (
            <div style={{ padding: '16px', background: isDarkMode ? '#000' : '#fff' }}>
              {/* Bio */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: 15, fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>About</h3>
                <p style={{ margin: 0, color: isDarkMode ? '#e7e9ea' : '#0f1419', fontSize: 15, lineHeight: 1.5 }}>{creator.bio}</p>
              </div>

              {/* Credentials */}
              {creator.qualifications && creator.qualifications.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: 15, fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>Credentials</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {creator.qualifications.map((qual, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8, color: isDarkMode ? '#e7e9ea' : '#0f1419', fontSize: 14 }}>
                        <span style={{ color: '#1d9bf0' }}>✓</span>
                        <span>{qual.sentence}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expertise */}
              {creator.expertise && creator.expertise.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: 15, fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>Expertise</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {creator.expertise.map((skill, index) => (
                      <span key={index} style={{ 
                        background: isDarkMode ? '#2f3336' : '#eff3f4', 
                        color: isDarkMode ? '#e7e9ea' : '#0f1419', 
                        padding: '6px 12px', 
                        borderRadius: 16, 
                        fontSize: 13,
                        fontWeight: 500
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Website */}
              {creator.website && (
                <a 
                  href={creator.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#1d9bf0', fontWeight: 500, fontSize: 14 }}
                >
                  🌐 {creator.website}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Helper function to get community data for a course
  const getCommunityForCourse = (courseId) => {
    const course = getCourseById(courseId);
    if (!course) return null;
    
    const instructor = getInstructorById(course.instructorId);
    if (!instructor) return null;
    
    // Generate community data dynamically based on course and instructor
    const communityColors = [
      '#4ECDC4', '#00D2FF', '#FF9900', '#FF6B6B', '#9B59B6', 
      '#FFD93D', '#00B894', '#6C5CE7', '#FF7675', '#74B9FF',
      '#636e72', '#0984e3', '#e17055', '#fdcb6e'
    ];
    
    const colorIndex = (courseId - 1) % communityColors.length;
    const color = communityColors[colorIndex];
    
    // Generate topic image based on course category
    const topicImage = `https://via.placeholder.com/400x200${color.replace('#', '')}/ffffff?text=${course.category.replace(/\s+/g, '')}`;
    
    // Generate instructor avatar
    const instructorAvatar = `https://via.placeholder.com/48x48${color.replace('#', '')}/ffffff?text=${instructor.name.split(' ').map(n => n[0]).join('')}`;
    
    // Calculate community stats based on course data
    const members = Math.floor(course.students * 0.8); // 80% of students are community members
    const posts = Math.floor(members * 0.3); // 30% of members have posted
    const lastActivity = '2 hours ago'; // Default activity time
    
    return {
      id: courseId,
      name: `${course.title} Community`,
      topic: course.category,
      members: members,
      posts: posts,
      lastActivity: lastActivity,
      instructor: instructor.name,
      instructorAvatar: instructorAvatar,
      topicImage: topicImage,
      description: course.description,
      courseId: courseId
    };
  };

  // Helper function to get course-specific community data (for following individual courses)
  const getCourseSpecificCommunity = (courseId) => {
    const course = getCourseById(courseId);
    if (!course) return null;
    
    const instructor = getInstructorById(course.instructorId);
    if (!instructor) return null;
    
    // Create a course-specific community
    return {
      id: `course-${courseId}`,
      type: 'course', // Identifies this as a course follow
      name: course.title, // Just the course name for the tab
      courseId: courseId,
      courseIds: [courseId], // Array for filtering posts
      instructorId: course.instructorId,
      instructorName: instructor.name,
      description: course.description,
      members: Math.floor(course.students * 0.8),
      posts: Math.floor(course.students * 0.24)
    };
  };

  // Helper function to get creator community data (for following creators)
  const getCreatorCommunity = (instructorId) => {
    const instructor = getInstructorById(instructorId);
    if (!instructor) return null;
    
    // Get all course IDs for this creator
    const courseIds = instructor.courses || [];
    
    // Calculate aggregate stats
    let totalStudents = 0;
    courseIds.forEach(cid => {
      const course = getCourseById(cid);
      if (course) totalStudents += course.students;
    });
    
    // Create a creator community that aggregates all their courses
    return {
      id: `creator-${instructorId}`,
      type: 'creator', // Identifies this as a creator follow
      name: instructor.name, // Creator name for the tab
      instructorId: instructorId,
      instructorName: instructor.name,
      courseIds: courseIds, // All course IDs for filtering posts
      description: instructor.bio,
      members: Math.floor(totalStudents * 0.8),
      posts: Math.floor(totalStudents * 0.24),
      avatar: instructor.avatar
    };
  };

  // Helper function to check if a course is followed (individually or via creator)
  const isCourseFollowed = (courseId) => {
    // Check if this specific course is followed
    const courseSpecificId = `course-${courseId}`;
    if (followedCommunities.some(c => c.id === courseSpecificId)) return true;
    
    // Also check if the creator of this course is followed
    const course = getCourseById(courseId);
    if (course) {
      const creatorId = `creator-${course.instructorId}`;
      if (followedCommunities.some(c => c.id === creatorId)) return true;
    }
    
    return false;
  };

  // Helper to check if course is followed via creator (not individually)
  const isCourseFollowedViaCreator = (courseId) => {
    const course = getCourseById(courseId);
    if (!course) return false;
    
    const courseSpecificId = `course-${courseId}`;
    const isIndividuallyFollowed = followedCommunities.some(c => c.id === courseSpecificId);
    if (isIndividuallyFollowed) return false;
    
    const creatorId = `creator-${course.instructorId}`;
    return followedCommunities.some(c => c.id === creatorId);
  };

  // Helper function to check if a creator is followed (all courses)
  const isInstructorFollowed = (instructorId) => {
    const creatorId = `creator-${instructorId}`;
    return followedCommunities.some(c => c.id === creatorId);
  };

  // Helper function to check if ANY course from a creator is followed (individually or via creator)
  const hasAnyCreatorCourseFollowed = (instructorId) => {
    // Check if creator is fully followed
    const creatorId = `creator-${instructorId}`;
    if (followedCommunities.some(c => c.id === creatorId)) return true;
    
    // Check if any individual course from this creator is followed
    const creatorData = getInstructorWithCourses(instructorId);
    if (creatorData && creatorData.courses) {
      for (const course of creatorData.courses) {
        const courseSpecificId = `course-${course.id}`;
        if (followedCommunities.some(c => c.id === courseSpecificId)) return true;
      }
    }
    return false;
  };

  const handleFollowInstructor = (instructorId) => {
    if (isFollowingLoading) return; // Prevent rapid clicking
    
    try {
      setIsFollowingLoading(true);
      
      // Validate instructorId
      if (!instructorId || typeof instructorId !== 'number') {
        console.error('Invalid instructorId:', instructorId);
        return;
      }

      // Get instructor data
      const instructor = getInstructorById(instructorId);
      if (!instructor) {
        console.error('Instructor not found:', instructorId);
        return;
      }

      const creatorCommunityId = `creator-${instructorId}`;
      const isAlreadyFollowed = followedCommunities.some(c => c.id === creatorCommunityId);
      
      if (isAlreadyFollowed) {
        // Unfollow - remove the creator community
        setFollowedCommunities(prev => prev.filter(c => c.id !== creatorCommunityId));
      } else {
        // Follow - add creator community (single tab for all creator's courses)
        const creatorCommunity = getCreatorCommunity(instructorId);
        if (creatorCommunity) {
          // Get the creator's course IDs to remove individual course follows
          const creatorCourseIds = instructor.courses || [];
          
          setFollowedCommunities(prev => {
            // Check if already exists
            if (prev.some(c => c.id === creatorCommunity.id)) return prev;
            
            // Remove any individual course follows that belong to this creator
            // since they're now included in the creator follow
            const filteredPrev = prev.filter(c => {
              // Keep if it's not a course follow
              if (c.type !== 'course') return true;
              // Keep if the course doesn't belong to this creator
              return !creatorCourseIds.includes(c.courseId);
            });
            
            return [...filteredPrev, creatorCommunity];
          });
        }
      }
    } catch (error) {
      console.error('Error in handleFollowInstructor:', error);
    } finally {
      setIsFollowingLoading(false);
    }
  };

  // Follow/unfollow a SINGLE course (individual course follow)
  const handleFollowCourse = (courseId) => {
    if (isFollowingLoading) return; // Prevent rapid clicking
    
    try {
      setIsFollowingLoading(true);
      
      // Validate courseId
      if (!courseId || typeof courseId !== 'number') {
        console.error('Invalid courseId:', courseId);
        return;
      }

      const course = getCourseById(courseId);
      if (!course) {
        console.error('Course not found for courseId:', courseId);
        return;
      }

      // Get the course-specific community for this single course
      const courseCommunity = getCourseSpecificCommunity(courseId);
      if (!courseCommunity) {
        console.error('Could not create community for courseId:', courseId);
        return;
      }

      // Check if this SPECIFIC course is followed (not via creator)
      const courseSpecificId = `course-${courseId}`;
      const isIndividuallyFollowed = followedCommunities.some(c => c.id === courseSpecificId);
      
      // Check if the creator of this course is followed
      const creatorId = `creator-${course.instructorId}`;
      const creatorCommunity = followedCommunities.find(c => c.id === creatorId);
      const isCreatorFollowed = !!creatorCommunity;
      
      setFollowedCommunities(prev => {
        if (isIndividuallyFollowed) {
          // Unfollow: remove just this course community
          return prev.filter(c => c.id !== courseCommunity.id);
        } else if (isCreatorFollowed) {
          // Course is followed via creator - unfollow this specific course
          // Remove the creator follow and add individual follows for OTHER courses
          const instructor = getInstructorById(course.instructorId);
          if (!instructor) return prev;
          
          const otherCourseIds = (instructor.courses || []).filter(cid => cid !== courseId);
          
          // Remove creator follow
          let newList = prev.filter(c => c.id !== creatorId);
          
          // Add individual follows for the other courses
          otherCourseIds.forEach(cid => {
            const otherCourseCommunity = getCourseSpecificCommunity(cid);
            if (otherCourseCommunity && !newList.some(c => c.id === otherCourseCommunity.id)) {
              newList.push(otherCourseCommunity);
            }
          });
          
          return newList;
        } else {
          // Follow: add just this course community (avoid duplicates)
          const existingIds = new Set(prev.map(c => c.id));
          if (existingIds.has(courseCommunity.id)) {
            return prev; // Already exists
          }
          return [...prev, courseCommunity];
        }
      });
    } catch (error) {
      console.error('Error in handleFollowCourse:', error);
    } finally {
      setIsFollowingLoading(false);
    }
  };

  const renderCourseDetail = () => {
    // Ensure selectedCourse exists
    if (!selectedCourse || !selectedCourse.id) return null;
    
    // Get full course data from database
    const courseData = getCourseById(selectedCourse.id);
    if (!courseData) return null;
    
    // Get instructor data for this course
    const instructorData = getInstructorById(courseData.instructorId);
    if (!instructorData) return null;

    // Dark mode colors
    const bgPrimary = isDarkMode ? '#000' : '#fff';
    const bgSecondary = isDarkMode ? '#16181c' : '#f8fafc';
    const bgCard = isDarkMode ? '#16181c' : '#fff';
    const textPrimary = isDarkMode ? '#e7e9ea' : '#0f172a';
    const textSecondary = isDarkMode ? '#94a3b8' : '#64748b';
    const textMuted = isDarkMode ? '#536471' : '#94a3b8';
    const borderColor = isDarkMode ? '#2f3336' : '#e2e8f0';
    const accentBlue = '#1d9bf0';
    const accentGreen = isDarkMode ? '#00ba7c' : '#059669';

    // Creator initials for avatar
    const creatorInitials = instructorData?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??';

    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%', 
        padding: '0 24px 24px 24px',
        background: bgPrimary
      }}>
        
        {/* ===== HERO SECTION ===== */}
        <div style={{ marginBottom: 24 }}>
          {/* Title Row with Following */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            justifyContent: 'space-between',
            marginBottom: 8
          }}>
            <h1 style={{ 
              margin: 0, 
              fontSize: 28, 
              fontWeight: 700, 
              color: textPrimary,
              lineHeight: 1.2,
              flex: 1,
              paddingRight: 16
            }}>
              {courseData.title}
            </h1>
            <button 
              onClick={() => handleFollowCourse(courseData.id)}
              disabled={isFollowingLoading}
              style={{ 
                background: isCourseFollowed(courseData.id) ? (isDarkMode ? '#2f3336' : '#e2e8f0') : accentBlue, 
                color: isCourseFollowed(courseData.id) ? textSecondary : '#fff', 
                fontWeight: 600, 
                fontSize: 14, 
                cursor: 'pointer', 
                padding: '8px 16px', 
                borderRadius: 20, 
                border: 'none',
                flexShrink: 0
              }}
            >
              {isCourseFollowed(courseData.id) ? '✓ Following' : 'Follow'}
            </button>
          </div>

          {/* Creator & Rating */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8,
            marginBottom: 12,
            color: textSecondary,
            fontSize: 15
          }}>
            <span>by <span 
              onClick={() => {
                const fullCreatorData = getInstructorWithCourses(courseData.instructorId);
                // Save current context before navigating to creator
                setPreviousBrowseContext({ type: 'course', course: courseData });
                setSelectedInstructor(fullCreatorData || instructorData);
                setSelectedCourse(null);
                setActiveTopMenu('instructors');
              }}
              style={{ 
                color: accentBlue, 
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'opacity 0.15s'
              }}
              onMouseEnter={e => e.target.style.opacity = '0.7'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >{instructorData?.name}</span></span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: '#f5b50a' }}>★</span> 
              {courseData.rating} 
              <span style={{ color: textMuted }}>({Math.floor(courseData.students * 0.15).toLocaleString()} reviews)</span>
            </span>
          </div>

          {/* Stats Row */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 20,
            fontSize: 14,
            color: textSecondary,
            marginBottom: 16
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              👥 <strong style={{ color: textPrimary }}>{courseData.students.toLocaleString()}</strong> learners
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              📊 <strong style={{ color: textPrimary }}>{courseData.level}</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              ⏱️ <strong style={{ color: textPrimary }}>{courseData.duration}</strong>
            </span>
          </div>

          {/* Description Box - Expandable */}
          <div style={{ 
            background: bgSecondary, 
            borderRadius: 12, 
            padding: '16px 20px',
            border: `1px solid ${borderColor}`,
            marginBottom: 20
          }}>
            <p style={{ 
              margin: 0, 
              color: textPrimary, 
              fontSize: 15, 
              lineHeight: 1.6,
              display: isDescriptionExpanded ? 'block' : '-webkit-box',
              WebkitLineClamp: isDescriptionExpanded ? 'unset' : 3,
              WebkitBoxOrient: 'vertical',
              overflow: isDescriptionExpanded ? 'visible' : 'hidden'
            }}>
              {courseData.description} This comprehensive course covers everything you need to know to master the subject. You'll learn through hands-on projects, real-world examples, and expert guidance. By the end, you'll have the skills and confidence to apply what you've learned in your career.
            </p>
            <span 
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              style={{ 
                color: accentBlue, 
                fontSize: 14, 
                cursor: 'pointer',
                fontWeight: 500,
                marginTop: 8,
                display: 'inline-block'
              }}
              onMouseEnter={e => e.target.style.opacity = '0.7'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              {isDescriptionExpanded ? 'Show less' : 'Show more'}
            </span>
          </div>
        </div>

        {/* ===== CTA - Pill Button like Follow ===== */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12,
          marginBottom: 20
        }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: textPrimary }}>
            {courseData.price}
          </span>
          <button 
            onClick={() => {
              setEnrollingCourse(courseData);
              setShowEnrollmentFlow(true);
            }}
            style={{ 
              background: accentBlue,
              color: '#fff',
              fontWeight: 600, 
              fontSize: 14, 
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: 20,
              border: 'none'
            }}
          >
            Enroll Now
          </button>
          <span style={{ color: textMuted, fontSize: 13 }}>
            (includes 1-on-1 sessions)
          </span>
        </div>

        {/* ===== LEARN & EARN - Compact ===== */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8,
          padding: '12px 16px',
          background: isDarkMode ? '#0c1825' : '#f0f9ff', 
          borderRadius: 8,
          marginBottom: 20,
          fontSize: 13,
          color: textSecondary
        }}>
          <span style={{ fontWeight: 600, color: textPrimary }}>🎓 Learn & Earn:</span>
          <span>Complete</span>
          <span style={{ color: textMuted }}>→</span>
          <span>Get Certified</span>
          <span style={{ color: textMuted }}>→</span>
          <span style={{ color: accentGreen, fontWeight: 600 }}>Earn 70% teaching</span>
        </div>

        {/* ===== CURRICULUM ===== */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: 16
          }}>
            <div style={{ 
              fontSize: 16, 
              fontWeight: 700, 
              color: textPrimary,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              📚 Curriculum 
              <span style={{ 
                background: isDarkMode ? '#2f3336' : '#e2e8f0', 
                padding: '2px 8px', 
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 500,
                color: textSecondary
              }}>
                {courseData.curriculum?.length || 0} modules
              </span>
            </div>
          </div>
          <div style={{ 
            background: bgCard, 
            borderRadius: 12, 
            border: `1px solid ${borderColor}`,
            overflow: 'hidden'
          }}>
            {courseData.curriculum?.map((module, idx) => (
              <div 
                key={idx} 
                style={{ 
                  padding: '14px 20px',
                  borderBottom: idx < courseData.curriculum.length - 1 ? `1px solid ${borderColor}` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: textPrimary, fontSize: 14, marginBottom: 2 }}>
                    {module.title}
                  </div>
                  <div style={{ color: textMuted, fontSize: 13 }}>
                    {module.description}
                  </div>
                </div>
                <div style={{ 
                  color: textSecondary, 
                  fontSize: 13,
                  flexShrink: 0,
                  marginLeft: 16
                }}>
                  {module.duration}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== ABOUT CREATOR ===== */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ 
            fontSize: 16, 
            fontWeight: 700, 
            color: textPrimary,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            👤 About the Creator
          </div>
          <div style={{ 
            background: bgCard, 
            borderRadius: 12, 
            padding: 20,
            border: `1px solid ${borderColor}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 16,
            position: 'relative'
          }}>
            {/* Follow button - top right */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Toggle follow for this creator
                const creatorId = `creator-${courseData.instructorId}`;
                const isFollowed = followedInstructors.has(courseData.instructorId);
                if (isFollowed) {
                  const newSet = new Set(followedInstructors);
                  newSet.delete(courseData.instructorId);
                  setFollowedInstructors(newSet);
                } else {
                  setFollowedInstructors(new Set([...followedInstructors, courseData.instructorId]));
                }
              }}
              style={{ 
                position: 'absolute',
                top: 16,
                right: 16,
                background: followedInstructors.has(courseData.instructorId) ? (isDarkMode ? '#2f3336' : '#e2e8f0') : accentBlue, 
                color: followedInstructors.has(courseData.instructorId) ? textSecondary : '#fff', 
                fontWeight: 600, 
                fontSize: 14, 
                cursor: 'pointer', 
                padding: '8px 16px', 
                borderRadius: 20, 
                border: 'none'
              }}
            >
              {followedInstructors.has(courseData.instructorId) ? '✓ Following' : 'Follow'}
            </button>
            <div style={{ 
              width: 56, 
              height: 56, 
              borderRadius: '50%', 
              background: isDarkMode ? '#2f3336' : '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: textPrimary,
              fontWeight: 700,
              fontSize: 18,
              flexShrink: 0
            }}>
              {creatorInitials}
            </div>
            <div style={{ flex: 1, paddingRight: 100 }}>
              <div 
                onClick={() => {
                  const fullCreatorData = getInstructorWithCourses(courseData.instructorId);
                  // Save current context before navigating to creator
                  setPreviousBrowseContext({ type: 'course', course: courseData });
                  setSelectedInstructor(fullCreatorData || instructorData);
                  setSelectedCourse(null);
                  setActiveTopMenu('instructors');
                }}
                style={{ 
                  fontWeight: 600, 
                  color: accentBlue, 
                  fontSize: 16, 
                  marginBottom: 2,
                  cursor: 'pointer',
                  transition: 'opacity 0.15s'
                }}
                onMouseEnter={e => e.target.style.opacity = '0.7'}
                onMouseLeave={e => e.target.style.opacity = '1'}
              >
                {instructorData?.name}
              </div>
              <div style={{ color: textSecondary, fontSize: 14, marginBottom: 8 }}>
                {instructorData?.title}
              </div>
              <div style={{ color: textSecondary, fontSize: 14, lineHeight: 1.5, marginBottom: 12 }}>
                {instructorData?.bio}
              </div>
              <div style={{ display: 'flex', gap: 16, color: textMuted, fontSize: 13 }}>
                <span>{instructorData?.stats?.coursesCreated || 5} courses</span>
                <span>{(instructorData?.stats?.studentsTaught || 10000).toLocaleString()} students</span>
                <span>⭐ {instructorData?.stats?.averageRating || 4.8} avg rating</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  };

  const renderInstructorSummary = () => {
    const filteredInstructors = indexedInstructors.filter(instructor =>
      instructor.searchIndex.includes(searchQuery.toLowerCase())
    );
    // Avatar colors for initials
    const avatarColors = ['#2f3336', '#3a3f44', '#4a5056', '#5a6167', '#6a7178'];
    return (
      <div className="creators-feed" style={{ padding: 0, margin: 0 }}>
        {filteredInstructors.map(creator => {
          const colorIndex = creator.name.charCodeAt(0) % avatarColors.length;
          const avatarColor = avatarColors[colorIndex];
          const initials = creator.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
          return (
          <div key={creator.id} className="creator-card" onClick={() => {
            const fullCreatorData = getInstructorWithCourses(creator.id);
            // Clear previous context since we're coming from creators list
            setPreviousBrowseContext({ type: 'creatorList' });
            setSelectedInstructor(fullCreatorData || creator);
          }} style={{
            background: isDarkMode ? '#000' : '#fff',
            borderRadius: 0,
            padding: '12px 16px',
            marginBottom: 0,
            border: 'none',
            borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #e2e8f0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}>
            {/* Follow Button - Top Right */}
            <div className="creator-follow-dropdown-wrapper" style={{ position: 'absolute', top: 16, right: 16 }} onClick={e => e.stopPropagation()}>
              <button 
                className={`follow-btn ${hasAnyCreatorCourseFollowed(creator.id) ? 'following' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenCreatorFollowDropdown(openCreatorFollowDropdown === creator.id ? null : creator.id);
                }}
                disabled={isFollowingLoading}
                style={{ 
                  background: hasAnyCreatorCourseFollowed(creator.id) ? (isDarkMode ? '#2f3336' : '#e2e8f0') : '#1d9bf0',
                  color: hasAnyCreatorCourseFollowed(creator.id) ? (isDarkMode ? '#94a3b8' : '#64748b') : '#fff',
                  border: 'none', 
                  padding: '8px 16px', 
                  borderRadius: 20, 
                  fontWeight: 600, 
                  fontSize: 14, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                {hasAnyCreatorCourseFollowed(creator.id) ? '✓ Following' : 'Follow'}
                <span style={{ fontSize: 10, marginLeft: 2 }}>▼</span>
              </button>
                    
                    {/* Follow Dropdown - Minimalist */}
                    {openCreatorFollowDropdown === creator.id && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: 4,
                        background: isDarkMode ? '#16181c' : '#fff',
                        border: isDarkMode ? '1px solid #2f3336' : '1px solid #e2e8f0',
                        borderRadius: 8,
                        boxShadow: isDarkMode ? '0 2px 12px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.1)',
                        zIndex: 1000,
                        minWidth: 200,
                        maxWidth: 280,
                        padding: '4px 0'
                      }}>
                        {/* Follow/Unfollow All Option */}
                        <button 
                          type="button"
                          style={{ 
                            padding: '8px 12px',
                            cursor: 'pointer',
                            fontSize: 13,
                            color: hasAnyCreatorCourseFollowed(creator.id) ? '#dc2626' : '#1d9bf0',
                            fontWeight: 500,
                            borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #f1f5f9',
                            background: 'transparent',
                            border: 'none',
                            width: '100%',
                            textAlign: 'left',
                            display: 'block'
                          }}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleFollowInstructor(creator.id);
                          setOpenCreatorFollowDropdown(null);
                        }}
                          onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#f8fafc'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          {hasAnyCreatorCourseFollowed(creator.id) ? 'Unfollow All' : 'Follow All'}
                        </button>
                        
                        {/* Individual Courses */}
                        <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                          {(() => {
                            const creatorData = getInstructorWithCourses(creator.id);
                            const courses = creatorData?.courses || [];
                            return courses.map(course => {
                              const isFollowed = isCourseFollowed(course.id);
                              return (
                                <div 
                                  key={course.id}
                                  style={{ 
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 8,
                                    fontSize: 13,
                                    color: isFollowed ? '#1d9bf0' : (isDarkMode ? '#e7e9ea' : '#475569'),
                                    fontWeight: isFollowed ? 500 : 400
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFollowCourse(course.id);
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#f8fafc'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                  <span style={{ 
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}>
                                    {course.title}
                                  </span>
                                  {isFollowed && <span>✓</span>}
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    )}
            </div>

            {/* Creator Content */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingRight: 100 }}>
              <div style={{ 
                width: 48, 
                height: 48, 
                borderRadius: '50%', 
                background: avatarColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: 16,
                flexShrink: 0
              }}>
                {initials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: isDarkMode ? '#e7e9ea' : '#0f1419', marginBottom: 2 }}>
                  {creator.name}
                </div>
                <div style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 14, marginBottom: 6 }}>
                  {creator.title}
                </div>
                <div style={{ color: isDarkMode ? '#e7e9ea' : '#0f1419', fontSize: 14, lineHeight: 1.5, marginBottom: 10 }}>
                  {creator.bio}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: isDarkMode ? '#71767b' : '#536471' }}>
                  <span>{creator.stats?.studentsTaught?.toLocaleString() || 0} students</span>
                  <span>⭐ {creator.stats?.averageRating || 0}</span>
                  <span>{creator.stats?.coursesCreated || 0} courses</span>
                </div>
              </div>
            </div>
          </div>
        );
        })}
      </div>
    );
  };

  // Show Browse when Browse is active
  if (activeMenu === 'Browse' || activeMenu === 'Browse_Reset') {
    return (
      <div className="main-content">
        <div className="three-column-layout browse-layout">
          <div className="center-column">
            <div className="top-menu-section">
              <p className="browse-instruction">BROWSE COURSES OR COURSE CREATORS</p>
              <div className="tabs-section">
                <button
                  className={`tab-btn ${activeTopMenu === 'courses' ? 'active' : ''}`}
                  onClick={() => setActiveTopMenu('courses')}
                >
                  <FaBook />
                  <span>COURSES</span>
                </button>
                <button
                  className={`tab-btn ${activeTopMenu === 'instructors' ? 'active' : ''}`}
                  onClick={() => setActiveTopMenu('instructors')}
                >
                  <FaUser />
                  <span>CREATORS</span>
                </button>
                <div className="search-container">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
            </div>
            <div className="browse-content">
              {activeTopMenu === 'courses' ? (
                <div className="courses-section">
                  {selectedCourse ? (
                    <div className="course-detail-view">
                      <div style={{
                        position: 'sticky',
                        top: 0,
                        background: isDarkMode ? '#000' : '#fff',
                        padding: '12px 0',
                        zIndex: 10,
                        borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #e2e8f0'
                      }}>
                        <span 
                          onClick={() => setSelectedCourse(null)}
                          style={{
                            color: '#1d9bf0',
                            fontWeight: 500,
                            fontSize: 14,
                            cursor: 'pointer',
                            transition: 'opacity 0.15s'
                          }}
                          onMouseEnter={e => e.target.style.opacity = '0.7'}
                          onMouseLeave={e => e.target.style.opacity = '1'}
                        >
                          ← Back to Courses
                        </span>
                      </div>
                      {renderCourseDetail()}
                    </div>
                  ) : (
                    <>
                      <div className="browse-header">
                        <h1></h1>
                      </div>
                      <div className="courses-feed">

                        {indexedCourses.filter(course =>
                          course.searchIndex.includes(searchQuery.toLowerCase())
                        ).map(course => {
                          const instructorData = getInstructorById(course.instructorId);
                          const isFollowed = isCourseFollowed(course.id);
                          const isViaCreator = isCourseFollowedViaCreator(course.id);
                          // Generate avatar initials and color for creator
                          const creatorInitials = instructorData?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??';
                          const avatarColors = ['#2f3336', '#3a3f44', '#4a5056', '#5a6167', '#6a7178'];
                          const colorIndex = instructorData?.name?.charCodeAt(0) % avatarColors.length || 0;
                          const avatarColor = avatarColors[colorIndex];
                          return (
                            <div key={course.id} className="course-post" onClick={() => setSelectedCourse(course)} style={{ background: isDarkMode ? '#000' : '#fff', boxShadow: 'none', padding: '12px 18px', fontFamily: 'system-ui, sans-serif', fontSize: 15, lineHeight: '20px', width: '100%', marginLeft: 0, marginRight: 0, cursor: 'pointer', color: isDarkMode ? '#e7e9ea' : '#222', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                              {/* Creator Avatar */}
                              <div 
                                className="course-creator-avatar"
                                onClick={e => { 
                                  e.stopPropagation(); 
                                  const fullCreatorData = getInstructorWithCourses(course.instructorId);
                                  // Save current context before navigating to creator
                                  setPreviousBrowseContext({ type: 'courseList' });
                                  setSelectedInstructor(fullCreatorData || instructorData);
                                  setActiveTopMenu('instructors');
                                }}
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: '50%',
                                  background: avatarColor,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#fff',
                                  fontSize: 14,
                                  fontWeight: 700,
                                  flexShrink: 0,
                                  cursor: 'pointer'
                                }}
                                title={`View ${instructorData?.name}'s profile`}
                              >
                                {creatorInitials}
                              </div>
                              <div className="post-content" style={{ padding: 0, flex: 1, minWidth: 0 }}>
                                {/* Title, Duration, and Follow Button Row */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: isDarkMode ? '#e7e9ea' : '#222', flex: 1, minWidth: 0 }}>
                                    <span style={{ fontWeight: 700, fontSize: 15, lineHeight: '20px', color: isDarkMode ? '#e7e9ea' : '#0f1419', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{course.title}</span>
                                    <span style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 15, fontWeight: 400, flexShrink: 0 }}>• {course.duration}</span>
                                  </div>
                                  <button 
                                    onClick={e => { e.stopPropagation(); handleFollowCourse(course.id); }}
                                    disabled={isFollowingLoading}
                                    style={{ 
                                      background: isFollowed ? (isDarkMode ? '#2f3336' : '#e2e8f0') : '#1d9bf0',
                                      color: isFollowed ? (isDarkMode ? '#71767b' : '#64748b') : '#fff',
                                      border: 'none', 
                                      padding: '6px 14px', 
                                      borderRadius: 20, 
                                      fontWeight: 600, 
                                      fontSize: 13, 
                                      cursor: 'pointer',
                                      flexShrink: 0,
                                      marginLeft: 12
                                    }}
                                  >
                                    {isFollowed ? '✓ Following' : 'Follow'}
                                  </button>
                                </div>
                                <div style={{ fontSize: 15, lineHeight: '20px', color: isDarkMode ? '#71767b' : '#536471', fontWeight: 400, margin: '0 0 4px 0' }}>
                                  Created by <span 
                                    onClick={e => { 
                                      e.stopPropagation(); 
                                      const fullCreatorData = getInstructorWithCourses(course.instructorId);
                                      // Save current context before navigating to creator
                                      setPreviousBrowseContext({ type: 'courseList' });
                                      setSelectedInstructor(fullCreatorData || instructorData);
                                      setActiveTopMenu('instructors');
                                    }}
                                    style={{ 
                                      color: '#1d9bf0', 
                                      cursor: 'pointer',
                                      fontWeight: 500
                                    }}
                                    onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                                    onMouseLeave={e => e.target.style.textDecoration = 'none'}
                                  >{instructorData?.name}</span>
                                </div>
                                {/* Description Row - truncated to 2 lines */}
                                <div className="post-text" style={{ 
                                  color: isDarkMode ? '#e7e9ea' : '#0f1419', 
                                  fontSize: 15, 
                                  lineHeight: '20px',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                  {course.description}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="creators-section">
                  {selectedInstructor ? (
                    renderInstructorProfile()
                  ) : (
                    renderInstructorSummary()
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Enrollment Flow Modal */}
        {showEnrollmentFlow && enrollingCourse && (
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
              setShowEnrollmentFlow(false);
              setEnrollingCourse(null);
              // Could navigate to dashboard or show success message
            }}
          />
        )}
      </div>
    );
  }

  // Show appropriate Dashboard based on user type
  if (activeMenu === 'Dashboard') {
    // Creators and Admins see Creator Dashboard
    if (currentUser?.userType === 'creator' || currentUser?.userType === 'admin' || 
        currentUser?.roles?.includes('creator') || currentUser?.roles?.includes('instructor')) {
      return (
        <div className="main-content">
          <CreatorDashboard isDarkMode={isDarkMode} currentUser={currentUser} />
        </div>
      );
    }
    // Students see Learning Dashboard
    return (
      <div className="main-content">
        <Dashboard isDarkMode={isDarkMode} currentUser={currentUser} />
      </div>
    );
  }

  // Show Student-Teacher Dashboard when Teaching is active
  if (activeMenu === 'Teaching') {
    return (
      <div className="main-content" style={{ padding: 0 }}>
        <StudentTeacherDashboard isDarkMode={isDarkMode} />
      </div>
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

  // Show Course when viewing a course from community
  if (viewingCourseFromCommunity) {
    return (
      <div className="main-content">
        <CourseDetailView
          course={viewingCourseFromCommunity}
          onBack={handleBackFromCourse}
          isDarkMode={isDarkMode}
          followedCommunities={followedCommunities}
          setFollowedCommunities={setFollowedCommunities}
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
        />
      </div>
    );
  }

  // Show Notifications when Notifications is active
  if (activeMenu === 'Notifications') {
    // X.com style notifications for PeerLoop interactions
    const notifications = [
      // Likes
      {
        id: 1,
        type: 'like',
        icon: <FaHeart style={{ color: '#e11d48' }} />,
        users: [
          { name: 'Sarah Chen', avatar: 'https://via.placeholder.com/32x32/FF6B6B/ffffff?text=SC' },
          { name: 'Mike Rodriguez', avatar: 'https://via.placeholder.com/32x32/4ECDC4/ffffff?text=MR' },
          { name: 'Emma Wilson', avatar: 'https://via.placeholder.com/32x32/9B59B6/ffffff?text=EW' }
        ],
        content: 'liked your post',
        postPreview: '"Just completed my Student-Teacher certification in Node.js! Ready to help others learn 🚀"',
        timestamp: '2m',
        unread: true
      },
      // Comment/Reply
      {
        id: 2,
        type: 'reply',
        icon: <FaComment style={{ color: '#1d9bf0' }} />,
        users: [
          { name: 'Alex Thompson', avatar: 'https://via.placeholder.com/32x32/00D2FF/ffffff?text=AT' }
        ],
        content: 'replied to your post',
        postPreview: '"Congrats! I just enrolled in your course. Looking forward to our first session!"',
        timestamp: '15m',
        unread: true
      },
      // Mention
      {
        id: 3,
        type: 'mention',
        icon: <FaAt style={{ color: '#1d9bf0' }} />,
        users: [
          { name: 'Jane Doe', avatar: 'https://via.placeholder.com/32x32/FF6B6B/ffffff?text=JD' }
        ],
        content: 'mentioned you in a post',
        postPreview: '"Shoutout to @alexstudent for being an amazing Student-Teacher! Best 1-on-1 session I\'ve had 🙌"',
        timestamp: '1h',
        unread: true
      },
      // Repost
      {
        id: 4,
        type: 'repost',
        icon: <FaRetweet style={{ color: '#1d9bf0' }} />,
        users: [
          { name: 'David Park', avatar: 'https://via.placeholder.com/32x32/FFD93D/000000?text=DP' },
          { name: 'Lisa Wang', avatar: 'https://via.placeholder.com/32x32/6C5CE7/ffffff?text=LW' }
        ],
        content: 'reposted your post',
        postPreview: '"The PeerLoop model is genius - Learn, Teach, Earn. Already made $420 this week teaching!"',
        timestamp: '2h',
        unread: true
      },
      // New Follower
      {
        id: 5,
        type: 'follow',
        icon: <FaUser style={{ color: '#1d9bf0' }} />,
        users: [
          { name: 'Marcus Chen', avatar: 'https://via.placeholder.com/32x32/FF9900/ffffff?text=MC' }
        ],
        content: 'followed you',
        postPreview: null,
        timestamp: '3h',
        unread: true
      },
      // Session Booked
      {
        id: 6,
        type: 'session',
        icon: <FaCalendar style={{ color: '#1d9bf0' }} />,
        users: [
          { name: 'Rachel Green', avatar: 'https://via.placeholder.com/32x32/00B894/ffffff?text=RG' }
        ],
        content: 'booked a session with you',
        postPreview: 'Node.js Backend Development • Tomorrow at 2:00 PM',
        timestamp: '4h',
        unread: false
      },
      // Course Enrollment
      {
        id: 7,
        type: 'enrollment',
        icon: <FaGraduationCap style={{ color: '#1d9bf0' }} />,
        users: [
          { name: 'Tom Bradley', avatar: 'https://via.placeholder.com/32x32/74B9FF/ffffff?text=TB' },
          { name: 'Amy Foster', avatar: 'https://via.placeholder.com/32x32/FF7675/ffffff?text=AF' },
          { name: 'Chris Lee', avatar: 'https://via.placeholder.com/32x32/636e72/ffffff?text=CL' }
        ],
        content: 'enrolled in your course',
        postPreview: 'AI for Product Managers',
        timestamp: '6h',
        unread: false
      },
      // Certification Achievement
      {
        id: 8,
        type: 'achievement',
        icon: <FaStar style={{ color: '#fbbf24' }} />,
        users: [],
        content: 'Congratulations! You\'ve been certified as a Student-Teacher',
        postPreview: 'Cloud Architecture with AWS • You can now teach and earn 70% commission',
        timestamp: '1d',
        unread: false
      },
      // Earnings Notification
      {
        id: 9,
        type: 'earnings',
        icon: <FaDollarSign style={{ color: '#1d9bf0' }} />,
        users: [],
        content: 'You earned $245 this week',
        postPreview: '7 sessions completed • 70% of $350 total tuition',
        timestamp: '1d',
        unread: false
      },
      // Creator Announcement
      {
        id: 10,
        type: 'announcement',
        icon: <FaBullhorn style={{ color: '#1d9bf0' }} />,
        users: [
          { name: 'Albert Einstein', avatar: 'https://via.placeholder.com/32x32/4ECDC4/ffffff?text=AE' }
        ],
        content: 'posted an announcement in Node.js Backend Development',
        postPreview: '"New module added: Advanced Authentication with JWT! Check it out 🔐"',
        timestamp: '2d',
        unread: false
      },
      // Multiple Likes
      {
        id: 11,
        type: 'like',
        icon: <FaHeart style={{ color: '#e11d48' }} />,
        users: [
          { name: 'Jordan Smith', avatar: 'https://via.placeholder.com/32x32/e17055/ffffff?text=JS' },
          { name: 'Taylor Brown', avatar: 'https://via.placeholder.com/32x32/fdcb6e/000000?text=TB' }
        ],
        content: 'and 12 others liked your post',
        postPreview: '"Week 3 of teaching on PeerLoop: 15 students taught, $1,050 earned. This platform is changing education! 📚"',
        timestamp: '2d',
        unread: false
      },
      // Comment on your comment
      {
        id: 12,
        type: 'reply',
        icon: <FaComment style={{ color: '#1d9bf0' }} />,
        users: [
          { name: 'Nina Patel', avatar: 'https://via.placeholder.com/32x32/0984e3/ffffff?text=NP' }
        ],
        content: 'replied to your comment',
        postPreview: '"Thanks for the tip! The 2 Sigma explanation really helped me understand the PeerLoop model."',
        timestamp: '3d',
        unread: false
      },
      // Session Reminder
      {
        id: 13,
        type: 'reminder',
        icon: <FaClock style={{ color: '#f59e0b' }} />,
        users: [],
        content: 'Reminder: You have a session starting in 30 minutes',
        postPreview: 'Deep Learning Fundamentals with Jane Doe • 2:00 PM',
        timestamp: '3d',
        unread: false
      },
      // Payout Processed
      {
        id: 14,
        type: 'payout',
        icon: <FaCheckCircle style={{ color: '#1d9bf0' }} />,
        users: [],
        content: 'Your weekly payout has been processed',
        postPreview: '$682.50 deposited to your bank account',
        timestamp: '5d',
        unread: false
      }
    ];

    // Dark mode colors for notifications - X.com pure black
    const notifBg = isDarkMode ? '#000000' : '#fff';
    const notifBgHover = isDarkMode ? '#16181c' : '#f8fafc';
    const notifHeaderBg = isDarkMode ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.85)';
    const notifBorder = isDarkMode ? '#334155' : '#e2e8f0';
    const notifTextPrimary = isDarkMode ? '#f1f5f9' : '#0f1419';
    const notifTextSecondary = isDarkMode ? '#94a3b8' : '#536471';

    return (
      <div className="main-content">
        <div className="three-column-layout">
          {/* Center Column - Uses same CSS as Browse */}
          <div className="center-column">
            <div style={{ 
              position: 'sticky', 
              top: 0, 
              background: notifHeaderBg, 
              backdropFilter: 'saturate(180%) blur(20px)',
              borderBottom: `1px solid ${notifBorder}`,
              padding: '16px 20px',
              zIndex: 100
            }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: notifTextPrimary, margin: 0 }}>Notifications</h1>
            </div>
            
            {/* Notification Tabs */}
            <div style={{ 
              display: 'flex', 
              borderBottom: `1px solid ${notifBorder}`,
              background: notifBg
            }}>
              <button style={{ 
                flex: 1, 
                padding: '16px', 
                background: 'none', 
                border: 'none', 
                fontWeight: 600, 
                color: notifTextPrimary,
                borderBottom: '2px solid #1d9bf0',
                cursor: 'pointer'
              }}>All</button>
              <button style={{ 
                flex: 1, 
                padding: '16px', 
                background: 'none', 
                border: 'none', 
                fontWeight: 500, 
                color: notifTextSecondary,
                cursor: 'pointer'
              }}>Mentions</button>
              <button style={{ 
                flex: 1, 
                padding: '16px', 
                background: 'none', 
                border: 'none', 
                fontWeight: 500, 
                color: notifTextSecondary,
                cursor: 'pointer'
              }}>Sessions</button>
              <button style={{ 
                flex: 1, 
                padding: '16px', 
                background: 'none', 
                border: 'none', 
                fontWeight: 500, 
                color: notifTextSecondary,
                cursor: 'pointer'
              }}>Earnings</button>
            </div>

            {/* Notifications List */}
            <div style={{ background: notifBg }}>
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  style={{ 
                    display: 'flex',
                    padding: '16px 20px',
                    borderBottom: `1px solid ${notifBorder}`,
                    background: notifBg,
                    cursor: 'pointer',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = notifBgHover}
                  onMouseLeave={(e) => e.currentTarget.style.background = notifBg}
                >
                  {/* Icon */}
                  <div style={{ 
                    width: 40, 
                    display: 'flex', 
                    justifyContent: 'center',
                    paddingTop: 4,
                    fontSize: 18
                  }}>
                    {notification.icon}
                  </div>
                  
                  {/* Content */}
                  <div style={{ flex: 1, marginLeft: 12 }}>
                    {/* User Avatars - Using colored circles with initials instead of images */}
                    {notification.users.length > 0 && (
                      <div style={{ display: 'flex', marginBottom: 8, height: 32 }}>
                        {notification.users.slice(0, 3).map((user, idx) => {
                          const colors = ['#2f3336', '#3a3f44', '#4a5056', '#5a6167', '#6a7178'];
                          const colorIndex = user.name.charCodeAt(0) % colors.length;
                          const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2);
                          return (
                            <div 
                              key={idx}
                              style={{ 
                                width: 32, 
                                height: 32, 
                                borderRadius: '50%',
                                marginLeft: idx > 0 ? -8 : 0,
                                border: isDarkMode ? '2px solid #000' : '2px solid #fff',
                                background: colors[colorIndex],
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: 11,
                                fontWeight: 700,
                                flexShrink: 0
                              }}
                              title={user.name}
                            >
                              {initials}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    {/* Notification Text */}
                    <div style={{ fontSize: 15, color: notifTextPrimary, lineHeight: 1.4 }}>
                      {notification.users.length > 0 && (
                        <span style={{ fontWeight: 700 }}>
                          {notification.users.length === 1 
                            ? notification.users[0].name 
                            : notification.users.length === 2
                              ? `${notification.users[0].name} and ${notification.users[1].name}`
                              : `${notification.users[0].name}, ${notification.users[1].name}`}
                        </span>
                      )}
                      {' '}{notification.content}
                    </div>
                    
                    {/* Post Preview */}
                    {notification.postPreview && (
                      <div style={{ 
                        marginTop: 8, 
                        color: notifTextSecondary, 
                        fontSize: 14,
                        lineHeight: 1.4
                      }}>
                        {notification.postPreview}
                      </div>
                    )}
                  </div>
                  
                  {/* Timestamp & Unread Dot */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ fontSize: 13, color: notifTextSecondary }}>{notification.timestamp}</span>
                    {notification.unread && (
                      <div style={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        background: '#1d9bf0',
                        marginTop: 6
                      }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show Profile when Profile is active
  if (activeMenu === 'Profile') {
    return (
      <div className="main-content">
        <Profile 
          currentUser={currentUser} 
          onSwitchUser={typeof onSwitchUser === 'function' ? onSwitchUser : undefined}
          onMenuChange={onMenuChange}
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