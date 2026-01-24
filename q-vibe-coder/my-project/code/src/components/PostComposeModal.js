import React, { useState, useEffect, useRef } from 'react';
import './PostComposeModal.css';
import { FaImage, FaLink, FaPaperclip, FaTimes, FaCheck, FaBook } from 'react-icons/fa';
import { MdForum } from 'react-icons/md';
import { coursesDatabase } from '../data/database';
import { createPost } from '../services/posts';

const PostComposeModal = ({ isOpen, onClose, currentUser, communities }) => {
  const [postText, setPostText] = useState('');
  const [isAudienceOpen, setIsAudienceOpen] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState({ id: 'town-hall', name: 'The Commons', type: 'community' });
  const [isPosting, setIsPosting] = useState(false);
  const audienceRef = useRef(null);
  const textareaRef = useRef(null);

  // Focus textarea when modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current.focus(), 100);
    }
    if (isOpen) {
      setPostText('');
      setIsAudienceOpen(false);
      setSelectedAudience({ id: 'town-hall', name: 'The Commons', type: 'community' });
    }
  }, [isOpen]);

  // Click-outside for audience dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (audienceRef.current && !audienceRef.current.contains(e.target)) {
        setIsAudienceOpen(false);
      }
    };
    if (isAudienceOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAudienceOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (isAudienceOpen) {
          setIsAudienceOpen(false);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isAudienceOpen, onClose]);

  if (!isOpen) return null;

  // Build community list
  const townHall = { id: 'town-hall', name: 'The Commons', type: 'hub' };
  const allCommunities = [townHall, ...(communities || [])];

  // Get user's purchased/enrolled course IDs
  const purchasedCourseIds = (() => {
    try {
      const stored = localStorage.getItem(`purchasedCourses_${currentUser?.id}`);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  })();

  // Get courses for a community - only show courses the user is enrolled in
  const getCoursesForCommunity = (community) => {
    if (community.id === 'town-hall') return [];
    if (purchasedCourseIds.length === 0) return [];

    // First, find all courses by this instructor
    let allCourses = [];
    if (community.courseIds && community.courseIds.length > 0) {
      allCourses = coursesDatabase.filter(c => community.courseIds.includes(c.id));
    } else if (community.instructorId) {
      allCourses = coursesDatabase.filter(c => c.instructorId === community.instructorId);
    } else {
      const match = community.id?.match(/^creator-(\d+)$/);
      if (match) {
        const instrId = parseInt(match[1]);
        allCourses = coursesDatabase.filter(c => c.instructorId === instrId);
      }
    }

    // Filter to only courses the user has purchased/enrolled in
    return allCourses.filter(c => purchasedCourseIds.includes(c.id));
  };

  const handlePost = async () => {
    if (!postText.trim() || isPosting) return;
    setIsPosting(true);

    // Map audience selection to the audience string the backend expects
    let audience = 'everyone';
    if (selectedAudience.type === 'main-hall') {
      // Community main hall → use the community ID
      audience = selectedAudience.communityId;
    } else if (selectedAudience.type === 'course') {
      // Course → use the parent community ID
      audience = selectedAudience.communityId || 'everyone';
    } else if (selectedAudience.id !== 'town-hall') {
      // Community selected directly
      audience = selectedAudience.id;
    }

    const result = await createPost(
      currentUser?.id || 'anonymous',
      currentUser?.name || 'Anonymous User',
      postText.trim(),
      audience
    );

    if (result.success) {
      // Dispatch event so Community.js can pick up the new post
      window.dispatchEvent(new CustomEvent('newPostCreated', { detail: result.post }));
      setIsPosting(false);
      onClose();
    } else {
      setIsPosting(false);
      console.error('Post failed:', result.error);
    }
  };

  const handleAudienceSelect = (selection) => {
    setSelectedAudience(selection);
    setIsAudienceOpen(false);
  };

  const userInitials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';

  return (
    <div className="post-compose-overlay" onClick={onClose}>
      <div className="post-compose-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header with close button */}
        <div className="post-compose-header">
          <button className="post-compose-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Compose area */}
        <div className="post-compose-body">
          {/* Avatar */}
          <div className="post-compose-avatar">
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} />
            ) : (
              <div className="post-compose-avatar-letter">{userInitials}</div>
            )}
          </div>

          {/* Content area */}
          <div className="post-compose-content">
            {/* Audience selector */}
            <div className="post-compose-audience-wrapper" ref={audienceRef}>
              <button
                className={`post-compose-audience-btn ${isAudienceOpen ? 'open' : ''}`}
                onClick={() => setIsAudienceOpen(!isAudienceOpen)}
              >
                {selectedAudience.type === 'main-hall' && <MdForum className="audience-btn-icon" />}
                {selectedAudience.type === 'course' && <FaBook className="audience-btn-icon" />}
                <span>{selectedAudience.name}</span>
                <span className="audience-arrow">&#9662;</span>
              </button>

              {/* Audience dropdown */}
              {isAudienceOpen && (
                <div className="post-compose-audience-dropdown">
                  <div className="audience-dropdown-header">Choose audience</div>
                  <div className="audience-dropdown-scroll">
                    {allCommunities.map((community) => {
                      const displayName = community.id === 'town-hall'
                        ? 'The Commons'
                        : (community.name || 'Community');
                      const courses = getCoursesForCommunity(community);

                      return (
                        <div key={community.id} className="audience-community-group">
                          {/* Community row */}
                          <div
                            className={`audience-dropdown-item ${selectedAudience.id === community.id && selectedAudience.type === 'community' ? 'selected' : ''}`}
                            onClick={() => handleAudienceSelect({ id: community.id, name: displayName, type: 'community' })}
                          >
                            {community.id === 'town-hall' ? (
                              <div className="audience-item-avatar commons">&#127963;</div>
                            ) : community.avatar ? (
                              <img src={community.avatar} alt={displayName} className="audience-item-avatar-img" />
                            ) : (
                              <div className="audience-item-avatar">
                                {displayName.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="audience-item-info">
                              <span className="audience-item-name">{displayName}</span>
                              <span className="audience-item-members">
                                {community.id === 'town-hall' ? 'All members' : `${community.members || ''} members`}
                              </span>
                            </div>
                            {selectedAudience.id === community.id && selectedAudience.type === 'community' && (
                              <FaCheck className="audience-item-check" />
                            )}
                          </div>

                          {/* Nested Main Hall + courses */}
                          {community.id !== 'town-hall' && (
                            <div className="audience-courses-list">
                              {/* Main Hall option */}
                              <div
                                className={`audience-dropdown-item audience-course-item ${selectedAudience.id === `main-hall-${community.id}` ? 'selected' : ''}`}
                                onClick={() => handleAudienceSelect({ id: `main-hall-${community.id}`, name: `${displayName} - Main Hall`, type: 'main-hall', communityId: community.id })}
                              >
                                <MdForum className="audience-course-icon audience-main-hall-icon" />
                                <span className="audience-item-name">Main Hall</span>
                                {selectedAudience.id === `main-hall-${community.id}` && (
                                  <FaCheck className="audience-item-check" />
                                )}
                              </div>
                              {/* Courses */}
                              {courses.map((course) => (
                                <div
                                  key={course.id}
                                  className={`audience-dropdown-item audience-course-item ${selectedAudience.id === `course-${course.id}` ? 'selected' : ''}`}
                                  onClick={() => handleAudienceSelect({ id: `course-${course.id}`, name: course.title, type: 'course', communityId: community.id })}
                                >
                                  <FaBook className="audience-course-icon" />
                                  <span className="audience-item-name">{course.title}</span>
                                  {selectedAudience.id === `course-${course.id}` && (
                                    <FaCheck className="audience-item-check" />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Text input */}
            <textarea
              ref={textareaRef}
              className="post-compose-textarea"
              placeholder="What's on your mind?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        {/* Footer with media buttons and Post */}
        <div className="post-compose-footer">
          <div className="post-compose-media-buttons">
            <button className="post-compose-media-btn" title="Add image">
              <FaImage />
            </button>
            <button className="post-compose-media-btn" title="Add link">
              <FaLink />
            </button>
            <button className="post-compose-media-btn" title="Attach file">
              <FaPaperclip />
            </button>
          </div>
          <button
            className={`post-compose-submit ${postText.trim() && !isPosting ? 'active' : ''}`}
            onClick={handlePost}
            disabled={!postText.trim() || isPosting}
          >
            {isPosting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostComposeModal;
