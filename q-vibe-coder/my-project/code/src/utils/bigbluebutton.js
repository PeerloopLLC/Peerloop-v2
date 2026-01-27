/**
 * BigBlueButton API Utility
 *
 * Handles creating meetings and generating join URLs for BBB integration.
 * Uses BiggerBlueButton hosting (free plan).
 */

// Blindside Networks BBB credentials
const BBB_URL = 'https://peerloop.api.rna1.blindsidenetworks.com/bigbluebutton/api/';
const BBB_SECRET = 's0M7I97lXEMLFl2uYJk8WgEJsY8qaaeXoyf1amKMetfEWa4Kl9I8v0YIBOTKycw1OGSz0jA3Lpd3hk21HM6ywA';

/**
 * Generate SHA-1 checksum for BBB API calls
 * BBB requires all API calls to be signed with a checksum
 */
async function generateChecksum(callName, queryString) {
  const data = callName + queryString + BBB_SECRET;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-1', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Build URL-encoded query string
 * BBB uses the exact URL bytes for checksum calculation, so we use
 * the same encoded string for both checksum and URL
 */
function buildQueryString(params) {
  return Object.entries(params)
    .map(([key, value]) => {
      // encodeURIComponent doesn't encode !, but BBB requires it as %21
      const encodedValue = encodeURIComponent(value).replace(/!/g, '%21');
      return `${encodeURIComponent(key)}=${encodedValue}`;
    })
    .join('&');
}

/**
 * Create a new BBB meeting
 * @param {string} meetingID - Unique meeting identifier
 * @param {string} meetingName - Display name for the meeting
 * @returns {Promise<string>} - The API URL to create the meeting
 */
export async function getCreateMeetingUrl(meetingID, meetingName) {
  const params = {
    meetingID,
    name: meetingName,
    attendeePW: 'attendee',
    moderatorPW: 'moderator',
    welcome: `Welcome to ${meetingName}!`,
    record: 'false'
  };

  // Build query string (used for both checksum and URL)
  const queryString = buildQueryString(params);
  const checksum = await generateChecksum('create', queryString);

  return `${BBB_URL}create?${queryString}&checksum=${checksum}`;
}

/**
 * Get URL to join an existing meeting
 * @param {string} meetingID - The meeting to join
 * @param {string} userName - Display name for the user
 * @param {boolean} isModerator - Whether user should be a moderator
 * @returns {Promise<string>} - The join URL
 */
export async function getJoinUrl(meetingID, userName, isModerator = false) {
  const params = {
    meetingID,
    fullName: userName,
    password: isModerator ? 'moderator' : 'attendee',
    redirect: 'true'
  };

  // Build query string (used for both checksum and URL)
  const queryString = buildQueryString(params);
  const checksum = await generateChecksum('join', queryString);

  return `${BBB_URL}join?${queryString}&checksum=${checksum}`;
}

/**
 * Create meeting and get join URL in one step
 * @param {string} roomName - Name for the video room
 * @param {string} userName - User's display name
 * @param {boolean} isModerator - Whether user is moderator
 * @returns {Promise<{createUrl: string, joinUrl: string}>}
 */
export async function createAndJoinMeeting(roomName, userName, isModerator = true) {
  // Generate a unique meeting ID based on room name
  const meetingID = `peerloop-${roomName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

  const createUrl = await getCreateMeetingUrl(meetingID, roomName);
  const joinUrl = await getJoinUrl(meetingID, userName, isModerator);

  return { createUrl, joinUrl, meetingID };
}

/**
 * Join a course session with persistent room ID
 * Uses course ID for persistent room that resets each session
 * Returns URLs for embedding in iframe
 * @param {string} courseId - Course identifier for persistent room
 * @param {string} courseName - Display name for the meeting
 * @param {string} userName - User's display name
 * @returns {Promise<{meetingID: string, createUrl: string, joinUrl: string}>}
 */
export async function joinCourseSession(courseId, courseName, userName) {
  // Persistent meeting ID based on course (not timestamp)
  const meetingID = `peerloop-course-${courseId}`;
  const meetingName = `${courseName} - Live Session`;

  const createUrl = await getCreateMeetingUrl(meetingID, meetingName);
  const joinUrl = await getJoinUrl(meetingID, userName, true); // Everyone is moderator

  return { meetingID, createUrl, joinUrl };
}
