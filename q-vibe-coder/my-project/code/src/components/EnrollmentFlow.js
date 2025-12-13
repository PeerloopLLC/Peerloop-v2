import React, { useState } from 'react';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaCheck, FaTimes, FaUser, FaClock } from 'react-icons/fa';

const EnrollmentFlow = ({
  course,
  instructor,
  isDarkMode = true,
  onClose,
  onComplete
}) => {
  const [step, setStep] = useState(1); // 1: confirm enroll, 2: select date, 3: select teacher/time, 4: confirmation
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 11, 1)); // December 2025

  // Colors
  const bgPrimary = isDarkMode ? '#000' : '#fff';
  const bgSecondary = isDarkMode ? '#16181c' : '#f8fafc';
  const bgCard = isDarkMode ? '#16181c' : '#fff';
  const textPrimary = isDarkMode ? '#e7e9ea' : '#0f172a';
  const textSecondary = isDarkMode ? '#71767b' : '#64748b';
  const textMuted = isDarkMode ? '#536471' : '#94a3b8';
  const borderColor = isDarkMode ? '#2f3336' : '#e2e8f0';
  const accentBlue = '#1d9bf0';
  const accentGreen = '#00ba7c';

  // Mock student-teachers data
  const studentTeachers = [
    {
      id: 1,
      name: 'Marcus Chen',
      initials: 'MC',
      studentsTaught: 12,
      rating: 4.9,
      availability: {
        '2025-12-10': ['10:00 AM', '2:00 PM', '7:00 PM'],
        '2025-12-11': ['9:00 AM', '1:00 PM', '5:00 PM'],
        '2025-12-12': ['11:00 AM', '3:00 PM'],
        '2025-12-13': ['10:00 AM', '4:00 PM', '6:00 PM'],
        '2025-12-16': ['9:00 AM', '2:00 PM'],
        '2025-12-17': ['10:00 AM', '1:00 PM', '7:00 PM'],
      }
    },
    {
      id: 2,
      name: 'Jessica Torres',
      initials: 'JT',
      studentsTaught: 8,
      rating: 4.8,
      availability: {
        '2025-12-10': ['11:00 AM', '3:00 PM'],
        '2025-12-11': ['10:00 AM', '2:00 PM', '6:00 PM'],
        '2025-12-12': ['9:00 AM', '1:00 PM', '5:00 PM'],
        '2025-12-13': ['11:00 AM', '4:00 PM'],
        '2025-12-16': ['10:00 AM', '3:00 PM', '7:00 PM'],
        '2025-12-17': ['9:00 AM', '2:00 PM'],
      }
    },
    {
      id: 3,
      name: 'Alex Sanders',
      initials: 'AS',
      studentsTaught: 4,
      rating: 4.7,
      availability: {
        '2025-12-10': ['9:00 AM', '1:00 PM', '6:00 PM'],
        '2025-12-11': ['11:00 AM', '4:00 PM'],
        '2025-12-12': ['10:00 AM', '2:00 PM', '7:00 PM'],
        '2025-12-13': ['9:00 AM', '3:00 PM', '5:00 PM'],
        '2025-12-16': ['11:00 AM', '1:00 PM'],
        '2025-12-17': ['10:00 AM', '4:00 PM', '6:00 PM'],
      }
    },
    {
      id: 4,
      name: 'Sarah Kim',
      initials: 'SK',
      studentsTaught: 6,
      rating: 4.9,
      availability: {
        '2025-12-10': ['2:00 PM', '5:00 PM'],
        '2025-12-11': ['10:00 AM', '3:00 PM', '7:00 PM'],
        '2025-12-12': ['9:00 AM', '12:00 PM', '4:00 PM'],
        '2025-12-13': ['11:00 AM', '2:00 PM'],
        '2025-12-16': ['10:00 AM', '5:00 PM', '7:00 PM'],
        '2025-12-17': ['9:00 AM', '1:00 PM', '3:00 PM'],
      }
    }
  ];

  // Get available dates (dates where at least one teacher has availability)
  const getAvailableDates = () => {
    const dates = new Set();
    studentTeachers.forEach(teacher => {
      Object.keys(teacher.availability).forEach(date => {
        dates.add(date);
      });
    });
    return dates;
  };

  const availableDates = getAvailableDates();

  // Get teachers available on selected date
  const getTeachersForDate = (dateStr) => {
    return studentTeachers.filter(teacher =>
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

  const handleTimeSelect = (teacher, time) => {
    setSelectedTeacher(teacher);
    setSelectedTime(time);
  };

  const handleEnroll = () => {
    setStep(2);
  };

  const handleConfirmBooking = () => {
    setStep(4);
    // In real app, this would call an API
    if (onComplete) {
      onComplete({
        course,
        teacher: selectedTeacher,
        date: selectedDate,
        time: selectedTime
      });
    }
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
        padding: '8px 0',
        fontSize: 12,
        fontWeight: 600,
        color: textSecondary
      }}>
        {day}
      </div>
    ));

    // Empty cells for days before first of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDateStr(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isAvailable = availableDates.has(dateStr);
      const isSelected = selectedDate === dateStr;
      const isPast = new Date(dateStr) < new Date('2025-12-09'); // Assuming today is Dec 9

      days.push(
        <div
          key={day}
          onClick={() => isAvailable && !isPast && handleDateSelect(dateStr)}
          style={{
            textAlign: 'center',
            padding: '10px 0',
            fontSize: 14,
            fontWeight: isSelected ? 700 : 500,
            color: isPast ? textMuted : isAvailable ? (isSelected ? '#fff' : textPrimary) : textMuted,
            background: isSelected ? accentBlue : 'transparent',
            borderRadius: 8,
            cursor: isAvailable && !isPast ? 'pointer' : 'default',
            position: 'relative',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            if (isAvailable && !isPast && !isSelected) {
              e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#e2e8f0';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          {day}
          {isAvailable && !isPast && (
            <div style={{
              position: 'absolute',
              bottom: 4,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: isSelected ? '#fff' : accentBlue
            }} />
          )}
        </div>
      );
    }

    return (
      <div style={{
        background: bgCard,
        borderRadius: 12,
        border: `1px solid ${borderColor}`,
        padding: 16,
        marginBottom: 20
      }}>
        {/* Month navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
          <span style={{
            fontSize: 16,
            fontWeight: 600,
            color: textPrimary
          }}>
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
          gap: 4
        }}>
          {headers}
          {days}
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginTop: 16,
          paddingTop: 12,
          borderTop: `1px solid ${borderColor}`,
          fontSize: 12,
          color: textSecondary
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: accentBlue
            }} />
            Available
          </div>
        </div>
      </div>
    );
  };

  // Render student-teacher selection
  const renderTeacherSelection = () => {
    if (!selectedDate) return null;

    const teachersForDate = getTeachersForDate(selectedDate);

    return (
      <div style={{ marginTop: 20 }}>
        <div style={{
          fontSize: 14,
          fontWeight: 600,
          color: textPrimary,
          marginBottom: 12
        }}>
          {formatDisplayDate(selectedDate)}
        </div>

        <div style={{
          fontSize: 14,
          color: textSecondary,
          marginBottom: 16
        }}>
          Available Student-Teachers:
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {teachersForDate.map(teacher => {
            const times = teacher.availability[selectedDate] || [];
            const isTeacherSelected = selectedTeacher?.id === teacher.id;

            return (
              <div
                key={teacher.id}
                style={{
                  background: bgCard,
                  borderRadius: 12,
                  border: `1px solid ${isTeacherSelected ? accentBlue : borderColor}`,
                  padding: 16,
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Teacher info row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 12
                }}>
                  {/* Avatar */}
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: accentBlue,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {teacher.initials}
                  </div>

                  {/* Name & stats */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: textPrimary,
                      marginBottom: 2
                    }}>
                      {teacher.name}
                    </div>
                    <div style={{
                      fontSize: 13,
                      color: textSecondary,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12
                    }}>
                      <span><FaUser style={{ fontSize: 10, marginRight: 4 }} />{teacher.studentsTaught} students taught</span>
                      <span>⭐ {teacher.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Time slots */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8
                }}>
                  {times.map(time => {
                    const isTimeSelected = isTeacherSelected && selectedTime === time;
                    return (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(teacher, time)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 20,
                          border: isTimeSelected ? 'none' : `1px solid ${borderColor}`,
                          background: isTimeSelected ? accentBlue : 'transparent',
                          color: isTimeSelected ? '#fff' : textPrimary,
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <FaClock style={{ fontSize: 11 }} />
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Step 1: Enrollment confirmation
  const renderEnrollStep = () => (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{
        fontSize: 48,
        marginBottom: 16
      }}>
        🎓
      </div>
      <h2 style={{
        fontSize: 24,
        fontWeight: 700,
        color: textPrimary,
        marginBottom: 8
      }}>
        Enroll in {course?.title}
      </h2>
      <p style={{
        fontSize: 15,
        color: textSecondary,
        marginBottom: 24,
        lineHeight: 1.6
      }}>
        Get full course access plus 1-on-1 sessions with certified Student-Teachers.
      </p>

      <div style={{
        background: bgSecondary,
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
        textAlign: 'left'
      }}>
        <div style={{
          fontSize: 13,
          color: textSecondary,
          marginBottom: 8
        }}>
          What's included:
        </div>
        <ul style={{
          margin: 0,
          paddingLeft: 20,
          color: textPrimary,
          fontSize: 14,
          lineHeight: 2
        }}>
          <li>Full course curriculum access</li>
          <li>1-on-1 video sessions with Student-Teachers</li>
          <li>Path to certification & earning 70% as a teacher</li>
          <li>Community access & support</li>
        </ul>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 24
      }}>
        <span style={{
          fontSize: 32,
          fontWeight: 700,
          color: textPrimary
        }}>
          {course?.price}
        </span>
        <span style={{
          fontSize: 14,
          color: textSecondary
        }}>
          one-time
        </span>
      </div>

      <button
        onClick={handleEnroll}
        style={{
          width: '100%',
          padding: '14px 24px',
          background: accentBlue,
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer'
        }}
      >
        Continue to Schedule Session
      </button>
    </div>
  );

  // Step 2 & 3: Date and teacher selection
  const renderScheduleStep = () => (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20
      }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: accentGreen,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14
        }}>
          <FaCheck />
        </div>
        <span style={{
          fontSize: 16,
          fontWeight: 600,
          color: textPrimary
        }}>
          You're enrolled! Now schedule your first session.
        </span>
      </div>

      <div style={{
        fontSize: 14,
        color: textSecondary,
        marginBottom: 12
      }}>
        Select a day:
      </div>

      {renderCalendar()}
      {renderTeacherSelection()}

      {selectedTeacher && selectedTime && (
        <button
          onClick={handleConfirmBooking}
          style={{
            width: '100%',
            padding: '14px 24px',
            background: accentBlue,
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: 20
          }}
        >
          Confirm Booking
        </button>
      )}
    </div>
  );

  // Step 4: Confirmation
  const renderConfirmationStep = () => (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: accentGreen,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 28,
        margin: '0 auto 20px'
      }}>
        <FaCheck />
      </div>

      <h2 style={{
        fontSize: 24,
        fontWeight: 700,
        color: textPrimary,
        marginBottom: 8
      }}>
        You're all set!
      </h2>

      <p style={{
        fontSize: 15,
        color: textSecondary,
        marginBottom: 24
      }}>
        Your first session is booked.
      </p>

      <div style={{
        background: bgSecondary,
        borderRadius: 12,
        padding: 20,
        textAlign: 'left',
        marginBottom: 24
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 16
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: accentBlue,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 700
          }}>
            {selectedTeacher?.initials}
          </div>
          <div>
            <div style={{
              fontSize: 16,
              fontWeight: 600,
              color: textPrimary
            }}>
              {selectedTeacher?.name}
            </div>
            <div style={{
              fontSize: 13,
              color: textSecondary
            }}>
              Your Student-Teacher
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          fontSize: 14,
          color: textPrimary
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FaCalendarAlt style={{ color: textSecondary }} />
            {formatDisplayDate(selectedDate)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FaClock style={{ color: textSecondary }} />
            {selectedTime}
          </div>
        </div>
      </div>

      <p style={{
        fontSize: 13,
        color: textSecondary,
        marginBottom: 20
      }}>
        A calendar invite and video link have been sent to your email.
      </p>

      <button
        onClick={onClose}
        style={{
          width: '100%',
          padding: '14px 24px',
          background: accentBlue,
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer'
        }}
      >
        Go to Dashboard
      </button>
    </div>
  );

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
      zIndex: 1000,
      padding: 20
    }}>
      <div style={{
        background: bgPrimary,
        borderRadius: 16,
        width: '100%',
        maxWidth: 500,
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: `1px solid ${borderColor}`,
          position: 'sticky',
          top: 0,
          background: bgPrimary,
          zIndex: 10
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            {step > 1 && step < 4 && (
              <button
                onClick={() => setStep(step - 1)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 4,
                  cursor: 'pointer',
                  color: textSecondary
                }}
              >
                <FaChevronLeft />
              </button>
            )}
            <span style={{
              fontSize: 16,
              fontWeight: 600,
              color: textPrimary
            }}>
              {step === 1 && 'Enroll'}
              {step === 2 && 'Schedule Session'}
              {step === 3 && 'Schedule Session'}
              {step === 4 && 'Confirmed'}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 8,
              cursor: 'pointer',
              color: textSecondary,
              fontSize: 18
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 20 }}>
          {step === 1 && renderEnrollStep()}
          {(step === 2 || step === 3) && renderScheduleStep()}
          {step === 4 && renderConfirmationStep()}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentFlow;
