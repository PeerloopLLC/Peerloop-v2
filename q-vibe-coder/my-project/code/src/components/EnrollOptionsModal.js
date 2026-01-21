import React from 'react';
import { FaPlay, FaSearch, FaCalendarAlt, FaTimes } from 'react-icons/fa';

/**
 * EnrollOptionsModal - Shows enrollment options when user clicks Enroll
 * Options:
 * 1. Purchase Course Now, Schedule Later - Buy course, get instant access
 * 2. Find a Student Teacher - Browse certified student teachers
 * 3. Pick a Date First - Choose date, then see available teachers (existing flow)
 */
const EnrollOptionsModal = ({
  course,
  instructor,
  isDarkMode = true,
  onClose,
  onSelectPurchase,
  onSelectFindTeacher,
  onSelectPickDate
}) => {
  // Colors
  const bgPrimary = isDarkMode ? '#000' : '#fff';
  const bgSecondary = isDarkMode ? '#16181c' : '#f8fafc';
  const textPrimary = isDarkMode ? '#e7e9ea' : '#0f172a';
  const textSecondary = isDarkMode ? '#71767b' : '#64748b';
  const borderColor = isDarkMode ? '#2f3336' : '#e2e8f0';
  const accentBlue = '#1d9bf0';

  const options = [
    {
      id: 'purchase',
      icon: <FaPlay />,
      iconBg: 'rgba(139, 92, 246, 0.2)',
      iconColor: '#8b5cf6',
      title: 'Purchase Course Now, Schedule Later',
      description: 'Get instant access. Schedule a student teacher when you\'re ready.',
      onClick: onSelectPurchase
    },
    {
      id: 'find-teacher',
      icon: <FaSearch />,
      iconBg: 'rgba(59, 130, 246, 0.2)',
      iconColor: '#3b82f6',
      title: 'Find a Student Teacher',
      description: 'Browse certified student teachers. See availability and book sessions.',
      onClick: onSelectFindTeacher
    },
    {
      id: 'pick-date',
      icon: <FaCalendarAlt />,
      iconBg: 'rgba(34, 197, 94, 0.2)',
      iconColor: '#22c55e',
      title: 'Pick a Date First',
      description: 'Choose when you want to learn, then see available student teachers.',
      onClick: onSelectPickDate
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: 20
    }}>
      <div style={{
        background: bgPrimary,
        borderRadius: 16,
        width: '100%',
        maxWidth: 400,
        maxHeight: '90vh',
        overflow: 'hidden',
        border: `1px solid ${borderColor}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          padding: '20px 24px',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff'
            }}
          >
            <FaTimes size={14} />
          </button>
          <h3 style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#fff',
            margin: 0,
            marginBottom: 4
          }}>
            Purchase Course, Schedule Later
          </h3>
          <p style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.9)',
            margin: 0
          }}>
            Choose your learning path
          </p>
        </div>

        {/* Course Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 24px',
          borderBottom: `1px solid ${borderColor}`
        }}>
          <div style={{
            width: 50,
            height: 50,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden'
          }}>
            {course?.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ fontSize: 20 }}>📚</span>
            )}
          </div>
          <div>
            <h4 style={{
              fontSize: 14,
              fontWeight: 600,
              color: textPrimary,
              margin: 0,
              marginBottom: 2
            }}>
              {course?.title || 'Course'}
            </h4>
            <p style={{
              fontSize: 12,
              color: textSecondary,
              margin: 0
            }}>
              by {instructor?.name || 'Instructor'} • {course?.price || '$49'}
            </p>
          </div>
        </div>

        {/* Options */}
        <div style={{ padding: 16 }}>
          {options.map((option, index) => (
            <button
              key={option.id}
              onClick={option.onClick}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                padding: 14,
                borderRadius: 12,
                border: `2px solid transparent`,
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                marginBottom: index < options.length - 1 ? 8 : 0,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDarkMode ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)';
                e.currentTarget.style.borderColor = '#6366f1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              {/* Icon */}
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: option.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: option.iconColor,
                fontSize: 16,
                flexShrink: 0
              }}>
                {option.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <h4 style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: textPrimary,
                  margin: 0,
                  marginBottom: 4
                }}>
                  {option.title}
                </h4>
                <p style={{
                  fontSize: 12,
                  color: textSecondary,
                  margin: 0,
                  lineHeight: 1.4
                }}>
                  {option.description}
                </p>
              </div>

              {/* Arrow */}
              <span style={{
                color: textSecondary,
                fontSize: 18,
                alignSelf: 'center'
              }}>
                ›
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnrollOptionsModal;
