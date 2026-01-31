import React, { useState, useRef, useEffect } from 'react';
import { FaStar, FaClock, FaUsers, FaGraduationCap } from 'react-icons/fa';
import './UserHoverCard.css'; // Reuse same CSS

/**
 * CourseHoverCard Component
 * X.com-style hover popup showing course info with Enroll button
 */
const CourseHoverCard = ({
  course,
  children,
  onEnroll,
  onViewCourse,
  isEnrolled = false,
  gradient = null
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const cardRef = useRef(null);
  const showTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  const showCard = () => {
    clearTimeout(hideTimeoutRef.current);
    showTimeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const cardWidth = 320;
        const cardHeight = 260;

        let top = rect.bottom + 8;
        let left = rect.left + (rect.width / 2) - (cardWidth / 2);

        if (left < 10) left = 10;
        if (left + cardWidth > window.innerWidth - 10) {
          left = window.innerWidth - cardWidth - 10;
        }
        if (top + cardHeight > window.innerHeight - 10) {
          top = rect.top - cardHeight - 8;
        }

        setPosition({ top, left });
        setIsVisible(true);
      }
    }, 300);
  };

  const hideCard = () => {
    clearTimeout(showTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 200);
  };

  const keepCardVisible = () => {
    clearTimeout(hideTimeoutRef.current);
  };

  useEffect(() => {
    return () => {
      clearTimeout(showTimeoutRef.current);
      clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const handleEnrollClick = (e) => {
    e.stopPropagation();
    if (onEnroll) onEnroll(course);
  };

  const handleCardClick = () => {
    if (onViewCourse) onViewCourse(course);
  };

  // Generate display values
  const title = course?.title || 'Course';
  const description = course?.description || '';
  const rating = course?.rating || 4.5;
  const students = course?.enrollmentCount || course?.students || 0;
  const duration = course?.duration || '8 weeks';
  const price = course?.price || 0;
  const instructorName = course?.instructor?.name || course?.instructorName || '';
  const abbrev = title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  // Default gradient
  const defaultGradient = 'linear-gradient(135deg, #7dd3fc 0%, #38bdf8 100%)';
  const bgGradient = gradient || defaultGradient;

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={showCard}
        onMouseLeave={hideCard}
        style={{ display: 'inline' }}
      >
        {children}
      </span>

      {isVisible && (
        <div
          ref={cardRef}
          className="user-hover-card"
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            zIndex: 9999,
            width: 320
          }}
          onMouseEnter={keepCardVisible}
          onMouseLeave={hideCard}
        >
          {/* Course Header */}
          <div className="hover-card-header" onClick={handleCardClick}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              background: bgGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 700,
              color: '#1e40af',
              flexShrink: 0
            }}>
              {abbrev}
            </div>
            <div className="hover-card-names" style={{ gap: 4 }}>
              <span className="hover-card-name" style={{ fontSize: 16 }}>{title}</span>
              {instructorName && (
                <span className="hover-card-handle">by {instructorName}</span>
              )}
            </div>
          </div>

          {/* Description */}
          {description && (
            <div className="hover-card-bio" style={{ marginBottom: 12 }}>
              {description.length > 100 ? description.substring(0, 100) + '...' : description}
            </div>
          )}

          {/* Stats Row */}
          <div style={{
            display: 'flex',
            gap: 16,
            fontSize: 13,
            color: '#64748b',
            marginBottom: 12,
            flexWrap: 'wrap'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <FaStar style={{ color: '#fbbf24' }} />
              {rating.toFixed(1)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <FaUsers style={{ color: '#64748b' }} />
              {students.toLocaleString()} students
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <FaClock style={{ color: '#64748b' }} />
              {duration}
            </span>
          </div>

          {/* Action Button */}
          <div className="hover-card-actions">
            {isEnrolled ? (
              <button
                className="hover-card-btn"
                onClick={handleCardClick}
                style={{
                  flex: 1,
                  background: '#10b981',
                  color: 'white',
                  border: 'none'
                }}
              >
                <FaGraduationCap style={{ marginRight: 6 }} />
                Continue Learning
              </button>
            ) : (
              <button
                className="hover-card-btn"
                onClick={handleEnrollClick}
                style={{
                  flex: 1,
                  background: '#10b981',
                  color: 'white',
                  border: 'none'
                }}
              >
                {price > 0 ? `Enroll $${price}` : 'Enroll Free'}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CourseHoverCard;
