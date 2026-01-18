import React, { useState, useRef, useEffect } from 'react';
import {
  FaChevronDown,
  FaArrowUp,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const CreatorDashboard = ({ isDarkMode = true, currentUser = null, onMenuChange = null }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedCertRequest, setExpandedCertRequest] = useState(0); // First one expanded by default

  // Drag scroll state for nav tabs
  const navRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (navRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const nav = navRef.current;
    if (nav) {
      nav.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        nav.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, []);

  const scrollNav = (direction) => {
    if (navRef.current) {
      const scrollAmount = 150;
      navRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - navRef.current.offsetLeft);
    setScrollLeft(navRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - navRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    navRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Navigation tabs - simplified per wireframe
  const navTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'students', label: 'Students' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'payouts', label: 'Payouts' },
    { id: 'sessions', label: 'Sessions' },
    { id: 'content', label: 'Content' },
    { id: 'moderator', label: 'Moderator' }
  ];

  // Dashboard data
  const dashboardData = {
    courseName: "AI Prompting Mastery",
    creatorName: currentUser?.name?.split(' ')[0] || "Guy",
    creatorInitials: currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('') : "G",

    // Action items
    actionItems: [
      { icon: '🎓', count: 3, label: 'certification requests waiting' },
      { icon: '💰', count: 2, label: 'payouts ready for approval' },
      { icon: '👩‍🏫', count: 1, label: 'Student-Teacher application' }
    ],

    // Key metrics
    metrics: [
      { value: 24, label: 'Students', sublabel: 'Enrolled', change: '4', changeLabel: 'this wk' },
      { value: 18, label: 'Active', sublabel: 'Learners', change: '2', changeLabel: 'this wk' },
      { value: '$10,800', label: 'Revenue', sublabel: '(Total)', change: '$1,800', changeLabel: 'this wk' },
      { value: 5, label: 'Student-', sublabel: 'Teachers', change: '1', changeLabel: 'this wk' },
      { value: '75%', label: 'Complet-', sublabel: 'ion Rate', change: '5%', changeLabel: 'vs last' }
    ],

    // Today's sessions
    sessions: [
      { time: '10:00 AM', student: 'Sarah Johnson', teacher: 'Marcus Chen', module: 'Module 3' },
      { time: '2:00 PM', student: 'Mike Chen', teacher: 'Jessica', module: 'Module 2' },
      { time: '7:00 PM', student: 'Alex Rivera', teacher: 'Marcus Chen', module: 'Module 4' }
    ],

    // Module progress
    moduleProgress: [
      { name: 'Module 1', completed: 24, total: 24 },
      { name: 'Module 2', completed: 18, total: 24 },
      { name: 'Module 3', completed: 12, total: 24 },
      { name: 'Module 4', completed: 6, total: 24 },
      { name: 'Module 5', completed: 3, total: 24 }
    ],

    // Revenue breakdown
    revenue: {
      totalCollected: 3600,
      enrollments: 8,
      pricePerEnrollment: 450,
      creatorEarnings: 540,
      platformFee: 540,
      stPayouts: 2520
    },

    // Certification data
    certifications: {
      stats: { pending: 3, approved: 18, declined: 0 },
      pending: [
        {
          id: 1,
          student: 'Alex Torres',
          recommendedBy: 'Marcus Chen',
          recommendedByRole: 'Student-Teacher',
          submittedDate: 'December 5, 2025',
          modulesCompleted: 5,
          modulesTotal: 5,
          sessionsAttended: 8,
          timeToComplete: '3 weeks',
          averageRating: 4.8,
          notes: 'Alex has demonstrated excellent understanding of all concepts. Highly recommend certification. Would make a great Student-Teacher.'
        },
        {
          id: 2,
          student: 'Jordan Williams',
          recommendedBy: 'Jessica',
          recommendedByRole: 'Student-Teacher',
          submittedDate: 'December 4, 2025',
          modulesCompleted: 5,
          modulesTotal: 5,
          sessionsAttended: 7,
          timeToComplete: '4 weeks',
          averageRating: 4.6,
          notes: 'Jordan showed great progress throughout the course. Ready for certification.'
        },
        {
          id: 3,
          student: 'Casey Martinez',
          recommendedBy: 'Marcus',
          recommendedByRole: 'Student-Teacher',
          submittedDate: 'December 3, 2025',
          modulesCompleted: 5,
          modulesTotal: 5,
          sessionsAttended: 9,
          timeToComplete: '3 weeks',
          averageRating: 4.9,
          notes: 'Exceptional student. Very engaged during all sessions.'
        }
      ],
      approved: [
        { id: 4, student: 'Sam Park', approvedDate: 'Dec 2' },
        { id: 5, student: 'Riley Johnson', approvedDate: 'Nov 30' },
        { id: 6, student: 'Morgan Lee', approvedDate: 'Nov 28' }
      ]
    },

    // Student-Teacher data
    studentTeachers: {
      stats: { active: 5, pendingApplications: 1 },
      pendingApplications: [
        {
          id: 1,
          name: 'Alex Torres',
          appliedDate: 'December 5, 2025',
          certifiedDate: 'December 5, 2025',
          courseCompletion: '3 weeks',
          sessionsAsStudent: 8,
          finalAssessment: 4.8,
          taughtBy: 'Marcus Chen',
          recommendation: 'Alex would make an excellent Student-Teacher. Strong communication skills and deep understanding of material.',
          statement: "I'm excited to help others learn AI prompting. I've already been helping colleagues at work.",
          availability: '10 hrs/week'
        }
      ],
      active: [
        {
          id: 1,
          name: 'Marcus Chen',
          rating: 4.9,
          status: 'active',
          studentsCurrent: 4,
          studentsTotal: 12,
          sessionsThisWeek: 6,
          earnings: 3780,
          memberSince: 'October 2025'
        },
        {
          id: 2,
          name: 'Jessica Torres',
          rating: 4.8,
          status: 'active',
          studentsCurrent: 3,
          studentsTotal: 8,
          sessionsThisWeek: 4,
          earnings: 2520,
          memberSince: 'November 2025'
        },
        {
          id: 3,
          name: 'Sam Park',
          rating: 4.7,
          status: 'active',
          studentsCurrent: 2,
          studentsTotal: 4,
          sessionsThisWeek: 3,
          earnings: 1260,
          memberSince: 'November 2025'
        },
        {
          id: 4,
          name: 'Riley Johnson',
          rating: 4.9,
          status: 'active',
          studentsCurrent: 2,
          studentsTotal: 3,
          sessionsThisWeek: 2,
          earnings: 945,
          memberSince: 'December 2025'
        },
        {
          id: 5,
          name: 'Morgan Lee',
          rating: 4.6,
          status: 'paused',
          studentsCurrent: 0,
          studentsTotal: 2,
          sessionsThisWeek: 0,
          earnings: 315,
          memberSince: 'December 2025'
        }
      ],
      performance: [
        { name: 'Marcus', students: 12, completion: 92, rating: 4.9, earnings: 3780 },
        { name: 'Jessica', students: 8, completion: 88, rating: 4.8, earnings: 2520 },
        { name: 'Sam', students: 4, completion: 75, rating: 4.7, earnings: 1260 },
        { name: 'Riley', students: 3, completion: 100, rating: 4.9, earnings: 945 },
        { name: 'Morgan', students: 2, completion: 50, rating: 4.6, earnings: 315 }
      ]
    },

    // Analytics data
    analytics: {
      dateRange: 'Last 30 Days',
      enrollmentTrend: [
        { date: 'Nov 10', value: 2 },
        { date: 'Nov 17', value: 4 },
        { date: 'Nov 24', value: 4 },
        { date: 'Dec 1', value: 6 },
        { date: 'Dec 8', value: 8 }
      ],
      enrollmentStats: {
        total: 24,
        thisPeriod: 8,
        growth: 50
      },
      completionFunnel: [
        { stage: 'Enrolled', count: 24, percent: 100 },
        { stage: 'Module 1 Done', count: 24, percent: 100 },
        { stage: 'Module 2 Done', count: 18, percent: 75 },
        { stage: 'Module 3 Done', count: 12, percent: 50 },
        { stage: 'Module 4 Done', count: 6, percent: 25 },
        { stage: 'Module 5 Done', count: 3, percent: 13 },
        { stage: 'Certified', count: 3, percent: 13 }
      ],
      dropOffAlert: 'Drop-off alert: 25% drop Module 2 → Module 3',
      revenue: {
        total: 10800,
        creatorEarnings: 1620,
        stPayouts: 7560,
        platformFee: 1620,
        avgPerStudent: 450,
        projectedMonthly: 3600
      },
      flywheel: {
        studentsToST: { count: 5, total: 24, percent: 21 },
        recruitedByST: 8,
        secondGenConverts: 1,
        status: 'Active'
      }
    }
  };

  const bgPrimary = isDarkMode ? '#000' : '#fff';
  const bgSecondary = isDarkMode ? '#16181c' : '#f8fafc';
  const bgCard = isDarkMode ? '#16181c' : '#fff';
  const textPrimary = isDarkMode ? '#e7e9ea' : '#0f172a';
  const textSecondary = isDarkMode ? '#71767b' : '#64748b';
  const borderColor = isDarkMode ? '#2f3336' : '#e2e8f0';
  const accentBlue = '#1d9bf0';
  const accentGreen = '#00ba7c';

  // Render Overview Tab
  const renderOverviewTab = () => (
    <div style={{ padding: 24, maxWidth: 1400 }}>
      {/* Welcome Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontSize: 24,
          fontWeight: 700,
          color: textPrimary,
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <span style={{ fontSize: 28 }}>👋</span> Welcome back, {dashboardData.creatorName}
        </h1>
        <p style={{
          fontSize: 15,
          color: textSecondary,
          margin: '8px 0 0 0'
        }}>
          {dashboardData.courseName}
        </p>
      </div>

      {/* Action Required */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontSize: 14,
          fontWeight: 600,
          color: textSecondary,
          margin: '0 0 12px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          🔔 ACTION REQUIRED
        </h2>
        <div style={{
          background: bgCard,
          borderRadius: 12,
          border: `1px solid ${borderColor}`,
          overflow: 'hidden'
        }}>
          {dashboardData.actionItems.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderBottom: index < dashboardData.actionItems.length - 1 ? `1px solid ${borderColor}` : 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span style={{ fontSize: 14, color: textPrimary }}>
                  {item.count} {item.label}
                </span>
              </div>
              <span style={{
                fontSize: 13,
                color: accentBlue,
                fontWeight: 500
              }}>
                Review →
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontSize: 14,
          fontWeight: 600,
          color: textSecondary,
          margin: '0 0 12px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          📊 KEY METRICS
        </h2>
        <div style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap'
        }}>
          {dashboardData.metrics.map((metric, index) => (
            <div
              key={index}
              style={{
                flex: '1 1 100px',
                minWidth: 100,
                background: bgCard,
                borderRadius: 12,
                padding: 16,
                border: `1px solid ${borderColor}`,
                textAlign: 'center'
              }}
            >
              <div style={{
                fontSize: 24,
                fontWeight: 700,
                color: textPrimary,
                marginBottom: 4
              }}>
                {metric.value}
              </div>
              <div style={{ fontSize: 12, color: textSecondary }}>
                {metric.label}
              </div>
              <div style={{ fontSize: 11, color: textSecondary, opacity: 0.8 }}>
                {metric.sublabel}
              </div>
              <div style={{
                fontSize: 11,
                color: accentGreen,
                marginTop: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
              }}>
                <FaArrowUp style={{ fontSize: 9 }} />
                {metric.change}
              </div>
              <div style={{ fontSize: 10, color: textSecondary }}>
                {metric.changeLabel}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Sessions */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontSize: 14,
          fontWeight: 600,
          color: textSecondary,
          margin: '0 0 12px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          📅 TODAY'S SESSIONS
        </h2>
        <div style={{
          background: bgCard,
          borderRadius: 12,
          border: `1px solid ${borderColor}`,
          overflow: 'hidden'
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr 1fr 120px',
            padding: '10px 16px',
            borderBottom: `1px solid ${borderColor}`,
            background: bgSecondary
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: textSecondary }}>Time</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: textSecondary }}>Student</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: textSecondary }}>S-T</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: textSecondary }}>Module</div>
          </div>

          {/* Table Rows */}
          {dashboardData.sessions.map((session, index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr 1fr 120px',
                padding: '12px 16px',
                borderBottom: index < dashboardData.sessions.length - 1 ? `1px solid ${borderColor}` : 'none',
                alignItems: 'center'
              }}
            >
              <div style={{ fontSize: 14, color: textPrimary }}>{session.time}</div>
              <div style={{ fontSize: 14, color: textPrimary }}>{session.student}</div>
              <div style={{ fontSize: 14, color: textSecondary }}>{session.teacher}</div>
              <div style={{ fontSize: 14, color: textSecondary }}>{session.module}</div>
            </div>
          ))}

          {/* View All Link */}
          <div style={{
            padding: '12px 16px',
            borderTop: `1px solid ${borderColor}`
          }}>
            <span style={{
              fontSize: 13,
              color: accentBlue,
              cursor: 'pointer',
              fontWeight: 500
            }}>
              View All Sessions →
            </span>
          </div>
        </div>
      </div>

      {/* Student Progress Snapshot */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontSize: 14,
          fontWeight: 600,
          color: textSecondary,
          margin: '0 0 12px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          📈 STUDENT PROGRESS SNAPSHOT
        </h2>
        <div style={{
          background: bgCard,
          borderRadius: 12,
          border: `1px solid ${borderColor}`,
          padding: 16
        }}>
          {dashboardData.moduleProgress.map((module, index) => {
            const percentage = Math.round((module.completed / module.total) * 100);
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: index < dashboardData.moduleProgress.length - 1 ? 12 : 0
                }}
              >
                <div style={{
                  width: 70,
                  fontSize: 13,
                  color: textPrimary,
                  flexShrink: 0
                }}>
                  {module.name}
                </div>
                <div style={{
                  flex: 1,
                  height: 16,
                  background: isDarkMode ? '#2f3336' : '#e2e8f0',
                  borderRadius: 4,
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${percentage}%`,
                    background: accentBlue,
                    borderRadius: 4
                  }} />
                </div>
                <div style={{
                  width: 80,
                  fontSize: 13,
                  color: textSecondary,
                  textAlign: 'right',
                  flexShrink: 0
                }}>
                  {module.completed} ({percentage}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue This Month */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontSize: 14,
          fontWeight: 600,
          color: textSecondary,
          margin: '0 0 12px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          💰 REVENUE THIS MONTH
        </h2>
        <div style={{
          background: bgCard,
          borderRadius: 12,
          border: `1px solid ${borderColor}`,
          padding: 16
        }}>
          <div style={{
            fontSize: 14,
            color: textSecondary,
            marginBottom: 12
          }}>
            Total Collected: <strong style={{ color: textPrimary, fontSize: 18 }}>
              ${dashboardData.revenue.totalCollected.toLocaleString()}
            </strong>
            <span style={{ marginLeft: 8 }}>
              ({dashboardData.revenue.enrollments} enrollments x ${dashboardData.revenue.pricePerEnrollment})
            </span>
          </div>

          <div style={{
            borderTop: `1px solid ${borderColor}`,
            paddingTop: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 14
            }}>
              <span style={{ color: accentGreen }}>Your Earnings (15%):</span>
              <strong style={{ color: accentGreen }}>${dashboardData.revenue.creatorEarnings}</strong>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 14
            }}>
              <span style={{ color: textSecondary }}>Platform Fee (15%):</span>
              <span style={{ color: textSecondary }}>${dashboardData.revenue.platformFee}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 14
            }}>
              <span style={{ color: textSecondary }}>S-T Payouts (70%):</span>
              <span style={{ color: textSecondary }}>${dashboardData.revenue.stPayouts.toLocaleString()}</span>
            </div>
          </div>

          <div style={{
            marginTop: 16,
            paddingTop: 12,
            borderTop: `1px solid ${borderColor}`
          }}>
            <span style={{
              fontSize: 13,
              color: accentBlue,
              cursor: 'pointer',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}>
              View Full Revenue Report <FaArrowRight style={{ fontSize: 11 }} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Analytics Tab
  const renderAnalyticsTab = () => {
    const { analytics } = dashboardData;
    const accentYellow = '#ffd700';

    // Simple chart visualization using bars
    const maxValue = Math.max(...analytics.enrollmentTrend.map(d => d.value));
    const chartHeight = 120;

    return (
      <div style={{ padding: 24, maxWidth: 1400 }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{
            fontSize: 24,
            fontWeight: 700,
            color: textPrimary,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span style={{ fontSize: 28 }}>📈</span> Analytics
          </h1>
          <p style={{
            fontSize: 15,
            color: textSecondary,
            margin: '8px 0 0 0'
          }}>
            {dashboardData.courseName}
          </p>
        </div>

        {/* Date Range Controls */}
        <div style={{
          display: 'flex',
          gap: 12,
          marginBottom: 24,
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: 14, color: textSecondary }}>Date Range:</span>
          <button style={{
            padding: '8px 16px',
            background: isDarkMode ? '#2f3336' : '#e2e8f0',
            border: 'none',
            borderRadius: 8,
            color: textPrimary,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            {analytics.dateRange} <FaChevronDown style={{ fontSize: 10 }} />
          </button>
          <button style={{
            padding: '8px 16px',
            background: 'transparent',
            border: `1px solid ${borderColor}`,
            borderRadius: 8,
            color: textSecondary,
            fontSize: 14,
            cursor: 'pointer'
          }}>
            Custom
          </button>
          <button style={{
            padding: '8px 16px',
            background: 'transparent',
            border: `1px solid ${accentBlue}`,
            borderRadius: 8,
            color: accentBlue,
            fontSize: 14,
            cursor: 'pointer',
            marginLeft: 'auto'
          }}>
            Export Report
          </button>
        </div>

        {/* Enrollment Trends */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{
            fontSize: 14,
            fontWeight: 600,
            color: textSecondary,
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            📊 ENROLLMENT TRENDS
          </h2>

          <div style={{
            background: bgCard,
            borderRadius: 12,
            border: `1px solid ${borderColor}`,
            padding: 20
          }}>
            <div style={{
              fontSize: 14,
              fontWeight: 500,
              color: textPrimary,
              marginBottom: 16
            }}>
              Enrollments Over Time
            </div>

            {/* Simple Bar Chart */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 8,
              height: chartHeight,
              marginBottom: 8,
              paddingLeft: 30
            }}>
              {analytics.enrollmentTrend.map((point, index) => (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <div style={{
                    fontSize: 11,
                    color: textPrimary,
                    fontWeight: 500
                  }}>
                    {point.value}
                  </div>
                  <div style={{
                    width: '100%',
                    height: `${(point.value / maxValue) * (chartHeight - 20)}px`,
                    background: `linear-gradient(to top, ${accentBlue}, ${accentBlue}88)`,
                    borderRadius: '4px 4px 0 0',
                    minHeight: 4
                  }} />
                </div>
              ))}
            </div>

            {/* X-axis labels */}
            <div style={{
              display: 'flex',
              gap: 8,
              paddingLeft: 30
            }}>
              {analytics.enrollmentTrend.map((point, index) => (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: 11,
                    color: textSecondary
                  }}
                >
                  {point.date}
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div style={{
              display: 'flex',
              gap: 24,
              marginTop: 16,
              paddingTop: 16,
              borderTop: `1px solid ${borderColor}`,
              flexWrap: 'wrap'
            }}>
              <span style={{ fontSize: 14, color: textSecondary }}>
                Total: <strong style={{ color: textPrimary }}>{analytics.enrollmentStats.total} enrollments</strong>
              </span>
              <span style={{ fontSize: 14, color: textSecondary }}>
                This period: <strong style={{ color: textPrimary }}>{analytics.enrollmentStats.thisPeriod}</strong>
              </span>
              <span style={{ fontSize: 14, color: accentGreen }}>
                Growth: <strong>+{analytics.enrollmentStats.growth}%</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Completion Funnel */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{
            fontSize: 14,
            fontWeight: 600,
            color: textSecondary,
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            🎯 COMPLETION FUNNEL
          </h2>

          <div style={{
            background: bgCard,
            borderRadius: 12,
            border: `1px solid ${borderColor}`,
            padding: 20
          }}>
            {analytics.completionFunnel.map((stage, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: index < analytics.completionFunnel.length - 1 ? 12 : 0
                }}
              >
                <div style={{
                  width: 120,
                  fontSize: 13,
                  color: textPrimary,
                  flexShrink: 0
                }}>
                  {stage.stage}
                </div>
                <div style={{
                  flex: 1,
                  height: 20,
                  background: isDarkMode ? '#2f3336' : '#e2e8f0',
                  borderRadius: 4,
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${stage.percent}%`,
                    background: stage.percent === 100 ? accentGreen : accentBlue,
                    borderRadius: 4
                  }} />
                </div>
                <div style={{
                  width: 100,
                  fontSize: 13,
                  color: textSecondary,
                  textAlign: 'right',
                  flexShrink: 0
                }}>
                  {stage.count} ({stage.percent}%)
                </div>
              </div>
            ))}

            {/* Drop-off alert */}
            <div style={{
              marginTop: 16,
              padding: '10px 14px',
              background: isDarkMode ? '#3d2a1a' : '#fef3c7',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <span style={{ fontSize: 13, color: isDarkMode ? accentYellow : '#92400e' }}>
                {analytics.dropOffAlert}
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Analytics */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{
            fontSize: 14,
            fontWeight: 600,
            color: textSecondary,
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            💰 REVENUE ANALYTICS
          </h2>

          <div style={{
            background: bgCard,
            borderRadius: 12,
            border: `1px solid ${borderColor}`,
            padding: 20
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: textSecondary }}>Total Revenue:</span>
                <span style={{ color: textPrimary, fontWeight: 600, fontSize: 18 }}>
                  ${analytics.revenue.total.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: accentGreen }}>Your Earnings (15%):</span>
                <span style={{ color: accentGreen, fontWeight: 500 }}>
                  ${analytics.revenue.creatorEarnings.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: textSecondary }}>S-T Payouts (70%):</span>
                <span style={{ color: textPrimary }}>
                  ${analytics.revenue.stPayouts.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: textSecondary }}>Platform Fee (15%):</span>
                <span style={{ color: textPrimary }}>
                  ${analytics.revenue.platformFee.toLocaleString()}
                </span>
              </div>

              <div style={{
                borderTop: `1px solid ${borderColor}`,
                paddingTop: 12,
                marginTop: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 8
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: textSecondary }}>Average Revenue/Student:</span>
                  <span style={{ color: textPrimary }}>${analytics.revenue.avgPerStudent}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: textSecondary }}>Projected Monthly:</span>
                  <span style={{ color: textPrimary }}>
                    ${analytics.revenue.projectedMonthly.toLocaleString()} (at current pace)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flywheel Metrics */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{
            fontSize: 14,
            fontWeight: 600,
            color: textSecondary,
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            🔄 FLYWHEEL METRICS
          </h2>

          <div style={{
            background: bgCard,
            borderRadius: 12,
            border: `1px solid ${borderColor}`,
            padding: 20
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: textSecondary }}>Students → S-Teachers:</span>
                <span style={{ color: textPrimary }}>
                  {analytics.flywheel.studentsToST.count} of {analytics.flywheel.studentsToST.total} ({analytics.flywheel.studentsToST.percent}%)
                  <span style={{
                    marginLeft: 8,
                    fontSize: 11,
                    color: accentBlue,
                    background: isDarkMode ? '#1d3a5c' : '#dbeafe',
                    padding: '2px 6px',
                    borderRadius: 4
                  }}>
                    ← H4 Metric
                  </span>
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: textSecondary }}>Students recruited by S-T:</span>
                <span style={{ color: textPrimary }}>
                  {analytics.flywheel.recruitedByST}
                  <span style={{
                    marginLeft: 8,
                    fontSize: 11,
                    color: accentBlue,
                    background: isDarkMode ? '#1d3a5c' : '#dbeafe',
                    padding: '2px 6px',
                    borderRadius: 4
                  }}>
                    ← H6 Metric
                  </span>
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: textSecondary }}>Second-generation converts:</span>
                <span style={{ color: textPrimary }}>{analytics.flywheel.secondGenConverts}</span>
              </div>

              <div style={{
                borderTop: `1px solid ${borderColor}`,
                paddingTop: 12,
                marginTop: 4
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, color: textSecondary }}>Flywheel Status:</span>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 14,
                    color: accentGreen,
                    fontWeight: 500
                  }}>
                    🟢 {analytics.flywheel.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Certifications Tab
  const renderCertificationsTab = () => {
    const { certifications } = dashboardData;
    const accentRed = '#f91880';
    const accentYellow = '#ffd700';

    return (
      <div style={{ padding: 24, maxWidth: 1400 }}>
        {/* Header with Stats */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{
            fontSize: 24,
            fontWeight: 700,
            color: textPrimary,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span style={{ fontSize: 28 }}>🎓</span> Certification Requests
          </h1>
          <p style={{
            fontSize: 15,
            color: textSecondary,
            margin: '8px 0 0 0'
          }}>
            {certifications.stats.pending} pending • {certifications.stats.approved} approved • {certifications.stats.declined} declined
          </p>
        </div>

        {/* Pending Approval Section */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{
            fontSize: 14,
            fontWeight: 600,
            color: accentRed,
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            🔴 PENDING APPROVAL ({certifications.pending.length})
          </h2>

          {certifications.pending.map((request, index) => {
            const isExpanded = expandedCertRequest === index;

            return (
              <div
                key={request.id}
                style={{
                  background: bgCard,
                  borderRadius: 12,
                  border: `1px solid ${borderColor}`,
                  marginBottom: 12,
                  overflow: 'hidden'
                }}
              >
                {isExpanded ? (
                  // Expanded View
                  <div style={{ padding: 20 }}>
                    {/* Student Info */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        marginBottom: 4
                      }}>
                        <span style={{ fontSize: 24 }}>👤</span>
                        <span style={{
                          fontSize: 18,
                          fontWeight: 600,
                          color: textPrimary
                        }}>
                          {request.student}
                        </span>
                      </div>
                      <div style={{ fontSize: 14, color: textSecondary, marginLeft: 34 }}>
                        Recommended by: {request.recommendedBy} ({request.recommendedByRole})
                      </div>
                      <div style={{ fontSize: 14, color: textSecondary, marginLeft: 34 }}>
                        Submitted: {request.submittedDate}
                      </div>
                    </div>

                    {/* Completion Details Box */}
                    <div style={{
                      background: isDarkMode ? '#0d0d0d' : '#f8fafc',
                      borderRadius: 8,
                      border: `1px solid ${borderColor}`,
                      padding: 16,
                      marginBottom: 16
                    }}>
                      <div style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: textSecondary,
                        marginBottom: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}>
                        📊 COMPLETION DETAILS
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: 14
                        }}>
                          <span style={{ color: textSecondary }}>Modules Completed:</span>
                          <span style={{ color: textPrimary, fontWeight: 500 }}>
                            {request.modulesCompleted}/{request.modulesTotal} ✓
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: 14
                        }}>
                          <span style={{ color: textSecondary }}>Sessions Attended:</span>
                          <span style={{ color: textPrimary, fontWeight: 500 }}>
                            {request.sessionsAttended}
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: 14
                        }}>
                          <span style={{ color: textSecondary }}>Time to Complete:</span>
                          <span style={{ color: textPrimary, fontWeight: 500 }}>
                            {request.timeToComplete}
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: 14
                        }}>
                          <span style={{ color: textSecondary }}>Average Rating:</span>
                          <span style={{ color: accentYellow, fontWeight: 500 }}>
                            ⭐ {request.averageRating}
                          </span>
                        </div>
                      </div>

                      {/* S-T Notes */}
                      <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${borderColor}` }}>
                        <div style={{ fontSize: 13, color: textSecondary, marginBottom: 6 }}>
                          S-T Notes:
                        </div>
                        <div style={{
                          fontSize: 14,
                          color: textPrimary,
                          fontStyle: 'italic',
                          lineHeight: 1.5
                        }}>
                          "{request.notes}"
                        </div>
                      </div>
                    </div>

                    {/* View Links */}
                    <div style={{
                      display: 'flex',
                      gap: 16,
                      marginBottom: 20
                    }}>
                      <span style={{
                        fontSize: 13,
                        color: accentBlue,
                        cursor: 'pointer',
                        fontWeight: 500
                      }}>
                        [View Full Progress]
                      </span>
                      <span style={{
                        fontSize: 13,
                        color: accentBlue,
                        cursor: 'pointer',
                        fontWeight: 500
                      }}>
                        [View Session History]
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                      display: 'flex',
                      gap: 12,
                      flexWrap: 'wrap'
                    }}>
                      <button style={{
                        padding: '10px 20px',
                        background: accentGreen,
                        border: 'none',
                        borderRadius: 8,
                        color: '#fff',
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}>
                        ✅ Approve Certification
                      </button>
                      <button style={{
                        padding: '10px 20px',
                        background: 'transparent',
                        border: `1px solid ${accentRed}`,
                        borderRadius: 8,
                        color: accentRed,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}>
                        ❌ Decline
                      </button>
                      <button style={{
                        padding: '10px 20px',
                        background: 'transparent',
                        border: `1px solid ${borderColor}`,
                        borderRadius: 8,
                        color: textPrimary,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}>
                        💬 Request Info
                      </button>
                    </div>
                  </div>
                ) : (
                  // Collapsed View
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      cursor: 'pointer'
                    }}
                    onClick={() => setExpandedCertRequest(index)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 20 }}>👤</span>
                      <div>
                        <span style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: textPrimary
                        }}>
                          {request.student}
                        </span>
                        <span style={{ color: textSecondary, margin: '0 8px' }}>│</span>
                        <span style={{ fontSize: 14, color: textSecondary }}>
                          {request.recommendedBy}
                        </span>
                        <span style={{ color: textSecondary, margin: '0 8px' }}>│</span>
                        <span style={{ fontSize: 14, color: textSecondary }}>
                          {request.submittedDate.replace('December ', 'Dec ').replace(', 2025', '')}
                        </span>
                        <span style={{ color: textSecondary, margin: '0 8px' }}>│</span>
                        <span style={{ fontSize: 14, color: textSecondary }}>
                          {request.modulesCompleted}/{request.modulesTotal} • {request.sessionsAttended} sessions
                        </span>
                      </div>
                    </div>
                    <span style={{
                      fontSize: 13,
                      color: accentBlue,
                      fontWeight: 500
                    }}>
                      [Review →]
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Recently Approved Section */}
        <div>
          <h2 style={{
            fontSize: 14,
            fontWeight: 600,
            color: accentGreen,
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            ✅ RECENTLY APPROVED
          </h2>

          <div style={{
            background: bgCard,
            borderRadius: 12,
            border: `1px solid ${borderColor}`,
            overflow: 'hidden'
          }}>
            {certifications.approved.map((item, index) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 20px',
                  borderBottom: index < certifications.approved.length - 1 ? `1px solid ${borderColor}` : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 15, fontWeight: 500, color: textPrimary }}>
                    {item.student}
                  </span>
                  <span style={{ color: textSecondary, margin: '0 4px' }}>│</span>
                  <span style={{ fontSize: 14, color: textSecondary }}>
                    Approved {item.approvedDate}
                  </span>
                </div>
                <span style={{
                  fontSize: 13,
                  color: accentBlue,
                  cursor: 'pointer',
                  fontWeight: 500
                }}>
                  [View Certificate]
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render Students (Student-Teacher Management) Tab
  const renderStudentsTab = () => {
    const { studentTeachers } = dashboardData;
    const accentRed = '#f91880';
    const accentYellow = '#ffd700';

    return (
      <div style={{ padding: 24, maxWidth: 1400 }}>
        {/* Header with Stats */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{
            fontSize: 24,
            fontWeight: 700,
            color: textPrimary,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span style={{ fontSize: 28 }}>👩‍🏫</span> Student-Teacher Management
          </h1>
          <p style={{
            fontSize: 15,
            color: textSecondary,
            margin: '8px 0 0 0'
          }}>
            {studentTeachers.stats.active} active • {studentTeachers.stats.pendingApplications} application pending
          </p>
        </div>

        {/* Pending Applications Section */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{
            fontSize: 14,
            fontWeight: 600,
            color: accentRed,
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            🔴 PENDING APPLICATIONS ({studentTeachers.pendingApplications.length})
          </h2>

          {studentTeachers.pendingApplications.map((app) => (
            <div
              key={app.id}
              style={{
                background: bgCard,
                borderRadius: 12,
                border: `1px solid ${borderColor}`,
                padding: 20,
                marginBottom: 12
              }}
            >
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 16
              }}>
                <span style={{ fontSize: 24 }}>👤</span>
                <span style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: textPrimary
                }}>
                  {app.name} wants to become a Student-Teacher
                </span>
              </div>

              {/* Application Details Box */}
              <div style={{
                background: isDarkMode ? '#0d0d0d' : '#f8fafc',
                borderRadius: 8,
                border: `1px solid ${borderColor}`,
                padding: 16,
                marginBottom: 16
              }}>
                <div style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: textSecondary,
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  📋 APPLICATION DETAILS
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: textSecondary }}>Applied:</span>
                    <span style={{ color: textPrimary }}>{app.appliedDate}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: textSecondary }}>Certified:</span>
                    <span style={{ color: textPrimary }}>{app.certifiedDate}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: textSecondary }}>Course Completion:</span>
                    <span style={{ color: textPrimary }}>{app.courseCompletion}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: textSecondary }}>Sessions as Student:</span>
                    <span style={{ color: textPrimary }}>{app.sessionsAsStudent}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: textSecondary }}>Final Assessment:</span>
                    <span style={{ color: accentYellow }}>⭐ {app.finalAssessment}</span>
                  </div>
                </div>

                {/* Taught by & Recommendation */}
                <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${borderColor}` }}>
                  <div style={{ fontSize: 14, color: textSecondary, marginBottom: 6 }}>
                    Taught by: <span style={{ color: textPrimary }}>{app.taughtBy}</span>
                  </div>
                  <div style={{ fontSize: 13, color: textSecondary, marginBottom: 4 }}>
                    {app.taughtBy.split(' ')[0]}'s Recommendation:
                  </div>
                  <div style={{
                    fontSize: 14,
                    color: textPrimary,
                    fontStyle: 'italic',
                    lineHeight: 1.5,
                    marginBottom: 12
                  }}>
                    "{app.recommendation}"
                  </div>

                  <div style={{ fontSize: 13, color: textSecondary, marginBottom: 4 }}>
                    {app.name.split(' ')[0]}'s Statement:
                  </div>
                  <div style={{
                    fontSize: 14,
                    color: textPrimary,
                    fontStyle: 'italic',
                    lineHeight: 1.5,
                    marginBottom: 12
                  }}>
                    "{app.statement}"
                  </div>

                  <div style={{ fontSize: 14, color: textSecondary }}>
                    Availability: <span style={{ color: textPrimary }}>{app.availability}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap'
              }}>
                <button style={{
                  padding: '10px 20px',
                  background: accentGreen,
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  ✅ Approve as Student-Teacher
                </button>
                <button style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: `1px solid ${accentRed}`,
                  borderRadius: 8,
                  color: accentRed,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  ❌ Decline
                </button>
                <button style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: `1px solid ${borderColor}`,
                  borderRadius: 8,
                  color: textPrimary,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  💬 Request Interview
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Active Student-Teachers Section */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{
            fontSize: 14,
            fontWeight: 600,
            color: accentGreen,
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            ✅ ACTIVE STUDENT-TEACHERS ({studentTeachers.active.length})
          </h2>

          <div style={{
            background: bgCard,
            borderRadius: 12,
            border: `1px solid ${borderColor}`,
            overflow: 'hidden'
          }}>
            {studentTeachers.active.map((st, index) => {
              const isExpanded = index < 2; // First 2 are expanded
              const statusColor = st.status === 'active' ? accentGreen : accentYellow;
              const statusIcon = st.status === 'active' ? '🟢' : '🟡';
              const statusLabel = st.status === 'active' ? 'Active' : 'Paused';

              return (
                <div
                  key={st.id}
                  style={{
                    borderBottom: index < studentTeachers.active.length - 1 ? `1px solid ${borderColor}` : 'none'
                  }}
                >
                  {isExpanded ? (
                    // Expanded View
                    <div style={{ padding: 20 }}>
                      {/* Header row */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 12
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 24 }}>👤</span>
                          <span style={{ fontSize: 18, fontWeight: 600, color: textPrimary }}>
                            {st.name}
                          </span>
                        </div>
                        <span style={{ fontSize: 14, color: accentYellow }}>
                          ⭐ {st.rating} rating
                        </span>
                      </div>

                      {/* Divider */}
                      <div style={{
                        height: 1,
                        background: borderColor,
                        marginBottom: 12
                      }} />

                      {/* Details */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px 24px',
                        marginBottom: 16
                      }}>
                        <div style={{ fontSize: 14 }}>
                          <span style={{ color: textSecondary }}>Status: </span>
                          <span style={{ color: statusColor }}>{statusIcon} {statusLabel}</span>
                        </div>
                        <div style={{ fontSize: 14 }}>
                          <span style={{ color: textSecondary }}>Students Currently: </span>
                          <span style={{ color: textPrimary }}>{st.studentsCurrent}</span>
                        </div>
                        <div style={{ fontSize: 14 }}>
                          <span style={{ color: textSecondary }}>Total Students Taught: </span>
                          <span style={{ color: textPrimary }}>{st.studentsTotal}</span>
                        </div>
                        <div style={{ fontSize: 14 }}>
                          <span style={{ color: textSecondary }}>Sessions This Week: </span>
                          <span style={{ color: textPrimary }}>{st.sessionsThisWeek}</span>
                        </div>
                        <div style={{ fontSize: 14 }}>
                          <span style={{ color: textSecondary }}>Earnings (All Time): </span>
                          <span style={{ color: textPrimary }}>${st.earnings.toLocaleString()}</span>
                        </div>
                        <div style={{ fontSize: 14 }}>
                          <span style={{ color: textSecondary }}>Member Since: </span>
                          <span style={{ color: textPrimary }}>{st.memberSince}</span>
                        </div>
                      </div>

                      {/* Action Links */}
                      <div style={{
                        display: 'flex',
                        gap: 12,
                        flexWrap: 'wrap'
                      }}>
                        {['View Profile', 'View Students', 'Message', 'Pause', 'Remove'].map((action) => (
                          <span
                            key={action}
                            style={{
                              fontSize: 13,
                              color: action === 'Remove' ? accentRed : accentBlue,
                              cursor: 'pointer',
                              fontWeight: 500
                            }}
                          >
                            [{action}]
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Collapsed View
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 20px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 18 }}>👤</span>
                        <span style={{ fontSize: 15, fontWeight: 500, color: textPrimary }}>
                          {st.name}
                        </span>
                        <span style={{ color: textSecondary }}>│</span>
                        <span style={{ fontSize: 14, color: statusColor }}>
                          {statusIcon} {statusLabel}
                        </span>
                        <span style={{ color: textSecondary }}>│</span>
                        <span style={{ fontSize: 14, color: textSecondary }}>
                          {st.studentsCurrent} students
                        </span>
                        <span style={{ color: textSecondary }}>│</span>
                        <span style={{ fontSize: 14, color: accentYellow }}>
                          ⭐{st.rating}
                        </span>
                      </div>
                      <span style={{
                        fontSize: 13,
                        color: accentBlue,
                        cursor: 'pointer',
                        fontWeight: 500
                      }}>
                        [View]
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Student-Teacher Performance Section */}
        <div>
          <h2 style={{
            fontSize: 14,
            fontWeight: 600,
            color: textSecondary,
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            📊 STUDENT-TEACHER PERFORMANCE
          </h2>

          <div style={{
            background: bgCard,
            borderRadius: 12,
            border: `1px solid ${borderColor}`,
            overflow: 'hidden'
          }}>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 80px 100px 100px 100px',
              padding: '12px 20px',
              borderBottom: `1px solid ${borderColor}`,
              background: bgSecondary
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: textSecondary }}>S-Teacher</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: textSecondary, textAlign: 'center' }}>Students</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: textSecondary, textAlign: 'center' }}>Completion</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: textSecondary, textAlign: 'center' }}>Avg Rating</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: textSecondary, textAlign: 'right' }}>Earnings</div>
            </div>

            {/* Table Rows */}
            {studentTeachers.performance.map((row, index) => (
              <div
                key={row.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 80px 100px 100px 100px',
                  padding: '12px 20px',
                  borderBottom: index < studentTeachers.performance.length - 1 ? `1px solid ${borderColor}` : 'none',
                  alignItems: 'center'
                }}
              >
                <div style={{ fontSize: 14, color: textPrimary }}>{row.name}</div>
                <div style={{ fontSize: 14, color: textPrimary, textAlign: 'center' }}>{row.students}</div>
                <div style={{ fontSize: 14, color: textPrimary, textAlign: 'center' }}>{row.completion}%</div>
                <div style={{ fontSize: 14, color: accentYellow, textAlign: 'center' }}>⭐ {row.rating}</div>
                <div style={{ fontSize: 14, color: textPrimary, textAlign: 'right' }}>${row.earnings.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      background: bgPrimary,
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Top Navigation Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: 56,
        borderBottom: `1px solid ${borderColor}`,
        background: bgSecondary,
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* Logo with Back Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onMenuChange && (
            <button
              onClick={() => onMenuChange('My Community')}
              style={{
                padding: '6px 12px',
                background: isDarkMode ? '#2f3336' : '#e2e8f0',
                border: 'none',
                borderRadius: 6,
                color: textSecondary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                fontWeight: 500
              }}
            >
              <FaChevronLeft style={{ fontSize: 10 }} />
              Back
            </button>
          )}
          <div style={{
            fontSize: 24,
            fontWeight: 700,
            color: accentBlue
          }}>
            ∞
          </div>
        </div>

        {/* Navigation Tabs with Arrows */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          marginLeft: 16,
          gap: 4
        }}>
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scrollNav('left')}
              style={{
                padding: '6px 8px',
                background: isDarkMode ? '#2f3336' : '#e2e8f0',
                border: 'none',
                borderRadius: 6,
                color: textSecondary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <FaChevronLeft style={{ fontSize: 12 }} />
            </button>
          )}

          {/* Scrollable Tabs */}
          <div
            ref={navRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              flex: 1,
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {navTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => !isDragging && setActiveTab(tab.id)}
                style={{
                  padding: '6px 12px',
                  background: activeTab === tab.id ? (isDarkMode ? '#2f3336' : '#e2e8f0') : 'transparent',
                  border: 'none',
                  borderRadius: 6,
                  color: activeTab === tab.id ? accentBlue : textSecondary,
                  fontSize: 13,
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  cursor: isDragging ? 'grabbing' : 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => scrollNav('right')}
              style={{
                padding: '6px 8px',
                background: isDarkMode ? '#2f3336' : '#e2e8f0',
                border: 'none',
                borderRadius: 6,
                color: textSecondary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <FaChevronRight style={{ fontSize: 12 }} />
            </button>
          )}
        </div>

        {/* User Dropdown */}
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          background: 'transparent',
          border: `1px solid ${borderColor}`,
          borderRadius: 20,
          color: textPrimary,
          fontSize: 14,
          fontWeight: 500,
          cursor: 'pointer'
        }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: accentBlue,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700
          }}>
            {dashboardData.creatorInitials}
          </div>
          {dashboardData.creatorName}
          <FaChevronDown style={{ fontSize: 10, color: textSecondary }} />
        </button>
      </div>

      {/* Main Content - Switch based on active tab */}
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'analytics' && renderAnalyticsTab()}
      {activeTab === 'students' && renderStudentsTab()}
      {activeTab === 'certifications' && renderCertificationsTab()}
      {activeTab === 'payouts' && (
        <div style={{ padding: 24, maxWidth: 1400 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: textPrimary }}>
            Payouts
          </h1>
          <p style={{ color: textSecondary }}>Payout management coming soon...</p>
        </div>
      )}
      {activeTab === 'sessions' && (
        <div style={{ padding: 24, maxWidth: 1400 }}>
          <h1 style={{
            fontSize: 24,
            fontWeight: 700,
            color: textPrimary,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span style={{ fontSize: 28 }}>📅</span> Sessions Calendar
          </h1>
          <p style={{ color: textSecondary, marginTop: 8 }}>
            View and manage all scheduled sessions across your Student-Teachers.
          </p>
          <p style={{ color: textSecondary }}>Sessions calendar coming soon...</p>
        </div>
      )}
      {activeTab === 'content' && (
        <div style={{ padding: 24, maxWidth: 1400 }}>
          <h1 style={{
            fontSize: 24,
            fontWeight: 700,
            color: textPrimary,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span style={{ fontSize: 28 }}>📝</span> Course Content Editor
          </h1>
          <p style={{ color: textSecondary, marginTop: 8 }}>
            Edit modules, lessons, and course materials.
          </p>
          <p style={{ color: textSecondary }}>Course content editor coming soon...</p>
        </div>
      )}
      {activeTab === 'moderator' && (
        <div style={{ padding: 24, maxWidth: 1400 }}>
          <h1 style={{
            fontSize: 24,
            fontWeight: 700,
            color: textPrimary,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span style={{ fontSize: 28 }}>🛡️</span> Moderator
          </h1>
          <p style={{ color: textSecondary, marginTop: 8 }}>
            Community moderation, reports, and content review.
          </p>
          <p style={{ color: textSecondary }}>Moderator tools coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default CreatorDashboard;
