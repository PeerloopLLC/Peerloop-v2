import React, { useState, useRef, useEffect } from 'react';
import './CommunityHub.css';
import { FaHeart, FaComment, FaRetweet, FaBookmark, FaShare, FaImage, FaLink, FaPaperclip, FaBook } from 'react-icons/fa';
import { AiOutlineStar, AiOutlineTeam } from 'react-icons/ai';
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

  const renderHeader = () => (
    <div className={`community-hub-header ${isDarkMode ? 'dark' : ''}`}>
      {/* Geometric shapes - 3B Pattern */}
      {!isDarkMode && (
        <>
          <div style={{
            position: 'absolute', top: 10, right: 10,
            width: 60, height: 60,
            border: '2px solid rgba(255,255,255,0.15)',
            borderRadius: 12, transform: 'rotate(15deg)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', bottom: 20, left: -10,
            width: 80, height: 80,
            border: '2px solid rgba(255,255,255,0.1)',
            borderRadius: '50%', pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', top: '50%', right: -20,
            width: 40, height: 40,
            background: 'rgba(255,255,255,0.08)',
            transform: 'rotate(45deg)', pointerEvents: 'none'
          }} />
        </>
      )}

      {/* Top Row: Avatar + Name + Stats */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12, position: 'relative', zIndex: 1 }}>
        {/* Community Circle Avatar */}
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: isDarkMode ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' : 'rgba(255,255,255,0.2)',
          border: '3px solid rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 'var(--fs-28)', flexShrink: 0
        }}>
          👥
        </div>
        <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, fontSize: 'var(--fs-20)', fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#ffffff' }}>
              {instructor?.communityName || `${creatorName}'s Community`}
            </h1>
            <span style={{ color: isDarkMode ? '#71767b' : 'rgba(255,255,255,0.7)' }}>·</span>
            <span style={{ color: '#1d9bf0', fontSize: 'var(--fs-15)', fontWeight: 600, cursor: 'pointer' }}>
              Following
            </span>
          </div>
          <p style={{ margin: '2px 0 0 0', color: isDarkMode ? '#71767b' : 'rgba(255,255,255,0.85)', fontSize: 'var(--fs-17)' }}>
            {instructor?.title || 'Creator & Educator'}
          </p>
          {/* Inline Stats */}
          <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: 'var(--fs-17)', color: isDarkMode ? '#71767b' : 'rgba(255,255,255,0.75)', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><AiOutlineStar /> {instructor?.stats?.averageRating || '4.8'}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><AiOutlineTeam /> {(instructor?.stats?.studentsTaught || 0).toLocaleString()} students</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FaBook style={{ fontSize: 14 }} /> {allCourses.length} courses</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      {instructor?.bio && (
        <p style={{
          margin: '0 0 12px 0',
          color: isDarkMode ? '#e7e9ea' : 'rgba(255,255,255,0.9)',
          fontSize: 'var(--fs-17)', lineHeight: 1.5,
          position: 'relative', zIndex: 1
        }}>
          {instructor.bio}
        </p>
      )}

      {/* Credentials */}
      {instructor?.qualifications && instructor.qualifications.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 0, position: 'relative', zIndex: 1 }}>
          {instructor.qualifications.slice(0, 3).map((qual, index) => (
            <span key={index} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 'var(--fs-17)',
              color: isDarkMode ? '#71767b' : 'rgba(255,255,255,0.8)'
            }}>
              <span style={{ color: isDarkMode ? '#1d9bf0' : 'rgba(255,255,255,0.9)' }}>✓</span>
              {qual.sentence}
            </span>
          ))}
        </div>
      )}


    </div>
  );

  const getUserInitials = () => {
    if (currentUser?.name) {
      return currentUser.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const renderSubPills = () => (
    <div className="course-pills-container" style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      overflowX: 'auto',
      overflowY: 'hidden',
      padding: '12px 16px',
      scrollbarWidth: 'none',
      borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
      background: isDarkMode ? '#000' : '#f0f4ff'
    }}>
      {/* Main Hall Pill */}
      <button
        onClick={() => setSelectedCourseFilters([])}
        className={`course-pill ${isMainHallSelected ? 'course-pill-selected' : ''}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 16px',
          borderRadius: 20,
          border: isMainHallSelected
            ? '2px solid #1d9bf0'
            : (isDarkMode ? '2px solid #536471' : '2px solid #cfd9de'),
          background: isMainHallSelected
            ? (isDarkMode ? 'rgba(29, 155, 240, 0.15)' : 'rgba(29, 155, 240, 0.1)')
            : (isDarkMode ? '#2f3336' : '#e8ebee'),
          color: isMainHallSelected
            ? '#1d9bf0'
            : (isDarkMode ? '#e7e9ea' : '#0f1419'),
          fontSize: 'var(--fs-14)',
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          transition: 'all 0.2s ease'
        }}
      >
        Main Hall
      </button>

      {/* Course Pills - Only purchased courses */}
      {purchasedCourses.map(course => {
        const isSelected = selectedCourseFilters.length === 1 && selectedCourseFilters[0].id === course.id;
        return (
          <button
            key={course.id}
            onClick={() => {
              setSelectedCourseFilters([{ id: course.id, name: course.title }]);
            }}
            className={`course-pill ${isSelected ? 'course-pill-selected' : ''}`}
            title={course.title}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 20,
              border: isSelected
                ? '2px solid #1d9bf0'
                : (isDarkMode ? '2px solid #536471' : '2px solid #cfd9de'),
              background: isSelected
                ? (isDarkMode ? 'rgba(29, 155, 240, 0.15)' : 'rgba(29, 155, 240, 0.1)')
                : (isDarkMode ? '#2f3336' : '#e8ebee'),
              color: isSelected
                ? '#1d9bf0'
                : (isDarkMode ? '#e7e9ea' : '#0f1419'),
              fontSize: 'var(--fs-14)',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.2s ease'
            }}
          >
            {course.title}
          </button>
        );
      })}
    </div>
  );

  const renderFeedsTab = () => (
    <div>
      {/* Post Composer - Same as classic feed */}
      <div
        className="post-composer"
        style={{
          borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
          padding: '12px 16px 16px 16px',
          background: isDarkMode ? 'rgba(29, 155, 240, 0.03)' : 'rgba(29, 155, 240, 0.02)',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div style={{
          border: isDarkMode ? '1px solid #2f3336' : '1px solid #cfd9de',
          borderRadius: 12,
          background: isDarkMode ? '#0a0a0a' : '#fff',
          overflow: 'hidden',
          boxSizing: 'border-box',
          width: '100%',
          position: 'relative'
        }}>
          {/* Locked Overlay for new users */}
          {currentUser?.isNewUser && !signupCompleted && (
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: isDarkMode ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(2px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              borderRadius: 12
            }}>
              <div style={{ textAlign: 'center', padding: '16px 24px' }}>
                <div style={{ fontSize: 'var(--fs-24)', marginBottom: 8 }}>🔒</div>
                <div style={{
                  color: isDarkMode ? '#e7e9ea' : '#0f1419',
                  fontSize: 'var(--fs-15)',
                  fontWeight: 600,
                  marginBottom: 4
                }}>
                  Complete signup to share a post
                </div>
                <div style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 13 }}>
                  Select your interests below to unlock posting
                </div>
              </div>
            </div>
          )}
          {/* Text Area with Avatar */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            padding: '12px 14px',
            gap: 10,
            opacity: (currentUser?.isNewUser && !signupCompleted) ? 0.4 : 1
          }}>
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                onClick={() => onMenuChange && onMenuChange('Profile')}
                style={{
                  width: 32, height: 32,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  flexShrink: 0,
                  marginTop: 2,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                title="View your profile"
              />
            ) : (
              <div
                onClick={() => onMenuChange && onMenuChange('Profile')}
                style={{
                  width: 32, height: 32,
                  borderRadius: '50%',
                  background: '#1d9bf0',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--fs-12)',
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: 2,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                title="View your profile"
              >
                {getUserInitials()}
              </div>
            )}
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText?.(e.target.value)}
              onFocus={() => setIsComposerFocused?.(true)}
              placeholder={
                selectedCourseFilters.length > 0
                  ? `Discuss ${selectedCourseFilters[0].name}...`
                  : "Ask a question or share an insight..."
              }
              disabled={currentUser?.isNewUser && !signupCompleted}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                resize: 'none',
                fontSize: 'var(--fs-15)',
                fontWeight: 400,
                lineHeight: 1.5,
                background: (isDarkMode ? '#2f3336' : '#f7f9f9'),
                color: isDarkMode ? '#e7e9ea' : '#0f1419',
                padding: 0,
                minHeight: 50,
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                display: 'block'
              }}
            />
          </div>

          {/* Bottom Action Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 12px',
            borderTop: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
            background: isDarkMode ? '#16181c' : '#f7f9f9',
            width: '100%',
            boxSizing: 'border-box',
            opacity: (currentUser?.isNewUser && !signupCompleted) ? 0.4 : 1
          }}>
            {/* Media Icons */}
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                disabled={currentUser?.isNewUser && !signupCompleted}
                style={{
                  background: isDarkMode ? 'rgba(29, 155, 240, 0.1)' : 'rgba(29, 155, 240, 0.08)',
                  border: 'none',
                  color: '#1d9bf0',
                  cursor: (currentUser?.isNewUser && !signupCompleted) ? 'not-allowed' : 'pointer',
                  padding: '6px 8px',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--fs-16)',
                  transition: 'background 0.2s'
                }}
                title="Add image"
                onMouseEnter={e => !(currentUser?.isNewUser && !signupCompleted) && (e.currentTarget.style.background = isDarkMode ? 'rgba(29, 155, 240, 0.2)' : 'rgba(29, 155, 240, 0.15)')}
                onMouseLeave={e => e.currentTarget.style.background = isDarkMode ? 'rgba(29, 155, 240, 0.1)' : 'rgba(29, 155, 240, 0.08)'}
              >
                <FaImage />
              </button>
              <button
                disabled={currentUser?.isNewUser && !signupCompleted}
                style={{
                  background: isDarkMode ? 'rgba(29, 155, 240, 0.1)' : 'rgba(29, 155, 240, 0.08)',
                  border: 'none',
                  color: '#1d9bf0',
                  cursor: (currentUser?.isNewUser && !signupCompleted) ? 'not-allowed' : 'pointer',
                  padding: '6px 8px',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--fs-16)',
                  transition: 'background 0.2s'
                }}
                title="Add link"
                onMouseEnter={e => !(currentUser?.isNewUser && !signupCompleted) && (e.currentTarget.style.background = isDarkMode ? 'rgba(29, 155, 240, 0.2)' : 'rgba(29, 155, 240, 0.15)')}
                onMouseLeave={e => e.currentTarget.style.background = isDarkMode ? 'rgba(29, 155, 240, 0.1)' : 'rgba(29, 155, 240, 0.08)'}
              >
                <FaLink />
              </button>
              <button
                disabled={currentUser?.isNewUser && !signupCompleted}
                style={{
                  background: isDarkMode ? 'rgba(29, 155, 240, 0.1)' : 'rgba(29, 155, 240, 0.08)',
                  border: 'none',
                  color: '#1d9bf0',
                  cursor: (currentUser?.isNewUser && !signupCompleted) ? 'not-allowed' : 'pointer',
                  padding: '6px 8px',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--fs-16)',
                  transition: 'background 0.2s'
                }}
                title="Attach file"
                onMouseEnter={e => !(currentUser?.isNewUser && !signupCompleted) && (e.currentTarget.style.background = isDarkMode ? 'rgba(29, 155, 240, 0.2)' : 'rgba(29, 155, 240, 0.15)')}
                onMouseLeave={e => e.currentTarget.style.background = isDarkMode ? 'rgba(29, 155, 240, 0.1)' : 'rgba(29, 155, 240, 0.08)'}
              >
                <FaPaperclip />
              </button>
            </div>

            {/* Post Button */}
            <button
              disabled={!newPostText?.trim() || isPosting || (currentUser?.isNewUser && !signupCompleted)}
              onClick={onSubmitPost}
              style={{
                background: '#1d9bf0',
                color: '#fff',
                border: 'none',
                borderRadius: 20,
                padding: '8px 20px',
                fontWeight: 600,
                fontSize: 'var(--fs-14)',
                cursor: (newPostText?.trim() && !isPosting && !(currentUser?.isNewUser && !signupCompleted)) ? 'pointer' : 'not-allowed',
                opacity: (newPostText?.trim() && !isPosting && !(currentUser?.isNewUser && !signupCompleted)) ? 1 : 0.5,
                transition: 'opacity 0.2s'
              }}
            >
              {isPosting ? 'Posting...' : 'Post'}
            </button>
          </div>
          {postError && (
            <div style={{ color: '#f44', fontSize: 'var(--fs-12)', padding: '0 12px 8px' }}>{postError}</div>
          )}
        </div>
      </div>

      {/* Posts Feed - Same post cards as classic feed */}
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
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(255,255,255,0.2)';
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
                      <span className="post-card-dot">·</span>
                      <span className="post-card-timestamp">{post.timestamp}</span>
                    </div>
                    {post.community && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {post.isPinned && (
                          <span style={{
                            background: isDarkMode ? 'rgba(29, 155, 240, 0.2)' : 'rgba(29, 155, 240, 0.1)',
                            color: '#1d9bf0',
                            fontSize: 10,
                            fontWeight: 600,
                            padding: '2px 6px',
                            borderRadius: 4,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3
                          }}>
                            📌 Pinned
                          </span>
                        )}
                        {(post.isTownHallExclusive || post.isCreatorTownHall) ? (
                          <span
                            className="post-card-community"
                            style={{
                              background: post.isCreatorTownHall
                                ? (isDarkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)')
                                : (isDarkMode ? 'rgba(29, 155, 240, 0.15)' : 'rgba(29, 155, 240, 0.1)'),
                              color: post.isCreatorTownHall ? '#8b5cf6' : '#1d9bf0',
                              padding: '2px 8px',
                              borderRadius: 12,
                              fontWeight: 500,
                              cursor: 'default'
                            }}
                          >
                            {post.community}
                          </span>
                        ) : (
                          <span
                            className="post-card-community"
                            onClick={() => {
                              if (onViewCourse && post.courseId) {
                                onViewCourse(post.courseId);
                              }
                            }}
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                            title={`View ${post.community} course`}
                          >
                            in {post.community}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="post-card-content">{post.content}</div>
                <div className="post-card-actions">
                  <button className="post-action-btn">
                    <FaComment />
                    <span>{post.replies}</span>
                  </button>
                  <button className="post-action-btn">
                    <FaRetweet />
                    <span>{Math.floor(post.likes * 0.3)}</span>
                  </button>
                  <button className="post-action-btn">
                    <FaHeart />
                    <span>{post.likes}</span>
                  </button>
                  <button className="post-action-btn">
                    <FaBookmark />
                  </button>
                  <button className="post-action-btn">
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
              background: isDarkMode ? '#16181c' : '#f7f9f9',
              border: isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb',
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: 8
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
              {/* Title + Following */}
              <div style={{
                fontSize: 'var(--fs-15)',
                fontWeight: 600,
                color: isDarkMode ? '#e7e9ea' : '#0f1419',
                marginBottom: 2,
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 6
              }}>
                <span>{course.title}</span>
                {isPurchased && (
                  <>
                    <span style={{ color: isDarkMode ? '#71767b' : '#374151', fontWeight: 400 }}>·</span>
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
              {/* Description */}
              <div style={{
                fontSize: 'var(--fs-14)',
                color: isDarkMode ? '#a0a0a0' : '#374151',
                lineHeight: 1.4,
                marginBottom: 6
              }}>
                {course.description}
              </div>
              {/* Stats Line */}
              <div style={{
                fontSize: 'var(--fs-14)',
                color: isDarkMode ? '#71767b' : '#6b7280',
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
                  background: isDarkMode ? '#2f3336' : '#f7f9f9',
                  border: isDarkMode ? '2px solid #374151' : '2px solid #cfd9de',
                  color: isDarkMode ? '#e7e9ea' : '#0f1419',
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
      {effectiveLayoutStyle !== 'wide' && renderHeader()}
      <div ref={sentinelRef} style={{ height: 0, margin: 0 }} />
      <div
        className={`community-hub-sticky-menus ${isDarkMode ? 'dark' : ''} ${isStuck ? 'stuck' : ''} ${effectiveLayoutStyle === 'wide' ? 'wide-mode' : ''}`}
        style={effectiveLayoutStyle === 'wide' ? { marginTop: 0 } : undefined}
      >
        <div className="community-hub-tabs">
          {[
            { id: 'feeds', label: 'Feeds' },
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
