import React, { useState, useRef, useEffect } from 'react';
import './CommunityHub.css';
import { FaHeart, FaComment, FaRetweet, FaBookmark, FaShare, FaImage, FaLink, FaPaperclip, FaBook } from 'react-icons/fa';
import { getInstructorById, getCourseById } from '../data/database';
import UserHoverCard from './UserHoverCard';

/**
 * CommunityHub - Tabbed hub layout for viewing a creator's community
 * Renders when communityViewMode === 'hub' in Settings
 *
 * Props passed from Community.js:
 * - creatorData: { id, name, instructorId, allCourses, followedCourseIds, isFullCreatorFollow }
 * - instructor: instructor object from database
 * - displayedPosts: filtered posts array
 * - isDarkMode: boolean
 * - currentUser: current user object
 * - selectedCourseFilters: array of selected course filters
 * - setSelectedCourseFilters: setter
 * - onViewUserProfile: callback
 * - onViewCreatorProfile: callback
 * - onViewCourse: callback
 * - newPostText, setNewPostText, isComposerFocused, setIsComposerFocused
 * - isPosting, postError, onSubmitPost
 */
const CommunityHub = ({
  creatorData,
  instructor,
  displayedPosts = [],
  isDarkMode = false,
  currentUser = null,
  selectedCourseFilters = [],
  setSelectedCourseFilters,
  onViewUserProfile,
  onViewCreatorProfile,
  onViewCourse,
  newPostText = '',
  setNewPostText,
  isComposerFocused = false,
  setIsComposerFocused,
  isPosting = false,
  postError = null,
  onSubmitPost,
  onMenuChange,
  signupCompleted = false,
  hubLayoutStyle = 'standard'
}) => {
  const [activeTab, setActiveTab] = useState('feeds');
  const sentinelRef = useRef(null);
  const pillsScrollRef = useRef(null);
  const [isStuck, setIsStuck] = useState(false);
  const [isWideScreenEnough, setIsWideScreenEnough] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1100px)').matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1100px)');
    const handler = (e) => setIsWideScreenEnough(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const effectiveLayoutStyle = hubLayoutStyle === 'wide' && isWideScreenEnough ? 'wide' : 'standard';

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setIsStuck(!e.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const creatorName = creatorData?.name || instructor?.name || 'Creator';
  const creatorInitials = creatorName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  const allCourses = creatorData?.allCourses || [];
  const followedCourseIds = creatorData?.followedCourseIds || [];

  // Use the same purchased courses filter as the classic feed
  const purchasedCourses = allCourses.filter(course => followedCourseIds.includes(course.id));
  const isMainHallSelected = selectedCourseFilters.length === 0;

  // Count posts per course for badge counts
  const getPostCountForCourse = (courseId) => {
    return displayedPosts.filter(p => p.courseId === courseId).length;
  };

  // Same abbreviation logic as MyCoursesView
  const getCourseAbbreviation = (title) => {
    if (!title) return '??';
    const mappings = {
      'ai': 'AI', 'machine learning': 'ML', 'deep learning': 'DL',
      'data science': 'DS', 'full-stack': 'FS', 'full stack': 'FS',
      'devops': 'DO', 'ci/cd': 'CI', 'github': 'GH',
      'node.js': 'NJ', 'nodejs': 'NJ', 'python': 'PY',
      'robotics': 'RB', 'medical': 'MD', 'healthcare': 'HC',
      'automation': 'AU', 'n8n': 'N8', 'prompt': 'PM',
      'claude': 'CC', 'computer vision': 'CV', 'business intelligence': 'BI',
      'microservices': 'MS', 'cloud': 'CL', 'aws': 'AWS'
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

  // Scroll helpers for course pills
  const scrollPills = (direction) => {
    if (pillsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      pillsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Get the current audience name for composer
  const getAudienceName = () => {
    if (selectedCourseFilters.length > 0) {
      return selectedCourseFilters[0].name;
    }
    return 'Town Hall';
  };

  const renderSearchBar = () => (
    <div className={`community-hub-search-bar ${isDarkMode ? 'dark' : ''}`}>
      <input
        type="text"
        className="community-hub-search-input"
        placeholder="What do you want to learn today?"
        readOnly
      />
    </div>
  );

  const renderHeader = () => (
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
            <button className="community-hub-btn-following">
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z"/></svg>
              Following
            </button>
            <button className="community-hub-btn-more">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </button>
          </div>
        </div>

        {/* Name + verified badge */}
        <h1 className="community-hub-creator-name">
          {instructor?.communityName || `${creatorName}'s Community`}
          <span className="community-hub-verified-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
          </span>
        </h1>

        {/* Subtitle */}
        <div className="community-hub-creator-subtitle">
          {instructor?.title || 'Creator & Educator'}
        </div>

        {/* Bio */}
        {instructor?.bio && (
          <p className="community-hub-creator-bio">
            {instructor.bio}
          </p>
        )}

        {/* Stats row */}
        <div className="community-hub-creator-stats">
          <span><strong>{instructor?.stats?.averageRating || '4.8'}</strong> rating</span>
          <span><strong>{(instructor?.stats?.studentsTaught || 0).toLocaleString()}</strong> students</span>
          <span><strong>{allCourses.length}</strong> courses</span>
          <span><strong>{instructor?.stats?.communityMembers || '120'}</strong> members</span>
        </div>

        {/* Credentials */}
        {instructor?.qualifications && instructor.qualifications.length > 0 && (
          <div className="community-hub-creator-credentials">
            {instructor.qualifications.slice(0, 3).map((qual, index) => (
              <div key={index} className="community-hub-credential">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7"/></svg>
                {qual.sentence}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const getUserInitials = () => {
    if (currentUser?.name) {
      return currentUser.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const renderSubPills = () => (
    <div className={`course-tabs-outer ${isDarkMode ? 'dark' : ''}`}>
      {/* Left scroll arrow */}
      <button className="course-scroll-btn" onClick={() => scrollPills('left')}>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
      </button>

      {/* Pills container */}
      <div className="course-pills-container" ref={pillsScrollRef}>
        {/* Town Hall Pill */}
        <button
          onClick={() => setSelectedCourseFilters([])}
          className={`course-pill ${isMainHallSelected ? 'course-pill-selected' : ''}`}
        >
          <span style={{ fontSize: 13 }}>🏠</span>
          Town Hall
        </button>

        {/* Course Pills - Only purchased courses */}
        {purchasedCourses.map(course => {
          const isSelected = selectedCourseFilters.length === 1 && selectedCourseFilters[0].id === course.id;
          const postCount = getPostCountForCourse(course.id);
          return (
            <button
              key={course.id}
              onClick={() => {
                setSelectedCourseFilters([{ id: course.id, name: course.title }]);
              }}
              className={`course-pill ${isSelected ? 'course-pill-selected' : ''}`}
              title={course.title}
            >
              {course.title}
              {postCount > 0 && (
                <span className="course-pill-count">{postCount}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right scroll arrow */}
      <button className="course-scroll-btn" onClick={() => scrollPills('right')}>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
      </button>
    </div>
  );

  const isComposerLocked = currentUser?.isNewUser && !signupCompleted;

  const renderFeedsTab = () => (
    <div>
      {/* Post Composer - Open layout matching mockup */}
      <div className={`community-hub-composer ${isDarkMode ? 'dark' : ''}`}>
        {/* Locked Overlay for new users */}
        {isComposerLocked && (
          <div className={`community-hub-composer-locked ${isDarkMode ? 'dark' : ''}`}>
            <div style={{ textAlign: 'center', padding: '16px 24px' }}>
              <div style={{ fontSize: 'var(--fs-24)', marginBottom: 8 }}>🔒</div>
              <div style={{
                color: isDarkMode ? '#e7e9ea' : '#1a1d21',
                fontSize: 'var(--fs-15)',
                fontWeight: 600,
                marginBottom: 4
              }}>
                Complete signup to share a post
              </div>
              <div style={{ color: isDarkMode ? '#71767b' : '#5f6b7a', fontSize: 13 }}>
                Select your interests below to unlock posting
              </div>
            </div>
          </div>
        )}

        {/* Avatar */}
        {currentUser?.avatar ? (
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="community-hub-composer-avatar"
            onClick={() => onMenuChange && onMenuChange('Profile')}
            style={{ cursor: 'pointer' }}
            title="View your profile"
          />
        ) : (
          <div
            className="community-hub-composer-avatar-placeholder"
            onClick={() => onMenuChange && onMenuChange('Profile')}
            title="View your profile"
          >
            {getUserInitials()}
          </div>
        )}

        {/* Composer body */}
        <div className="community-hub-composer-body" style={{ opacity: isComposerLocked ? 0.4 : 1 }}>
          {/* Audience pill */}
          <div className="community-hub-composer-audience">
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/></svg>
            Posting to: {getAudienceName()}
            <svg width="10" height="10" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2"><path d="M3 5l3 3 3-3"/></svg>
          </div>

          {/* Textarea */}
          <textarea
            className="community-hub-composer-textarea"
            value={newPostText}
            onChange={(e) => setNewPostText?.(e.target.value)}
            onFocus={() => setIsComposerFocused?.(true)}
            placeholder={
              selectedCourseFilters.length > 0
                ? `Discuss ${selectedCourseFilters[0].name}...`
                : "Ask a question or share an insight..."
            }
            disabled={isComposerLocked}
            rows={2}
          />

          {/* Toolbar */}
          <div className="community-hub-composer-toolbar">
            <div className="community-hub-composer-media-actions">
              <button
                className="community-hub-composer-action-btn"
                disabled={isComposerLocked}
                title="Add image"
              >
                <FaImage size={18} />
              </button>
              <button
                className="community-hub-composer-action-btn"
                disabled={isComposerLocked}
                title="Add link"
              >
                <FaLink size={18} />
              </button>
              <button
                className="community-hub-composer-action-btn"
                disabled={isComposerLocked}
                title="Attach file"
              >
                <FaPaperclip size={18} />
              </button>
            </div>

            <button
              className="community-hub-composer-submit"
              disabled={!newPostText?.trim() || isPosting || isComposerLocked}
              onClick={onSubmitPost}
            >
              {isPosting ? 'Posting...' : 'Post'}
            </button>
          </div>
          {postError && (
            <div style={{ color: '#ef4444', fontSize: 12, marginTop: 6 }}>{postError}</div>
          )}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="posts-feed">
        {displayedPosts.length > 0 ? (
          displayedPosts.map(post => {
            const course = getCourseById(post.courseId);
            const handlePostAuthorClick = () => {
              if (post.isCreatorTownHall && post.instructorId) {
                const inst = getInstructorById(post.instructorId);
                if (inst && onViewCreatorProfile) {
                  onViewCreatorProfile({ ...inst, instructorId: post.instructorId });
                  return;
                }
              }
              if (onViewUserProfile) onViewUserProfile(post.author);
            };

            return (
              <div key={post.id} className="post-card">
                <div className="post-card-header">
                  <img
                    className="post-card-avatar"
                    src={post.authorAvatar}
                    alt={post.author}
                    onClick={handlePostAuthorClick}
                    style={{
                      width: 40, height: 40,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      transition: 'transform 0.15s, box-shadow 0.15s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    title={`View ${post.author}'s profile`}
                  />
                  <div className="post-card-header-info">
                    <div className="post-card-name-row">
                      <UserHoverCard
                        user={{
                          id: post.authorId,
                          name: post.author,
                          handle: post.authorHandle,
                          avatar: post.authorAvatar,
                          bio: post.authorBio
                        }}
                        onFollow={(user) => console.log('Follow:', user.name)}
                        onMessage={(user) => console.log('Message:', user.name)}
                        onViewProfile={handlePostAuthorClick}
                        currentUserId={currentUser?.id}
                      >
                        <span
                          className="post-card-author"
                          onClick={handlePostAuthorClick}
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                          onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                        >
                          {post.author}
                        </span>
                      </UserHoverCard>
                      <span
                        className="post-card-handle"
                        onClick={handlePostAuthorClick}
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#1d9bf0'}
                        onMouseLeave={e => e.currentTarget.style.color = ''}
                      >
                        {post.authorHandle}
                      </span>
                      <span className="post-card-dot">&middot;</span>
                      <span className="post-card-timestamp">{post.timestamp}</span>
                    </div>
                    {/* Post meta badges */}
                    <div className="post-card-meta-badges">
                      {post.isTopContributor && (
                        <span className="post-badge-top-contributor">Top contributor</span>
                      )}
                      {post.isPinned && (
                        <span className="post-badge-pinned">📌 Pinned</span>
                      )}
                      {post.community && (
                        (post.isTownHallExclusive || post.isCreatorTownHall) ? (
                          <span className="post-badge-course">
                            {post.community}
                          </span>
                        ) : (
                          <span
                            className="post-badge-course"
                            onClick={() => {
                              if (onViewCourse && post.courseId) {
                                onViewCourse(post.courseId);
                              }
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            {post.community}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
                <div className="post-card-content">{post.content}</div>
                <div className="post-card-actions">
                  <button className="post-action-btn reply">
                    <FaComment />
                    <span>{post.replies}</span>
                  </button>
                  <button className="post-action-btn repost">
                    <FaRetweet />
                    <span>{Math.floor(post.likes * 0.3)}</span>
                  </button>
                  <button className="post-action-btn like">
                    <FaHeart />
                    <span>{post.likes}</span>
                  </button>
                  <button className="post-action-btn bookmark">
                    <FaBookmark />
                  </button>
                  <button className="post-action-btn share">
                    <FaShare />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FaBook />
            </div>
            <h2>No Posts Yet</h2>
            <p>No posts in this community yet. Be the first to share!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCoursesTab = () => (
    <div style={{ padding: '12px 16px' }}>
      {allCourses.length > 0 ? allCourses.map((course) => {
        const isPurchased = followedCourseIds.includes(course.id);

        return (
          <div
            key={course.id}
            onClick={() => onViewCourse?.(course.id)}
            style={{
              position: 'relative',
              display: 'flex',
              gap: 12,
              padding: 12,
              background: isDarkMode ? '#16181c' : '#f8f9fb',
              border: isDarkMode ? '1px solid #2f3336' : '1px solid #e8ecf1',
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: 8
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#22c55e';
              e.currentTarget.style.background = isDarkMode ? '#1d1f23' : '#f0f3f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = isDarkMode ? '#2f3336' : '#e8ecf1';
              e.currentTarget.style.background = isDarkMode ? '#16181c' : '#f8f9fb';
            }}
          >
            {/* Course Badge */}
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 10,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              fontSize: 'var(--fs-16)',
              fontWeight: 700
            }}>
              {getCourseAbbreviation(course.title)}
            </div>

            {/* Course Content */}
            <div style={{ flex: 1, minWidth: 0, paddingRight: 100 }}>
              <div style={{
                fontSize: 'var(--fs-15)',
                fontWeight: 600,
                color: isDarkMode ? '#e7e9ea' : '#1a1d21',
                marginBottom: 2,
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 6
              }}>
                <span>{course.title}</span>
                {isPurchased && (
                  <>
                    <span style={{ color: isDarkMode ? '#71767b' : '#5f6b7a', fontWeight: 400 }}>&middot;</span>
                    <span style={{
                      color: '#1d9bf0',
                      fontSize: 'var(--fs-15)',
                      fontWeight: 600
                    }}>
                      Following
                    </span>
                  </>
                )}
              </div>
              <div style={{
                fontSize: 'var(--fs-14)',
                color: isDarkMode ? '#a0a0a0' : '#5f6b7a',
                lineHeight: 1.4,
                marginBottom: 6
              }}>
                {course.description}
              </div>
              <div style={{
                fontSize: 'var(--fs-14)',
                color: isDarkMode ? '#71767b' : '#9aa5b4',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                <span style={{ color: '#fbbf24' }}>★</span> {course.rating || '4.7'} · {(course.students || 980).toLocaleString()} students · {course.duration || '6 weeks'}
              </div>
            </div>

            {/* Enroll/Enrolled Button */}
            {isPurchased ? (
              <span
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  background: isDarkMode ? '#2f3336' : '#f8f9fb',
                  border: isDarkMode ? '2px solid #374151' : '2px solid #e8ecf1',
                  color: isDarkMode ? '#e7e9ea' : '#1a1d21',
                  padding: '8px 16px',
                  borderRadius: 20,
                  fontSize: 'var(--fs-14)',
                  fontWeight: 500,
                  whiteSpace: 'nowrap'
                }}
              >
                Enrolled
              </span>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewCourse?.(course.id);
                }}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  background: '#22c55e',
                  border: '2px solid #22c55e',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: 20,
                  fontSize: 'var(--fs-14)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#16a34a'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#22c55e'}
              >
                Enroll {course.price}
              </button>
            )}
          </div>
        );
      }) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FaBook />
          </div>
          <h2>No Courses Yet</h2>
          <p>This creator hasn't published any courses yet.</p>
        </div>
      )}
    </div>
  );

  const renderContentTab = () => (
    <div className="community-hub-content-section">
      {/* Hero card */}
      <div className="community-hub-content-hero">
        <div className="community-hub-content-hero-label">Featured</div>
        <div className="community-hub-content-hero-title">Welcome to {creatorName}'s Community</div>
        <div className="community-hub-content-hero-desc">
          Watch this introduction to understand what this community offers, how courses work, and how to connect with other learners.
        </div>
        <div className="community-hub-content-hero-play">▶ Watch Introduction</div>
      </div>

      {/* Resource cards */}
      {[
        { icon: '🗺️', title: 'Learning Roadmap', desc: 'Recommended course order for your journey' },
        { icon: '📋', title: 'Community Guidelines', desc: 'Rules and expectations for members' },
        { icon: '📦', title: 'Resources', desc: 'Downloads, templates, and helpful links' },
        { icon: '❓', title: 'FAQ', desc: 'Frequently asked questions about this community' }
      ].map((item, idx) => (
        <div key={idx} className="community-hub-content-card">
          <div className="community-hub-content-icon">{item.icon}</div>
          <div>
            <div className="community-hub-content-title">{item.title}</div>
            <div className="community-hub-content-desc">{item.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCalendarTab = () => {
    // Build a week strip around today
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekDays = [];
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      weekDays.push({
        name: dayNames[d.getDay()],
        num: d.getDate(),
        isToday: d.toDateString() === today.toDateString(),
        hasEvent: i === 2 || i === 4 // Wed and Fri have events
      });
    }

    // Static event data
    const events = [
      { time: '2:00', ampm: 'PM', title: 'Live Q&A Session', meta: `With ${creatorName} · 45 min`, color: '#3b82f6' },
      { time: '7:00', ampm: 'PM', title: 'Study Group', meta: 'Community led · Open to all', color: '#8b5cf6' }
    ];
    const upcomingEvents = [
      { time: '10:00', ampm: 'AM', title: 'Office Hours', meta: `${creatorName} · Next Thursday`, color: '#10b981' },
      { time: '3:00', ampm: 'PM', title: 'Workshop: Advanced Topics', meta: 'Next Saturday · 2 hours', color: '#f59e0b' }
    ];

    return (
      <div className="community-hub-calendar">
        {/* Week strip */}
        <div className="community-hub-cal-week">
          {weekDays.map((day, idx) => (
            <div key={idx} className={`community-hub-cal-day ${day.isToday ? 'today' : ''}`}>
              <div className="community-hub-cal-day-name">{day.name}</div>
              <div className="community-hub-cal-day-num">{day.num}</div>
              {day.hasEvent && <div className="community-hub-cal-dot" />}
            </div>
          ))}
        </div>

        <div className="community-hub-cal-section-title">Today</div>
        {events.map((evt, idx) => (
          <div key={idx} className="community-hub-cal-event">
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

        <div className="community-hub-cal-section-title">Upcoming</div>
        {upcomingEvents.map((evt, idx) => (
          <div key={idx} className="community-hub-cal-event">
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
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'feeds': return renderFeedsTab();
      case 'courses': return renderCoursesTab();
      case 'content': return renderContentTab();
      case 'calendar': return renderCalendarTab();
      default: return renderFeedsTab();
    }
  };

  return (
    <div>
      {renderSearchBar()}
      {effectiveLayoutStyle !== 'wide' && renderHeader()}
      <div ref={sentinelRef} style={{ height: 0, margin: 0 }} />
      <div
        className={`community-hub-sticky-menus ${isDarkMode ? 'dark' : ''} ${isStuck ? 'stuck' : ''} ${effectiveLayoutStyle === 'wide' ? 'wide-mode' : ''}`}
        style={effectiveLayoutStyle === 'wide' ? { marginTop: 0 } : undefined}
      >
        <div className="community-hub-tabs">
          {[
            { id: 'feeds', label: 'Feed' },
            { id: 'courses', label: 'Courses' },
            { id: 'content', label: 'Content' },
            { id: 'calendar', label: 'Calendar' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`community-hub-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'feeds' && renderSubPills()}
      </div>
      {renderTabContent()}
    </div>
  );
};

export default CommunityHub;
