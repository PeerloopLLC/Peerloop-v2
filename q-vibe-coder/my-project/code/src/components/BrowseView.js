import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaBook, FaUser, FaSearch, FaFolder, FaPlay, FaFileAlt, FaLink } from 'react-icons/fa';
import { AiOutlineStar, AiOutlineTeam, AiOutlineClockCircle, AiOutlineBarChart } from 'react-icons/ai';
import CourseDetailView from './CourseDetailView';
import EnrollmentFlow from './EnrollmentFlow';
import { getInstructorById, getCourseById, getInstructorWithCourses, iconConfig } from '../data/database';

// Generate course abbreviation from title (matching DiscoverView.js)
const getCourseAbbreviation = (title) => {
  if (!title) return '??';
  const mappings = {
    'ai': 'AI', 'machine learning': 'ML', 'deep learning': 'DL', 'data science': 'DS',
    'full-stack': 'FS', 'full stack': 'FS', 'devops': 'DO', 'ci/cd': 'CI', 'github': 'GH',
    'node.js': 'NJ', 'nodejs': 'NJ', 'python': 'PY', 'robotics': 'RB', 'medical': 'MD',
    'healthcare': 'HC', 'automation': 'AU', 'n8n': 'N8', 'prompt': 'PM', 'claude': 'CC',
    'computer vision': 'CV', 'business intelligence': 'BI', 'microservices': 'MS',
    'cloud': 'CL', 'aws': 'AWS', 'natural language': 'NL', 'nlp': 'NL'
  };
  const lowerTitle = title.toLowerCase();
  for (const [key, abbr] of Object.entries(mappings)) {
    if (lowerTitle.includes(key)) return abbr;
  }
  const words = title.split(/[\s\-:]+/).filter(w =>
    w.length > 2 && !['the', 'and', 'for', 'with', 'to', 'of', 'in', 'a', 'an'].includes(w.toLowerCase())
  );
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return title.substring(0, 2).toUpperCase();
};

/**
 * BrowseView - Displays the Browse page with Course Listings and Creator Profiles tabs
 * Extracted from MainContent.js for better code organization
 */
const BrowseView = ({
  isDarkMode,
  currentUser,
  onMenuChange,
  // Banner color from Profile settings
  userBannerColor = localStorage.getItem('profileBannerColor') || 'blue',
  // State
  activeTopMenu,
  setActiveTopMenu,
  searchQuery,
  setSearchQuery,
  selectedCourse,
  setSelectedCourse,
  selectedInstructor,
  setSelectedInstructor,
  previousBrowseContext,
  setPreviousBrowseContext,
  creatorProfileTab,
  setCreatorProfileTab,
  currentInstructorForCourse,
  setCurrentInstructorForCourse,
  showEnrollmentFlow,
  setShowEnrollmentFlow,
  showEnrollOptions,
  setShowEnrollOptions,
  enrollingCourse,
  setEnrollingCourse,
  openCreatorFollowDropdown,
  setOpenCreatorFollowDropdown,
  isFollowingLoading,
  // Data
  indexedCourses,
  indexedInstructors,
  followedCommunities,
  setFollowedCommunities,
  purchasedCourses,
  // Handlers
  handleCoursePurchase,
  isCoursePurchased,
  isCourseFollowed,
  isCreatorFollowed,
  hasAnyCreatorCourseFollowed,
  handleFollowInstructor,
  handleFollowCourse,
  onRestoreCourseView,
  onEnrollmentComplete
}) => {
  // State for profile tabs (courses vs general content)
  const [activeProfileTab, setActiveProfileTab] = useState('courses');
  const [selectedContentItem, setSelectedContentItem] = useState(null);

  // Available banner colors (matching Profile.js)
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

  // Get the user's selected banner gradient
  const getUserBannerGradient = () => {
    const colors = bannerColorOptions[userBannerColor] || bannerColorOptions.default;
    return `linear-gradient(135deg, ${colors.start} 0%, ${colors.end} 100%)`;
  };

  // State for creator profile tabs
  const [creatorProfileSubTab, setCreatorProfileSubTab] = useState('posts');

  // Render creator profile view (like user profile format)
  const renderCreatorProfileView = () => {
    const creator = selectedInstructor;
    const creatorCourses = creator.courses
      ? creator.courses.map(c => typeof c === 'object' ? c : indexedCourses.find(course => course.id === c)).filter(Boolean)
      : [];

    // Sample posts for creators (would come from database)
    const creatorPosts = [
      {
        time: '2h ago',
        type: 'announcement',
        context: `${creator.communityName || `${creator.name} Community`} > Town Hall`,
        content: `Welcome to ${creator.communityName || 'my community'}! Ask questions, share insights, and connect with fellow learners.`,
        stats: { likes: 156, replies: 45 }
      },
      {
        time: '1d ago',
        type: 'tip',
        context: `${creator.communityName || `${creator.name} Community`} > Tips`,
        content: `Pro tip: The key to mastering any subject is consistent practice combined with peer learning. That's why I built this community!`,
        stats: { likes: 234, replies: 67 }
      },
      {
        time: '3d ago',
        type: 'update',
        context: `${creator.communityName || `${creator.name} Community`} > Updates`,
        content: `New content dropping next week! Stay tuned for advanced techniques and real-world applications.`,
        stats: { likes: 189, replies: 52 }
      }
    ];

    return (
      <div style={{ background: isDarkMode ? '#000' : '#fff', minHeight: '100vh' }}>
        {/* Back Button */}
        <div style={{
          padding: '16px',
          borderBottom: isDarkMode ? '1px solid #27272a' : '1px solid #e5e7eb',
          background: isDarkMode ? '#0a0a0a' : '#fff'
        }}>
          <button
            onClick={() => {
              localStorage.removeItem('viewingCreatorProfile');
              setSelectedInstructor(null);
              setPreviousBrowseContext(null);
              if (onMenuChange) onMenuChange('Discover');
            }}
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
            <span>←</span> Back to Discover
          </button>
        </div>

        {/* Profile Card - Twitter/X style */}
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          {/* Banner */}
          <div style={{
            height: 150,
            background: getUserBannerGradient(),
            position: 'relative'
          }} />

          {/* Profile Info */}
          <div style={{ padding: '0 16px', position: 'relative' }}>
            {/* Avatar */}
            <div style={{
              position: 'absolute',
              top: -60,
              left: 16,
              width: 120,
              height: 120,
              borderRadius: '50%',
              border: `4px solid ${isDarkMode ? '#000' : '#fff'}`,
              overflow: 'hidden',
              background: isDarkMode ? '#1a1a24' : '#f3f4f6'
            }}>
              <img
                src={creator.avatar}
                alt={creator.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Follow Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 12 }}>
              <button
                onClick={() => handleFollowInstructor(creator.id)}
                style={{
                  background: isCreatorFollowed(creator.id) ? 'transparent' : '#0f1419',
                  color: isCreatorFollowed(creator.id) ? '#0f1419' : '#fff',
                  border: isCreatorFollowed(creator.id) ? '1px solid #cfd9de' : 'none',
                  padding: '8px 16px',
                  borderRadius: 9999,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer'
                }}
              >
                {isCreatorFollowed(creator.id) ? 'Following' : 'Follow'}
              </button>
            </div>

            {/* Name, Handle, Role */}
            <div style={{ marginTop: 48 }}>
              <h1 style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 800,
                color: isDarkMode ? '#e7e9ea' : '#0f1419'
              }}>
                {creator.name}
              </h1>
              <p style={{
                margin: '2px 0 0 0',
                color: isDarkMode ? '#71767b' : '#536471',
                fontSize: 15
              }}>
                @{creator.name?.toLowerCase().replace(/\s+/g, '').replace(/\./g, '')}
              </p>
              <span style={{
                display: 'inline-block',
                marginTop: 8,
                background: '#a855f715',
                color: '#a855f7',
                padding: '4px 12px',
                borderRadius: 9999,
                fontSize: 13,
                fontWeight: 600
              }}>
                Creator
              </span>
            </div>

            {/* Bio */}
            <p style={{
              margin: '12px 0',
              fontSize: 15,
              lineHeight: 1.5,
              color: isDarkMode ? '#e7e9ea' : '#0f1419'
            }}>
              {creator.bio}
            </p>

            {/* Meta Info */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              color: isDarkMode ? '#71767b' : '#536471',
              fontSize: 15,
              marginBottom: 12
            }}>
              {creator.title && <span>💼 {creator.title}</span>}
              <span>📅 Creator since 2024</span>
            </div>

            {/* Credentials */}
            {creator.credentials && creator.credentials.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                {creator.credentials.map((cred, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    color: isDarkMode ? '#71767b' : '#536471',
                    fontSize: 14,
                    marginBottom: 4
                  }}>
                    <span style={{ color: '#22c55e' }}>✓</span>
                    <span>{cred}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Following/Followers */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
              <span style={{ cursor: 'pointer' }}>
                <span style={{ fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>
                  {creator.stats?.coursesCreated || creatorCourses.length}
                </span>
                <span style={{ color: isDarkMode ? '#71767b' : '#536471' }}> Courses</span>
              </span>
              <span style={{ cursor: 'pointer' }}>
                <span style={{ fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>
                  {(creator.stats?.studentsTaught || 0).toLocaleString()}
                </span>
                <span style={{ color: isDarkMode ? '#71767b' : '#536471' }}> Students</span>
              </span>
            </div>

            {/* Stats Row */}
            <div style={{
              display: 'flex',
              gap: 24,
              padding: '16px 0',
              borderTop: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
              borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>
                  {creatorCourses.length}
                </div>
                <div style={{ fontSize: 13, color: isDarkMode ? '#71767b' : '#536471' }}>
                  Courses Created
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>
                  {(creator.stats?.studentsTaught || 0).toLocaleString()}
                </div>
                <div style={{ fontSize: 13, color: isDarkMode ? '#71767b' : '#536471' }}>
                  Students Taught
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>
                  {creator.stats?.averageRating || '4.8'}
                </div>
                <div style={{ fontSize: 13, color: isDarkMode ? '#71767b' : '#536471' }}>
                  Rating
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
          }}>
            <div
              onClick={() => setCreatorProfileSubTab('posts')}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '16px 0',
                cursor: 'pointer',
                fontWeight: creatorProfileSubTab === 'posts' ? 700 : 500,
                color: creatorProfileSubTab === 'posts' ? (isDarkMode ? '#e7e9ea' : '#0f1419') : (isDarkMode ? '#71767b' : '#536471'),
                borderBottom: creatorProfileSubTab === 'posts' ? '2px solid #1d9bf0' : 'none'
              }}
            >
              Posts
            </div>
            <div
              onClick={() => setCreatorProfileSubTab('courses')}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '16px 0',
                cursor: 'pointer',
                fontWeight: creatorProfileSubTab === 'courses' ? 700 : 500,
                color: creatorProfileSubTab === 'courses' ? (isDarkMode ? '#e7e9ea' : '#0f1419') : (isDarkMode ? '#71767b' : '#536471'),
                borderBottom: creatorProfileSubTab === 'courses' ? '2px solid #1d9bf0' : 'none'
              }}
            >
              Courses Created
            </div>
          </div>

          {/* Tab Content */}
          <div style={{ padding: 16 }}>
            {creatorProfileSubTab === 'posts' && (
              <div>
                {creatorPosts.map((post, index) => (
                  <div key={index} style={{
                    padding: '16px 0',
                    borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
                  }}>
                    <div style={{ fontSize: 13, color: isDarkMode ? '#71767b' : '#536471', marginBottom: 4 }}>
                      {post.time}
                    </div>
                    <div style={{
                      display: 'inline-block',
                      background: post.type === 'announcement' ? '#1d9bf015' : post.type === 'tip' ? '#22c55e15' : '#f59e0b15',
                      color: post.type === 'announcement' ? '#1d9bf0' : post.type === 'tip' ? '#22c55e' : '#f59e0b',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      marginBottom: 8
                    }}>
                      {post.type === 'announcement' && '📢 ANNOUNCEMENT'}
                      {post.type === 'tip' && '💡 TIP'}
                      {post.type === 'update' && '🔔 UPDATE'}
                    </div>
                    <div style={{ fontSize: 13, color: isDarkMode ? '#71767b' : '#536471', marginBottom: 4 }}>
                      {post.context}
                    </div>
                    <div style={{ fontSize: 15, color: isDarkMode ? '#e7e9ea' : '#0f1419', marginBottom: 8 }}>
                      "{post.content}"
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 13, color: isDarkMode ? '#71767b' : '#536471' }}>
                      <span>👍 {post.stats.likes}</span>
                      <span>💬 {post.stats.replies}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {creatorProfileSubTab === 'courses' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {creatorCourses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => {
                      localStorage.removeItem('viewingCreatorProfile');
                      setSelectedCourse(course);
                      setCurrentInstructorForCourse(creator);
                    }}
                    style={{
                      padding: 16,
                      background: isDarkMode ? '#16181c' : '#f7f9f9',
                      borderRadius: 12,
                      cursor: 'pointer',
                      border: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 16, color: isDarkMode ? '#e7e9ea' : '#0f1419', marginBottom: 4 }}>
                      {course.title}
                    </div>
                    <div style={{ fontSize: 14, color: isDarkMode ? '#71767b' : '#536471', marginBottom: 8 }}>
                      {course.description?.slice(0, 100)}...
                    </div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 13, color: isDarkMode ? '#71767b' : '#536471' }}>
                      <span>★ {course.stats?.rating || '4.8'}</span>
                      <span>•</span>
                      <span>{(course.stats?.students || 1250).toLocaleString()} students</span>
                      <span>•</span>
                      <span>{course.modules?.length || 4} Modules</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render instructor profile detail view
  const renderInstructorProfile = () => {
    // Check if we're viewing a creator profile (from "Created by" click)
    const isViewingCreatorProfile = localStorage.getItem('viewingCreatorProfile') === 'true';
    if (isViewingCreatorProfile) {
      return renderCreatorProfileView();
    }
    const creator = selectedInstructor;
    const creatorCourses = creator.courses
      ? creator.courses.map(c => typeof c === 'object' ? c : indexedCourses.find(course => course.id === c)).filter(Boolean)
      : [];

    // Sample general content data (would come from database in production)
    const generalContent = {
      sections: [
        {
          id: 'getting-started',
          title: 'Getting Started',
          items: [
            { id: 'welcome', type: 'video', title: 'Welcome Video', description: 'Welcome to my community! In this video I\'ll walk you through everything you need to get started.', duration: '5:32', url: 'https://example.com/welcome' },
            { id: 'tips', type: 'video', title: 'Quick Tips', description: 'Essential tips to get the most out of this community.', duration: '3:15', url: 'https://example.com/tips' },
            { id: 'faq', type: 'file', title: 'FAQ Document', description: 'Frequently asked questions and answers.', fileType: 'PDF', url: 'https://example.com/faq.pdf' }
          ]
        },
        {
          id: 'free-resources',
          title: 'Free Resources',
          items: [
            { id: 'cheatsheet', type: 'file', title: 'Cheat Sheet', description: 'My most popular resource - quick reference guide.', fileType: 'PDF', url: 'https://example.com/cheatsheet.pdf' },
            { id: 'links', type: 'link', title: 'Useful Links', description: 'Curated collection of helpful external resources.', url: 'https://example.com/links' },
            { id: 'templates', type: 'file', title: 'Starter Templates', description: 'Ready-to-use templates to jumpstart your projects.', fileType: 'ZIP', url: 'https://example.com/templates.zip' }
          ]
        },
        {
          id: 'bonus',
          title: 'Bonus Content',
          items: [
            { id: 'behind', type: 'video', title: 'Behind the Scenes', description: 'A look at how I create my courses and content.', duration: '8:45', url: 'https://example.com/behind' },
            { id: 'updates', type: 'video', title: 'Community Updates', description: 'Latest news and upcoming content announcements.', duration: '4:20', url: 'https://example.com/updates' }
          ]
        }
      ]
    };

    // Set default selected content item
    if (!selectedContentItem && generalContent.sections.length > 0 && generalContent.sections[0].items.length > 0) {
      // Don't set here to avoid render loop - will set on tab click
    }

    return (
      <div style={{ background: isDarkMode ? '#000' : '#f8fafc', minHeight: '100vh', padding: '0' }}>
        {/* Back Button - Prominent */}
        <div style={{
          padding: '16px',
          borderBottom: isDarkMode ? '1px solid #27272a' : '1px solid #e5e7eb',
          background: isDarkMode ? '#0a0a0a' : '#fff'
        }}>
          <button
            onClick={() => {
              setCreatorProfileTab('courses');
              if (previousBrowseContext?.type === 'discover') {
                // Navigate back to Discover
                setSelectedInstructor(null);
                setPreviousBrowseContext(null);
                if (onMenuChange) onMenuChange('Discover');
              } else if (previousBrowseContext?.type === 'feeds') {
                // Navigate back to Feeds - restore the community they were viewing
                if (previousBrowseContext.community) {
                  localStorage.setItem('pendingCommunityCreator', JSON.stringify(previousBrowseContext.community));
                }
                setSelectedInstructor(null);
                setPreviousBrowseContext(null);
                if (onMenuChange) onMenuChange('My Community');
              } else if (previousBrowseContext?.type === 'my-courses') {
                // Navigate back to My Courses
                setSelectedInstructor(null);
                setPreviousBrowseContext(null);
                if (onMenuChange) onMenuChange('My Courses');
              } else if (previousBrowseContext?.type === 'course' && previousBrowseContext.course) {
                // Restore the course view in MainContent (PurchasedCourseDetail)
                setSelectedInstructor(null);
                setPreviousBrowseContext(null);
                if (onRestoreCourseView) {
                  onRestoreCourseView(previousBrowseContext.course);
                }
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
            {previousBrowseContext?.type === 'course' ? 'Back to Course' : previousBrowseContext?.type === 'courseList' ? 'Back to Courses' : previousBrowseContext?.type === 'discover' ? 'Back to Discover' : previousBrowseContext?.type === 'feeds' ? 'Back to Feeds' : previousBrowseContext?.type === 'my-courses' ? 'Back to My Courses' : 'Back'}
          </button>
        </div>

        {/* Creator Header with Action Buttons - Floating Card */}
        <div style={{
          background: isDarkMode ? '#0a0a0a' : getUserBannerGradient(),
          borderRadius: 16,
          padding: '20px',
          margin: '12px 16px',
          position: 'relative',
          zIndex: 1,
          border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: isDarkMode
            ? '0 0 0 1px rgba(255, 255, 255, 0.05), 0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 30px 60px -15px rgba(0, 0, 0, 0.6)'
            : '0 4px 12px rgba(0, 0, 0, 0.08)'
        }}>
          {/* Top Row: Avatar + Name + Buttons */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
            {/* Community Circle Avatar */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                border: '3px solid rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                flexShrink: 0
              }}
            >
              👥
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>{creator.communityName || `${creator.name} Community`}</h1>
                <span style={{ background: isDarkMode ? 'rgba(29, 155, 240, 0.2)' : '#e0f2fe', color: '#1d9bf0', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 12 }}>COMMUNITY</span>
              </div>
              <p style={{ margin: '2px 0 0 0', color: isDarkMode ? '#71767b' : '#536471', fontSize: 17 }}>{creator.title}</p>
              {/* Inline Stats */}
              <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: 17, color: isDarkMode ? '#71767b' : '#536471', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><AiOutlineStar /> {creator.stats?.averageRating || '4.8'}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><AiOutlineTeam /> {(creator.stats?.studentsTaught || 0).toLocaleString()} students</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FaBook style={{ fontSize: 14 }} /> {creator.stats?.coursesCreated || creatorCourses.length} courses</span>
              </div>
            </div>

            {/* Action Buttons - Top Right */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              {/* Go to Community Link */}
              <span
                onClick={() => {
                  localStorage.setItem('pendingCommunityCreator', JSON.stringify({
                    id: `creator-${creator.id}`,
                    name: creator.name
                  }));
                  if (onMenuChange) onMenuChange('My Community');
                }}
                style={{
                  color: '#fff',
                  fontWeight: 500,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.7';
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                Go to Community
              </span>

              {/* Follow Button */}
              {(() => {
                const purchasedCreatorCourses = creatorCourses.filter(course => isCoursePurchased(course.id));
                const hasPurchasedCourses = purchasedCreatorCourses.length > 0;
                const isFollowing = isCreatorFollowed(creator.id);

                if (!hasPurchasedCourses) {
                  return (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollowInstructor(creator.id);
                      }}
                      disabled={isFollowingLoading}
                      style={{
                        background: '#1d9bf0',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: 20,
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {isFollowing ? 'Joined Community' : 'Join Community'}
                    </button>
                  );
                }

                return (
                  <div className="creator-follow-dropdown-wrapper" style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCreatorFollowDropdown(openCreatorFollowDropdown === `detail-${creator.id}` ? null : `detail-${creator.id}`);
                      }}
                      disabled={isFollowingLoading}
                      style={{
                        background: '#1d9bf0',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: 20,
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {isFollowing ? 'Joined Community' : 'Join Community'}
                      <span style={{ fontSize: 10 }}>▼</span>
                    </button>

                    {openCreatorFollowDropdown === `detail-${creator.id}` && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
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
                            color: isFollowing ? '#f4212e' : '#1d9bf0',
                            fontWeight: 500,
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
                          {isFollowing ? 'Leave Community' : 'Join Community'}
                        </button>
                        <div style={{ borderTop: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4', margin: '4px 0' }} />
                        {purchasedCreatorCourses.map(course => {
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
                                color: isFollowed ? '#1d9bf0' : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                                fontWeight: isFollowed ? 500 : 400
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleFollowCourse(course.id);
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#f8fafc'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</span>
                              {isFollowed && <span>✓</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Bio */}
          {creator.bio && (
            <p style={{
              margin: '0 0 12px 0',
              color: isDarkMode ? '#e7e9ea' : '#0f1419',
              fontSize: 17,
              lineHeight: 1.5
            }}>
              {creator.bio}
            </p>
          )}

          {/* Credentials */}
          {creator.qualifications && creator.qualifications.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {creator.qualifications.slice(0, 3).map((qual, index) => (
                <span key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 17,
                  color: isDarkMode ? '#71767b' : '#536471'
                }}>
                  <span style={{ color: '#1d9bf0' }}>✓</span>
                  {qual.sentence}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tab Menu Header */}
        <div style={{
          display: 'flex',
          gap: 0,
          borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
          background: isDarkMode ? '#000' : '#fff'
        }}>
          {/* Courses Tab */}
          <button
            onClick={() => setActiveProfileTab('courses')}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 16px',
              fontSize: 14,
              fontWeight: activeProfileTab === 'courses' ? 700 : 500,
              color: activeProfileTab === 'courses' ? (isDarkMode ? '#e7e9ea' : '#0f1419') : (isDarkMode ? '#71767b' : '#536471'),
              cursor: 'pointer',
              borderBottom: activeProfileTab === 'courses' ? '3px solid #1d9bf0' : '3px solid transparent',
              marginBottom: -1
            }}
          >
            Courses
          </button>

          {/* General Content Tab */}
          <button
            onClick={() => {
              setActiveProfileTab('general-content');
              if (!selectedContentItem && generalContent.sections.length > 0 && generalContent.sections[0].items.length > 0) {
                setSelectedContentItem(generalContent.sections[0].items[0]);
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 16px',
              fontSize: 14,
              fontWeight: activeProfileTab === 'general-content' ? 700 : 500,
              color: activeProfileTab === 'general-content' ? (isDarkMode ? '#e7e9ea' : '#0f1419') : (isDarkMode ? '#71767b' : '#536471'),
              cursor: 'pointer',
              borderBottom: activeProfileTab === 'general-content' ? '3px solid #1d9bf0' : '3px solid transparent',
              marginBottom: -1
            }}
          >
            Content
          </button>
        </div>

        {/* Courses Tab Content - With Connector Lines (matching Discover design) */}
        {activeProfileTab === 'courses' && (
          <div style={{
            position: 'relative',
            padding: '8px 20px 12px'
          }}>
            {creatorCourses.length > 0 ? (
              <>
                {/* Vertical Connector Line */}
                <div style={{
                  position: 'absolute',
                  left: 28,
                  top: 0,
                  bottom: 24,
                  width: 2,
                  background: isDarkMode ? '#2f3336' : '#d0e8f0'
                }} />

                {/* Course Cards */}
                {creatorCourses.map((course, index) => {
                  const isFollowed = isCourseFollowed(course.id);

                  return (
                    <div
                      key={course.id}
                      style={{
                        position: 'relative',
                        marginLeft: 20,
                        marginBottom: index < creatorCourses.length - 1 ? 8 : 0
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
                        onClick={() => {
                          setSelectedCourse(course);
                          setCurrentInstructorForCourse(creator);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 12,
                          padding: 12,
                          border: isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb',
                          borderRadius: 12,
                          background: isDarkMode ? '#16181c' : '#f7f9f9',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#22c55e';
                          e.currentTarget.style.background = isDarkMode ? '#1d1f23' : '#eff3f4';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = isDarkMode ? '#2f3336' : '#e5e7eb';
                          e.currentTarget.style.background = isDarkMode ? '#16181c' : '#f7f9f9';
                        }}
                      >
                        {/* Course Badge - Green Square */}
                        <div style={{
                          width: 56,
                          height: 56,
                          borderRadius: 10,
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                          color: 'white',
                          fontSize: 16,
                          fontWeight: 700
                        }}>
                          {getCourseAbbreviation(course.title)}
                        </div>

                        {/* Course Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {/* Course Title - Blue */}
                          <div style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: '#1d9bf0',
                            marginBottom: 4
                          }}>
                            {course.title}
                          </div>
                          {/* Course Description */}
                          <div style={{
                            fontSize: 14,
                            color: isDarkMode ? '#a0a0a0' : '#536471',
                            lineHeight: 1.4,
                            marginBottom: 6,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {course.description}
                          </div>
                          {/* Stats Line */}
                          <div style={{
                            fontSize: 14,
                            color: isDarkMode ? '#71767b' : '#6b7280',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4
                          }}>
                            <span style={{ color: '#fbbf24' }}>★</span> {course.rating || '4.7'} · {(course.students || 980).toLocaleString()} students · {course.duration || '6 weeks'}
                          </div>
                        </div>

                        {/* Buttons */}
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {isCoursePurchased(course.id) ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFollowCourse(course.id);
                              }}
                              disabled={isFollowingLoading}
                              style={{
                                background: 'white',
                                border: '1px solid #0f1419',
                                color: '#0f1419',
                                padding: '8px 16px',
                                borderRadius: 20,
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s'
                              }}
                            >
                              {isFollowed ? 'Following Course' : 'Follow Course'}
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEnrollingCourse(course);
                                setShowEnrollOptions(true);
                              }}
                              style={{
                                background: '#22c55e',
                                border: 'none',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: 20,
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#16a34a';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#22c55e';
                              }}
                            >
                              Enroll {course.price}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: isDarkMode ? '#71767b' : '#536471' }}>
                No courses available yet.
              </div>
            )}
          </div>
        )}

        {/* General Content Tab Content */}
        {activeProfileTab === 'general-content' && (
          <div style={{
            display: 'flex',
            minHeight: 400,
            borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #e2e8f0'
          }}>
            {/* Left Navigation - Content List */}
            <div style={{
              width: 280,
              borderRight: isDarkMode ? '1px solid #2f3336' : '1px solid #e2e8f0',
              background: isDarkMode ? '#0a0a0a' : '#f8fafc',
              overflowY: 'auto'
            }}>
              {generalContent.sections.map((section) => (
                <div key={section.id}>
                  {/* Section Header */}
                  <div style={{
                    padding: '12px 16px',
                    fontSize: 12,
                    fontWeight: 700,
                    color: isDarkMode ? '#71767b' : '#536471',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #e2e8f0'
                  }}>
                    {section.title}
                  </div>
                  {/* Section Items */}
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedContentItem(item)}
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        background: selectedContentItem?.id === item.id
                          ? (isDarkMode ? '#1d1f23' : '#e0f2fe')
                          : 'transparent',
                        borderLeft: selectedContentItem?.id === item.id
                          ? '3px solid #1d9bf0'
                          : '3px solid transparent',
                        transition: 'all 0.15s'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedContentItem?.id !== item.id) {
                          e.currentTarget.style.background = isDarkMode ? '#16181c' : '#f1f5f9';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedContentItem?.id !== item.id) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      {/* Icon based on type */}
                      {item.type === 'video' && <FaPlay style={{ fontSize: 12, color: '#1d9bf0', flexShrink: 0 }} />}
                      {item.type === 'file' && <FaFileAlt style={{ fontSize: 12, color: '#10b981', flexShrink: 0 }} />}
                      {item.type === 'link' && <FaLink style={{ fontSize: 12, color: '#8b5cf6', flexShrink: 0 }} />}
                      <span style={{
                        fontSize: 14,
                        color: selectedContentItem?.id === item.id
                          ? '#1d9bf0'
                          : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                        fontWeight: selectedContentItem?.id === item.id ? 600 : 400,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Right Content Display */}
            <div style={{
              flex: 1,
              padding: 24,
              background: isDarkMode ? '#000' : '#fff',
              overflowY: 'auto'
            }}>
              {selectedContentItem ? (
                <div>
                  {/* Content Title */}
                  <h2 style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: isDarkMode ? '#e7e9ea' : '#0f1419',
                    marginBottom: 16
                  }}>
                    {selectedContentItem.title}
                  </h2>

                  {/* Video Player (for video type) */}
                  {selectedContentItem.type === 'video' && (
                    <div style={{
                      width: '100%',
                      aspectRatio: '16/9',
                      background: isDarkMode ? '#16181c' : '#f1f5f9',
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16,
                      border: isDarkMode ? '1px solid #2f3336' : '1px solid #e2e8f0'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <FaPlay style={{ fontSize: 48, color: '#1d9bf0', marginBottom: 8 }} />
                        <div style={{ fontSize: 14, color: isDarkMode ? '#71767b' : '#536471' }}>
                          Duration: {selectedContentItem.duration}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* File Download (for file type) */}
                  {selectedContentItem.type === 'file' && (
                    <div style={{
                      padding: 24,
                      background: isDarkMode ? '#16181c' : '#f1f5f9',
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      marginBottom: 16,
                      border: isDarkMode ? '1px solid #2f3336' : '1px solid #e2e8f0'
                    }}>
                      <FaFileAlt style={{ fontSize: 40, color: '#10b981' }} />
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>
                          {selectedContentItem.title}
                        </div>
                        <div style={{ fontSize: 14, color: isDarkMode ? '#71767b' : '#536471' }}>
                          {selectedContentItem.fileType} File
                        </div>
                      </div>
                      <button style={{
                        marginLeft: 'auto',
                        background: '#10b981',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: 8,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}>
                        Download
                      </button>
                    </div>
                  )}

                  {/* Link (for link type) */}
                  {selectedContentItem.type === 'link' && (
                    <div style={{
                      padding: 24,
                      background: isDarkMode ? '#16181c' : '#f1f5f9',
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      marginBottom: 16,
                      border: isDarkMode ? '1px solid #2f3336' : '1px solid #e2e8f0'
                    }}>
                      <FaLink style={{ fontSize: 40, color: '#8b5cf6' }} />
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>
                          {selectedContentItem.title}
                        </div>
                        <div style={{ fontSize: 14, color: '#1d9bf0' }}>
                          {selectedContentItem.url}
                        </div>
                      </div>
                      <button style={{
                        marginLeft: 'auto',
                        background: '#8b5cf6',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: 8,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}>
                        Open Link
                      </button>
                    </div>
                  )}

                  {/* Description */}
                  <p style={{
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: isDarkMode ? '#a1a1aa' : '#4b5563'
                  }}>
                    {selectedContentItem.description}
                  </p>
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: isDarkMode ? '#71767b' : '#536471'
                }}>
                  Select an item from the left to view its content
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render instructor summary list (Creator Profiles tab)
  const renderInstructorSummary = () => {
    const filteredInstructors = indexedInstructors.filter(instructor =>
      instructor.searchIndex.includes(searchQuery.toLowerCase())
    );

    return (
      <div className="creators-feed" style={{ padding: 0, margin: 0 }}>
        {filteredInstructors.map(creator => {
          return (
            <div key={creator.id} className="creator-card" onClick={() => {
              const fullCreatorData = getInstructorWithCourses(creator.id);
              setPreviousBrowseContext({ type: 'creatorList' });
              setSelectedInstructor(fullCreatorData || creator);
            }} style={{
              background: isDarkMode ? '#000' : '#fff',
              borderRadius: 0,
              padding: '14px 16px',
              marginBottom: 0,
              border: 'none',
              borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              gap: 12
            }}>
              {/* Left Box - Profile Card */}
              <div style={{
                background: isDarkMode ? '#16181c' : '#f8fafc',
                borderRadius: 12,
                padding: '12px',
                width: 135,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                border: isDarkMode ? '1px solid #2f3336' : '1px solid #e2e8f0'
              }} onClick={e => e.stopPropagation()}>
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: 8,
                    border: '2px solid #1d9bf0'
                  }}
                />
                <div style={{
                  fontWeight: 700,
                  fontSize: 13,
                  color: isDarkMode ? '#e7e9ea' : '#0f1419',
                  marginBottom: 1,
                  lineHeight: 1.2
                }}>
                  {creator.name}
                </div>
                <div style={{
                  color: isDarkMode ? '#9ca3af' : '#536471',
                  fontSize: 10,
                  marginBottom: 8,
                  lineHeight: 1.3
                }}>
                  {creator.title?.split(' ').slice(0, 4).join(' ')}
                </div>

                {/* Follow Button */}
                {(() => {
                  const creatorData = getInstructorWithCourses(creator.id);
                  const courses = creatorData?.courses || [];
                  const purchasedCreatorCourses = courses.filter(course => isCoursePurchased(course.id));
                  const hasPurchasedCourses = purchasedCreatorCourses.length > 0;
                  const isFollowing = isCreatorFollowed(creator.id);

                  if (!hasPurchasedCourses) {
                    return (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollowInstructor(creator.id);
                        }}
                        disabled={isFollowingLoading}
                        style={{
                          background: isFollowing ? 'transparent' : '#1d9bf0',
                          color: isFollowing ? '#1d9bf0' : '#fff',
                          border: isFollowing ? '1px solid #1d9bf0' : 'none',
                          padding: '6px 16px',
                          borderRadius: 20,
                          fontWeight: 600,
                          fontSize: 12,
                          cursor: 'pointer',
                          width: '100%'
                        }}
                      >
                        {isFollowing ? 'Joined Community' : 'Join Community'}
                      </button>
                    );
                  }

                  return (
                    <div className="creator-follow-dropdown-wrapper" style={{ position: 'relative', width: '100%' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenCreatorFollowDropdown(openCreatorFollowDropdown === creator.id ? null : creator.id);
                        }}
                        disabled={isFollowingLoading}
                        style={{
                          background: isFollowing ? 'transparent' : '#1d9bf0',
                          color: isFollowing ? '#1d9bf0' : '#fff',
                          border: isFollowing ? '1px solid #1d9bf0' : 'none',
                          padding: '6px 12px',
                          borderRadius: 20,
                          fontWeight: 600,
                          fontSize: 12,
                          cursor: 'pointer',
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 4
                        }}
                      >
                        {isFollowing ? 'Joined Community' : 'Join Community'}
                        <span style={{ fontSize: 8 }}>▼</span>
                      </button>
                      {openCreatorFollowDropdown === creator.id && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          marginTop: 4,
                          background: isDarkMode ? '#16181c' : '#fff',
                          border: isDarkMode ? '1px solid #2f3336' : '1px solid #e2e8f0',
                          borderRadius: 8,
                          boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                          zIndex: 1000,
                          minWidth: 160,
                          padding: '4px 0'
                        }}>
                          <button
                            type="button"
                            style={{
                              padding: '8px 12px',
                              cursor: 'pointer',
                              fontSize: 12,
                              color: isFollowing ? '#dc2626' : '#1d9bf0',
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
                            {isFollowing ? 'Leave Community' : 'Join Community'}
                          </button>
                          <div style={{ borderTop: isDarkMode ? '1px solid #2f3336' : '1px solid #f1f5f9' }}>
                            {purchasedCreatorCourses.map(course => {
                              const isFollowed = isCourseFollowed(course.id);
                              return (
                                <div
                                  key={course.id}
                                  style={{
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    fontSize: 11,
                                    color: isFollowed ? '#1d9bf0' : (isDarkMode ? '#e7e9ea' : '#475569'),
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFollowCourse(course.id);
                                  }}
                                >
                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</span>
                                  {isFollowed && <span>✓</span>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Right Side - About the Community */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 600, color: isDarkMode ? '#f3f4f6' : '#0f1419', marginBottom: 1 }}>
                      About the Community
                    </div>
                    <div style={{ fontSize: 15, color: isDarkMode ? '#d1d5db' : '#536471' }}>
                      {creator.title}
                    </div>
                  </div>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      localStorage.setItem('pendingCommunityCreator', JSON.stringify({
                        id: `creator-${creator.id}`,
                        name: creator.name
                      }));
                      if (onMenuChange) onMenuChange('My Community');
                    }}
                    style={{
                      color: '#1d9bf0',
                      fontWeight: 500,
                      fontSize: 13,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Go to Community
                  </span>
                </div>

                {/* Bio */}
                <div style={{
                  color: isDarkMode ? '#e5e7eb' : '#4b5563',
                  fontSize: 16,
                  lineHeight: 1.4,
                  marginBottom: 8,
                  fontStyle: 'italic'
                }}>
                  "{creator.bio}"
                </div>

                {/* Tags */}
                {creator.expertise && creator.expertise.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                    {creator.expertise.slice(0, 4).map((tag, idx) => (
                      <span key={idx} style={{
                        background: isDarkMode ? '#2f3336' : '#e5e7eb',
                        color: isDarkMode ? '#d1d5db' : '#4b5563',
                        padding: '3px 8px',
                        borderRadius: 12,
                        fontSize: 13,
                        fontWeight: 500
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 14, color: isDarkMode ? '#d1d5db' : '#536471' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <AiOutlineTeam style={{ fontSize: 14 }} />
                    {(creator.stats?.studentsTaught || 0).toLocaleString()}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <AiOutlineStar style={{ fontSize: 14 }} />
                    {creator.stats?.averageRating || 0}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FaBook style={{ fontSize: 11 }} />
                    {creator.stats?.coursesCreated || 0} courses
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Hide search bar when viewing instructor profile from Discover (show just the back button header)
  const hideSearchBar = selectedInstructor && previousBrowseContext?.type === 'discover';

  return (
    <div className="main-content">
      <div className="three-column-layout browse-layout">
        <div className="center-column">
          {/* Centered Search Bar - Hidden when viewing instructor from Discover */}
          {!hideSearchBar && (
          <div style={{
            padding: '24px 16px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: isDarkMode ? '#000' : '#fff',
            borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: 480
            }}>
              <FaSearch style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: isDarkMode ? '#71767b' : '#536471',
                fontSize: 18
              }} />
              <input
                type="text"
                placeholder={activeTopMenu === 'courses' ? 'Search for Courses' : 'Search for Communities'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 48px',
                  fontSize: 16,
                  border: isDarkMode ? '2px solid #2f3336' : '2px solid #e2e8f0',
                  borderRadius: 9999,
                  background: isDarkMode ? '#16181c' : '#f7f9fa',
                  color: isDarkMode ? '#e7e9ea' : '#0f1419',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1d9bf0';
                  e.target.style.boxShadow = '0 0 0 4px rgba(29, 155, 240, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDarkMode ? '#2f3336' : '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
          )}
          <div className="browse-content">
            {/* Show Enrollment Flow when active */}
            {showEnrollmentFlow && enrollingCourse ? (
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
                  const purchasedCourse = enrollingCourse;
                  setEnrollingCourse(null);
                  // Use callback to navigate to My Courses with course detail
                  // Pass both course and booking so session can be saved
                  if (onEnrollmentComplete) {
                    onEnrollmentComplete(purchasedCourse, booking);
                  } else {
                    onMenuChange('My Courses');
                  }
                }}
              />
            ) : activeTopMenu === 'courses' ? (
              <div className="courses-section">
                {selectedCourse ? (
                  <CourseDetailView
                    course={getCourseById(selectedCourse.id)}
                    onBack={() => setSelectedCourse(null)}
                    isDarkMode={isDarkMode}
                    followedCommunities={followedCommunities}
                    setFollowedCommunities={setFollowedCommunities}
                    isCoursePurchased={isCoursePurchased(selectedCourse.id)}
                    currentUser={currentUser}
                    onViewInstructor={(instructorId) => {
                      const instructor = getInstructorById(instructorId);
                      if (instructor) {
                        setSelectedInstructor(instructor);
                        setActiveTopMenu('creators');
                      }
                    }}
                    onEnroll={(course) => {
                      setEnrollingCourse(course);
                      setShowEnrollOptions(true);
                    }}
                  />
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
                        return (
                          <div
                            key={course.id}
                            className="course-post"
                            onClick={() => setSelectedCourse(course)}
                            style={{
                              background: isDarkMode ? '#16181c' : '#fff',
                              borderRadius: 16,
                              border: isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb',
                              padding: 0,
                              marginBottom: 0,
                              cursor: 'pointer',
                              overflow: 'hidden',
                              display: 'flex',
                              flexDirection: 'row'
                            }}
                          >
                            {/* Left Column - Course Info */}
                            <div style={{ flex: 1, padding: 16, minWidth: 0 }}>
                              {/* Badge */}
                              {course.badge && (
                                <span style={{
                                  display: 'inline-block',
                                  background: course.badge === 'Bestseller' ? '#fef3c7' :
                                             course.badge === 'Popular' ? '#dbeafe' :
                                             course.badge === 'New' ? '#dcfce7' :
                                             course.badge === 'Featured' ? '#f3e8ff' : '#f3f4f6',
                                  color: course.badge === 'Bestseller' ? '#92400e' :
                                         course.badge === 'Popular' ? '#1e40af' :
                                         course.badge === 'New' ? '#166534' :
                                         course.badge === 'Featured' ? '#7c3aed' : '#374151',
                                  padding: '4px 10px',
                                  borderRadius: 4,
                                  fontSize: 11,
                                  fontWeight: 700,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                  marginBottom: 8
                                }}>
                                  {course.badge}
                                </span>
                              )}

                              {/* Title */}
                              <h3 style={{
                                fontSize: 18,
                                fontWeight: 700,
                                color: isDarkMode ? '#e7e9ea' : '#111827',
                                margin: '0 0 4px 0',
                                lineHeight: 1.3
                              }}>
                                {course.title}
                              </h3>

                              {/* Instructor + Duration + Go to Community */}
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                fontSize: 14,
                                color: isDarkMode ? '#9ca3af' : '#6b7280',
                                marginBottom: 8
                              }}>
                                <span
                                  onClick={e => {
                                    e.stopPropagation();
                                    const fullCreatorData = getInstructorWithCourses(course.instructorId);
                                    setPreviousBrowseContext({ type: 'courseList' });
                                    setSelectedInstructor(fullCreatorData || instructorData);
                                    setActiveTopMenu('instructors');
                                  }}
                                  style={{ cursor: 'pointer' }}
                                  onMouseEnter={e => e.target.style.color = '#1d9bf0'}
                                  onMouseLeave={e => e.target.style.color = isDarkMode ? '#9ca3af' : '#6b7280'}
                                >
                                  {instructorData?.name}
                                </span>
                                <span>·</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <AiOutlineClockCircle style={{ fontSize: 14 }} />
                                  {course.duration}
                                </span>
                                {isCoursePurchased(course.id) && (
                                  <>
                                    <span>·</span>
                                    <span
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        localStorage.setItem('pendingCommunityCreator', JSON.stringify({
                                          id: `creator-${course.instructorId}`,
                                          name: instructorData?.name || 'Community',
                                          courseId: course.id,
                                          courseTitle: course.title
                                        }));
                                        if (onMenuChange) onMenuChange('My Community');
                                      }}
                                      style={{
                                        color: '#10b981',
                                        cursor: 'pointer',
                                        fontWeight: 500
                                      }}
                                      onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                                      onMouseLeave={e => e.target.style.textDecoration = 'none'}
                                    >
                                      Go to Community →
                                    </span>
                                  </>
                                )}
                              </div>

                              {/* Description */}
                              <p style={{
                                fontSize: 15,
                                lineHeight: 1.6,
                                color: isDarkMode ? '#d1d5db' : '#374151',
                                margin: '0 0 10px 0',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {course.description}
                              </p>

                              {/* Stats Row */}
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 16,
                                flexWrap: 'wrap'
                              }}>
                                {/* Rating Stars */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                  {[...Array(5)].map((_, i) => (
                                    <AiOutlineStar
                                      key={i}
                                      style={{
                                        color: i < Math.floor(course.rating) ? '#fbbf24' : (isDarkMode ? '#4b5563' : '#d1d5db'),
                                        fontSize: 16
                                      }}
                                    />
                                  ))}
                                  <span style={{
                                    marginLeft: 4,
                                    fontSize: 14,
                                    color: isDarkMode ? '#9ca3af' : '#6b7280'
                                  }}>
                                    {course.rating})
                                  </span>
                                </div>

                                {/* Students */}
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  fontSize: 14,
                                  color: isDarkMode ? '#9ca3af' : '#6b7280'
                                }}>
                                  <AiOutlineTeam style={{ fontSize: 16 }} />
                                  {course.students?.toLocaleString()} students
                                </div>

                                {/* Level Badge */}
                                <span style={{
                                  background: isDarkMode ? '#374151' : '#e0f2fe',
                                  color: isDarkMode ? '#9ca3af' : '#0369a1',
                                  padding: '4px 12px',
                                  borderRadius: 20,
                                  fontSize: 12,
                                  fontWeight: 500
                                }}>
                                  {course.level || 'Intermediate'}
                                </span>
                              </div>
                            </div>

                            {/* Right Column - About the Community */}
                            <div
                              className="course-card-creator-sidebar"
                              style={{
                                width: 280,
                                flexShrink: 0,
                                padding: 24,
                                background: isDarkMode ? '#1f2937' : '#f9fafb',
                                borderLeft: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                                display: 'flex',
                                flexDirection: 'column'
                              }}>
                              <h4 style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: isDarkMode ? '#9ca3af' : '#6b7280',
                                margin: '0 0 12px 0',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}>
                                About the Community
                              </h4>

                              {/* Bio Quote */}
                              <p style={{
                                fontSize: 14,
                                lineHeight: 1.5,
                                color: isDarkMode ? '#d1d5db' : '#374151',
                                fontStyle: 'italic',
                                margin: '0 0 16px 0',
                                display: '-webkit-box',
                                WebkitLineClamp: 4,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                "{instructorData?.bio || 'Expert instructor dedicated to helping students master new skills and advance their careers.'}"
                              </p>

                              {/* Creator Info */}
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                marginTop: 'auto'
                              }}>
                                <img
                                  src={instructorData?.avatar}
                                  alt={instructorData?.name}
                                  style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: isDarkMode ? '2px solid #374151' : '2px solid #e5e7eb'
                                  }}
                                  onClick={e => {
                                    e.stopPropagation();
                                    const fullCreatorData = getInstructorWithCourses(course.instructorId);
                                    setPreviousBrowseContext({ type: 'courseList' });
                                    setSelectedInstructor(fullCreatorData || instructorData);
                                    setActiveTopMenu('instructors');
                                  }}
                                />
                                <div>
                                  <div style={{
                                    fontWeight: 600,
                                    fontSize: 15,
                                    color: isDarkMode ? '#e7e9ea' : '#111827'
                                  }}>
                                    {instructorData?.name}
                                  </div>
                                  <div style={{
                                    fontSize: 13,
                                    color: isDarkMode ? '#9ca3af' : '#6b7280',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                  }}>
                                    {instructorData?.title || 'Expert Instructor'}
                                  </div>
                                </div>
                              </div>

                              {/* Follow Creator Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const creatorCommunityId = `creator-${instructorData?.id}`;
                                  const isCurrentlyFollowed = followedCommunities.some(c => c.id === creatorCommunityId);

                                  if (isCurrentlyFollowed) {
                                    setFollowedCommunities(prev => prev.filter(c => c.id !== creatorCommunityId));
                                  } else {
                                    const courseIds = instructorData?.courses || [];
                                    setFollowedCommunities(prev => [...prev, {
                                      id: creatorCommunityId,
                                      type: 'creator',
                                      name: instructorData?.name,
                                      instructorId: instructorData?.id,
                                      instructorName: instructorData?.name,
                                      courseIds: courseIds,
                                      followedCourseIds: [],
                                      description: instructorData?.bio,
                                      avatar: instructorData?.avatar
                                    }]);
                                  }
                                }}
                                style={{
                                  marginTop: 12,
                                  padding: '8px 20px',
                                  borderRadius: 20,
                                  background: followedCommunities.some(c => c.id === `creator-${instructorData?.id}`)
                                    ? 'transparent'
                                    : '#1d9bf0',
                                  color: followedCommunities.some(c => c.id === `creator-${instructorData?.id}`)
                                    ? '#1d9bf0'
                                    : '#fff',
                                  fontSize: 14,
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  border: followedCommunities.some(c => c.id === `creator-${instructorData?.id}`)
                                    ? '1px solid #1d9bf0'
                                    : '1px solid transparent',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                {followedCommunities.some(c => c.id === `creator-${instructorData?.id}`) ? 'Joined Community' : 'Join Community'}
                              </button>
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
                {/* If viewing a course from instructor profile, show course detail */}
                {selectedCourse ? (
                  <CourseDetailView
                    course={getCourseById(selectedCourse.id)}
                    onBack={() => setSelectedCourse(null)}
                    isDarkMode={isDarkMode}
                    followedCommunities={followedCommunities}
                    setFollowedCommunities={setFollowedCommunities}
                    isCoursePurchased={isCoursePurchased(selectedCourse.id)}
                    currentUser={currentUser}
                    onViewInstructor={(instructorId) => {
                      const instructor = getInstructorById(instructorId);
                      if (instructor) {
                        setSelectedCourse(null);
                        setSelectedInstructor(instructor);
                      }
                    }}
                    onEnroll={(course) => {
                      setEnrollingCourse(course);
                      setShowEnrollOptions(true);
                    }}
                  />
                ) : selectedInstructor ? (
                  renderInstructorProfile()
                ) : (
                  renderInstructorSummary()
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

BrowseView.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
  onMenuChange: PropTypes.func,
  activeTopMenu: PropTypes.string.isRequired,
  setActiveTopMenu: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  selectedCourse: PropTypes.object,
  setSelectedCourse: PropTypes.func.isRequired,
  selectedInstructor: PropTypes.object,
  setSelectedInstructor: PropTypes.func.isRequired,
  previousBrowseContext: PropTypes.object,
  setPreviousBrowseContext: PropTypes.func.isRequired,
  creatorProfileTab: PropTypes.string,
  setCreatorProfileTab: PropTypes.func.isRequired,
  currentInstructorForCourse: PropTypes.object,
  setCurrentInstructorForCourse: PropTypes.func.isRequired,
  showEnrollmentFlow: PropTypes.bool.isRequired,
  setShowEnrollmentFlow: PropTypes.func.isRequired,
  showEnrollOptions: PropTypes.bool,
  setShowEnrollOptions: PropTypes.func,
  enrollingCourse: PropTypes.object,
  setEnrollingCourse: PropTypes.func.isRequired,
  openCreatorFollowDropdown: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setOpenCreatorFollowDropdown: PropTypes.func.isRequired,
  isFollowingLoading: PropTypes.bool,
  indexedCourses: PropTypes.array.isRequired,
  indexedInstructors: PropTypes.array.isRequired,
  followedCommunities: PropTypes.array.isRequired,
  setFollowedCommunities: PropTypes.func.isRequired,
  purchasedCourses: PropTypes.array.isRequired,
  handleCoursePurchase: PropTypes.func.isRequired,
  isCoursePurchased: PropTypes.func.isRequired,
  isCourseFollowed: PropTypes.func.isRequired,
  isCreatorFollowed: PropTypes.func.isRequired,
  hasAnyCreatorCourseFollowed: PropTypes.func.isRequired,
  handleFollowInstructor: PropTypes.func.isRequired,
  handleFollowCourse: PropTypes.func.isRequired,
  onRestoreCourseView: PropTypes.func,
  onEnrollmentComplete: PropTypes.func
};

export default BrowseView;
