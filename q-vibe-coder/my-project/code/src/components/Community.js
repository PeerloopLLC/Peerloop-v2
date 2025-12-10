import React, { useState, useEffect, useRef } from 'react';
import './Community.css';
import { FaUsers, FaStar, FaClock, FaPlay, FaBook, FaGraduationCap, FaHome, FaChevronLeft, FaChevronRight, FaHeart, FaComment, FaRetweet, FaBookmark, FaShare, FaChevronDown, FaInfoCircle } from 'react-icons/fa';
import { getAllCourses, getInstructorById, getCourseById } from '../data/database';
import { createPost, getPosts, likePost } from '../services/posts';
import { initGetStream } from '../services/getstream';

const Community = ({ followedCommunities = [], setFollowedCommunities = null, isDarkMode = false, currentUser = null, onMenuChange = null, onViewUserProfile = null, onViewCourse = null }) => {
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [activeTab, setActiveTab] = useState('Home'); // 'Home' or community id
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const tabsContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [openCreatorDropdown, setOpenCreatorDropdown] = useState(null); // Track which creator dropdown is open
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, useRight: false }); // Track dropdown position
  const [selectedCourseFilters, setSelectedCourseFilters] = useState([]); // Filter to specific courses within creator (multi-select)
  const [newPostText, setNewPostText] = useState(''); // Text for new post
  const [isComposerFocused, setIsComposerFocused] = useState(false); // Track if composer is focused
  const [postAudience, setPostAudience] = useState('everyone'); // 'everyone' or creator id
  const [showAudienceDropdown, setShowAudienceDropdown] = useState(false); // Track audience dropdown visibility
  const [showInfoTooltip, setShowInfoTooltip] = useState(null); // Track which info tooltip is visible
  const [realPosts, setRealPosts] = useState([]); // Posts from Supabase
  const [isPosting, setIsPosting] = useState(false); // Loading state for posting
  const [postError, setPostError] = useState(null); // Error state for posting

  // Initialize GetStream and load posts on mount
  useEffect(() => {
    const init = async () => {
      // Initialize GetStream for current user
      if (currentUser?.id) {
        await initGetStream(currentUser.id);
      }
      // Load posts from Supabase
      const result = await getPosts();
      if (result.success) {
        setRealPosts(result.posts);
      }
    };
    init();
  }, [currentUser?.id]);

  // Handle posting a new message
  const handleSubmitPost = async () => {
    if (!newPostText.trim() || isPosting) return;
    
    setIsPosting(true);
    setPostError(null);
    
    const result = await createPost(
      currentUser?.id || 'anonymous',
      currentUser?.name || 'Anonymous User',
      newPostText.trim(),
      postAudience
    );
    
    if (result.success) {
      // Add new post to the top of the list
      setRealPosts(prev => [result.post, ...prev]);
      setNewPostText('');
      setIsComposerFocused(false);
      console.log('✅ Post created successfully!');
    } else {
      setPostError(result.error || 'Failed to create post');
      console.error('❌ Post failed:', result.error);
    }
    
    setIsPosting(false);
  };
  
  // Get user initials from currentUser name
  const getUserInitials = () => {
    if (!currentUser?.name) return 'AS';
    return currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Format timestamp for display
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'just now';
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return new Date(timestamp).toLocaleDateString();
  };
  
  // Handle clicking on user avatar to go to profile
  const handleAvatarClick = () => {
    if (onMenuChange) {
      onMenuChange('Profile');
    }
  };
  
  // Use props directly - the parent (MainContent) manages the state and localStorage
  // This ensures consistency between Browse follows and Community display
  const actualFollowedCommunities = followedCommunities;
  const actualSetFollowedCommunities = setFollowedCommunities || (() => {});
  
  // Debug: log if setFollowedCommunities is available
  console.log('Community: setFollowedCommunities is:', typeof setFollowedCommunities);

  // Group followed communities by creator - always show creator tabs, not individual courses
  const groupedByCreator = React.useMemo(() => {
    const creatorMap = new Map();
    
    actualFollowedCommunities.forEach(community => {
      let creatorId, creatorName, courseIds;
      
      if (community.type === 'creator') {
        // Already a creator follow
        creatorId = community.id;
        creatorName = community.name;
        courseIds = community.courseIds || [];
      } else {
        // Individual course follow - get the creator
        const courseId = community.courseId || parseInt(community.id.replace('course-', ''));
        const course = getCourseById(courseId);
        if (!course) return;
        
        const instructor = getInstructorById(course.instructorId);
        if (!instructor) return;
        
        creatorId = `creator-${course.instructorId}`;
        creatorName = instructor.name;
        courseIds = [courseId];
      }
      
      // Merge into existing creator entry or create new one
      if (creatorMap.has(creatorId)) {
        const existing = creatorMap.get(creatorId);
        // Merge course IDs, avoiding duplicates
        const mergedCourseIds = [...new Set([...existing.followedCourseIds, ...courseIds])];
        existing.followedCourseIds = mergedCourseIds;
      } else {
        // Get all courses for this creator
        const instructorId = parseInt(creatorId.replace('creator-', ''));
        const instructor = getInstructorById(instructorId);
        const allCreatorCourses = getAllCourses().filter(c => c.instructorId === instructorId);
        
        creatorMap.set(creatorId, {
          id: creatorId,
          name: creatorName,
          instructorId: instructorId,
          allCourses: allCreatorCourses,
          followedCourseIds: courseIds,
          isFullCreatorFollow: community.type === 'creator'
        });
      }
    });
    
    return Array.from(creatorMap.values());
  }, [actualFollowedCommunities]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openCreatorDropdown && 
          !event.target.closest('.community-tab-wrapper') && 
          !event.target.closest('.community-tab-dropdown')) {
        setOpenCreatorDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openCreatorDropdown]);

  // Dynamically generate availableCommunities from all courses
  const allCourses = getAllCourses();
  const availableCommunities = allCourses.map(course => {
    const instructor = getInstructorById(course.instructorId);
    if (!instructor) return null;
    
    // Generate community data dynamically based on course and instructor
    const communityColors = [
      '#4ECDC4', '#00D2FF', '#FF9900', '#FF6B6B', '#9B59B6', 
      '#FFD93D', '#00B894', '#6C5CE7', '#FF7675', '#74B9FF',
      '#636e72', '#0984e3', '#e17055', '#fdcb6e'
    ];
    
    const colorIndex = (course.id - 1) % communityColors.length;
    const color = communityColors[colorIndex];
    
    // Generate topic image based on course category
    const topicImage = `https://via.placeholder.com/400x200${color.replace('#', '')}/ffffff?text=${course.category.replace(/\s+/g, '')}`;
    
    // Generate instructor avatar
    const instructorAvatar = `https://via.placeholder.com/48x48${color.replace('#', '')}/ffffff?text=${instructor.name.split(' ').map(n => n[0]).join('')}`;
    
    // Calculate community stats based on course data
    const members = Math.floor(course.students * 0.8); // 80% of students are community members
    const posts = Math.floor(members * 0.3); // 30% of members have posted
    const lastActivity = '2 hours ago'; // Default activity time
    
    return {
      id: course.id, // Use course ID as community ID
      name: `${course.title} Community`,
      topic: course.category,
      members: members,
      posts: posts,
      lastActivity: lastActivity,
      instructor: instructor.name,
      instructorAvatar: instructorAvatar,
      topicImage: topicImage,
      description: course.description,
      courseId: course.id,
      isCourseSpecific: true
    };
  }).filter(Boolean); // Remove any null entries

  // Mock data for fake posts from each community
  // Course IDs: 1=AI for PM, 2=Node.js, 3=AWS, 4=Deep Learning, 5=Computer Vision, 
  // 6=NLP, 7=Data Science, 8=BI Analytics, 9=Full-Stack, 10=DevOps, 
  // 11=Microservices, 12=Robotics, 13=Medical AI, 14=Python Bootcamp
  const fakePosts = [
    // Course 1: AI for Product Managers (Jane Doe)
    {
      id: 1,
      courseId: 1,
      author: 'ProductPioneer42',
      authorAvatar: 'https://via.placeholder.com/40x40/4ECDC4/ffffff?text=PP',
      authorHandle: '@ProductPioneer42',
      content: 'Just finished AI for Product Managers! Jane Doe\'s teaching style is incredible. Now I can actually talk to engineers about ML without sounding clueless 😂 #PeerLoop',
      timestamp: '2 hours ago',
      likes: 1200,
      replies: 48,
      community: 'AI for Product Managers'
    },
    {
      id: 2,
      courseId: 1,
      author: 'TechPM_Sarah',
      authorAvatar: 'https://via.placeholder.com/40x40/4ECDC4/ffffff?text=TS',
      authorHandle: '@TechPM_Sarah',
      content: 'Became a Student-Teacher for AI for Product Managers today! 🎉 Already have 2 students booked. The 70% commission is amazing. Thank you @JaneDoe!',
      timestamp: '5 hours ago',
      likes: 890,
      replies: 35,
      community: 'AI for Product Managers'
    },

    // Course 2: Node.js Backend Development (Albert Einstein)
    {
      id: 3,
      courseId: 2,
      author: 'BackendBoss99',
      authorAvatar: 'https://via.placeholder.com/40x40/00D2FF/ffffff?text=BB',
      authorHandle: '@BackendBoss99',
      content: 'Node.js Backend Development is 🔥! Built my first REST API in week 2. The 1-on-1 sessions with Student-Teachers make all the difference. #LearnTeachEarn',
      timestamp: '3 hours ago',
      likes: 1100,
      replies: 40,
      community: 'Node.js Backend Development'
    },
    {
      id: 4,
      courseId: 2,
      author: 'CodeNewbie_Mike',
      authorAvatar: 'https://via.placeholder.com/40x40/00D2FF/ffffff?text=CM',
      authorHandle: '@CodeNewbie_Mike',
      content: 'Shoutout to my Student-Teacher @BackendBoss99 for explaining Express middleware! Finally clicked after our session. PeerLoop\'s model is genius.',
      timestamp: '1 day ago',
      likes: 650,
      replies: 22,
      community: 'Node.js Backend Development'
    },

    // Course 3: Cloud Architecture with AWS (Albert Einstein)
    {
      id: 5,
      courseId: 3,
      author: 'CloudMaster_Pro',
      authorAvatar: 'https://via.placeholder.com/40x40/FF9900/ffffff?text=CP',
      authorHandle: '@CloudMaster_Pro',
      content: 'Passed my AWS certification after taking Cloud Architecture with AWS! The serverless module was exactly what I needed. Now teaching others and earning 70%! 💰',
      timestamp: '4 hours ago',
      likes: 980,
      replies: 38,
      community: 'Cloud Architecture with AWS'
    },
    {
      id: 6,
      courseId: 3,
      author: 'DevOpsNewbie',
      authorAvatar: 'https://via.placeholder.com/40x40/FF9900/ffffff?text=DN',
      authorHandle: '@DevOpsNewbie',
      content: 'Week 3 of Cloud Architecture with AWS. Lambda functions finally make sense! Booking my first 1-on-1 with a Student-Teacher tomorrow. Excited!',
      timestamp: '2 days ago',
      likes: 420,
      replies: 15,
      community: 'Cloud Architecture with AWS'
    },

    // Course 4: Deep Learning Fundamentals (Jane Doe)
    {
      id: 7,
      courseId: 4,
      author: 'NeuralNetNinja',
      authorAvatar: 'https://via.placeholder.com/40x40/FF6B6B/ffffff?text=NN',
      authorHandle: '@NeuralNetNinja',
      content: 'Deep Learning Fundamentals changed my career! Built a CNN from scratch in the capstone. The peer teaching model helped me understand backpropagation 10x faster.',
      timestamp: '6 hours ago',
      likes: 1350,
      replies: 52,
      community: 'Deep Learning Fundamentals'
    },
    {
      id: 8,
      courseId: 4,
      author: 'AIStudent_2024',
      authorAvatar: 'https://via.placeholder.com/40x40/FF6B6B/ffffff?text=AS',
      authorHandle: '@AIStudent_2024',
      content: 'Just certified as a Student-Teacher for Deep Learning Fundamentals! Jane Doe approved my application today. Ready to help others while earning. Win-win! 🚀',
      timestamp: '1 day ago',
      likes: 780,
      replies: 28,
      community: 'Deep Learning Fundamentals'
    },

    // Course 5: Computer Vision with Python (Jane Doe)
    {
      id: 9,
      courseId: 5,
      author: 'VisionCoder25',
      authorAvatar: 'https://via.placeholder.com/40x40/9B59B6/ffffff?text=VC',
      authorHandle: '@VisionCoder25',
      content: 'Computer Vision with Python is incredible! Detecting objects in real-time now. The community here is so supportive. Best learning investment ever!',
      timestamp: '2 hours ago',
      likes: 890,
      replies: 32,
      community: 'Computer Vision with Python'
    },
    {
      id: 10,
      courseId: 5,
      author: 'OpenCV_Fan',
      authorAvatar: 'https://via.placeholder.com/40x40/9B59B6/ffffff?text=OF',
      authorHandle: '@OpenCV_Fan',
      content: 'Completed my certification for Computer Vision with Python! Already earned back $210 from 1 teaching session. Bloom\'s 2 Sigma is real! #PeerLoop',
      timestamp: '8 hours ago',
      likes: 720,
      replies: 25,
      community: 'Computer Vision with Python'
    },

    // Course 6: Natural Language Processing (Jane Doe)
    {
      id: 11,
      courseId: 6,
      author: 'NLPMastermind',
      authorAvatar: 'https://via.placeholder.com/40x40/17bf63/ffffff?text=NM',
      authorHandle: '@NLPMastermind',
      content: 'Built a sentiment analysis tool after completing Natural Language Processing! Jane Doe\'s curriculum is perfectly structured. Now I\'m teaching others! 🎓',
      timestamp: '3 hours ago',
      likes: 1050,
      replies: 42,
      community: 'Natural Language Processing'
    },
    {
      id: 12,
      courseId: 6,
      author: 'TextMiner_Pro',
      authorAvatar: 'https://via.placeholder.com/40x40/17bf63/ffffff?text=TM',
      authorHandle: '@TextMiner_Pro',
      content: 'NLP course chatbot project was amazing! My Student-Teacher explained transformers so clearly. Earned my cert and joining the teaching pool next week!',
      timestamp: '1 day ago',
      likes: 680,
      replies: 24,
      community: 'Natural Language Processing'
    },

    // Course 7: Data Science Fundamentals (Prof. Maria Rodriguez)
    {
      id: 13,
      courseId: 7,
      author: 'DataDriven_Dan',
      authorAvatar: 'https://via.placeholder.com/40x40/794BC4/ffffff?text=DD',
      authorHandle: '@DataDriven_Dan',
      content: 'Data Science Fundamentals by Prof. Rodriguez is fantastic! Pandas and matplotlib finally make sense. Scheduled 3 peer sessions this week. #DataScience',
      timestamp: '4 hours ago',
      likes: 920,
      replies: 35,
      community: 'Data Science Fundamentals'
    },
    {
      id: 14,
      courseId: 7,
      author: 'AnalyticsAce',
      authorAvatar: 'https://via.placeholder.com/40x40/794BC4/ffffff?text=AA',
      authorHandle: '@AnalyticsAce',
      content: 'Became a certified Student-Teacher for Data Science Fundamentals! Made $350 in my first week teaching. PeerLoop\'s model is revolutionary! 💪',
      timestamp: '2 days ago',
      likes: 1180,
      replies: 48,
      community: 'Data Science Fundamentals'
    },

    // Course 8: Business Intelligence & Analytics (Prof. Maria Rodriguez)
    {
      id: 15,
      courseId: 8,
      author: 'BIDashboardPro',
      authorAvatar: 'https://via.placeholder.com/40x40/3498DB/ffffff?text=BP',
      authorHandle: '@BIDashboardPro',
      content: 'BI & Analytics course transformed how I present data! Built an executive dashboard that my boss loved. Worth every penny at $450!',
      timestamp: '5 hours ago',
      likes: 850,
      replies: 30,
      community: 'Business Intelligence & Analytics'
    },
    {
      id: 16,
      courseId: 8,
      author: 'TableauNewbie',
      authorAvatar: 'https://via.placeholder.com/40x40/3498DB/ffffff?text=TN',
      authorHandle: '@TableauNewbie',
      content: 'Just enrolled in Business Intelligence & Analytics. Prof. Rodriguez\'s intro video already cleared up so much! Can\'t wait for my first 1-on-1 session!',
      timestamp: '1 day ago',
      likes: 420,
      replies: 18,
      community: 'Business Intelligence & Analytics'
    },

    // Course 9: Full-Stack Web Development (James Wilson)
    {
      id: 17,
      courseId: 9,
      author: 'FullStackFiona',
      authorAvatar: 'https://via.placeholder.com/40x40/E74C3C/ffffff?text=FF',
      authorHandle: '@FullStackFiona',
      content: 'Full-Stack Web Development is the real deal! Deployed my first React + Node app today. James Wilson\'s course structure is perfect for beginners. 🌐',
      timestamp: '3 hours ago',
      likes: 1020,
      replies: 38,
      community: 'Full-Stack Web Development'
    },
    {
      id: 18,
      courseId: 9,
      author: 'WebDev_Journey',
      authorAvatar: 'https://via.placeholder.com/40x40/E74C3C/ffffff?text=WJ',
      authorHandle: '@WebDev_Journey',
      content: 'From zero to full-stack in 8 weeks! Now I\'m a certified Student-Teacher earning while helping others learn. PeerLoop changed my life! #LearnTeachEarn',
      timestamp: '6 hours ago',
      likes: 890,
      replies: 34,
      community: 'Full-Stack Web Development'
    },

    // Course 10: DevOps & CI/CD Mastery (James Wilson)
    {
      id: 19,
      courseId: 10,
      author: 'DevOpsDerek',
      authorAvatar: 'https://via.placeholder.com/40x40/4A90E2/ffffff?text=DD',
      authorHandle: '@DevOpsDerek',
      content: 'DevOps & CI/CD Mastery course is excellent! Set up my first Jenkins pipeline today. The Student-Teacher who helped me was incredibly patient. 🔧',
      timestamp: '4 hours ago',
      likes: 780,
      replies: 28,
      community: 'DevOps & CI/CD Mastery'
    },
    {
      id: 20,
      courseId: 10,
      author: 'Pipeline_Pro',
      authorAvatar: 'https://via.placeholder.com/40x40/4A90E2/ffffff?text=PP',
      authorHandle: '@Pipeline_Pro',
      content: 'Certified and now teaching DevOps & CI/CD Mastery! Already made back my course fee plus $200 extra. The flywheel effect is real! 🚀',
      timestamp: '2 days ago',
      likes: 650,
      replies: 22,
      community: 'DevOps & CI/CD Mastery'
    },

    // Course 11: Microservices Architecture (James Wilson)
    {
      id: 21,
      courseId: 11,
      author: 'MicroservicesMike',
      authorAvatar: 'https://via.placeholder.com/40x40/1ABC9C/ffffff?text=MM',
      authorHandle: '@MicroservicesMike',
      content: 'Microservices Architecture course helped me understand distributed systems finally! Docker + Kubernetes now make sense. Thanks to my amazing Student-Teacher!',
      timestamp: '5 hours ago',
      likes: 720,
      replies: 26,
      community: 'Microservices Architecture'
    },
    {
      id: 22,
      courseId: 11,
      author: 'ContainerKing',
      authorAvatar: 'https://via.placeholder.com/40x40/1ABC9C/ffffff?text=CK',
      authorHandle: '@ContainerKing',
      content: 'Week 4 of Microservices Architecture. Just built my first multi-container app! The community here is so helpful. Aiming for certification next month!',
      timestamp: '1 day ago',
      likes: 520,
      replies: 19,
      community: 'Microservices Architecture'
    },

    // Course 12: AI for Robotics Coding Lab (Dr. Priya Nair)
    {
      id: 23,
      courseId: 12,
      author: 'RoboticsGeek29',
      authorAvatar: 'https://via.placeholder.com/40x40/50C878/ffffff?text=RG',
      authorHandle: '@RoboticsGeek29',
      content: 'AI for Robotics Coding Lab is mind-blowing! Programmed my first path-planning algorithm. Dr. Nair\'s curriculum is cutting-edge! 🤖',
      timestamp: '3 hours ago',
      likes: 980,
      replies: 38,
      community: 'AI for Robotics Coding Lab'
    },
    {
      id: 24,
      courseId: 12,
      author: 'BotBuilder_Pro',
      authorAvatar: 'https://via.placeholder.com/40x40/50C878/ffffff?text=BB',
      authorHandle: '@BotBuilder_Pro',
      content: 'Just became a Student-Teacher for AI for Robotics! Teaching path planning algorithms and earning 70%. The protégé effect is real—I understand it better now! 🎓',
      timestamp: '8 hours ago',
      likes: 750,
      replies: 28,
      community: 'AI for Robotics Coding Lab'
    },

    // Course 13: AI for Medical Diagnostics Coding (Dr. Priya Nair)
    {
      id: 25,
      courseId: 13,
      author: 'MedTechInnovator',
      authorAvatar: 'https://via.placeholder.com/40x40/E74C3C/ffffff?text=MI',
      authorHandle: '@MedTechInnovator',
      content: 'AI for Medical Diagnostics Coding is transforming healthcare! Built a diagnostic model that actually works. Dr. Nair is an incredible teacher! 🏥',
      timestamp: '4 hours ago',
      likes: 1250,
      replies: 52,
      community: 'AI for Medical Diagnostics Coding'
    },
    {
      id: 26,
      courseId: 13,
      author: 'HealthAI_Student',
      authorAvatar: 'https://via.placeholder.com/40x40/E74C3C/ffffff?text=HS',
      authorHandle: '@HealthAI_Student',
      content: 'Completed my certification in AI for Medical Diagnostics! Already have 3 students lined up to teach. Making an impact AND earning income! #PeerLoop',
      timestamp: '1 day ago',
      likes: 920,
      replies: 38,
      community: 'AI for Medical Diagnostics Coding'
    },

    // Course 14: AI Coding Bootcamp: Python Projects (Prof. Elena Petrova)
    {
      id: 27,
      courseId: 14,
      author: 'PythonPro88',
      authorAvatar: 'https://via.placeholder.com/40x40/FFD93D/000000?text=PP',
      authorHandle: '@PythonPro88',
      content: 'AI Coding Bootcamp: Python Projects is exactly what I needed! Built 5 ML projects in 6 weeks. Prof. Petrova\'s teaching style is engaging! 🐍',
      timestamp: '2 hours ago',
      likes: 880,
      replies: 32,
      community: 'AI Coding Bootcamp: Python Projects'
    },
    {
      id: 28,
      courseId: 14,
      author: 'MLBeginner_2024',
      authorAvatar: 'https://via.placeholder.com/40x40/FFD93D/000000?text=MB',
      authorHandle: '@MLBeginner_2024',
      content: 'From Python newbie to AI developer in 8 weeks! Now I\'m teaching the bootcamp and earning 70% per session. Best investment I ever made! 💪',
      timestamp: '6 hours ago',
      likes: 720,
      replies: 26,
      community: 'AI Coding Bootcamp: Python Projects'
    }
  ];

  // Save followed communities to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('followedCommunities', JSON.stringify(actualFollowedCommunities));
    } catch (error) {
      console.error('Error saving followedCommunities to localStorage:', error);
      try {
        localStorage.setItem('followedCommunities', JSON.stringify([]));
      } catch (fallbackError) {
        console.error('Error saving fallback followedCommunities to localStorage:', fallbackError);
      }
    }
  }, [actualFollowedCommunities]);

  // Check scroll arrows visibility
  const checkScrollArrows = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollArrows();
    window.addEventListener('resize', checkScrollArrows);
    return () => window.removeEventListener('resize', checkScrollArrows);
  }, [actualFollowedCommunities]);

  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmount = 200;
      tabsContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollArrows, 300);
    }
  };

  const handleCommunityClick = (community) => {
    setSelectedCommunity(community);
  };

  const handleBackToCommunities = () => {
    setSelectedCommunity(null);
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    // Reset course filters when switching tabs
    if (tabId !== activeTab) {
      setSelectedCourseFilters([]);
      setOpenCreatorDropdown(null);
    }
    // Auto-set post audience to the selected creator (or 'everyone' for Home)
    if (tabId === 'Home') {
      setPostAudience('everyone');
    } else {
      // tabId is the creator id when clicking a creator tab
      setPostAudience(tabId);
    }
  };

  const handleFollowCommunity = (communityId) => {
    if (isFollowingLoading) return; // Prevent rapid clicking
    
    try {
      setIsFollowingLoading(true);
      
      // Validate communityId
      if (!communityId || typeof communityId !== 'number') {
        console.error('Invalid communityId:', communityId);
        return;
      }

      const community = availableCommunities.find(c => c.id === communityId);
      if (!community) {
        console.error('Community not found:', communityId);
        return;
      }

      const isAlreadyFollowed = actualFollowedCommunities.some(c => c.id === communityId);
      
      if (isAlreadyFollowed) {
        // Unfollow
        actualSetFollowedCommunities(prev => prev.filter(c => c.id !== communityId));
      } else {
        // Follow
        actualSetFollowedCommunities(prev => [...prev, community]);
      }
    } catch (error) {
      console.error('Error in handleFollowCommunity:', error);
    } finally {
      setIsFollowingLoading(false);
    }
  };

  const isCommunityFollowed = (communityId) => {
    return actualFollowedCommunities.some(c => c.id === communityId);
  };

  // Filter posts based on active tab - memoized for performance
  const displayedPosts = React.useMemo(() => {
    // Convert real posts from Supabase to display format FIRST
    const formattedRealPosts = realPosts.map(post => ({
      id: `real-${post.id}`,
      courseId: null,
      author: post.user_name,
      authorHandle: `@${post.user_name.toLowerCase().replace(/\s/g, '')}`,
      content: post.content,
      timestamp: formatTimeAgo(post.created_at),
      likes: post.likes || 0,
      replies: post.comments || 0,
      retweets: post.shares || 0,
      community: post.audience === 'everyone' ? 'Everyone' : post.audience,
      isRealPost: true,
      supabaseId: post.id
    }));

    let filteredFakePosts;
    
    // Get all followed course IDs from grouped creators
    const allFollowedCourseIds = groupedByCreator.flatMap(c => c.followedCourseIds);
    
    if (activeTab === 'Home') {
      // Home tab: Show all posts from followed courses
      filteredFakePosts = fakePosts.filter(post => allFollowedCourseIds.includes(post.courseId));
    } else {
      // Specific creator tab: Filter based on that creator's followed courses
      const activeCreator = groupedByCreator.find(c => c.id === activeTab);
      if (activeCreator) {
        if (selectedCourseFilters.length > 0) {
          // Filter to selected courses only
          filteredFakePosts = fakePosts.filter(post => selectedCourseFilters.includes(post.courseId));
        } else {
          // No filter selected - show all posts from this creator's followed courses
          filteredFakePosts = fakePosts.filter(post => 
            activeCreator.followedCourseIds.includes(post.courseId)
          );
        }
      } else {
        filteredFakePosts = [];
      }
    }
    
    // ALWAYS show real posts first, then filtered fake posts
    // Real posts appear regardless of followed communities
    const combinedPosts = [...formattedRealPosts, ...filteredFakePosts];
    
    // If on Home tab and no communities followed, still show real posts
    if (activeTab === 'Home' && combinedPosts.length === 0) {
      return formattedRealPosts;
    }
    
    // Sort: Real posts first (by time), then fake posts by engagement
    return combinedPosts.sort((a, b) => {
      // Real posts always come first
      if (a.isRealPost && !b.isRealPost) return -1;
      if (!a.isRealPost && b.isRealPost) return 1;
      
      // Among real posts, sort by most recent
      if (a.isRealPost && b.isRealPost) {
        return 0; // Keep original order (already sorted by created_at desc from Supabase)
      }
      
      // Among fake posts, sort by engagement
      const engagementA = a.likes + (a.replies * 10);
      const engagementB = b.likes + (b.replies * 10);
      const timeA = a.timestamp.includes('hour') ? parseInt(a.timestamp) : 
                    a.timestamp.includes('minute') ? 0.1 : 
                    a.timestamp.includes('day') ? parseInt(a.timestamp) * 24 : 100;
      const timeB = b.timestamp.includes('hour') ? parseInt(b.timestamp) : 
                    b.timestamp.includes('minute') ? 0.1 : 
                    b.timestamp.includes('day') ? parseInt(b.timestamp) * 24 : 100;
      // Combine engagement and recency (recent + high engagement first)
      return (engagementB / (timeB + 1)) - (engagementA / (timeA + 1));
    });
  }, [activeTab, groupedByCreator, selectedCourseFilters, realPosts]);

  if (selectedCommunity) {
    // Get posts for this community
    const communityPosts = fakePosts.filter(post => 
      post.courseId === selectedCommunity.courseId || post.communityId === selectedCommunity.id
    );

    return (
      <div style={{ background: '#f8fafc', minHeight: '100vh', padding: 0 }}>
        {/* Back Button */}
        <button 
          onClick={handleBackToCommunities}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '10px 16px',
            margin: '16px',
            cursor: 'pointer',
            fontWeight: 600,
            color: '#64748b'
          }}
        >
          ← Back to Communities
        </button>

        {/* Community Header Card */}
        <div style={{ background: '#fff', borderRadius: 16, margin: '0 16px 24px 16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          {/* Banner */}
          <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', height: 120 }} />
          
          {/* Content */}
          <div style={{ padding: '0 24px 24px 24px', marginTop: -40 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 16 }}>
              <div style={{ 
                width: 80, 
                height: 80, 
                borderRadius: 12, 
                background: '#fff',
                border: '4px solid #fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32
              }}>
                📚
              </div>
              <div style={{ flex: 1, paddingBottom: 8 }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#1e293b' }}>{selectedCommunity.name}</h1>
                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: 14 }}>{selectedCommunity.topic}</p>
              </div>
              <button 
                onClick={() => handleFollowCommunity(selectedCommunity.id)}
                style={{ 
                  background: isCommunityFollowed(selectedCommunity.id) ? '#e2e8f0' : '#3b82f6',
                  color: isCommunityFollowed(selectedCommunity.id) ? '#64748b' : '#fff',
                  border: 'none', 
                  padding: '10px 24px', 
                  borderRadius: 8, 
                  fontWeight: 600, 
                  fontSize: 14, 
                  cursor: 'pointer' 
                }}
              >
                {isCommunityFollowed(selectedCommunity.id) ? '✓ Joined' : 'Join Community'}
              </button>
            </div>

            {/* Description */}
            <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.6, margin: '0 0 16px 0' }}>
              {selectedCommunity.description}
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 24, fontSize: 14, color: '#64748b' }}>
              <span><strong style={{ color: '#1e293b' }}>{selectedCommunity.members?.toLocaleString()}</strong> members</span>
              <span><strong style={{ color: '#1e293b' }}>{selectedCommunity.posts}</strong> posts</span>
              <span>Created by <strong style={{ color: '#1e293b' }}>{selectedCommunity.instructor}</strong></span>
            </div>
          </div>
        </div>

        {/* Community Feed */}
        <div style={{ margin: '0 16px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: '0 0 16px 0' }}>Community Posts</h2>
          
          {communityPosts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {communityPosts.map(post => (
                <div key={post.id} style={{ 
                  background: '#fff', 
                  borderRadius: 12, 
                  padding: 20, 
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <img 
                      src={post.authorAvatar} 
                      alt={post.author}
                      style={{ width: 40, height: 40, borderRadius: '50%' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>{post.author}</div>
                      <div style={{ color: '#64748b', fontSize: 12 }}>{post.authorHandle} • {post.timestamp}</div>
                    </div>
                  </div>
                  <p style={{ margin: '0 0 12px 0', color: '#334155', fontSize: 15, lineHeight: 1.5 }}>{post.content}</p>
                  <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#64748b' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FaComment /> {post.replies}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FaHeart /> {post.likes}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              background: '#fff', 
              borderRadius: 12, 
              padding: 40, 
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
              <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>No posts yet</h3>
              <p style={{ margin: 0, color: '#64748b' }}>Be the first to start a discussion in this community!</p>
            </div>
          )}
        </div>

        {/* Community Info */}
        <div style={{ margin: '24px 16px' }}>
          <div style={{ 
            background: '#fff', 
            borderRadius: 12, 
            padding: 20, 
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 600, color: '#1e293b' }}>Community Guidelines</h3>
            <ul style={{ margin: 0, paddingLeft: 20, color: '#475569', fontSize: 14, lineHeight: 1.8 }}>
              <li>Be respectful and inclusive in all discussions</li>
              <li>Share knowledge and help others learn</li>
              <li>Keep discussions relevant to the course topic</li>
              <li>No spam or self-promotion without value</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Get short name for community tabs
  const getShortName = (community) => {
    // Use the community name directly (already set correctly based on type)
    const name = community.name || '';
    // Truncate if needed
    return name.length > 20 ? name.substring(0, 18) + '...' : name;
  };

  return (
    <div className="community-content-outer">
      <div className="community-three-column">
        <div className="community-center-column">
          {/* Horizontal Scrollable Tabs - X.com Style */}
          <div className="community-top-menu">
            <div className="community-tabs-wrapper">
              {/* Left scroll arrow */}
              {showLeftArrow && (
                <button 
                  className="tab-scroll-arrow left"
                  onClick={() => scrollTabs('left')}
                  aria-label="Scroll tabs left"
                >
                  <FaChevronLeft />
                </button>
              )}
              
              {/* Scrollable tabs container */}
              <div 
                className="community-tabs-scroll"
                ref={tabsContainerRef}
                onScroll={checkScrollArrows}
              >
                {/* Home tab - always first */}
                <button
                  className={`community-tab-btn ${activeTab === 'Home' ? 'active' : ''}`}
                  onClick={() => handleTabClick('Home')}
                >
                  <FaHome />
                  <span>Home</span>
                </button>
                
                {/* Creator tabs - grouped by creator, each with dropdown for their courses */}
                {groupedByCreator.map(creator => (
                  <div key={creator.id} className="community-tab-wrapper">
                    <button
                      className={`community-tab-btn ${activeTab === creator.id ? 'active' : ''}`}
                      onClick={() => {
                        // Just select the tab, don't open dropdown
                        if (activeTab !== creator.id) {
                          handleTabClick(creator.id);
                          setSelectedCourseFilters([]);
                        }
                        // Close any open dropdown when clicking tab text
                        setOpenCreatorDropdown(null);
                      }}
                      title={`${creator.name} - ${creator.followedCourseIds.length} course(s) followed`}
                    >
                      <span>{creator.name.length > 15 ? creator.name.substring(0, 13) + '...' : creator.name}</span>
                      <span 
                        style={{ fontSize: 10, marginLeft: 4, padding: '4px', cursor: 'pointer' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (openCreatorDropdown === creator.id) {
                            setOpenCreatorDropdown(null);
                          } else {
                            // Get button position for dropdown placement
                            const btn = e.target.closest('.community-tab-btn');
                            if (btn) {
                              const rect = btn.getBoundingClientRect();
                              const dropdownWidth = 280;
                              const viewportWidth = window.innerWidth;
                              
                              // Calculate left position, ensuring dropdown doesn't go off right edge
                              let leftPos = rect.left;
                              if (rect.left + dropdownWidth > viewportWidth - 10) {
                                // Align to right edge of button instead
                                leftPos = rect.right - dropdownWidth;
                              }
                              // Ensure it doesn't go off left edge either
                              leftPos = Math.max(10, leftPos);
                              
                              console.log('Button rect:', rect, 'Dropdown at:', { top: rect.bottom + 4, left: leftPos });
                              setDropdownPosition({
                                top: rect.bottom + 4,
                                left: leftPos
                              });
                            }
                            setOpenCreatorDropdown(creator.id);
                          }
                        }}
                      >▼</span>
                    </button>
                    
                    {/* Minimalist dropdown - fixed position to escape overflow containers */}
                    {openCreatorDropdown === creator.id && (
                      <div 
                        className="community-tab-dropdown"
                        style={{
                          position: 'fixed',
                          top: dropdownPosition.top,
                          left: Math.min(dropdownPosition.left, window.innerWidth - 290),
                          right: 'auto',
                          background: isDarkMode ? '#16181c' : '#fff',
                          border: isDarkMode ? '1px solid #2f3336' : '1px solid #e2e8f0',
                          borderRadius: 8,
                          boxShadow: isDarkMode ? '0 2px 12px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.1)',
                          zIndex: 99999,
                          width: 250,
                          padding: '4px 0'
                        }}>
                        {/* Follow All option */}
                        <div 
                          style={{ 
                            padding: '8px 12px',
                            cursor: 'pointer',
                            fontSize: 13,
                            color: '#1d9bf0',
                            fontWeight: 500
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            // Follow all courses from this creator
                            const allCourseIds = (creator.allCourses || []).map(c => c.id);
                            allCourseIds.forEach(courseId => {
                              const isAlreadyFollowed = creator.followedCourseIds.includes(courseId);
                              if (!isAlreadyFollowed) {
                                const course = (creator.allCourses || []).find(c => c.id === courseId);
                                if (course) {
                                  const courseCommunity = {
                                    id: `course-${courseId}`,
                                    name: course.title,
                                    type: 'course',
                                    courseId: courseId,
                                    instructorId: creator.instructorId
                                  };
                                  actualSetFollowedCommunities(prev => {
                                    if (prev.some(c => c.id === courseCommunity.id)) return prev;
                                    return [...prev, courseCommunity];
                                  });
                                }
                              }
                            });
                            setOpenCreatorDropdown(null);
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#f8fafc'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          Follow All
                        </div>
                        
                        {/* Unfollow All option */}
                        <div 
                          style={{ 
                            padding: '8px 12px',
                            cursor: 'pointer',
                            fontSize: 13,
                            color: '#dc2626',
                            fontWeight: 500,
                            borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #f1f5f9'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            // Remove all courses from this creator from followedCommunities
                            actualSetFollowedCommunities(prev => 
                              prev.filter(c => {
                                // Remove creator follow
                                if (c.id === creator.id) return false;
                                // Remove individual course follows from this creator
                                if (c.type === 'course') {
                                  const courseId = c.courseId || parseInt(c.id.replace('course-', ''));
                                  return !creator.followedCourseIds.includes(courseId);
                                }
                                return true;
                              })
                            );
                            setOpenCreatorDropdown(null);
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#f8fafc'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          Unfollow All
                        </div>
                        
                        {/* Individual courses - show ALL courses from creator */}
                        {(creator.allCourses || []).map(course => {
                          if (!course) return null;
                          const isFollowed = creator.followedCourseIds.includes(course.id);
                          return (
                            <div 
                              key={course.id}
                              style={{ 
                                padding: '8px 12px',
                                cursor: 'pointer',
                                fontSize: 13,
                                color: isFollowed ? '#1d9bf0' : (isDarkMode ? '#e7e9ea' : '#475569'),
                                fontWeight: isFollowed ? 500 : 400,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                // Toggle follow/unfollow for this course
                                const courseCommunityId = `course-${course.id}`;
                                console.log('Dropdown click:', { courseId: course.id, courseCommunityId, isFollowed });
                                if (isFollowed) {
                                  // Unfollow this course
                                  console.log('Unfollowing:', courseCommunityId);
                                  actualSetFollowedCommunities(prev => {
                                    console.log('Previous communities:', prev);
                                    const filtered = prev.filter(c => c.id !== courseCommunityId);
                                    console.log('Filtered communities:', filtered);
                                    return filtered;
                                  });
                                } else {
                                  // Follow this course
                                  const courseCommunity = {
                                    id: courseCommunityId,
                                    name: course.title,
                                    type: 'course',
                                    courseId: course.id,
                                    instructorId: creator.instructorId
                                  };
                                  actualSetFollowedCommunities(prev => {
                                    if (prev.some(c => c.id === courseCommunityId)) return prev;
                                    return [...prev, courseCommunity];
                                  });
                                }
                                // Close the dropdown after selecting a course
                                setOpenCreatorDropdown(null);
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#f8fafc'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              <span style={{ 
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>
                                {course.title}
                              </span>
                              {isFollowed && <span style={{ color: '#1d9bf0' }}>✓</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Right scroll arrow */}
              {showRightArrow && (
                <button 
                  className="tab-scroll-arrow right"
                  onClick={() => scrollTabs('right')}
                  aria-label="Scroll tabs right"
                >
                  <FaChevronRight />
                </button>
              )}
            </div>
          </div>

          {/* Feed Content */}
          <div className="community-feed-content">
            {/* What's Happening Post Composer - X.com Style */}
            <div 
              className="post-composer"
              style={{
                borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
                padding: '12px 16px',
                display: 'flex',
                gap: 12,
                background: isDarkMode ? '#000' : '#fff'
              }}
            >
              {/* User Avatar - Clickable to go to Profile */}
              <div 
                className="post-card-avatar"
                onClick={handleAvatarClick}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#1d9bf0',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 14,
                  lineHeight: '40px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.15s, box-shadow 0.15s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(29, 155, 240, 0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                title={`View ${currentUser?.name || 'your'} profile`}
              >
                {getUserInitials()}
              </div>
              
              {/* Composer Input Area */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Audience Selector Row with Welcome Message */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  {/* Audience Selector Dropdown */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setShowAudienceDropdown(!showAudienceDropdown)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        background: 'none',
                        border: isDarkMode ? '1px solid #536471' : '1px solid #cfd9de',
                        borderRadius: 16,
                        padding: '4px 12px',
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#1d9bf0',
                        cursor: 'pointer'
                      }}
                    >
                      {postAudience === 'everyone' ? '🌍 Everyone' : 
                        groupedByCreator.find(c => c.id === postAudience)?.name || 'Everyone'}
                      <span style={{ fontSize: 10 }}>▼</span>
                    </button>
                  
                  {/* Audience Dropdown Menu */}
                  {showAudienceDropdown && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: 4,
                        background: isDarkMode ? '#000' : '#fff',
                        border: isDarkMode ? '1px solid #2f3336' : '1px solid #cfd9de',
                        borderRadius: 12,
                        boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        minWidth: 200,
                        overflow: 'hidden'
                      }}
                    >
                      {/* Everyone Option */}
                      <div
                        onClick={() => {
                          setPostAudience('everyone');
                          setShowAudienceDropdown(false);
                          // Also switch the active tab to Home to show all posts
                          setActiveTab('Home');
                          setSelectedCourseFilters([]);
                        }}
                        style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          background: postAudience === 'everyone' ? (isDarkMode ? '#1d1f23' : '#f7f9f9') : 'transparent',
                          borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#1d1f23' : '#f7f9f9'}
                        onMouseLeave={(e) => e.currentTarget.style.background = postAudience === 'everyone' ? (isDarkMode ? '#1d1f23' : '#f7f9f9') : 'transparent'}
                      >
                        <span style={{ fontSize: 20 }}>🌍</span>
                        <div>
                          <div style={{ fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#0f1419', fontSize: 15 }}>Everyone</div>
                          <div style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 13 }}>Anyone can see this post</div>
                        </div>
                        {postAudience === 'everyone' && <span style={{ marginLeft: 'auto', color: '#1d9bf0' }}>✓</span>}
                      </div>
                      
                      {/* Creator Community Options */}
                      {groupedByCreator.map(creator => (
                        <div
                          key={creator.id}
                          onClick={() => {
                            setPostAudience(creator.id);
                            setShowAudienceDropdown(false);
                            // Also switch the active tab to show this creator's feed
                            setActiveTab(creator.id);
                            setSelectedCourseFilters([]);
                          }}
                          style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            background: postAudience === creator.id ? (isDarkMode ? '#1d1f23' : '#f7f9f9') : 'transparent'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#1d1f23' : '#f7f9f9'}
                          onMouseLeave={(e) => e.currentTarget.style.background = postAudience === creator.id ? (isDarkMode ? '#1d1f23' : '#f7f9f9') : 'transparent'}
                        >
                          <div 
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              background: '#2f3336',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontSize: 12,
                              fontWeight: 700
                            }}
                          >
                            {creator.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: isDarkMode ? '#e7e9ea' : '#0f1419', fontSize: 15 }}>{creator.name}</div>
                            <div style={{ color: isDarkMode ? '#71767b' : '#536471', fontSize: 13 }}>
                              {creator.followedCourseIds.length} course{creator.followedCourseIds.length !== 1 ? 's' : ''} followed
                            </div>
                          </div>
                          {postAudience === creator.id && <span style={{ marginLeft: 'auto', color: '#1d9bf0' }}>✓</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  </div>
                  
                  {/* Welcome Message with Info Icon */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontSize: 13,
                      color: isDarkMode ? '#71767b' : '#536471',
                      fontWeight: 500
                    }}>
                      Welcome to your communities
                    </span>
                    <div 
                      style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                      onMouseEnter={() => setShowInfoTooltip('composer')}
                      onMouseLeave={() => setShowInfoTooltip(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowInfoTooltip(showInfoTooltip === 'composer' ? null : 'composer');
                      }}
                    >
                      <FaInfoCircle 
                        style={{ 
                          color: '#1d9bf0', 
                          fontSize: 14, 
                          cursor: 'pointer'
                        }} 
                      />
                      {/* Info tooltip */}
                      {showInfoTooltip === 'composer' && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          right: -10,
                          marginTop: 8,
                          background: isDarkMode ? '#000' : '#0f1419',
                          color: '#fff',
                          padding: '10px 14px',
                          borderRadius: 8,
                          fontSize: 13,
                          lineHeight: 1.4,
                          width: 220,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                          zIndex: 100000
                        }}>
                          Go to Browse and follow courses or Creators. Feeds will show in your community here
                          <div style={{
                            position: 'absolute',
                            top: -6,
                            right: 16,
                            width: 0,
                            height: 0,
                            borderLeft: '6px solid transparent',
                            borderRight: '6px solid transparent',
                            borderBottom: isDarkMode ? '6px solid #000' : '6px solid #0f1419'
                          }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <textarea
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  onFocus={() => setIsComposerFocused(true)}
                  placeholder="Post here..."
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    fontSize: 20,
                    fontWeight: 400,
                    lineHeight: 1.3,
                    background: 'transparent',
                    color: isDarkMode ? '#e7e9ea' : '#0f1419',
                    padding: '8px 0',
                    minHeight: isComposerFocused ? '80px' : '24px',
                    fontFamily: 'inherit',
                    transition: 'min-height 0.2s ease'
                  }}
                />
                
                {/* Action Row - only show when focused or has text */}
                {(isComposerFocused || newPostText) && (
                  <div 
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
                      paddingTop: 12,
                      marginTop: 12
                    }}
                  >
                    {/* Media Icons */}
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button 
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: '#1d9bf0', 
                          cursor: 'pointer',
                          padding: 8,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Media"
                      >
                        🖼️
                      </button>
                      <button 
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: '#1d9bf0', 
                          cursor: 'pointer',
                          padding: 8,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="GIF"
                      >
                        GIF
                      </button>
                      <button 
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: '#1d9bf0', 
                          cursor: 'pointer',
                          padding: 8,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Emoji"
                      >
                        😊
                      </button>
                    </div>
                    
                    {/* Post Button */}
                    <button
                      disabled={!newPostText.trim() || isPosting}
                      onClick={handleSubmitPost}
                      style={{
                        background: (newPostText.trim() && !isPosting) ? '#1d9bf0' : (isDarkMode ? '#0e4d78' : '#8ecdf8'),
                        color: (newPostText.trim() && !isPosting) ? '#fff' : (isDarkMode ? '#808080' : '#fff'),
                        border: 'none',
                        borderRadius: 20,
                        padding: '8px 16px',
                        fontWeight: 700,
                        fontSize: 15,
                        cursor: (newPostText.trim() && !isPosting) ? 'pointer' : 'not-allowed',
                        opacity: (newPostText.trim() && !isPosting) ? 1 : 0.5
                      }}
                    >
                      {isPosting ? 'Posting...' : 'Post'}
                    </button>
                    {postError && (
                      <span style={{ color: '#f44', fontSize: 12, marginLeft: 8 }}>{postError}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {(groupedByCreator.length > 0 || realPosts.length > 0) ? (
              <div className="posts-feed">
                {displayedPosts.length > 0 ? (
                  displayedPosts.map(post => {
                    const course = getCourseById(post.courseId);
                    // Generate avatar color and initials - black/gray tones
                    const avatarColors = ['#2f3336', '#3a3f44', '#4a5056', '#5a6167', '#6a7178'];
                    const colorIndex = post.author.charCodeAt(0) % avatarColors.length;
                    const avatarColor = avatarColors[colorIndex];
                    const initials = post.author.replace(/[^A-Z0-9]/gi, '').substring(0, 2).toUpperCase();
                    
                    // Handle clicking on post author to view their profile
                    const handlePostAuthorClick = () => {
                      if (onViewUserProfile) {
                        onViewUserProfile(post.author);
                      }
                    };
                    
                    return (
                      <div key={post.id} className="post-card">
                        <div className="post-card-header">
                          <div 
                            className="post-card-avatar"
                            onClick={handlePostAuthorClick}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              background: avatarColor,
                              color: '#fff',
                              fontWeight: 700,
                              fontSize: 14,
                              lineHeight: '40px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              transition: 'transform 0.15s, box-shadow 0.15s'
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.transform = 'scale(1.05)';
                              e.currentTarget.style.boxShadow = '0 2px 8px rgba(255,255,255,0.2)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                            title={`View ${post.author}'s profile`}
                          >
                            {initials}
                          </div>
                          <div className="post-card-header-info">
                            <div className="post-card-name-row">
                              <span 
                                className="post-card-author"
                                onClick={handlePostAuthorClick}
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                              >
                                {post.author}
                              </span>
                              <span 
                                className="post-card-handle"
                                onClick={handlePostAuthorClick}
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#1d9bf0'}
                                onMouseLeave={e => e.currentTarget.style.color = ''}
                              >
                                {post.authorHandle}
                              </span>
                              <span className="post-card-dot">·</span>
                              <span className="post-card-timestamp">{post.timestamp}</span>
                            </div>
                            {post.community && (
                              <span 
                                className="post-card-community"
                                onClick={() => {
                                  if (onViewCourse && post.courseId) {
                                    onViewCourse(post.courseId);
                                  }
                                }}
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                                title={`View ${post.community} course`}
                              >
                                in {post.community}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="post-card-content">{post.content}</div>
                        <div className="post-card-actions">
                          <button className="post-action-btn">
                            <FaComment />
                            <span>{post.replies}</span>
                          </button>
                          <button className="post-action-btn">
                            <FaRetweet />
                            <span>{Math.floor(post.likes * 0.3)}</span>
                          </button>
                          <button className="post-action-btn">
                            <FaHeart />
                            <span>{post.likes}</span>
                          </button>
                          <button className="post-action-btn">
                            <FaBookmark />
                          </button>
                          <button className="post-action-btn">
                            <FaShare />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <FaBook />
                    </div>
                    <h2>No Posts Yet</h2>
                    <p>
                      {activeTab === 'Home' 
                        ? 'Posts from your followed communities will appear here.'
                        : 'No posts in this community yet. Be the first to share!'}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FaUsers />
                </div>
                <h2>Welcome to My Community</h2>
                <p>Follow courses from <strong>Browse → Courses</strong> or <strong>Creators</strong> to see their community posts here.</p>
                <p className="empty-state-hint">Communities you follow will appear as tabs above ↑</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Community; 