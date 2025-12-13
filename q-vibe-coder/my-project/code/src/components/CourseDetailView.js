import React, { useState } from 'react';
import { FaStar, FaUsers, FaClock, FaPlay, FaBook, FaDollarSign, FaCertificate, FaChalkboardTeacher, FaCheck, FaHeart, FaUserGraduate } from 'react-icons/fa';
import { getInstructorById, getCourseById } from '../data/database';

/**
 * CourseDetailView Component
 * Shows detailed view of a course with back navigation
 */
const CourseDetailView = ({ course, onBack, isDarkMode, followedCommunities = [], setFollowedCommunities, onViewInstructor, onEnroll }) => {
  const [isFollowing, setIsFollowing] = useState(() => {
    return followedCommunities.some(c => c.id === `course-${course?.id}`);
  });

  if (!course) {
    return (
      <div style={{ 
        background: 'var(--bg-primary, #000)', 
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
              color: 'var(--text-primary, #e7e9ea)',
              fontSize: 20,
              cursor: 'pointer',
              padding: 8,
              borderRadius: '50%'
            }}
          >
            ←
          </button>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary, #e7e9ea)' }}>
            Course
          </h1>
        </div>
        
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-secondary, #71767b)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
          <h2 style={{ color: 'var(--text-primary, #e7e9ea)', marginBottom: 8 }}>Course Not Found</h2>
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
  
  // Generate a color based on the course category
  const categoryColors = {
    'AI & Machine Learning': '#FF6B6B',
    'Web Development': '#4ECDC4',
    'Cloud Computing': '#FF9900',
    'Data Science': '#794BC4',
    'Business': '#3498DB',
    'Robotics': '#50C878',
    'Healthcare': '#E74C3C',
    'Programming': '#FFD93D'
  };
  const themeColor = categoryColors[course.category] || '#1d9bf0';

  const handleFollowToggle = () => {
    if (setFollowedCommunities) {
      const courseCommunityId = `course-${course.id}`;
      if (isFollowing) {
        setFollowedCommunities(prev => prev.filter(c => c.id !== courseCommunityId));
      } else {
        const courseCommunity = {
          id: courseCommunityId,
          name: course.title,
          type: 'course',
          courseId: course.id,
          instructorId: course.instructorId
        };
        setFollowedCommunities(prev => [...prev, courseCommunity]);
      }
      setIsFollowing(!isFollowing);
    }
  };

  return (
    <div style={{ 
      background: 'var(--bg-primary, #000)', 
      minHeight: '100vh'
    }}>
      {/* Header with back button */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-color, #2f3336)',
        position: 'sticky',
        top: 0,
        background: 'var(--bg-primary, #000)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary, #e7e9ea)',
              fontSize: 20,
              cursor: 'pointer',
              padding: 8,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
            title="Go back"
          >
            ←
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary, #e7e9ea)' }}>
              Course Details
            </h1>
          </div>
        </div>
        
        {/* Follow Button */}
        <button
          onClick={handleFollowToggle}
          style={{
            background: isFollowing ? 'transparent' : themeColor,
            border: isFollowing ? `1px solid ${themeColor}` : 'none',
            color: isFollowing ? themeColor : '#fff',
            padding: '8px 20px',
            borderRadius: 20,
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          {isFollowing ? <><FaCheck /> Following</> : <><FaHeart /> Follow</>}
        </button>
      </div>

      {/* Course Content */}
      <div style={{ padding: '0' }}>
        {/* Banner */}
        <div style={{
          background: `linear-gradient(135deg, ${themeColor} 0%, ${adjustColor(themeColor, -30)} 100%)`,
          height: 180,
          display: 'flex',
          alignItems: 'flex-end',
          padding: 24
        }}>
          <div>
            <span style={{
              background: 'rgba(255,255,255,0.2)',
              color: '#fff',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600
            }}>
              {course.category}
            </span>
          </div>
        </div>

        {/* Course Info */}
        <div style={{ padding: '24px' }}>
          <h1 style={{ 
            fontSize: 28, 
            fontWeight: 700, 
            marginBottom: 12, 
            color: 'var(--text-primary, #e7e9ea)',
            lineHeight: 1.3
          }}>
            {course.title}
          </h1>

          <p style={{ 
            fontSize: 16, 
            color: 'var(--text-secondary, #71767b)', 
            lineHeight: 1.6,
            marginBottom: 24
          }}>
            {course.description}
          </p>

          {/* Instructor */}
          {instructor && (
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 16,
                background: 'var(--bg-secondary, #16181c)',
                borderRadius: 12,
                marginBottom: 24,
                cursor: onViewInstructor ? 'pointer' : 'default'
              }}
              onClick={() => onViewInstructor && onViewInstructor(instructor.id)}
              onMouseEnter={e => onViewInstructor && (e.currentTarget.style.background = 'var(--bg-hover, #1d1f23)')}
              onMouseLeave={e => onViewInstructor && (e.currentTarget.style.background = 'var(--bg-secondary, #16181c)')}
            >
              <div style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: themeColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 20,
                fontWeight: 700
              }}>
                {instructorInitials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--text-primary, #e7e9ea)' }}>
                  {instructor.name}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary, #71767b)' }}>
                  <FaChalkboardTeacher style={{ marginRight: 4 }} />
                  Course Creator
                </div>
              </div>
              {onViewInstructor && (
                <span style={{ color: '#1d9bf0', fontSize: 14 }}>View Profile →</span>
              )}
            </div>
          )}

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 16,
            marginBottom: 24
          }}>
            <div style={{
              background: 'var(--bg-secondary, #16181c)',
              padding: 16,
              borderRadius: 12,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#fbbf24', marginBottom: 4 }}>
                <FaStar style={{ marginRight: 4 }} />
                {course.rating}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary, #71767b)' }}>Rating</div>
            </div>
            <div style={{
              background: 'var(--bg-secondary, #16181c)',
              padding: 16,
              borderRadius: 12,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1d9bf0', marginBottom: 4 }}>
                <FaUsers style={{ marginRight: 4 }} />
                {course.students?.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary, #71767b)' }}>Students</div>
            </div>
            <div style={{
              background: 'var(--bg-secondary, #16181c)',
              padding: 16,
              borderRadius: 12,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981', marginBottom: 4 }}>
                <FaClock style={{ marginRight: 4 }} />
                {course.duration}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary, #71767b)' }}>Duration</div>
            </div>
            <div style={{
              background: 'var(--bg-secondary, #16181c)',
              padding: 16,
              borderRadius: 12,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: themeColor, marginBottom: 4 }}>
                <FaDollarSign />
                {course.price}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary, #71767b)' }}>Price</div>
            </div>
          </div>

          {/* What You'll Learn */}
          {course.curriculum && course.curriculum.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary, #e7e9ea)' }}>
                <FaBook style={{ marginRight: 8 }} />
                What You'll Learn
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {course.curriculum.slice(0, 6).map((item, idx) => {
                  // Handle both string and object curriculum items
                  const title = typeof item === 'object' ? item.title : item;
                  const duration = typeof item === 'object' ? item.duration : null;
                  
                  return (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 16px',
                      background: 'var(--bg-secondary, #16181c)',
                      borderRadius: 8
                    }}>
                      <FaPlay style={{ color: themeColor, fontSize: 12, flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-primary, #e7e9ea)', fontSize: 14, flex: 1 }}>{title}</span>
                      {duration && (
                        <span style={{ color: 'var(--text-secondary, #71767b)', fontSize: 12 }}>{duration}</span>
                      )}
                    </div>
                  );
                })}
                {course.curriculum.length > 6 && (
                  <div style={{ 
                    color: 'var(--text-secondary, #71767b)', 
                    fontSize: 14, 
                    paddingLeft: 16 
                  }}>
                    + {course.curriculum.length - 6} more modules
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {course.tags && course.tags.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary, #e7e9ea)' }}>
                Topics
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {course.tags.map((tag, idx) => (
                  <span key={idx} style={{
                    background: 'var(--bg-secondary, #2f3336)',
                    color: 'var(--text-primary, #e7e9ea)',
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontSize: 13
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          <div style={{
            background: `linear-gradient(135deg, ${themeColor}15 0%, ${themeColor}05 100%)`,
            border: `1px solid ${themeColor}30`,
            borderRadius: 12,
            padding: 20,
            marginBottom: 24
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary, #e7e9ea)' }}>
              <FaCertificate style={{ marginRight: 8, color: themeColor }} />
              Course Features
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {[
                { icon: <FaUserGraduate />, text: '1-on-1 Student-Teacher Sessions' },
                { icon: <FaCertificate />, text: 'Certificate of Completion' },
                { icon: <FaChalkboardTeacher />, text: 'Become a Student-Teacher' },
                { icon: <FaDollarSign />, text: 'Earn 70% Teaching Others' }
              ].map((feature, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: themeColor }}>{feature.icon}</span>
                  <span style={{ fontSize: 14, color: 'var(--text-primary, #e7e9ea)' }}>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button 
              onClick={() => onEnroll && onEnroll(course)}
              style={{
                flex: 1,
                background: themeColor,
                color: '#fff',
                border: 'none',
                padding: '16px 24px',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}>
              <FaPlay />
              Enroll Now - ${course.price}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to adjust color brightness
function adjustColor(color, amount) {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default CourseDetailView;

