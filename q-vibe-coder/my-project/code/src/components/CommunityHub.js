import React, { useState } from 'react';
import './CommunityHub.css';
import { FaHeart, FaComment, FaRetweet, FaBookmark, FaShare } from 'react-icons/fa';
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
  onSubmitPost
}) => {
  const [activeTab, setActiveTab] = useState('feeds');
  const [activeFeedPill, setActiveFeedPill] = useState('main');

  const creatorName = creatorData?.name || instructor?.name || 'Creator';
  const creatorInitials = creatorName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  const allCourses = creatorData?.allCourses || [];
  const followedCourseIds = creatorData?.followedCourseIds || [];

  // Build feed pills: Main Hall + each course
  const feedPills = [
    { id: 'main', label: 'Main Hall' },
    ...allCourses.map(c => ({ id: c.id, label: c.title }))
  ];

  // Filter posts based on active feed pill
  const filteredPosts = activeFeedPill === 'main'
    ? displayedPosts
    : displayedPosts.filter(p => p.courseId === activeFeedPill);

  // Course emoji based on title keywords
  const getCourseEmoji = (title) => {
    const t = (title || '').toLowerCase();
    if (t.includes('react') || t.includes('frontend')) return '⚛️';
    if (t.includes('node') || t.includes('backend')) return '🟢';
    if (t.includes('typescript')) return '🔷';
    if (t.includes('ai') || t.includes('machine')) return '🤖';
    if (t.includes('design') || t.includes('ux')) return '🎨';
    if (t.includes('python') || t.includes('data')) return '🐍';
    if (t.includes('system')) return '🏗️';
    if (t.includes('devops') || t.includes('deploy')) return '🚀';
    return '📚';
  };

  const renderHeader = () => (
    <div className={`community-hub-header ${isDarkMode ? 'dark' : ''}`}>
      <div className="community-hub-geo-1" />
      <div className="community-hub-geo-2" />
      <div className="community-hub-geo-3" />
      <div className="community-hub-creator-row">
        <div className="community-hub-avatar">{creatorInitials}</div>
        <div>
          <h2 className="community-hub-creator-name">{creatorName}'s Community</h2>
          <div className="community-hub-creator-subtitle">
            {instructor?.title || 'Creator & Educator'}
          </div>
        </div>
      </div>
      <div className="community-hub-stats">
        <div className="community-hub-stat">
          <div className="community-hub-stat-value">{instructor?.students?.toLocaleString() || '—'}</div>
          <div className="community-hub-stat-label">Members</div>
        </div>
        <div className="community-hub-stat">
          <div className="community-hub-stat-value">{allCourses.length}</div>
          <div className="community-hub-stat-label">Courses</div>
        </div>
        <div className="community-hub-stat">
          <div className="community-hub-stat-value">{displayedPosts.length}</div>
          <div className="community-hub-stat-label">Posts</div>
        </div>
        <div className="community-hub-stat">
          <div className="community-hub-stat-value">{allCourses.length > 0 ? Math.floor(allCourses.length * 2.5) : 0}</div>
          <div className="community-hub-stat-label">Events</div>
        </div>
      </div>
    </div>
  );

  const renderTabs = () => (
    <div className="community-hub-tabs">
      {[
        { id: 'feeds', label: 'Feeds' },
        { id: 'courses', label: 'Courses', count: allCourses.length },
        { id: 'content', label: 'Content' },
        { id: 'calendar', label: 'Calendar' }
      ].map(tab => (
        <button
          key={tab.id}
          className={`community-hub-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="community-hub-tab-count">{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );

  const renderFeedsTab = () => (
    <div>
      {/* Sub-pills */}
      <div className="community-hub-sub-pills">
        {feedPills.map(pill => (
          <button
            key={pill.id}
            className={`community-hub-sub-pill ${activeFeedPill === pill.id ? 'active' : ''}`}
            onClick={() => setActiveFeedPill(pill.id)}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Inline composer */}
      <div style={{
        padding: '12px 20px',
        borderBottom: `1px solid ${isDarkMode ? '#2f3336' : '#eff3f4'}`,
        display: 'flex',
        gap: 12
      }}>
        <div style={{
          width: 40, height: 40,
          borderRadius: '50%',
          background: '#2563eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16, fontWeight: 600,
          color: '#fff',
          flexShrink: 0
        }}>
          {currentUser?.name?.[0]?.toUpperCase() || 'G'}
        </div>
        <textarea
          value={newPostText}
          onChange={(e) => setNewPostText?.(e.target.value)}
          onFocus={() => setIsComposerFocused?.(true)}
          placeholder="What's on your mind?"
          rows={1}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: isDarkMode ? '#e7e9ea' : '#0f1419',
            fontSize: 18,
            outline: 'none',
            padding: '8px 0',
            resize: 'none',
            fontFamily: 'inherit'
          }}
        />
        {newPostText?.trim() && (
          <button
            onClick={onSubmitPost}
            disabled={isPosting}
            style={{
              padding: '8px 20px',
              background: '#1d9bf0',
              color: '#fff',
              border: 'none',
              borderRadius: 20,
              fontWeight: 600,
              fontSize: 14,
              cursor: isPosting ? 'not-allowed' : 'pointer',
              alignSelf: 'flex-end',
              opacity: isPosting ? 0.6 : 1
            }}
          >
            {isPosting ? 'Posting...' : 'Post'}
          </button>
        )}
      </div>
      {postError && (
        <div style={{ padding: '8px 20px', color: '#f43f5e', fontSize: 13 }}>{postError}</div>
      )}

      {/* Posts */}
      <div className="community-hub-feed-content">
        {filteredPosts.length > 0 ? filteredPosts.map(post => {
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
            <div key={post.id} style={{
              padding: '16px 20px',
              borderBottom: `1px solid ${isDarkMode ? '#2f3336' : '#eff3f4'}`,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.background = isDarkMode ? '#080808' : '#f7f9f9'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <img
                  src={post.authorAvatar}
                  alt={post.author}
                  onClick={handlePostAuthorClick}
                  style={{
                    width: 40, height: 40,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    cursor: 'pointer'
                  }}
                />
                <div>
                  <UserHoverCard
                    user={{
                      id: post.authorId,
                      name: post.author,
                      handle: post.authorHandle,
                      avatar: post.authorAvatar,
                      bio: post.authorBio
                    }}
                    onViewProfile={handlePostAuthorClick}
                    currentUserId={currentUser?.id}
                  >
                    <span style={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: isDarkMode ? '#e7e9ea' : '#0f1419',
                      cursor: 'pointer'
                    }}
                      onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                      onClick={handlePostAuthorClick}
                    >
                      {post.author}
                    </span>
                  </UserHoverCard>
                  <span style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 14, marginLeft: 4 }}>
                    {post.authorHandle}
                  </span>
                  <span style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 14, marginLeft: 4 }}>
                    · {post.timestamp}
                  </span>
                </div>
              </div>
              {course && (
                <div style={{
                  fontSize: 12,
                  color: '#1d9bf0',
                  marginBottom: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  📚 {course.title}
                </div>
              )}
              <div style={{
                fontSize: 15,
                lineHeight: 1.5,
                color: isDarkMode ? '#e7e9ea' : '#0f1419',
                marginBottom: 12
              }}>
                {post.content}
              </div>
              <div style={{ display: 'flex', gap: 40, color: isDarkMode ? '#71767b' : '#536471', fontSize: 13 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <FaComment size={14} /> {post.replies || 0}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <FaRetweet size={14} /> {post.retweets || 0}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <FaHeart size={14} /> {post.likes || 0}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <FaBookmark size={14} />
                </span>
              </div>
            </div>
          );
        }) : (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: isDarkMode ? '#71767b' : '#536471'
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>
              No posts yet
            </div>
            <div style={{ fontSize: 14 }}>Be the first to share something in this community!</div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCoursesTab = () => (
    <div className="community-hub-courses">
      {allCourses.length > 0 ? allCourses.map(course => {
        const isFollowed = followedCourseIds.includes(course.id);
        // Simulate progress for followed courses
        const progress = isFollowed ? Math.floor(Math.random() * 80 + 10) : 0;

        return (
          <div
            key={course.id}
            className="community-hub-course-card"
            onClick={() => onViewCourse?.(course)}
          >
            <div className="community-hub-course-thumb">
              {getCourseEmoji(course.title)}
            </div>
            <div className="community-hub-course-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="community-hub-course-title">{course.title}</div>
                {course.badge && (
                  <span style={{
                    fontSize: 10,
                    padding: '2px 8px',
                    background: course.badge === 'Bestseller' ? '#1a3a2a' : '#1e3a5f',
                    color: course.badge === 'Bestseller' ? '#22c55e' : '#3b82f6',
                    borderRadius: 8,
                    fontWeight: 600
                  }}>
                    {course.badge}
                  </span>
                )}
              </div>
              <div className="community-hub-course-meta">
                {course.sessions?.count || '—'} sessions · {course.duration} · {course.level}
              </div>
              {isFollowed ? (
                <>
                  <div className="community-hub-progress-bar">
                    <div className="community-hub-progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="community-hub-progress-label">
                    <span>{progress}%</span>
                    <span>In progress</span>
                  </div>
                </>
              ) : (
                <span className="community-hub-course-status" style={{
                  background: '#1e3a5f',
                  color: '#3b82f6'
                }}>
                  Not enrolled
                </span>
              )}
            </div>
          </div>
        );
      }) : (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          color: isDarkMode ? '#71767b' : '#536471'
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📚</div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>
            No courses yet
          </div>
          <div style={{ fontSize: 14 }}>This creator hasn't published any courses yet.</div>
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
      {renderHeader()}
      {renderTabs()}
      {renderTabContent()}
    </div>
  );
};

export default CommunityHub;
