import React, { useState } from 'react';
import { 
  FaChartLine,
  FaCalendarAlt,
  FaUsers,
  FaDollarSign,
  FaComments,
  FaUser,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const StudentTeacherDashboard = ({ isDarkMode = true }) => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 11, 1)); // December 2025
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 11, 8)); // Dec 8, 2025 selected by default
  
  // Student-Teacher info
  const stInfo = {
    name: "Alex Sanders",
    courseName: "AI Prompting Mastery",
    initials: "AS"
  };
  
  // Navigation tabs
  const navTabs = [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'calendar', label: 'Calendar', icon: FaCalendarAlt },
    { id: 'students', label: 'Students', icon: FaUsers, badge: 4 },
    { id: 'earnings', label: 'Earnings', icon: FaDollarSign },
    { id: 'messages', label: 'Messages', icon: FaComments, badge: 2 },
    { id: 'profile', label: 'Profile', icon: FaUser }
  ];
  
  // Quick stats
  const quickStats = [
    { value: '8 sessions', sublabel: 'this week' },
    { value: '4 students', sublabel: 'active' },
    { value: '$2,520 earned', sublabel: 'total' },
    { value: '1 cert ready', sublabel: 'to review' }
  ];

  // Colors
  const bgPrimary = isDarkMode ? '#000' : '#fff';
  const bgSecondary = isDarkMode ? '#16181c' : '#f8fafc';
  const bgCard = isDarkMode ? '#16181c' : '#fff';
  const textPrimary = isDarkMode ? '#e7e9ea' : '#0f172a';
  const textSecondary = isDarkMode ? '#71767b' : '#64748b';
  const borderColor = isDarkMode ? '#2f3336' : '#e2e8f0';
  const accentBlue = '#1d9bf0';
  const accentGreen = '#00ba7c';

  // Helper functions
  const getMonthName = (date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[date.getMonth()];
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentMonth(newDate);
    setSelectedDate(null);
  };

  const goToToday = () => {
    const today = new Date(2025, 11, 8); // Simulated "today"
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(clickedDate);
  };

  const isToday = (day) => {
    const today = new Date(2025, 11, 8); // Simulated "today"
    return day === today.getDate() && 
           currentMonth.getMonth() === today.getMonth() && 
           currentMonth.getFullYear() === today.getFullYear();
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return day === selectedDate.getDate() && 
           currentMonth.getMonth() === selectedDate.getMonth() && 
           currentMonth.getFullYear() === selectedDate.getFullYear();
  };

  // Build calendar grid
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  
  // Add the days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div style={{
      background: bgPrimary,
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Top Navigation Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: 56,
        borderBottom: `1px solid ${borderColor}`,
        background: bgSecondary,
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* Logo */}
        <div style={{ 
          fontSize: 20, 
          fontWeight: 700, 
          color: accentBlue,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          ∞ <span style={{ color: textPrimary }}>Teaching</span>
        </div>
        
        {/* Navigation Tabs */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 4,
          flex: 1,
          marginLeft: 32,
          overflowX: 'auto'
        }}>
          {navTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                background: activeTab === tab.id ? (isDarkMode ? '#2f3336' : '#e2e8f0') : 'transparent',
                border: 'none',
                borderRadius: 8,
                color: activeTab === tab.id ? accentBlue : textSecondary,
                fontSize: 14,
                fontWeight: activeTab === tab.id ? 600 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                position: 'relative'
              }}
            >
              <tab.icon style={{ fontSize: 14 }} />
              {tab.label}
              {tab.badge && (
                <span style={{
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 10,
                  marginLeft: 4
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
        
        {/* User Dropdown */}
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          background: 'transparent',
          border: `1px solid ${borderColor}`,
          borderRadius: 20,
          color: textPrimary,
          fontSize: 14,
          fontWeight: 500,
          cursor: 'pointer'
        }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: accentGreen,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700
          }}>
            {stInfo.initials}
          </div>
          {stInfo.name}
          <FaChevronDown style={{ fontSize: 10, color: textSecondary }} />
        </button>
      </div>

      {/* Main Content */}
      <div style={{ padding: 24 }}>
        {/* Page Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FaCalendarAlt style={{ color: accentBlue, fontSize: 24 }} />
            <div>
              <h1 style={{ 
                fontSize: 22, 
                fontWeight: 700, 
                color: textPrimary, 
                margin: 0 
              }}>
                My Schedule
              </h1>
              <p style={{ 
                fontSize: 14, 
                color: textSecondary, 
                margin: '4px 0 0 0' 
              }}>
                {stInfo.courseName}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <select style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: `1px solid ${borderColor}`,
              background: bgSecondary,
              color: textPrimary,
              fontSize: 13,
              cursor: 'pointer'
            }}>
              <option>Month</option>
              <option>Week</option>
            </select>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button 
                onClick={() => navigateMonth(-1)}
                style={{
                  padding: 8,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 8,
                  background: bgSecondary,
                  color: textSecondary,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <FaChevronLeft style={{ fontSize: 12 }} />
              </button>
              <span style={{ 
                padding: '8px 16px',
                fontSize: 15,
                fontWeight: 600,
                color: textPrimary,
                minWidth: 160,
                textAlign: 'center'
              }}>
                {getMonthName(currentMonth)} {currentMonth.getFullYear()}
              </span>
              <button 
                onClick={() => navigateMonth(1)}
                style={{
                  padding: 8,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 8,
                  background: bgSecondary,
                  color: textSecondary,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <FaChevronRight style={{ fontSize: 12 }} />
              </button>
            </div>
            
            <button 
              onClick={goToToday}
              style={{
                padding: '8px 16px',
                border: `1px solid ${borderColor}`,
                borderRadius: 8,
                background: bgSecondary,
                color: textPrimary,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Today
            </button>
          </div>
        </div>

        {/* Stats Row - Twitter style links */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 24,
          marginBottom: 20,
          flexWrap: 'wrap'
        }}>
          {quickStats.map((stat, index) => (
            <span 
              key={index}
              style={{
                fontSize: 14,
                color: textSecondary,
                cursor: 'pointer',
                transition: 'color 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = accentBlue}
              onMouseLeave={(e) => e.currentTarget.style.color = textSecondary}
            >
              <span style={{ fontWeight: 700, color: textPrimary }}>{stat.value}</span>
              {' '}{stat.sublabel}
            </span>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={{
          background: bgCard,
          borderRadius: 12,
          border: `1px solid ${borderColor}`,
          overflow: 'hidden',
          marginBottom: 20,
          maxWidth: '50%'
        }}>
          {/* Day Headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            borderBottom: `1px solid ${borderColor}`,
            background: bgSecondary
          }}>
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
              <div 
                key={day}
                style={{
                  padding: '8px 4px',
                  textAlign: 'center',
                  fontSize: 10,
                  fontWeight: 600,
                  color: textSecondary,
                  letterSpacing: '0.5px'
                }}
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)'
          }}>
            {calendarDays.map((day, index) => {
              if (day === null) {
                return (
                  <div 
                    key={`empty-${index}`}
                    style={{
                      minHeight: 54,
                      borderBottom: `1px solid ${borderColor}`,
                      borderRight: index % 7 !== 6 ? `1px solid ${borderColor}` : 'none',
                      background: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
                    }}
                  />
                );
              }

              const dayIsToday = isToday(day);
              const dayIsSelected = isSelected(day);

              return (
                <div 
                  key={day}
                  onClick={() => handleDateClick(day)}
                  style={{
                    minHeight: 54,
                    padding: 4,
                    borderBottom: `1px solid ${borderColor}`,
                    borderRight: index % 7 !== 6 ? `1px solid ${borderColor}` : 'none',
                    cursor: 'pointer',
                    background: dayIsSelected 
                      ? (isDarkMode ? 'rgba(29, 155, 240, 0.15)' : 'rgba(29, 155, 240, 0.1)')
                      : dayIsToday 
                        ? (isDarkMode ? 'rgba(29, 155, 240, 0.08)' : 'rgba(29, 155, 240, 0.05)')
                        : 'transparent',
                    transition: 'background 0.2s',
                    position: 'relative'
                  }}
                >
                  {/* Day Number */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    fontSize: 12,
                    fontWeight: dayIsToday || dayIsSelected ? 700 : 500,
                    color: dayIsToday ? '#fff' : dayIsSelected ? accentBlue : textPrimary,
                    background: dayIsToday ? accentBlue : 'transparent',
                    marginBottom: 2
                  }}>
                    {day}
                  </div>
                  

                  {/* Today Label */}
                  {dayIsToday && (
                    <div style={{
                      position: 'absolute',
                      bottom: 2,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: 7,
                      fontWeight: 600,
                      color: accentBlue,
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px'
                    }}>
                      Today
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTeacherDashboard;
