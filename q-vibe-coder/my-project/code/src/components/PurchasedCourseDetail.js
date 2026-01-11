import React from 'react';
import PropTypes from 'prop-types';
import { FaArrowLeft, FaCalendar, FaUser, FaPlay, FaDownload, FaComments, FaCheck, FaLock, FaExclamationTriangle } from 'react-icons/fa';
import { AiOutlineStar } from 'react-icons/ai';
import { getInstructorById } from '../data/database';
import './PurchasedCourseDetail.css';

/**
 * PurchasedCourseDetail - Displays detailed view of a purchased course
 * Shows creator profile, upcoming sessions, homework, progress, and resources
 */
const PurchasedCourseDetail = ({
  course,
  onBack,
  isDarkMode,
  currentUser,
  isCreatorFollowed,
  onFollowCreator,
  onViewCreatorProfile,
  onGoToCommunity
}) => {
  if (!course) return null;

  const instructor = getInstructorById(course.instructorId);
  const isFollowing = instructor && isCreatorFollowed ? isCreatorFollowed(instructor.id) : false;

  // Mock data for purchased course - in real app would come from user's progress data
  const courseProgress = {
    sessionsCompleted: 3,
    totalSessions: 8,
    homeworkSubmitted: 2,
    homeworkTotal: 3,
    averageScore: 90,
    startDate: 'Dec 10, 2024',
    lastAccessed: '2 days ago'
  };

  // Mock session data
  const sessions = [
    { id: 1, title: 'Session 1: Introduction', date: 'Dec 10', status: 'completed', hwStatus: 'submitted', hwScore: 92 },
    { id: 2, title: 'Session 2: Core Concepts', date: 'Dec 14', status: 'completed', hwStatus: 'submitted', hwScore: 88 },
    { id: 3, title: 'Session 3: Deep Dive', date: 'Dec 18', status: 'completed', hwStatus: 'due', hwDue: 'Dec 23' },
    { id: 4, title: 'Session 4: Advanced Topics', date: 'Dec 24', time: '2:00 PM EST', status: 'upcoming', hwStatus: 'locked' },
    { id: 5, title: 'Session 5: Practice', date: 'TBD', status: 'locked', hwStatus: 'locked' },
    { id: 6, title: 'Session 6: Application', date: 'TBD', status: 'locked', hwStatus: 'locked' },
    { id: 7, title: 'Session 7: Review', date: 'TBD', status: 'locked', hwStatus: 'locked' },
    { id: 8, title: 'Session 8: Final Project', date: 'TBD', status: 'locked', hwStatus: 'locked' },
  ];

  // Get upcoming session
  const upcomingSession = sessions.find(s => s.status === 'upcoming');

  // Get homework due
  const homeworkDue = sessions.find(s => s.hwStatus === 'due');

  // Calculate progress percentage
  const progressPercent = Math.round((courseProgress.sessionsCompleted / courseProgress.totalSessions) * 100);

  return (
    <div className={`purchased-course-detail ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="pcd-container">
        {/* Creator Profile Card */}
        {instructor && (
          <div className="pcd-creator-card">
            <div className="pcd-creator-header">
              <div className="pcd-creator-avatar">
                {instructor.avatar ? (
                  <img src={instructor.avatar} alt={instructor.name} />
                ) : (
                  <span>👨‍🏫</span>
                )}
              </div>
              <div className="pcd-creator-info">
                <h2 className="pcd-creator-name">{instructor.name}</h2>
                <p className="pcd-creator-title">{instructor.title}</p>
                <div className="pcd-creator-stats">
                  <span className="pcd-stat">
                    <strong>{instructor.stats?.averageRating || 4.8}</strong> rating
                  </span>
                  <span className="pcd-stat">
                    <strong>{instructor.stats?.studentsTaught?.toLocaleString() || 0}</strong> students
                  </span>
                  <span className="pcd-stat">
                    <strong>{instructor.stats?.coursesCreated || 1}</strong> courses
                  </span>
                </div>
              </div>
            </div>
            <p className="pcd-creator-bio">{instructor.bio}</p>
            <div className="pcd-creator-actions">
              <button
                className={`pcd-follow-btn ${isFollowing ? 'following' : ''}`}
                onClick={() => onFollowCreator && onFollowCreator(instructor.id)}
              >
                {isFollowing ? 'Joined' : 'Join'}
              </button>
              <button
                className="pcd-btn-secondary"
                onClick={() => onViewCreatorProfile && onViewCreatorProfile(instructor)}
              >
                View All Courses
              </button>
              <button
                className="pcd-btn-secondary"
                onClick={() => onGoToCommunity && onGoToCommunity(instructor)}
              >
                Go to Community
              </button>
            </div>
          </div>
        )}

        {/* Course Header */}
        <div className="pcd-course-header">
          <p className="pcd-course-label">📚 Enrolled Course</p>
          <h1 className="pcd-course-title">{course.title}</h1>
          <span className="pcd-enrolled-badge">
            <FaCheck /> ENROLLED · Started {courseProgress.startDate}
          </span>
        </div>

        {/* Upcoming Session */}
        {upcomingSession && (
          <div className="pcd-card pcd-upcoming-session">
            <div className="pcd-card-title">
              <FaCalendar /> Upcoming Session
            </div>
            <h3 className="pcd-session-name">{upcomingSession.title}</h3>
            <div className="pcd-session-details">
              <div className="pcd-session-detail">
                <FaCalendar />
                {upcomingSession.date} · {upcomingSession.time}
              </div>
              <div className="pcd-session-detail">
                <FaUser />
                With: {instructor?.name} (Community Lead)
              </div>
            </div>
            <div className="pcd-session-actions">
              <button className="pcd-btn-primary">
                <FaPlay /> Join Session
              </button>
              <button className="pcd-btn-secondary">
                <FaCalendar /> Add to Calendar
              </button>
              <button className="pcd-btn-secondary">Reschedule</button>
            </div>
          </div>
        )}

        {/* Homework Due */}
        {homeworkDue && (
          <div className="pcd-card pcd-homework-card">
            <div className="pcd-card-title">
              📋 Homework Due
            </div>
            <div className="pcd-homework-item">
              <div className="pcd-homework-info">
                <h3>
                  <FaExclamationTriangle className="pcd-warning" />
                  Assignment from {homeworkDue.title}
                </h3>
                <p>Due: {homeworkDue.hwDue} (2 days remaining)</p>
              </div>
              <div className="pcd-homework-actions">
                <button className="pcd-btn-secondary">View Assignment</button>
                <button className="pcd-btn-primary">Submit</button>
              </div>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="pcd-card">
          <div className="pcd-card-title">
            📈 Your Progress
          </div>
          <div className="pcd-progress-stats">
            <div className="pcd-stat-box">
              <div className="pcd-stat-number">{courseProgress.sessionsCompleted}/{courseProgress.totalSessions}</div>
              <div className="pcd-stat-label">Sessions Completed</div>
            </div>
            <div className="pcd-stat-box">
              <div className="pcd-stat-number">{courseProgress.homeworkSubmitted}/{courseProgress.homeworkTotal}</div>
              <div className="pcd-stat-label">Homework Submitted</div>
            </div>
            <div className="pcd-stat-box">
              <div className="pcd-stat-number">{courseProgress.averageScore}%</div>
              <div className="pcd-stat-label">Average Score</div>
            </div>
          </div>

          {/* Session Timeline */}
          <div className="pcd-timeline">
            {sessions.map((session) => (
              <div key={session.id} className="pcd-timeline-item">
                <div className={`pcd-timeline-status pcd-status-${session.status}`}>
                  {session.status === 'completed' && <FaCheck />}
                  {session.status === 'upcoming' && <FaCalendar />}
                  {session.status === 'locked' && '○'}
                </div>
                <div className="pcd-timeline-content">
                  <h4>{session.title}</h4>
                  <p>
                    {session.status === 'completed' && `${session.date} · Completed`}
                    {session.status === 'upcoming' && `${session.date} · ${session.time}`}
                    {session.status === 'locked' && 'Not scheduled'}
                  </p>
                </div>
                <div className="pcd-timeline-hw">
                  {session.hwStatus === 'submitted' && (
                    <span className="pcd-hw-badge pcd-hw-submitted">HW: {session.hwScore}%</span>
                  )}
                  {session.hwStatus === 'due' && (
                    <span className="pcd-hw-badge pcd-hw-due">HW: Due {session.hwDue}</span>
                  )}
                  {session.hwStatus === 'locked' && session.status !== 'locked' && (
                    <span className="pcd-hw-badge pcd-hw-locked"><FaLock /> After session</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="pcd-card">
          <div className="pcd-card-title">
            📥 Resources
          </div>
          {sessions.filter(s => s.status === 'completed').map((session) => (
            <div key={session.id} className="pcd-resource-session">
              <h4>{session.title}</h4>
              <div className="pcd-resource-links">
                <a href="#" className="pcd-resource-link">🎬 Recording</a>
                <a href="#" className="pcd-resource-link">📄 Slides</a>
                <a href="#" className="pcd-resource-link">💻 Code Files</a>
              </div>
            </div>
          ))}
          <div className="pcd-download-all">
            <button className="pcd-btn-secondary">
              <FaDownload /> Download All Materials
            </button>
          </div>
        </div>

        {/* Get Help */}
        <div className="pcd-card pcd-help-card">
          <div className="pcd-help-content">
            <div className="pcd-help-text">
              <div className="pcd-card-title" style={{ marginBottom: 8 }}>
                👥 Need Extra Help?
              </div>
              <p>Book a 1-on-1 tutoring session with a Student-Teacher who completed this course</p>
            </div>
            <button className="pcd-btn-primary">Browse Student-Teachers →</button>
          </div>
        </div>

        {/* Discussion */}
        <div className="pcd-card">
          <div className="pcd-card-title">
            <FaComments /> Class Discussion
          </div>
          <div className="pcd-discussion-preview">
            <span className="pcd-new-posts">5 new posts since Session 3</span>
            <button className="pcd-btn-secondary">View Discussion →</button>
          </div>
        </div>

        {/* Certificate */}
        <div className="pcd-card pcd-certificate-card">
          <div className="pcd-certificate-icon">🎓</div>
          <div className="pcd-card-title" style={{ justifyContent: 'center' }}>Certificate of Completion</div>
          <p className="pcd-certificate-text">
            Complete {courseProgress.totalSessions - courseProgress.sessionsCompleted} more sessions to earn your certificate
          </p>
          <div className="pcd-progress-bar">
            <div className="pcd-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="pcd-progress-text">
            {courseProgress.sessionsCompleted} of {courseProgress.totalSessions} sessions completed
          </p>
        </div>
      </div>
    </div>
  );
};

PurchasedCourseDetail.propTypes = {
  course: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool,
  currentUser: PropTypes.object,
  isCreatorFollowed: PropTypes.func,
  onFollowCreator: PropTypes.func,
  onViewCreatorProfile: PropTypes.func,
  onGoToCommunity: PropTypes.func
};

PurchasedCourseDetail.defaultProps = {
  isDarkMode: false
};

export default PurchasedCourseDetail;
