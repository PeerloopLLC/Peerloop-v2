import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import { getInstructorById } from '../data/database';

const apiKey = process.env.REACT_APP_GETSTREAM_API_KEY;

/**
 * CourseMessages - GetStream messaging for course communication
 * Automatically links: student (current user), course creator, and scheduled student-teacher
 */
const CourseMessages = ({ course, currentUser, isDarkMode, scheduledSessions = [] }) => {
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const courseId = course?.id;
  const courseName = course?.title;

  useEffect(() => {
    if (!currentUser?.id || !apiKey || !courseId) {
      setError('Missing user, API key, or course');
      setIsLoading(false);
      return;
    }

    let client = null;

    const initChat = async () => {
      try {
        // Create GetStream client
        client = StreamChat.getInstance(apiKey);

        // Build members array: student + creator + scheduled student-teacher
        const members = [currentUser.id];
        const usersToUpsert = [
          {
            id: currentUser.id,
            name: currentUser.name || currentUser.email,
            image: currentUser.avatar,
          }
        ];

        // Add course creator if they have a userId
        let instructor = null;
        if (course?.instructorId) {
          instructor = getInstructorById(course.instructorId);
          if (instructor?.userId && instructor.userId !== currentUser.id) {
            members.push(instructor.userId);
            usersToUpsert.push({
              id: instructor.userId,
              name: instructor.name,
              image: instructor.avatar,
            });
          }
        }

        // Add scheduled student-teacher for this course (if any)
        const scheduledSession = scheduledSessions.find(
          s => s.courseId === courseId && s.status === 'scheduled'
        );
        if (scheduledSession?.studentTeacherId &&
            !members.includes(scheduledSession.studentTeacherId)) {
          members.push(scheduledSession.studentTeacherId);
          usersToUpsert.push({
            id: scheduledSession.studentTeacherId,
            name: scheduledSession.studentTeacherName || scheduledSession.studentTeacherId,
          });
        }

        // Also check for teacherId/teacherName (alternate field names)
        if (scheduledSession?.teacherId &&
            !members.includes(scheduledSession.teacherId)) {
          members.push(scheduledSession.teacherId);
          usersToUpsert.push({
            id: scheduledSession.teacherId,
            name: scheduledSession.teacherName || scheduledSession.teacherId,
          });
        }

        console.log('Setting up channel with members:', members);

        // Get token AND set up channel server-side via Edge Function
        const tokenResponse = await fetch(
          `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/getstream-token`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              userId: currentUser.id,
              users: usersToUpsert,
              channelId: `course-${courseId}`,
              channelName: `${courseName} Discussion`,
              members: members,
            }),
          }
        );

        if (!tokenResponse.ok) {
          throw new Error('Failed to get chat token');
        }

        const { token } = await tokenResponse.json();

        // Connect user to GetStream
        await client.connectUser(
          {
            id: currentUser.id,
            name: currentUser.name || currentUser.email,
            image: currentUser.avatar,
          },
          token
        );

        setChatClient(client);

        // Now just watch the channel (it was created server-side)
        const courseChannel = client.channel('messaging', `course-${courseId}`);
        await courseChannel.watch();

        setChannel(courseChannel);
        setIsLoading(false);
      } catch (err) {
        console.error('Chat init error:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    initChat();

    // Cleanup on unmount
    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, [currentUser?.id, courseId, courseName, course?.instructorId, scheduledSessions]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
        color: isDarkMode ? '#71767b' : '#536471',
      }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>💬</div>
        <p>Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
        color: isDarkMode ? '#71767b' : '#536471',
      }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>⚠️</div>
        <p>Unable to load messages</p>
        <p style={{ fontSize: 12, marginTop: 8 }}>{error}</p>
      </div>
    );
  }

  if (!chatClient || !channel) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
        color: isDarkMode ? '#71767b' : '#536471',
      }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>💬</div>
        <p>Setting up chat...</p>
      </div>
    );
  }

  return (
    <div
      className={isDarkMode ? 'str-chat__theme-dark' : 'str-chat__theme-light'}
      style={{
        height: 500,
        borderRadius: 12,
        overflow: 'hidden',
        border: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
      }}
    >
      <Chat client={chatClient} theme={isDarkMode ? 'str-chat__theme-dark' : 'str-chat__theme-light'}>
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput focus />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default CourseMessages;
