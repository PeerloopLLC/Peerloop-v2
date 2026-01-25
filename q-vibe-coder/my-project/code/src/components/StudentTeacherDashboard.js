import React, { useState, useEffect } from 'react';
import {
  FaChevronDown,
  FaVideo,
  FaCalendarAlt,
  FaTimes,
  FaPlus,
  FaSave
} from 'react-icons/fa';

// Add spin animation for loading spinner
const spinKeyframes = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const StudentTeacherDashboard = ({
  isDarkMode = true,
  currentUser,
  stTeacherStats,
  onAddActiveStudent,
  onCompleteSession,
  onCertifyStudent,
  scheduledSessions = [],
  onJoinSession
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timezone, setTimezone] = useState('America/Chicago');
  const [joiningSessionId, setJoiningSessionId] = useState(null); // Track which session is loading

  // Certify modal state
  const [showCertifyModal, setShowCertifyModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [certifyNotes, setCertifyNotes] = useState('');
  const [selectedSessionNumber, setSelectedSessionNumber] = useState(1);
  const [moduleChecks, setModuleChecks] = useState({
    module1: false,
    module2: false,
    module3: false,
    module4: false
  });

  // Inject spin animation CSS
  useEffect(() => {
    const styleId = 'st-dashboard-spin-animation';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = spinKeyframes;
      document.head.appendChild(style);
    }
  }, []);

  // Reschedule notifications state
  const [rescheduleNotifications, setRescheduleNotifications] = useState([]);

  // Load reschedule notifications from localStorage
  useEffect(() => {
    if (!currentUser?.id) return;
    try {
      const notifKey = `rescheduleNotifications_${currentUser.id}`;
      const notifs = JSON.parse(localStorage.getItem(notifKey) || '[]');
      setRescheduleNotifications(notifs.filter(n => !n.acknowledged));
    } catch (e) {
      setRescheduleNotifications([]);
    }
  }, [currentUser?.id]);

  // Acknowledge a reschedule notification
  const acknowledgeReschedule = (notifId) => {
    if (!currentUser?.id) return;
    const notifKey = `rescheduleNotifications_${currentUser.id}`;
    const allNotifs = JSON.parse(localStorage.getItem(notifKey) || '[]');
    const updated = allNotifs.map(n => n.id === notifId ? { ...n, acknowledged: true } : n);
    localStorage.setItem(notifKey, JSON.stringify(updated));
    setRescheduleNotifications(prev => prev.filter(n => n.id !== notifId));
  };

  // Open certify modal for a student
  const handleOpenCertify = (student) => {
    setSelectedStudent(student);
    setSelectedSessionNumber(1); // Default to session 1
    setModuleChecks({ module1: false, module2: false, module3: false, module4: false });
    setCertifyNotes('');
    setShowCertifyModal(true);
  };

  // Handle certify submission - now passes sessionNumber
  const handleCertifySubmit = () => {
    if (selectedStudent && onCertifyStudent) {
      onCertifyStudent(
        selectedStudent.id,           // enrollmentId (userId-courseId)
        selectedStudent.name,         // studentName
        selectedStudent.courseName,   // courseName
        selectedStudent.courseId,     // courseId
        selectedSessionNumber,        // sessionNumber (1 or 2)
        2                             // totalSessions (default 2)
      );
    }
    setShowCertifyModal(false);
    setSelectedStudent(null);
    setCertifyNotes('');
    setSelectedSessionNumber(1);
    setModuleChecks({ module1: false, module2: false, module3: false, module4: false });
  };

  // Check if all modules are checked (or session selected for new flow)
  const allModulesChecked = selectedSessionNumber > 0;

  // Availability state - each day has an array of time slots
  const [availability, setAvailability] = useState({
    monday: [],
    tuesday: [
      { start: '10:00 AM', end: '12:00 PM' },
      { start: '2:00 PM', end: '5:00 PM' }
    ],
    wednesday: [
      { start: '7:00 PM', end: '9:00 PM' }
    ],
    thursday: [],
    friday: [
      { start: '10:00 AM', end: '12:00 PM' }
    ],
    saturday: [],
    sunday: []
  });

  // Student-Teacher info - use currentUser if available
  const stInfo = {
    name: currentUser?.name || "Marcus Chen",
    courseName: "AI Prompting Mastery",
    initials: currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('') : "MC"
  };

  // Navigation tabs for this dashboard
  const navTabs = [
    { id: 'dashboard', label: 'Workspace' },
    { id: 'availability', label: 'Availability' }
  ];

  // Quick stats - use real data from stTeacherStats prop
  const quickStats = [
    { value: stTeacherStats?.activeStudents?.length || 0, label: 'Active', sublabel: 'Students' },
    { value: stTeacherStats?.completedStudents?.length || 0, label: 'Total', sublabel: 'Taught' },
    { value: `$${(stTeacherStats?.totalEarned || 0).toLocaleString()}`, label: 'Total', sublabel: 'Earned' }
  ];

  // S-T Rating and earnings - use real data from stTeacherStats prop
  const stRating = stTeacherStats?.rating || 0;
  const pendingBalance = stTeacherStats?.pendingBalance || 0;

  // My Students data - derive from stTeacherStats.activeStudents
  // Find next session for each student from scheduledSessions
  const getNextSessionForStudent = (studentId) => {
    const studentSessions = scheduledSessions
      .filter(s => s.studentId === studentId && s.status === 'scheduled')
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (studentSessions.length > 0) {
      const session = studentSessions[0];
      // Format date nicely
      const date = new Date(session.date);
      const options = { month: 'short', day: 'numeric' };
      return `${date.toLocaleDateString('en-US', options)}, ${session.time}`;
    }
    return null;
  };

  const myStudents = (stTeacherStats?.activeStudents || []).map(student => ({
    id: student.id,
    name: student.name,
    courseName: student.courseName,
    courseId: student.courseId,
    progress: 0, // Start at 0%, will update as they complete modules
    nextSession: getNextSessionForStudent(student.id),
    enrolledDate: student.enrolledDate
  }));

  // Group students by name for display
  const studentsGrouped = myStudents.reduce((groups, student) => {
    const name = student.name;
    if (!groups[name]) {
      groups[name] = [];
    }
    groups[name].push(student);
    return groups;
  }, {});

  // Convert to array for rendering
  const studentGroups = Object.entries(studentsGrouped).map(([name, courses]) => ({
    name,
    courses
  }));

  // Upcoming sessions - derive from scheduledSessions where this S-T is the teacher
  const upcomingSessions = scheduledSessions
    .filter(s => s.teacherId === currentUser?.id && s.status === 'scheduled')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5) // Show max 5 upcoming
    .map(session => {
      const date = new Date(session.date);
      const options = { month: 'short', day: 'numeric' };
      const formattedDate = `${date.toLocaleDateString('en-US', options)}, ${session.time}`;

      // Check if session is within 5 minutes of now (can join)
      const sessionDateTime = new Date(`${session.date} ${session.time}`);
      const now = new Date();
      const timeDiff = sessionDateTime - now;
      const canJoin = timeDiff <= 5 * 60 * 1000 && timeDiff >= -60 * 60 * 1000; // 5 min before to 1 hour after

      return {
        id: session.id,
        courseId: session.courseId,
        courseName: session.courseName,
        date: formattedDate,
        student: session.studentName || 'Unknown Student',
        module: session.courseName || 'Course Session',
        canJoin
      };
    });

  // Completed sessions - derive from scheduledSessions where status is 'completed'
  const completedSessions = scheduledSessions
    .filter(s => s.teacherId === currentUser?.id && s.status === 'completed')
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // Most recent first
    .slice(0, 5) // Show max 5 completed
    .map(session => {
      const date = new Date(session.date);
      const options = { month: 'short', day: 'numeric' };
      const formattedDate = `${date.toLocaleDateString('en-US', options)}, ${session.time}`;

      return {
        id: session.id,
        courseName: session.courseName,
        date: formattedDate,
        student: session.studentName || 'Unknown Student',
        module: session.courseName || 'Course Session'
      };
    });

  // Days of the week
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  // Timezone options
  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Phoenix',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney'
  ];

  // Get timezone abbreviation
  const getTimezoneAbbr = (tz) => {
    const abbrs = {
      'America/New_York': 'EST',
      'America/Chicago': 'CST',
      'America/Denver': 'MST',
      'America/Los_Angeles': 'PST',
      'America/Phoenix': 'MST',
      'Europe/London': 'GMT',
      'Europe/Paris': 'CET',
      'Asia/Tokyo': 'JST',
      'Asia/Shanghai': 'CST',
      'Australia/Sydney': 'AEDT'
    };
    return abbrs[tz] || 'UTC';
  };

  // Add time slot to a day
  const addTimeSlot = (day) => {
    setAvailability(prev => ({
      ...prev,
      [day]: [...prev[day], { start: '9:00 AM', end: '10:00 AM' }]
    }));
  };

  // Remove time slot from a day
  const removeTimeSlot = (day, index) => {
    setAvailability(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };

  // Colors
  const bgPrimary = isDarkMode ? '#000' : '#fff';
  const bgSecondary = isDarkMode ? '#16181c' : '#f8fafc';
  const bgCard = isDarkMode ? '#16181c' : '#fff';
  const textPrimary = isDarkMode ? '#e7e9ea' : '#0f172a';
  const textSecondary = isDarkMode ? '#71767b' : '#64748b';
  const borderColor = isDarkMode ? '#2f3336' : '#e2e8f0';
  const accentBlue = '#1d9bf0';
  const accentGreen = '#00ba7c';

  // Progress bar component
  const ProgressBar = ({ percent }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 80,
        height: 8,
        background: isDarkMode ? '#2f3336' : '#e2e8f0',
        borderRadius: 4,
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percent}%`,
          height: '100%',
          background: accentBlue,
          borderRadius: 4
        }} />
      </div>
      <span style={{ fontSize: 13, color: textSecondary }}>{percent}%</span>
    </div>
  );

  // Render Availability Tab
  const renderAvailabilityTab = () => (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontSize: 24,
          fontWeight: 700,
          color: textPrimary,
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <span style={{ fontSize: 24 }}>⚙️</span> My Availability
        </h1>
        <p style={{
          fontSize: 15,
          color: textSecondary,
          margin: '8px 0 0 0'
        }}>
          Set your weekly teaching schedule
        </p>
      </div>

      {/* Timezone Selector */}
      <div style={{ marginBottom: 24 }}>
        <span style={{ fontSize: 14, color: textSecondary }}>Timezone: </span>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: `1px solid ${borderColor}`,
            background: bgSecondary,
            color: textPrimary,
            fontSize: 14,
            cursor: 'pointer'
          }}
        >
          {timezones.map(tz => (
            <option key={tz} value={tz}>
              {tz} ({getTimezoneAbbr(tz)})
            </option>
          ))}
        </select>
      </div>

      {/* Weekly Schedule */}
      <div style={{
        background: bgCard,
        borderRadius: 12,
        border: `1px solid ${borderColor}`,
        overflow: 'hidden',
        marginBottom: 24
      }}>
        {daysOfWeek.map((day, dayIndex) => (
          <div
            key={day}
            style={{
              padding: 16,
              borderBottom: dayIndex < daysOfWeek.length - 1 ? `1px solid ${borderColor}` : 'none'
            }}
          >
            {/* Day Header */}
            <div style={{
              fontSize: 14,
              fontWeight: 600,
              color: textPrimary,
              textTransform: 'uppercase',
              marginBottom: 12
            }}>
              {day}
            </div>

            {/* Time Slots */}
            {availability[day].map((slot, slotIndex) => (
              <div
                key={slotIndex}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: bgSecondary,
                  borderRadius: 8,
                  marginBottom: 8,
                  border: `1px solid ${borderColor}`
                }}
              >
                <span style={{ fontSize: 14, color: textPrimary }}>
                  {slot.start} - {slot.end}
                </span>
                <button
                  onClick={() => removeTimeSlot(day, slotIndex)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '6px 12px',
                    background: 'transparent',
                    border: `1px solid ${isDarkMode ? '#ef4444' : '#fca5a5'}`,
                    borderRadius: 6,
                    color: '#ef4444',
                    fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  <FaTimes style={{ fontSize: 10 }} />
                  Remove
                </button>
              </div>
            ))}

            {/* Add Time Slot Button */}
            <button
              onClick={() => addTimeSlot(day)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 12px',
                background: 'transparent',
                border: 'none',
                color: accentBlue,
                fontSize: 14,
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              <FaPlus style={{ fontSize: 12 }} />
              Add time slot
            </button>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          width: '100%',
          padding: '14px 24px',
          background: accentBlue,
          border: 'none',
          borderRadius: 12,
          color: '#fff',
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer'
        }}
      >
        <FaSave style={{ fontSize: 16 }} />
        Save Availability
      </button>
    </div>
  );

  // Render Dashboard Tab
  const renderDashboardTab = () => (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      {/* Welcome Section */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h1 style={{
            fontSize: 24,
            fontWeight: 700,
            color: textPrimary,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span style={{ fontSize: 28 }}>👋</span> Welcome back, {stInfo.name.split(' ')[0]}!
          </h1>
          {/* Star Rating */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: '#fbbf24'
          }}>
            <span style={{ fontSize: 18 }}>★★★★★</span>
            <span style={{ color: textPrimary, fontWeight: 600 }}>({stRating})</span>
          </div>
        </div>
        <p style={{
          fontSize: 15,
          color: textSecondary,
          margin: '8px 0 0 0'
        }}>
          Student-Teacher: {stInfo.courseName}
        </p>
      </div>

      {/* Quick Stats */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontSize: 14,
          fontWeight: 600,
          color: textSecondary,
          margin: '0 0 12px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          📊 QUICK STATS
        </h2>
        <div style={{
          display: 'flex',
          gap: 12
        }}>
          {quickStats.map((stat, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                background: bgCard,
                borderRadius: 12,
                padding: 16,
                border: `1px solid ${borderColor}`,
                textAlign: 'center'
              }}
            >
              <div style={{
                fontSize: 28,
                fontWeight: 700,
                color: textPrimary,
                marginBottom: 4
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 13, color: textSecondary }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 12, color: textSecondary, opacity: 0.8 }}>
                {stat.sublabel}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Students */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontSize: 14,
          fontWeight: 600,
          color: textSecondary,
          margin: '0 0 12px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          👥 MY STUDENTS
        </h2>
        <div style={{
          background: bgCard,
          borderRadius: 12,
          border: `1px solid ${borderColor}`,
          overflow: 'hidden'
        }}>
          {/* Empty State */}
          {studentGroups.length === 0 ? (
            <div style={{
              padding: '32px 16px',
              textAlign: 'center',
              color: textSecondary
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
              <div style={{ fontSize: 14 }}>No students yet</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
                Students will appear here when they enroll with you
              </div>
            </div>
          ) : (
            /* Grouped by Student */
            studentGroups.map((group, groupIndex) => (
              <div key={group.name} style={{
                borderBottom: groupIndex < studentGroups.length - 1 ? `1px solid ${borderColor}` : 'none'
              }}>
                {/* Student Name Header */}
                <div style={{
                  padding: '12px 16px 8px 16px',
                  background: bgSecondary,
                  borderBottom: `1px solid ${borderColor}`
                }}>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: textPrimary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {group.name}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: textSecondary,
                    marginTop: 2
                  }}>
                    {group.courses.length} course{group.courses.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Courses for this Student */}
                {group.courses.map((course, courseIndex) => (
                  <div
                    key={course.id || courseIndex}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 140px 90px',
                      padding: '12px 16px 12px 24px',
                      borderBottom: courseIndex < group.courses.length - 1 ? `1px solid ${borderColor}` : 'none',
                      alignItems: 'center',
                      background: bgCard
                    }}
                  >
                    <div style={{ fontSize: 14, color: textPrimary }}>
                      {course.courseName || 'Untitled Course'}
                    </div>
                    <div style={{ fontSize: 13, color: course.nextSession ? textPrimary : textSecondary }}>
                      {course.nextSession || 'Not scheduled'}
                    </div>
                    <button
                      onClick={() => handleOpenCertify(course)}
                      style={{
                        padding: '6px 12px',
                        background: accentGreen,
                        border: 'none',
                        borderRadius: 6,
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Certify
                    </button>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reschedule Notifications */}
      {rescheduleNotifications.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {rescheduleNotifications.map(notif => {
            const formatNotifDate = (dateStr) => {
              if (!dateStr) return '';
              const d = new Date(dateStr + 'T00:00:00');
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return `${months[d.getMonth()]} ${d.getDate()}`;
            };
            return (
              <div
                key={notif.id}
                style={{
                  background: isDarkMode ? '#1a2332' : '#eff6ff',
                  border: `1px solid ${isDarkMode ? '#1d4ed8' : '#bfdbfe'}`,
                  borderRadius: 10,
                  padding: '12px 16px',
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}
              >
                <div style={{ fontSize: 20 }}>🔄</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: isDarkMode ? '#e7e9ea' : '#1e293b', marginBottom: 2 }}>
                    {notif.studentName} rescheduled
                  </div>
                  <div style={{ fontSize: 12, color: isDarkMode ? '#71767b' : '#64748b' }}>
                    {notif.courseName}: {formatNotifDate(notif.oldDate)} {notif.oldTime} → {formatNotifDate(notif.newDate)} {notif.newTime}
                  </div>
                </div>
                <button
                  onClick={() => acknowledgeReschedule(notif.id)}
                  style={{
                    background: isDarkMode ? '#2f3336' : '#e5e7eb',
                    border: 'none',
                    color: isDarkMode ? '#e7e9ea' : '#374151',
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  OK
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Upcoming Sessions */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontSize: 14,
          fontWeight: 600,
          color: textSecondary,
          margin: '0 0 12px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          📅 UPCOMING SESSIONS
        </h2>
        <div style={{
          background: bgCard,
          borderRadius: 12,
          border: `1px solid ${borderColor}`,
          overflow: 'hidden'
        }}>
          {upcomingSessions.length === 0 ? (
            <div style={{
              padding: '32px 16px',
              textAlign: 'center',
              color: textSecondary
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
              <div style={{ fontSize: 14 }}>No upcoming sessions</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
                Sessions will appear here when students book with you
              </div>
            </div>
          ) : (
            upcomingSessions.map((session, index) => (
              <div
                key={session.id || index}
                style={{
                  padding: 16,
                  borderBottom: index < upcomingSessions.length - 1 ? `1px solid ${borderColor}` : 'none'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 4
                }}>
                  <FaCalendarAlt style={{ color: accentBlue, fontSize: 14 }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>
                    {session.date}
                  </span>
                  <span style={{ color: textSecondary }}>-</span>
                  <span style={{ fontSize: 14, color: textPrimary }}>
                    {session.student}
                  </span>
                </div>
                <div style={{
                  fontSize: 13,
                  color: textSecondary,
                  marginBottom: 12,
                  marginLeft: 22
                }}>
                  {session.module}
                </div>
                <button
                  onClick={() => {
                    if (joiningSessionId) return; // Prevent double-click
                    setJoiningSessionId(session.id);
                    onJoinSession && onJoinSession(session);
                  }}
                  disabled={joiningSessionId === session.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    background: joiningSessionId === session.id ? '#64748b' : accentBlue,
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: joiningSessionId === session.id ? 'wait' : 'pointer',
                    width: '100%',
                    justifyContent: 'center',
                    opacity: joiningSessionId === session.id ? 0.8 : 1
                  }}>
                  {joiningSessionId === session.id ? (
                    <>
                      <span style={{
                        width: 14,
                        height: 14,
                        border: '2px solid #fff',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <FaVideo style={{ fontSize: 14 }} />
                      Join Session
                    </>
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Completed Sessions */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontSize: 14,
          fontWeight: 600,
          color: textSecondary,
          margin: '0 0 12px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          ✅ COMPLETED SESSIONS
        </h2>
        <div style={{
          background: bgCard,
          borderRadius: 12,
          border: `1px solid ${borderColor}`,
          overflow: 'hidden'
        }}>
          {completedSessions.length === 0 ? (
            <div style={{
              padding: '32px 16px',
              textAlign: 'center',
              color: textSecondary
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
              <div style={{ fontSize: 14 }}>No completed sessions yet</div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
                Sessions will appear here after they're completed
              </div>
            </div>
          ) : (
            completedSessions.map((session, index) => (
              <div
                key={session.id || index}
                style={{
                  padding: 16,
                  borderBottom: index < completedSessions.length - 1 ? `1px solid ${borderColor}` : 'none'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 4
                }}>
                  <FaCalendarAlt style={{ color: accentGreen, fontSize: 14 }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>
                    {session.date}
                  </span>
                  <span style={{ color: textSecondary }}>-</span>
                  <span style={{ fontSize: 14, color: textPrimary }}>
                    {session.student}
                  </span>
                </div>
                <div style={{
                  fontSize: 13,
                  color: textSecondary,
                  marginLeft: 22
                }}>
                  {session.module}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pending Balance */}
      <div style={{
        marginBottom: 24,
        padding: 16,
        background: bgCard,
        borderRadius: 12,
        border: `1px solid ${borderColor}`
      }}>
        <div style={{
          fontSize: 14,
          color: textSecondary,
          marginBottom: 4
        }}>
          Pending Balance
        </div>
        <div style={{
          fontSize: 24,
          fontWeight: 700,
          color: accentGreen,
          marginBottom: 4
        }}>
          ${pendingBalance}.00
        </div>
        <div style={{
          fontSize: 13,
          color: textSecondary
        }}>
          (Released after student certification)
        </div>
      </div>

      {/* Quick Links */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontSize: 14,
          fontWeight: 600,
          color: textSecondary,
          margin: '0 0 12px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          🔗 QUICK LINKS
        </h2>
        <div style={{
          display: 'flex',
          gap: 12
        }}>
          <button
            onClick={() => setActiveTab('availability')}
            style={{
              flex: 1,
              padding: '14px 16px',
              background: bgCard,
              border: `1px solid ${borderColor}`,
              borderRadius: 12,
              color: accentBlue,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            Set Availability
          </button>
          <button
            style={{
              flex: 1,
              padding: '14px 16px',
              background: bgCard,
              border: `1px solid ${borderColor}`,
              borderRadius: 12,
              color: textSecondary,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'not-allowed',
              textAlign: 'center',
              opacity: 0.6
            }}
          >
            My Students
          </button>
          <button
            style={{
              flex: 1,
              padding: '14px 16px',
              background: bgCard,
              border: `1px solid ${borderColor}`,
              borderRadius: 12,
              color: textSecondary,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'not-allowed',
              textAlign: 'center',
              opacity: 0.6
            }}
          >
            Earnings History
          </button>
        </div>
      </div>
    </div>
  );

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
          fontSize: 24,
          fontWeight: 700,
          color: accentBlue
        }}>
          ∞
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flex: 1,
          marginLeft: 32
        }}>
          {navTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 16px',
                background: activeTab === tab.id ? (isDarkMode ? '#2f3336' : '#e2e8f0') : 'transparent',
                border: 'none',
                borderRadius: 8,
                color: activeTab === tab.id ? accentBlue : textSecondary,
                fontSize: 14,
                fontWeight: activeTab === tab.id ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
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
          {stInfo.name.split(' ')[0]}
          <FaChevronDown style={{ fontSize: 10, color: textSecondary }} />
        </button>
      </div>

      {/* Main Content - Switch based on active tab */}
      {activeTab === 'dashboard' && renderDashboardTab()}
      {activeTab === 'availability' && renderAvailabilityTab()}

      {/* Certify Student Modal */}
      {showCertifyModal && selectedStudent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: bgCard,
            borderRadius: 16,
            width: '90%',
            maxWidth: 480,
            maxHeight: '90vh',
            overflow: 'auto',
            border: `1px solid ${borderColor}`
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: `1px solid ${borderColor}`
            }}>
              <h2 style={{
                fontSize: 18,
                fontWeight: 700,
                color: textPrimary,
                margin: 0
              }}>
                Certify {selectedStudent.name} for {selectedStudent.courseName || 'Course'}
              </h2>
              <button
                onClick={() => {
                  setShowCertifyModal(false);
                  setSelectedStudent(null);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: textSecondary,
                  fontSize: 20,
                  cursor: 'pointer',
                  padding: 4
                }}
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: 20 }}>
              {/* Course Name */}
              <div style={{
                fontSize: 14,
                color: textSecondary,
                marginBottom: 20
              }}>
                Course: <span style={{ color: textPrimary, fontWeight: 500 }}>{selectedStudent.courseName || 'Course'}</span>
              </div>

              {/* Session Selection */}
              <div style={{ marginBottom: 20 }}>
                <div style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: textPrimary,
                  marginBottom: 12
                }}>
                  Which session are you certifying?
                </div>
                {[
                  { number: 1, label: 'Session 1: Foundations & Frameworks', duration: '90 min' },
                  { number: 2, label: 'Session 2: Advanced Techniques', duration: '90 min' }
                ].map(session => (
                  <label
                    key={session.number}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '14px 16px',
                      background: selectedSessionNumber === session.number ? (isDarkMode ? 'rgba(0, 186, 124, 0.15)' : 'rgba(0, 186, 124, 0.1)') : bgSecondary,
                      borderRadius: 10,
                      marginBottom: 10,
                      cursor: 'pointer',
                      border: `2px solid ${selectedSessionNumber === session.number ? accentGreen : borderColor}`,
                      transition: 'all 0.2s'
                    }}
                  >
                    <input
                      type="radio"
                      name="sessionNumber"
                      checked={selectedSessionNumber === session.number}
                      onChange={() => setSelectedSessionNumber(session.number)}
                      style={{
                        width: 20,
                        height: 20,
                        accentColor: accentGreen,
                        cursor: 'pointer'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: textPrimary
                      }}>
                        {session.label}
                      </div>
                      <div style={{
                        fontSize: 13,
                        color: textSecondary,
                        marginTop: 2
                      }}>
                        {session.duration}
                      </div>
                    </div>
                    {selectedSessionNumber === session.number && (
                      <span style={{ color: accentGreen, fontSize: 18 }}>✓</span>
                    )}
                  </label>
                ))}
              </div>

              {/* Certification Notes */}
              <div style={{ marginBottom: 20 }}>
                <div style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: textPrimary,
                  marginBottom: 8
                }}>
                  Certification Notes:
                </div>
                <textarea
                  value={certifyNotes}
                  onChange={(e) => setCertifyNotes(e.target.value)}
                  placeholder="Great progress, completed all modules..."
                  style={{
                    width: '100%',
                    minHeight: 80,
                    padding: 12,
                    borderRadius: 8,
                    border: `1px solid ${borderColor}`,
                    background: bgSecondary,
                    color: textPrimary,
                    fontSize: 14,
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Warning */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: 12,
                background: isDarkMode ? 'rgba(251, 191, 36, 0.1)' : 'rgba(251, 191, 36, 0.15)',
                borderRadius: 8,
                marginBottom: 20
              }}>
                <span style={{ fontSize: 18 }}>⚠️</span>
                <div style={{ fontSize: 13, color: textPrimary }}>
                  This will release <strong>$315</strong> to your pending balance
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: 12
              }}>
                <button
                  onClick={() => {
                    setShowCertifyModal(false);
                    setSelectedStudent(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: 'transparent',
                    border: `1px solid ${borderColor}`,
                    borderRadius: 8,
                    color: textPrimary,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCertifySubmit}
                  disabled={!allModulesChecked}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: allModulesChecked ? accentGreen : (isDarkMode ? '#2f3336' : '#e2e8f0'),
                    border: 'none',
                    borderRadius: 8,
                    color: allModulesChecked ? '#fff' : textSecondary,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: allModulesChecked ? 'pointer' : 'not-allowed',
                    opacity: allModulesChecked ? 1 : 0.6
                  }}
                >
                  Certify Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTeacherDashboard;
