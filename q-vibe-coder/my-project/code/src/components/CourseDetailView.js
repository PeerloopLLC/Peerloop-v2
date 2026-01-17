import React, { useState } from 'react';
import { FaStar, FaUsers, FaClock, FaPlay, FaBook, FaCertificate, FaChalkboardTeacher, FaCheck, FaPlus, FaInfinity, FaGraduationCap, FaHeart, FaComment, FaRetweet, FaShare, FaImage, FaLink, FaPaperclip, FaVideo, FaFileAlt, FaDownload, FaExclamationTriangle } from 'react-icons/fa';
import { getInstructorById } from '../data/database';
import './MainContent.css';

/**
 * CourseDetailView Component
 * Shows detailed view of a course with tabs and two-column layout
 * Merged design: combines marketing view (pre-enrollment) with learning dashboard (post-enrollment)
 */
const CourseDetailView = ({ course, onBack, isDarkMode, followedCommunities = [], setFollowedCommunities, onViewInstructor, onEnroll, isCoursePurchased = false, currentUser, onMenuChange }) => {
  // Check if this specific course is being followed (within creator's followedCourseIds)
  const [isFollowing, setIsFollowing] = useState(() => {
    if (!course) return false;
    const creatorFollow = followedCommunities.find(c => c.instructorId === course.instructorId);
    return creatorFollow?.followedCourseIds?.includes(course.id) || false;
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [newPostText, setNewPostText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isJoiningSession, setIsJoiningSession] = useState(false);
  const [showBbbModal, setShowBbbModal] = useState(false);
  const [bbbJoinUrl, setBbbJoinUrl] = useState(null);
  const [showHelpPanel, setShowHelpPanel] = useState(false);

  // Mock enrollment data for enrolled users
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
    nextSession: { title: 'Session 4: Applications', date: 'Dec 24', time: '2:00 PM EST' },
    homeworkDue: { title: 'Session 3 Assignment', dueDate: 'Dec 23', daysLeft: 2 },
    certificateProgress: 37.5,
    newDiscussionPosts: 5
  } : null;

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!currentUser?.name) return 'U';
    return currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

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

      // On iOS/Safari, open in new tab (iframe restrictions)
      // On desktop, use the iframe modal
      if (isMobileOrSafari()) {
        window.open(data.joinUrl, '_blank');
        setIsJoiningSession(false);
      } else {
        setBbbJoinUrl(null);
        setShowBbbModal(true);
        setBbbJoinUrl(data.joinUrl);
        setIsJoiningSession(false);
      }
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
    { id: 'overview', label: 'Overview' },
    { id: 'sessions', label: 'Sessions & Progress' },
    { id: 'resources', label: 'Resources' },
    { id: 'feed', label: 'Course Feed' },
    { id: 'reviews', label: 'Reviews' }
  ] : [
    { id: 'overview', label: 'Overview' },
    { id: 'feed', label: 'Course Feed' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'reviews', label: 'Reviews' }
  ];

  return (
    <div style={{ 
      background: isDarkMode ? '#000' : '#fff', 
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <div style={{
        padding: '24px 24px 0 24px',
        borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
      }}>
        {/* Title and Actions Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 24,
          marginBottom: 20
        }}>
          {/* Title & Subtitle */}
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 8,
              color: isDarkMode ? '#e7e9ea' : '#0f1419',
              lineHeight: 1.2
            }}>
              {course.title}
            </h1>
            <p style={{
              fontSize: 16,
              color: isDarkMode ? '#71767b' : '#536471',
              margin: '0 0 8px 0'
            }}>
              {course.description?.substring(0, 80)}...
            </p>

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

            {/* Creator Link */}
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
                marginTop: isCoursePurchased ? 8 : 0
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
            {!isCoursePurchased ? (
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
              <>
                {/* Join Session Button for enrolled users */}
                <button
                  onClick={handleJoinSession}
                  disabled={isJoiningSession}
                  style={{
                    background: isDarkMode ? 'transparent' : 'white',
                    border: isDarkMode ? '1px solid #2f3336' : '1px solid #cfd9de',
                    color: isDarkMode ? '#e7e9ea' : '#0f1419',
                    padding: '10px 20px',
                    borderRadius: 20,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: isJoiningSession ? 'wait' : 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 0.2s',
                    opacity: isJoiningSession ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isJoiningSession) e.currentTarget.style.background = isDarkMode ? '#1d1f23' : '#f7f9f9';
                  }}
                  onMouseLeave={(e) => {
                    if (!isJoiningSession) e.currentTarget.style.background = isDarkMode ? 'transparent' : 'white';
                  }}
                >
                  <FaPlay style={{ fontSize: 12 }} /> {isJoiningSession ? 'Joining...' : 'Join Session'}
                </button>

                {/* Go to Community Button */}
                <button
                  onClick={() => {
                    if (onMenuChange) {
                      localStorage.setItem('pendingCommunityCreator', JSON.stringify({
                        id: `creator-${course.instructorId}`,
                        name: instructor?.name,
                        courseId: course.id,
                        courseTitle: course.title
                      }));
                      onMenuChange('My Community');
                    }
                  }}
                  style={{
                    background: isDarkMode ? 'transparent' : 'white',
                    border: isDarkMode ? '1px solid #2f3336' : '1px solid #cfd9de',
                    color: isDarkMode ? '#e7e9ea' : '#0f1419',
                    padding: '10px 20px',
                    borderRadius: 20,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDarkMode ? '#1d1f23' : '#f7f9f9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isDarkMode ? 'transparent' : 'white';
                  }}
                >
                  Go to Community
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div 
          className="course-detail-tabs"
          style={{ 
            display: 'flex', 
            gap: 0,
            flexWrap: 'wrap',
            overflow: 'hidden'
          }}
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="course-detail-tab-btn"
              style={{
                background: 'none',
                border: 'none',
                padding: '12px 16px',
                fontSize: 14,
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? (isDarkMode ? '#e7e9ea' : '#0f1419') : (isDarkMode ? '#71767b' : '#536471'),
                cursor: 'pointer',
                borderBottom: activeTab === tab.id ? '3px solid #1d9bf0' : '3px solid transparent',
                marginBottom: -1,
                whiteSpace: 'nowrap',
                flex: '1 1 auto',
                minWidth: 0
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
          {activeTab === 'overview' && (
            <>
              {/* Video Player Placeholder */}
              <div style={{
                background: isDarkMode ? '#16181c' : '#f7f9f9',
                borderRadius: 12,
                aspectRatio: '16/9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
                border: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                  <FaPlay style={{ color: '#fff', fontSize: 28, marginLeft: 4 }} />
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
                    <div style={{ width: '30%', height: '100%', background: '#fff', borderRadius: 2 }} />
                  </div>
                  <span style={{ color: '#fff', fontSize: 12 }}>0:00 / {course.duration}</span>
                </div>
              </div>

              {/* Progress Section - Only for enrolled users */}
              {isCoursePurchased && enrollmentData && (
                <div style={{ marginBottom: 32 }}>
                  <h3 style={{
                    fontSize: 18,
                    fontWeight: 700,
                    marginBottom: 16,
                    color: isDarkMode ? '#e7e9ea' : '#0f1419'
                  }}>
                    Your Progress
                  </h3>

                  {/* Progress Stats Row */}
                  <div style={{
                    display: 'flex',
                    gap: 32,
                    marginBottom: 16,
                    paddingBottom: 16,
                    borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: '#1d9bf0' }}>
                        {enrollmentData.sessionsCompleted}/{enrollmentData.totalSessions}
                      </div>
                      <div style={{ fontSize: 13, color: isDarkMode ? '#71767b' : '#536471' }}>Sessions</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: '#1d9bf0' }}>
                        {enrollmentData.homeworkCompleted}/{enrollmentData.totalHomework}
                      </div>
                      <div style={{ fontSize: 13, color: isDarkMode ? '#71767b' : '#536471' }}>Homework</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: '#1d9bf0' }}>
                        {enrollmentData.avgScore}%
                      </div>
                      <div style={{ fontSize: 13, color: isDarkMode ? '#71767b' : '#536471' }}>Avg Score</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: '#1d9bf0' }}>
                        {enrollmentData.lastActive}
                      </div>
                      <div style={{ fontSize: 13, color: isDarkMode ? '#71767b' : '#536471' }}>Last Active</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginTop: 12 }}>
                    <div style={{
                      height: 8,
                      background: isDarkMode ? '#2f3336' : '#e5e7eb',
                      borderRadius: 4,
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #1d9bf0, #10b981)',
                        borderRadius: 4,
                        width: `${enrollmentData.certificateProgress}%`
                      }} />
                    </div>
                    <p style={{
                      fontSize: 13,
                      color: isDarkMode ? '#71767b' : '#536471',
                      marginTop: 8
                    }}>
                      {enrollmentData.certificateProgress}% complete · {enrollmentData.totalSessions - enrollmentData.sessionsCompleted} sessions remaining for certificate
                    </p>
                  </div>
                </div>
              )}

              {/* Course Description */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 16,
                  color: isDarkMode ? '#e7e9ea' : '#0f1419'
                }}>
                  About This Course
                </h3>
                <p style={{
                  fontSize: 15,
                  color: isDarkMode ? '#e7e9ea' : '#0f1419',
                  lineHeight: 1.7,
                  margin: 0
                }}>
                  {course.description}
                </p>
              </div>

              {/* What You'll Learn */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ 
                  fontSize: 18, 
                  fontWeight: 700, 
                  marginBottom: 16, 
                  color: isDarkMode ? '#e7e9ea' : '#0f1419'
                }}>
                  What you'll learn
                </h3>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: 20,
                  color: isDarkMode ? '#e7e9ea' : '#0f1419'
                }}>
                  {(course.curriculum || []).slice(0, 4).map((item, idx) => {
                    const title = typeof item === 'object' ? item.title : item;
                    return (
                      <li key={idx} style={{ 
                        marginBottom: 10, 
                        fontSize: 15,
                        lineHeight: 1.5
                      }}>
                        {title}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Tags */}
              {course.tags && course.tags.length > 0 && (
                <div>
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
            </>
          )}

          {activeTab === 'curriculum' && (
            <div>
              <h3 style={{ 
                fontSize: 20, 
                fontWeight: 700, 
                marginBottom: 20, 
                color: isDarkMode ? '#e7e9ea' : '#0f1419'
              }}>
                Course Curriculum
              </h3>
              {(course.curriculum || []).map((item, idx) => {
                const title = typeof item === 'object' ? item.title : item;
                const duration = typeof item === 'object' ? item.duration : '15 min';
                return (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: 16,
                    background: isDarkMode ? '#16181c' : '#f7f9f9',
                    borderRadius: 8,
                    marginBottom: 8,
                    border: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
                  }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: '#1d9bf0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 600
                    }}>
                      {idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>{title}</div>
                    </div>
                    <span style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 14 }}>{duration}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sessions & Progress Tab - Only for enrolled users */}
          {activeTab === 'sessions' && isCoursePurchased && enrollmentData && (
            <div>
              <h3 style={{
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 20,
                color: isDarkMode ? '#e7e9ea' : '#0f1419'
              }}>
                Sessions
              </h3>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {enrollmentData.sessions.map((session, idx) => (
                  <li key={session.id} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 16,
                    padding: '16px 0',
                    borderBottom: idx < enrollmentData.sessions.length - 1 ? (isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4') : 'none'
                  }}>
                    {/* Session Number Circle */}
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 600,
                      flexShrink: 0,
                      background: session.status === 'completed' ? '#10b981' :
                                  session.status === 'upcoming' ? '#1d9bf0' :
                                  isDarkMode ? '#2f3336' : '#e5e7eb',
                      color: session.status === 'locked' ? (isDarkMode ? '#71767b' : '#9ca3af') : '#fff'
                    }}>
                      {session.status === 'completed' ? <FaCheck style={{ fontSize: 12 }} /> : idx + 1}
                    </div>

                    {/* Session Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: 600,
                        marginBottom: 4,
                        color: isDarkMode ? '#e7e9ea' : '#0f1419'
                      }}>
                        {session.title}
                      </div>
                      <div style={{
                        fontSize: 13,
                        color: isDarkMode ? '#71767b' : '#536471'
                      }}>
                        {session.date} {session.status === 'completed' ? '· Completed' : session.status === 'upcoming' ? '· Upcoming' : ''}
                      </div>
                    </div>

                    {/* Homework Status */}
                    <div style={{ textAlign: 'right' }}>
                      {session.hwScore && (
                        <span style={{
                          fontSize: 12,
                          padding: '4px 10px',
                          borderRadius: 12,
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#10b981'
                        }}>
                          HW: {session.hwScore}%
                        </span>
                      )}
                      {session.hwStatus === 'due' && (
                        <span style={{
                          fontSize: 12,
                          padding: '4px 10px',
                          borderRadius: 12,
                          background: 'rgba(245, 158, 11, 0.15)',
                          color: '#f59e0b'
                        }}>
                          HW Due: {session.hwDue}
                        </span>
                      )}
                      {session.status === 'upcoming' && (
                        <span style={{
                          fontSize: 12,
                          color: isDarkMode ? '#71767b' : '#9ca3af'
                        }}>
                          After session
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Resources Tab - Only for enrolled users */}
          {activeTab === 'resources' && isCoursePurchased && enrollmentData && (
            <div>
              <h3 style={{
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 20,
                color: isDarkMode ? '#e7e9ea' : '#0f1419'
              }}>
                Resources
              </h3>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {enrollmentData.resources.map((resource, idx) => (
                  <li key={resource.sessionId} style={{
                    padding: '12px 0',
                    borderBottom: idx < enrollmentData.resources.length - 1 ? (isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4') : 'none'
                  }}>
                    <div style={{
                      fontWeight: 600,
                      marginBottom: 8,
                      fontSize: 14,
                      color: isDarkMode ? '#e7e9ea' : '#0f1419'
                    }}>
                      {resource.sessionTitle}
                    </div>
                    <div style={{ display: 'flex', gap: 16 }}>
                      {resource.files.map((file, fileIdx) => (
                        <a
                          key={fileIdx}
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          style={{
                            color: '#1d9bf0',
                            textDecoration: 'none',
                            fontSize: 14,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                          onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                          onMouseLeave={e => e.target.style.textDecoration = 'none'}
                        >
                          {file === 'Recording' ? <FaVideo style={{ fontSize: 12 }} /> :
                           file === 'Slides' ? <FaFileAlt style={{ fontSize: 12 }} /> :
                           <FaDownload style={{ fontSize: 12 }} />}
                          {file}
                        </a>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
              <p style={{ marginTop: 16 }}>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  style={{
                    color: '#1d9bf0',
                    textDecoration: 'none',
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                  onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.target.style.textDecoration = 'none'}
                >
                  <FaDownload style={{ fontSize: 12 }} /> Download All Materials
                </a>
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⭐</div>
              <h3 style={{ color: isDarkMode ? '#e7e9ea' : '#0f1419', marginBottom: 8 }}>No Reviews Yet</h3>
              <p style={{ color: isDarkMode ? '#71767b' : '#536471' }}>Be the first to review this course!</p>
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

        {/* Right Sidebar - Hidden on Course Feed tab and on small screens */}
        {activeTab !== 'feed' && (
        <div className="course-detail-sidebar" style={{ width: 320, flexShrink: 0 }}>

          {/* Next Session Alert - Only for enrolled users */}
          {isCoursePurchased && enrollmentData?.nextSession && (
            <div style={{
              background: 'rgba(29, 155, 240, 0.1)',
              borderLeft: '3px solid #1d9bf0',
              padding: '12px 16px',
              marginBottom: 20,
              borderRadius: '0 8px 8px 0'
            }}>
              <div style={{
                fontWeight: 600,
                fontSize: 14,
                marginBottom: 4,
                color: isDarkMode ? '#e7e9ea' : '#0f1419'
              }}>
                Next Session
              </div>
              <div style={{
                fontSize: 13,
                color: isDarkMode ? '#71767b' : '#536471'
              }}>
                {enrollmentData.nextSession.title}
              </div>
              <div style={{
                fontSize: 13,
                color: isDarkMode ? '#71767b' : '#536471'
              }}>
                {enrollmentData.nextSession.date} · {enrollmentData.nextSession.time}
              </div>
              <button
                onClick={handleJoinSession}
                disabled={isJoiningSession}
                style={{
                marginTop: 10,
                background: isDarkMode ? 'transparent' : 'white',
                border: isDarkMode ? '1px solid #2f3336' : '1px solid #cfd9de',
                color: isDarkMode ? '#e7e9ea' : '#0f1419',
                padding: '8px 16px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                cursor: isJoiningSession ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                opacity: isJoiningSession ? 0.7 : 1,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!isJoiningSession) e.currentTarget.style.background = isDarkMode ? '#1d1f23' : '#f7f9f9';
              }}
              onMouseLeave={(e) => {
                if (!isJoiningSession) e.currentTarget.style.background = isDarkMode ? 'transparent' : 'white';
              }}>
                <FaPlay style={{ fontSize: 10 }} /> {isJoiningSession ? 'Joining...' : 'Join Session'}
              </button>
            </div>
          )}

          {/* Homework Due Alert - Only for enrolled users */}
          {isCoursePurchased && enrollmentData?.homeworkDue && (
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              borderLeft: '3px solid #f59e0b',
              padding: '12px 16px',
              marginBottom: 20,
              borderRadius: '0 8px 8px 0'
            }}>
              <div style={{
                fontWeight: 600,
                fontSize: 14,
                marginBottom: 4,
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                <FaExclamationTriangle style={{ fontSize: 12 }} /> Homework Due
              </div>
              <div style={{
                fontSize: 13,
                color: isDarkMode ? '#71767b' : '#536471'
              }}>
                {enrollmentData.homeworkDue.title}
              </div>
              <div style={{
                fontSize: 13,
                color: isDarkMode ? '#71767b' : '#536471'
              }}>
                Due: {enrollmentData.homeworkDue.dueDate} ({enrollmentData.homeworkDue.daysLeft} days)
              </div>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  color: '#f59e0b',
                  fontSize: 13,
                  marginTop: 8,
                  display: 'inline-block',
                  textDecoration: 'none'
                }}
                onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                onMouseLeave={e => e.target.style.textDecoration = 'none'}
              >
                Submit Homework →
              </a>
            </div>
          )}

          {/* Instructor Card */}
          <div style={{
            background: isDarkMode ? '#16181c' : '#f7f9f9',
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            border: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
          }}>
            <h4 style={{
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 16,
              color: isDarkMode ? '#71767b' : '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: 0.5
            }}>
              Instructor
            </h4>

            {instructor && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  {instructor.avatar ? (
                    <img
                      src={instructor.avatar}
                      alt={instructor.name}
                      style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: '#1d9bf0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 16,
                      fontWeight: 700
                    }}>
                      {instructorInitials}
                    </div>
                  )}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>
                      {instructor.name}
                    </div>
                    <div style={{ fontSize: 13, color: isDarkMode ? '#71767b' : '#536471' }}>
                      {instructor.title || 'Instructor'}
                    </div>
                  </div>
                </div>

                {/* Instructor Stats - for enrolled users */}
                {isCoursePurchased && (
                  <div style={{
                    display: 'flex',
                    gap: 16,
                    margin: '12px 0',
                    fontSize: 13
                  }}>
                    <span><strong style={{ color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>4.9</strong> <span style={{ color: isDarkMode ? '#71767b' : '#536471' }}>rating</span></span>
                    <span><strong style={{ color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>527</strong> <span style={{ color: isDarkMode ? '#71767b' : '#536471' }}>students</span></span>
                  </div>
                )}

                <p style={{
                  fontSize: 14,
                  color: isDarkMode ? '#9ca3af' : '#536471',
                  lineHeight: 1.5,
                  marginBottom: 12
                }}>
                  {instructor.bio?.substring(0, 120) || `Expert instructor teaching ${course.category} courses.`}...
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {isCoursePurchased ? (
                    <button style={{
                      background: '#10b981',
                      color: '#fff',
                      border: 'none',
                      padding: '10px',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}>
                      <FaCheck style={{ fontSize: 12 }} /> Joined Community
                    </button>
                  ) : null}
                  {onViewInstructor && (
                    <button
                      onClick={() => onViewInstructor(instructor.id)}
                      style={{
                        background: 'transparent',
                        border: isDarkMode ? '1px solid #536471' : '1px solid #cfd9de',
                        color: isDarkMode ? '#e7e9ea' : '#0f1419',
                        padding: '10px',
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      View All Courses
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Course Details Card */}
          <div style={{
            background: isDarkMode ? '#16181c' : '#f7f9f9',
            borderRadius: 12,
            padding: 20,
            border: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
          }}>
            <h4 style={{ 
              fontSize: 14, 
              fontWeight: 700, 
              marginBottom: 16, 
              color: isDarkMode ? '#e7e9ea' : '#0f1419',
              textTransform: 'uppercase',
              letterSpacing: 0.5
            }}>
              Course Details
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <FaBook style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 16 }} />
                <span style={{ color: isDarkMode ? '#e7e9ea' : '#0f1419', fontSize: 14 }}>
                  {course.curriculum?.length || 6} Modules
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <FaPlay style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 16 }} />
                <span style={{ color: isDarkMode ? '#e7e9ea' : '#0f1419', fontSize: 14 }}>
                  {(course.curriculum?.length || 6) * 4} Lessons
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <FaInfinity style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 16 }} />
                <span style={{ color: isDarkMode ? '#e7e9ea' : '#0f1419', fontSize: 14 }}>
                  Lifetime Access
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <FaGraduationCap style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 16 }} />
                <span style={{ color: isDarkMode ? '#e7e9ea' : '#0f1419', fontSize: 14 }}>
                  Certificate of Completion
                </span>
              </div>
              {isCoursePurchased && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <FaUsers style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 16 }} />
                  <span style={{ color: isDarkMode ? '#e7e9ea' : '#0f1419', fontSize: 14 }}>
                    Community Access
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Certificate Progress - Only for enrolled users */}
          {isCoursePurchased && enrollmentData && (
            <div style={{
              background: isDarkMode ? '#16181c' : '#f7f9f9',
              borderRadius: 12,
              padding: 20,
              marginTop: 20,
              border: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎓</div>
              <div style={{
                fontWeight: 600,
                marginBottom: 8,
                color: isDarkMode ? '#e7e9ea' : '#0f1419'
              }}>
                Certificate Progress
              </div>
              <div style={{
                height: 8,
                background: isDarkMode ? '#2f3336' : '#e5e7eb',
                borderRadius: 4,
                overflow: 'hidden',
                margin: '12px 0'
              }}>
                <div style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #1d9bf0, #10b981)',
                  borderRadius: 4,
                  width: `${enrollmentData.certificateProgress}%`
                }} />
              </div>
              <p style={{
                fontSize: 13,
                color: isDarkMode ? '#71767b' : '#536471'
              }}>
                Complete {enrollmentData.totalSessions - enrollmentData.sessionsCompleted} more sessions to earn your certificate
              </p>
            </div>
          )}

          {/* Need Extra Help - Only for enrolled users */}
          {isCoursePurchased && (
            <div style={{
              background: isDarkMode ? '#16181c' : '#f7f9f9',
              borderRadius: 12,
              padding: 20,
              marginTop: 20,
              border: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
            }}>
              <h4 style={{
                fontSize: 14,
                fontWeight: 700,
                marginBottom: 12,
                color: isDarkMode ? '#71767b' : '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}>
                Need Extra Help?
              </h4>
              <p style={{
                fontSize: 14,
                color: isDarkMode ? '#9ca3af' : '#536471',
                marginBottom: 12,
                lineHeight: 1.5
              }}>
                Book a 1-on-1 session with a Student-Teacher who completed this course
              </p>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  color: '#1d9bf0',
                  fontSize: 14,
                  textDecoration: 'none'
                }}
                onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                onMouseLeave={e => e.target.style.textDecoration = 'none'}
              >
                Browse Student-Teachers →
              </a>
            </div>
          )}

          {/* What's Included - Only for unenrolled users */}
          {!isCoursePurchased && (
            <div style={{
              background: isDarkMode ? '#16181c' : '#f7f9f9',
              borderRadius: 12,
              padding: 20,
              marginTop: 20,
              border: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
            }}>
              <h4 style={{
                fontSize: 14,
                fontWeight: 700,
                marginBottom: 16,
                color: isDarkMode ? '#71767b' : '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}>
                What's Included
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>
                  <FaCheck style={{ color: '#10b981', fontSize: 12 }} />
                  <span>{enrollmentData?.totalSessions || 8} Live Sessions with Instructor</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>
                  <FaCheck style={{ color: '#10b981', fontSize: 12 }} />
                  <span>1-on-1 Help from Student-Teachers</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>
                  <FaCheck style={{ color: '#10b981', fontSize: 12 }} />
                  <span>Community Access</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>
                  <FaCheck style={{ color: '#10b981', fontSize: 12 }} />
                  <span>Certificate of Completion</span>
                </div>
              </div>
            </div>
          )}

          {/* Price CTA - Only for unenrolled users */}
          {!isCoursePurchased && (
            <div style={{
              background: isDarkMode ? '#16181c' : '#f7f9f9',
              borderRadius: 12,
              padding: 20,
              marginTop: 20,
              border: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: 32,
                fontWeight: 700,
                color: isDarkMode ? '#e7e9ea' : '#0f1419',
                marginBottom: 8
              }}>
                {course.price}
              </div>
              <div style={{
                fontSize: 14,
                color: isDarkMode ? '#71767b' : '#536471',
                marginBottom: 16
              }}>
                One-time payment · Lifetime access
              </div>
              <button
                onClick={() => onEnroll && onEnroll(course)}
                style={{
                  width: '100%',
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  padding: '14px 24px',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginBottom: 8
                }}
              >
                Enroll Now
              </button>
              <button
                onClick={handleFollowToggle}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: isDarkMode ? '1px solid #536471' : '1px solid #cfd9de',
                  color: isDarkMode ? '#e7e9ea' : '#0f1419',
                  padding: '12px 24px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Follow Course (Free)
              </button>
            </div>
          )}

          {/* Class Discussion - Only for enrolled users */}
          {isCoursePurchased && enrollmentData && (
            <div style={{
              background: isDarkMode ? '#16181c' : '#f7f9f9',
              borderRadius: 12,
              padding: 20,
              marginTop: 20,
              border: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
            }}>
              <h4 style={{
                fontSize: 14,
                fontWeight: 700,
                marginBottom: 12,
                color: isDarkMode ? '#71767b' : '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}>
                Class Discussion
              </h4>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{
                  fontSize: 12,
                  background: 'rgba(29, 155, 240, 0.15)',
                  color: '#1d9bf0',
                  padding: '4px 10px',
                  borderRadius: 12
                }}>
                  {enrollmentData.newDiscussionPosts} new posts
                </span>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('feed');
                  }}
                  style={{
                    color: '#1d9bf0',
                    fontSize: 14,
                    textDecoration: 'none'
                  }}
                  onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.target.style.textDecoration = 'none'}
                >
                  View →
                </a>
              </div>
            </div>
          )}
        </div>
        )}
      </div>

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
