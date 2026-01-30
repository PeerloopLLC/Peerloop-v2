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
    // Use the sessionNumber passed from the button click (1 or 2)
    setSelectedSessionNumber(student.sessionNumber || 1);
    setModuleChecks({ module1: false, module2: false, module3: false, module4: false });
    setCertifyNotes('');
    setShowCertifyModal(true);
  };

  // Handle certify submission - now passes sessionNumber
  const handleCertifySubmit = () => {
    if (selectedStudent && onCertifyStudent) {
      // Use the actual studentId if available, otherwise fall back to id
      const actualStudentId = selectedStudent.studentId || selectedStudent.id;
      onCertifyStudent(
        actualStudentId,              // actual userId like "demo_sarah"
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

  // Build unified student data structure for the new layout
  // Groups all info by student, then by course, with per-session tracking
  const buildUnifiedStudentData = () => {
    const studentMap = {};

    // Helper to format date
    const formatDate = (dateStr, time) => {
      const date = new Date(dateStr);
      const options = { month: 'short', day: 'numeric' };
      return time ? `${date.toLocaleDateString('en-US', options)}, ${time}` : date.toLocaleDateString('en-US', options);
    };

    // Initialize course template with per-session fields
    const createCourseEntry = (courseId, courseName) => ({
      courseId,
      courseName,
      // Session 1 fields
      session1Id: null,
      session1Date: null,
      session1Certified: false,
      session1CertifiedDate: null,
      // Session 2 fields
      session2Id: null,
      session2Date: null,
      session2Certified: false,
      session2CertifiedDate: null,
      // Legacy fields for compatibility
      certified: false,
      upcomingSession: null,
      completedSessions: []
    });

    // First, add all active students and their courses
    (stTeacherStats?.activeStudents || []).forEach(student => {
      // Extract actual studentId from enrollment ID (format: "demo_sarah-15")
      const enrollmentId = student.id || '';
      const lastDash = enrollmentId.lastIndexOf('-');
      const actualStudentId = lastDash > 0 ? enrollmentId.substring(0, lastDash) : enrollmentId;

      if (!studentMap[student.name]) {
        studentMap[student.name] = {
          name: student.name,
          initials: student.name.split(' ').map(n => n[0]).join(''),
          studentId: actualStudentId, // Store actual user ID like "demo_sarah"
          courses: {}
        };
      }
      if (!studentMap[student.name].courses[student.courseId]) {
        studentMap[student.name].courses[student.courseId] = createCourseEntry(student.courseId, student.courseName);
      }
    });

    // Collect all sessions per student/course for sorting
    const sessionsByStudentCourse = {};

    // Add scheduled sessions
    scheduledSessions
      .filter(s => s.teacherId === currentUser?.id && s.status === 'scheduled')
      .forEach(session => {
        const studentName = session.studentName || 'Unknown Student';
        const key = `${studentName}|${session.courseId}`;
        if (!sessionsByStudentCourse[key]) {
          sessionsByStudentCourse[key] = { scheduled: [], completed: [] };
        }
        sessionsByStudentCourse[key].scheduled.push(session);

        // Ensure student/course exists
        if (!studentMap[studentName]) {
          studentMap[studentName] = {
            name: studentName,
            initials: studentName.split(' ').map(n => n[0]).join(''),
            studentId: session.studentId || studentName, // Use actual studentId from session
            courses: {}
          };
        } else if (session.studentId && !studentMap[studentName].studentId) {
          // Update studentId if we have it from session but not from activeStudents
          studentMap[studentName].studentId = session.studentId;
        }
        if (!studentMap[studentName].courses[session.courseId]) {
          studentMap[studentName].courses[session.courseId] = createCourseEntry(session.courseId, session.courseName);
        }
      });

    // Add completed sessions
    scheduledSessions
      .filter(s => s.teacherId === currentUser?.id && s.status === 'completed')
      .forEach(session => {
        const studentName = session.studentName || 'Unknown Student';
        const key = `${studentName}|${session.courseId}`;
        if (!sessionsByStudentCourse[key]) {
          sessionsByStudentCourse[key] = { scheduled: [], completed: [] };
        }
        sessionsByStudentCourse[key].completed.push(session);

        // Ensure student/course exists
        if (!studentMap[studentName]) {
          studentMap[studentName] = {
            name: studentName,
            initials: studentName.split(' ').map(n => n[0]).join(''),
            studentId: session.studentId || studentName, // Use actual studentId from session
            courses: {}
          };
        } else if (session.studentId && !studentMap[studentName].studentId) {
          // Update studentId if we have it from session but not already set
          studentMap[studentName].studentId = session.studentId;
        }
        if (!studentMap[studentName].courses[session.courseId]) {
          studentMap[studentName].courses[session.courseId] = createCourseEntry(session.courseId, session.courseName);
        }
      });

    // Assign sessions to Session 1 and Session 2 slots
    Object.entries(sessionsByStudentCourse).forEach(([key, { scheduled, completed }]) => {
      const [studentName, courseId] = key.split('|');
      if (!studentMap[studentName]?.courses[courseId]) return;

      const course = studentMap[studentName].courses[courseId];

      // Sort by date
      completed.sort((a, b) => new Date(a.date) - new Date(b.date));
      scheduled.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Assign completed sessions first (Session 1 = first completed, Session 2 = second completed)
      if (completed.length >= 1) {
        course.session1Date = formatDate(completed[0].date, completed[0].time);
        course.session1Id = completed[0].id;
        course.completedSessions.push({
          id: completed[0].id,
          date: course.session1Date,
          rawDate: completed[0].date
        });
      }
      if (completed.length >= 2) {
        course.session2Date = formatDate(completed[1].date, completed[1].time);
        course.session2Id = completed[1].id;
        course.completedSessions.push({
          id: completed[1].id,
          date: course.session2Date,
          rawDate: completed[1].date
        });
      }

      // Fill empty slots with scheduled sessions
      if (!course.session1Date && scheduled.length >= 1) {
        course.session1Date = formatDate(scheduled[0].date, scheduled[0].time);
        course.session1Id = scheduled[0].id;
        course.upcomingSession = { id: scheduled[0].id, date: course.session1Date };
      }
      if (!course.session2Date && scheduled.length >= (course.session1Date && completed.length === 0 ? 2 : 1)) {
        const idx = course.session1Date && completed.length === 0 ? 1 : 0;
        if (scheduled[idx]) {
          course.session2Date = formatDate(scheduled[idx].date, scheduled[idx].time);
          course.session2Id = scheduled[idx].id;
        }
      }
    });

    // Check per-session certification from localStorage
    // Try multiple key patterns since certification can be stored under different keys
    Object.entries(studentMap).forEach(([studentName, student]) => {
      Object.entries(student.courses).forEach(([courseId, course]) => {
        // Try multiple localStorage key patterns
        const keysToTry = [
          `sessionCompletion_${studentName}`,           // e.g., sessionCompletion_Sarah Miller
          `sessionCompletion_${studentName}-${courseId}` // e.g., sessionCompletion_Sarah Miller-15
        ];

        for (const key of keysToTry) {
          try {
            const stored = localStorage.getItem(key);
            if (stored) {
              const sessionCompletion = JSON.parse(stored);
              const courseCompletion = sessionCompletion[courseId] || {};

              // Check Session 1 certification
              if (courseCompletion[1]?.completed) {
                course.session1Certified = true;
                const certDate = courseCompletion[1].completedAt;
                if (certDate) {
                  const d = new Date(certDate);
                  course.session1CertifiedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }
              }

              // Check Session 2 certification
              if (courseCompletion[2]?.completed) {
                course.session2Certified = true;
                const certDate = courseCompletion[2].completedAt;
                if (certDate) {
                  const d = new Date(certDate);
                  course.session2CertifiedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }
              }

              // Mark course as fully certified if both sessions done
              if (course.session1Certified && course.session2Certified) {
                course.certified = true;
              }

              // If we found data, no need to try more keys
              if (course.session1Certified || course.session2Certified) {
                break;
              }
            }
          } catch (e) {
            // Silently continue to next key
          }
        }
      });
    });

    // Also check completedStudents for legacy/full certification
    (stTeacherStats?.completedStudents || []).forEach(student => {
      if (studentMap[student.name] && studentMap[student.name].courses[student.courseId]) {
        const course = studentMap[student.name].courses[student.courseId];
        course.certified = true;
      }
    });

    // Convert to array format
    return Object.values(studentMap).map(student => {
      const coursesArray = Object.values(student.courses);
      const certifiedSessionCount = coursesArray.reduce((sum, course) => {
        return sum + (course.session1Certified ? 1 : 0) + (course.session2Certified ? 1 : 0);
      }, 0);
      const totalSessionCount = coursesArray.length * 2;

      return {
        ...student,
        courses: coursesArray,
        totalCourses: coursesArray.length,
        totalCompletedSessions: coursesArray.reduce(
          (sum, course) => sum + course.completedSessions.length, 0
        ),
        certifiedSessionCount,
        totalSessionCount
      };
    });
  };

  const unifiedStudents = buildUnifiedStudentData();

  // Render Dashboard Tab - NEW UNIFIED LAYOUT
  const renderDashboardTab = () => (
    <div style={{ padding: 24, maxWidth: 700, margin: '0 auto' }}>
      {/* Welcome Header with Inline Stats */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 4
        }}>
          <h1 style={{
            fontSize: 22,
            fontWeight: 700,
            color: textPrimary,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <span>👋</span> Welcome back, {stInfo.name.split(' ')[0]}!
          </h1>
          {/* Star Rating */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: '#f7b928',
            fontSize: 14
          }}>
            <span>★★★★★</span>
            <span style={{ color: textSecondary, fontSize: 13 }}>({stRating})</span>
          </div>
        </div>
        <p style={{
          fontSize: 15,
          color: textSecondary,
          fontStyle: 'italic',
          margin: '0 0 12px 0'
        }}>
          Student-Teacher: {stInfo.courseName}
        </p>
        {/* Inline Stats - Twitter style */}
        <div style={{
          display: 'flex',
          gap: 24,
          fontSize: 15
        }}>
          <span>
            <strong style={{ color: textPrimary }}>{stTeacherStats?.activeStudents?.length || 0}</strong>{' '}
            <span style={{ color: textSecondary }}>Students</span>
          </span>
          <span>
            <strong style={{ color: textPrimary }}>{stTeacherStats?.completedStudents?.length || 0}</strong>{' '}
            <span style={{ color: textSecondary }}>Taught</span>
          </span>
          <span>
            <strong style={{ color: accentGreen }}>${(stTeacherStats?.totalEarned || 0).toLocaleString()}</strong>{' '}
            <span style={{ color: textSecondary }}>Earned</span>
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: borderColor, margin: '20px 0' }} />

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
                  <div style={{ fontSize: 13, fontWeight: 600, color: textPrimary, marginBottom: 2 }}>
                    {notif.studentName} rescheduled
                  </div>
                  <div style={{ fontSize: 12, color: textSecondary }}>
                    {notif.courseName}: {formatNotifDate(notif.oldDate)} {notif.oldTime} → {formatNotifDate(notif.newDate)} {notif.newTime}
                  </div>
                </div>
                <button
                  onClick={() => acknowledgeReschedule(notif.id)}
                  style={{
                    background: isDarkMode ? '#2f3336' : '#e5e7eb',
                    border: 'none',
                    color: textPrimary,
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

      {/* Unified Student Cards */}
      {unifiedStudents.length === 0 ? (
        <div style={{
          padding: '48px 16px',
          textAlign: 'center',
          color: textSecondary
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
          <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>No students yet</div>
          <div style={{ fontSize: 14, opacity: 0.8 }}>
            Students will appear here when they enroll with you
          </div>
        </div>
      ) : (
        unifiedStudents.map((student, studentIndex) => (
          <div key={student.name}>
            {/* Student Card */}
            <div style={{ marginBottom: 8 }}>
              {/* Student Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 12
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1d9bf0, #1a8cd8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#fff'
                }}>
                  {student.initials}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: textPrimary }}>
                    {student.name}
                  </div>
                  <div style={{ fontSize: 13, color: textSecondary }}>
                    {student.totalCourses} course{student.totalCourses !== 1 ? 's' : ''} · {student.certifiedSessionCount}/{student.totalSessionCount} sessions certified
                  </div>
                </div>
              </div>

              {/* Course Cards */}
              <div style={{ marginLeft: 60, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {student.courses.map((course, courseIndex) => (
                  <div
                    key={course.courseId || courseIndex}
                    style={{
                      background: bgCard,
                      border: `1px solid ${borderColor}`,
                      borderRadius: 12,
                      padding: '14px 16px'
                    }}
                  >
                    {/* Course Title + Full Certification Status */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 12
                    }}>
                      <div style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: textPrimary
                      }}>
                        {course.courseName || 'Untitled Course'}
                      </div>
                      {/* Show "Fully Certified" when both sessions are certified */}
                      {course.session1Certified && course.session2Certified && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: 13,
                          color: accentGreen,
                          fontWeight: 600
                        }}>
                          <span>✅</span>
                          <span>Fully Certified</span>
                        </div>
                      )}
                    </div>

                    {/* Session 1 Row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                      padding: '8px 0',
                      borderBottom: `1px solid ${borderColor}`
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: textPrimary, marginBottom: 4 }}>
                          Session 1: Foundations
                        </div>
                        {course.session1Certified ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: accentGreen }}>
                            <span>✅</span>
                            <span>Certified {course.session1CertifiedDate || ''}</span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: course.session1Date ? textPrimary : textSecondary }}>
                            <span>📅</span>
                            <span>{course.session1Date || 'Not scheduled'}</span>
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {course.session1Certified ? (
                          <button
                            style={{
                              padding: '6px 14px',
                              background: bgCard,
                              border: `1px solid ${borderColor}`,
                              borderRadius: 16,
                              color: textPrimary,
                              fontSize: 13,
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Recording
                          </button>
                        ) : (
                          <>
                            {course.session1Id && (
                              <button
                                onClick={() => {
                                  if (joiningSessionId) return;
                                  setJoiningSessionId(course.session1Id);
                                  onJoinSession && onJoinSession({
                                    id: course.session1Id,
                                    courseId: course.courseId,
                                    courseName: course.courseName
                                  });
                                }}
                                disabled={joiningSessionId === course.session1Id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  padding: '6px 14px',
                                  background: joiningSessionId === course.session1Id ? '#64748b' : accentBlue,
                                  border: 'none',
                                  borderRadius: 16,
                                  color: '#fff',
                                  fontSize: 13,
                                  fontWeight: 600,
                                  cursor: joiningSessionId === course.session1Id ? 'wait' : 'pointer'
                                }}
                              >
                                {joiningSessionId === course.session1Id ? '...' : <><span>🎥</span> Join</>}
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenCertify({
                                id: `${student.studentId}-${course.courseId}`,
                                name: student.name,
                                courseName: course.courseName,
                                courseId: course.courseId,
                                studentId: student.studentId, // Pass actual userId like "demo_sarah"
                                sessionNumber: 1
                              })}
                              style={{
                                padding: '6px 14px',
                                background: accentGreen,
                                border: 'none',
                                borderRadius: 16,
                                color: '#fff',
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Certify
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Session 2 Row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 0'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: textPrimary, marginBottom: 4 }}>
                          Session 2: Advanced
                        </div>
                        {course.session2Certified ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: accentGreen }}>
                            <span>✅</span>
                            <span>Certified {course.session2CertifiedDate || ''}</span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: course.session2Date ? textPrimary : textSecondary }}>
                            <span>📅</span>
                            <span>{course.session2Date || 'Not scheduled'}</span>
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {course.session2Certified ? (
                          <button
                            style={{
                              padding: '6px 14px',
                              background: bgCard,
                              border: `1px solid ${borderColor}`,
                              borderRadius: 16,
                              color: textPrimary,
                              fontSize: 13,
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Recording
                          </button>
                        ) : (
                          <>
                            {course.session2Id && (
                              <button
                                onClick={() => {
                                  if (joiningSessionId) return;
                                  setJoiningSessionId(course.session2Id);
                                  onJoinSession && onJoinSession({
                                    id: course.session2Id,
                                    courseId: course.courseId,
                                    courseName: course.courseName
                                  });
                                }}
                                disabled={joiningSessionId === course.session2Id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  padding: '6px 14px',
                                  background: joiningSessionId === course.session2Id ? '#64748b' : accentBlue,
                                  border: 'none',
                                  borderRadius: 16,
                                  color: '#fff',
                                  fontSize: 13,
                                  fontWeight: 600,
                                  cursor: joiningSessionId === course.session2Id ? 'wait' : 'pointer'
                                }}
                              >
                                {joiningSessionId === course.session2Id ? '...' : <><span>🎥</span> Join</>}
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenCertify({
                                id: `${student.studentId}-${course.courseId}`,
                                name: student.name,
                                courseName: course.courseName,
                                courseId: course.courseId,
                                studentId: student.studentId, // Pass actual userId like "demo_sarah"
                                sessionNumber: 2
                              })}
                              style={{
                                padding: '6px 14px',
                                background: accentGreen,
                                border: 'none',
                                borderRadius: 16,
                                color: '#fff',
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Certify
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider between students */}
            {studentIndex < unifiedStudents.length - 1 && (
              <div style={{ height: 1, background: borderColor, margin: '20px 0' }} />
            )}
          </div>
        ))
      )}

      {/* Divider before pending balance */}
      {unifiedStudents.length > 0 && (
        <div style={{ height: 1, background: borderColor, margin: '20px 0' }} />
      )}

      {/* Pending Balance */}
      <div style={{
        background: bgCard,
        border: `1px solid ${borderColor}`,
        borderRadius: 12,
        padding: 16,
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 13, color: textSecondary, marginBottom: 4 }}>
          Pending Balance
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>
          ${pendingBalance}.00
        </div>
        <div style={{ fontSize: 12, color: textSecondary }}>
          (Released after student certification)
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

              {/* Session Info - show which session is being certified */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 16px',
                background: isDarkMode ? 'rgba(0, 186, 124, 0.15)' : 'rgba(0, 186, 124, 0.1)',
                borderRadius: 10,
                marginBottom: 20,
                border: `2px solid ${accentGreen}`
              }}>
                <span style={{ color: accentGreen, fontSize: 20 }}>✓</span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: textPrimary
                  }}>
                    {selectedSessionNumber === 1 ? 'Session 1: Foundations & Frameworks' : 'Session 2: Advanced Techniques'}
                  </div>
                  <div style={{
                    fontSize: 13,
                    color: textSecondary,
                    marginTop: 2
                  }}>
                    90 min
                  </div>
                </div>
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
