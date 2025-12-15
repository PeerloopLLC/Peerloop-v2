import React, { useState } from 'react';
import { FaStar, FaUsers, FaClock, FaPlay, FaBook, FaCertificate, FaChalkboardTeacher, FaCheck, FaPlus, FaInfinity, FaGraduationCap, FaHeart, FaComment, FaRetweet, FaShare, FaImage, FaLink, FaPaperclip } from 'react-icons/fa';
import { getInstructorById } from '../data/database';
import './MainContent.css';

/**
 * CourseDetailView Component
 * Shows detailed view of a course with tabs and two-column layout
 */
const CourseDetailView = ({ course, onBack, isDarkMode, followedCommunities = [], setFollowedCommunities, onViewInstructor, onEnroll, isCoursePurchased = false, currentUser }) => {
  // Check if this specific course is being followed (within creator's followedCourseIds)
  const [isFollowing, setIsFollowing] = useState(() => {
    if (!course) return false;
    const creatorFollow = followedCommunities.find(c => c.instructorId === course.instructorId);
    return creatorFollow?.followedCourseIds?.includes(course.id) || false;
  });
  const [activeTab, setActiveTab] = useState('feed');
  const [newPostText, setNewPostText] = useState('');
  const [isPosting, setIsPosting] = useState(false);

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

  const tabs = [
    { id: 'feed', label: 'Course Feed' },
    { id: 'overview', label: 'Overview' },
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
        {/* Back button */}
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: isDarkMode ? '#e7e9ea' : '#0f1419',
            fontSize: 18,
            cursor: 'pointer',
            padding: '8px 0',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          ← Back
        </button>

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
                cursor: 'pointer'
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
            <button 
              onClick={() => onEnroll && onEnroll(course)}
              style={{
                background: '#f97316',
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
              Enroll for ${course.price}
            </button>
            {/* Follow button only shows for purchased courses */}
            {isCoursePurchased && (
              <button
                onClick={handleFollowToggle}
                style={{
                  background: isFollowing ? (isDarkMode ? '#16181c' : '#f7f9f9') : 'transparent',
                  border: isDarkMode ? '1px solid #536471' : '1px solid #cfd9de',
                  color: isFollowing ? '#1d9bf0' : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                  padding: '12px 28px',
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                {isFollowing ? <><FaCheck /> Following</> : <><FaPlus /> Follow</>}
              </button>
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

              {/* Course Description */}
              <div style={{ marginBottom: 32 }}>
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

          {activeTab === 'reviews' && (
            <div style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⭐</div>
              <h3 style={{ color: isDarkMode ? '#e7e9ea' : '#0f1419', marginBottom: 8 }}>No Reviews Yet</h3>
              <p style={{ color: isDarkMode ? '#71767b' : '#536471' }}>Be the first to review this course!</p>
            </div>
          )}

          {activeTab === 'feed' && (
            <div>
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
            </div>
          )}
        </div>

        {/* Right Sidebar - Hidden on Course Feed tab and on small screens */}
        {activeTab !== 'feed' && (
        <div className="course-detail-sidebar" style={{ width: 300, flexShrink: 0 }}>
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
              color: isDarkMode ? '#e7e9ea' : '#0f1419',
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
                      Instructor
                    </div>
                  </div>
                </div>
                
                <p style={{ 
                  fontSize: 14, 
                  color: isDarkMode ? '#71767b' : '#536471', 
                  lineHeight: 1.5,
                  marginBottom: 12
                }}>
                  {instructor.bio?.substring(0, 120) || `Expert instructor teaching ${course.category} courses.`}...
                </p>
                
                {onViewInstructor && (
                  <button
                    onClick={() => onViewInstructor(instructor.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#1d9bf0',
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    View Profile →
                  </button>
                )}
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
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailView;
