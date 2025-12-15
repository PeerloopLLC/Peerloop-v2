import React, { useState } from 'react';
// import { signIn, signUp, createProfile } from '../services/supabase'; // Disabled for demo mode
import './Login.css';

// Demo users for testing different user types
const demoUsers = [
  {
    id: 'demo_alex',
    name: 'Alex Sanders',
    username: '@alexsanders',
    email: 'alex@demo.com',
    roles: ['student', 'teacher'],
    userType: 'student_teacher',
    avatar: 'https://i.pravatar.cc/150?img=68',
    bio: 'Lifelong learner passionate about AI and machine learning.',
    location: 'San Francisco, CA',
    stats: { coursesCompleted: 12, coursesTeaching: 3, studentsHelped: 47, avgRating: 4.9, totalEarnings: 2340 }
  },
  {
    id: 'demo_jamie',
    name: 'Jamie Chen',
    username: '@jamiechen',
    email: 'jamie@demo.com',
    roles: ['creator', 'instructor'],
    userType: 'creator',
    avatar: 'https://i.pravatar.cc/150?img=47',
    bio: 'Full-stack developer and course creator with 10+ years experience.',
    location: 'New York, NY',
    stats: { coursesCompleted: 28, coursesTeaching: 8, studentsHelped: 234, avgRating: 4.95, totalEarnings: 12500 }
  },
  {
    id: 'demo_sarah',
    name: 'Sarah Miller',
    username: '@sarahmiller',
    email: 'sarah@demo.com',
    roles: ['student'],
    userType: 'student',
    avatar: 'https://i.pravatar.cc/150?img=44',
    bio: 'New to coding, excited to learn web development!',
    location: 'Austin, TX',
    stats: { coursesCompleted: 3, coursesTeaching: 0, studentsHelped: 0, avgRating: 0, totalEarnings: 0 }
  },
  {
    id: 'demo_marcus',
    name: 'Marcus Johnson',
    username: '@marcusj',
    email: 'marcus@demo.com',
    roles: ['creator', 'instructor', 'student', 'teacher'],
    userType: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=53',
    bio: 'Platform admin and senior instructor. Here to help!',
    location: 'Chicago, IL',
    stats: { coursesCompleted: 45, coursesTeaching: 15, studentsHelped: 890, avgRating: 4.98, totalEarnings: 45000 }
  }
];

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

  // Handle demo user login
  const handleDemoLogin = (demoUser) => {
    onDemoLogin(demoUser);
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
                <div className="demo-user-avatar">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="demo-user-info">
                  <div className="demo-user-name">{user.name}</div>
                  <div className="demo-user-type">
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
