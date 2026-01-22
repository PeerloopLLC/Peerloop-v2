import React, { useState, useMemo } from 'react';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaCheck, FaTimes, FaUser, FaClock, FaCreditCard, FaArrowLeft } from 'react-icons/fa';
import { communityUsers } from '../data/users';

const EnrollmentFlow = ({
  course,
  instructor,
  isDarkMode = true,
  onClose,
  onComplete,
  isAlreadyPurchased = false,
  preSelectedTeacher = null,
  onViewTeacherProfile = null
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1)); // January 2026
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedTeachers, setExpandedTeachers] = useState({}); // Track which teachers have expanded time slots
  const [viewingTeacherProfile, setViewingTeacherProfile] = useState(null); // Track which teacher profile page is being viewed

  const MAX_VISIBLE_TIMES = 4; // Show this many times before "Show more"

  // Handle viewing teacher profile - navigate to common Profile component
  const handleViewTeacherProfile = (teacher) => {
    if (onViewTeacherProfile) {
      // Look up the full user object from communityUsers
      const fullUser = communityUsers[teacher.id];
      if (fullUser) {
        onViewTeacherProfile(fullUser);
      } else {
        // Fallback to internal profile if user not found
        setViewingTeacherProfile(teacher);
      }
    } else {
      // Fallback to internal profile if no handler provided
      setViewingTeacherProfile(teacher);
    }
  };

  // Colors
  const bgPrimary = isDarkMode ? '#000' : '#fff';
  const bgSecondary = isDarkMode ? '#16181c' : '#f8fafc';
  const textPrimary = isDarkMode ? '#e7e9ea' : '#0f172a';
  const textSecondary = isDarkMode ? '#71767b' : '#64748b';
  const textMuted = isDarkMode ? '#536471' : '#94a3b8';
  const borderColor = isDarkMode ? '#2f3336' : '#e2e8f0';
  const accentBlue = '#1d9bf0';
  const accentGreen = '#00ba7c';

  // Generate availability slots for teachers (simulated - in real app would come from backend)
  const generateAvailability = (userId) => {
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];
    const availability = {};

    // January 2026 (23-31)
    for (let i = 23; i <= 31; i++) {
      const dateStr = `2026-01-${String(i).padStart(2, '0')}`;
      const numSlots = 3 + (hash % 5);
      const startIdx = hash % 4;
      const slots = baseSlots.slice(startIdx, startIdx + numSlots);
      if (slots.length > 0) {
        availability[dateStr] = slots;
      }
    }

    // February 2026 (1-28)
    for (let i = 1; i <= 28; i++) {
      const dateStr = `2026-02-${String(i).padStart(2, '0')}`;
      const numSlots = 3 + ((hash + i) % 5);
      const startIdx = (hash + i) % 4;
      const slots = baseSlots.slice(startIdx, startIdx + numSlots);
      if (slots.length > 0) {
        availability[dateStr] = slots;
      }
    }

    // March 2026 (1-31)
    for (let i = 1; i <= 31; i++) {
      const dateStr = `2026-03-${String(i).padStart(2, '0')}`;
      const numSlots = 3 + ((hash + i * 2) % 5);
      const startIdx = (hash + i) % 4;
      const slots = baseSlots.slice(startIdx, startIdx + numSlots);
      if (slots.length > 0) {
        availability[dateStr] = slots;
      }
    }

    return availability;
  };

  // Get student teachers from the real user database
  // Always include Alex Sanders (demo_alex) first, then other student teachers
  const studentTeachers = useMemo(() => {
    const allStudentTeachers = Object.values(communityUsers)
      .filter(user => user.userType === 'student_teacher');

    // Find Alex and put him first
    const alex = allStudentTeachers.find(user => user.id === 'demo_alex');
    const others = allStudentTeachers.filter(user => user.id !== 'demo_alex');

    // Alex first, then others (up to 8 total)
    const orderedTeachers = alex ? [alex, ...others] : others;

    return orderedTeachers
      .slice(0, 8)
      .map(user => {
        const initials = user.name.split(' ').map(n => n[0]).join('');
        return {
          id: user.id,
          name: user.name,
          initials: initials,
          avatar: user.avatar, // May be null
          avatarColor: user.avatarColor || '#1d9bf0',
          studentsTaught: user.stats?.studentsHelped || user.teachingStats?.students || 0,
          rating: user.stats?.avgRating || user.teachingStats?.rating || 4.5,
          bio: user.bio || 'Passionate about teaching and helping others learn.',
          availability: generateAvailability(user.id)
        };
      });
  }, []);

  // Get the list of teachers to show (filtered if pre-selected)
  const getTeachersToShow = () => {
    if (preSelectedTeacher) {
      // Find matching teacher by id or name
      const matched = studentTeachers.find(t =>
        t.id === preSelectedTeacher.id || t.name === preSelectedTeacher.name
      );
      return matched ? [matched] : studentTeachers;
    }
    return studentTeachers;
  };

  const teachersToShow = getTeachersToShow();

  // Get available dates (only from teachers being shown)
  const getAvailableDates = () => {
    const dates = new Set();
    teachersToShow.forEach(teacher => {
      Object.keys(teacher.availability).forEach(date => {
        dates.add(date);
      });
    });
    return dates;
  };

  const availableDates = getAvailableDates();

  // Get teachers available on selected date (filtered by teachersToShow)
  const getTeachersForDate = (dateStr) => {
    return teachersToShow.filter(teacher =>
      teacher.availability[dateStr] && teacher.availability[dateStr].length > 0
    );
  };

  // Calendar helpers
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateStr = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const formatDisplayDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(year, month - 1, day);
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const handleDateSelect = (dateStr) => {
    setSelectedDate(dateStr);
    setSelectedTeacher(null);
    setSelectedTime(null);
  };

  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing, then go directly to dashboard
    setTimeout(() => {
      setIsProcessing(false);
      // Complete enrollment and go to dashboard
      if (onComplete) {
        onComplete({
          course,
          teacher: selectedTeacher,
          date: selectedDate,
          time: selectedTime
        });
      }
    }, 1500);
  };

  // Render calendar
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    // Day headers
    const headers = dayNames.map(day => (
      <div key={day} style={{
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 600,
        color: textMuted,
        padding: '8px 0'
      }}>
        {day}
      </div>
    ));

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDateStr(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isAvailable = availableDates.has(dateStr);
      const isSelected = selectedDate === dateStr;

      days.push(
        <div
          key={day}
          onClick={() => isAvailable && handleDateSelect(dateStr)}
          style={{
            textAlign: 'center',
            padding: '10px 0',
            borderRadius: 8,
            cursor: isAvailable ? 'pointer' : 'default',
            background: isSelected ? accentBlue : 'transparent',
            color: isSelected ? '#fff' : isAvailable ? textPrimary : textMuted,
            fontWeight: isSelected ? 600 : 400,
            opacity: isAvailable ? 1 : 0.4,
            transition: 'all 0.15s ease'
          }}
        >
          {day}
          {isAvailable && !isSelected && (
            <div style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: accentGreen,
              margin: '4px auto 0'
            }} />
          )}
        </div>
      );
    }

    return (
      <div>
        {/* Month navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16
        }}>
          <button
            onClick={() => navigateMonth(-1)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 8,
              cursor: 'pointer',
              color: textSecondary,
              borderRadius: 8
            }}
          >
            <FaChevronLeft />
          </button>
          <span style={{ fontWeight: 600, color: textPrimary }}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 8,
              cursor: 'pointer',
              color: textSecondary,
              borderRadius: 8
            }}
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Calendar grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 2
        }}>
          {headers}
          {days}
        </div>
      </div>
    );
  };

  // Render teacher profile page
  const renderTeacherProfile = (teacher) => (
    <div style={{ background: bgPrimary, minHeight: '100vh', width: '100%' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
        <button onClick={() => setViewingTeacherProfile(null)} style={{
          background: 'transparent', border: 'none', padding: '8px 0', cursor: 'pointer',
          color: textSecondary, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 14
        }}>
          <FaArrowLeft /><span>Back to scheduling</span>
        </button>
        <div style={{ background: bgSecondary, borderRadius: 16, padding: 24, border: `1px solid ${borderColor}`, textAlign: 'center', marginBottom: 20 }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', margin: '0 auto 16px', overflow: 'hidden', background: teacher.avatarColor || accentBlue }}>
            {teacher.avatar ? (
              <img src={teacher.avatar} alt={teacher.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 36, fontWeight: 700 }}>
                {teacher.initials || teacher.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: textPrimary, marginBottom: 8 }}>{teacher.name}</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, fontSize: 14, color: textSecondary, marginBottom: 16 }}>
            <span>📚 {teacher.studentsTaught} students taught</span>
            <span>⭐ {teacher.rating} rating</span>
          </div>
        </div>
        <div style={{ background: bgSecondary, borderRadius: 16, padding: 24, border: `1px solid ${borderColor}`, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: textPrimary, marginBottom: 12 }}>About</h3>
          <p style={{ fontSize: 14, color: textSecondary, lineHeight: 1.6, margin: 0 }}>{teacher.bio}</p>
        </div>
        <button onClick={() => { setSelectedTeacher(teacher); setViewingTeacherProfile(null); }} style={{
          width: '100%', padding: 14, borderRadius: 8, border: 'none', background: accentBlue, color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer'
        }}>
          Select {teacher.name.split(' ')[0]} as Your Teacher
        </button>
      </div>
    </div>
  );

  // Render side-by-side layout for pre-selected teacher
  const renderSideBySideLayout = () => {
    const teacher = preSelectedTeacher;
    const matchedTeacher = studentTeachers.find(t =>
      t.id === teacher.id || t.name === teacher.name
    );

    if (!matchedTeacher) return null;

    const availableTimes = selectedDate ? (matchedTeacher.availability[selectedDate] || []) : [];

    return (
      <div style={{
        background: bgPrimary,
        minHeight: '100vh',
        width: '100%'
      }}>
        <div style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: 20
        }}>
          {/* Header with teacher info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: `1px solid ${borderColor}`
          }}>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                padding: 8,
                cursor: 'pointer',
                color: textSecondary,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <FaArrowLeft />
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: textPrimary }}>
                Book a Session with {matchedTeacher.name}
              </div>
              <div style={{ fontSize: 14, color: textSecondary }}>
                {course?.title}
              </div>
            </div>
            {matchedTeacher.avatar ? (
              <img
                src={matchedTeacher.avatar}
                alt={matchedTeacher.name}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: matchedTeacher.avatarColor || accentBlue,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 600,
                fontSize: 14
              }}>
                {matchedTeacher.initials}
              </div>
            )}
          </div>

          {/* Side-by-side layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 1fr) minmax(200px, 280px)',
            gap: 24,
            alignItems: 'start'
          }}>
            {/* Left: Calendar */}
            <div style={{
              background: bgSecondary,
              borderRadius: 16,
              padding: 20,
              border: `1px solid ${borderColor}`
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 16
              }}>
                <FaCalendarAlt style={{ color: accentBlue }} />
                <span style={{ fontWeight: 600, color: textPrimary }}>Select a Date</span>
                {selectedDate && (
                  <span style={{ marginLeft: 'auto', color: accentGreen, fontSize: 14 }}>
                    <FaCheck />
                  </span>
                )}
              </div>
              {renderCalendar()}
              <div style={{
                marginTop: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
                color: textMuted
              }}>
                <div style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: accentGreen
                }} />
                <span>Available dates</span>
              </div>
            </div>

            {/* Right: Available Times */}
            <div style={{
              background: bgSecondary,
              borderRadius: 16,
              padding: 20,
              border: `1px solid ${borderColor}`,
              minHeight: 300
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 16
              }}>
                <FaClock style={{ color: accentBlue }} />
                <span style={{ fontWeight: 600, color: textPrimary }}>Available Times</span>
                {selectedTime && (
                  <span style={{ marginLeft: 'auto', color: accentGreen, fontSize: 14 }}>
                    <FaCheck />
                  </span>
                )}
              </div>

              {!selectedDate ? (
                <div style={{
                  color: textMuted,
                  textAlign: 'center',
                  padding: '40px 20px',
                  fontSize: 14
                }}>
                  Select a date to see available times
                </div>
              ) : availableTimes.length === 0 ? (
                <div style={{
                  color: textMuted,
                  textAlign: 'center',
                  padding: '40px 20px',
                  fontSize: 14
                }}>
                  No available times on this date
                </div>
              ) : (
                <>
                  <div style={{
                    fontSize: 13,
                    color: textSecondary,
                    marginBottom: 12
                  }}>
                    {formatDisplayDate(selectedDate)}
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                  }}>
                    {availableTimes.map(time => {
                      const isSelected = selectedTime === time;
                      return (
                        <button
                          key={time}
                          onClick={() => {
                            setSelectedTeacher(matchedTeacher);
                            handleTimeSelect(time);
                          }}
                          style={{
                            padding: '12px 16px',
                            borderRadius: 8,
                            border: isSelected
                              ? `2px solid ${accentBlue}`
                              : `1px solid ${borderColor}`,
                            background: isSelected
                              ? (isDarkMode ? 'rgba(29, 155, 240, 0.15)' : 'rgba(29, 155, 240, 0.1)')
                              : 'transparent',
                            color: isSelected ? accentBlue : textPrimary,
                            fontWeight: isSelected ? 600 : 500,
                            fontSize: 14,
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <span>{time}</span>
                          {isSelected && <FaCheck style={{ fontSize: 12 }} />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Confirm Button */}
          {selectedDate && selectedTime && (
            <div style={{
              marginTop: 24,
              display: 'flex',
              justifyContent: 'center'
            }}>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                style={{
                  padding: '14px 32px',
                  borderRadius: 8,
                  border: 'none',
                  background: isProcessing ? textMuted : accentGreen,
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.15s ease'
                }}
              >
                {isProcessing ? (
                  'Processing...'
                ) : isAlreadyPurchased ? (
                  <><FaCalendarAlt /> Confirm Session</>
                ) : (
                  <><FaCreditCard /> Confirm & Pay</>
                )}
              </button>
            </div>
          )}

          {/* Selection Summary */}
          {selectedDate && selectedTime && (
            <div style={{
              marginTop: 16,
              padding: 16,
              background: isDarkMode ? 'rgba(0, 186, 124, 0.1)' : 'rgba(0, 186, 124, 0.1)',
              borderRadius: 12,
              border: `1px solid ${accentGreen}`,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 14, color: textSecondary, marginBottom: 4 }}>
                Your session:
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: textPrimary }}>
                {formatDisplayDate(selectedDate)} at {selectedTime}
              </div>
              <div style={{ fontSize: 14, color: textSecondary, marginTop: 4 }}>
                with {matchedTeacher.name}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // If viewing a teacher profile, show the profile page
  if (viewingTeacherProfile) {
    return renderTeacherProfile(viewingTeacherProfile);
  }

  // Use side-by-side layout when teacher is pre-selected (from Find Teacher flow)
  if (preSelectedTeacher) {
    return renderSideBySideLayout();
  }

  return (
    <div style={{
      background: bgPrimary,
      minHeight: '100vh',
      width: '100%'
    }}>
      {/* Centered container for Header + Calendar */}
      <div style={{
        maxWidth: 450,
        margin: '0 auto',
        padding: '20px 20px 0 20px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: `1px solid ${borderColor}`
        }}>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 8,
              cursor: 'pointer',
              color: textSecondary,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <FaArrowLeft />
          </button>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: textPrimary }}>
              Schedule Your Session
            </div>
            <div style={{ fontSize: 14, color: textSecondary }}>
              {course?.title}
            </div>
          </div>
        </div>

        {/* Step 1: Calendar - Centered */}
        <div style={{
          background: bgSecondary,
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          border: `1px solid ${borderColor}`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16
          }}>
            <FaCalendarAlt style={{ color: accentBlue }} />
            <span style={{ fontWeight: 600, color: textPrimary }}>1. Select a Date</span>
            {selectedDate && (
              <span style={{ marginLeft: 'auto', color: accentGreen, fontSize: 14 }}>
                <FaCheck />
              </span>
            )}
          </div>
          {renderCalendar()}
          {selectedDate && (
            <div style={{
              marginTop: 16,
              padding: '12px 16px',
              background: isDarkMode ? 'rgba(29, 155, 240, 0.1)' : 'rgba(29, 155, 240, 0.1)',
              borderRadius: 8,
              color: accentBlue,
              fontSize: 14,
              fontWeight: 500
            }}>
              Selected: {formatDisplayDate(selectedDate)}
            </div>
          )}
        </div>
      </div>

      {/* Full-width Student-Teacher Section */}
      <div style={{
        padding: '0 20px 20px 20px',
        opacity: selectedDate ? 1 : 0.5,
        pointerEvents: selectedDate ? 'auto' : 'none'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 12,
          maxWidth: 600,
          margin: '0 auto 12px auto'
        }}>
          <FaUser style={{ color: accentBlue }} />
          <span style={{ fontWeight: 600, color: textPrimary }}>2. Choose a Student-Teacher & Time</span>
          {selectedTeacher && selectedTime && (
            <span style={{ marginLeft: 'auto', color: accentGreen, fontSize: 14 }}>
              <FaCheck />
            </span>
          )}
        </div>

        {selectedDate ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {getTeachersForDate(selectedDate).map(teacher => (
              <div
                key={teacher.id}
                style={{
                  borderRadius: 10,
                  border: selectedTeacher?.id === teacher.id 
                    ? `2px solid ${accentBlue}` 
                    : `1px solid ${borderColor}`,
                  background: selectedTeacher?.id === teacher.id 
                    ? (isDarkMode ? 'rgba(29, 155, 240, 0.1)' : 'rgba(29, 155, 240, 0.05)')
                    : bgSecondary,
                  overflow: 'hidden',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Teacher Info Row */}
                <div
                  onClick={() => handleTeacherSelect(teacher)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '12px 16px',
                    cursor: 'pointer'
                  }}
                >
                  {teacher.avatar ? (
                    <img
                      src={teacher.avatar}
                      alt={teacher.name}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                  ) : (
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: teacher.avatarColor || accentBlue,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: 14,
                      flexShrink: 0
                    }}>
                      {teacher.initials}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
                      <span 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewTeacherProfile(teacher);
                        }}
                        className="link-hover"
                        style={{ 
                          fontWeight: 600, 
                          fontSize: 15, 
                          color: textPrimary,
                          cursor: 'pointer'
                        }}
                      >
                        {teacher.name}
                      </span>
                      <span 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewTeacherProfile(teacher);
                        }}
                        className="link-hover"
                        style={{ 
                          fontSize: 12, 
                          color: accentBlue, 
                          cursor: 'pointer',
                          fontWeight: 500
                        }}
                      >
                        View Profile
                      </span>
                      <span style={{ fontSize: 12, color: textSecondary }}>
                        {teacher.studentsTaught} taught • ⭐ {teacher.rating}
                      </span>
                    </div>
                    
                    {/* Short bio */}
                    <div style={{ fontSize: 13, color: textSecondary, lineHeight: 1.4 }}>
                      {teacher.bio.length > 80 ? teacher.bio.substring(0, 80) + '...' : teacher.bio}
                    </div>
                  </div>
                  {selectedTeacher?.id === teacher.id && selectedTime && (
                    <FaCheck style={{ color: accentGreen, fontSize: 16, flexShrink: 0 }} />
                  )}
                </div>

                {/* Time Slots */}
                {(() => {
                  const allTimes = teacher.availability[selectedDate] || [];
                  const isExpanded = expandedTeachers[teacher.id];
                  const hasMoreTimes = allTimes.length > MAX_VISIBLE_TIMES;
                  const visibleTimes = isExpanded ? allTimes : allTimes.slice(0, MAX_VISIBLE_TIMES);
                  const hiddenCount = allTimes.length - MAX_VISIBLE_TIMES;

                  return (
                    <div style={{
                      padding: '8px 16px 12px 16px',
                      borderTop: `1px solid ${borderColor}`
                    }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                        {visibleTimes.map(time => {
                          const isThisTimeSelected = selectedTeacher?.id === teacher.id && selectedTime === time;
                          return (
                            <React.Fragment key={time}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTeacherSelect(teacher);
                                  handleTimeSelect(time);
                                }}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: 6,
                                  border: isThisTimeSelected 
                                    ? `2px solid ${accentBlue}` 
                                    : `1px solid ${borderColor}`,
                                  background: isThisTimeSelected 
                                    ? accentBlue 
                                    : 'transparent',
                                  color: isThisTimeSelected ? '#fff' : textPrimary,
                                  fontWeight: 500,
                                  fontSize: 13,
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                {time}
                              </button>
                              {isThisTimeSelected && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePayment();
                                  }}
                                  disabled={isProcessing}
                                  style={{
                                    padding: '6px 14px',
                                    borderRadius: 6,
                                    border: 'none',
                                    background: isProcessing ? textMuted : accentGreen,
                                    color: '#fff',
                                    fontWeight: 600,
                                    fontSize: 13,
                                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    transition: 'all 0.15s ease'
                                  }}
                                >
                                  {isProcessing ? 'Processing...' : isAlreadyPurchased ? <><FaCalendarAlt /> Schedule</> : <><FaCreditCard /> Pay Now</>}
                                </button>
                              )}
                            </React.Fragment>
                          );
                        })}
                        
                        {/* Show more/less button */}
                        {hasMoreTimes && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedTeachers(prev => ({
                                ...prev,
                                [teacher.id]: !prev[teacher.id]
                              }));
                            }}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 6,
                              border: `1px dashed ${borderColor}`,
                              background: 'transparent',
                              color: accentBlue,
                              fontWeight: 500,
                              fontSize: 13,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {isExpanded ? 'Less' : `+${hiddenCount}`}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: textMuted, textAlign: 'center', padding: 20 }}>
            Select a date first to see available student-teachers
          </div>
        )}
      </div>

    </div>
  );
};

export default EnrollmentFlow;
