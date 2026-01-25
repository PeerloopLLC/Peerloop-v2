import React from 'react';
import { FaCheck, FaLock, FaCalendar } from 'react-icons/fa';

/**
 * SessionTimelineCards - Displays course sessions as a vertical timeline
 *
 * States for each session row:
 * - completed: Green checkmark, "Completed [date]" text
 * - scheduled: Blue number, date/time/teacher info, Join + Reschedule buttons
 * - ready: Blue number, "Schedule Session" button
 * - locked: Grey lock icon, "Complete Session X first" text (greyed out)
 */
const SessionTimelineCards = ({
  course,
  scheduledSessions = [],
  sessionCompletion = {},
  onScheduleSession,
  onJoinSession,
  onRescheduleSession,
  isDarkMode
}) => {
  // Get session list from course - default to 2 sessions if not defined
  const sessionList = course?.sessions?.list || [
    { number: 1, title: 'Session 1', duration: '90 min', modules: [] },
    { number: 2, title: 'Session 2', duration: '90 min', modules: [] }
  ];

  // Calculate completed count
  const courseCompletion = sessionCompletion[course?.id] || {};
  const completedCount = sessionList.filter(s => courseCompletion[s.number]?.completed).length;
  const totalSessions = sessionList.length;

  // Helper to get scheduled session for a specific session number
  const getScheduledSession = (sessionNumber) => {
    return scheduledSessions.find(s =>
      s.courseId === course?.id &&
      s.sessionNumber === sessionNumber &&
      s.status === 'scheduled'
    );
  };

  // Helper to check if a session is completed
  const isSessionComplete = (sessionNumber) => {
    return courseCompletion[sessionNumber]?.completed || false;
  };

  // Helper to format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  };

  // Helper to format completion date
  const formatCompletionDate = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  // Determine row state for each session
  const getRowState = (sessionNumber) => {
    // Check if completed
    if (isSessionComplete(sessionNumber)) {
      return 'completed';
    }

    // Check if scheduled
    const scheduled = getScheduledSession(sessionNumber);
    if (scheduled) {
      return 'scheduled';
    }

    // Check if locked (previous session not completed)
    if (sessionNumber > 1) {
      const previousComplete = isSessionComplete(sessionNumber - 1);
      if (!previousComplete) {
        return 'locked';
      }
    }

    // Ready to schedule
    return 'ready';
  };

  return (
    <div style={{
      background: isDarkMode ? '#16181c' : '#fff',
      borderRadius: 12,
      border: isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb',
      marginBottom: 16,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb',
        background: isDarkMode ? '#1a1a1a' : '#f7f9f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8
      }}>
        <span style={{
          fontSize: 13,
          fontWeight: 700,
          color: isDarkMode ? '#e7e9ea' : '#0f1419',
          textTransform: 'uppercase',
          letterSpacing: 0.5
        }}>
          YOUR SESSIONS
        </span>
        <span style={{
          fontSize: 13,
          color: completedCount === totalSessions ? '#10b981' : (isDarkMode ? '#71767b' : '#536471'),
          fontWeight: 600
        }}>
          ({completedCount} of {totalSessions} complete)
          {completedCount === totalSessions && ' ✓'}
        </span>
      </div>

      {/* Session Rows */}
      {sessionList.map((session, idx) => {
        const rowState = getRowState(session.number);
        const scheduledSession = getScheduledSession(session.number);
        const completionData = courseCompletion[session.number];

        return (
          <div key={session.number}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              background: rowState === 'completed'
                ? (isDarkMode ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.05)')
                : rowState === 'scheduled'
                ? (isDarkMode ? 'rgba(29, 155, 240, 0.08)' : 'rgba(29, 155, 240, 0.05)')
                : rowState === 'locked'
                ? (isDarkMode ? 'rgba(113, 118, 123, 0.05)' : 'rgba(156, 163, 175, 0.05)')
                : 'transparent'
            }}>
              {/* Session Number Circle */}
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                background: rowState === 'completed' ? '#10b981' :
                            rowState === 'scheduled' ? '#1d9bf0' :
                            rowState === 'ready' ? '#1d9bf0' :
                            (isDarkMode ? '#2f3336' : '#e5e7eb'),
                color: rowState === 'locked' ? (isDarkMode ? '#71767b' : '#9ca3af') : '#fff',
                fontSize: 13,
                fontWeight: 700
              }}>
                {rowState === 'completed' ? <FaCheck style={{ fontSize: 12 }} /> :
                 rowState === 'locked' ? <FaLock style={{ fontSize: 12 }} /> :
                 session.number}
              </div>

              {/* Session Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: rowState === 'locked'
                    ? (isDarkMode ? '#71767b' : '#9ca3af')
                    : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                  marginBottom: 2
                }}>
                  Session {session.number}: {session.title}
                </div>
                <div style={{
                  fontSize: 13,
                  color: rowState === 'locked'
                    ? (isDarkMode ? '#536471' : '#9ca3af')
                    : (isDarkMode ? '#71767b' : '#536471')
                }}>
                  {rowState === 'scheduled' ? (
                    <>
                      <FaCalendar style={{ fontSize: 11, marginRight: 6, verticalAlign: 'middle' }} />
                      {formatDate(scheduledSession.date)} at {scheduledSession.time}
                      <span style={{ marginLeft: 6 }}>
                        with {scheduledSession.studentTeacherName || scheduledSession.teacherName || 'your teacher'}
                      </span>
                    </>
                  ) : rowState === 'completed' ? (
                    <>
                      {session.duration} • {session.modules?.length || 0} modules
                    </>
                  ) : rowState === 'locked' ? (
                    <>
                      {session.duration} • {session.modules?.length || 0} modules
                    </>
                  ) : (
                    <>
                      {session.duration} • {session.modules?.length || 0} modules
                    </>
                  )}
                </div>
              </div>

              {/* Right Side - Actions/Status */}
              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                {rowState === 'completed' && (
                  <span style={{
                    color: '#10b981',
                    fontSize: 13,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}>
                    <FaCheck style={{ fontSize: 11 }} />
                    Completed {completionData?.completedAt ? formatCompletionDate(completionData.completedAt) : ''}
                  </span>
                )}

                {rowState === 'scheduled' && (
                  <>
                    <button
                      onClick={() => onJoinSession && onJoinSession(scheduledSession)}
                      style={{
                        background: '#1d9bf0',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: 16,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Join
                    </button>
                    <button
                      onClick={() => onRescheduleSession && onRescheduleSession(scheduledSession)}
                      style={{
                        background: 'transparent',
                        color: isDarkMode ? '#71767b' : '#536471',
                        border: isDarkMode ? '1px solid #2f3336' : '1px solid #cfd9de',
                        padding: '6px 14px',
                        borderRadius: 16,
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                    >
                      Reschedule
                    </button>
                  </>
                )}

                {rowState === 'ready' && (
                  <button
                    onClick={() => onScheduleSession && onScheduleSession(session.number)}
                    style={{
                      background: '#1d9bf0',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 16px',
                      borderRadius: 16,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Schedule Session
                  </button>
                )}

                {rowState === 'locked' && (
                  <span style={{
                    color: isDarkMode ? '#536471' : '#9ca3af',
                    fontSize: 12,
                    fontStyle: 'italic'
                  }}>
                    Complete Session {session.number - 1} first
                  </span>
                )}
              </div>
            </div>

            {/* Divider between sessions (dashed line) */}
            {idx < sessionList.length - 1 && (
              <div style={{
                height: 1,
                margin: '0 16px',
                background: 'repeating-linear-gradient(to right, ' +
                  (isDarkMode ? '#2f3336' : '#e5e7eb') + ' 0, ' +
                  (isDarkMode ? '#2f3336' : '#e5e7eb') + ' 6px, transparent 6px, transparent 12px)'
              }} />
            )}
          </div>
        );
      })}

      {/* All Complete Message */}
      {completedCount === totalSessions && (
        <div style={{
          padding: '16px',
          textAlign: 'center',
          background: isDarkMode ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.05)',
          borderTop: isDarkMode ? '1px solid #2f3336' : '1px solid #e5e7eb'
        }}>
          <span style={{ fontSize: 20, marginRight: 8 }}>🎉</span>
          <span style={{
            color: '#10b981',
            fontWeight: 600,
            fontSize: 14
          }}>
            All sessions complete! Certificate ready.
          </span>
        </div>
      )}
    </div>
  );
};

export default SessionTimelineCards;
