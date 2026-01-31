import React from 'react';
import { FaHome } from 'react-icons/fa';

/**
 * Breadcrumb Navigation Component
 *
 * Shows navigation path at top of main content area.
 * Pattern: 🏠 PeerLoop \ Section \ Subsection \ Current Page
 *
 * Props:
 * - items: Array of { label, onClick } - the breadcrumb path
 *   - Last item is the current page (not clickable)
 *   - All others are clickable links
 * - isDarkMode: boolean for theming
 */
const Breadcrumb = ({ items = [], isDarkMode = false }) => {
  if (!items || items.length === 0) return null;

  const styles = {
    container: {
      background: isDarkMode ? '#1e2732' : '#f7f9f9',
      borderBottom: `1px solid ${isDarkMode ? '#38444d' : '#e1e8ed'}`,
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    homeIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '20px',
      height: '20px',
      color: isDarkMode ? '#8899a6' : '#536471',
    },
    link: {
      color: '#1d9bf0',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'color 0.15s ease',
    },
    linkHover: {
      textDecoration: 'underline',
    },
    separator: {
      color: isDarkMode ? '#6e7b8a' : '#536471',
      fontSize: '13px',
      fontWeight: '400',
    },
    current: {
      color: isDarkMode ? '#e7e9ea' : '#0f1419',
      fontWeight: '500',
    },
  };

  return (
    <div style={styles.container}>
      {/* Home icon */}
      <div style={styles.homeIcon}>
        <FaHome size={14} />
      </div>

      {/* Breadcrumb items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isFirst = index === 0;

        return (
          <React.Fragment key={index}>
            {/* Separator before each item (including first for PeerLoop) */}
            {!isFirst && (
              <span style={styles.separator}>\</span>
            )}

            {/* Item - link or plain text */}
            {isLast ? (
              // Last item - current page, not clickable
              <span style={styles.current}>{item.label}</span>
            ) : (
              // Clickable link
              <span
                style={styles.link}
                onClick={item.onClick}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && item.onClick?.()}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
