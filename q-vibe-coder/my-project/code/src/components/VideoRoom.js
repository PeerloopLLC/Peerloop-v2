import React, { useState, useEffect } from 'react';
import { FaTimes, FaVideo } from 'react-icons/fa';
import { createAndJoinMeeting } from '../utils/bigbluebutton';
import './VideoRoom.css';

/**
 * VideoRoom Component
 *
 * Full-screen overlay that embeds a BigBlueButton meeting.
 * Makes video conferencing feel native to the app.
 */
const VideoRoom = ({ roomName, userName, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinUrl, setJoinUrl] = useState(null);

  useEffect(() => {
    const initMeeting = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Create the meeting first, then get the join URL
        const { createUrl, joinUrl: join } = await createAndJoinMeeting(
          roomName,
          userName,
          true // User is moderator
        );

        // Create the meeting by calling the API
        // We need to call create first before join will work
        const createResponse = await fetch(createUrl, { mode: 'no-cors' });

        // Small delay to ensure meeting is created
        await new Promise(resolve => setTimeout(resolve, 1000));

        setJoinUrl(join);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to create meeting:', err);
        setError('Failed to start video room. Please try again.');
        setIsLoading(false);
      }
    };

    initMeeting();
  }, [roomName, userName]);

  return (
    <div className="video-room-overlay">
      {/* Header */}
      <div className="video-room-header">
        <div className="video-room-title">
          <FaVideo className="video-room-icon" />
          <span>{roomName}</span>
        </div>
        <button className="video-room-close" onClick={onClose}>
          <FaTimes />
          <span>Exit Room</span>
        </button>
      </div>

      {/* Content */}
      <div className="video-room-content">
        {isLoading && (
          <div className="video-room-loading">
            <div className="video-room-spinner"></div>
            <p>Starting video room...</p>
          </div>
        )}

        {error && (
          <div className="video-room-error">
            <p>{error}</p>
            <button onClick={onClose}>Go Back</button>
          </div>
        )}

        {joinUrl && !isLoading && !error && (
          <iframe
            src={joinUrl}
            className="video-room-iframe"
            title="BigBlueButton Meeting"
            allow="camera; microphone; display-capture; fullscreen"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
};

export default VideoRoom;
