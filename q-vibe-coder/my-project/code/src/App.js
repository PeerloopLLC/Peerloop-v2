import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import Sidebar from './components/Sidebar';
import CreatorSidebar from './components/CreatorSidebar';
import MainContent from './components/MainContent';
import BottomNav from './components/BottomNav';
import ErrorBoundary from './components/ErrorBoundary';
import useDeviceDetect from './hooks/useDeviceDetect';
import Login from './components/Login';
import { supabase, getProfile } from './services/supabase';

/**
 * Main Application Component
 * 
 * This is the root component that manages the overall application state and layout.
 * It handles user switching, menu state management, and renders the main layout
 * consisting of a sidebar and main content area.
 */
function App() {
  // Device detection hook
  const device = useDeviceDetect();

  // Authentication state
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user);
      }
      setAuthLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          loadUserProfile(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Load user profile from database
  const loadUserProfile = async (user) => {
    const { data: profile } = await getProfile(user.id);
    if (profile) {
      setCurrentUser({
        id: user.id,
        name: profile.full_name || user.email,
        username: '@' + (profile.username || user.email.split('@')[0]),
        roles: profile.user_type === 'creator' ? ['creator', 'instructor'] : 
               profile.user_type === 'student_teacher' ? ['student', 'teacher'] : 
               ['student'],
        avatar: profile.avatar_url,
        bio: profile.bio || '',
        userType: profile.user_type
      });
    }
  };

  // Handle successful login (real auth)
  const handleLoginSuccess = (user) => {
    loadUserProfile(user);
  };

  // Handle demo login (skip auth, use mock user)
  const handleDemoLogin = (demoUser) => {
    setCurrentUser({
      id: demoUser.id,
      name: demoUser.name,
      username: demoUser.username,
      roles: demoUser.roles,
      avatar: demoUser.avatar,
      bio: demoUser.bio,
      userType: demoUser.userType,
      location: demoUser.location,
      stats: demoUser.stats,
      isDemo: true // Flag to know this is a demo user
    });
    // Set a fake session to bypass login screen
    setSession({ user: { id: demoUser.id, email: demoUser.email }, isDemo: true });
  };

  // Handle logout / switch user
  const handleLogout = async () => {
    if (session?.isDemo) {
      // Demo mode - just clear session
      setSession(null);
      setCurrentUser(userA); // Reset to default
    } else {
      // Real auth - sign out from Supabase
      await supabase.auth.signOut();
      setSession(null);
    }
  };

  // Global state for tracking which menu item is currently active
  // This determines what content is displayed in the main area
  const [activeMenu, setActiveMenu] = useState('My Community');
  
  // State for tracking if we're in creator mode
  const [isCreatorMode, setIsCreatorMode] = useState(false);

  // Dark mode state - persisted in localStorage (dark mode is default)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Apply dark mode class to body and persist preference
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Debug mode - set to true to show device info overlay
  const [showDeviceDebug, setShowDeviceDebug] = useState(false);

  // Apply device classes to body for CSS targeting
  useEffect(() => {
    const body = document.body;
    
    // Clear previous device classes
    body.classList.remove('is-mobile', 'is-tablet', 'is-desktop', 'is-touch', 
      'is-ios', 'is-android', 'is-safari', 'is-chrome', 'is-standalone',
      'is-portrait', 'is-landscape');
    
    // Add current device classes
    if (device.isMobile) body.classList.add('is-mobile');
    if (device.isTablet) body.classList.add('is-tablet');
    if (device.isDesktop) body.classList.add('is-desktop');
    if (device.isTouchDevice) body.classList.add('is-touch');
    if (device.isIOS) body.classList.add('is-ios');
    if (device.isAndroid) body.classList.add('is-android');
    if (device.isSafari) body.classList.add('is-safari');
    if (device.isChrome) body.classList.add('is-chrome');
    if (device.isStandalone) body.classList.add('is-standalone');
    if (device.isPortrait) body.classList.add('is-portrait');
    if (device.isLandscape) body.classList.add('is-landscape');

    // Log device info for debugging
    console.log('📱 Device detected:', device.deviceType, device.os, device.browser, device.screenWidth + 'x' + device.screenHeight);
  }, [device]);

  // Toggle dark mode
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Define two different user profiles for demonstration purposes
  // Each user has different roles and permissions
  const userA = {
    id: 1,
    name: 'Alex Sanders',
    username: '@alexsanders',
    roles: ['student', 'teacher'], // Alex can both learn and teach
    avatar: null, // Will use initials AS
    bio: 'Lifelong learner passionate about AI and machine learning. Currently studying Deep Learning and teaching Python basics to beginners. Love helping others on their learning journey!',
    location: 'San Francisco, CA',
    website: 'https://alexsanders.dev',
    joinedDate: 'March 2024',
    stats: {
      coursesCompleted: 12,
      coursesTeaching: 3,
      studentsHelped: 47,
      hoursLearned: 156,
      avgRating: 4.9,
      totalEarnings: 2340
    },
    expertise: ['Python', 'Machine Learning', 'Data Analysis', 'AI Fundamentals'],
    currentlyLearning: ['Deep Learning Fundamentals', 'Natural Language Processing'],
    achievements: [
      { id: 1, name: 'Quick Learner', description: 'Completed 10 courses', icon: '🎓' },
      { id: 2, name: 'Helpful Teacher', description: 'Helped 25+ students', icon: '🌟' },
      { id: 3, name: 'Rising Star', description: 'Top rated student-teacher', icon: '⭐' }
    ]
  };
  const userB = {
    id: 2,
    name: 'Jamie Chen',
    username: '@jamiechen',
    roles: ['creator', 'instructor', 'student', 'teacher'], // Jamie has all roles
    avatar: null,
    bio: 'Full-stack developer and course creator with 10+ years of experience. Passionate about making tech education accessible to everyone.',
    location: 'New York, NY',
    website: 'https://jamiechen.io',
    joinedDate: 'January 2024',
    stats: {
      coursesCompleted: 28,
      coursesTeaching: 8,
      studentsHelped: 234,
      hoursLearned: 412,
      avgRating: 4.95,
      totalEarnings: 12500
    },
    expertise: ['React', 'Node.js', 'TypeScript', 'System Design', 'AWS'],
    currentlyLearning: ['AI for Robotics', 'Medical AI'],
    achievements: [
      { id: 1, name: 'Course Creator', description: 'Published 5+ courses', icon: '📚' },
      { id: 2, name: 'Master Teacher', description: 'Helped 200+ students', icon: '🏆' },
      { id: 3, name: 'Top Earner', description: 'Earned $10,000+', icon: '💰' }
    ]
  };

  // State for tracking which user is currently active
  // This affects what content and features are available
  const [currentUser, setCurrentUser] = useState(userA);

  /**
   * Handles menu changes from the sidebar
   * @param {string} menuName - The name of the menu item that was clicked
   */
  const handleMenuChange = (menuName) => {
    if (menuName === 'CreatorProfile') {
      setActiveMenu(menuName);
      setIsCreatorMode(false);
    } else if (menuName === 'CreatorMode') {
      setActiveMenu('create-course');
      setIsCreatorMode(true);
    } else {
      setActiveMenu(menuName);
      setIsCreatorMode(false);
    }
  };

  /**
   * Handles switching back to main app from creator mode
   */
  const handleBackToMain = () => {
    setIsCreatorMode(false);
    setActiveMenu('Browse');
  };

  /**
   * Toggles between the two predefined users
   * This is used for demonstration purposes to show different user experiences
   */
  const toggleUser = () => {
    setCurrentUser(currentUser.id === userA.id ? userB : userA);
  };

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '20px'
      }}>
        Loading...
      </div>
    );
  }

  // Show login if not authenticated
  if (!session) {
    return <Login onLoginSuccess={handleLoginSuccess} onDemoLogin={handleDemoLogin} />;
  }

  return (
    <ErrorBoundary>
      <div className={`app ${isDarkMode ? 'dark-mode' : ''} ${device.deviceType}`}>
        {/* Left Sidebar - Navigation and user profile */}
        {isCreatorMode ? (
          <CreatorSidebar 
            onMenuChange={handleMenuChange} 
            activeMenu={activeMenu} 
            currentUser={currentUser}
            onBackToMain={handleBackToMain}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            device={device}
          />
        ) : (
          <Sidebar 
            onMenuChange={handleMenuChange} 
            activeMenu={activeMenu} 
            currentUser={currentUser}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            device={device}
            onLogout={handleLogout}
          />
        )}
        
        {/* Main Content Area - Displays different content based on active menu */}
        <MainContent 
          activeMenu={activeMenu} 
          currentUser={currentUser} 
          onSwitchUser={toggleUser}
          onMenuChange={handleMenuChange}
          isDarkMode={isDarkMode}
          device={device}
        />

        {/* Bottom Navigation - Mobile Only */}
        <BottomNav
          onMenuChange={handleMenuChange}
          activeMenu={activeMenu}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          onLogout={handleLogout}
        />

        {/* Device Debug Overlay - Click the badge to expand */}
        <div 
          className="device-debug-badge"
          onClick={() => setShowDeviceDebug(!showDeviceDebug)}
          style={{
            position: 'fixed',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
            background: device.isIOS ? '#007AFF' : device.isAndroid ? '#3DDC84' : '#6B7280',
            color: 'white',
            padding: showDeviceDebug ? '12px' : '6px 10px',
            borderRadius: '8px',
            fontSize: '11px',
            fontFamily: 'monospace',
            zIndex: 9999,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            maxWidth: showDeviceDebug ? '200px' : 'auto',
          }}
        >
          {showDeviceDebug ? (
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>📱 Device Info</div>
              <div>Type: {device.deviceType}</div>
              <div>OS: {device.os}</div>
              <div>Browser: {device.browser}</div>
              <div>Screen: {device.screenWidth}×{device.screenHeight}</div>
              <div>Touch: {device.isTouchDevice ? 'Yes' : 'No'}</div>
              <div>PWA: {device.isStandalone ? 'Yes' : 'No'}</div>
              <div style={{ marginTop: '8px', opacity: 0.7 }}>Tap to close</div>
            </div>
          ) : (
            <span>📱 {device.deviceType}</span>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

App.propTypes = {
  // No props for App component
};

export default App; 