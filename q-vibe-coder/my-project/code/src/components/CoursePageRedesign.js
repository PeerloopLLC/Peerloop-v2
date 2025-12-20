import React, { useState } from 'react';
import { FaStar, FaVideo, FaGraduationCap, FaMoneyBillWave, FaHeart, FaComment, FaShare, FaChevronDown, FaChevronUp, FaCalendarAlt, FaClock, FaCheckCircle, FaPlay } from 'react-icons/fa';
import './CoursePageRedesign.css';

/**
 * CoursePageRedesign - Mockup for new course discovery flow
 * Puts 1:1 instruction at the center, instructors as primary action
 */
const CoursePageRedesign = ({ isDarkMode = true, onBack }) => {
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [showAllInstructors, setShowAllInstructors] = useState(false);
  const [expandedSection, setExpandedSection] = useState('feed');

  // Mock course data
  const course = {
    title: "Python Fundamentals",
    subtitle: "Master the basics with 1:1 expert guidance",
    price: 299,
    earnBack: 150,
    sessions: 6,
    sessionLength: "1.5 hours",
    rating: 4.9,
    completions: 127,
    creator: {
      name: "Sarah Chen",
      avatar: "https://i.pravatar.cc/150?img=47",
      title: "Senior Developer @ Google"
    }
  };

  // Mock instructors (student-teachers)
  const instructors = [
    {
      id: 1,
      name: "David Park",
      avatar: "https://i.pravatar.cc/150?img=12",
      rating: 5.0,
      students: 23,
      badge: "Top Rated",
      bio: "Passed this course 3 months ago. Now helping others succeed.",
      nextAvailable: "Tomorrow, 2pm",
      wasStudent: true
    },
    {
      id: 2,
      name: "Maria Santos",
      avatar: "https://i.pravatar.cc/150?img=32",
      rating: 4.9,
      students: 8,
      badge: "New Teacher",
      bio: "Just started teaching. Still remember what it's like to learn!",
      nextAvailable: "Monday, 10am",
      wasStudent: true
    },
    {
      id: 3,
      name: "James Wilson",
      avatar: "https://i.pravatar.cc/150?img=53",
      rating: 4.8,
      students: 45,
      badge: "Veteran",
      bio: "Been teaching Python for 2 years on PeerLoop.",
      nextAvailable: "Today, 5pm",
      wasStudent: true
    },
    {
      id: 4,
      name: "Aisha Johnson",
      avatar: "https://i.pravatar.cc/150?img=25",
      rating: 5.0,
      students: 12,
      badge: "Rising Star",
      bio: "Software engineer by day, PeerLoop teacher by night.",
      nextAvailable: "Wednesday, 3pm",
      wasStudent: true
    }
  ];

  // Mock feed posts (visible to everyone as social proof)
  const feedPosts = [
    {
      id: 1,
      author: "Mike Chen",
      avatar: "https://i.pravatar.cc/40?img=11",
      handle: "@mikechen",
      content: "Just finished session 3 with @david_park. The 1:1 format finally made decorators click. Can't believe I struggled with this for months watching videos!",
      time: "2h ago",
      likes: 34,
      comments: 12,
      tag: "student"
    },
    {
      id: 2,
      author: "David Park",
      avatar: "https://i.pravatar.cc/40?img=12",
      handle: "@david_park",
      content: "Another student just passed! 🎉 @jenny_lee crushed the final project. She'll be teaching soon - the cycle continues!",
      time: "5h ago",
      likes: 89,
      comments: 24,
      tag: "instructor"
    },
    {
      id: 3,
      author: "Jenny Lee",
      avatar: "https://i.pravatar.cc/40?img=23",
      handle: "@jenny_lee",
      content: "I paid $299, learned Python, and already earned $150 back teaching 2 students. This model actually works.",
      time: "1d ago",
      likes: 156,
      comments: 45,
      tag: "student-teacher"
    },
    {
      id: 4,
      author: "Sarah Chen",
      avatar: "https://i.pravatar.cc/40?img=47",
      handle: "@sarahchen",
      content: "Q: \"Why 1:1 instead of group classes?\" A: Because I can see YOUR code, answer YOUR questions, and pace to YOUR understanding. That's the 90% retention difference.",
      time: "2d ago",
      likes: 234,
      comments: 67,
      tag: "creator"
    }
  ];

  const displayedInstructors = showAllInstructors ? instructors : instructors.slice(0, 2);

  return (
    <div className={`course-redesign ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Sticky Header */}
      <header className="course-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="header-title">{course.title}</div>
        <div className="header-price">${course.price}</div>
      </header>

      {/* Hero Section */}
      <section className="course-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <FaVideo /> 1:1 Live Instruction
          </div>

          <h1 className="hero-title">{course.title}</h1>
          <p className="hero-subtitle">{course.subtitle}</p>

          <div className="hero-stats">
            <span className="stat">
              <FaStar className="star" /> {course.rating}
            </span>
            <span className="stat-divider">•</span>
            <span className="stat">{course.completions} completed</span>
            <span className="stat-divider">•</span>
            <span className="stat">{course.sessions} sessions</span>
          </div>

          {/* The Value Prop Box */}
          <div className="value-prop-box">
            <div className="value-row">
              <div className="value-item">
                <FaVideo className="value-icon" />
                <div>
                  <strong>{course.sessions}x {course.sessionLength}</strong>
                  <span>Live 1:1 sessions</span>
                </div>
              </div>
              <div className="value-item">
                <FaGraduationCap className="value-icon" />
                <div>
                  <strong>90% retention</strong>
                  <span>vs 10% for videos</span>
                </div>
              </div>
            </div>
            <div className="value-row highlight">
              <div className="value-item full">
                <FaMoneyBillWave className="value-icon money" />
                <div>
                  <strong>Earn ${course.earnBack} back</strong>
                  <span>by teaching after you pass</span>
                </div>
              </div>
            </div>
          </div>

          {/* Creator Credit */}
          <div className="creator-credit">
            <img src={course.creator.avatar} alt={course.creator.name} />
            <div>
              <span className="creator-label">Course by</span>
              <strong>{course.creator.name}</strong>
              <span className="creator-title">{course.creator.title}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Choose Your Instructor Section */}
      <section className="instructors-section">
        <div className="section-header">
          <h2>Choose Your Instructor</h2>
          <p className="section-subtitle">All instructors passed this course themselves</p>
        </div>

        <div className="instructors-list">
          {displayedInstructors.map(instructor => (
            <div
              key={instructor.id}
              className={`instructor-card ${selectedInstructor?.id === instructor.id ? 'selected' : ''}`}
              onClick={() => setSelectedInstructor(instructor)}
            >
              <div className="instructor-main">
                <img src={instructor.avatar} alt={instructor.name} className="instructor-avatar" />
                <div className="instructor-info">
                  <div className="instructor-name-row">
                    <strong>{instructor.name}</strong>
                    {instructor.wasStudent && (
                      <span className="was-student-badge">📚 Was a student</span>
                    )}
                  </div>
                  <div className="instructor-stats">
                    <span><FaStar className="star-small" /> {instructor.rating}</span>
                    <span>•</span>
                    <span>{instructor.students} students taught</span>
                  </div>
                  <p className="instructor-bio">{instructor.bio}</p>
                </div>
              </div>
              <div className="instructor-booking">
                <div className="next-available">
                  <FaCalendarAlt />
                  <span>{instructor.nextAvailable}</span>
                </div>
                <button
                  className={`book-btn ${selectedInstructor?.id === instructor.id ? 'selected' : ''}`}
                >
                  {selectedInstructor?.id === instructor.id ? (
                    <><FaCheckCircle /> Selected</>
                  ) : (
                    'Select'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {instructors.length > 2 && (
          <button
            className="show-more-btn"
            onClick={() => setShowAllInstructors(!showAllInstructors)}
          >
            {showAllInstructors ? (
              <><FaChevronUp /> Show less</>
            ) : (
              <><FaChevronDown /> Show {instructors.length - 2} more instructors</>
            )}
          </button>
        )}
      </section>

      {/* Sticky Booking Bar */}
      {selectedInstructor && (
        <div className="booking-bar">
          <div className="booking-info">
            <img src={selectedInstructor.avatar} alt={selectedInstructor.name} />
            <div>
              <strong>Book with {selectedInstructor.name}</strong>
              <span>{selectedInstructor.nextAvailable}</span>
            </div>
          </div>
          <button className="enroll-btn">
            Enroll for ${course.price}
          </button>
        </div>
      )}

      {/* Course Feed Section - Social Proof */}
      <section className="feed-section">
        <div className="section-header">
          <h2>What Students Are Saying</h2>
          <p className="section-subtitle">Real conversations from the course community</p>
        </div>

        <div className="feed-posts">
          {feedPosts.map(post => (
            <div key={post.id} className="feed-post">
              <img src={post.avatar} alt={post.author} className="post-avatar" />
              <div className="post-content">
                <div className="post-header">
                  <strong>{post.author}</strong>
                  <span className="post-handle">{post.handle}</span>
                  <span className="post-time">• {post.time}</span>
                  {post.tag && (
                    <span className={`post-tag ${post.tag}`}>
                      {post.tag === 'instructor' && '🎓 Instructor'}
                      {post.tag === 'student' && '📖 Student'}
                      {post.tag === 'student-teacher' && '⭐ Student-Teacher'}
                      {post.tag === 'creator' && '✨ Course Creator'}
                    </span>
                  )}
                </div>
                <p className="post-text">{post.content}</p>
                <div className="post-actions">
                  <button><FaComment /> {post.comments}</button>
                  <button><FaHeart /> {post.likes}</button>
                  <button><FaShare /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="load-more-btn">Load more posts</button>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How PeerLoop Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Pick an Instructor</h3>
              <p>Choose from people who already passed this course</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Learn 1:1</h3>
              <p>{course.sessions} live video sessions, working on YOUR code</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Pass & Teach</h3>
              <p>Complete the course, become an instructor, earn ${course.earnBack}+ back</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      {!selectedInstructor && (
        <div className="bottom-cta">
          <div className="cta-price">
            <strong>${course.price}</strong>
            <span>Earn up to ${course.earnBack} back</span>
          </div>
          <button className="cta-btn" onClick={() => document.querySelector('.instructors-section').scrollIntoView({ behavior: 'smooth' })}>
            Choose an Instructor
          </button>
        </div>
      )}
    </div>
  );
};

export default CoursePageRedesign;
