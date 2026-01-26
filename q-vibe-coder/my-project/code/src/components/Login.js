import React, { useState } from 'react';
// import { signIn, signUp, createProfile } from '../services/supabase'; // Disabled for demo mode
import './Login.css';
import { getDemoUsers } from '../data/users';

// Get demo users from the unified user database
const demoUsers = getDemoUsers();

const Login = ({ onLoginSuccess, onDemoLogin }) => {
  const [showDemoUsers, setShowDemoUsers] = useState(true); // Default to demo mode
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showNewUserLogin, setShowNewUserLogin] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [newUserData, setNewUserData] = useState(null);
  const [selectedInterests, setSelectedInterests] = useState([]);

  // Available interests for onboarding
  const availableInterests = [
    { id: 'vibe-coding', label: 'Vibe Coding' },
    { id: 'ai-ml', label: 'AI & Machine Learning' },
    { id: 'web-dev', label: 'Web Development' },
    { id: 'python', label: 'Python' },
    { id: 'data-science', label: 'Data Science' },
    { id: 'mobile-dev', label: 'Mobile Development' },
    { id: 'design', label: 'UI/UX Design' },
    { id: 'blockchain', label: 'Blockchain' },
    { id: 'game-dev', label: 'Game Development' },
    { id: 'cloud', label: 'Cloud Computing' },
    { id: 'cybersecurity', label: 'Cybersecurity' },
    { id: 'no-code', label: 'No-Code Tools' },
  ];

  // Toggle interest selection
  const toggleInterest = (interestId) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  // Handle demo user login
  const handleDemoLogin = (demoUser) => {
    // Clear stored community so app defaults to The Commons on every login
    localStorage.removeItem('pendingCommunityCreator');
    localStorage.removeItem('activeCommunityMode');
    localStorage.removeItem('activeCreatorId');

    // Dispatch event to reset Sidebar to The Commons
    window.dispatchEvent(new CustomEvent('communitySelected', {
      detail: { id: 'town-hall', name: 'The Commons', type: 'hub' }
    }));

    // New User goes directly to app (skip login form and interest selection)
    if (demoUser.id === 'demo_new') {
      const newUser = {
        ...demoUser,
        followedCommunities: [],
        isNewUser: true,
        interests: []
      };
      onDemoLogin(newUser);
      return;
    }
    onDemoLogin(demoUser);
  };

  // Handle new user login form submission
  const handleNewUserLoginSubmit = (e) => {
    e.preventDefault();
    setShowNewUserLogin(false);
    setShowOnboarding(true);
  };

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    // Pass new user with selected interests
    const newUser = {
      ...newUserData,
      followedCommunities: [], // No courses followed by default
      isNewUser: true,
      interests: selectedInterests // Pass selected interests
    };
    onDemoLogin(newUser);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // For now, just show message that real auth is disabled
    setError('Real authentication is disabled. Please use Demo Mode.');
    setLoading(false);
    
    /* Uncomment when ready for real auth:
    try {
      if (isSignUp) {
        const { data, error: signUpError } = await signUp(email, password, {
          full_name: fullName,
          user_type: userType
        });

        if (signUpError) {
          setError(signUpError.message);
        } else if (data.user) {
          await createProfile({
            id: data.user.id,
            username: email.split('@')[0],
            full_name: fullName,
            user_type: userType,
            avatar_url: null,
            bio: ''
          });
          
          setMessage('Account created! Check your email to confirm, then sign in.');
          setIsSignUp(false);
        }
      } else {
        const { data, error: signInError } = await signIn(email, password);

        if (signInError) {
          setError(signInError.message);
        } else if (data.user) {
          onLoginSuccess(data.user);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    }
    */
  };

  // Onboarding page for new users
  if (showOnboarding) {
    return (
      <div className="login-container">
        <div className="login-card" style={{ maxWidth: 560 }}>
          <div className="login-header">
            <h1>🎓 PeerLoop</h1>
            <p>What do you want to learn?</p>
          </div>

          <div style={{ padding: '10px 0' }}>
            <p style={{ color: '#71767b', marginBottom: 16, textAlign: 'center' }}>
              Select topics you're interested in. You can change these later.
            </p>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              justifyContent: 'center',
              marginBottom: 24
            }}>
              {availableInterests.map(interest => {
                const isSelected = selectedInterests.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '20px',
                      border: isSelected ? '2px solid #1d9bf0' : '2px solid #333639',
                      background: isSelected ? 'rgba(29, 155, 240, 0.15)' : 'transparent',
                      color: isSelected ? '#1d9bf0' : '#e7e9ea',
                      fontSize: '14px',
                      fontWeight: isSelected ? '600' : '400',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'center',
                    }}
                  >
                    {interest.label}
                  </button>
                );
              })}
            </div>

            {selectedInterests.length > 0 && (
              <p style={{ color: '#71767b', fontSize: '14px', textAlign: 'center', marginBottom: 16 }}>
                {selectedInterests.length} topic{selectedInterests.length !== 1 ? 's' : ''} selected
              </p>
            )}

            <button
              onClick={handleOnboardingComplete}
              className="login-button"
              style={{
                marginTop: 10,
                opacity: selectedInterests.length > 0 ? 1 : 0.6
              }}
            >
              {selectedInterests.length > 0 ? 'Continue to PeerLoop →' : 'Skip for now →'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // New User Login Form
  if (showNewUserLogin) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>🎓 PeerLoop</h1>
            <p>Sign in to your account</p>
          </div>

          <form onSubmit={handleNewUserLoginSubmit} className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value="newuser@demo.com"
                readOnly
                style={{ background: '#16181c', color: '#e7e9ea' }}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value="password123"
                readOnly
                style={{ background: '#16181c', color: '#e7e9ea' }}
              />
            </div>

            <button
              type="submit"
              className="login-button"
            >
              Enter
            </button>
          </form>

          <div className="login-toggle">
            <p style={{ marginTop: '12px' }}>
              <button onClick={() => { setShowNewUserLogin(false); setShowDemoUsers(true); }}>← Back to Demo Mode</button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🎓 PeerLoop</h1>
          <p>{showDemoUsers ? 'Select a demo account' : (isSignUp ? 'Create your account' : 'Welcome back')}</p>
        </div>

        {error && <div className="login-error">{error}</div>}
        {message && <div className="login-message">{message}</div>}

        {/* Demo Mode - User Selection */}
        {showDemoUsers ? (
          <div className="demo-users">
            <p className="demo-subtitle">Choose a user to experience different roles:</p>
            
            {demoUsers.map((user) => (
              <div 
                key={user.id} 
                className="demo-user-card"
                onClick={() => handleDemoLogin(user)}
              >
                <div className="demo-user-avatar" style={{ background: user.avatar ? 'transparent' : (user.avatarColor || '#1d9bf0') }}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    user.name.split(' ').map(n => n[0]).join('')
                  )}
                </div>
                <div className="demo-user-info">
                  <div className="demo-user-name">{user.name}</div>
                  <div className="demo-user-type">
                    {user.userType === 'new_user' && '✨ New User'}
                    {user.userType === 'student' && '📚 Student'}
                    {user.userType === 'creator' && '🎬 Creator'}
                    {user.userType === 'student_teacher' && '📚🎓 Student & Teacher'}
                    {user.userType === 'admin' && '⭐ Admin'}
                  </div>
                  <div className="demo-user-bio">{user.bio}</div>
                </div>
                <div className="demo-user-arrow">→</div>
              </div>
            ))}

            <div className="login-toggle">
              <p>
                Have a real account?{' '}
                <button onClick={() => setShowDemoUsers(false)}>Sign In</button>
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Real Login Form */}
            <form onSubmit={handleSubmit} className="login-form">
              {isSignUp && (
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required={isSignUp}
                  />
                </div>
              )}

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>

              {isSignUp && (
                <div className="form-group">
                  <label>I am a...</label>
                  <select 
                    value={userType} 
                    onChange={(e) => setUserType(e.target.value)}
                  >
                    <option value="student">Student (I want to learn)</option>
                    <option value="creator">Creator (I want to teach)</option>
                    <option value="student_teacher">Both (Learn & Teach)</option>
                  </select>
                </div>
              )}

              <button 
                type="submit" 
                className="login-button"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>
            </form>

            <div className="login-toggle">
              {isSignUp ? (
                <p>
                  Already have an account?{' '}
                  <button onClick={() => setIsSignUp(false)}>Sign In</button>
                </p>
              ) : (
                <p>
                  Don't have an account?{' '}
                  <button onClick={() => setIsSignUp(true)}>Sign Up</button>
                </p>
              )}
              <p style={{ marginTop: '12px' }}>
                <button onClick={() => setShowDemoUsers(true)}>← Back to Demo Mode</button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
