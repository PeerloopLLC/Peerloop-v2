import React, { useState } from 'react';
import { FaStar, FaUsers, FaClock, FaPlay, FaBook, FaCertificate, FaChalkboardTeacher, FaCheck, FaPlus, FaInfinity, FaGraduationCap, FaHeart, FaComment, FaRetweet, FaShare, FaImage, FaLink, FaPaperclip, FaVideo, FaFileAlt, FaDownload, FaExclamationTriangle, FaChevronDown, FaChevronRight, FaCalendar } from 'react-icons/fa';
import { getInstructorById } from '../data/database';
import SessionTimelineCards from './SessionTimelineCards';
import './MainContent.css';

/**
 * CourseCurriculumSection - Expandable module accordion grouped by sessions
 */
const CourseCurriculumSection = ({ course, isDarkMode, expandedModules, setExpandedModules }) => {
  const [expandedSessions, setExpandedSessions] = useState({ 1: true, 2: true });

  // Module details data (would come from course data in real implementation)
  const getModuleDetails = (moduleIndex, moduleTitle) => {
    const defaultDetails = {
      learningObjectives: `Master the core concepts covered in ${moduleTitle}`,
      topics: ['Key concepts and fundamentals', 'Practical applications', 'Best practices and tips'],
      handsOnExercise: 'Apply what you learned with a hands-on exercise'
    };

    const curriculumItem = course.curriculum?.[moduleIndex];
    if (curriculumItem && typeof curriculumItem === 'object') {
      return {
        learningObjectives: curriculumItem.learningObjectives || curriculumItem.description || defaultDetails.learningObjectives,
        topics: curriculumItem.topics || defaultDetails.topics,
        handsOnExercise: curriculumItem.handsOnExercise || defaultDetails.handsOnExercise
      };
    }
    return defaultDetails;
  };

  const toggleModule = (idx) => {
    setExpandedModules(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const toggleSession = (sessionNum) => {
    setExpandedSessions(prev => ({
      ...prev,
      [sessionNum]: !prev[sessionNum]
    }));
  };

  // Check if course has sessions defined - if so, group by session
  const hasSessions = course?.sessions?.list && course.sessions.list.length > 0;

  // Group curriculum items by session number
  const getModulesBySession = (sessionNum) => {
    return (course.curriculum || [])
      .map((item, idx) => ({ ...item, originalIndex: idx }))
      .filter(item => item.session === sessionNum || item.sessionNumber === sessionNum);
  };

  // Render a single module row
  const renderModule = (item, idx, isLastInGroup) => {
    const title = typeof item === 'object' ? item.title : item;
    const duration = typeof item === 'object' ? item.duration : '15 min';
    const originalIdx = item.originalIndex !== undefined ? item.originalIndex : idx;
    const isExpanded = expandedModules[originalIdx];
    const details = getModuleDetails(originalIdx, title);

    return (
      <div key={originalIdx} style={{
        borderBottom: !isLastInGroup
          ? (isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb')
          : 'none'
      }}>
        {/* Module Header - Clickable */}
        <div
          onClick={() => toggleModule(originalIdx)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 0 12px 20px',
            cursor: 'pointer'
          }}
        >
          {/* Expand/Collapse Icon */}
          <div style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 12 }}>
            {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
          </div>

          {/* Module Title */}
          <div style={{ flex: 1 }}>
            <span style={{
              fontWeight: 500,
              fontSize: 14,
              color: isDarkMode ? '#e7e9ea' : '#0f1419'
            }}>
              {title}
            </span>
          </div>

          {/* Duration Badge */}
          <span style={{
            background: isDarkMode ? '#2f3336' : '#e5e7eb',
            color: isDarkMode ? '#9ca3af' : '#536471',
            padding: '4px 10px',
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 500
          }}>
            {duration}
          </span>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div style={{
            padding: '0 0 16px 48px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            {/* Description / Learning Objectives */}
            <div style={{
              fontSize: 14,
              color: isDarkMode ? '#a1a1aa' : '#536471',
              lineHeight: 1.5
            }}>
              {details.learningObjectives}
            </div>
          </div>
        )}
      </div>
    );
  };

  // If course has sessions, render grouped by session
  if (hasSessions) {
    return (
      <div style={{
        background: isDarkMode ? '#16181c' : '#f7f9f9',
        borderRadius: 12,
        padding: 20,
        border: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
      }}>
        <h3 style={{
          fontSize: 18,
          fontWeight: 700,
          marginBottom: 20,
          color: isDarkMode ? '#e7e9ea' : '#0f1419'
        }}>
          Course Curriculum
        </h3>

        {course.sessions.list.map((session, sessionIdx) => {
          const sessionModules = getModulesBySession(session.number);
          const isSessionExpanded = expandedSessions[session.number];

          return (
            <div key={session.number} style={{
              marginBottom: sessionIdx < course.sessions.list.length - 1 ? 16 : 0
            }}>
              {/* Session Header */}
              <div
                onClick={() => toggleSession(session.number)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 16px',
                  background: isDarkMode ? '#1a1d21' : '#eef2f5',
                  borderRadius: isSessionExpanded ? '8px 8px 0 0' : 8,
                  cursor: 'pointer',
                  border: isDarkMode ? '1px solid #2f3336' : '1px solid #dce3e8',
                  borderBottom: isSessionExpanded ? 'none' : (isDarkMode ? '1px solid #2f3336' : '1px solid #dce3e8')
                }}
              >
                {/* Session Number Circle */}
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#1d9bf0',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {session.number}
                </div>

                {/* Session Title */}
                <div style={{ flex: 1 }}>
                  <span style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: isDarkMode ? '#e7e9ea' : '#0f1419'
                  }}>
                    Session {session.number}: {session.title}
                  </span>
                  <div style={{
                    fontSize: 12,
                    color: isDarkMode ? '#71767b' : '#536471',
                    marginTop: 2
                  }}>
                    {session.duration} • {sessionModules.length} modules
                  </div>
                </div>

                {/* Expand/Collapse Icon */}
                <div style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 12 }}>
                  {isSessionExpanded ? <FaChevronDown /> : <FaChevronRight />}
                </div>
              </div>

              {/* Session Modules */}
              {isSessionExpanded && (
                <div style={{
                  border: isDarkMode ? '1px solid #2f3336' : '1px solid #dce3e8',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  overflow: 'hidden'
                }}>
                  {sessionModules.map((module, idx) =>
                    renderModule(module, idx, idx === sessionModules.length - 1)
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Fallback: Original flat list for courses without sessions
  return (
    <div style={{
      background: isDarkMode ? '#16181c' : '#f7f9f9',
      borderRadius: 12,
      padding: 20,
      border: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
    }}>
      <h3 style={{
        fontSize: 18,
        fontWeight: 700,
        marginBottom: 20,
        color: isDarkMode ? '#e7e9ea' : '#0f1419'
      }}>
        Course Curriculum
      </h3>

      {(course.curriculum || []).map((item, idx) => {
        const title = typeof item === 'object' ? item.title : item;
        const duration = typeof item === 'object' ? item.duration : '15 min';
        const isExpanded = expandedModules[idx];
        const details = getModuleDetails(idx, title);

        return (
          <div key={idx} style={{
            borderBottom: idx < (course.curriculum?.length || 0) - 1
              ? (isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb')
              : 'none'
          }}>
            {/* Module Header - Clickable */}
            <div
              onClick={() => toggleModule(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '16px 0',
                cursor: 'pointer'
              }}
            >
              {/* Expand/Collapse Icon */}
              <div style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 12 }}>
                {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
              </div>

              {/* Module Title */}
              <div style={{ flex: 1 }}>
                <span style={{
                  fontWeight: 600,
                  fontSize: 15,
                  color: isDarkMode ? '#e7e9ea' : '#0f1419'
                }}>
                  {title}
                </span>
              </div>

              {/* Duration Badge */}
              <span style={{
                background: isDarkMode ? '#2f3336' : '#e5e7eb',
                color: isDarkMode ? '#9ca3af' : '#536471',
                padding: '4px 10px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 500
              }}>
                {duration}
              </span>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div style={{
                padding: '0 0 16px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}>
                <div style={{
                  fontSize: 14,
                  color: isDarkMode ? '#e7e9ea' : '#0f1419',
                  lineHeight: 1.5
                }}>
                  {details.learningObjectives}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/**
 * CourseDetailView Component
 * Shows detailed view of a course with tabs and two-column layout
 * Merged design: combines marketing view (pre-enrollment) with learning dashboard (post-enrollment)
 */
const CourseDetailView = ({ course, onBack, isDarkMode, followedCommunities = [], setFollowedCommunities, onViewInstructor, onEnroll, isCoursePurchased = false, currentUser, onMenuChange, scheduledSessions = [], sessionCompletion = {}, onBrowseStudentTeachers, onRescheduleSession }) => {
  // Check if this specific course is being followed (within creator's followedCourseIds)
  const [isFollowing, setIsFollowing] = useState(() => {
    if (!course) return false;
    const creatorFollow = followedCommunities.find(c => c.instructorId === course.instructorId);
    return creatorFollow?.followedCourseIds?.includes(course.id) || false;
  });
  const [activeTab, setActiveTab] = useState('curriculum');
  const [expandedModules, setExpandedModules] = useState({});
  const [newPostText, setNewPostText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isJoiningSession, setIsJoiningSession] = useState(false);
  const [showBbbModal, setShowBbbModal] = useState(false);
  const [bbbJoinUrl, setBbbJoinUrl] = useState(null);
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [expandedFileSessions, setExpandedFileSessions] = useState({ 1: true }); // Session 1 expanded by default

  // Find real scheduled session for this course
  const realNextSession = scheduledSessions
    .filter(s => s.courseId === course?.id && s.status === 'scheduled')
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''))[0];

  // Format date for display
  const formatSessionDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Mock enrollment data for enrolled users (with real session data if available)
  const enrollmentData = isCoursePurchased ? {
    enrolledDate: 'Dec 10, 2024',
    sessionsCompleted: 3,
    totalSessions: 8,
    homeworkCompleted: 2,
    totalHomework: 3,
    avgScore: 90,
    lastActive: '2 days',
    sessions: [
      { id: 1, title: 'Session 1: Introduction', date: 'Dec 10', status: 'completed', hwScore: 92 },
      { id: 2, title: 'Session 2: Core Concepts', date: 'Dec 14', status: 'completed', hwScore: 88 },
      { id: 3, title: 'Session 3: Advanced Topics', date: 'Dec 18', status: 'completed', hwDue: 'Dec 23', hwStatus: 'due' },
      { id: 4, title: 'Session 4: Applications', date: 'Dec 24, 2:00 PM EST', status: 'upcoming' },
      { id: 5, title: 'Session 5: Practice', date: 'Not scheduled', status: 'locked' },
      { id: 6, title: 'Session 6: Deep Dive', date: 'Not scheduled', status: 'locked' },
      { id: 7, title: 'Session 7: Review', date: 'Not scheduled', status: 'locked' },
      { id: 8, title: 'Session 8: Final Project', date: 'Not scheduled', status: 'locked' }
    ],
    resources: [
      { sessionId: 1, sessionTitle: 'Session 1: Introduction', files: ['Recording', 'Slides', 'Code Files'] },
      { sessionId: 2, sessionTitle: 'Session 2: Core Concepts', files: ['Recording', 'Slides', 'Templates'] },
      { sessionId: 3, sessionTitle: 'Session 3: Advanced Topics', files: ['Recording', 'Slides', 'Examples'] }
    ],
    nextSession: realNextSession ? {
      title: `Session with ${realNextSession.teacherName || realNextSession.studentTeacherName || 'your teacher'}`,
      date: formatSessionDate(realNextSession.date),
      time: realNextSession.time,
      teacherName: realNextSession.teacherName || realNextSession.studentTeacherName
    } : null,
    homeworkDue: { title: 'Session 3 Assignment', dueDate: 'Dec 23', daysLeft: 2 },
    certificateProgress: 37.5,
    newDiscussionPosts: 5
  } : null;

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!currentUser?.name) return 'U';
    return currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Format date for display
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Get scheduled sessions for this course
  const courseScheduledSessions = scheduledSessions
    .filter(s => s.courseId === course?.id && s.status === 'scheduled')
    .sort((a, b) => a.date.localeCompare(b.date));

  // Get the next actionable session (scheduled or ready to schedule)
  const getNextActionableSession = () => {
    if (!course?.sessions?.list) return null;
    const courseCompletion = sessionCompletion[course?.id] || {};

    for (const session of course.sessions.list) {
      const isComplete = courseCompletion[session.number]?.completed;
      if (isComplete) continue;

      // Check if scheduled
      const scheduled = courseScheduledSessions.find(s => s.sessionNumber === session.number);
      if (scheduled) {
        return { type: 'scheduled', session, scheduledData: scheduled };
      }

      // Check if ready (not locked - previous session completed or first session)
      const previousComplete = session.number === 1 || courseCompletion[session.number - 1]?.completed;
      if (previousComplete) {
        return { type: 'ready', session };
      }

      // Otherwise locked, stop looking
      break;
    }
    return null;
  };

  const nextActionable = isCoursePurchased ? getNextActionableSession() : null;

  // Handle post submission
  const handleSubmitPost = async () => {
    if (!newPostText.trim() || isPosting) return;
    setIsPosting(true);
    // For now, just clear the post (would connect to backend later)
    setTimeout(() => {
      setNewPostText('');
      setIsPosting(false);
    }, 500);
  };

  // Detect if user is on iOS/iPad/mobile Safari (iframe restrictions)
  const isMobileOrSafari = () => {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isIPadOS = (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    return isIOS || isIPadOS || (isSafari && 'ontouchend' in document);
  };

  // Handle joining a BigBlueButton session via Supabase Edge Function
  const handleJoinSession = async () => {
    if (isJoiningSession || !course) return;
    setIsJoiningSession(true);

    try {
      const userName = currentUser?.name || 'Student';

      // Call Supabase Edge Function to create meeting and get join URL
      const response = await fetch('https://vnleonyfgwkfpvprpbqa.supabase.co/functions/v1/bbb-join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZubGVvbnlmZ3drZnB2cHJwYnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNDM2OTIsImV4cCI6MjA4MDYxOTY5Mn0.aunUqqZJTYGBIXjPT2_V_CtaBpmF61-IkEhkPvJdEu8',
        },
        body: JSON.stringify({
          courseId: course.id,
          courseName: course.title,
          userName: userName
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create meeting');
      }

      // Always open in new tab (Blindside Networks requires this - no iframe embedding)
      window.open(data.joinUrl, '_blank');
      setIsJoiningSession(false);
    } catch (error) {
      console.error('Failed to join session:', error);
      alert('Failed to join session. Please try again.');
      setIsJoiningSession(false);
      setShowBbbModal(false);
    }
  };

  // Close BBB modal
  const handleCloseBbbModal = () => {
    setShowBbbModal(false);
    setBbbJoinUrl(null);
  };

  if (!course) {
    return (
      <div style={{ 
        background: isDarkMode ? '#000' : '#fff', 
        minHeight: '100vh',
        padding: 24
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 24
        }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: isDarkMode ? '#e7e9ea' : '#0f1419',
              fontSize: 20,
              cursor: 'pointer',
              padding: 8,
              borderRadius: '50%'
            }}
          >
            ←
          </button>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>
            Course
          </h1>
        </div>
        
        <div style={{ textAlign: 'center', padding: 48, color: isDarkMode ? '#71767b' : '#536471' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
          <h2 style={{ color: isDarkMode ? '#e7e9ea' : '#0f1419', marginBottom: 8 }}>Course Not Found</h2>
          <button onClick={onBack} style={{
            marginTop: 24,
            background: '#1d9bf0',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: 20,
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const instructor = getInstructorById(course.instructorId);
  const instructorInitials = instructor?.name?.split(' ').map(n => n[0]).join('') || 'IN';

  const handleFollowToggle = () => {
    // Only allow follow/unfollow for purchased courses
    if (!isCoursePurchased || !setFollowedCommunities) return;

    const creatorId = `creator-${course.instructorId}`;

    if (isFollowing) {
      // Unfollow: Remove this course from creator's followedCourseIds
      setFollowedCommunities(prev => prev.map(c => {
        if (c.id === creatorId) {
          return {
            ...c,
            followedCourseIds: (c.followedCourseIds || []).filter(id => id !== course.id)
          };
        }
        return c;
      }));
    } else {
      // Follow: Add this course to creator's followedCourseIds
      setFollowedCommunities(prev => prev.map(c => {
        if (c.id === creatorId) {
          return {
            ...c,
            followedCourseIds: [...new Set([...(c.followedCourseIds || []), course.id])]
          };
        }
        return c;
      }));
    }
    setIsFollowing(!isFollowing);
  };

  // Different tabs for enrolled vs non-enrolled users
  const tabs = isCoursePurchased ? [
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'sessions', label: 'Session Files' },
    { id: 'feed', label: 'Course Feed' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'about', label: 'About Course' }
  ] : [
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'feed', label: 'Course Feed' },
    { id: 'reviews', label: 'Reviews' }
  ];

  return (
    <div style={{
      background: isDarkMode ? '#000' : '#fff',
      minHeight: '100vh'
    }}>
      {/* Back Button */}
      {onBack && (
        <div style={{
          padding: '16px',
          borderBottom: isDarkMode ? '1px solid #27272a' : '1px solid #e5e7eb',
          background: isDarkMode ? '#0a0a0a' : '#fff'
        }}>
          <button
            onClick={onBack}
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
              color: isDarkMode ? '#f5f5f7' : '#374151'
            }}
          >
            <span>←</span> Back
          </button>
        </div>
      )}

      {/* Community Mini-Header Card */}
      <div
        onClick={() => onViewInstructor && onViewInstructor(course.instructorId)}
        style={{
          margin: '0 24px',
          marginTop: 16,
          padding: '10px 16px',
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(79, 172, 254, 0.15) 0%, rgba(0, 242, 254, 0.08) 100%)'
            : 'linear-gradient(135deg, rgba(79, 172, 254, 0.12) 0%, rgba(0, 242, 254, 0.06) 100%)',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          cursor: 'pointer',
          border: isDarkMode ? '1px solid rgba(79, 172, 254, 0.2)' : '1px solid rgba(79, 172, 254, 0.15)',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = isDarkMode
            ? 'linear-gradient(135deg, rgba(79, 172, 254, 0.2) 0%, rgba(0, 242, 254, 0.12) 100%)'
            : 'linear-gradient(135deg, rgba(79, 172, 254, 0.18) 0%, rgba(0, 242, 254, 0.1) 100%)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = isDarkMode
            ? 'linear-gradient(135deg, rgba(79, 172, 254, 0.15) 0%, rgba(0, 242, 254, 0.08) 100%)'
            : 'linear-gradient(135deg, rgba(79, 172, 254, 0.12) 0%, rgba(0, 242, 254, 0.06) 100%)';
        }}
      >
        <span style={{ fontSize: 18 }}>👥</span>
        <span style={{
          fontWeight: 600,
          fontSize: 14,
          color: isDarkMode ? '#e7e9ea' : '#0f1419',
          flex: 1
        }}>
          {instructor?.communityName || `${instructor?.name} Community`}
        </span>
        <span style={{
          color: isDarkMode ? '#71767b' : '#536471',
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          gap: 4
        }}>
          Go to Community <span style={{ fontSize: 16 }}>→</span>
        </span>
      </div>

      {/* Header Section */}
      <div style={{
        padding: '24px 24px 0 24px',
        borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
        overflow: 'visible',
        maxWidth: '100%'
      }}>
        {/* Title and Actions Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 24,
          marginBottom: 20,
          maxWidth: '100%',
          overflow: 'visible'
        }}>
          {/* Title & Subtitle */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 8,
              color: isDarkMode ? '#e7e9ea' : '#0f1419',
              lineHeight: 1.2
            }}>
              {course.title}
            </h1>

            {/* Creator Link - directly under title */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (onViewInstructor) onViewInstructor(course.instructorId);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                marginBottom: 8
              }}
            >
              <img
                src={instructor?.avatar}
                alt={instructor?.name}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <span
                style={{
                  color: '#1d9bf0',
                  fontSize: 14,
                  fontWeight: 500
                }}
                onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                onMouseLeave={e => e.target.style.textDecoration = 'none'}
              >
                {instructor?.name}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ flexShrink: 0, display: 'flex', gap: 10 }}>
            {!isCoursePurchased ? (
              /* Non-enrolled: Show Enroll button */
              <button
                onClick={() => onEnroll && onEnroll(course)}
                style={{
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 28px',
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Enroll for {course.price}
              </button>
            ) : (
              /* Enrolled: Show Follow/Unfollow Community button */
              <button
                onClick={handleFollowToggle}
                style={{
                  background: '#f7f9f9',
                  border: '1px solid #cfd9de',
                  color: '#0f1419',
                  padding: '10px 20px',
                  borderRadius: 20,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (isFollowing) {
                    e.currentTarget.style.borderColor = '#f4212e';
                    e.currentTarget.style.color = '#f4212e';
                    e.currentTarget.textContent = 'Unfollow Course';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isFollowing) {
                    e.currentTarget.style.borderColor = '#cfd9de';
                    e.currentTarget.style.color = '#0f1419';
                    e.currentTarget.textContent = 'Following Course';
                  }
                }}
              >
                {isFollowing ? 'Following Course' : 'Follow Course'}
              </button>
            )}
          </div>
        </div>

        {/* Description - Full Width */}
        <p style={{
          fontSize: 16,
          color: isDarkMode ? '#71767b' : '#536471',
          margin: '0 0 8px 0'
        }}>
          {course.description}
        </p>

        {/* Stats Line - Right below description */}
        <div style={{
          fontSize: 15,
          color: isDarkMode ? '#e7e9ea' : '#0f1419',
          marginBottom: 16
        }}>
          <span style={{ color: '#fbbf24' }}>★</span> 4.8 (234) <span style={{ color: isDarkMode ? '#71767b' : '#536471' }}>•</span> 1,250 students <span style={{ color: isDarkMode ? '#71767b' : '#536471' }}>•</span> {course.curriculum?.length || 5} Modules <span style={{ color: isDarkMode ? '#71767b' : '#536471' }}>•</span> {(course.curriculum?.length || 5) * 4} Lessons <span style={{ color: isDarkMode ? '#71767b' : '#536471' }}>•</span> 12 hours
        </div>

        {/* Video and What You'll Learn - Only for NON-enrolled users (enrolled users see this in About tab) */}
        {!isCoursePurchased && (
        <div style={{
          display: 'flex',
          gap: 20,
          marginBottom: 16
        }}>
          {/* Video Player */}
          <div style={{
            flex: 2,
            minWidth: 300,
            background: isDarkMode ? '#16181c' : '#f7f9f9',
            borderRadius: 12,
            aspectRatio: '16/9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 200
          }}>
            <div style={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              <FaPlay style={{ color: '#fff', fontSize: 24, marginLeft: 4 }} />
            </div>
            {/* Video controls bar */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(0,0,0,0.8)',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <FaPlay style={{ color: '#fff', fontSize: 14 }} />
              <div style={{ flex: 1, height: 4, background: '#333', borderRadius: 2 }}>
                <div style={{ width: '0%', height: '100%', background: '#fff', borderRadius: 2 }} />
              </div>
              <span style={{ color: '#fff', fontSize: 12 }}>0:00 / {course.duration || '4-6 weeks'}</span>
            </div>
          </div>

          {/* What You'll Learn */}
          <div style={{
            flex: 1,
            minWidth: 240,
            maxWidth: 320,
            background: isDarkMode ? '#16181c' : '#f7f9f9',
            borderRadius: 12,
            padding: 20,
            border: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
          }}>
            <h3 style={{
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 16,
              color: isDarkMode ? '#e7e9ea' : '#0f1419',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span style={{ fontSize: 18 }}>🎯</span> What You'll Learn
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Fundamentals of prompt engineering',
                'Advanced techniques for business apps',
                'Building your own prompt library',
                'Iteration and refinement',
                'Context and constraint design',
                'Real-world use cases'
              ].map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  fontSize: 14,
                  color: isDarkMode ? '#e7e9ea' : '#0f1419'
                }}>
                  <FaCheck style={{ color: '#10b981', fontSize: 12, marginTop: 4, flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}

        {/* What's Included - Only for NON-enrolled users (enrolled users see this in About tab) */}
        {!isCoursePurchased && (
        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <h4 style={{
            fontSize: 14,
            fontWeight: 700,
            color: isDarkMode ? '#71767b' : '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            marginBottom: 8
          }}>
            What's Included
          </h4>
          <div style={{
            fontSize: 15,
            color: isDarkMode ? '#e7e9ea' : '#0f1419',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px 16px'
          }}>
            <span>• 1-on-1 sessions with Student-Teacher</span>
            <span>• Access to AI Prompters Community</span>
            <span>• Certificate</span>
          </div>
        </div>
        )}

        {/* Next Session Hero Card - Only for enrolled users with an actionable session */}
        {isCoursePurchased && nextActionable && (
          <div style={{
            background: nextActionable.type === 'scheduled'
              ? (isDarkMode ? 'linear-gradient(135deg, rgba(29, 155, 240, 0.15) 0%, rgba(29, 155, 240, 0.05) 100%)' : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)')
              : (isDarkMode ? 'linear-gradient(135deg, rgba(156, 163, 175, 0.15) 0%, rgba(156, 163, 175, 0.05) 100%)' : 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)'),
            border: nextActionable.type === 'scheduled'
              ? (isDarkMode ? '1px solid rgba(29, 155, 240, 0.3)' : '1px solid #bfdbfe')
              : (isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb'),
            borderRadius: 12,
            padding: 20,
            marginBottom: 16
          }}>
            {/* Hero Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 12
            }}>
              <span style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: nextActionable.type === 'scheduled' ? '#1d9bf0' : '#9ca3af'
              }} />
              <span style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                color: nextActionable.type === 'scheduled' ? '#1d9bf0' : (isDarkMode ? '#9ca3af' : '#6b7280')
              }}>
                {nextActionable.type === 'scheduled' ? 'YOUR NEXT SESSION' : 'SCHEDULE YOUR NEXT SESSION'}
              </span>
            </div>

            {/* Session Title */}
            <h3 style={{
              fontSize: 18,
              fontWeight: 700,
              color: isDarkMode ? '#e7e9ea' : '#0f1419',
              margin: '0 0 8px 0'
            }}>
              Session {nextActionable.session.number}: {nextActionable.session.title}
            </h3>

            {/* Session Details */}
            {nextActionable.type === 'scheduled' ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                marginBottom: 16
              }}>
                <div style={{
                  fontSize: 14,
                  color: isDarkMode ? '#e7e9ea' : '#0f1419',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <FaCalendar style={{ color: '#1d9bf0', fontSize: 13 }} />
                  {formatDateForDisplay(nextActionable.scheduledData.date)} at {nextActionable.scheduledData.time}
                </div>
                <div style={{
                  fontSize: 14,
                  color: isDarkMode ? '#71767b' : '#536471',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <FaChalkboardTeacher style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 13 }} />
                  with {nextActionable.scheduledData.studentTeacherName || nextActionable.scheduledData.teacherName || 'your teacher'}
                </div>
              </div>
            ) : (
              <div style={{
                fontSize: 14,
                color: isDarkMode ? '#71767b' : '#536471',
                marginBottom: 16
              }}>
                {nextActionable.session.duration} • {nextActionable.session.modules?.length || 0} modules
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              {nextActionable.type === 'scheduled' ? (
                <>
                  <button
                    onClick={handleJoinSession}
                    disabled={isJoiningSession}
                    style={{
                      background: '#1d9bf0',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 24px',
                      borderRadius: 20,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: isJoiningSession ? 'wait' : 'pointer',
                      opacity: isJoiningSession ? 0.7 : 1
                    }}
                  >
                    {isJoiningSession ? 'Joining...' : 'Join Session'}
                  </button>
                  <button
                    onClick={() => onRescheduleSession && onRescheduleSession(nextActionable.scheduledData)}
                    style={{
                      background: 'transparent',
                      color: isDarkMode ? '#e7e9ea' : '#0f1419',
                      border: isDarkMode ? '1px solid #2f3336' : '1px solid #cfd9de',
                      padding: '10px 24px',
                      borderRadius: 20,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Reschedule
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onBrowseStudentTeachers && onBrowseStudentTeachers(course, nextActionable.session.number)}
                  style={{
                    background: '#1d9bf0',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: 20,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Schedule Session
                </button>
              )}
            </div>
          </div>
        )}

        {/* Session Timeline Cards - Only for enrolled users with sessions defined */}
        {isCoursePurchased && course?.sessions?.list && (
          <SessionTimelineCards
            course={course}
            scheduledSessions={courseScheduledSessions}
            sessionCompletion={sessionCompletion}
            onScheduleSession={(sessionNum) => onBrowseStudentTeachers && onBrowseStudentTeachers(course, sessionNum)}
            onJoinSession={handleJoinSession}
            onRescheduleSession={onRescheduleSession}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Enrolled Badge - Only for purchased courses */}
        {isCoursePurchased && enrollmentData && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            padding: '6px 12px',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 12
          }}>
            <FaCheck style={{ fontSize: 10 }} /> ENROLLED · Started {enrollmentData.enrolledDate}
          </span>
        )}


        {/* Tabs - Pill Style */}
        <div
          className="course-detail-tabs"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8
          }}
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="course-detail-tab-btn"
              style={{
                padding: '8px 16px',
                fontSize: 14,
                fontWeight: 500,
                color: activeTab === tab.id ? 'white' : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                background: activeTab === tab.id ? '#1d9bf0' : (isDarkMode ? '#16181c' : 'white'),
                border: `1px solid ${activeTab === tab.id ? '#1d9bf0' : (isDarkMode ? '#2f3336' : '#cfd9de')}`,
                borderRadius: 9999,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout - Full width for Course Feed */}
      <div style={{
        display: 'flex',
        gap: activeTab === 'feed' ? 0 : 32,
        padding: 24,
        maxWidth: activeTab === 'feed' ? '100%' : 1200
      }}>
        {/* Left Column - Main Content (Full width on feed tab) */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Session Files Tab - Accordion Style */}
          {activeTab === 'sessions' && isCoursePurchased && (
            <div>
              {/* Header */}
              <div style={{
                padding: '16px 20px',
                background: isDarkMode ? '#16181c' : '#f7f9f9',
                borderRadius: '12px 12px 0 0',
                border: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
                borderBottom: 'none'
              }}>
                <h3 style={{
                  fontSize: 16,
                  fontWeight: 700,
                  margin: 0,
                  color: isDarkMode ? '#e7e9ea' : '#0f1419',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5
                }}>
                  Session Files
                </h3>
              </div>

              {/* Session Accordions */}
              <div style={{
                border: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
                borderRadius: '0 0 12px 12px',
                overflow: 'hidden'
              }}>
                {/* Session 1 - Completed */}
                {(() => {
                  const sessionNum = 1;
                  const isCompleted = sessionCompletion[course?.id]?.[sessionNum]?.completed;
                  const isExpanded = expandedFileSessions[sessionNum];
                  const sessionData = course?.sessions?.list?.find(s => s.number === sessionNum);

                  return (
                    <div style={{
                      borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
                    }}>
                      {/* Session Header - Clickable */}
                      <div
                        onClick={() => setExpandedFileSessions(prev => ({ ...prev, [sessionNum]: !prev[sessionNum] }))}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 16,
                          padding: '16px 20px',
                          cursor: 'pointer',
                          background: isCompleted
                            ? (isDarkMode ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.05)')
                            : 'transparent'
                        }}
                      >
                        {/* Expand/Collapse Arrow */}
                        <div style={{
                          color: isDarkMode ? '#71767b' : '#536471',
                          fontSize: 12,
                          transition: 'transform 0.2s',
                          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
                        }}>
                          <FaChevronRight />
                        </div>

                        {/* Session Title */}
                        <div style={{ flex: 1 }}>
                          <span style={{
                            fontWeight: 600,
                            fontSize: 15,
                            color: isDarkMode ? '#e7e9ea' : '#0f1419'
                          }}>
                            Session {sessionNum}: {sessionData?.title || 'Foundation & Core Concepts'}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <span style={{
                          fontSize: 12,
                          padding: '6px 12px',
                          borderRadius: 20,
                          background: isCompleted
                            ? 'rgba(16, 185, 129, 0.15)'
                            : (isDarkMode ? '#2f3336' : '#e5e7eb'),
                          color: isCompleted ? '#10b981' : (isDarkMode ? '#71767b' : '#536471'),
                          fontWeight: 600
                        }}>
                          {isCompleted ? 'Completed' : 'In Progress'}
                        </span>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div style={{
                          padding: '0 20px 20px 52px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 20
                        }}>
                          {/* RECORDING Section */}
                          <div>
                            <div style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: isDarkMode ? '#71767b' : '#536471',
                              textTransform: 'uppercase',
                              letterSpacing: 0.5,
                              marginBottom: 10
                            }}>
                              Recording
                            </div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px 16px',
                              background: isDarkMode ? '#0a0a0a' : '#fff',
                              border: isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb',
                              borderRadius: 8
                            }}>
                              <div>
                                <div style={{
                                  fontWeight: 500,
                                  color: isDarkMode ? '#e7e9ea' : '#0f1419',
                                  fontSize: 14
                                }}>
                                  Session Recording (Jan 20, 2026)
                                </div>
                                <div style={{
                                  fontSize: 13,
                                  color: isDarkMode ? '#71767b' : '#536471',
                                  marginTop: 2
                                }}>
                                  1:32:45
                                </div>
                              </div>
                              <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                background: '#1d9bf0',
                                color: '#fff',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: 6,
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}>
                                <FaDownload style={{ fontSize: 12 }} /> Download
                              </button>
                            </div>
                          </div>

                          {/* DOCUMENTS Section */}
                          <div>
                            <div style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: isDarkMode ? '#71767b' : '#536471',
                              textTransform: 'uppercase',
                              letterSpacing: 0.5,
                              marginBottom: 10
                            }}>
                              Documents
                            </div>
                            <div style={{
                              background: isDarkMode ? '#0a0a0a' : '#fff',
                              border: isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb',
                              borderRadius: 8,
                              overflow: 'hidden'
                            }}>
                              {[
                                { name: 'Session 1 Slides.pdf', size: '2.4 MB' },
                                { name: 'Prompt Templates.docx', size: '156 KB' },
                                { name: 'Reference Links.pdf', size: '89 KB' }
                              ].map((doc, idx, arr) => (
                                <div
                                  key={idx}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '12px 16px',
                                    borderBottom: idx < arr.length - 1
                                      ? (isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb')
                                      : 'none'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <FaFileAlt style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 14 }} />
                                    <span style={{
                                      color: isDarkMode ? '#e7e9ea' : '#0f1419',
                                      fontSize: 14
                                    }}>
                                      {doc.name}
                                    </span>
                                    <span style={{
                                      color: isDarkMode ? '#71767b' : '#536471',
                                      fontSize: 12
                                    }}>
                                      {doc.size}
                                    </span>
                                  </div>
                                  <button style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#1d9bf0',
                                    cursor: 'pointer',
                                    padding: 4
                                  }}>
                                    <FaDownload style={{ fontSize: 14 }} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* HOMEWORK Section */}
                          <div>
                            <div style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: isDarkMode ? '#71767b' : '#536471',
                              textTransform: 'uppercase',
                              letterSpacing: 0.5,
                              marginBottom: 10
                            }}>
                              Homework
                            </div>
                            <div style={{
                              background: isDarkMode ? '#0a0a0a' : '#fff',
                              border: isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb',
                              borderRadius: 8,
                              padding: 16
                            }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 12
                              }}>
                                <div>
                                  <div style={{
                                    fontWeight: 600,
                                    color: isDarkMode ? '#e7e9ea' : '#0f1419',
                                    fontSize: 14,
                                    marginBottom: 2
                                  }}>
                                    Assignment: Build 3 Custom Prompts
                                  </div>
                                  <div style={{
                                    fontSize: 13,
                                    color: isDarkMode ? '#71767b' : '#536471'
                                  }}>
                                    Due: Jan 27, 2026
                                  </div>
                                </div>
                                <button style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  background: 'transparent',
                                  color: '#1d9bf0',
                                  border: '1px solid #1d9bf0',
                                  padding: '8px 16px',
                                  borderRadius: 6,
                                  fontSize: 13,
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}>
                                  <FaDownload style={{ fontSize: 12 }} /> Download
                                </button>
                              </div>

                              {/* Divider */}
                              <div style={{
                                borderTop: isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb',
                                margin: '12px 0'
                              }} />

                              {/* Submission */}
                              <div>
                                <div style={{
                                  fontSize: 13,
                                  color: isDarkMode ? '#71767b' : '#536471',
                                  marginBottom: 8
                                }}>
                                  Your Submission:
                                </div>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '10px 12px',
                                  background: isDarkMode ? '#16181c' : '#f7f9f9',
                                  borderRadius: 6,
                                  border: isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb'
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <FaFileAlt style={{ color: '#10b981', fontSize: 14 }} />
                                    <span style={{
                                      color: isDarkMode ? '#e7e9ea' : '#0f1419',
                                      fontSize: 14
                                    }}>
                                      my-prompts.pdf
                                    </span>
                                    <span style={{
                                      color: '#10b981',
                                      fontSize: 12
                                    }}>
                                      Submitted Jan 25
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', gap: 8 }}>
                                    <button style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#1d9bf0',
                                      cursor: 'pointer',
                                      fontSize: 13
                                    }}>
                                      View
                                    </button>
                                    <button style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#1d9bf0',
                                      cursor: 'pointer',
                                      padding: 4
                                    }}>
                                      <FaDownload style={{ fontSize: 12 }} />
                                    </button>
                                  </div>
                                </div>
                                <button style={{
                                  marginTop: 10,
                                  background: 'transparent',
                                  color: isDarkMode ? '#71767b' : '#536471',
                                  border: isDarkMode ? '1px solid #2f3336' : '1px solid #cfd9de',
                                  padding: '8px 16px',
                                  borderRadius: 6,
                                  fontSize: 13,
                                  cursor: 'pointer'
                                }}>
                                  Upload New Version
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Session 2 - Locked or Ready based on Session 1 completion */}
                {(() => {
                  const sessionNum = 2;
                  const prevSessionComplete = sessionCompletion[course?.id]?.[1]?.completed;
                  const isLocked = !prevSessionComplete;
                  const isExpanded = expandedFileSessions[sessionNum];
                  const sessionData = course?.sessions?.list?.find(s => s.number === sessionNum);

                  return (
                    <div>
                      {/* Session Header - Clickable only if not locked */}
                      <div
                        onClick={() => !isLocked && setExpandedFileSessions(prev => ({ ...prev, [sessionNum]: !prev[sessionNum] }))}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 16,
                          padding: '16px 20px',
                          cursor: isLocked ? 'not-allowed' : 'pointer',
                          background: isLocked
                            ? (isDarkMode ? 'rgba(113, 118, 123, 0.08)' : 'rgba(107, 114, 128, 0.05)')
                            : 'transparent',
                          opacity: isLocked ? 0.7 : 1
                        }}
                      >
                        {/* Expand/Collapse Arrow or Lock */}
                        <div style={{
                          color: isDarkMode ? '#71767b' : '#536471',
                          fontSize: 12,
                          transition: 'transform 0.2s',
                          transform: isExpanded && !isLocked ? 'rotate(90deg)' : 'rotate(0deg)'
                        }}>
                          {isLocked ? <span style={{ fontSize: 14 }}>🔒</span> : <FaChevronRight />}
                        </div>

                        {/* Session Title */}
                        <div style={{ flex: 1 }}>
                          <span style={{
                            fontWeight: 600,
                            fontSize: 15,
                            color: isLocked
                              ? (isDarkMode ? '#71767b' : '#9ca3af')
                              : (isDarkMode ? '#e7e9ea' : '#0f1419')
                          }}>
                            Session {sessionNum}: {sessionData?.title || 'Advanced Techniques'}
                          </span>
                        </div>

                        {/* Status */}
                        {isLocked ? (
                          <span style={{
                            fontSize: 13,
                            color: isDarkMode ? '#71767b' : '#9ca3af'
                          }}>
                            Complete Session 1 first
                          </span>
                        ) : (
                          <span style={{
                            fontSize: 12,
                            padding: '6px 12px',
                            borderRadius: 20,
                            background: isDarkMode ? '#2f3336' : '#e5e7eb',
                            color: isDarkMode ? '#71767b' : '#536471',
                            fontWeight: 600
                          }}>
                            Not Started
                          </span>
                        )}
                      </div>

                      {/* Expanded Content - Only if not locked */}
                      {isExpanded && !isLocked && (
                        <div style={{
                          padding: '0 20px 20px 52px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 20
                        }}>
                          {/* RECORDING Section - Not available yet */}
                          <div>
                            <div style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: isDarkMode ? '#71767b' : '#536471',
                              textTransform: 'uppercase',
                              letterSpacing: 0.5,
                              marginBottom: 10
                            }}>
                              Recording
                            </div>
                            <div style={{
                              padding: '16px',
                              background: isDarkMode ? '#0a0a0a' : '#fff',
                              border: isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb',
                              borderRadius: 8,
                              color: isDarkMode ? '#71767b' : '#536471',
                              fontSize: 14,
                              fontStyle: 'italic'
                            }}>
                              Recording will be available after the session is completed.
                            </div>
                          </div>

                          {/* DOCUMENTS Section */}
                          <div>
                            <div style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: isDarkMode ? '#71767b' : '#536471',
                              textTransform: 'uppercase',
                              letterSpacing: 0.5,
                              marginBottom: 10
                            }}>
                              Documents
                            </div>
                            <div style={{
                              background: isDarkMode ? '#0a0a0a' : '#fff',
                              border: isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb',
                              borderRadius: 8,
                              overflow: 'hidden'
                            }}>
                              {[
                                { name: 'Session 2 Slides.pdf', size: '3.1 MB' },
                                { name: 'Advanced Examples.docx', size: '245 KB' }
                              ].map((doc, idx, arr) => (
                                <div
                                  key={idx}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '12px 16px',
                                    borderBottom: idx < arr.length - 1
                                      ? (isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb')
                                      : 'none'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <FaFileAlt style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 14 }} />
                                    <span style={{
                                      color: isDarkMode ? '#e7e9ea' : '#0f1419',
                                      fontSize: 14
                                    }}>
                                      {doc.name}
                                    </span>
                                    <span style={{
                                      color: isDarkMode ? '#71767b' : '#536471',
                                      fontSize: 12
                                    }}>
                                      {doc.size}
                                    </span>
                                  </div>
                                  <button style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#1d9bf0',
                                    cursor: 'pointer',
                                    padding: 4
                                  }}>
                                    <FaDownload style={{ fontSize: 14 }} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* HOMEWORK Section */}
                          <div>
                            <div style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: isDarkMode ? '#71767b' : '#536471',
                              textTransform: 'uppercase',
                              letterSpacing: 0.5,
                              marginBottom: 10
                            }}>
                              Homework
                            </div>
                            <div style={{
                              background: isDarkMode ? '#0a0a0a' : '#fff',
                              border: isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb',
                              borderRadius: 8,
                              padding: 16
                            }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}>
                                <div>
                                  <div style={{
                                    fontWeight: 600,
                                    color: isDarkMode ? '#e7e9ea' : '#0f1419',
                                    fontSize: 14,
                                    marginBottom: 2
                                  }}>
                                    Assignment: Build a Prompt Library
                                  </div>
                                  <div style={{
                                    fontSize: 13,
                                    color: isDarkMode ? '#71767b' : '#536471'
                                  }}>
                                    Due date will be set after session
                                  </div>
                                </div>
                                <button style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  background: 'transparent',
                                  color: '#1d9bf0',
                                  border: '1px solid #1d9bf0',
                                  padding: '8px 16px',
                                  borderRadius: 6,
                                  fontSize: 13,
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}>
                                  <FaDownload style={{ fontSize: 12 }} /> Download
                                </button>
                              </div>

                              {/* Divider */}
                              <div style={{
                                borderTop: isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb',
                                margin: '12px 0'
                              }} />

                              {/* No submission yet */}
                              <div>
                                <div style={{
                                  fontSize: 13,
                                  color: isDarkMode ? '#71767b' : '#536471',
                                  marginBottom: 8
                                }}>
                                  Your Submission:
                                </div>
                                <button style={{
                                  background: '#1d9bf0',
                                  color: '#fff',
                                  border: 'none',
                                  padding: '10px 20px',
                                  borderRadius: 6,
                                  fontSize: 14,
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}>
                                  Upload Submission
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⭐</div>
              <h3 style={{ color: isDarkMode ? '#e7e9ea' : '#0f1419', marginBottom: 8 }}>No Reviews Yet</h3>
              <p style={{ color: isDarkMode ? '#71767b' : '#536471' }}>Be the first to review this course!</p>
            </div>
          )}

          {/* About Course Tab - Video and What You'll Learn for enrolled users */}
          {activeTab === 'about' && isCoursePurchased && (
            <div style={{ padding: '24px 0' }}>
              <div style={{
                display: 'flex',
                gap: 20,
                marginBottom: 24
              }}>
                {/* Video Player */}
                <div style={{
                  flex: 2,
                  minWidth: 300,
                  background: isDarkMode ? '#16181c' : '#f7f9f9',
                  borderRadius: 12,
                  aspectRatio: '16/9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: 200
                }}>
                  <div style={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}>
                    <FaPlay style={{ color: '#fff', fontSize: 24, marginLeft: 4 }} />
                  </div>
                  {/* Video controls bar */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(0,0,0,0.8)',
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}>
                    <FaPlay style={{ color: '#fff', fontSize: 14 }} />
                    <div style={{ flex: 1, height: 4, background: '#333', borderRadius: 2 }}>
                      <div style={{ width: '0%', height: '100%', background: '#fff', borderRadius: 2 }} />
                    </div>
                    <span style={{ color: '#fff', fontSize: 12 }}>0:00 / {course.duration || '4-6 weeks'}</span>
                  </div>
                </div>

                {/* What You'll Learn */}
                <div style={{
                  flex: 1,
                  minWidth: 240,
                  maxWidth: 320,
                  background: isDarkMode ? '#16181c' : '#f7f9f9',
                  borderRadius: 12,
                  padding: 20,
                  border: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
                }}>
                  <h3 style={{
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 16,
                    color: isDarkMode ? '#e7e9ea' : '#0f1419',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <span style={{ fontSize: 18 }}>🎯</span> What You'll Learn
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      'Fundamentals of prompt engineering',
                      'Advanced techniques for business apps',
                      'Building your own prompt library',
                      'Iteration and refinement',
                      'Context and constraint design',
                      'Real-world use cases'
                    ].map((item, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        fontSize: 14,
                        color: isDarkMode ? '#e7e9ea' : '#0f1419'
                      }}>
                        <FaCheck style={{ color: '#10b981', fontSize: 12, marginTop: 4, flexShrink: 0 }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* What's Included */}
              <div style={{ marginTop: 24 }}>
                <h4 style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: isDarkMode ? '#71767b' : '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  marginBottom: 12
                }}>
                  What's Included
                </h4>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 16
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 16px',
                    background: isDarkMode ? '#16181c' : '#f7f9f9',
                    borderRadius: 8,
                    border: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
                  }}>
                    <span style={{ fontSize: 18 }}>👥</span>
                    <span style={{ fontSize: 14, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>1-on-1 sessions with Student-Teacher</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 16px',
                    background: isDarkMode ? '#16181c' : '#f7f9f9',
                    borderRadius: 8,
                    border: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
                  }}>
                    <span style={{ fontSize: 18 }}>💬</span>
                    <span style={{ fontSize: 14, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>Access to AI Prompters Community</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 16px',
                    background: isDarkMode ? '#16181c' : '#f7f9f9',
                    borderRadius: 8,
                    border: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
                  }}>
                    <span style={{ fontSize: 18 }}>🏆</span>
                    <span style={{ fontSize: 14, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>Certificate</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'feed' && (
            <div>
              {/* Enrollment Required Message - Show when not enrolled */}
              {!isCoursePurchased ? (
                <div style={{
                  background: isDarkMode ? 'rgba(29, 155, 240, 0.1)' : 'rgba(29, 155, 240, 0.05)',
                  border: isDarkMode ? '1px solid rgba(29, 155, 240, 0.3)' : '1px solid rgba(29, 155, 240, 0.2)',
                  borderRadius: 12,
                  padding: '24px',
                  margin: '16px',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>🔒</span>
                  <div style={{
                    fontWeight: 600,
                    fontSize: 18,
                    color: isDarkMode ? '#e7e9ea' : '#0f1419',
                    marginBottom: 8
                  }}>
                    Enrollment Required
                  </div>
                  <div style={{
                    fontSize: 15,
                    color: isDarkMode ? '#9ca3af' : '#536471',
                    marginBottom: 16
                  }}>
                    Access to this course feed is only available to enrolled students.
                  </div>
                  <button
                    onClick={() => onEnroll && onEnroll(course)}
                    style={{
                      background: '#10b981',
                      color: '#fff',
                      border: 'none',
                      padding: '12px 28px',
                      borderRadius: 8,
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Enroll for {course.price}
                  </button>
                </div>
              ) : (
              <>
              {/* Post Box */}
              <div
                style={{
                  borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
                  padding: '12px 16px 16px 16px',
                  background: isDarkMode ? 'rgba(29, 155, 240, 0.03)' : 'rgba(29, 155, 240, 0.02)',
                }}
              >
                <div style={{
                  border: isDarkMode ? '1px solid #2f3336' : '1px solid #cfd9de',
                  borderRadius: 12,
                  background: isDarkMode ? '#0a0a0a' : '#fff',
                  overflow: 'hidden'
                }}>
                  {/* Text Area with Avatar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '12px 14px',
                    gap: 10
                  }}>
                    {/* User Avatar */}
                    {currentUser?.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser?.name || 'User'}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          flexShrink: 0,
                          marginTop: 2
                        }}
                      />
                    ) : (
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: '#1d9bf0',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: 2
                      }}>
                        {getUserInitials()}
                      </div>
                    )}
                    <textarea
                      value={newPostText}
                      onChange={(e) => setNewPostText(e.target.value)}
                      placeholder={`Share something about ${course.title}...`}
                      style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        resize: 'none',
                        fontSize: 15,
                        fontWeight: 400,
                        lineHeight: 1.5,
                        background: 'transparent',
                        color: isDarkMode ? '#e7e9ea' : '#0f1419',
                        padding: 0,
                        minHeight: 50,
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  {/* Bottom Action Bar */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      borderTop: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
                      background: isDarkMode ? '#16181c' : '#f7f9f9'
                    }}
                  >
                    {/* Media Icons */}
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        style={{
                          background: isDarkMode ? 'rgba(29, 155, 240, 0.1)' : 'rgba(29, 155, 240, 0.08)',
                          border: 'none',
                          color: '#1d9bf0',
                          cursor: 'pointer',
                          padding: '6px 8px',
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 16
                        }}
                        title="Add image"
                      >
                        <FaImage />
                      </button>
                      <button
                        style={{
                          background: isDarkMode ? 'rgba(29, 155, 240, 0.1)' : 'rgba(29, 155, 240, 0.08)',
                          border: 'none',
                          color: '#1d9bf0',
                          cursor: 'pointer',
                          padding: '6px 8px',
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 16
                        }}
                        title="Add link"
                      >
                        <FaLink />
                      </button>
                      <button
                        style={{
                          background: isDarkMode ? 'rgba(29, 155, 240, 0.1)' : 'rgba(29, 155, 240, 0.08)',
                          border: 'none',
                          color: '#1d9bf0',
                          cursor: 'pointer',
                          padding: '6px 8px',
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 16
                        }}
                        title="Attach file"
                      >
                        <FaPaperclip />
                      </button>
                    </div>

                    {/* Post Button */}
                    <button
                      disabled={!newPostText.trim() || isPosting}
                      onClick={handleSubmitPost}
                      style={{
                        background: '#1d9bf0',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 20,
                        padding: '8px 20px',
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: (newPostText.trim() && !isPosting) ? 'pointer' : 'not-allowed',
                        opacity: (newPostText.trim() && !isPosting) ? 1 : 0.5
                      }}
                    >
                      {isPosting ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sample course feed posts */}
              {[
                {
                  id: 1,
                  author: 'CourseEnthusiast',
                  authorHandle: '@CourseEnthusiast',
                  authorAvatar: 'https://i.pravatar.cc/40?img=11',
                  content: `Just finished the first module of ${course.title}! The content is incredibly well-structured. Can't wait to continue! 🚀`,
                  timestamp: '2 hours ago',
                  likes: 24,
                  replies: 5,
                  retweets: 3
                },
                {
                  id: 2,
                  author: 'LearningDaily',
                  authorHandle: '@LearningDaily',
                  authorAvatar: 'https://i.pravatar.cc/40?img=22',
                  content: `The instructor explains complex concepts so clearly! This ${course.category} course is exactly what I needed. Highly recommend to anyone starting out.`,
                  timestamp: '5 hours ago',
                  likes: 42,
                  replies: 8,
                  retweets: 12
                },
                {
                  id: 3,
                  author: 'TechStudent2024',
                  authorHandle: '@TechStudent2024',
                  authorAvatar: 'https://i.pravatar.cc/40?img=33',
                  content: `Question for fellow students: Has anyone completed the hands-on project in Module 3? Looking for study partners! #PeerLoop #${course.category?.replace(/\s+/g, '')}`,
                  timestamp: '1 day ago',
                  likes: 18,
                  replies: 12,
                  retweets: 2
                },
                {
                  id: 4,
                  author: 'CareerChanger',
                  authorHandle: '@CareerChanger',
                  authorAvatar: 'https://i.pravatar.cc/40?img=44',
                  content: `Just became a Student-Teacher for this course! 🎉 Ready to help others learn while earning. The PeerLoop model is amazing - learn, teach, earn!`,
                  timestamp: '2 days ago',
                  likes: 89,
                  replies: 15,
                  retweets: 24
                }
              ].map(post => (
                <div 
                  key={post.id}
                  style={{
                    padding: 16,
                    borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
                  }}
                >
                  <div style={{ display: 'flex', gap: 12 }}>
                    <img 
                      src={post.authorAvatar}
                      alt={post.author}
                      style={{ width: 40, height: 40, borderRadius: '50%' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>
                          {post.author}
                        </span>
                        <span style={{ color: isDarkMode ? '#71767b' : '#536471' }}>
                          {post.authorHandle}
                        </span>
                        <span style={{ color: isDarkMode ? '#71767b' : '#536471' }}>·</span>
                        <span style={{ color: isDarkMode ? '#71767b' : '#536471' }}>
                          {post.timestamp}
                        </span>
                      </div>
                      <p style={{ 
                        margin: '0 0 12px 0', 
                        color: isDarkMode ? '#e7e9ea' : '#0f1419',
                        fontSize: 15,
                        lineHeight: 1.5
                      }}>
                        {post.content}
                      </p>
                      <div style={{ display: 'flex', gap: 24 }}>
                        <button style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: isDarkMode ? '#71767b' : '#536471',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          cursor: 'pointer',
                          fontSize: 13
                        }}>
                          <FaComment /> {post.replies}
                        </button>
                        <button style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: isDarkMode ? '#71767b' : '#536471',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          cursor: 'pointer',
                          fontSize: 13
                        }}>
                          <FaRetweet /> {post.retweets}
                        </button>
                        <button style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: isDarkMode ? '#71767b' : '#536471',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          cursor: 'pointer',
                          fontSize: 13
                        }}>
                          <FaHeart /> {post.likes}
                        </button>
                        <button style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: isDarkMode ? '#71767b' : '#536471',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          cursor: 'pointer',
                          fontSize: 13
                        }}>
                          <FaShare />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Topics - In About Course tab for enrolled, Curriculum tab for non-enrolled */}
      {((activeTab === 'about' && isCoursePurchased) || (activeTab === 'curriculum' && !isCoursePurchased)) && course.tags && course.tags.length > 0 && (
        <div style={{ padding: '0 24px 16px 24px', maxWidth: 1200, margin: '0 auto' }}>
          <h3 style={{
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 16,
            color: isDarkMode ? '#e7e9ea' : '#0f1419'
          }}>
            Topics
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {course.tags.map((tag, idx) => (
              <span key={idx} style={{
                background: isDarkMode ? '#2f3336' : '#eff3f4',
                color: isDarkMode ? '#e7e9ea' : '#0f1419',
                padding: '8px 16px',
                borderRadius: 20,
                fontSize: 14
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Course Curriculum - Full Width Below Topics */}
      {activeTab === 'curriculum' && (
        <div style={{ padding: '0 24px 24px 24px', maxWidth: 1200, margin: '0 auto' }}>
          <CourseCurriculumSection
            course={course}
            isDarkMode={isDarkMode}
            expandedModules={expandedModules}
            setExpandedModules={setExpandedModules}
          />
        </div>
      )}

      {/* BBB Video Session Modal */}
      {showBbbModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header with close button */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 20px',
            background: '#1a1a1a',
            borderBottom: '1px solid #333'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Outside Help Window Button */}
              <button
                onClick={() => setShowHelpPanel(!showHelpPanel)}
                style={{
                  background: showHelpPanel ? '#1d9bf0' : '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500,
                  transition: 'background 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                {showHelpPanel ? 'Close Outside Help Window' : 'Open Outside Help Window'}
              </button>
              <div style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>
                {course?.title} - Live Session
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button
                onClick={handleCloseBbbModal}
                style={{
                  background: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500
                }}
              >
                Leave Session
              </button>
            </div>
          </div>

          {/* Content area with BBB and sliding help panel */}
          <div style={{ flex: 1, position: 'relative', display: 'flex', overflow: 'hidden' }}>
            {/* BBB iframe or loading state */}
            {bbbJoinUrl ? (
              <iframe
                src={bbbJoinUrl}
                style={{
                  flex: 1,
                  width: '100%',
                  border: 'none',
                  transition: 'margin-right 0.3s ease'
                }}
                allow="camera; microphone; display-capture; fullscreen"
                title="BigBlueButton Session"
              />
            ) : (
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#000',
                color: '#fff',
                fontSize: 18
              }}>
                Creating meeting room...
              </div>
            )}

            {/* Sliding Help Panel - From Left */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: showHelpPanel ? 0 : -320,
              width: 320,
              height: '100%',
              background: '#1a1a1a',
              borderRight: '1px solid #333',
              transition: 'left 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 10
            }}>
              {/* Panel Header */}
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #333',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>Help Panel</span>
                <button
                  onClick={() => setShowHelpPanel(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#71767b',
                    fontSize: 20,
                    cursor: 'pointer',
                    padding: 0,
                    lineHeight: 1
                  }}
                >
                  ×
                </button>
              </div>

              {/* Panel Content - Course Feed */}
              <div style={{
                flex: 1,
                overflowY: 'auto'
              }}>
                {/* Quick Post Box */}
                <div style={{
                  padding: 12,
                  borderBottom: '1px solid #333'
                }}>
                  <div style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'flex-start'
                  }}>
                    {currentUser?.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser?.name || 'User'}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: '#1d9bf0',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 700
                      }}>
                        {getUserInitials()}
                      </div>
                    )}
                    <input
                      type="text"
                      placeholder="Ask a question..."
                      style={{
                        flex: 1,
                        background: '#2f3336',
                        border: 'none',
                        borderRadius: 16,
                        padding: '8px 12px',
                        color: '#e7e9ea',
                        fontSize: 13,
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Feed Posts */}
                {[
                  {
                    id: 1,
                    author: 'CourseEnthusiast',
                    authorAvatar: 'https://i.pravatar.cc/40?img=11',
                    content: `Just finished the first module! The content is incredibly well-structured. 🚀`,
                    timestamp: '2h',
                    likes: 24
                  },
                  {
                    id: 2,
                    author: 'LearningDaily',
                    authorAvatar: 'https://i.pravatar.cc/40?img=22',
                    content: `The instructor explains complex concepts so clearly! Highly recommend.`,
                    timestamp: '5h',
                    likes: 42
                  },
                  {
                    id: 3,
                    author: 'TechStudent2024',
                    authorAvatar: 'https://i.pravatar.cc/40?img=33',
                    content: `Question: Has anyone completed the hands-on project in Module 3? Looking for study partners!`,
                    timestamp: '1d',
                    likes: 18
                  },
                  {
                    id: 4,
                    author: 'CareerChanger',
                    authorAvatar: 'https://i.pravatar.cc/40?img=44',
                    content: `Just became a Student-Teacher for this course! 🎉 Ready to help others learn.`,
                    timestamp: '2d',
                    likes: 89
                  }
                ].map(post => (
                  <div
                    key={post.id}
                    style={{
                      padding: '12px',
                      borderBottom: '1px solid #333'
                    }}
                  >
                    <div style={{ display: 'flex', gap: 10 }}>
                      <img
                        src={post.authorAvatar}
                        alt={post.author}
                        style={{ width: 32, height: 32, borderRadius: '50%' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                          <span style={{ fontWeight: 600, color: '#e7e9ea', fontSize: 13 }}>
                            {post.author}
                          </span>
                          <span style={{ color: '#71767b', fontSize: 12 }}>· {post.timestamp}</span>
                        </div>
                        <p style={{
                          margin: '0 0 8px 0',
                          color: '#e7e9ea',
                          fontSize: 13,
                          lineHeight: 1.4
                        }}>
                          {post.content}
                        </p>
                        <div style={{ display: 'flex', gap: 16 }}>
                          <button style={{
                            background: 'none',
                            border: 'none',
                            color: '#71767b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            cursor: 'pointer',
                            fontSize: 12,
                            padding: 0
                          }}>
                            <FaComment style={{ fontSize: 11 }} /> Reply
                          </button>
                          <button style={{
                            background: 'none',
                            border: 'none',
                            color: '#71767b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            cursor: 'pointer',
                            fontSize: 12,
                            padding: 0
                          }}>
                            <FaHeart style={{ fontSize: 11 }} /> {post.likes}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default CourseDetailView;
