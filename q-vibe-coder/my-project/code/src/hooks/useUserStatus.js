import { useState, useEffect, useCallback } from 'react';
import { getCourseById, getInstructorById, getAllInstructors } from '../data/database';

const STORAGE_KEY = (userId) => `userStatus_${userId}`;

// The ONE data structure for all user state
const createDefaultStatus = () => ({
  courses: {},      // courseId → { enrolled, followed, sessions: [], enrolledAt }
  communities: {},  // creatorId → { followed, name, avatar, etc. }
  teaching: {       // For student-teachers
    approved: [],   // courseIds approved to teach
    pending: [],    // courseIds awaiting approval
    sessions: []    // Sessions where user is the teacher
  }
});

/**
 * useUserStatus - Unified hook for all user status management
 *
 * Consolidates:
 * - followedCommunities (localStorage key: followedCommunities_${userId})
 * - purchasedCourses (localStorage key: purchasedCourses_${userId})
 * - scheduledSessions (localStorage key: scheduledSessions_${userId})
 * - sessionCompletion (localStorage key: sessionCompletion_${userId})
 * - teachingApplications (localStorage key: teachingApplications)
 *
 * Into ONE structure stored at: userStatus_${userId}
 */
export function useUserStatus(userId) {
  const [status, setStatus] = useState(() => {
    if (!userId) return createDefaultStatus();

    // Try new format first
    const saved = localStorage.getItem(STORAGE_KEY(userId));
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Validate it has the expected structure
        if (parsed.courses && parsed.communities && parsed.teaching) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing userStatus:', e);
      }
    }

    // Migrate from legacy format
    return migrateFromLegacy(userId);
  });

  // Reload when user changes
  useEffect(() => {
    if (!userId) {
      setStatus(createDefaultStatus());
      return;
    }

    // Try new format first
    const saved = localStorage.getItem(STORAGE_KEY(userId));
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.courses && parsed.communities && parsed.teaching) {
          setStatus(parsed);
          return;
        }
      } catch (e) {
        console.error('Error parsing userStatus on user change:', e);
      }
    }

    // Migrate from legacy format
    setStatus(migrateFromLegacy(userId));
  }, [userId]);

  // Auto-save on change
  useEffect(() => {
    if (userId && status) {
      localStorage.setItem(STORAGE_KEY(userId), JSON.stringify(status));
    }
  }, [userId, status]);

  // ========== GETTERS ==========

  const isEnrolled = useCallback((courseId) => {
    return !!status.courses[courseId]?.enrolled;
  }, [status.courses]);

  const isFollowingCourse = useCallback((courseId) => {
    return !!status.courses[courseId]?.followed;
  }, [status.courses]);

  const isFollowingCommunity = useCallback((creatorId) => {
    const id = String(creatorId).replace('creator-', '');
    return !!status.communities[id]?.followed;
  }, [status.communities]);

  const isCertified = useCallback((courseId) => {
    const course = status.courses[courseId];
    if (!course?.enrolled) return false;

    // A course is certified when all sessions are completed
    const sessions = course.sessions || [];
    if (sessions.length === 0) return false;

    // Check if all sessions are completed (typically 2 sessions per course)
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    return completedSessions >= 2; // Default: 2 sessions to complete a course
  }, [status.courses]);

  const getScheduledSession = useCallback((courseId) => {
    const course = status.courses[courseId];
    if (!course?.sessions) return null;
    return course.sessions.find(s => s.status === 'scheduled');
  }, [status.courses]);

  const getAllScheduledSessions = useCallback(() => {
    return Object.entries(status.courses)
      .flatMap(([courseId, data]) =>
        (data.sessions || [])
          .filter(s => s.status === 'scheduled')
          .map(s => ({ ...s, courseId: Number(courseId) }))
      );
  }, [status.courses]);

  const getCompletedSessions = useCallback((courseId) => {
    const course = status.courses[courseId];
    if (!course?.sessions) return [];
    return course.sessions.filter(s => s.status === 'completed');
  }, [status.courses]);

  const isSessionComplete = useCallback((courseId, sessionNumber) => {
    const course = status.courses[courseId];
    if (!course?.sessions) return false;
    return course.sessions.some(s =>
      s.sessionNumber === sessionNumber && s.status === 'completed'
    );
  }, [status.courses]);

  const getTeachingStatus = useCallback((courseId) => {
    if (status.teaching.approved.includes(Number(courseId))) return 'approved';
    if (status.teaching.pending.includes(Number(courseId))) return 'pending';
    return null;
  }, [status.teaching]);

  const getPurchasedCourses = useCallback(() => {
    return Object.entries(status.courses)
      .filter(([_, data]) => data.enrolled)
      .map(([courseId, _]) => Number(courseId));
  }, [status.courses]);

  const getFollowedCommunities = useCallback(() => {
    return Object.entries(status.communities)
      .filter(([_, data]) => data.followed)
      .map(([creatorId, data]) => ({
        id: `creator-${creatorId}`,
        type: 'creator',
        instructorId: Number(creatorId),
        ...data
      }));
  }, [status.communities]);

  // ========== SETTERS ==========

  const enrollInCourse = useCallback((courseId, creatorId) => {
    const course = getCourseById(courseId);
    const instructor = getInstructorById(creatorId);

    setStatus(prev => ({
      ...prev,
      courses: {
        ...prev.courses,
        [courseId]: {
          ...prev.courses[courseId],
          enrolled: true,
          enrolledAt: new Date().toISOString(),
          followed: true,  // Auto-follow on enroll
          sessions: prev.courses[courseId]?.sessions || []
        }
      },
      communities: {
        ...prev.communities,
        [creatorId]: {
          ...prev.communities[creatorId],
          followed: true,  // Auto-follow creator
          name: instructor?.name || prev.communities[creatorId]?.name,
          avatar: instructor?.avatar || prev.communities[creatorId]?.avatar,
          instructorName: instructor?.name,
          courseIds: instructor?.courses || []
        }
      }
    }));
  }, []);

  const toggleFollowCourse = useCallback((courseId) => {
    setStatus(prev => {
      const currentlyFollowed = prev.courses[courseId]?.followed;
      return {
        ...prev,
        courses: {
          ...prev.courses,
          [courseId]: {
            ...prev.courses[courseId],
            followed: !currentlyFollowed
          }
        }
      };
    });
  }, []);

  const toggleFollowCommunity = useCallback((creatorId) => {
    const id = String(creatorId).replace('creator-', '');
    const instructor = getInstructorById(Number(id));

    setStatus(prev => {
      const currentlyFollowed = prev.communities[id]?.followed;

      if (currentlyFollowed) {
        // Unfollowing - remove from communities
        const newCommunities = { ...prev.communities };
        delete newCommunities[id];
        return { ...prev, communities: newCommunities };
      } else {
        // Following - add to communities
        return {
          ...prev,
          communities: {
            ...prev.communities,
            [id]: {
              followed: true,
              name: instructor?.name,
              avatar: instructor?.avatar,
              instructorName: instructor?.name,
              courseIds: instructor?.courses || [],
              bio: instructor?.bio
            }
          }
        };
      }
    });
  }, []);

  const scheduleSession = useCallback((courseId, sessionData) => {
    const newSession = {
      ...sessionData,
      id: sessionData.id || `session_${Date.now()}`,
      status: 'scheduled'
    };

    setStatus(prev => ({
      ...prev,
      courses: {
        ...prev.courses,
        [courseId]: {
          ...prev.courses[courseId],
          sessions: [
            ...(prev.courses[courseId]?.sessions || []),
            newSession
          ]
        }
      }
    }));

    return newSession;
  }, []);

  const rescheduleSession = useCallback((courseId, sessionId, newData) => {
    setStatus(prev => ({
      ...prev,
      courses: {
        ...prev.courses,
        [courseId]: {
          ...prev.courses[courseId],
          sessions: (prev.courses[courseId]?.sessions || []).map(s =>
            s.id === sessionId
              ? { ...s, ...newData, rescheduledFrom: { date: s.date, time: s.time, at: new Date().toISOString() } }
              : s
          )
        }
      }
    }));
  }, []);

  const cancelSession = useCallback((courseId, sessionId) => {
    setStatus(prev => ({
      ...prev,
      courses: {
        ...prev.courses,
        [courseId]: {
          ...prev.courses[courseId],
          sessions: (prev.courses[courseId]?.sessions || []).map(s =>
            s.id === sessionId ? { ...s, status: 'cancelled' } : s
          )
        }
      }
    }));
  }, []);

  const markSessionComplete = useCallback((courseId, sessionNumber) => {
    setStatus(prev => {
      const course = prev.courses[courseId];
      if (!course?.sessions) return prev;

      // Find the session to mark complete
      const sessions = course.sessions.map(s => {
        if (s.sessionNumber === sessionNumber || (!s.sessionNumber && sessionNumber === 1)) {
          return { ...s, status: 'completed', completedAt: new Date().toISOString() };
        }
        return s;
      });

      return {
        ...prev,
        courses: {
          ...prev.courses,
          [courseId]: { ...course, sessions }
        }
      };
    });
  }, []);

  const applyToTeach = useCallback((courseId) => {
    setStatus(prev => ({
      ...prev,
      teaching: {
        ...prev.teaching,
        pending: [...new Set([...prev.teaching.pending, Number(courseId)])]
      }
    }));
  }, []);

  const approveTeaching = useCallback((courseId) => {
    setStatus(prev => ({
      ...prev,
      teaching: {
        ...prev.teaching,
        pending: prev.teaching.pending.filter(id => id !== Number(courseId)),
        approved: [...new Set([...prev.teaching.approved, Number(courseId)])]
      }
    }));
  }, []);

  // ========== BUTTON STATE HELPER ==========

  const getCourseButtonState = useCallback((courseId) => {
    const course = status.courses[courseId] || {};
    const sessions = course.sessions || [];
    const scheduledSession = sessions.find(s => s.status === 'scheduled');
    const completedCount = sessions.filter(s => s.status === 'completed').length;
    const allCompleted = course.enrolled && completedCount >= 2; // 2 sessions = certified

    return {
      // Enrollment states
      enroll: !course.enrolled ? 'show' : 'hide',
      enrolled: course.enrolled && !allCompleted ? 'show' : 'hide',
      completed: allCompleted ? 'show' : 'hide',

      // Follow state (only show if enrolled)
      follow: course.enrolled ? (course.followed ? 'following' : 'follow') : 'hide',

      // Session state
      session: course.enrolled && !allCompleted
        ? (scheduledSession ? 'reschedule' : 'schedule')
        : 'hide',

      // Teaching state (only show if all sessions completed)
      teach: allCompleted ? (getTeachingStatus(courseId) || 'apply') : 'hide',

      // Scheduled session data
      scheduledSession,

      // Session counts
      completedSessions: completedCount,
      totalSessions: 2
    };
  }, [status.courses, getTeachingStatus]);

  // ========== LEGACY COMPATIBILITY ==========
  // These provide backwards compatibility during migration

  // Convert status to old followedCommunities format
  const followedCommunities = getFollowedCommunities();

  // Convert status to old purchasedCourses format
  const purchasedCourses = getPurchasedCourses();

  // Convert status to old scheduledSessions format
  const scheduledSessions = getAllScheduledSessions();

  return {
    status,

    // Getters
    isEnrolled,
    isFollowingCourse,
    isFollowingCommunity,
    isCertified,
    getScheduledSession,
    getAllScheduledSessions,
    getCompletedSessions,
    isSessionComplete,
    getTeachingStatus,
    getPurchasedCourses,
    getFollowedCommunities,

    // Setters
    enrollInCourse,
    toggleFollowCourse,
    toggleFollowCommunity,
    scheduleSession,
    rescheduleSession,
    cancelSession,
    markSessionComplete,
    applyToTeach,
    approveTeaching,

    // Button helper
    getCourseButtonState,

    // Legacy compatibility (for gradual migration)
    followedCommunities,
    purchasedCourses,
    scheduledSessions,

    // Legacy setters (wrappers around new methods)
    isCoursePurchased: isEnrolled,
    isCourseFollowed: isFollowingCourse,
    isCreatorFollowed: isFollowingCommunity,
    handleFollowCourse: toggleFollowCourse,
    handleFollowInstructor: toggleFollowCommunity,
    handleCoursePurchase: enrollInCourse
  };
}

// ========== MIGRATION FUNCTION ==========

function migrateFromLegacy(userId) {
  console.log(`Migrating legacy data for user: ${userId}`);
  const status = createDefaultStatus();

  // Special handling for demo users with no data
  if (userId === 'demo_new' || userId === 'demo_sarah' || userId === 'demo_alex') {
    // These users start fresh - check if they have any stored data first
    const hasNewData = localStorage.getItem(STORAGE_KEY(userId));
    if (hasNewData) {
      try {
        return JSON.parse(hasNewData);
      } catch (e) {
        // Fall through to migration
      }
    }
  }

  try {
    // 1. Load old purchasedCourses
    const oldPurchased = JSON.parse(localStorage.getItem(`purchasedCourses_${userId}`) || '[]');

    // 2. Load old scheduledSessions
    const oldSessions = JSON.parse(localStorage.getItem(`scheduledSessions_${userId}`) || '[]');

    // 3. Load old sessionCompletion
    const oldCompletion = JSON.parse(localStorage.getItem(`sessionCompletion_${userId}`) || '{}');

    // 4. Load old followedCommunities
    const oldFollows = JSON.parse(localStorage.getItem(`followedCommunities_${userId}`) || '[]');

    // 5. Load old teachingApplications
    const oldTeaching = JSON.parse(localStorage.getItem('teachingApplications') || '{}');

    // Migrate purchased courses
    oldPurchased.forEach(courseId => {
      status.courses[courseId] = {
        enrolled: true,
        enrolledAt: new Date().toISOString(), // We don't have original date
        followed: true, // Assume followed if purchased
        sessions: []
      };
    });

    // Migrate sessions into courses
    oldSessions.forEach(session => {
      const courseId = session.courseId;
      if (!status.courses[courseId]) {
        status.courses[courseId] = {
          enrolled: true,
          followed: true,
          sessions: []
        };
      }
      status.courses[courseId].sessions.push({
        id: session.id,
        date: session.date,
        time: session.time,
        sessionNumber: session.sessionNumber || 1,
        teacherId: session.studentTeacherId || session.teacherId,
        teacherName: session.studentTeacherName || session.teacherName,
        status: session.status || 'scheduled',
        courseName: session.courseName
      });
    });

    // Migrate completion status
    Object.entries(oldCompletion).forEach(([courseId, sessionsData]) => {
      if (!status.courses[courseId]) {
        status.courses[courseId] = {
          enrolled: true,
          followed: true,
          sessions: []
        };
      }

      Object.entries(sessionsData).forEach(([sessionNum, data]) => {
        if (data.completed) {
          // Find existing session or create one
          const existing = status.courses[courseId].sessions.find(
            s => s.sessionNumber === Number(sessionNum)
          );
          if (existing) {
            existing.status = 'completed';
            existing.completedAt = data.completedAt;
          } else {
            status.courses[courseId].sessions.push({
              id: `migrated_${courseId}_${sessionNum}`,
              sessionNumber: Number(sessionNum),
              status: 'completed',
              completedAt: data.completedAt
            });
          }
        }
      });
    });

    // Migrate community follows
    oldFollows.forEach(community => {
      const creatorId = community.instructorId || community.id?.replace('creator-', '');
      if (creatorId) {
        status.communities[creatorId] = {
          followed: true,
          name: community.name || community.instructorName,
          avatar: community.avatar,
          instructorName: community.instructorName || community.name,
          courseIds: community.courseIds || [],
          bio: community.description
        };

        // Also mark followed courses
        (community.followedCourseIds || []).forEach(courseId => {
          if (status.courses[courseId]) {
            status.courses[courseId].followed = true;
          }
        });
      }
    });

    // Migrate teaching applications
    Object.entries(oldTeaching).forEach(([courseId, state]) => {
      if (state === 'pending') {
        status.teaching.pending.push(Number(courseId));
      } else if (state === 'approved') {
        status.teaching.approved.push(Number(courseId));
      }
    });

    console.log('Migration complete:', status);

  } catch (e) {
    console.error('Error during migration:', e);
  }

  return status;
}

export default useUserStatus;
