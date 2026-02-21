import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaBook, FaUser, FaSearch, FaFolder, FaPlay, FaFileAlt, FaLink } from 'react-icons/fa';
import { AiOutlineStar, AiOutlineTeam, AiOutlineClockCircle, AiOutlineBarChart } from 'react-icons/ai';
import CourseDetailView from './CourseDetailView';
import EnrollmentFlow from './EnrollmentFlow';
import Breadcrumb from './Breadcrumb';
import './CommunityHub.css';
import { getInstructorById, getCourseById, getInstructorWithCourses, iconConfig } from '../data/database';
import { fakePosts } from '../data/communityPosts';
import PostComposer from './PostComposer';
import { createPost, getPosts } from '../services/posts';

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
  userStatus,  // New unified status hook (optional during migration)
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
  onEnrollmentComplete,
  breadcrumbItems = null,  // Breadcrumb navigation items
  onBack = null  // Back button handler
}) => {
  // State for profile tabs (courses vs general content)
  const [activeProfileTab, setActiveProfileTab] = useState('courses');
  const [selectedContentItem, setSelectedContentItem] = useState(null);
  // State for selected course pill in feed (null = Town Hall, or { id, title })
  const [selectedFeedCourse, setSelectedFeedCourse] = useState(null);
  // Post composer state
  const [newPostText, setNewPostText] = useState('');
  const [isComposerFocused, setIsComposerFocused] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState(null);
  const [realPosts, setRealPosts] = useState([]);

  // Load real posts from Supabase
  useEffect(() => {
    const loadPosts = async () => {
      const result = await getPosts();
      if (result.success) setRealPosts(result.posts);
    };
    loadPosts();
  }, []);

  // Listen for posts created from compose modal
  useEffect(() => {
    const handleNewPost = (e) => {
      if (e.detail) setRealPosts(prev => [e.detail, ...prev]);
    };
    window.addEventListener('newPostCreated', handleNewPost);
    return () => window.removeEventListener('newPostCreated', handleNewPost);
  }, []);

  const handleSubmitPost = async () => {
    if (!newPostText.trim() || isPosting) return;
    setIsPosting(true);
    setPostError(null);
    const audience = selectedFeedCourse ? selectedFeedCourse.title : 'everyone';
    const result = await createPost(
      currentUser?.id || 'anonymous',
      currentUser?.name || 'Anonymous User',
      newPostText.trim(),
      audience
    );
    if (result.success) {
      setRealPosts(prev => [result.post, ...prev]);
      setNewPostText('');
      setIsComposerFocused(false);
    } else {
      setPostError(result.error || 'Failed to create post');
    }
    setIsPosting(false);
  };

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

  // Ref for course pills scrolling in unified profile
  const pillsScrollRef = React.useRef(null);
  const scrollPills = (direction) => {
    if (pillsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      pillsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const renderInstructorProfile = () => {
    const creator = selectedInstructor;
    const creatorCourses = creator.courses
      ? creator.courses.map(c => typeof c === 'object' ? c : indexedCourses.find(course => course.id === c)).filter(Boolean)
      : [];
    const creatorName = creator.communityName || creator.name || 'Creator';
    const creatorInitials = creatorName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

    // Sample general content data
    const generalContent = {
      sections: [
        {
          id: 'getting-started', title: 'Getting Started',
          items: [
            { id: 'welcome', type: 'video', title: 'Welcome Video', description: "Welcome to my community! In this video I'll walk you through everything.", duration: '5:32' },
            { id: 'tips', type: 'video', title: 'Quick Tips', description: 'Essential tips to get the most out of this community.', duration: '3:15' },
            { id: 'faq', type: 'file', title: 'FAQ Document', description: 'Frequently asked questions and answers.', fileType: 'PDF' }
          ]
        },
        {
          id: 'free-resources', title: 'Free Resources',
          items: [
            { id: 'cheatsheet', type: 'file', title: 'Cheat Sheet', description: 'Quick reference guide.', fileType: 'PDF' },
            { id: 'links', type: 'link', title: 'Useful Links', description: 'Curated collection of helpful external resources.' },
            { id: 'templates', type: 'file', title: 'Starter Templates', description: 'Ready-to-use templates.', fileType: 'ZIP' }
          ]
        },
        {
          id: 'bonus', title: 'Bonus Content',
          items: [
            { id: 'behind', type: 'video', title: 'Behind the Scenes', description: 'A look at how I create my courses.', duration: '8:45' },
            { id: 'updates', type: 'video', title: 'Community Updates', description: 'Latest news and announcements.', duration: '4:20' }
          ]
        }
      ]
    };

    // Sample posts for feed tab
    const creatorPosts = [
      { time: '2h ago', type: 'announcement', content: `Welcome to ${creatorName}! Ask questions, share insights, and connect with fellow learners.`, stats: { likes: 156, replies: 45 } },
      { time: '1d ago', type: 'tip', content: 'Pro tip: The key to mastering any subject is consistent practice combined with peer learning.', stats: { likes: 234, replies: 67 } },
      { time: '3d ago', type: 'update', content: 'New content dropping next week! Stay tuned for advanced techniques and real-world applications.', stats: { likes: 189, replies: 52 } }
    ];

    // Calendar events
    const calendarEvents = [
      { time: '10:00', ampm: 'AM', title: 'Live Q&A Session', meta: 'Weekly Office Hours', color: '#4f7df3' },
      { time: '2:00', ampm: 'PM', title: 'Workshop: Advanced Techniques', meta: 'Interactive Session', color: '#22c55e' },
      { time: '5:00', ampm: 'PM', title: 'Community Meetup', meta: 'Networking Event', color: '#f59e0b' }
    ];

    const today = new Date();
    const weekDays = [];
    const dayStart = new Date(today);
    dayStart.setDate(today.getDate() - today.getDay());
    for (let i = 0; i < 7; i++) {
      const d = new Date(dayStart);
      d.setDate(dayStart.getDate() + i);
      weekDays.push({
        name: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
        num: d.getDate(),
        isToday: d.toDateString() === today.toDateString(),
        hasEvent: [1, 3, 5].includes(d.getDay())
      });
    }

    // Use creatorProfileTab for unified tabs (feed/courses/content/calendar)
    // Default to 'courses' which is set from MainContent
    const activeTab = creatorProfileTab || 'courses';
    const isMember = isCreatorFollowed(creator.id);

    return (
      <div>

        {/* Header - CommunityHub style */}
        <div className={`community-hub-header ${isDarkMode ? 'dark' : ''}`}>
          {/* Banner strip */}
          <div className="community-hub-banner" />

          {/* Card body */}
          <div className="community-hub-card-body">
            {/* Avatar row: avatar left, buttons right */}
            <div className="community-hub-avatar-row">
              <div className="community-hub-avatar-img">
                {creatorInitials}
              </div>
              <div className="community-hub-card-actions">
                <button
                  className="community-hub-btn-following"
                  onClick={() => handleFollowInstructor(creator.id)}
                >
                  {isCreatorFollowed(creator.id) ? (
                    <>
                      <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z"/></svg>
                      Following
                    </>
                  ) : 'Follow'}
                </button>
                <button className="community-hub-btn-more">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                </button>
              </div>
            </div>

            {/* Name + verified badge */}
            <h1 className="community-hub-creator-name">
              {creatorName}
              <span className="community-hub-verified-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
              </span>
            </h1>

            {/* Subtitle */}
            <div className="community-hub-creator-subtitle">
              {creator.title || 'Creator & Educator'}
            </div>

            {/* Bio */}
            {creator.bio && (
              <p className="community-hub-creator-bio">
                {creator.bio}
              </p>
            )}

            {/* Stats row */}
            <div className="community-hub-creator-stats">
              <span><strong>{creator.stats?.averageRating || '4.8'}</strong> rating</span>
              <span><strong>{(creator.stats?.studentsTaught || 0).toLocaleString()}</strong> students</span>
              <span><strong>{creatorCourses.length}</strong> courses</span>
              <span><strong>{creator.stats?.communityMembers || '120'}</strong> members</span>
            </div>

            {/* Credentials */}
            {creator.qualifications && creator.qualifications.length > 0 && (
              <div className="community-hub-creator-credentials">
                {creator.qualifications.slice(0, 3).map((qual, index) => (
                  <div key={index} className="community-hub-credential">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg>
                    {qual.sentence}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs - CommunityHub style */}
        <div className={`community-hub-sticky-menus ${isDarkMode ? 'dark' : ''}`}>
          <div className="community-hub-tabs">
            {[
              { id: 'feed', label: 'Feed' },
              { id: 'courses', label: 'Courses' },
              { id: 'content', label: 'Content' },
              { id: 'calendar', label: 'Calendar' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`community-hub-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setCreatorProfileTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Course pills under Feed tab */}
          {activeTab === 'feed' && (
            <div className={`course-tabs-outer ${isDarkMode ? 'dark' : ''}`}>
              <button className="course-scroll-btn" onClick={() => scrollPills('left')}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
              </button>
              <div className="course-pills-container" ref={pillsScrollRef}>
                <button
                  className={`course-pill ${selectedFeedCourse === null ? 'course-pill-selected' : ''}`}
                  onClick={() => setSelectedFeedCourse(null)}
                >
                  <span style={{ fontSize: 13 }}>🏠</span>
                  Town Hall
                </button>
                {creatorCourses.filter(c => isCoursePurchased(c.id)).map(course => (
                  <button
                    key={course.id}
                    className={`course-pill ${selectedFeedCourse?.id === course.id ? 'course-pill-selected' : ''}`}
                    onClick={() => setSelectedFeedCourse({ id: course.id, title: course.title })}
                    title={course.title}
                  >
                    {course.title}
                  </button>
                ))}
              </div>
              <button className="course-scroll-btn" onClick={() => scrollPills('right')}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          )}
        </div>

        {/* Tab Content */}
        {/* === FEED TAB === */}
        {activeTab === 'feed' && !isMember && (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#1a1d21', marginBottom: 8 }}>
              Join {creatorName} to see the feed
            </h3>
            <p style={{ fontSize: 14, color: isDarkMode ? '#71767b' : '#9aa5b4', marginBottom: 20, maxWidth: 320, margin: '0 auto 20px' }}>
              Follow this community to access posts, discussions, and updates from {creator.name}.
            </p>
            <button
              onClick={() => handleFollowInstructor(creator.id)}
              style={{
                background: '#1d9bf0', color: '#fff', border: 'none',
                padding: '10px 24px', borderRadius: 9999, fontSize: 15,
                fontWeight: 700, cursor: 'pointer'
              }}
            >
              Join Community
            </button>
          </div>
        )}
        {activeTab === 'feed' && isMember && (() => {
          // Get the instructor ID for filtering fakePosts
          const creatorInstructorId = creator.id;

          // Format real posts from Supabase
          const formatTimeAgo = (timestamp) => {
            if (!timestamp) return 'just now';
            const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
            if (seconds < 60) return 'just now';
            if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
            if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
            if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
            return new Date(timestamp).toLocaleDateString();
          };
          const formattedRealPosts = realPosts
            .filter(post => {
              if (selectedFeedCourse === null) return post.audience === 'everyone';
              return post.audience === selectedFeedCourse.title;
            })
            .map(post => ({
              _type: 'real', _key: `real-${post.id}`,
              time: formatTimeAgo(post.created_at), content: post.content,
              stats: { likes: post.likes || 0, replies: post.comments || 0 },
              type: null,
              author: post.user_name,
              authorAvatar: currentUser?.avatar,
              community: post.audience === 'everyone' ? 'Everyone' : post.audience,
              isRealPost: true
            }));

          // Filter posts based on selected pill
          const feedPosts = selectedFeedCourse === null
            ? // Town Hall: show real posts + creator town hall posts + hardcoded posts
              [
                ...formattedRealPosts,
                ...creatorPosts.map((p, i) => ({ ...p, _type: 'local', _key: `local-${i}` })),
                ...fakePosts
                  .filter(post => post.isCreatorTownHall && post.instructorId === creatorInstructorId)
                  .map(post => ({
                    _type: 'fake', _key: `fake-${post.id}`,
                    time: post.timestamp, content: post.content,
                    stats: { likes: post.likes, replies: post.replies },
                    type: post.isPinned ? 'announcement' : 'tip',
                    author: post.author, authorAvatar: post.authorAvatar,
                    community: post.community
                  })),
                ...fakePosts
                  .filter(post => !post.isCreatorTownHall && !post.isTownHallExclusive && post.communityInstructorId === creatorInstructorId)
                  .map(post => ({
                    _type: 'fake', _key: `fake-${post.id}`,
                    time: post.timestamp, content: post.content,
                    stats: { likes: post.likes, replies: post.replies },
                    type: null,
                    author: post.author, authorAvatar: post.authorAvatar,
                    community: post.community
                  }))
              ]
            : // Course pill: show real posts + posts matching the course title
              [
                ...formattedRealPosts,
                ...fakePosts
                  .filter(post => post.community === selectedFeedCourse.title)
                  .map(post => ({
                    _type: 'fake', _key: `fake-${post.id}`,
                    time: post.timestamp, content: post.content,
                    stats: { likes: post.likes, replies: post.replies },
                    type: null,
                    author: post.author, authorAvatar: post.authorAvatar,
                    community: post.community
                  }))
              ];

          return (
            <div>
              <PostComposer
                currentUser={currentUser}
                newPostText={newPostText}
                setNewPostText={setNewPostText}
                isComposerFocused={isComposerFocused}
                setIsComposerFocused={setIsComposerFocused}
                isPosting={isPosting}
                postError={postError}
                onSubmit={handleSubmitPost}
                isDarkMode={isDarkMode}
                communityMode="creators"
                selectedCourseFilters={selectedFeedCourse ? [{ name: selectedFeedCourse.title }] : []}
              />
              {feedPosts.length > 0 ? feedPosts.map((post) => (
                <div key={post._key} style={{
                  padding: '16px 20px',
                  borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #e8ecf1'
                }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {post.authorAvatar ? (
                      <img src={post.authorAvatar} alt={post.author || creator.name} style={{
                        width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0
                      }} />
                    ) : (
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: 14, fontWeight: 700, flexShrink: 0
                      }}>
                        {creatorInitials}
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: isDarkMode ? '#e7e9ea' : '#1a1d21' }}>
                          {post.author || creator.name}
                        </span>
                        <span style={{ color: isDarkMode ? '#71767b' : '#9aa5b4', fontSize: 13 }}>·</span>
                        <span style={{ color: isDarkMode ? '#71767b' : '#9aa5b4', fontSize: 13 }}>{post.time}</span>
                      </div>
                      {post.type && (
                        <div style={{
                          display: 'inline-block',
                          background: post.type === 'announcement' ? '#eef3fe' : post.type === 'tip' ? '#ecfdf5' : '#fffbeb',
                          color: post.type === 'announcement' ? '#4f7df3' : post.type === 'tip' ? '#22c55e' : '#f59e0b',
                          padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, marginBottom: 6
                        }}>
                          {post.type === 'announcement' && '📢 ANNOUNCEMENT'}
                          {post.type === 'tip' && '💡 TIP'}
                          {post.type === 'update' && '🔔 UPDATE'}
                        </div>
                      )}
                      {post.community && selectedFeedCourse !== null && (
                        <div style={{
                          display: 'inline-block',
                          background: isDarkMode ? 'rgba(29, 155, 240, 0.15)' : '#eef3fe',
                          color: '#1d9bf0',
                          padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, marginBottom: 6
                        }}>
                          in {post.community}
                        </div>
                      )}
                      <div style={{ fontSize: 15, color: isDarkMode ? '#e7e9ea' : '#1a1d21', lineHeight: 1.5, marginBottom: 8 }}>
                        {post.content}
                      </div>
                      <div style={{ display: 'flex', gap: 20, fontSize: 13, color: isDarkMode ? '#71767b' : '#9aa5b4' }}>
                        <span>💬 {post.stats.replies}</span>
                        <span>❤️ {post.stats.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div style={{ padding: '48px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#1a1d21', marginBottom: 8 }}>
                    No posts yet
                  </h3>
                  <p style={{ fontSize: 14, color: isDarkMode ? '#71767b' : '#9aa5b4' }}>
                    Be the first to start a discussion in this course!
                  </p>
                </div>
              )}
            </div>
          );
        })()}

        {/* === COURSES TAB === */}
        {activeTab === 'courses' && (
          <div style={{ padding: '0' }}>
            {creatorCourses.map((course) => {
              const abbreviation = getCourseAbbreviation(course.title);
              const isPurchased = isCoursePurchased(course.id);
              const isFollowed = isCourseFollowed(course.id);
              return (
                <div
                  key={course.id}
                  onClick={() => {
                    setSelectedCourse(course);
                    setCurrentInstructorForCourse(creator);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '16px 20px',
                    borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #e8ecf1',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    background: isDarkMode ? '#000' : '#fff'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = isDarkMode ? '#16181c' : '#f8f9fb'}
                  onMouseLeave={e => e.currentTarget.style.background = isDarkMode ? '#000' : '#fff'}
                >
                  {/* Course icon */}
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                    background: `linear-gradient(135deg, ${iconConfig[abbreviation]?.gradient?.[0] || '#4f7df3'} 0%, ${iconConfig[abbreviation]?.gradient?.[1] || '#764ba2'} 100%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: 14
                  }}>
                    {abbreviation}
                  </div>
                  {/* Course info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontWeight: 600, fontSize: 15, color: isDarkMode ? '#e7e9ea' : '#1a1d21' }}>
                        {course.title}
                      </span>
                      {isFollowed && (
                        <span style={{ color: '#4f7df3', fontSize: 13, fontWeight: 500 }}>· Following</span>
                      )}
                    </div>
                    <div style={{
                      fontSize: 14, color: isDarkMode ? '#71767b' : '#5f6b7a',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {course.description}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: 13, color: isDarkMode ? '#71767b' : '#9aa5b4' }}>
                      <span style={{ color: '#fbbf24' }}>★</span>
                      {course.stats?.rating || '4.7'} · {(course.stats?.students || 980).toLocaleString()} students · {course.duration || '3 hours'}
                    </div>
                  </div>
                  {/* Enroll / Enrolled button */}
                  {isPurchased ? (
                    <span style={{
                      padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500,
                      border: isDarkMode ? '1px solid #2f3336' : '1px solid #e8ecf1',
                      color: isDarkMode ? '#71767b' : '#5f6b7a', background: 'transparent'
                    }}>
                      Enrolled
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEnrollingCourse(course);
                        setShowEnrollOptions(true);
                      }}
                      style={{
                        padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                        background: '#22c55e', color: 'white', border: 'none', cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Enroll ${course.price || 149}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* === CONTENT TAB === */}
        {activeTab === 'content' && !isMember && (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#1a1d21', marginBottom: 8 }}>
              Join {creatorName} to access content
            </h3>
            <p style={{ fontSize: 14, color: isDarkMode ? '#71767b' : '#9aa5b4', marginBottom: 20, maxWidth: 320, margin: '0 auto 20px' }}>
              Follow this community to access exclusive videos, resources, and materials from {creator.name}.
            </p>
            <button
              onClick={() => handleFollowInstructor(creator.id)}
              style={{
                background: '#1d9bf0', color: '#fff', border: 'none',
                padding: '10px 24px', borderRadius: 9999, fontSize: 15,
                fontWeight: 700, cursor: 'pointer'
              }}
            >
              Join Community
            </button>
          </div>
        )}
        {activeTab === 'content' && isMember && (
          <div className="community-hub-content-section">
            <div className="community-hub-content-hero">
              <div className="community-hub-content-hero-label">Featured</div>
              <div className="community-hub-content-hero-title">Welcome to {creatorName}</div>
              <div className="community-hub-content-hero-desc">
                Get started with exclusive content, resources, and community insights.
              </div>
              <div className="community-hub-content-hero-play">
                <FaPlay size={12} /> Watch Introduction
              </div>
            </div>
            {generalContent.sections.map(section => (
              <div key={section.id} style={{ marginBottom: 20 }}>
                <h3 style={{
                  fontSize: 15, fontWeight: 700, marginBottom: 10, marginTop: 16,
                  color: isDarkMode ? '#e7e9ea' : '#1a1d21'
                }}>
                  {section.title}
                </h3>
                {section.items.map(item => (
                  <div key={item.id} className="community-hub-content-card"
                    onClick={() => setSelectedContentItem(item)}
                  >
                    <div className="community-hub-content-icon">
                      {item.type === 'video' ? <FaPlay size={14} color="#fff" /> :
                       item.type === 'file' ? <FaFileAlt size={14} color="#fff" /> :
                       <FaLink size={14} color="#fff" />}
                    </div>
                    <div>
                      <div className="community-hub-content-title">{item.title}</div>
                      <div className="community-hub-content-desc">
                        {item.description}
                        {item.duration && ` · ${item.duration}`}
                        {item.fileType && ` · ${item.fileType}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* === CALENDAR TAB === */}
        {activeTab === 'calendar' && !isMember && (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#1a1d21', marginBottom: 8 }}>
              Join {creatorName} to see events
            </h3>
            <p style={{ fontSize: 14, color: isDarkMode ? '#71767b' : '#9aa5b4', marginBottom: 20, maxWidth: 320, margin: '0 auto 20px' }}>
              Follow this community to see upcoming sessions, workshops, and events.
            </p>
            <button
              onClick={() => handleFollowInstructor(creator.id)}
              style={{
                background: '#1d9bf0', color: '#fff', border: 'none',
                padding: '10px 24px', borderRadius: 9999, fontSize: 15,
                fontWeight: 700, cursor: 'pointer'
              }}
            >
              Join Community
            </button>
          </div>
        )}
        {activeTab === 'calendar' && isMember && (
          <div className="community-hub-calendar">
            <div className="community-hub-cal-week">
              {weekDays.map((day, i) => (
                <div key={i} className={`community-hub-cal-day ${day.isToday ? 'today' : ''}`}>
                  <div className="community-hub-cal-day-name">{day.name}</div>
                  <div className="community-hub-cal-day-num">{day.num}</div>
                  {day.hasEvent && <div className="community-hub-cal-dot" />}
                </div>
              ))}
            </div>
            <div className="community-hub-cal-section-title">Today's Events</div>
            {calendarEvents.map((evt, i) => (
              <div key={i} className="community-hub-cal-event">
                <div className="community-hub-cal-time-col">
                  <div className="community-hub-cal-time">{evt.time}</div>
                  <div className="community-hub-cal-ampm">{evt.ampm}</div>
                </div>
                <div className="community-hub-cal-event-bar" style={{ background: evt.color }} />
                <div className="community-hub-cal-event-info">
                  <div className="community-hub-cal-event-title">{evt.title}</div>
                  <div className="community-hub-cal-event-meta">{evt.meta}</div>
                </div>
              </div>
            ))}
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
                  fontSize: 'var(--fs-13)',
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
                          fontSize: 'var(--fs-12)',
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
                          fontSize: 'var(--fs-12)',
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
                              fontSize: 'var(--fs-12)',
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
                                    fontSize: 'var(--fs-11)',
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
                    <div style={{ fontSize: 'var(--fs-18)', fontWeight: 600, color: isDarkMode ? '#f3f4f6' : '#0f1419', marginBottom: 1 }}>
                      About the Community
                    </div>
                    <div style={{ fontSize: 'var(--fs-15)', color: isDarkMode ? '#d1d5db' : '#536471' }}>
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
                      fontSize: 'var(--fs-13)',
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
                  fontSize: 'var(--fs-16)',
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
                        fontSize: 'var(--fs-13)',
                        fontWeight: 500
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 'var(--fs-14)', color: isDarkMode ? '#d1d5db' : '#536471' }}>
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
  const hideSearchBar = !!selectedInstructor;

  return (
    <div className="main-content">
      {/* Breadcrumb Navigation */}
      {breadcrumbItems && <Breadcrumb items={breadcrumbItems} onBack={onBack} isDarkMode={isDarkMode} />}
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
                  fontSize: 'var(--fs-16)',
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
                  <>
                    <CourseDetailView
                      course={getCourseById(selectedCourse.id)}
                      onBack={() => setSelectedCourse(null)}
                      isDarkMode={isDarkMode}
                      followedCommunities={followedCommunities}
                      setFollowedCommunities={setFollowedCommunities}
                      isCoursePurchased={isCoursePurchased(selectedCourse.id)}
                      purchasedCourses={purchasedCourses}
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
                  </>
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
                                  fontSize: 'var(--fs-11)',
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
                                fontSize: 'var(--fs-18)',
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
                                fontSize: 'var(--fs-14)',
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
                                fontSize: 'var(--fs-15)',
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
                                    fontSize: 'var(--fs-14)',
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
                                  fontSize: 'var(--fs-14)',
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
                                  fontSize: 'var(--fs-12)',
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
                                fontSize: 'var(--fs-13)',
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
                                fontSize: 'var(--fs-14)',
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
                                    fontSize: 'var(--fs-15)',
                                    color: isDarkMode ? '#e7e9ea' : '#111827'
                                  }}>
                                    {instructorData?.name}
                                  </div>
                                  <div style={{
                                    fontSize: 'var(--fs-13)',
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
                                  fontSize: 'var(--fs-14)',
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
                  <>
                    <CourseDetailView
                      course={getCourseById(selectedCourse.id)}
                      onBack={() => setSelectedCourse(null)}
                      isDarkMode={isDarkMode}
                      followedCommunities={followedCommunities}
                      setFollowedCommunities={setFollowedCommunities}
                      isCoursePurchased={isCoursePurchased(selectedCourse.id)}
                      purchasedCourses={purchasedCourses}
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
                  </>
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
