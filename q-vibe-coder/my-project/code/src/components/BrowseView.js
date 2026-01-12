import React from 'react';
import PropTypes from 'prop-types';
import { FaBook, FaUser, FaSearch } from 'react-icons/fa';
import { AiOutlineStar, AiOutlineTeam, AiOutlineClockCircle, AiOutlineBarChart } from 'react-icons/ai';
import CourseDetailView from './CourseDetailView';
import EnrollmentFlow from './EnrollmentFlow';
import { getInstructorById, getCourseById, getInstructorWithCourses } from '../data/database';

/**
 * BrowseView - Displays the Browse page with Course Listings and Creator Profiles tabs
 * Extracted from MainContent.js for better code organization
 */
const BrowseView = ({
  isDarkMode,
  currentUser,
  onMenuChange,
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
  handleFollowCourse
}) => {
  // Render instructor profile detail view
  const renderInstructorProfile = () => {
    const creator = selectedInstructor;
    const creatorCourses = creator.courses
      ? creator.courses.map(c => typeof c === 'object' ? c : indexedCourses.find(course => course.id === c)).filter(Boolean)
      : [];

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
                // Navigate back to Feeds
                setSelectedInstructor(null);
                setPreviousBrowseContext(null);
                if (onMenuChange) onMenuChange('My Community');
              } else if (previousBrowseContext?.type === 'my-courses') {
                // Navigate back to My Courses
                setSelectedInstructor(null);
                setPreviousBrowseContext(null);
                if (onMenuChange) onMenuChange('My Courses');
              } else if (previousBrowseContext?.type === 'course' && previousBrowseContext.course) {
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
          background: isDarkMode ? '#0a0a0a' : '#fff',
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
            <img
              src={creator.avatar}
              alt={creator.name}
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                objectFit: 'cover',
                flexShrink: 0
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>{creator.name}</h1>
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
                        background: isFollowing ? '#64748b' : '#1d9bf0',
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
                        background: isFollowing ? '#64748b' : '#1d9bf0',
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

        {/* Section Header */}
        <div style={{
          padding: '12px 16px',
          background: isDarkMode ? '#000' : '#f8fafc',
          borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <FaBook style={{ fontSize: 14, color: '#1d9bf0' }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>
            COURSES BY {creator.name.toUpperCase()} ({creatorCourses.length})
          </span>
        </div>

        {/* Courses List */}
        <div style={{ padding: '0' }}>
          {creatorCourses.length > 0 ? (
            creatorCourses.map(course => {
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#0f1419' }}>{course.title}</h3>
                      {course.badge && (
                        <span style={{
                          background: course.badge === 'Bestseller' ? '#fbbf24' :
                                     course.badge === 'Popular' ? '#1d9bf0' :
                                     course.badge === 'New' ? '#22c55e' :
                                     course.badge === 'Featured' ? '#a855f7' : '#6b7280',
                          color: course.badge === 'Bestseller' ? '#000' : '#fff',
                          padding: '2px 6px',
                          borderRadius: 10,
                          fontSize: 10,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          flexShrink: 0
                        }}>
                          {course.badge}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 15, color: isDarkMode ? '#71767b' : '#536471', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><AiOutlineStar /> {course.rating} ({course.ratingCount || 0})</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><AiOutlineTeam /> {course.students?.toLocaleString()}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><AiOutlineBarChart /> {course.level}</span>
                      <span style={{ color: '#1d9bf0', fontWeight: 700 }}>{course.price}</span>
                      <span
                        onClick={(e) => { e.stopPropagation(); setSelectedCourse(course); }}
                        style={{ color: '#1d9bf0', cursor: 'pointer', fontWeight: 500 }}
                        onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={e => e.target.style.textDecoration = 'none'}
                      >
                        View course →
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    {isCoursePurchased(course.id) ? (
                      <>
                        <span
                          style={{
                            background: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
                            color: '#10b981',
                            padding: '4px 12px',
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 600,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Enrolled
                        </span>
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
                          {isFollowed ? 'Unfollow' : 'Follow'}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setEnrollingCourse(course);
                          setShowEnrollmentFlow(true);
                        }}
                        style={{
                          background: '#10b981',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 16px',
                          borderRadius: 20,
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: 'pointer',
                          flexShrink: 0
                        }}
                      >
                        Enroll
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: isDarkMode ? '#71767b' : '#536471' }}>
              No courses available yet.
            </div>
          )}
        </div>
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
                  setEnrollingCourse(null);
                  onMenuChange('Dashboard');
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
                      setShowEnrollmentFlow(true);
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
                      setShowEnrollmentFlow(true);
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
  handleFollowCourse: PropTypes.func.isRequired
};

export default BrowseView;
