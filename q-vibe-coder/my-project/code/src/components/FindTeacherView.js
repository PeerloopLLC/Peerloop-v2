import React, { useState } from 'react';
import { FaArrowLeft, FaStar, FaCheck, FaCalendarAlt } from 'react-icons/fa';

/**
 * FindTeacherView - Browse and select a student teacher for a course
 * Shows list of certified student teachers with profiles and availability
 *
 * Listing cards use Summary Detail format (like Guy Rymberg Community summary)
 * Full profile uses Profile Page format (like Guy Rymberg Profile page)
 */
const FindTeacherView = ({
  course,
  isDarkMode = true,
  onClose,
  onSelectTeacher
}) => {
  const [viewingProfile, setViewingProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('sessions');
  const [profileTab, setProfileTab] = useState('posts');

  // Colors
  const bgPrimary = isDarkMode ? '#000' : '#fff';
  const bgCard = isDarkMode ? 'linear-gradient(180deg, #1a2a3a 0%, #16181c 100%)' : 'linear-gradient(180deg, #e8f4fc 0%, #fff 100%)';
  const textPrimary = isDarkMode ? '#e7e9ea' : '#0f1419';
  const textSecondary = isDarkMode ? '#71767b' : '#536471';
  const borderColor = isDarkMode ? '#2f3336' : '#e1e8ed';
  const accentBlue = '#1d9bf0';
  const accentPurple = '#8b5cf6';
  const bannerBg = isDarkMode ? 'linear-gradient(180deg, #1a3a5c 0%, #2a4a6c 100%)' : 'linear-gradient(180deg, #b8d4e8 0%, #d4e8f4 100%)';

  // Student teachers data with full profiles
  const studentTeachers = [
    {
      id: 1,
      name: 'Marcus Chen',
      handle: '@MarcusChen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      tagline: 'Making complex concepts simple',
      rating: 4.9,
      reviewCount: 47,
      studentsTaught: 12,
      coursesCompleted: 3,
      responseTime: '2 hours',
      languages: ['English', 'Mandarin'],
      location: 'San Francisco, CA',
      teachingSince: 'Jan 2024',
      rate: 45,
      following: 24,
      followers: 156,
      bio: "Software engineer with 5 years experience at tech startups. I love breaking down complex concepts into simple steps. Patient and thorough teaching style - I won't move on until you truly understand. Passionate about helping others succeed in their coding journey.",
      credentials: [
        'B.S. Computer Science, UC Berkeley',
        'Senior Developer at fintech startup',
        'Certified student-teacher for 18 months'
      ],
      specialties: ['Debugging and troubleshooting', 'System design concepts', 'Career advice for tech'],
      posts: [
        { type: 'TIP', course: 'AI Prompting Mastery > Module 3', text: 'The key to understanding recursion is to trace through a simple example by hand first. Here\'s how I explain it to my students...', helpful: 45, comments: 12, goodwill: 30, time: '2h ago' },
        { type: 'HELPFUL', course: 'The Commons > Career Advice', text: 'Don\'t just watch tutorials - build projects. Even small ones. That\'s what got me my first job.', helpful: 89, comments: 23, goodwill: 50, time: '1d ago' },
        { type: 'REVIEW', course: 'Session with Jamie L.', text: 'Great session! Marcus explained things in a way my professor never could. Finally clicked!', rating: 5.0, comments: 2, time: '3d ago' }
      ],
      sessions: [
        { title: 'AI Prompting Mastery - 1:1 Help', desc: 'Get personalized help with any module. I\'ll walk you through concepts step by step until they click.', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { title: 'AI Tools Overview - Deep Dive', desc: 'Explore AI tools hands-on. We\'ll try different tools together and I\'ll show you real-world use cases.', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { title: 'Intro to Claude Code - Hands On', desc: 'Learn Claude Code by building. We\'ll work through exercises together in real-time.', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }
      ],
      availability: {
        '2025-12-10': ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'],
        '2025-12-11': ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM'],
        '2025-12-12': ['11:00 AM', '3:00 PM'],
      }
    },
    {
      id: 2,
      name: 'Jessica Torres',
      handle: '@JessicaTorres',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
      tagline: 'Learn by doing, not just watching',
      rating: 4.8,
      reviewCount: 32,
      studentsTaught: 8,
      coursesCompleted: 2,
      responseTime: '1 hour',
      languages: ['English', 'Spanish'],
      location: 'Austin, TX',
      teachingSince: 'Mar 2024',
      rate: 40,
      following: 45,
      followers: 89,
      bio: "Full-stack developer passionate about web technologies. I focus on practical, hands-on learning with real-world examples. We'll build something together in every session. I believe the best way to learn is by doing.",
      credentials: [
        'Self-taught developer, bootcamp graduate',
        '4 years professional experience',
        'Completed this course 1 year ago'
      ],
      specialties: ['Frontend frameworks (React, Vue)', 'Making things look good (CSS/design)', 'Bootcamp-style intensive learning'],
      posts: [
        { type: 'TIP', course: 'AI Tools Overview > Getting Started', text: 'Start with one tool and master it before moving on. Trying to learn everything at once is overwhelming.', helpful: 67, comments: 18, goodwill: 40, time: '5h ago' },
        { type: 'HELPFUL', course: 'The Commons > Learning Tips', text: 'Set a timer for 25 minutes and just code. No distractions. You\'ll be amazed what you can do.', helpful: 54, comments: 15, goodwill: 35, time: '2d ago' }
      ],
      sessions: [
        { title: 'React Fundamentals - Pair Programming', desc: 'We\'ll build a real component together. Learn by coding alongside me.', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { title: 'CSS & Design - Make It Pretty', desc: 'Turn your functional app into something beautiful. I\'ll teach you my design tricks.', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }
      ],
      availability: {
        '2025-12-10': ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'],
        '2025-12-11': ['10:00 AM', '2:00 PM', '6:00 PM'],
      }
    },
    {
      id: 'demo_alex',
      name: 'Alex Sanders',
      handle: '@AlexSanders',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face',
      tagline: "I just went through this - I get it",
      rating: 4.7,
      reviewCount: 18,
      studentsTaught: 4,
      coursesCompleted: 1,
      responseTime: '30 minutes',
      languages: ['English'],
      location: 'Portland, OR',
      teachingSince: 'Aug 2024',
      rate: 35,
      following: 67,
      followers: 42,
      bio: "Recently completed this course myself! I understand the learning curve and can help you avoid common pitfalls. Fresh perspective on what's confusing and what clicks. Still remember exactly where I got stuck.",
      credentials: [
        'Career changer from marketing',
        'Completed this course 6 months ago',
        'New to teaching but highly rated'
      ],
      specialties: ['Explaining beginner concepts', 'Study strategies and time management', 'Motivation and accountability'],
      posts: [
        { type: 'TIP', course: 'AI Prompting Mastery > Basics', text: 'I was stuck on this exact concept last month. Here\'s what finally made it click for me...', helpful: 34, comments: 9, goodwill: 25, time: '1d ago' }
      ],
      sessions: [
        { title: 'Beginner-Friendly Help', desc: 'No question is too basic. I remember being confused too.', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
      ],
      availability: {
        '2025-12-10': ['9:00 AM', '1:00 PM', '6:00 PM'],
        '2025-12-11': ['11:00 AM', '4:00 PM'],
      }
    },
    {
      id: 4,
      name: 'Sarah Kim',
      handle: '@SarahKim',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      tagline: "Understand the 'why', not just the 'how'",
      rating: 4.9,
      reviewCount: 52,
      studentsTaught: 6,
      coursesCompleted: 4,
      responseTime: '3 hours',
      languages: ['English', 'Korean'],
      location: 'Seattle, WA',
      teachingSince: 'Nov 2023',
      rate: 50,
      following: 31,
      followers: 234,
      bio: 'Data scientist who loves teaching. I emphasize understanding the "why" behind concepts, not just memorizing steps. When you understand the foundation, everything else makes sense. Former TA in grad school.',
      credentials: [
        'M.S. Data Science, University of Washington',
        '6 years in data/analytics roles',
        'Former teaching assistant in grad school'
      ],
      specialties: ['Data and analytics concepts', 'Mathematical foundations', 'Structured learning plans'],
      posts: [
        { type: 'TIP', course: 'AI Prompting Mastery > Advanced', text: 'Before jumping to the solution, always ask yourself: what problem am I actually trying to solve?', helpful: 112, comments: 31, goodwill: 65, time: '4h ago' },
        { type: 'HELPFUL', course: 'The Commons > Data Science', text: 'Statistics doesn\'t have to be scary. Here\'s a visual way to think about it...', helpful: 78, comments: 19, goodwill: 45, time: '1d ago' }
      ],
      sessions: [
        { title: 'Conceptual Deep Dive', desc: 'We\'ll go beyond the surface. Understand why things work, not just how.', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { title: 'Data & Analytics Help', desc: 'Make sense of data concepts. I\'ll draw diagrams and explain visually.', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { title: 'Advanced Topics', desc: 'Ready to go deeper? Let\'s tackle the challenging material together.', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }
      ],
      availability: {
        '2025-12-10': ['2:00 PM', '5:00 PM'],
        '2025-12-11': ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM'],
      }
    }
  ];

  // =====================================================
  // PROFILE PAGE VIEW (matches Guy Rymberg Profile page)
  // =====================================================
  if (viewingProfile) {
    const teacher = viewingProfile;
    return (
      <div style={{ background: bgPrimary, minHeight: '100vh', width: '100%' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: 20 }}>

          {/* Banner */}
          <div style={{
            height: 120,
            background: bannerBg,
            borderRadius: '8px 8px 0 0',
            position: 'relative'
          }} />

          {/* Avatar overlapping banner */}
          <div style={{
            position: 'relative',
            marginTop: -40,
            padding: '0 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
              {/* Profile label */}
              <div style={{
                position: 'absolute',
                top: -30,
                left: 28,
                background: isDarkMode ? '#16181c' : '#fff',
                padding: '2px 8px',
                borderRadius: 4,
                fontSize: 11,
                color: accentBlue,
                border: `1px solid ${borderColor}`
              }}>
                Profile
              </div>
              <img
                src={teacher.avatar}
                alt={teacher.name}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  border: `4px solid ${isDarkMode ? '#000' : '#fff'}`,
                  objectFit: 'cover',
                  background: borderColor
                }}
              />
            </div>
            <span
              onClick={() => setViewingProfile(null)}
              style={{ fontSize: 13, color: textSecondary, cursor: 'pointer' }}
            >
              ← Back to teachers
            </span>
          </div>

          {/* Profile Info */}
          <div style={{ padding: '16px 20px', position: 'relative' }}>
            {/* Book Session button - absolute right */}
            <button
              onClick={() => onSelectTeacher(teacher)}
              style={{
                position: 'absolute',
                right: 20,
                top: 16,
                padding: '8px 16px',
                borderRadius: 20,
                border: 'none',
                background: accentPurple,
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Book Session
            </button>

            {/* Name */}
            <div style={{ fontSize: 20, fontWeight: 700, color: textPrimary, marginBottom: 2 }}>
              {teacher.name}
            </div>

            {/* Handle */}
            <div style={{ fontSize: 15, color: textSecondary, marginBottom: 4 }}>
              {teacher.handle}
            </div>

            {/* Badge */}
            <div style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 600,
              background: accentPurple,
              color: '#fff',
              marginBottom: 8
            }}>
              Student Teacher
            </div>

            {/* Bio */}
            <p style={{ fontSize: 15, color: textPrimary, lineHeight: 1.4, marginBottom: 12 }}>
              {teacher.tagline}. {teacher.bio.split('.')[0]}.
            </p>

            {/* Meta Row */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              fontSize: 14,
              color: textSecondary,
              marginBottom: 12
            }}>
              <span>📍 {teacher.location}</span>
              <span>⏱️ Responds in {teacher.responseTime}</span>
              <span>📅 Teaching since {teacher.teachingSince}</span>
            </div>

            {/* Following/Followers */}
            <div style={{
              display: 'flex',
              gap: 20,
              fontSize: 14,
              color: textSecondary,
              marginBottom: 12
            }}>
              <span><strong style={{ color: textPrimary }}>{teacher.following}</strong> Following</span>
              <span><strong style={{ color: textPrimary }}>{teacher.followers}</strong> Followers</span>
            </div>

            {/* Profile Stats */}
            <div style={{
              display: 'flex',
              gap: 24,
              fontSize: 14,
              color: textSecondary,
              marginBottom: 16
            }}>
              <span><strong style={{ color: textPrimary }}>{teacher.coursesCompleted}</strong> Courses Completed</span>
              <span><strong style={{ color: textPrimary }}>{teacher.studentsTaught}</strong> Students Helped</span>
              <span><strong style={{ color: textPrimary }}>{teacher.rating}</strong> Rating</span>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: `1px solid ${borderColor}`
          }}>
            {['Posts', 'Sessions', 'Reviews'].map(tab => (
              <div
                key={tab}
                onClick={() => setProfileTab(tab.toLowerCase())}
                style={{
                  padding: '16px 24px',
                  fontSize: 15,
                  fontWeight: profileTab === tab.toLowerCase() ? 700 : 500,
                  color: profileTab === tab.toLowerCase() ? textPrimary : textSecondary,
                  cursor: 'pointer',
                  borderBottom: profileTab === tab.toLowerCase() ? `2px solid ${accentBlue}` : '2px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* Activity Feed */}
          <div>
            {teacher.posts.map((post, i) => (
              <div key={i} style={{
                padding: '16px 20px',
                borderBottom: `1px solid ${borderColor}`
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 8
                }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    background: post.type === 'TIP' ? '#fef3c7' : post.type === 'HELPFUL' ? '#d1fae5' : '#dbeafe',
                    color: post.type === 'TIP' ? '#d97706' : post.type === 'HELPFUL' ? '#059669' : '#2563eb'
                  }}>
                    {post.type}
                  </span>
                  <span style={{ fontSize: 13, color: accentBlue }}>{post.course}</span>
                  <span style={{ fontSize: 13, color: textSecondary, marginLeft: 'auto' }}>{post.time}</span>
                </div>
                <p style={{ fontSize: 15, color: textPrimary, lineHeight: 1.4, marginBottom: 8 }}>
                  "{post.text}"
                </p>
                <div style={{ display: 'flex', gap: 16, fontSize: 13, color: textSecondary }}>
                  {post.helpful && <span style={{ color: '#059669' }}>👍 {post.helpful} Helpful</span>}
                  {post.rating && <span>⭐ {post.rating}</span>}
                  <span>💬 {post.comments}</span>
                  {post.goodwill && <span>+{post.goodwill} Goodwill</span>}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  // =====================================================
  // SUMMARY DETAIL LISTING (matches Guy Rymberg Community summary)
  // =====================================================
  return (
    <div style={{ background: isDarkMode ? '#000' : '#f5f5f5', minHeight: '100vh', width: '100%' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 20 }}>

        {/* Back Button */}
        <button
          onClick={onClose}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            background: isDarkMode ? '#16181c' : '#fff',
            border: `1px solid ${borderColor}`,
            borderRadius: 20,
            fontSize: 14,
            color: textPrimary,
            cursor: 'pointer',
            marginBottom: 16
          }}
        >
          <span>←</span>
          <span>Back to {course?.title || 'Course'}</span>
        </button>

        {/* Teacher Cards - Summary Detail format */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {studentTeachers.map(teacher => (
            <div
              key={teacher.id}
              style={{
                background: bgCard,
                borderRadius: 12,
                padding: 20,
                border: `1px solid ${borderColor}`
              }}
            >
              {/* Header Row: Avatar + Name + Badge + Button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 4
              }}>
                <img
                  src={teacher.avatar}
                  alt={teacher.name}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: textPrimary }}>{teacher.name}</span>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      background: accentPurple,
                      color: '#fff',
                      textTransform: 'uppercase'
                    }}>
                      Student Teacher
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onSelectTeacher(teacher)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 20,
                    border: 'none',
                    background: accentPurple,
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Book Session +
                </button>
              </div>

              {/* Tagline */}
              <div style={{
                fontSize: 14,
                color: textSecondary,
                fontStyle: 'italic',
                marginBottom: 8,
                paddingLeft: 68
              }}>
                {teacher.tagline}
              </div>

              {/* Stats Row */}
              <div style={{
                display: 'flex',
                gap: 16,
                fontSize: 14,
                color: textSecondary,
                marginBottom: 16,
                paddingLeft: 68
              }}>
                <span>⭐ {teacher.rating}</span>
                <span>👥 {teacher.studentsTaught} students</span>
                <span>📚 {teacher.coursesCompleted} courses completed</span>
              </div>

              {/* Bio */}
              <p style={{
                fontSize: 14,
                color: textPrimary,
                lineHeight: 1.5,
                marginBottom: 16
              }}>
                {teacher.bio}
              </p>

              {/* Credentials */}
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 16 }}>
                {teacher.credentials.map((cred, i) => (
                  <li key={i} style={{
                    fontSize: 14,
                    color: textPrimary,
                    lineHeight: 1.8,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8
                  }}>
                    <FaCheck style={{ color: '#059669', flexShrink: 0, marginTop: 4 }} />
                    {cred}
                  </li>
                ))}
              </ul>

              {/* Tabs */}
              <div style={{
                display: 'flex',
                borderBottom: `1px solid ${borderColor}`,
                marginBottom: 0
              }}>
                <div
                  onClick={() => setActiveTab('sessions')}
                  style={{
                    padding: '12px 20px',
                    fontSize: 14,
                    fontWeight: activeTab === 'sessions' ? 700 : 500,
                    color: activeTab === 'sessions' ? textPrimary : textSecondary,
                    cursor: 'pointer',
                    borderBottom: activeTab === 'sessions' ? `2px solid ${accentBlue}` : '2px solid transparent'
                  }}
                >
                  Sessions
                </div>
                <div
                  onClick={() => setActiveTab('reviews')}
                  style={{
                    padding: '12px 20px',
                    fontSize: 14,
                    fontWeight: activeTab === 'reviews' ? 700 : 500,
                    color: activeTab === 'reviews' ? textSecondary : textSecondary,
                    cursor: 'pointer',
                    borderBottom: activeTab === 'reviews' ? `2px solid ${accentBlue}` : '2px solid transparent'
                  }}
                >
                  Reviews
                </div>
              </div>

              {/* Sessions List */}
              <div style={{
                background: isDarkMode ? 'rgba(0,0,0,0.2)' : '#fff',
                borderRadius: '0 0 8px 8px',
                border: `1px solid ${borderColor}`,
                borderTop: 'none'
              }}>
                {teacher.sessions.map((session, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    gap: 12,
                    padding: '16px 20px',
                    borderBottom: i < teacher.sessions.length - 1 ? `1px solid ${borderColor}` : 'none',
                    alignItems: 'flex-start'
                  }}>
                    {/* Thumbnail */}
                    <div style={{
                      width: 80,
                      height: 50,
                      borderRadius: 8,
                      background: session.color,
                      flexShrink: 0
                    }} />
                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: accentBlue,
                        marginBottom: 4,
                        cursor: 'pointer'
                      }}>
                        {session.title}
                      </div>
                      <p style={{ fontSize: 13, color: textSecondary, lineHeight: 1.4, margin: 0 }}>
                        {session.desc}
                      </p>
                    </div>
                    {/* Action */}
                    <button style={{
                      padding: '6px 14px',
                      borderRadius: 20,
                      border: `1px solid ${textSecondary}`,
                      background: 'transparent',
                      color: textSecondary,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}>
                      Available
                    </button>
                  </div>
                ))}
              </div>

              {/* Go to Profile link */}
              <div style={{
                textAlign: 'center',
                marginTop: 12
              }}>
                <span
                  onClick={() => setViewingProfile(teacher)}
                  style={{
                    fontSize: 13,
                    color: accentBlue,
                    cursor: 'pointer'
                  }}
                >
                  Go to Profile →
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FindTeacherView;
