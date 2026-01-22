import React, { useState, useMemo } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes, FaClock, FaCalendarAlt, FaExchangeAlt } from 'react-icons/fa';

/**
 * RescheduleModal - Compact modal for rescheduling a booked session.
 * Reuses availability logic from EnrollmentFlow but only shows
 * the calendar + time slots for the already-assigned teacher.
 */
const RescheduleModal = ({
  session,
  isDarkMode = true,
  onClose,
  onConfirm,
  onMoreOptions
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1));
  const [step, setStep] = useState('select'); // 'select' or 'confirm'

  // Colors
  const bgPrimary = isDarkMode ? '#000' : '#fff';
  const bgSecondary = isDarkMode ? '#16181c' : '#f8fafc';
  const textPrimary = isDarkMode ? '#e7e9ea' : '#0f172a';
  const textSecondary = isDarkMode ? '#71767b' : '#64748b';
  const borderColor = isDarkMode ? '#2f3336' : '#e2e8f0';
  const accentBlue = '#1d9bf0';

  // Generate availability for the teacher (same logic as EnrollmentFlow)
  const generateAvailability = (userId) => {
    if (!userId) return {};
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];
    const availability = {};

    // January 2026 (23-31)
    for (let i = 23; i <= 31; i++) {
      const dateStr = `2026-01-${String(i).padStart(2, '0')}`;
      const numSlots = 3 + (hash % 5);
      const startIdx = hash % 4;
      const slots = baseSlots.slice(startIdx, startIdx + numSlots);
      if (slots.length > 0) availability[dateStr] = slots;
    }

    // February 2026 (1-28)
    for (let i = 1; i <= 28; i++) {
      const dateStr = `2026-02-${String(i).padStart(2, '0')}`;
      const numSlots = 3 + ((hash + i) % 5);
      const startIdx = (hash + i) % 4;
      const slots = baseSlots.slice(startIdx, startIdx + numSlots);
      if (slots.length > 0) availability[dateStr] = slots;
    }

    // March 2026 (1-31)
    for (let i = 1; i <= 31; i++) {
      const dateStr = `2026-03-${String(i).padStart(2, '0')}`;
      const numSlots = 3 + ((hash + i * 2) % 5);
      const startIdx = (hash + i) % 4;
      const slots = baseSlots.slice(startIdx, startIdx + numSlots);
      if (slots.length > 0) availability[dateStr] = slots;
    }

    return availability;
  };

  const teacherAvailability = useMemo(() => {
    return generateAvailability(session?.teacherId);
  }, [session?.teacherId]);

  // Calendar helpers
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + direction);
      return newMonth;
    });
    setSelectedDate(null);
    setSelectedTime(null);
  };

  // Format a date string for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Get available times for selected date
  const availableTimes = selectedDate ? (teacherAvailability[selectedDate] || []) : [];

  // Build calendar grid
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={{ width: 36, height: 36 }} />);
    }

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasAvailability = teacherAvailability[dateStr] && teacherAvailability[dateStr].length > 0;
      const isSelected = selectedDate === dateStr;
      const isCurrentSession = session?.date === dateStr;

      days.push(
        <div
          key={day}
          onClick={() => {
            if (hasAvailability) {
              setSelectedDate(dateStr);
              setSelectedTime(null);
            }
          }}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: isSelected ? 700 : 400,
            cursor: hasAvailability ? 'pointer' : 'default',
            background: isSelected ? accentBlue : isCurrentSession ? (isDarkMode ? '#2f3336' : '#e2e8f0') : 'transparent',
            color: isSelected ? '#fff' : hasAvailability ? textPrimary : (isDarkMode ? '#3f3f46' : '#d1d5db'),
            border: isCurrentSession && !isSelected ? `2px dashed ${textSecondary}` : 'none',
            position: 'relative',
            transition: 'all 0.15s'
          }}
        >
          {day}
          {hasAvailability && !isSelected && (
            <div style={{
              position: 'absolute',
              bottom: 3,
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: '#10b981'
            }} />
          )}
        </div>
      );
    }

    return days;
  };

  const handleConfirm = () => {
    if (onConfirm && selectedDate && selectedTime) {
      onConfirm({
        sessionId: session.id,
        oldDate: session.date,
        oldTime: session.time,
        newDate: selectedDate,
        newTime: selectedTime,
        teacherId: session.teacherId,
        teacherName: session.teacherName
      });
    }
  };

  if (!session) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: bgPrimary,
          borderRadius: 16,
          width: '100%',
          maxWidth: 420,
          maxHeight: '90vh',
          overflowY: 'auto',
          border: `1px solid ${borderColor}`,
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: `1px solid ${borderColor}`
        }}>
          <h2 style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: textPrimary,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <FaExchangeAlt style={{ color: accentBlue, fontSize: 16 }} />
            {step === 'select' ? 'Reschedule Session' : 'Confirm Reschedule'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: textSecondary,
              fontSize: 18,
              cursor: 'pointer',
              padding: 4
            }}
          >
            <FaTimes />
          </button>
        </div>

        {step === 'select' ? (
          <div style={{ padding: 20 }}>
            {/* Current Booking Info */}
            <div style={{
              background: bgSecondary,
              borderRadius: 12,
              padding: 14,
              marginBottom: 20,
              border: `1px solid ${borderColor}`
            }}>
              <div style={{ fontSize: 12, color: textSecondary, marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Current Booking
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <FaCalendarAlt style={{ color: accentBlue, fontSize: 13 }} />
                <span style={{ fontSize: 14, color: textPrimary, fontWeight: 500 }}>
                  {formatDate(session.date)} at {session.time}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaClock style={{ color: textSecondary, fontSize: 13 }} />
                <span style={{ fontSize: 13, color: textSecondary }}>
                  {session.teacherName || session.studentTeacherName || 'Your teacher'} &middot; {session.courseName}
                </span>
              </div>
              <button
                onClick={() => { onMoreOptions && onMoreOptions(session); }}
                style={{
                  marginTop: 12,
                  background: '#fff',
                  border: 'none',
                  color: '#000',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '6px 16px',
                  borderRadius: 20,
                  transition: 'all 0.2s'
                }}
              >
                Click here for more reschedule options
              </button>
            </div>

            {/* Calendar */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: textSecondary, marginBottom: 10, fontWeight: 600 }}>
                Select New Date
              </div>

              {/* Month navigation */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12
              }}>
                <button
                  onClick={() => navigateMonth(-1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: textSecondary,
                    cursor: 'pointer',
                    padding: 6,
                    fontSize: 14
                  }}
                >
                  <FaChevronLeft />
                </button>
                <span style={{ fontSize: 15, fontWeight: 600, color: textPrimary }}>
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <button
                  onClick={() => navigateMonth(1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: textSecondary,
                    cursor: 'pointer',
                    padding: 6,
                    fontSize: 14
                  }}
                >
                  <FaChevronRight />
                </button>
              </div>

              {/* Day headers */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 2,
                marginBottom: 4
              }}>
                {dayNames.map(day => (
                  <div key={day} style={{
                    textAlign: 'center',
                    fontSize: 11,
                    fontWeight: 600,
                    color: textSecondary,
                    padding: '4px 0'
                  }}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 2,
                justifyItems: 'center'
              }}>
                {renderCalendar()}
              </div>

              {/* Legend */}
              <div style={{
                display: 'flex',
                gap: 16,
                marginTop: 10,
                fontSize: 11,
                color: textSecondary
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                  Available
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 14, height: 14, borderRadius: '50%', border: `2px dashed ${textSecondary}`, display: 'inline-block' }} />
                  Current
                </span>
              </div>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: textSecondary, marginBottom: 10, fontWeight: 600 }}>
                  Available Times ({formatDate(selectedDate).split(',')[1]?.trim()})
                </div>
                {availableTimes.length > 0 ? (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8
                  }}>
                    {availableTimes.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 8,
                          border: selectedTime === time ? `2px solid ${accentBlue}` : `1px solid ${borderColor}`,
                          background: selectedTime === time ? (isDarkMode ? '#1a3a5c' : '#eff6ff') : bgSecondary,
                          color: selectedTime === time ? accentBlue : textPrimary,
                          fontSize: 13,
                          fontWeight: selectedTime === time ? 600 : 400,
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: textSecondary, fontStyle: 'italic' }}>
                    No times available on this date
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: `1px solid ${borderColor}`,
                  background: bgSecondary,
                  color: textPrimary,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setStep('confirm')}
                disabled={!selectedDate || !selectedTime}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: 'none',
                  background: (!selectedDate || !selectedTime) ? (isDarkMode ? '#2f3336' : '#e5e7eb') : accentBlue,
                  color: (!selectedDate || !selectedTime) ? textSecondary : '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: (!selectedDate || !selectedTime) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          /* Confirmation Step */
          <div style={{ padding: 20 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              marginBottom: 24,
              padding: 20
            }}>
              {/* Old time */}
              <div style={{
                textAlign: 'center',
                padding: 16,
                background: bgSecondary,
                borderRadius: 12,
                border: `1px solid ${borderColor}`,
                flex: 1
              }}>
                <div style={{ fontSize: 11, color: textSecondary, marginBottom: 6, fontWeight: 600, textTransform: 'uppercase' }}>
                  OLD
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: textPrimary, marginBottom: 2 }}>
                  {formatDate(session.date).split(', ').slice(1).join(', ')}
                </div>
                <div style={{ fontSize: 13, color: textSecondary }}>
                  {session.time}
                </div>
              </div>

              {/* Arrow */}
              <div style={{ color: accentBlue, fontSize: 20 }}>
                &#10132;
              </div>

              {/* New time */}
              <div style={{
                textAlign: 'center',
                padding: 16,
                background: isDarkMode ? '#0a2540' : '#eff6ff',
                borderRadius: 12,
                border: `2px solid ${accentBlue}`,
                flex: 1
              }}>
                <div style={{ fontSize: 11, color: accentBlue, marginBottom: 6, fontWeight: 600, textTransform: 'uppercase' }}>
                  NEW
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: textPrimary, marginBottom: 2 }}>
                  {formatDate(selectedDate).split(', ').slice(1).join(', ')}
                </div>
                <div style={{ fontSize: 13, color: textSecondary }}>
                  {selectedTime}
                </div>
              </div>
            </div>

            {/* Session Info */}
            <div style={{
              fontSize: 14,
              color: textSecondary,
              textAlign: 'center',
              marginBottom: 8
            }}>
              <strong style={{ color: textPrimary }}>{session.teacherName || session.studentTeacherName}</strong>
            </div>
            <div style={{
              fontSize: 13,
              color: textSecondary,
              textAlign: 'center',
              marginBottom: 24
            }}>
              {session.courseName}
            </div>

            {/* Notice */}
            <div style={{
              fontSize: 12,
              color: textSecondary,
              textAlign: 'center',
              marginBottom: 20,
              padding: '10px 16px',
              background: bgSecondary,
              borderRadius: 8,
              border: `1px solid ${borderColor}`
            }}>
              Your teacher will be notified of the change.
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setStep('select')}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: `1px solid ${borderColor}`,
                  background: bgSecondary,
                  color: textPrimary,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Go Back
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: 'none',
                  background: accentBlue,
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Reschedule
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RescheduleModal;
