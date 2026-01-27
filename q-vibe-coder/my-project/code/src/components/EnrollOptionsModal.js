import React from 'react';
import { FaTimes } from 'react-icons/fa';

/**
 * EnrollOptionsModal - Shows enrollment options when user clicks Enroll
 * Options:
 * 1. Get Instant Access - Buy course, get instant access to feeds
 * 2. Choose Your Teacher - Browse certified student teachers
 * 3. Choose Your Schedule - Choose date, then see available teachers
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
  const textPrimary = isDarkMode ? '#e7e9ea' : '#0f172a';
  const textSecondary = isDarkMode ? '#71767b' : '#64748b';
  const borderColor = isDarkMode ? '#2f3336' : '#e2e8f0';

  const options = [
    {
      id: 'purchase',
      title: 'Get Instant Access',
      description: 'Start with course feed now. Schedule 1-on-1 sessions later.',
      onClick: onSelectPurchase
    },
    {
      id: 'find-teacher',
      title: 'Choose Your Teacher',
      description: 'Browse student teachers. See availability and book sessions.',
      onClick: onSelectFindTeacher
    },
    {
      id: 'pick-date',
      title: 'Choose Your Schedule',
      description: 'Pick dates that work for you. See who\'s available.',
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
          padding: '20px 24px',
          borderBottom: `1px solid ${borderColor}`,
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'transparent',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: textSecondary
            }}
          >
            <FaTimes size={14} />
          </button>
          <h3 style={{
            fontSize: 18,
            fontWeight: 600,
            color: textPrimary,
            margin: 0,
            paddingRight: 40,
            lineHeight: 1.4
          }}>
            How do you want to enroll in {course?.title || 'this course'}?
          </h3>
        </div>

        {/* Options */}
        <div>
          {options.map((option, index) => (
            <button
              key={option.id}
              onClick={option.onClick}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderTop: index > 0 ? `1px solid ${borderColor}` : 'none',
                border: 'none',
                borderBottom: 'none',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {/* Content */}
              <div style={{ flex: 1 }}>
                <h4 style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: textPrimary,
                  margin: 0,
                  marginBottom: 4
                }}>
                  {option.title}
                </h4>
                <p style={{
                  fontSize: 13,
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
                fontSize: 20,
                marginLeft: 12
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
