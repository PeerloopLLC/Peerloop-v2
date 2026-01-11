import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './Community.css';
import { FaUsers, FaStar, FaClock, FaPlay, FaBook, FaGraduationCap, FaHome, FaChevronLeft, FaChevronRight, FaHeart, FaComment, FaRetweet, FaBookmark, FaShare, FaChevronDown, FaInfoCircle, FaImage, FaLink, FaPaperclip, FaLandmark } from 'react-icons/fa';
import { getAllCourses, getInstructorById, getCourseById } from '../data/database';
import { createPost, getPosts, likePost } from '../services/posts';
import { initGetStream } from '../services/getstream';
import { fakePosts } from '../data/communityPosts';

const Community = ({ followedCommunities = [], setFollowedCommunities = null, isDarkMode = false, currentUser = null, onMenuChange = null, onViewUserProfile = null, onViewCourse = null, onViewCreatorProfile = null }) => {
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

  // Pills scrolling state
  const pillsContainerRef = useRef(null);
  const [showPillsLeftArrow, setShowPillsLeftArrow] = useState(false);
  const [showPillsRightArrow, setShowPillsRightArrow] = useState(false);
  const [isPillsDragging, setIsPillsDragging] = useState(false);
  const [pillsDragStartX, setPillsDragStartX] = useState(0);
  const [pillsDragScrollLeft, setPillsDragScrollLeft] = useState(0);

  // Collapsible profile card state
  const [isProfileCollapsed, setIsProfileCollapsed] = useState(false);
  const lastScrollY = useRef(0);
  const feedContainerRef = useRef(null);

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

  // Initialize pills arrow visibility
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (pillsContainerRef.current) {
        const { scrollWidth, clientWidth } = pillsContainerRef.current;
        setShowPillsRightArrow(scrollWidth > clientWidth);
        setShowPillsLeftArrow(false);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedCreatorId, communityMode]);

  // Check for pending creator navigation from "Go to Community" button or sidebar selection
  useEffect(() => {
    const handleCommunitySelection = (creator) => {
      // Check if Town Hall was selected
      if (creator.type === 'hub' || creator.id === 'town-hall') {
        setCommunityMode('hub');
        setSelectedCreatorId(null);
        setPostAudience('everyone');
        setActiveTab('Home');
        setPendingCreatorName(null);
        setSelectedCourseFilters([]);
      }
      // Set to My Creators mode and select this creator
      else if (creator.id) {
        setCommunityMode('creators');
        setSelectedCreatorId(creator.id);
        setPostAudience(creator.id);
        setActiveTab(creator.id);
        // Store the name in case the creator isn't in groupedByCreator (not followed yet)
        setPendingCreatorName(creator.name);

        // If a specific course was passed, select it in the course filter
        if (creator.courseId && creator.courseTitle) {
          setSelectedCourseFilters([{ id: creator.courseId, name: creator.courseTitle }]);
        }
      }
      // Clear the pending creator
      localStorage.removeItem('pendingCommunityCreator');
    };

    // Check for pending creator on mount
    const pendingCreator = localStorage.getItem('pendingCommunityCreator');
    if (pendingCreator) {
      try {
        const creator = JSON.parse(pendingCreator);
        handleCommunitySelection(creator);
      } catch (e) {
        console.error('Error parsing pending creator:', e);
        localStorage.removeItem('pendingCommunityCreator');
      }
    }

    // Listen for sidebar community selection
    const handleCommunitySelected = (event) => {
      if (event.detail) {
        handleCommunitySelection(event.detail);
      }
    };

    window.addEventListener('communitySelected', handleCommunitySelected);
    return () => {
      window.removeEventListener('communitySelected', handleCommunitySelected);
    };
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

  // Handle scroll to collapse/expand profile card with hysteresis to prevent jitter
  useEffect(() => {
    const COLLAPSE_THRESHOLD = 100; // Collapse when scrolled past this point
    const EXPAND_THRESHOLD = 40;    // Expand when scrolled back above this point

    const handleScroll = () => {
      const container = feedContainerRef.current;
      if (!container) return;

      const currentScrollY = container.scrollTop;

      // Use hysteresis: different thresholds for collapse vs expand
      // This creates a "dead zone" that prevents jitter
      if (!isProfileCollapsed && currentScrollY > COLLAPSE_THRESHOLD) {
        // Scrolled down past collapse threshold - collapse
        setIsProfileCollapsed(true);
      } else if (isProfileCollapsed && currentScrollY < EXPAND_THRESHOLD) {
        // Scrolled back up past expand threshold - expand
        setIsProfileCollapsed(false);
      }
      // When between thresholds, don't change state (prevents jitter)

      lastScrollY.current = currentScrollY;
    };

    const container = feedContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isProfileCollapsed]);

  // Reset collapsed state when changing creators
  useEffect(() => {
    setIsProfileCollapsed(false);
    lastScrollY.current = 0;
  }, [selectedCreatorId]);

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

    // Process all followed communities
    actualFollowedCommunities.forEach(community => {
      let creatorId, creatorName, followedCourseIds;

      if (community.type === 'creator') {
        // Creator follow - show creator even if no courses purchased yet (Town Hall access)
        creatorId = community.id;
        creatorName = community.name;
        followedCourseIds = community.followedCourseIds || []; // Use actual followed courses (purchased)
      } else if (community.type === 'course' || community.id?.startsWith('course-')) {
        // Individual course follow - get the creator
        const courseId = community.courseId || parseInt(community.id.replace('course-', ''));
        const course = getCourseById(courseId);
        if (!course) return;

        const instructor = getInstructorById(course.instructorId);
        if (!instructor) return;

        creatorId = `creator-${course.instructorId}`;
        creatorName = instructor.name;
        followedCourseIds = [courseId];
      } else {
        // Unknown type, skip
        return;
      }

      // Merge into existing creator entry or create new one
      if (creatorMap.has(creatorId)) {
        const existing = creatorMap.get(creatorId);
        // Merge followed course IDs, avoiding duplicates
        const mergedCourseIds = [...new Set([...existing.followedCourseIds, ...followedCourseIds])];
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
          followedCourseIds: followedCourseIds, // Only purchased courses
          isFullCreatorFollow: community.type === 'creator'
        });
      }
    });

    // Return all followed creators (even those with no purchased courses - they have Town Hall access)
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

  // Note: followedCommunities save is handled in MainContent.js with user-specific localStorage keys

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

  // Pills scroll functions
  const updatePillsArrows = () => {
    if (pillsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = pillsContainerRef.current;
      setShowPillsLeftArrow(scrollLeft > 0);
      setShowPillsRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollPills = (direction) => {
    if (pillsContainerRef.current) {
      const scrollAmount = 150;
      pillsContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(updatePillsArrows, 300);
    }
  };

  const handlePillsMouseDown = (e) => {
    if (!pillsContainerRef.current) return;
    setIsPillsDragging(true);
    setPillsDragStartX(e.pageX - pillsContainerRef.current.offsetLeft);
    setPillsDragScrollLeft(pillsContainerRef.current.scrollLeft);
    pillsContainerRef.current.style.cursor = 'grabbing';
  };

  const handlePillsMouseMove = (e) => {
    if (!isPillsDragging || !pillsContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - pillsContainerRef.current.offsetLeft;
    const walk = (x - pillsDragStartX) * 1.5;
    pillsContainerRef.current.scrollLeft = pillsDragScrollLeft - walk;
    updatePillsArrows();
  };

  const handlePillsMouseUp = () => {
    setIsPillsDragging(false);
    if (pillsContainerRef.current) {
      pillsContainerRef.current.style.cursor = 'grab';
    }
  };

  const handlePillsMouseLeave = () => {
    if (isPillsDragging) {
      setIsPillsDragging(false);
      if (pillsContainerRef.current) {
        pillsContainerRef.current.style.cursor = 'grab';
      }
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
      // Community Hub: Show Town Hall exclusive posts + posts from followed courses
      // For new users with no follows, also show all creator Town Hall posts to help them discover
      const hasNoFollows = groupedByCreator.length === 0;
      filteredFakePosts = fakePosts.filter(post =>
        post.isTownHallExclusive ||
        (hasNoFollows && post.isCreatorTownHall) ||
        allFollowedCourseIds.includes(post.courseId)
      );
    } else {
      // My Creators mode: Filter based on selected creator's followed courses
      const activeCreator = groupedByCreator.find(c => c.id === selectedCreatorId);
      if (activeCreator) {
        // Get the instructor ID from the creator entry (format: "creator-{id}")
        const creatorInstructorId = activeCreator.instructorId || parseInt(selectedCreatorId.replace('creator-', ''));

        // If specific courses are selected in filter, only show posts from those courses
        if (selectedCourseFilters.length > 0) {
          const selectedCourseIds = selectedCourseFilters.map(c => c.id);
          filteredFakePosts = fakePosts.filter(post =>
            selectedCourseIds.includes(post.courseId)
          );
        } else {
          // Show creator's Town Hall posts + posts from this creator's followed courses
          filteredFakePosts = fakePosts.filter(post =>
            // Creator-specific Town Hall posts
            (post.isCreatorTownHall && post.instructorId === creatorInstructorId) ||
            // Course-specific posts from followed courses
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
    
    // Sort: Pinned first, then real posts (by time), then fake posts by engagement
    return combinedPosts.sort((a, b) => {
      // Pinned posts always come first (in both hub and creator mode)
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // Real posts come next
      if (a.isRealPost && !b.isRealPost) return -1;
      if (!a.isRealPost && b.isRealPost) return 1;

      // Among real posts, sort by most recent
      if (a.isRealPost && b.isRealPost) {
        return 0; // Keep original order (already sorted by created_at desc from Supabase)
      }

      // Town Hall posts (both global and creator-specific) come before course-specific posts
      const aIsTownHall = a.isTownHallExclusive || a.isCreatorTownHall;
      const bIsTownHall = b.isTownHallExclusive || b.isCreatorTownHall;
      if (aIsTownHall && !bIsTownHall) return -1;
      if (!aIsTownHall && bIsTownHall) return 1;

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
                {isCommunityFollowed(selectedCommunity.id) ? 'Joined Community' : 'Join Community'}
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
                  <div style={{ display: 'flex', gap: 20, fontSize: 14, color: '#64748b' }}>
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
        <div ref={feedContainerRef} className="community-center-column" style={{ background: isDarkMode ? '#000' : '#fff' }}>

          {/* Town Hall Profile Card - Shows when Town Hall is selected */}
          {communityMode === 'hub' && (
            <div style={{
              background: isDarkMode ? '#1f2937' : '#f9fafb',
              borderRadius: 12,
              padding: '12px 16px',
              margin: '8px 16px 0 16px',
              position: 'sticky',
              top: 0,
              zIndex: 10,
              border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
              boxShadow: isDarkMode ? '0 4px 25px 10px rgba(80, 80, 80, 0.8)' : '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              {/* Town Hall Info Row */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10
              }}>
                {/* Avatar */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <FaLandmark style={{ color: '#fff', fontSize: 20 }} />
                </div>

                {/* Town Hall Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#10b981',
                    lineHeight: 1.2
                  }}>
                    The Commons
                  </div>
                  <div style={{
                    fontSize: 14,
                    color: isDarkMode ? '#71767b' : '#536471'
                  }}>
                    Community Discussion Hub
                  </div>
                  <div style={{
                    fontSize: 14,
                    color: isDarkMode ? '#e7e9ea' : '#0f1419',
                    marginTop: 4,
                    lineHeight: 1.3
                  }}>
                    Welcome to The Commons — the open forum where all community members come together. Share ideas, ask questions, and connect with fellow learners across all courses and communities.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mini Creator Profile - Shows when a creator is selected */}
          {communityMode === 'creators' && selectedCreatorId && (() => {
            const selectedCreator = groupedByCreator.find(c => c.id === selectedCreatorId);
            // Extract instructor ID from selectedCreatorId (format: "creator-{id}")
            const instructorIdFromSelected = parseInt(selectedCreatorId.replace('creator-', ''));
            const instructor = selectedCreator
              ? getInstructorById(selectedCreator.instructorId)
              : getInstructorById(instructorIdFromSelected);
            if (!instructor) return null;

            // For pending creators (not in groupedByCreator), create a minimal creator object
            const effectiveCreator = selectedCreator || {
              id: selectedCreatorId,
              name: pendingCreatorName || instructor.name,
              instructorId: instructorIdFromSelected,
              allCourses: getAllCourses().filter(c => c.instructorId === instructorIdFromSelected),
              followedCourseIds: selectedCourseFilters.map(f => f.id),
              isFullCreatorFollow: false
            };
            
            return (
              <div style={{
                background: isDarkMode ? '#1f2937' : '#f9fafb',
                borderRadius: 12,
                padding: isProfileCollapsed ? '8px 16px' : '12px 16px',
                margin: '8px 16px 0 16px',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                boxShadow: isDarkMode ? '0 4px 25px 10px rgba(80, 80, 80, 0.8)' : '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'padding 0.2s ease'
              }}>
                {/* Collapsed View - Just name and pills */}
                {isProfileCollapsed ? (
                  <div>
                    <div
                      onClick={() => {
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
                        marginBottom: 8
                      }}
                      onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                    >
                      {instructor.name}
                    </div>
                  </div>
                ) : (
                  /* Expanded View - Full card */
                  <>
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
                          fontSize: 14,
                          color: isDarkMode ? '#9ca3af' : '#536471'
                        }}>
                          {instructor.title}
                        </div>
                        <div style={{
                          fontSize: 12,
                          color: isDarkMode ? '#9ca3af' : '#536471',
                          marginTop: 2
                        }}>
                          {instructor.courses?.length || 0} Courses · {(instructor.stats?.studentsTaught || 0).toLocaleString()} Students · {Math.floor(Math.random() * 200) + 20} Posts
                        </div>
                        {instructor.bio && (
                          <div style={{
                            fontSize: 14,
                            color: isDarkMode ? '#d1d5db' : '#374151',
                            marginTop: 8,
                            lineHeight: 1.4
                          }}>
                            {instructor.bio.length > 150 ? instructor.bio.substring(0, 150) + '...' : instructor.bio}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Horizontal Scrollable Course Pills - Always visible */}
                {(() => {
                  // Show only purchased courses as pills
                  const allCourses = effectiveCreator.allCourses || [];
                  const followedCourseIds = effectiveCreator.followedCourseIds || [];

                  // Only show purchased courses as individual pills
                  const purchasedCourses = allCourses.filter(course =>
                    followedCourseIds.includes(course.id)
                  );

                  // Check if there are more courses to view
                  const hasMoreCourses = allCourses.length > 0;

                  const isHubSelected = selectedCourseFilters.length === 0;

                  return (
                    <div style={{
                      marginTop: isProfileCollapsed ? 0 : 12,
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      transition: 'margin-top 0.2s ease'
                    }}>
                      {/* Left Arrow */}
                      {showPillsLeftArrow && (
                        <button
                          onClick={() => scrollPills('left')}
                          style={{
                            background: isDarkMode ? '#2f3336' : '#f7f9f9',
                            border: isDarkMode ? '1px solid #536471' : '1px solid #cfd9de',
                            borderRadius: '50%',
                            width: 28,
                            height: 28,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            flexShrink: 0,
                            color: isDarkMode ? '#e7e9ea' : '#0f1419',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          <FaChevronLeft size={12} />
                        </button>
                      )}
                      {/* Scrollable Pills Container */}
                      <div
                        ref={pillsContainerRef}
                        className="course-pills-container"
                        onScroll={updatePillsArrows}
                        onMouseDown={handlePillsMouseDown}
                        onMouseMove={handlePillsMouseMove}
                        onMouseUp={handlePillsMouseUp}
                        onMouseLeave={handlePillsMouseLeave}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          overflowX: 'auto',
                          overflowY: 'hidden',
                          paddingBottom: 4,
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none',
                          WebkitOverflowScrolling: 'touch',
                          cursor: 'grab',
                          flex: 1,
                          userSelect: 'none'
                        }}
                      >
                        {/* Main Hall Pill - Always first */}
                        <button
                          onClick={() => setSelectedCourseFilters([])}
                          className={`course-pill ${isHubSelected ? 'course-pill-selected' : ''}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '8px 16px',
                            borderRadius: 20,
                            border: isHubSelected
                              ? '2px solid #1d9bf0'
                              : (isDarkMode ? '2px solid #536471' : '2px solid #cfd9de'),
                            background: isHubSelected
                              ? (isDarkMode ? 'rgba(29, 155, 240, 0.15)' : 'rgba(29, 155, 240, 0.1)')
                              : (isDarkMode ? '#2f3336' : '#f7f9f9'),
                            color: isHubSelected
                              ? '#1d9bf0'
                              : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Main Hall
                        </button>

                        {/* Course Pills - Only purchased courses */}
                        {purchasedCourses.map(course => {
                          const isSelected = selectedCourseFilters.length === 1 && selectedCourseFilters[0].id === course.id;
                          return (
                            <button
                              key={course.id}
                              onClick={() => {
                                setSelectedCourseFilters([{ id: course.id, name: course.title }]);
                              }}
                              className={`course-pill ${isSelected ? 'course-pill-selected' : ''}`}
                              title={course.title}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '8px 16px',
                                borderRadius: 20,
                                border: isSelected
                                  ? '2px solid #1d9bf0'
                                  : (isDarkMode ? '2px solid #536471' : '2px solid #cfd9de'),
                                background: isSelected
                                  ? (isDarkMode ? 'rgba(29, 155, 240, 0.15)' : 'rgba(29, 155, 240, 0.1)')
                                  : (isDarkMode ? '#2f3336' : '#f7f9f9'),
                                color: isSelected
                                  ? '#1d9bf0'
                                  : (isDarkMode ? '#e7e9ea' : '#0f1419'),
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {course.title}
                            </button>
                          );
                        })}

                        {/* View All Courses Pill */}
                        {hasMoreCourses && (
                          <button
                            onClick={() => {
                              // Navigate to creator profile to see all courses
                              if (onViewCreatorProfile) {
                                onViewCreatorProfile(effectiveCreator);
                              }
                            }}
                            className="course-pill"
                            title="View all courses from this creator"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '8px 16px',
                              borderRadius: 20,
                              border: '2px solid #6366f1',
                              background: isDarkMode ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)',
                              color: '#6366f1',
                              fontSize: 14,
                              fontWeight: 600,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              flexShrink: 0,
                              transition: 'all 0.2s ease'
                            }}
                          >
                            View all courses
                          </button>
                        )}
                      </div>
                      {/* Right Arrow */}
                      {showPillsRightArrow && (
                        <button
                          onClick={() => scrollPills('right')}
                          style={{
                            background: isDarkMode ? '#2f3336' : '#f7f9f9',
                            border: isDarkMode ? '1px solid #536471' : '1px solid #cfd9de',
                            borderRadius: '50%',
                            width: 28,
                            height: 28,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            flexShrink: 0,
                            color: isDarkMode ? '#e7e9ea' : '#0f1419',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          <FaChevronRight size={12} />
                        </button>
                      )}
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
                      title={`${creator.name} - ${creator.followedCourseIds.length} course(s) joined`}
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
                        {/* Unfollow Creator option */}
                        <div
                          style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            fontSize: 14,
                            color: '#dc2626',
                            fontWeight: 500
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            // Remove this creator from followedCommunities
                            actualSetFollowedCommunities(prev =>
                              prev.filter(c => c.id !== creator.id)
                            );
                            setOpenCreatorDropdown(null);
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#2f3336' : '#f8fafc'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          Leave Community
                        </div>
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
                      background: (isDarkMode ? '#2f3336' : '#f7f9f9'),
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
            
            {(groupedByCreator.length > 0 || realPosts.length > 0 || communityMode === 'hub' || (communityMode === 'creators' && selectedCreatorId)) ? (
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
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                {post.isPinned && (
                                  <span style={{
                                    background: isDarkMode ? 'rgba(29, 155, 240, 0.2)' : 'rgba(29, 155, 240, 0.1)',
                                    color: '#1d9bf0',
                                    fontSize: 10,
                                    fontWeight: 600,
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 3
                                  }}>
                                    📌 Pinned
                                  </span>
                                )}
                                {(post.isTownHallExclusive || post.isCreatorTownHall) ? (
                                  <span
                                    className="post-card-community"
                                    style={{
                                      background: post.isCreatorTownHall
                                        ? (isDarkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)')
                                        : (isDarkMode ? 'rgba(29, 155, 240, 0.15)' : 'rgba(29, 155, 240, 0.1)'),
                                      color: post.isCreatorTownHall ? '#8b5cf6' : '#1d9bf0',
                                      padding: '2px 8px',
                                      borderRadius: 12,
                                      fontWeight: 500,
                                      cursor: 'default'
                                    }}
                                  >
                                    {post.community}
                                  </span>
                                ) : (
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
                        <h2>Not Joined {pendingCreatorName || 'This Community'}</h2>
                        <p>
                          You haven't joined any courses from {pendingCreatorName || 'this community'} yet.
                        </p>
                        <p style={{ marginTop: 8, color: '#1d9bf0' }}>
                          Go to <strong>Browse → Communities</strong> to join their courses!
                        </p>
                      </>
                    ) : (
                      <>
                        <h2>No Posts Yet</h2>
                        <p>
                          {communityMode === 'hub'
                            ? 'Welcome to The Commons! This is where the community connects. Be the first to share something!'
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
                <p>Join courses from <strong>Browse → Courses</strong> or <strong>Communities</strong> to see their community posts here.</p>
                <p className="empty-state-hint">Communities you join will appear as tabs above ↑</p>
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