import { connect } from 'getstream';

// GetStream Configuration
const GETSTREAM_API_KEY = process.env.REACT_APP_GETSTREAM_API_KEY || 'axpepvxpb6v2';
const SUPABASE_FUNCTION_URL = 'https://vnleonyfgwkfpvprpbqa.supabase.co/functions/v1/getstream-token';

// Initialize GetStream client
let client = null;
let currentUserId = null;

/**
 * Get GetStream token from Supabase Edge Function
 */
export const getStreamToken = async (userId) => {
  try {
    const response = await fetch(SUPABASE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId })
    });
    
    if (!response.ok) {
      throw new Error('Failed to get token');
    }
    
    const data = await response.json();
    console.log('✅ Got GetStream token for user:', userId);
    return data;
  } catch (error) {
    console.error('❌ Error getting GetStream token:', error);
    return null;
  }
};

/**
 * Initialize GetStream client with real token
 */
export const initGetStream = async (userId) => {
  try {
    // Get token from our Supabase Edge Function
    const tokenData = await getStreamToken(userId);
    
    if (!tokenData || !tokenData.token) {
      console.warn('⚠️ No token received, using demo mode');
      return null;
    }
    
    // Connect to GetStream with the token
    client = connect(tokenData.apiKey, tokenData.token, {
      appId: '1381073'
    });
    
    currentUserId = userId;
    console.log('✅ GetStream client connected for user:', userId);
    return client;
  } catch (error) {
    console.error('❌ GetStream initialization error:', error);
    return null;
  }
};

/**
 * Get a user's feed
 * @param {string} feedType - Type of feed ('user', 'timeline', 'notification')
 * @param {string} userId - The user's ID
 */
export const getFeed = (feedType, userId) => {
  if (!client) {
    console.error('GetStream client not initialized');
    return null;
  }
  return client.feed(feedType, userId);
};

/**
 * Post an activity to GetStream
 */
export const postActivity = async (userId, activity) => {
  if (!client) {
    console.error('GetStream client not initialized');
    return null;
  }
  
  try {
    const userFeed = client.feed('user', userId);
    const response = await userFeed.addActivity(activity);
    console.log('✅ Activity posted:', response);
    return response;
  } catch (error) {
    console.error('❌ Error posting activity:', error);
    return null;
  }
};

/**
 * Get activities from a feed
 */
export const getActivities = async (feedType, userId, limit = 20) => {
  if (!client) {
    console.warn('⚠️ GetStream client not initialized, using mock data');
    return { results: mockActivities };
  }
  
  try {
    const feed = client.feed(feedType, userId);
    const response = await feed.get({ limit });
    console.log('✅ Got activities:', response);
    return response;
  } catch (error) {
    console.error('❌ Error getting activities:', error);
    return { results: mockActivities };
  }
};

/**
 * Check if GetStream is connected
 */
export const isConnected = () => {
  return client !== null;
};

/**
 * Get current user ID
 */
export const getCurrentUserId = () => {
  return currentUserId;
};

/**
 * GetStream Activity Types for PeerLoop
 * These define what kinds of activities we'll track
 */
export const ActivityTypes = {
  // Course activities
  COURSE_CREATED: 'course_created',
  COURSE_PUBLISHED: 'course_published',
  COURSE_ENROLLED: 'course_enrolled',
  COURSE_COMPLETED: 'course_completed',
  LESSON_COMPLETED: 'lesson_completed',
  
  // Social activities
  POST_CREATED: 'post_created',
  COMMENT_ADDED: 'comment_added',
  LIKE_ADDED: 'like_added',
  FOLLOW_USER: 'follow_user',
  
  // Achievement activities
  BADGE_EARNED: 'badge_earned',
  CERTIFICATION_EARNED: 'certification_earned',
  MILESTONE_REACHED: 'milestone_reached',
  
  // Teaching activities
  SESSION_SCHEDULED: 'session_scheduled',
  SESSION_COMPLETED: 'session_completed',
  STUDENT_HELPED: 'student_helped',
  REVIEW_RECEIVED: 'review_received'
};

/**
 * Create an activity object
 * @param {string} actorId - User who performed the action
 * @param {string} verb - Type of activity (from ActivityTypes)
 * @param {string} objectId - What the action was performed on
 * @param {object} extraData - Additional data for the activity
 */
export const createActivity = (actorId, verb, objectId, extraData = {}) => {
  return {
    actor: `user:${actorId}`,
    verb: verb,
    object: objectId,
    time: new Date().toISOString(),
    ...extraData
  };
};

/**
 * Mock activities for demo mode
 * These simulate what real GetStream activities would look like
 */
export const mockActivities = [
  {
    id: 'act_1',
    actor: { id: 'demo_jamie', name: 'Jamie Chen', avatar: null },
    verb: ActivityTypes.COURSE_PUBLISHED,
    object: { id: 'course_1', name: 'Advanced React Patterns' },
    time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    message: 'published a new course'
  },
  {
    id: 'act_2',
    actor: { id: 'demo_sarah', name: 'Sarah Miller', avatar: null },
    verb: ActivityTypes.COURSE_COMPLETED,
    object: { id: 'course_2', name: 'JavaScript Fundamentals' },
    time: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    message: 'completed the course'
  },
  {
    id: 'act_3',
    actor: { id: 'demo_alex', name: 'Alex Sanders', avatar: 'https://i.pravatar.cc/150?img=3' },
    verb: ActivityTypes.BADGE_EARNED,
    object: { id: 'badge_1', name: 'Quick Learner', icon: '🎓' },
    time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    message: 'earned the badge'
  },
  {
    id: 'act_4',
    actor: { id: 'demo_marcus', name: 'Marcus Johnson', avatar: 'https://i.pravatar.cc/150?img=53' },
    verb: ActivityTypes.SESSION_COMPLETED,
    object: { id: 'session_1', name: '1-on-1 Mentoring' },
    time: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    message: 'completed a mentoring session'
  },
  {
    id: 'act_5',
    actor: { id: 'demo_jamie', name: 'Jamie Chen', avatar: 'https://i.pravatar.cc/150?img=47' },
    verb: ActivityTypes.MILESTONE_REACHED,
    object: { id: 'milestone_1', name: '200 Students Helped' },
    time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    message: 'reached a milestone'
  },
  {
    id: 'act_6',
    actor: { id: 'demo_sarah', name: 'Sarah Miller', avatar: 'https://i.pravatar.cc/150?img=44' },
    verb: ActivityTypes.FOLLOW_USER,
    object: { id: 'demo_jamie', name: 'Jamie Chen' },
    time: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    message: 'started following'
  },
  {
    id: 'act_7',
    actor: { id: 'demo_alex', name: 'Alex Sanders', avatar: 'https://i.pravatar.cc/150?img=3' },
    verb: ActivityTypes.COURSE_ENROLLED,
    object: { id: 'course_3', name: 'Deep Learning Fundamentals' },
    time: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    message: 'enrolled in'
  },
  {
    id: 'act_8',
    actor: { id: 'demo_marcus', name: 'Marcus Johnson', avatar: 'https://i.pravatar.cc/150?img=53' },
    verb: ActivityTypes.REVIEW_RECEIVED,
    object: { id: 'review_1', name: '5-star review', rating: 5 },
    time: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), // 10 hours ago
    message: 'received a'
  }
];

/**
 * Get mock activities for demo mode
 * Filters activities based on the current user
 * @param {string} userId - Current user's ID
 * @param {string} feedType - 'all', 'personal', 'following'
 */
export const getMockActivities = (userId, feedType = 'all') => {
  switch (feedType) {
    case 'personal':
      // Only show this user's activities
      return mockActivities.filter(a => a.actor.id === userId);
    case 'following':
      // Show activities from people the user follows (for demo, show others)
      return mockActivities.filter(a => a.actor.id !== userId);
    case 'all':
    default:
      return mockActivities;
  }
};

/**
 * Format activity for display
 * @param {object} activity - The activity object
 */
export const formatActivity = (activity) => {
  const verbMessages = {
    [ActivityTypes.COURSE_CREATED]: 'created a new course',
    [ActivityTypes.COURSE_PUBLISHED]: 'published',
    [ActivityTypes.COURSE_ENROLLED]: 'enrolled in',
    [ActivityTypes.COURSE_COMPLETED]: 'completed',
    [ActivityTypes.LESSON_COMPLETED]: 'completed a lesson in',
    [ActivityTypes.POST_CREATED]: 'posted',
    [ActivityTypes.COMMENT_ADDED]: 'commented on',
    [ActivityTypes.LIKE_ADDED]: 'liked',
    [ActivityTypes.FOLLOW_USER]: 'started following',
    [ActivityTypes.BADGE_EARNED]: 'earned',
    [ActivityTypes.CERTIFICATION_EARNED]: 'earned certification in',
    [ActivityTypes.MILESTONE_REACHED]: 'reached',
    [ActivityTypes.SESSION_SCHEDULED]: 'scheduled a session',
    [ActivityTypes.SESSION_COMPLETED]: 'completed',
    [ActivityTypes.STUDENT_HELPED]: 'helped a student with',
    [ActivityTypes.REVIEW_RECEIVED]: 'received'
  };

  return {
    ...activity,
    displayMessage: activity.message || verbMessages[activity.verb] || activity.verb
  };
};

/**
 * Time ago formatter
 * @param {string} timestamp - ISO timestamp
 */
export const timeAgo = (timestamp) => {
  const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(timestamp).toLocaleDateString();
};

export default {
  initGetStream,
  getFeed,
  ActivityTypes,
  createActivity,
  getMockActivities,
  formatActivity,
  timeAgo
};
