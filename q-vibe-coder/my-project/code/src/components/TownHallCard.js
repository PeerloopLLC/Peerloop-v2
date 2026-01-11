import React from 'react';
import { FaLandmark } from 'react-icons/fa';

/**
 * TownHallCard Component
 * Profile card shown when The Commons is selected in hub mode
 *
 * @param {boolean} isDarkMode - Dark mode flag
 */
const TownHallCard = ({ isDarkMode = false }) => {
  return (
    <div style={{
      background: isDarkMode ? '#1f2937' : '#f9fafb',
      borderRadius: 12,
      padding: '12px 16px',
      margin: '8px 16px 0 16px',
      position: 'relative',
      zIndex: 1,
      border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
      boxShadow: isDarkMode ? '0 4px 25px 10px rgba(80, 80, 80, 0.8)' : 'none'
    }}>
      {/* The Commons Info Row */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10
      }}>
        {/* Avatar */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1d9bf0 0%, #0d8bd9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <FaLandmark style={{ color: '#fff', fontSize: 20 }} />
        </div>

        {/* The Commons Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#1d9bf0',
            lineHeight: 1.2
          }}>
            The Commons
          </div>
          <div style={{
            fontSize: 13,
            color: isDarkMode ? '#71767b' : '#536471'
          }}>
            Community Discussion Hub
          </div>
          <div style={{
            fontSize: 13,
            color: isDarkMode ? '#e7e9ea' : '#0f1419',
            marginTop: 4,
            lineHeight: 1.3
          }}>
            Welcome to The Commons — the open forum where all community members come together. Share ideas, ask questions, and connect with fellow learners across all courses and communities.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TownHallCard;
