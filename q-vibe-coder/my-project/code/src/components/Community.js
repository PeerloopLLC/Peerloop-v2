import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './Community.css';
import { FaUsers, FaStar, FaClock, FaPlay, FaBook, FaGraduationCap, FaHome, FaChevronLeft, FaChevronRight, FaHeart, FaComment, FaRetweet, FaBookmark, FaShare, FaChevronDown, FaInfoCircle, FaImage, FaLink, FaPaperclip } from 'react-icons/fa';
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
  const [showPostingCourseDropdown, setShowPostingCourseDropdown] = useState(false); // Track course dropdown in posting section
  const [selectedPostingCourse, setSelectedPostingCourse] = useState(null); // Selected course to post to
  const [showInfoTooltip, setShowInfoTooltip] = useState(null); // Track which info tooltip is visible
  const [realPosts, setRealPosts] = useState([]); // Posts from Supabase
  const [isPosting, setIsPosting] = useState(false); // Loading state for posting
  const [postError, setPostError] = useState(null); // Error state for posting
  const [communityMode, setCommunityMode] = useState('hub'); // 'hub' or 'creators'
  const [selectedCreatorId, setSelectedCreatorId] = useState(null); // Selected creator in My Creators mode
  const [pendingCreatorName, setPendingCreatorName] = useState(null); // Name of creator from Go to Community button (not yet followed)
  const [isDragging, setIsDragging] = useState(false); // Track if user is dragging the tabs
  const [dragStartX, setDragStartX] = useState(0); // Starting X position of drag
  const [dragScrollLeft, setDragScrollLeft] = useState(0); // Starting scroll position of drag

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

  // Check for pending creator navigation from "Go to Community" button
  useEffect(() => {
    const pendingCreator = localStorage.getItem('pendingCommunityCreator');
    if (pendingCreator) {
      try {
        const creator = JSON.parse(pendingCreator);
        // Set to My Creators mode and select this creator
        if (creator.id) {
          setCommunityMode('creators');
          setSelectedCreatorId(creator.id);
          setPostAudience(creator.id);
          setActiveTab(creator.id);
          // Store the name in case the creator isn't in groupedByCreator (not followed yet)
          setPendingCreatorName(creator.name);
        }
        // Clear the pending creator so it doesn't trigger again
        localStorage.removeItem('pendingCommunityCreator');
      } catch (e) {
        console.error('Error parsing pending creator:', e);
        localStorage.removeItem('pendingCommunityCreator');
      }
    }
  }, []);

  // Scroll to selected creator in the horizontal tabs when selectedCreatorId changes
  useEffect(() => {
    if (communityMode === 'creators' && selectedCreatorId && tabsContainerRef.current) {
      // Small delay to ensure DOM is rendered
      setTimeout(() => {
        const container = tabsContainerRef.current;
        if (!container) return;
        
        // Find the div with data-creator-id matching the selected creator
        const creatorTab = container.querySelector(`[data-creator-id="${selectedCreatorId}"]`);
        
        if (creatorTab) {
          // Scroll the tab into view, centered
          const containerWidth = container.clientWidth;
          const tabLeft = creatorTab.offsetLeft;
          const tabWidth = creatorTab.offsetWidth;
          const scrollTo = tabLeft - (containerWidth / 2) + (tabWidth / 2);
          container.scrollTo({ left: Math.max(0, scrollTo), behavior: 'smooth' });
        }
      }, 150);
    }
  }, [communityMode, selectedCreatorId, pendingCreatorName]);

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

  // Group followed communities by creator - always show creator tabs, not individual courses
  const groupedByCreator = React.useMemo(() => {
    const creatorMap = new Map();
    
    // Only process course-type follows (not creator-type follows without courses)
    actualFollowedCommunities.forEach(community => {
      let creatorId, creatorName, courseIds;
      
      if (community.type === 'creator') {
        // Creator follow - only include if they have courseIds
        const cIds = community.courseIds || [];
        if (cIds.length === 0) return; // Skip creator follows with no courses
        creatorId = community.id;
        creatorName = community.name;
        courseIds = cIds;
      } else if (community.type === 'course' || community.id?.startsWith('course-')) {
        // Individual course follow - get the creator
        const courseId = community.courseId || parseInt(community.id.replace('course-', ''));
        const course = getCourseById(courseId);
        if (!course) return;
        
        const instructor = getInstructorById(course.instructorId);
        if (!instructor) return;
        
        creatorId = `creator-${course.instructorId}`;
        creatorName = instructor.name;
        courseIds = [courseId];
      } else {
        // Unknown type, skip
        return;
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
    
    // Only return creators that have at least one followed course
    return Array.from(creatorMap.values()).filter(creator => creator.followedCourseIds.length > 0);
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

  // Close posting course dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPostingCourseDropdown && 
          !event.target.closest('.posting-course-dropdown') &&
          !event.target.closest('.filter-courses-dropdown-wrapper')) {
        setShowPostingCourseDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showPostingCourseDropdown]);

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
      authorAvatar: 'https://i.pravatar.cc/40?img=1',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=5',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=8',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=12',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=15',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=18',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=21',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=24',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=27',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=30',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=33',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=36',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=39',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=42',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=45',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=48',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=49',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=51',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=52',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=53',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=54',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=55',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=56',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=57',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=58',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=59',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=60',
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
      authorAvatar: 'https://i.pravatar.cc/40?img=61',
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
    
    if (communityMode === 'hub') {
      // Community Hub: Show all posts from followed courses
      filteredFakePosts = fakePosts.filter(post => allFollowedCourseIds.includes(post.courseId));
    } else {
      // My Creators mode: Filter based on selected creator's followed courses
      const activeCreator = groupedByCreator.find(c => c.id === selectedCreatorId);
      if (activeCreator) {
        // If specific courses are selected in filter, only show posts from those courses
        if (selectedCourseFilters.length > 0) {
          const selectedCourseIds = selectedCourseFilters.map(c => c.id);
          filteredFakePosts = fakePosts.filter(post => 
            selectedCourseIds.includes(post.courseId)
          );
        } else {
          // Show all posts from this creator's followed courses
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
    
    // If in Hub mode and no communities followed, still show real posts
    if (communityMode === 'hub' && combinedPosts.length === 0) {
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
  }, [communityMode, selectedCreatorId, groupedByCreator, realPosts, selectedCourseFilters]);

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
    <div className="community-content-outer" style={{ background: isDarkMode ? '#000' : '#fff' }}>
      <div className="community-three-column" style={{ background: isDarkMode ? '#000' : '#fff' }}>
        <div className="community-center-column" style={{ background: isDarkMode ? '#000' : '#fff' }}>
          {/* Unified profile row with Town Hall + Creator pics */}
          <div className="community-top-menu" style={{
            display: 'flex',
            alignItems: 'flex-start',
            padding: '4px 8px',
            borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
          }}>
            {/* Town Hall - Fixed/Stationary */}
            <div
              onClick={() => {
                setCommunityMode('hub');
                setSelectedCreatorId(null);
                setPostAudience('everyone');
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                minWidth: 56,
                flexShrink: 0,
                marginRight: 8,
                borderRight: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
                paddingRight: 8
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                border: communityMode === 'hub' ? '2px solid #1d9bf0' : '2px solid transparent',
                padding: 2,
                marginBottom: 2,
                overflow: 'hidden'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1555921015-5532091f6026?w=100&h=100&fit=crop&crop=center"
                  alt="Town Hall"
                  draggable="false"
                  onDragStart={(e) => e.preventDefault()}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    pointerEvents: 'none'
                  }}
                />
              </div>
              <div style={{
                fontSize: 10,
                fontWeight: communityMode === 'hub' ? 600 : 400,
                color: communityMode === 'hub' ? '#1d9bf0' : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                textAlign: 'center'
              }}>
                Town Hall
              </div>
            </div>

            {/* Left scroll arrow */}
            <button
              onClick={() => {
                if (tabsContainerRef.current) {
                  tabsContainerRef.current.scrollBy({ left: -150, behavior: 'smooth' });
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: isDarkMode ? '#1d9bf0' : '#1d9bf0',
                minWidth: 20
              }}
            >
              <FaChevronLeft style={{ fontSize: 18 }} />
            </button>

            {/* Scrollable Creator profiles */}
            <div
              ref={tabsContainerRef}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                overflowX: 'auto',
                flex: 1,
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none'
              }}
              onMouseDown={(e) => {
                setIsDragging(true);
                setDragStartX(e.pageX - tabsContainerRef.current.offsetLeft);
                setDragScrollLeft(tabsContainerRef.current.scrollLeft);
              }}
              onMouseMove={(e) => {
                if (!isDragging) return;
                e.preventDefault();
                const x = e.pageX - tabsContainerRef.current.offsetLeft;
                const walk = (x - dragStartX) * 1.5;
                tabsContainerRef.current.scrollLeft = dragScrollLeft - walk;
              }}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
            >
              {groupedByCreator.map(creator => {
                const instructor = getInstructorById(creator.instructorId);
                const isSelected = communityMode === 'creators' && selectedCreatorId === creator.id;
                return (
                  <div
                    key={creator.id}
                    data-creator-id={creator.id}
                    onClick={() => {
                      setCommunityMode('creators');
                      setSelectedCreatorId(creator.id);
                      setPostAudience(creator.id);
                      setSelectedCourseFilters([]);
                      setShowPostingCourseDropdown(false);
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      minWidth: 56,
                      maxWidth: 64
                    }}
                  >
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      border: isSelected ? '2px solid #1d9bf0' : '2px solid transparent',
                      padding: 2,
                      marginBottom: 2
                    }}>
                      {instructor?.avatar ? (
                        <img
                          src={instructor.avatar}
                          alt={creator.name}
                          draggable="false"
                          onDragStart={(e) => e.preventDefault()}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            pointerEvents: 'none'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          background: '#1d9bf0',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 14,
                          fontWeight: 700
                        }}>
                          {creator.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                      )}
                    </div>
                    <div style={{
                      fontSize: 10,
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? '#1d9bf0' : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                      textAlign: 'center',
                      lineHeight: 1.2,
                      maxWidth: 64,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {creator.name}
                    </div>
                  </div>
                );
              })}

              {/* Show pending creator if not in followed list */}
              {selectedCreatorId && pendingCreatorName && !groupedByCreator.find(c => c.id === selectedCreatorId) && (
                <div
                  data-creator-id={selectedCreatorId}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    minWidth: 56,
                    maxWidth: 64,
                    opacity: 0.7
                  }}
                >
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    border: '2px solid #1d9bf0',
                    padding: 2,
                    marginBottom: 2
                  }}>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background: '#1d9bf0',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 700
                    }}>
                      {pendingCreatorName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                  </div>
                  <div style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: '#1d9bf0',
                    textAlign: 'center',
                    lineHeight: 1.2
                  }}>
                    {pendingCreatorName}
                  </div>
                </div>
              )}

              {/* Find/Add button */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  minWidth: 56,
                  maxWidth: 64
                }}
                onClick={() => {
                  if (onMenuChange) {
                    localStorage.setItem('browseActiveTopMenu', 'creators');
                    onMenuChange('Browse');
                  }
                }}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: isDarkMode ? '2px dashed #2f3336' : '2px dashed #cfd9de',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 2
                }}>
                  <span style={{ fontSize: 18, color: isDarkMode ? '#71767b' : '#536471' }}>+</span>
                </div>
                <div style={{
                  fontSize: 10,
                  fontWeight: 400,
                  color: isDarkMode ? '#71767b' : '#536471',
                  textAlign: 'center'
                }}>
                  Find
                </div>
              </div>
            </div>

            {/* Right scroll arrow */}
            <button
              onClick={() => {
                if (tabsContainerRef.current) {
                  tabsContainerRef.current.scrollBy({ left: 150, behavior: 'smooth' });
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: isDarkMode ? '#1d9bf0' : '#1d9bf0',
                minWidth: 20
              }}
            >
              <FaChevronRight style={{ fontSize: 18 }} />
            </button>
          </div>

          {/* Town Hall Profile Card - Shows when Town Hall is selected */}
          {communityMode === 'hub' && (
            <div style={{
              background: isDarkMode ? '#0a0a0a' : '#fff',
              borderRadius: 12,
              padding: '12px 16px',
              margin: '8px 16px 0 16px',
              position: 'relative',
              zIndex: 1,
              border: isDarkMode ? '1px solid #2f3336' : '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow: isDarkMode
                ? '0 0 60px 20px rgba(255, 255, 255, 0.08), 0 0 100px 40px rgba(255, 255, 255, 0.04)'
                : '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}>
              {/* Town Hall Info Row */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10
              }}>
                {/* Avatar */}
                <img
                  src="https://images.unsplash.com/photo-1555921015-5532091f6026?w=100&h=100&fit=crop&crop=center"
                  alt="Town Hall"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />

                {/* Town Hall Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#1d9bf0',
                    lineHeight: 1.2
                  }}>
                    Town Hall
                  </div>
                  <div style={{
                    fontSize: 13,
                    color: isDarkMode ? '#71767b' : '#536471'
                  }}>
                    Community Discussion Hub
                  </div>
                  <div style={{
                    fontSize: 13,
                    color: isDarkMode ? '#e7e9ea' : '#0f1419',
                    marginTop: 4,
                    lineHeight: 1.3
                  }}>
                    Welcome to the Town Hall — the open forum where all community members come together. Share ideas, ask questions, and connect with fellow learners across all courses and creators.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mini Creator Profile - Shows when a creator is selected */}
          {communityMode === 'creators' && selectedCreatorId && (() => {
            const selectedCreator = groupedByCreator.find(c => c.id === selectedCreatorId);
            if (!selectedCreator) return null;
            const instructor = getInstructorById(selectedCreator.instructorId);
            if (!instructor) return null;
            
            return (
              <div style={{
                background: isDarkMode ? '#0a0a0a' : '#fff',
                borderRadius: 12,
                padding: '12px 16px',
                margin: '8px 16px 0 16px',
                position: 'relative',
                zIndex: 1,
                border: isDarkMode ? '1px solid #2f3336' : '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: isDarkMode
                  ? '0 0 60px 20px rgba(255, 255, 255, 0.08), 0 0 100px 40px rgba(255, 255, 255, 0.04)'
                  : '0 4px 12px rgba(0, 0, 0, 0.08)'
              }}>
                {/* Creator Info Row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10
                }}>
                  {/* Avatar */}
                  {instructor.avatar ? (
                    <img
                      src={instructor.avatar}
                      alt={instructor.name}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                  ) : (
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: '#1d9bf0',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      fontWeight: 700,
                      flexShrink: 0
                    }}>
                      {instructor.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                  )}

                  {/* Creator Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        onClick={() => {
                          // Store instructor info and navigate to Browse -> Creators
                          localStorage.setItem('pendingBrowseInstructor', JSON.stringify(instructor));
                          localStorage.setItem('browseActiveTopMenu', 'creators');
                          if (onMenuChange) {
                            onMenuChange('Browse');
                          }
                        }}
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: '#1d9bf0',
                          cursor: 'pointer',
                          display: 'inline-block',
                          lineHeight: 1.2
                        }}
                        onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                      >
                        {instructor.name}
                      </div>
                      <div
                        onClick={() => {
                          localStorage.setItem('pendingBrowseInstructor', JSON.stringify(instructor));
                          localStorage.setItem('browseActiveTopMenu', 'creators');
                          if (onMenuChange) {
                            onMenuChange('Browse');
                          }
                        }}
                        style={{
                          fontSize: 12,
                          color: '#1d9bf0',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                      >
                        Go to Profile
                      </div>
                    </div>
                    <div style={{
                      fontSize: 13,
                      color: isDarkMode ? '#71767b' : '#536471'
                    }}>
                      {instructor.title}
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: isDarkMode ? '#71767b' : '#536471',
                      marginTop: 2
                    }}>
                      {instructor.courses?.length || 0} Courses · {(instructor.stats?.studentsTaught || 0).toLocaleString()} Students · {Math.floor(Math.random() * 200) + 20} Posts
                    </div>
                  </div>
                </div>
                
                {/* Filter by Courses Dropdown - Single-select */}
                {(() => {
                  const availableCourses = selectedCreator.allCourses.filter(course => selectedCreator.followedCourseIds.includes(course.id));
                  const isHubSelected = selectedCourseFilters.length === 0;

                  return (
                    <div style={{
                      marginTop: 12,
                      background: 'transparent'
                    }}>
                      <div style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: isDarkMode ? '#e7e9ea' : '#0f1419',
                        marginBottom: 6
                      }}>
                        Filter by Course
                      </div>

                      <div className="filter-courses-dropdown-wrapper" style={{ position: 'relative' }}>
                        <button
                          onClick={() => setShowPostingCourseDropdown(!showPostingCourseDropdown)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: 6,
                            border: isDarkMode ? '1px solid #2f3336' : '1px solid #cfd9de',
                            background: isDarkMode ? '#2f3336' : '#f7f9f9',
                            color: isDarkMode ? '#e7e9ea' : '#0f1419',
                            fontSize: 14,
                            fontWeight: 400,
                            cursor: 'pointer',
                            transition: 'border-color 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = '#1d9bf0'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = isDarkMode ? '#2f3336' : '#cfd9de'}
                        >
                          <span>
                            {isHubSelected
                              ? `Town Hall for ${instructor.name}`
                              : selectedCourseFilters[0].name}
                          </span>
                          <FaChevronDown style={{ fontSize: 12, color: isDarkMode ? '#71767b' : '#536471' }} />
                        </button>

                        {/* Dropdown Menu */}
                        {showPostingCourseDropdown && (
                          <div
                            className="posting-course-dropdown"
                            style={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              minWidth: 200,
                              marginTop: 2,
                              background: isDarkMode ? '#16181c' : '#fff',
                              border: isDarkMode ? '1px solid #2f3336' : '1px solid #cfd9de',
                              borderRadius: 6,
                              boxShadow: isDarkMode ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.1)',
                              zIndex: 100,
                              maxHeight: 200,
                              overflowY: 'auto'
                            }}
                          >
                            {/* Community Hub option - shows all courses feed */}
                            <div
                              onClick={() => {
                                setSelectedCourseFilters([]);
                                setShowPostingCourseDropdown(false);
                              }}
                              style={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                color: isHubSelected ? '#1d9bf0' : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                                fontWeight: isHubSelected ? 600 : 400,
                                fontSize: 13,
                                background: 'transparent',
                                transition: 'background 0.15s',
                                borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4'
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#f7f9f9'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              Town Hall for {instructor.name}
                            </div>

                            {/* Individual Courses - Single-select */}
                            {availableCourses.map(course => {
                              const isSelected = selectedCourseFilters.length === 1 && selectedCourseFilters[0].id === course.id;
                              return (
                                <div
                                  key={course.id}
                                  onClick={() => {
                                    setSelectedCourseFilters([{ id: course.id, name: course.title }]);
                                    setShowPostingCourseDropdown(false);
                                  }}
                                  style={{
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    color: isSelected ? '#1d9bf0' : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                                    fontWeight: isSelected ? 600 : 400,
                                    fontSize: 13,
                                    background: 'transparent',
                                    transition: 'background 0.15s'
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#f7f9f9'}
                                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                  {course.title}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })()}

          {/* REMOVED: Old tabs code - replaced with toggle above */}
          {false && <div className="old-tabs-removed">
            <div className="community-tabs-wrapper">
              {showLeftArrow && (
                <button 
                  className="tab-scroll-arrow left"
                  onClick={() => scrollTabs('left')}
                  aria-label="Scroll tabs left"
                >
                  <FaChevronLeft />
                </button>
              )}
              
              <div 
                className="community-tabs-scroll-old"
                onScroll={checkScrollArrows}
              >
                <button
                  className={`community-tab-btn ${activeTab === 'Home' ? 'active' : ''}`}
                  onClick={() => handleTabClick('Home')}
                >
                  <FaHome />
                  <span>Home</span>
                </button>
                
                {groupedByCreator.map(creator => (
                  <div key={creator.id} className="community-tab-wrapper">
                    <button
                      className={`community-tab-btn ${activeTab === creator.id ? 'active' : ''}`}
                      onClick={() => {
                        if (activeTab !== creator.id) {
                          handleTabClick(creator.id);
                          setSelectedCourseFilters([]);
                        }
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
                            const button = e.target.closest('.community-tab-btn');
                            if (button) {
                              const rect = button.getBoundingClientRect();
                              const dropdownWidth = 280;
                              const viewportWidth = window.innerWidth;
                              const margin = 16;
                              
                              // Always constrain: never let dropdown exceed right edge
                              let leftPos = Math.min(rect.left, viewportWidth - dropdownWidth - margin);
                              
                              // Ensure it doesn't go off left edge
                              leftPos = Math.max(margin, leftPos);
                              
                              setDropdownPosition({
                                top: rect.bottom + 4,
                                left: leftPos,
                                useRight: false
                              });
                            }
                            setOpenCreatorDropdown(creator.id);
                          }
                        }}
                      >▼</span>
                    </button>
                    
                    {/* Minimalist dropdown - rendered via Portal to escape transform context */}
                    {openCreatorDropdown === creator.id && ReactDOM.createPortal(
                      <div 
                        className="community-tab-dropdown"
                        style={{
                          position: 'fixed',
                          top: dropdownPosition.top,
                          left: dropdownPosition.left,
                          background: isDarkMode ? '#16181c' : '#fff',
                          border: isDarkMode ? '1px solid #2f3336' : '1px solid #e2e8f0',
                          borderRadius: 8,
                          boxShadow: isDarkMode ? '0 2px 12px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.1)',
                          zIndex: 99999,
                          width: 280,
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
                                if (isFollowed) {
                                  // Unfollow this course
                                  actualSetFollowedCommunities(prev => 
                                    prev.filter(c => c.id !== courseCommunityId)
                                  );
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
                      </div>,
                      document.body
                    )}
                  </div>
                ))}
              </div>
              
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
          </div>}

          {/* Feed Content - slightly lighter to show card shadow */}
          <div className="community-feed-content" style={{ background: isDarkMode ? '#050505' : '#fff' }}>
            {/* Post Box - Clean Card Design */}
            <div
              className="post-composer"
              style={{
                borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
                padding: '12px 16px 16px 16px',
                background: isDarkMode ? 'rgba(29, 155, 240, 0.03)' : 'rgba(29, 155, 240, 0.02)',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              {/* Input Card */}
              <div style={{
                border: isDarkMode ? '1px solid #2f3336' : '1px solid #cfd9de',
                borderRadius: 12,
                background: isDarkMode ? '#0a0a0a' : '#fff',
                overflow: 'hidden',
                boxSizing: 'border-box',
                width: '100%'
              }}>
                {/* Text Area with Avatar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: '12px 14px',
                  gap: 10
                }}>
                  {/* User Avatar */}
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        flexShrink: 0,
                        marginTop: 2
                      }}
                    />
                  ) : (
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: '#1d9bf0',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                      marginTop: 2
                    }}>
                      {getUserInitials()}
                    </div>
                  )}
                  <textarea
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    onFocus={() => setIsComposerFocused(true)}
                    placeholder={
                      communityMode === 'hub'
                        ? "What's on your mind? Share with the community..."
                        : selectedCourseFilters.length > 0
                          ? `Discuss ${selectedCourseFilters[0].name}...`
                          : "Ask a question or share an insight..."
                    }
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      resize: 'none',
                      fontSize: 15,
                      fontWeight: 400,
                      lineHeight: 1.5,
                      background: 'transparent',
                      color: isDarkMode ? '#e7e9ea' : '#0f1419',
                      padding: 0,
                      minHeight: 50,
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      display: 'block'
                    }}
                  />
                </div>

                {/* Bottom Action Bar */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderTop: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
                    background: isDarkMode ? '#16181c' : '#f7f9f9',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  {/* Media Icons */}
                  <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        style={{
                          background: isDarkMode ? 'rgba(29, 155, 240, 0.1)' : 'rgba(29, 155, 240, 0.08)',
                          border: 'none',
                          color: '#1d9bf0',
                          cursor: 'pointer',
                          padding: '6px 8px',
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 16,
                          transition: 'background 0.2s'
                        }}
                        title="Add image"
                        onMouseEnter={e => e.currentTarget.style.background = isDarkMode ? 'rgba(29, 155, 240, 0.2)' : 'rgba(29, 155, 240, 0.15)'}
                        onMouseLeave={e => e.currentTarget.style.background = isDarkMode ? 'rgba(29, 155, 240, 0.1)' : 'rgba(29, 155, 240, 0.08)'}
                      >
                        <FaImage />
                      </button>
                      <button
                        style={{
                          background: isDarkMode ? 'rgba(29, 155, 240, 0.1)' : 'rgba(29, 155, 240, 0.08)',
                          border: 'none',
                          color: '#1d9bf0',
                          cursor: 'pointer',
                          padding: '6px 8px',
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 16,
                          transition: 'background 0.2s'
                        }}
                        title="Add link"
                        onMouseEnter={e => e.currentTarget.style.background = isDarkMode ? 'rgba(29, 155, 240, 0.2)' : 'rgba(29, 155, 240, 0.15)'}
                        onMouseLeave={e => e.currentTarget.style.background = isDarkMode ? 'rgba(29, 155, 240, 0.1)' : 'rgba(29, 155, 240, 0.08)'}
                      >
                        <FaLink />
                      </button>
                      <button
                        style={{
                          background: isDarkMode ? 'rgba(29, 155, 240, 0.1)' : 'rgba(29, 155, 240, 0.08)',
                          border: 'none',
                          color: '#1d9bf0',
                          cursor: 'pointer',
                          padding: '6px 8px',
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 16,
                          transition: 'background 0.2s'
                        }}
                        title="Attach file"
                        onMouseEnter={e => e.currentTarget.style.background = isDarkMode ? 'rgba(29, 155, 240, 0.2)' : 'rgba(29, 155, 240, 0.15)'}
                        onMouseLeave={e => e.currentTarget.style.background = isDarkMode ? 'rgba(29, 155, 240, 0.1)' : 'rgba(29, 155, 240, 0.08)'}
                      >
                        <FaPaperclip />
                      </button>
                    </div>

                  {/* Post Button */}
                  <button
                    disabled={!newPostText.trim() || isPosting}
                    onClick={handleSubmitPost}
                    style={{
                      background: '#1d9bf0',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 20,
                      padding: '8px 20px',
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: (newPostText.trim() && !isPosting) ? 'pointer' : 'not-allowed',
                      opacity: (newPostText.trim() && !isPosting) ? 1 : 0.5,
                      transition: 'opacity 0.2s'
                    }}
                  >
                    {isPosting ? 'Posting...' : 'Post'}
                  </button>
                </div>
                {postError && (
                  <div style={{ color: '#f44', fontSize: 12, padding: '0 12px 8px' }}>{postError}</div>
                )}
              </div>
            </div>
            
            {(groupedByCreator.length > 0 || realPosts.length > 0 || (communityMode === 'creators' && selectedCreatorId)) ? (
              <div className="posts-feed">
                {displayedPosts.length > 0 ? (
                  displayedPosts.map(post => {
                    const course = getCourseById(post.courseId);
                    
                    // Handle clicking on post author to view their profile
                    const handlePostAuthorClick = () => {
                      if (onViewUserProfile) {
                        onViewUserProfile(post.author);
                      }
                    };
                    
                    return (
                      <div key={post.id} className="post-card">
                        <div className="post-card-header">
                          <img 
                            className="post-card-avatar"
                            src={post.authorAvatar}
                            alt={post.author}
                            onClick={handlePostAuthorClick}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              objectFit: 'cover',
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
                          />
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
                    {communityMode === 'creators' && selectedCreatorId && !groupedByCreator.find(c => c.id === selectedCreatorId) ? (
                      <>
                        <h2>Not Following {pendingCreatorName || 'This Creator'}</h2>
                        <p>
                          You haven't followed any courses from {pendingCreatorName || 'this creator'} yet.
                        </p>
                        <p style={{ marginTop: 8, color: '#1d9bf0' }}>
                          Go to <strong>Browse → Creators</strong> to follow their courses!
                        </p>
                      </>
                    ) : (
                      <>
                        <h2>No Posts Yet</h2>
                        <p>
                          {communityMode === 'hub' 
                            ? 'Posts from your followed communities will appear here.'
                            : 'No posts in this community yet. Be the first to share!'}
                        </p>
                      </>
                    )}
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

        {/* Right Pane - Removed for cleaner centered layout */}
      </div>
    </div>
  );
};

export default Community; 