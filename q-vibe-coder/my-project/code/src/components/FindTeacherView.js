import React, { useState, useMemo } from 'react';
import { FaArrowLeft, FaStar, FaCheck, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { communityUsers } from '../data/users';

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
  onSelectTeacher,
  onViewTeacherProfile
}) => {
  const [viewingProfile, setViewingProfile] = useState(null);
  const [profileTab, setProfileTab] = useState('posts');
  const [searchQuery, setSearchQuery] = useState('');

  // Colors
  const bgPrimary = isDarkMode ? '#000' : '#fff';
  const bgCard = isDarkMode ? 'linear-gradient(180deg, #1a2a3a 0%, #16181c 100%)' : 'linear-gradient(180deg, #e8f4fc 0%, #fff 100%)';
  const textPrimary = isDarkMode ? '#e7e9ea' : '#0f1419';
  const textSecondary = isDarkMode ? '#71767b' : '#536471';
  const borderColor = isDarkMode ? '#2f3336' : '#e1e8ed';
  const accentBlue = '#1d9bf0';
  const accentPurple = '#8b5cf6';
  const bannerBg = isDarkMode ? 'linear-gradient(180deg, #1a3a5c 0%, #2a4a6c 100%)' : 'linear-gradient(180deg, #b8d4e8 0%, #d4e8f4 100%)';

  // Generate availability slots for teachers (simulated - in real app would come from backend)
  const generateAvailability = (userId) => {
    // Use a hash of the userId to generate consistent but different availability per teacher
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];
    const availability = {};

    // Generate for next 7 days
    for (let i = 10; i <= 17; i++) {
      const dateStr = `2025-12-${i}`;
      // Each teacher has different slots based on their hash
      const numSlots = 3 + (hash % 5);
      const startIdx = hash % 4;
      const slots = baseSlots.slice(startIdx, startIdx + numSlots);
      if (slots.length > 0) {
        availability[dateStr] = slots;
      }
    }
    return availability;
  };

  // Get student teachers from the real user database
  const studentTeachers = useMemo(() => {
    return Object.values(communityUsers)
      .filter(user => user.userType === 'student_teacher')
      .map(user => {
        // Get initials for avatar fallback
        const initials = user.name.split(' ').map(n => n[0]).join('');

        // Map the real user data to the format expected by the component
        return {
          id: user.id,
          name: user.name,
          handle: user.username,
          avatar: user.avatar, // May be null - component handles this with initials
          avatarColor: user.avatarColor || '#1d9bf0',
          initials: initials,
          tagline: user.expertise?.[0] || 'Student Teacher',
          rating: user.stats?.avgRating || user.teachingStats?.rating || 4.5,
          reviewCount: user.coursesTaught?.[0]?.reviews || Math.floor((user.teachingStats?.students || 0) * 0.8),
          studentsTaught: user.stats?.studentsHelped || user.teachingStats?.students || 0,
          coursesCompleted: user.stats?.coursesCompleted || 1,
          responseTime: '2 hours',
          languages: ['English'],
          location: user.location || 'United States',
          teachingSince: user.joinedDate || 'Jan 2024',
          rate: 45,
          following: Math.floor(Math.random() * 50) + 20,
          followers: Math.floor(Math.random() * 200) + 50,
          bio: user.bio || 'Passionate about teaching and helping others learn.',
          credentials: [
            `${user.stats?.coursesCompleted || 1} courses completed`,
            `${user.stats?.studentsHelped || user.teachingStats?.students || 0} students helped`,
            `${user.teachingStats?.rating || user.stats?.avgRating || 4.5} star rating`
          ],
          specialties: user.expertise || ['Teaching', 'Mentoring'],
          posts: (user.posts || []).map(post => ({
            type: (post.type || 'tip').toUpperCase(),
            course: post.context || 'General',
            text: post.content || '',
            helpful: post.stats?.helpful || 0,
            comments: post.stats?.replies || 0,
            goodwill: post.stats?.goodwill || 0,
            time: post.time || '1d ago'
          })),
          sessions: (user.coursesTaught || []).map((course, idx) => ({
            title: `${course.title} - 1:1 Help`,
            desc: course.topReview?.text || `Get personalized help with ${course.title}`,
            color: idx % 3 === 0
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : idx % 3 === 1
              ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
          })),
          // Add default sessions if none from courses
          ...((!user.coursesTaught || user.coursesTaught.length === 0) ? {
            sessions: [
              { title: '1-on-1 Help Session', desc: 'Get personalized help with any topic', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
            ]
          } : {}),
          availability: generateAvailability(user.id),
          // Keep original user data for profile view
          _originalUser: user
        };
      })
      .slice(0, 8); // Limit to 8 teachers for better UX
  }, []);

  // Filter teachers based on search query
  const filteredTeachers = useMemo(() => {
    if (!searchQuery.trim()) return studentTeachers;
    const query = searchQuery.toLowerCase();
    return studentTeachers.filter(teacher =>
      teacher.name.toLowerCase().includes(query) ||
      teacher.tagline.toLowerCase().includes(query) ||
      teacher.bio.toLowerCase().includes(query) ||
      teacher.location.toLowerCase().includes(query) ||
      teacher.specialties.some(s => s.toLowerCase().includes(query)) ||
      teacher.languages.some(l => l.toLowerCase().includes(query))
    );
  }, [searchQuery]);

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
              {teacher.avatar ? (
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
              ) : (
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  border: `4px solid ${isDarkMode ? '#000' : '#fff'}`,
                  background: teacher.avatarColor || '#1d9bf0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 28,
                  fontWeight: 700
                }}>
                  {teacher.initials}
                </div>
              )}
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

        {/* Search Bar */}
        <div style={{
          position: 'relative',
          marginBottom: 20
        }}>
          <FaSearch style={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            color: textSecondary,
            fontSize: 16
          }} />
          <input
            type="text"
            placeholder="Search by name, specialty, language, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 44px',
              borderRadius: 24,
              border: `1px solid ${borderColor}`,
              background: isDarkMode ? '#16181c' : '#fff',
              color: textPrimary,
              fontSize: 15,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: textSecondary,
                fontSize: 18,
                cursor: 'pointer',
                padding: 0,
                lineHeight: 1
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Results count */}
        {searchQuery && (
          <div style={{
            fontSize: 14,
            color: textSecondary,
            marginBottom: 12
          }}>
            {filteredTeachers.length} teacher{filteredTeachers.length !== 1 ? 's' : ''} found
          </div>
        )}

        {/* Teacher Cards - Summary Detail format */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredTeachers.map(teacher => (
            <div
              key={teacher.id}
              onClick={() => onViewTeacherProfile && onViewTeacherProfile(teacher._originalUser)}
              style={{
                background: bgCard,
                borderRadius: 12,
                padding: 20,
                border: `1px solid ${borderColor}`,
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Header Row: Avatar + Name + Badge + Button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 4
              }}>
                {teacher.avatar ? (
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
                ) : (
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: teacher.avatarColor || '#1d9bf0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 20,
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {teacher.initials}
                  </div>
                )}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTeacher(teacher);
                  }}
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
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
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

            </div>
          ))}

          {/* No Results */}
          {filteredTeachers.length === 0 && searchQuery && (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: textSecondary
            }}>
              <FaSearch style={{ fontSize: 32, marginBottom: 12, opacity: 0.5 }} />
              <p style={{ fontSize: 16, margin: 0 }}>
                No teachers found matching "{searchQuery}"
              </p>
              <p style={{ fontSize: 14, margin: '8px 0 0 0' }}>
                Try a different search term
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FindTeacherView;
