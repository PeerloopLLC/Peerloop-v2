/**
 * User Profiles Database
 * Contains all community members with their profiles, roles, and stats
 */

// Helper to generate random stats within a range
const randomStat = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// All community users with full profiles
export const communityUsers = {
  // Course 1: AI for Product Managers
  'ProductPioneer42': {
    id: 'ProductPioneer42',
    name: 'Patricia Parker',
    username: '@ProductPioneer42',
    roles: ['student', 'teacher'],
    userType: 'student_teacher',
    avatar: 'https://i.pravatar.cc/150?img=5',
    avatarColor: '#4ECDC4',
    bio: 'Product Manager turned AI enthusiast. Love bridging the gap between tech and business. Now teaching AI concepts to fellow PMs!',
    location: 'Seattle, WA',
    website: 'https://productpioneer.io',
    joinedDate: 'January 2024',
    stats: {
      coursesCompleted: 8,
      coursesTeaching: 2,
      studentsHelped: 34,
      hoursLearned: 120,
      avgRating: 4.8,
      totalEarnings: 1890
    },
    expertise: ['AI for Business', 'Product Management', 'Machine Learning Basics'],
    currentlyLearning: ['Deep Learning Fundamentals'],
    achievements: [
      { id: 1, name: 'AI Pioneer', description: 'First PM course completed', icon: '🎯' },
      { id: 2, name: 'Teacher Rising', description: 'Started teaching', icon: '📚' }
    ],
    posts: [
      { type: 'tip', time: '3h ago', context: 'AI for Product Managers > General', content: 'Quick tip for PMs: Start with the business problem, then find the AI solution. Not the other way around!', stats: { helpful: 18, replies: 4, goodwill: 12 } },
      { type: 'win', time: '2d ago', context: 'AI for Product Managers', content: 'Just got promoted to Senior PM after applying AI concepts from this course!', badge: 'AI for PMs', stats: { likes: 45, replies: 12 } }
    ],
    coursesTaken: [
      { community: 'AI Academy', courses: [
        { title: 'AI for Product Managers', status: 'completed', hours: 20, date: 'Dec 2024', score: 92, rank: 'Top 8%', skills: ['AI Strategy', 'ML Basics', 'Product Integration'] },
        { title: 'Machine Learning Fundamentals', status: 'completed', hours: 24, date: 'Jan 2024', score: 88, rank: 'Top 15%', skills: ['Supervised Learning', 'Model Evaluation'] }
      ]}
    ],
    coursesTaught: [
      { title: 'AI for Product Managers', community: 'AI Academy', students: 34, rating: 4.8, reviews: 28, hoursTaught: 65, topReview: { stars: 5, text: 'Patricia makes AI accessible for non-technical PMs!', author: '@newpm' } }
    ],
    teachingStats: { students: 34, rating: 4.8, comeback: 85, earned: 1890 }
  },

  // Course 2: Node.js Backend Development
  'BackendBoss99': {
    id: 'BackendBoss99',
    name: 'Brandon Blake',
    username: '@BackendBoss99',
    roles: ['student', 'teacher'],
    userType: 'student_teacher',
    avatar: 'https://i.pravatar.cc/150?img=7',
    avatarColor: '#00D2FF',
    bio: 'Backend developer specializing in Node.js and Express. Love building scalable APIs and helping newcomers master server-side development.',
    location: 'Austin, TX',
    website: 'https://backendboss.dev',
    joinedDate: 'December 2023',
    stats: {
      coursesCompleted: 12,
      coursesTeaching: 3,
      studentsHelped: 67,
      hoursLearned: 210,
      avgRating: 4.9,
      totalEarnings: 4230
    },
    expertise: ['Node.js', 'Express.js', 'REST APIs', 'MongoDB', 'PostgreSQL'],
    currentlyLearning: ['Microservices Architecture', 'GraphQL'],
    achievements: [
      { id: 1, name: 'Backend Master', description: 'Completed all backend courses', icon: '🔧' },
      { id: 2, name: 'Top Teacher', description: '50+ students helped', icon: '🌟' },
      { id: 3, name: 'High Earner', description: 'Earned $4000+', icon: '💰' }
    ],
    posts: [
      { type: 'answer', time: '1h ago', context: 'Node.js Backend > REST APIs', content: 'For REST API versioning, I recommend URL path versioning (/api/v1/) for simplicity. Header versioning is cleaner but harder to test.', replyTo: 'Best practices for API versioning?', stats: { helpful: 23, replies: 8, goodwill: 18 } },
      { type: 'tip', time: '4h ago', context: 'The Commons > Backend', content: 'Always validate input at the API layer AND the database layer. Defense in depth!', stats: { helpful: 31, replies: 5, goodwill: 22 } }
    ],
    coursesTaken: [
      { community: 'Backend Academy', courses: [
        { title: 'Node.js Backend Development', status: 'completed', hours: 30, date: 'Mar 2024', score: 96, rank: 'Top 3%', skills: ['Express', 'REST APIs', 'Authentication'] },
        { title: 'Database Design', status: 'completed', hours: 18, date: 'Jan 2024', score: 91, rank: 'Top 10%', skills: ['MongoDB', 'PostgreSQL', 'Schema Design'] }
      ]}
    ],
    coursesTaught: [
      { title: 'Node.js Backend Development', community: 'Backend Academy', students: 45, rating: 4.9, reviews: 52, hoursTaught: 120, topReview: { stars: 5, text: 'Brandon breaks down complex concepts perfectly!', author: '@aspiring_dev' } },
      { title: 'REST API Design', community: 'Backend Academy', students: 22, rating: 4.85, reviews: 18, hoursTaught: 45, topReview: { stars: 5, text: 'Finally understand RESTful principles!', author: '@api_learner' } }
    ],
    teachingStats: { students: 67, rating: 4.9, comeback: 91, earned: 4230 }
  },

  'CodeNewbie_Mike': {
    id: 'CodeNewbie_Mike',
    name: 'Michael Chen',
    username: '@CodeNewbie_Mike',
    roles: ['student'],
    userType: 'student',
    avatar: 'https://i.pravatar.cc/150?img=11',
    avatarColor: '#00D2FF',
    bio: 'Career changer learning to code. Coming from marketing, now diving into web development. One step at a time!',
    location: 'Portland, OR',
    website: null,
    joinedDate: 'March 2024',
    stats: {
      coursesCompleted: 2,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 45,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['HTML/CSS', 'JavaScript Basics'],
    currentlyLearning: ['Node.js Backend Development', 'Full-Stack Web Development'],
    achievements: [
      { id: 1, name: 'First Steps', description: 'Completed first course', icon: '👣' }
    ],
    posts: [
      { type: 'question', time: '5h ago', context: 'Node.js Backend > Getting Started', content: 'How do I handle async/await errors properly? Keep getting unhandled promise rejections.', stats: { replies: 7, resolved: false } },
      { type: 'win', time: '3d ago', context: 'Web Development > JavaScript', content: 'Finally built my first CRUD app! It\'s ugly but it works!', badge: 'First App', stats: { likes: 28, replies: 9 } }
    ],
    coursesTaken: [
      { community: 'Web Dev Academy', courses: [
        { title: 'HTML & CSS Fundamentals', status: 'completed', hours: 12, date: 'Apr 2024', score: 85, rank: 'Top 20%', skills: ['HTML5', 'CSS3', 'Responsive Design'] },
        { title: 'JavaScript Basics', status: 'completed', hours: 18, date: 'May 2024', score: 82, rank: 'Top 25%', skills: ['Variables', 'Functions', 'DOM'] },
        { title: 'Node.js Backend Development', status: 'in-progress', hours: 8, progress: 35, skills: ['Express Basics', 'Routing'] }
      ]}
    ],
    coursesTaught: []
  },

  // Course 3: Cloud Architecture with AWS
  'CloudMaster_Pro': {
    id: 'CloudMaster_Pro',
    name: 'Carlos Mendez',
    username: '@CloudMaster_Pro',
    roles: ['student', 'teacher'],
    userType: 'student_teacher',
    avatar: 'https://i.pravatar.cc/150?img=14',
    avatarColor: '#FF9900',
    bio: 'AWS Certified Solutions Architect. Previously DevOps engineer, now teaching cloud architecture. Cloud is the future!',
    location: 'Miami, FL',
    website: 'https://cloudmasterpro.com',
    joinedDate: 'November 2023',
    stats: {
      coursesCompleted: 15,
      coursesTeaching: 4,
      studentsHelped: 89,
      hoursLearned: 280,
      avgRating: 4.95,
      totalEarnings: 6780
    },
    expertise: ['AWS', 'Cloud Architecture', 'Serverless', 'Terraform', 'Docker'],
    currentlyLearning: ['Kubernetes Advanced'],
    achievements: [
      { id: 1, name: 'Cloud Guru', description: 'AWS Certified', icon: '☁️' },
      { id: 2, name: 'Mentor Elite', description: '75+ students', icon: '🏆' },
      { id: 3, name: 'Top Rated', description: '4.95 rating', icon: '⭐' }
    ],
    posts: [
      { type: 'tip', time: '2h ago', context: 'Cloud Architecture > AWS', content: 'Lambda cold starts killing your performance? Use provisioned concurrency for critical functions. Worth the cost!', stats: { helpful: 42, replies: 11, goodwill: 28 } },
      { type: 'answer', time: '1d ago', context: 'The Commons > Cloud', content: 'For S3 bucket policies, always start with deny-all, then explicitly allow. Security first!', replyTo: 'S3 security best practices?', stats: { helpful: 35, replies: 6, goodwill: 22 } }
    ],
    coursesTaken: [
      { community: 'Cloud Academy', courses: [
        { title: 'Cloud Architecture with AWS', status: 'completed', hours: 40, date: 'Feb 2024', score: 98, rank: 'Top 1%', skills: ['EC2', 'Lambda', 'S3', 'VPC'] },
        { title: 'Terraform Infrastructure', status: 'completed', hours: 25, date: 'Mar 2024', score: 95, rank: 'Top 3%', skills: ['IaC', 'Modules', 'State Management'] }
      ]}
    ],
    coursesTaught: [
      { title: 'Cloud Architecture with AWS', community: 'Cloud Academy', students: 56, rating: 4.95, reviews: 48, hoursTaught: 140, topReview: { stars: 5, text: 'Carlos makes AWS concepts crystal clear!', author: '@cloud_newbie' } },
      { title: 'Serverless Deep Dive', community: 'Cloud Academy', students: 33, rating: 4.92, reviews: 28, hoursTaught: 75, topReview: { stars: 5, text: 'Best Lambda course out there!', author: '@serverless_fan' } }
    ],
    teachingStats: { students: 89, rating: 4.95, comeback: 93, earned: 6780 }
  },

  'DevOpsNewbie': {
    id: 'DevOpsNewbie',
    name: 'Diana Okonkwo',
    username: '@DevOpsNewbie',
    roles: ['student'],
    userType: 'student',
    avatar: 'https://i.pravatar.cc/150?img=20',
    avatarColor: '#FF9900',
    bio: 'Junior developer exploring DevOps. Fascinated by automation and cloud infrastructure. Learning AWS step by step.',
    location: 'Chicago, IL',
    website: null,
    joinedDate: 'April 2024',
    stats: {
      coursesCompleted: 1,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 32,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['Linux Basics', 'Git'],
    currentlyLearning: ['Cloud Architecture with AWS', 'DevOps & CI/CD Mastery'],
    achievements: [],
    posts: [
      { type: 'question', time: '6h ago', context: 'Cloud Architecture > AWS', content: 'What\'s the difference between IAM roles and IAM users? When should I use each?', stats: { replies: 4, resolved: true } },
      { type: 'win', time: '1w ago', context: 'DevOps > Linux', content: 'Deployed my first EC2 instance! Baby steps but it feels amazing!', badge: 'Cloud Starter', stats: { likes: 15, replies: 6 } }
    ],
    coursesTaken: [
      { community: 'DevOps Academy', courses: [
        { title: 'Linux Fundamentals', status: 'completed', hours: 15, date: 'May 2024', score: 78, rank: 'Top 30%', skills: ['Command Line', 'File System', 'Permissions'] },
        { title: 'Cloud Architecture with AWS', status: 'in-progress', hours: 12, progress: 40, skills: ['EC2 Basics', 'S3 Basics'] }
      ]}
    ],
    coursesTaught: []
  },

  // Course 4: Deep Learning Fundamentals
  'NeuralNetNinja': {
    id: 'NeuralNetNinja',
    name: 'Nathan Nguyen',
    username: '@NeuralNetNinja',
    roles: ['student', 'teacher'],
    userType: 'student_teacher',
    avatar: 'https://i.pravatar.cc/150?img=8',
    avatarColor: '#FF6B6B',
    bio: 'ML Engineer specializing in deep learning. Built CNNs for image recognition at scale. Teaching neural networks is my passion!',
    location: 'San Jose, CA',
    website: 'https://neuralnetninja.ai',
    joinedDate: 'October 2023',
    stats: {
      coursesCompleted: 18,
      coursesTeaching: 5,
      studentsHelped: 112,
      hoursLearned: 340,
      avgRating: 4.92,
      totalEarnings: 8450
    },
    expertise: ['Deep Learning', 'TensorFlow', 'PyTorch', 'CNN', 'Computer Vision'],
    currentlyLearning: ['Transformer Models', 'LLM Fine-tuning'],
    achievements: [
      { id: 1, name: 'Neural Master', description: 'All DL courses done', icon: '🧠' },
      { id: 2, name: 'Century Club', description: '100+ students', icon: '💯' },
      { id: 3, name: 'AI Influencer', description: 'Top 5% teacher', icon: '🌟' }
    ],
    posts: [
      { type: 'tip', time: '1h ago', context: 'Deep Learning > Neural Networks', content: 'Batch normalization tip: Place it BEFORE activation for better gradient flow. Trust me, your training will be smoother!', stats: { helpful: 56, replies: 14, goodwill: 38 } },
      { type: 'answer', time: '8h ago', context: 'The Commons > AI/ML', content: 'For vanishing gradients, try: 1) ReLU activation, 2) Proper initialization (He/Xavier), 3) Residual connections. Usually fixes it!', replyTo: 'How to fix vanishing gradients?', stats: { helpful: 48, replies: 9, goodwill: 32 } }
    ],
    coursesTaken: [
      { community: 'AI Academy', courses: [
        { title: 'Deep Learning Fundamentals', status: 'completed', hours: 45, date: 'Jan 2024', score: 99, rank: 'Top 1%', skills: ['Neural Networks', 'Backprop', 'Optimization'] },
        { title: 'Computer Vision with CNNs', status: 'completed', hours: 35, date: 'Mar 2024', score: 97, rank: 'Top 2%', skills: ['CNN Architecture', 'Transfer Learning', 'Object Detection'] }
      ]}
    ],
    coursesTaught: [
      { title: 'Deep Learning Fundamentals', community: 'AI Academy', students: 78, rating: 4.92, reviews: 65, hoursTaught: 180, topReview: { stars: 5, text: 'Nathan makes neural networks intuitive!', author: '@ml_beginner' } },
      { title: 'PyTorch Mastery', community: 'AI Academy', students: 34, rating: 4.9, reviews: 28, hoursTaught: 85, topReview: { stars: 5, text: 'Best PyTorch teacher on the platform!', author: '@pytorch_fan' } }
    ],
    teachingStats: { students: 112, rating: 4.92, comeback: 94, earned: 8450 }
  },

  'AIStudent_2024': {
    id: 'AIStudent_2024',
    name: 'Amanda Stevens',
    username: '@AIStudent_2024',
    roles: ['student', 'teacher'],
    userType: 'student_teacher',
    avatar: 'https://i.pravatar.cc/150?img=9',
    avatarColor: '#FF6B6B',
    bio: 'Data scientist transitioning to ML engineering. Recently certified to teach Deep Learning. Excited to help others on their AI journey!',
    location: 'Boston, MA',
    website: 'https://amandastevens.ml',
    joinedDate: 'January 2024',
    stats: {
      coursesCompleted: 6,
      coursesTeaching: 1,
      studentsHelped: 23,
      hoursLearned: 95,
      avgRating: 4.85,
      totalEarnings: 1680
    },
    expertise: ['Python', 'Data Science', 'Deep Learning', 'Statistics'],
    currentlyLearning: ['Computer Vision with Python', 'NLP'],
    achievements: [
      { id: 1, name: 'Fast Learner', description: '6 courses in 3 months', icon: '🚀' },
      { id: 2, name: 'New Teacher', description: 'First teaching cert', icon: '📖' }
    ],
    posts: [
      { type: 'win', time: '4h ago', context: 'Deep Learning > Projects', content: 'My image classifier hit 94% accuracy! Thanks to everyone who helped debug my data augmentation!', badge: 'Project Complete', stats: { likes: 32, replies: 8 } },
      { type: 'question', time: '2d ago', context: 'Computer Vision > CNNs', content: 'ResNet vs EfficientNet for transfer learning on small datasets? What are your experiences?', stats: { replies: 11, resolved: true } }
    ],
    coursesTaken: [
      { community: 'AI Academy', courses: [
        { title: 'Deep Learning Fundamentals', status: 'completed', hours: 40, date: 'Mar 2024', score: 91, rank: 'Top 8%', skills: ['Neural Networks', 'TensorFlow', 'Model Training'] },
        { title: 'Data Science with Python', status: 'completed', hours: 25, date: 'Feb 2024', score: 94, rank: 'Top 5%', skills: ['Pandas', 'NumPy', 'Visualization'] },
        { title: 'Computer Vision with Python', status: 'in-progress', hours: 15, progress: 55, skills: ['OpenCV', 'Image Processing'] }
      ]}
    ],
    coursesTaught: [
      { title: 'Deep Learning Fundamentals', community: 'AI Academy', students: 23, rating: 4.85, reviews: 19, hoursTaught: 52, topReview: { stars: 5, text: 'Amanda explains complex math simply!', author: '@math_phobe' } }
    ],
    teachingStats: { students: 23, rating: 4.85, comeback: 87, earned: 1680 }
  },

  // Course 5: Computer Vision with Python
  'VisionCoder25': {
    id: 'VisionCoder25',
    name: 'Victor Ivanov',
    username: '@VisionCoder25',
    roles: ['student'],
    userType: 'student',
    avatar: 'https://i.pravatar.cc/150?img=12',
    avatarColor: '#9B59B6',
    bio: 'Software engineer exploring computer vision. Building real-time object detection systems. Love the intersection of AI and visual computing.',
    location: 'Denver, CO',
    website: 'https://visioncode.dev',
    joinedDate: 'February 2024',
    stats: {
      coursesCompleted: 4,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 72,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['Python', 'OpenCV Basics', 'Image Processing'],
    currentlyLearning: ['Computer Vision with Python', 'Deep Learning Fundamentals'],
    achievements: [
      { id: 1, name: 'Vision Quest', description: 'Started CV course', icon: '👁️' }
    ],
    posts: [
      { type: 'question', time: '3h ago', context: 'Computer Vision > Object Detection', content: 'YOLO vs SSD for real-time detection on edge devices? Need to run on Raspberry Pi.', stats: { replies: 6, resolved: false } },
      { type: 'win', time: '5d ago', context: 'Computer Vision > Projects', content: 'Built a license plate detector that runs at 30fps! OpenCV is powerful!', badge: 'First CV Project', stats: { likes: 24, replies: 7 } }
    ],
    coursesTaken: [
      { community: 'CV Academy', courses: [
        { title: 'Python for CV', status: 'completed', hours: 20, date: 'Apr 2024', score: 86, rank: 'Top 18%', skills: ['NumPy', 'Image Arrays', 'Color Spaces'] },
        { title: 'OpenCV Fundamentals', status: 'completed', hours: 25, date: 'May 2024', score: 89, rank: 'Top 12%', skills: ['Filters', 'Edge Detection', 'Contours'] },
        { title: 'Computer Vision with Python', status: 'in-progress', hours: 18, progress: 60, skills: ['Object Detection', 'Tracking'] }
      ]}
    ],
    coursesTaught: []
  },

  'OpenCV_Fan': {
    id: 'OpenCV_Fan',
    name: 'Olivia Foster',
    username: '@OpenCV_Fan',
    roles: ['student', 'teacher'],
    userType: 'student_teacher',
    avatar: 'https://i.pravatar.cc/150?img=25',
    avatarColor: '#9B59B6',
    bio: 'Computer vision specialist. From OpenCV basics to building production ML pipelines. Teaching CV and loving every session!',
    location: 'Los Angeles, CA',
    website: 'https://oliviafoster.cv',
    joinedDate: 'December 2023',
    stats: {
      coursesCompleted: 9,
      coursesTeaching: 2,
      studentsHelped: 45,
      hoursLearned: 156,
      avgRating: 4.88,
      totalEarnings: 3120
    },
    expertise: ['Computer Vision', 'OpenCV', 'YOLO', 'Image Segmentation'],
    currentlyLearning: ['3D Vision', 'GANs'],
    achievements: [
      { id: 1, name: 'CV Expert', description: 'Certified in CV', icon: '📷' },
      { id: 2, name: 'Helpful Hand', description: '40+ students', icon: '🤝' }
    ],
    posts: [
      { type: 'tip', time: '2h ago', context: 'Computer Vision > OpenCV', content: 'Always convert to grayscale before edge detection. It reduces noise and speeds up processing 3x!', stats: { helpful: 28, replies: 5, goodwill: 18 } },
      { type: 'answer', time: '1d ago', context: 'The Commons > AI/ML', content: 'For image segmentation, start with U-Net. It\'s the gold standard for a reason - works great even with small datasets.', replyTo: 'Best architecture for segmentation?', stats: { helpful: 35, replies: 8, goodwill: 24 } }
    ],
    coursesTaken: [
      { community: 'CV Academy', courses: [
        { title: 'Computer Vision with Python', status: 'completed', hours: 35, date: 'Mar 2024', score: 95, rank: 'Top 4%', skills: ['OpenCV', 'YOLO', 'Segmentation'] },
        { title: 'Deep Learning for Vision', status: 'completed', hours: 30, date: 'Apr 2024', score: 92, rank: 'Top 7%', skills: ['CNNs', 'Transfer Learning', 'Fine-tuning'] }
      ]}
    ],
    coursesTaught: [
      { title: 'Computer Vision with Python', community: 'CV Academy', students: 32, rating: 4.88, reviews: 27, hoursTaught: 78, topReview: { stars: 5, text: 'Olivia\'s real-world examples are amazing!', author: '@cv_learner' } },
      { title: 'OpenCV Masterclass', community: 'CV Academy', students: 13, rating: 4.85, reviews: 11, hoursTaught: 32, topReview: { stars: 5, text: 'Finally understand contours!', author: '@image_newbie' } }
    ],
    teachingStats: { students: 45, rating: 4.88, comeback: 89, earned: 3120 }
  },

  // Course 6: Natural Language Processing
  'NLPMastermind': {
    id: 'NLPMastermind',
    name: 'Nicholas Lopez',
    username: '@NLPMastermind',
    roles: ['student', 'teacher'],
    userType: 'student_teacher',
    avatar: 'https://i.pravatar.cc/150?img=15',
    avatarColor: '#17bf63',
    bio: 'NLP engineer building chatbots and sentiment analysis tools. Transformers changed everything! Teaching NLP to spread the knowledge.',
    location: 'Washington, DC',
    website: 'https://nlpmastermind.ai',
    joinedDate: 'November 2023',
    stats: {
      coursesCompleted: 11,
      coursesTeaching: 3,
      studentsHelped: 58,
      hoursLearned: 198,
      avgRating: 4.91,
      totalEarnings: 4560
    },
    expertise: ['NLP', 'BERT', 'GPT', 'Text Classification', 'Named Entity Recognition'],
    currentlyLearning: ['LLM Applications', 'RAG Systems'],
    achievements: [
      { id: 1, name: 'Language Master', description: 'NLP certified', icon: '💬' },
      { id: 2, name: 'Word Wizard', description: 'Built 5 NLP projects', icon: '📝' }
    ],
    posts: [
      { type: 'tip', time: '1h ago', context: 'NLP > Transformers', content: 'Fine-tuning BERT tip: Freeze lower layers first, then gradually unfreeze. Your model will converge faster!', stats: { helpful: 45, replies: 12, goodwill: 30 } },
      { type: 'answer', time: '6h ago', context: 'The Commons > AI/ML', content: 'For sentiment analysis, start with DistilBERT - 97% of BERT\'s accuracy at 60% the size. Perfect for production!', replyTo: 'Best model for sentiment analysis?', stats: { helpful: 38, replies: 7, goodwill: 25 } }
    ],
    coursesTaken: [
      { community: 'NLP Academy', courses: [
        { title: 'Natural Language Processing', status: 'completed', hours: 40, date: 'Feb 2024', score: 96, rank: 'Top 3%', skills: ['Tokenization', 'Embeddings', 'Transformers'] },
        { title: 'BERT & GPT Deep Dive', status: 'completed', hours: 30, date: 'Apr 2024', score: 94, rank: 'Top 5%', skills: ['Fine-tuning', 'Prompt Engineering', 'RAG'] }
      ]}
    ],
    coursesTaught: [
      { title: 'Natural Language Processing', community: 'NLP Academy', students: 42, rating: 4.91, reviews: 36, hoursTaught: 98, topReview: { stars: 5, text: 'Nicholas explains transformers like no one else!', author: '@nlp_newbie' } },
      { title: 'Chatbot Development', community: 'NLP Academy', students: 16, rating: 4.88, reviews: 14, hoursTaught: 38, topReview: { stars: 5, text: 'Built my first chatbot in 2 weeks!', author: '@bot_builder' } }
    ],
    teachingStats: { students: 58, rating: 4.91, comeback: 91, earned: 4560 }
  },

  'TextMiner_Pro': {
    id: 'TextMiner_Pro',
    name: 'Tanya Morrison',
    username: '@TextMiner_Pro',
    roles: ['student', 'teacher'],
    userType: 'student_teacher',
    avatar: 'https://i.pravatar.cc/150?img=21',
    avatarColor: '#17bf63',
    bio: 'From linguistics to NLP engineering. Fascinated by how machines understand human language. Teaching text mining and loving it!',
    location: 'Philadelphia, PA',
    website: null,
    joinedDate: 'January 2024',
    stats: {
      coursesCompleted: 5,
      coursesTeaching: 1,
      studentsHelped: 19,
      hoursLearned: 88,
      avgRating: 4.75,
      totalEarnings: 1340
    },
    expertise: ['Text Mining', 'Sentiment Analysis', 'Python'],
    currentlyLearning: ['Transformer Models', 'Speech Recognition'],
    achievements: [
      { id: 1, name: 'Text Expert', description: 'Completed NLP course', icon: '📊' }
    ],
    posts: [
      { type: 'win', time: '5h ago', context: 'NLP > Projects', content: 'My sentiment analyzer is live! Analyzing 10K tweets per minute for a marketing agency!', badge: 'Production Ready', stats: { likes: 28, replies: 9 } },
      { type: 'question', time: '3d ago', context: 'NLP > Text Processing', content: 'Best approach for handling sarcasm in sentiment analysis? My model keeps getting fooled.', stats: { replies: 8, resolved: true } }
    ],
    coursesTaken: [
      { community: 'NLP Academy', courses: [
        { title: 'Natural Language Processing', status: 'completed', hours: 35, date: 'Mar 2024', score: 88, rank: 'Top 12%', skills: ['Text Processing', 'Sentiment Analysis', 'NER'] },
        { title: 'Text Mining Essentials', status: 'completed', hours: 20, date: 'Feb 2024', score: 91, rank: 'Top 8%', skills: ['Regex', 'Topic Modeling', 'Clustering'] },
        { title: 'Transformer Models', status: 'in-progress', hours: 12, progress: 45, skills: ['Attention', 'BERT Basics'] }
      ]}
    ],
    coursesTaught: [
      { title: 'Text Mining Essentials', community: 'NLP Academy', students: 19, rating: 4.75, reviews: 16, hoursTaught: 42, topReview: { stars: 5, text: 'Tanya\'s linguistics background adds great depth!', author: '@text_learner' } }
    ],
    teachingStats: { students: 19, rating: 4.75, comeback: 84, earned: 1340 }
  },

  // Course 7: Data Science Fundamentals
  'DataDriven_Dan': {
    id: 'DataDriven_Dan',
    name: 'Daniel Wright',
    username: '@DataDriven_Dan',
    roles: ['student'],
    userType: 'student',
    avatar: 'https://i.pravatar.cc/150?img=17',
    avatarColor: '#794BC4',
    bio: 'Business analyst learning data science. Excel power user transitioning to Python. Data tells stories, and I want to tell them better!',
    location: 'Atlanta, GA',
    website: null,
    joinedDate: 'March 2024',
    stats: {
      coursesCompleted: 2,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 48,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['Excel', 'SQL Basics', 'Data Visualization'],
    currentlyLearning: ['Data Science Fundamentals', 'Python for Data Analysis'],
    achievements: [
      { id: 1, name: 'Data Journey', description: 'Started DS path', icon: '📈' }
    ],
    posts: [
      { type: 'question', time: '4h ago', context: 'Data Science > Python', content: 'Coming from Excel, what\'s the Pandas equivalent of VLOOKUP? Merge or join?', stats: { replies: 9, resolved: true } },
      { type: 'win', time: '1w ago', context: 'Data Science > Projects', content: 'Replaced a 2-hour Excel report with a 10-second Python script! My boss is impressed!', badge: 'Automation Win', stats: { likes: 42, replies: 11 } }
    ],
    coursesTaken: [
      { community: 'Data Academy', courses: [
        { title: 'SQL Fundamentals', status: 'completed', hours: 15, date: 'Apr 2024', score: 84, rank: 'Top 22%', skills: ['SELECT', 'JOINs', 'Aggregations'] },
        { title: 'Excel to Python', status: 'completed', hours: 12, date: 'May 2024', score: 87, rank: 'Top 18%', skills: ['Pandas Basics', 'DataFrames'] },
        { title: 'Data Science Fundamentals', status: 'in-progress', hours: 10, progress: 35, skills: ['Statistics', 'Visualization'] }
      ]}
    ],
    coursesTaught: []
  },

  'AnalyticsAce': {
    id: 'AnalyticsAce',
    name: 'Angela Chen',
    username: '@AnalyticsAce',
    roles: ['student', 'teacher'],
    userType: 'student_teacher',
    avatar: 'https://i.pravatar.cc/150?img=26',
    avatarColor: '#794BC4',
    bio: 'Senior Data Analyst at a fintech startup. Teaching data science fundamentals because sharing knowledge multiplies it!',
    location: 'San Francisco, CA',
    website: 'https://analyticsace.io',
    joinedDate: 'October 2023',
    stats: {
      coursesCompleted: 14,
      coursesTeaching: 4,
      studentsHelped: 78,
      hoursLearned: 245,
      avgRating: 4.93,
      totalEarnings: 5890
    },
    expertise: ['Data Analysis', 'Python', 'Pandas', 'SQL', 'Tableau', 'Statistics'],
    currentlyLearning: ['Machine Learning Engineering'],
    achievements: [
      { id: 1, name: 'Data Master', description: 'All DS courses done', icon: '📊' },
      { id: 2, name: 'Super Teacher', description: '70+ students', icon: '👨‍🏫' },
      { id: 3, name: 'Top Earner', description: '$5000+ earned', icon: '💎' }
    ],
    posts: [
      { type: 'tip', time: '30m ago', context: 'Data Science > Pandas', content: 'Use df.memory_usage(deep=True) to find memory hogs. I reduced a 2GB DataFrame to 400MB with proper dtypes!', stats: { helpful: 52, replies: 14, goodwill: 35 } },
      { type: 'answer', time: '3h ago', context: 'The Commons > Analytics', content: 'For A/B testing, always calculate sample size BEFORE running the experiment. Power analysis is your friend!', replyTo: 'How long should I run my A/B test?', stats: { helpful: 41, replies: 8, goodwill: 28 } }
    ],
    coursesTaken: [
      { community: 'Data Academy', courses: [
        { title: 'Data Science Fundamentals', status: 'completed', hours: 35, date: 'Jan 2024', score: 97, rank: 'Top 2%', skills: ['Statistics', 'Pandas', 'Visualization'] },
        { title: 'Advanced Analytics', status: 'completed', hours: 28, date: 'Mar 2024', score: 95, rank: 'Top 4%', skills: ['A/B Testing', 'Regression', 'Forecasting'] }
      ]}
    ],
    coursesTaught: [
      { title: 'Data Science Fundamentals', community: 'Data Academy', students: 52, rating: 4.93, reviews: 45, hoursTaught: 125, topReview: { stars: 5, text: 'Angela makes statistics fun and practical!', author: '@data_newbie' } },
      { title: 'SQL for Data Analysis', community: 'Data Academy', students: 26, rating: 4.91, reviews: 22, hoursTaught: 58, topReview: { stars: 5, text: 'Best SQL course for analysts!', author: '@sql_learner' } }
    ],
    teachingStats: { students: 78, rating: 4.93, comeback: 92, earned: 5890 }
  },

  // Course 8: Business Intelligence & Analytics
  'BIDashboardPro': {
    id: 'BIDashboardPro',
    name: 'Brian Davis',
    username: '@BIDashboardPro',
    roles: ['student'],
    userType: 'student',
    avatar: 'https://i.pravatar.cc/150?img=18',
    avatarColor: '#3498DB',
    bio: 'Finance professional learning BI tools. Building executive dashboards that actually get used. Data visualization enthusiast.',
    location: 'Dallas, TX',
    website: null,
    joinedDate: 'February 2024',
    stats: {
      coursesCompleted: 3,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 56,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['Excel', 'Power BI Basics', 'Financial Modeling'],
    currentlyLearning: ['Business Intelligence & Analytics', 'Tableau'],
    achievements: [
      { id: 1, name: 'Dashboard Creator', description: 'First BI project', icon: '📉' }
    ],
    posts: [
      { type: 'win', time: '6h ago', context: 'BI & Analytics > Power BI', content: 'CFO loved my financial dashboard! Real-time P&L tracking saved hours of manual reporting!', badge: 'Executive Dashboard', stats: { likes: 35, replies: 8 } },
      { type: 'question', time: '2d ago', context: 'BI & Analytics > Best Practices', content: 'Power BI vs Tableau for financial reporting? Need to present to C-suite.', stats: { replies: 12, resolved: true } }
    ],
    coursesTaken: [
      { community: 'BI Academy', courses: [
        { title: 'Power BI Fundamentals', status: 'completed', hours: 18, date: 'Apr 2024', score: 89, rank: 'Top 14%', skills: ['DAX Basics', 'Visualizations', 'Data Modeling'] },
        { title: 'Financial Dashboards', status: 'completed', hours: 15, date: 'May 2024', score: 92, rank: 'Top 9%', skills: ['KPIs', 'Variance Analysis', 'Drill-through'] },
        { title: 'Business Intelligence & Analytics', status: 'in-progress', hours: 12, progress: 50, skills: ['Strategy', 'Governance'] }
      ]}
    ],
    coursesTaught: []
  },

  'TableauNewbie': {
    id: 'TableauNewbie',
    name: 'Tracy Nelson',
    username: '@TableauNewbie',
    roles: ['student'],
    userType: 'student',
    avatar: 'https://i.pravatar.cc/150?img=29',
    avatarColor: '#3498DB',
    bio: 'Marketing manager exploring data visualization. Want to make data-driven decisions easier for my team. Learning Tableau step by step.',
    location: 'Minneapolis, MN',
    website: null,
    joinedDate: 'April 2024',
    stats: {
      coursesCompleted: 1,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 24,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['Marketing Analytics', 'Google Analytics'],
    currentlyLearning: ['Business Intelligence & Analytics'],
    achievements: [],
    posts: [
      { type: 'question', time: '8h ago', context: 'BI & Analytics > Tableau', content: 'How do I connect Tableau to Google Analytics 4? The new GA4 interface is confusing!', stats: { replies: 5, resolved: false } },
      { type: 'win', time: '2w ago', context: 'BI & Analytics > Getting Started', content: 'Created my first Tableau viz! Campaign performance dashboard for my team!', badge: 'First Viz', stats: { likes: 18, replies: 6 } }
    ],
    coursesTaken: [
      { community: 'BI Academy', courses: [
        { title: 'Tableau Fundamentals', status: 'completed', hours: 14, date: 'May 2024', score: 81, rank: 'Top 28%', skills: ['Charts', 'Filters', 'Calculations'] },
        { title: 'Business Intelligence & Analytics', status: 'in-progress', hours: 8, progress: 30, skills: ['BI Strategy', 'Data Sources'] }
      ]}
    ],
    coursesTaught: []
  },

  // Course 9: Full-Stack Web Development
  'FullStackFiona': {
    id: 'FullStackFiona',
    name: 'Fiona Rodriguez',
    username: '@FullStackFiona',
    roles: ['student'],
    userType: 'student',
    avatar: 'https://i.pravatar.cc/150?img=32',
    avatarColor: '#E74C3C',
    bio: 'Graphic designer learning full-stack development. Building my own portfolio site from scratch. React is amazing!',
    location: 'Phoenix, AZ',
    website: 'https://fionarodriguez.design',
    joinedDate: 'January 2024',
    stats: {
      coursesCompleted: 4,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 78,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['HTML/CSS', 'JavaScript', 'React Basics', 'UI Design'],
    currentlyLearning: ['Full-Stack Web Development', 'Node.js Backend Development'],
    achievements: [
      { id: 1, name: 'First Deploy', description: 'Deployed first app', icon: '🚀' }
    ],
    posts: [
      { type: 'win', time: '3h ago', context: 'Web Dev > React', content: 'My portfolio site is live! Built with React + Framer Motion for animations!', badge: 'Portfolio Complete', stats: { likes: 56, replies: 15 } },
      { type: 'question', time: '1d ago', context: 'Web Dev > CSS', content: 'CSS Grid vs Flexbox for complex layouts? I keep mixing them up!', stats: { replies: 11, resolved: true } }
    ],
    coursesTaken: [
      { community: 'Web Dev Academy', courses: [
        { title: 'HTML & CSS Mastery', status: 'completed', hours: 20, date: 'Feb 2024', score: 94, rank: 'Top 6%', skills: ['Flexbox', 'Grid', 'Animations'] },
        { title: 'JavaScript Fundamentals', status: 'completed', hours: 22, date: 'Mar 2024', score: 88, rank: 'Top 14%', skills: ['ES6', 'DOM', 'Async'] },
        { title: 'React Fundamentals', status: 'completed', hours: 25, date: 'Apr 2024', score: 91, rank: 'Top 10%', skills: ['Components', 'Hooks', 'State'] },
        { title: 'Full-Stack Web Development', status: 'in-progress', hours: 15, progress: 45, skills: ['Node.js', 'Express'] }
      ]}
    ],
    coursesTaught: []
  },

  'WebDev_Journey': {
    id: 'WebDev_Journey',
    name: 'William Jackson',
    username: '@WebDev_Journey',
    roles: ['student', 'teacher'],
    userType: 'student_teacher',
    avatar: 'https://i.pravatar.cc/150?img=22',
    avatarColor: '#E74C3C',
    bio: 'From zero to full-stack in 8 weeks! Now I teach web development and help others start their coding journey. The flywheel is real!',
    location: 'Houston, TX',
    website: 'https://webdevjourney.com',
    joinedDate: 'November 2023',
    stats: {
      coursesCompleted: 10,
      coursesTeaching: 3,
      studentsHelped: 52,
      hoursLearned: 180,
      avgRating: 4.87,
      totalEarnings: 3890
    },
    expertise: ['React', 'Node.js', 'MongoDB', 'Express', 'Full-Stack Development'],
    currentlyLearning: ['TypeScript', 'Next.js'],
    achievements: [
      { id: 1, name: 'Full Stack', description: 'All web courses done', icon: '🌐' },
      { id: 2, name: 'Career Changer', description: 'New career started', icon: '🎯' }
    ],
    posts: [
      { type: 'tip', time: '2h ago', context: 'Web Dev > React', content: 'useState for simple state, useReducer for complex. Don\'t overthink it - if useState gets messy, switch to reducer!', stats: { helpful: 38, replies: 9, goodwill: 25 } },
      { type: 'answer', time: '5h ago', context: 'The Commons > Career', content: 'Don\'t wait until you feel "ready" to apply for jobs. I got hired at 60% of where I thought I needed to be!', replyTo: 'When am I ready for junior dev jobs?', stats: { helpful: 67, replies: 18, goodwill: 45 } }
    ],
    coursesTaken: [
      { community: 'Web Dev Academy', courses: [
        { title: 'Full-Stack Web Development', status: 'completed', hours: 50, date: 'Feb 2024', score: 93, rank: 'Top 6%', skills: ['MERN Stack', 'REST APIs', 'Auth'] },
        { title: 'React Advanced Patterns', status: 'completed', hours: 25, date: 'Apr 2024', score: 90, rank: 'Top 10%', skills: ['Custom Hooks', 'Context', 'Performance'] }
      ]}
    ],
    coursesTaught: [
      { title: 'Full-Stack Web Development', community: 'Web Dev Academy', students: 35, rating: 4.87, reviews: 30, hoursTaught: 85, topReview: { stars: 5, text: 'William\'s career change story is inspiring!', author: '@aspiring_dev' } },
      { title: 'React for Beginners', community: 'Web Dev Academy', students: 17, rating: 4.85, reviews: 14, hoursTaught: 42, topReview: { stars: 5, text: 'Makes React feel approachable!', author: '@react_newbie' } }
    ],
    teachingStats: { students: 52, rating: 4.87, comeback: 88, earned: 3890 }
  },

  // Course 10: DevOps & CI/CD Mastery
  'DevOpsDerek': {
    id: 'DevOpsDerek',
    name: 'Derek Thompson',
    username: '@DevOpsDerek',
    roles: ['student'],
    userType: 'student',
    avatar: 'https://i.pravatar.cc/150?img=30',
    avatarColor: '#4A90E2',
    bio: 'System administrator learning DevOps. Automating everything I can. Jenkins and GitHub Actions are my new best friends.',
    location: 'Detroit, MI',
    website: null,
    joinedDate: 'February 2024',
    stats: {
      coursesCompleted: 3,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 62,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['Linux', 'Bash Scripting', 'Jenkins Basics'],
    currentlyLearning: ['DevOps & CI/CD Mastery', 'Docker'],
    achievements: [
      { id: 1, name: 'Pipeline Builder', description: 'First CI/CD setup', icon: '🔄' }
    ],
    posts: [
      { type: 'win', time: '5h ago', context: 'DevOps > CI/CD', content: 'First GitHub Actions workflow is running! Auto-deploys to staging on every PR merge!', badge: 'CI/CD Active', stats: { likes: 28, replies: 7 } },
      { type: 'question', time: '2d ago', context: 'DevOps > Docker', content: 'Docker Compose vs Kubernetes for a small team? We only have 5 services.', stats: { replies: 14, resolved: true } }
    ],
    coursesTaken: [
      { community: 'DevOps Academy', courses: [
        { title: 'Linux Administration', status: 'completed', hours: 20, date: 'Mar 2024', score: 86, rank: 'Top 16%', skills: ['Shell', 'Services', 'Networking'] },
        { title: 'Jenkins Fundamentals', status: 'completed', hours: 15, date: 'Apr 2024', score: 88, rank: 'Top 14%', skills: ['Pipelines', 'Plugins', 'Agents'] },
        { title: 'DevOps & CI/CD Mastery', status: 'in-progress', hours: 18, progress: 55, skills: ['GitHub Actions', 'Automation'] }
      ]}
    ],
    coursesTaught: []
  },

  'Pipeline_Pro': {
    id: 'Pipeline_Pro',
    name: 'Priscilla Wong',
    username: '@Pipeline_Pro',
    roles: ['student', 'teacher'],
    userType: 'student_teacher',
    avatar: 'https://i.pravatar.cc/150?img=36',
    avatarColor: '#4A90E2',
    bio: 'DevOps engineer with 5 years experience. Teaching CI/CD because proper pipelines save lives (and weekends). Automation is freedom!',
    location: 'San Diego, CA',
    website: 'https://pipelinepro.dev',
    joinedDate: 'September 2023',
    stats: {
      coursesCompleted: 16,
      coursesTeaching: 4,
      studentsHelped: 86,
      hoursLearned: 268,
      avgRating: 4.94,
      totalEarnings: 6340
    },
    expertise: ['CI/CD', 'Jenkins', 'GitHub Actions', 'Docker', 'Kubernetes', 'Terraform'],
    currentlyLearning: ['SRE Practices', 'Platform Engineering'],
    achievements: [
      { id: 1, name: 'DevOps Guru', description: 'All DevOps certs', icon: '⚙️' },
      { id: 2, name: 'Pipeline Master', description: '100+ pipelines built', icon: '🏗️' }
    ],
    posts: [
      { type: 'tip', time: '1h ago', context: 'DevOps > CI/CD', content: 'Always separate build and deploy stages. Your future self will thank you when debugging production issues at 2am!', stats: { helpful: 48, replies: 11, goodwill: 32 } },
      { type: 'answer', time: '4h ago', context: 'The Commons > DevOps', content: 'For secrets management: HashiCorp Vault for enterprise, GitHub Secrets for smaller projects. Never commit .env files!', replyTo: 'How to manage secrets in CI/CD?', stats: { helpful: 42, replies: 9, goodwill: 28 } }
    ],
    coursesTaken: [
      { community: 'DevOps Academy', courses: [
        { title: 'DevOps & CI/CD Mastery', status: 'completed', hours: 45, date: 'Dec 2023', score: 98, rank: 'Top 1%', skills: ['Pipelines', 'Automation', 'Monitoring'] },
        { title: 'Kubernetes Deep Dive', status: 'completed', hours: 35, date: 'Feb 2024', score: 96, rank: 'Top 3%', skills: ['Deployments', 'Services', 'Helm'] }
      ]}
    ],
    coursesTaught: [
      { title: 'DevOps & CI/CD Mastery', community: 'DevOps Academy', students: 58, rating: 4.94, reviews: 50, hoursTaught: 135, topReview: { stars: 5, text: 'Priscilla\'s real-world examples are gold!', author: '@devops_newbie' } },
      { title: 'GitHub Actions Workshop', community: 'DevOps Academy', students: 28, rating: 4.92, reviews: 24, hoursTaught: 62, topReview: { stars: 5, text: 'Automated my entire workflow!', author: '@automation_fan' } }
    ],
    teachingStats: { students: 86, rating: 4.94, comeback: 93, earned: 6340 }
  },

  // Course 11: Microservices Architecture
  'MicroservicesMike': {
    id: 'MicroservicesMike',
    name: 'Michael Brown',
    username: '@MicroservicesMike',
    roles: ['student'],
    userType: 'student',
    avatar: 'https://i.pravatar.cc/150?img=37',
    avatarColor: '#1ABC9C',
    bio: 'Backend developer learning microservices. Decomposing monoliths is an art. Docker and Kubernetes are challenging but worth it!',
    location: 'Nashville, TN',
    website: null,
    joinedDate: 'March 2024',
    stats: {
      coursesCompleted: 2,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 42,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['Java', 'Spring Boot', 'Docker Basics'],
    currentlyLearning: ['Microservices Architecture', 'Kubernetes'],
    achievements: [
      { id: 1, name: 'Container Start', description: 'First Docker app', icon: '📦' }
    ],
    posts: [
      { type: 'question', time: '7h ago', context: 'Microservices > Architecture', content: 'When to use message queues vs direct API calls between services? Our latency is getting high.', stats: { replies: 8, resolved: false } },
      { type: 'win', time: '4d ago', context: 'Microservices > Docker', content: 'Decomposed our monolith into 3 services! Docker Compose makes local dev so much easier!', badge: 'First Split', stats: { likes: 22, replies: 6 } }
    ],
    coursesTaken: [
      { community: 'Architecture Academy', courses: [
        { title: 'Spring Boot Fundamentals', status: 'completed', hours: 18, date: 'Apr 2024', score: 85, rank: 'Top 18%', skills: ['REST', 'JPA', 'Security'] },
        { title: 'Docker for Developers', status: 'completed', hours: 14, date: 'May 2024', score: 87, rank: 'Top 15%', skills: ['Containers', 'Compose', 'Networks'] },
        { title: 'Microservices Architecture', status: 'in-progress', hours: 12, progress: 40, skills: ['Service Design', 'Communication'] }
      ]}
    ],
    coursesTaught: []
  },

  'ContainerKing': {
    id: 'ContainerKing',
    name: 'Charles Kim',
    username: '@ContainerKing',
    roles: ['student'],
    userType: 'student',
    avatar: 'https://i.pravatar.cc/150?img=42',
    avatarColor: '#1ABC9C',
    bio: 'Software architect diving deep into containerization. Building my first multi-container app. The microservices journey begins!',
    location: 'Orlando, FL',
    website: 'https://containerking.io',
    joinedDate: 'February 2024',
    stats: {
      coursesCompleted: 5,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 96,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['Docker', 'Container Orchestration', 'System Design'],
    currentlyLearning: ['Microservices Architecture', 'Service Mesh'],
    achievements: [
      { id: 1, name: 'Multi-Container', description: 'First compose app', icon: '🐳' }
    ],
    posts: [
      { type: 'tip', time: '3h ago', context: 'Microservices > Docker', content: 'Use multi-stage builds! Cut my image size from 1.2GB to 180MB. Faster deployments everywhere!', stats: { helpful: 35, replies: 8, goodwill: 24 } },
      { type: 'question', time: '1d ago', context: 'Microservices > Kubernetes', content: 'Istio vs Linkerd for service mesh? Need something that won\'t eat all our resources.', stats: { replies: 11, resolved: true } }
    ],
    coursesTaken: [
      { community: 'Architecture Academy', courses: [
        { title: 'Docker Deep Dive', status: 'completed', hours: 22, date: 'Mar 2024', score: 92, rank: 'Top 8%', skills: ['Optimization', 'Security', 'Networking'] },
        { title: 'Kubernetes Fundamentals', status: 'completed', hours: 28, date: 'Apr 2024', score: 89, rank: 'Top 12%', skills: ['Pods', 'Deployments', 'Services'] },
        { title: 'Microservices Architecture', status: 'in-progress', hours: 20, progress: 65, skills: ['Patterns', 'Resilience'] }
      ]}
    ],
    coursesTaught: []
  },

  // Course 12: AI for Robotics Coding Lab
  'RoboticsGeek29': {
    id: 'RoboticsGeek29',
    name: 'Rachel Green',
    username: '@RoboticsGeek29',
    roles: ['student'],
    userType: 'student',
    avatar: 'https://i.pravatar.cc/150?img=39',
    avatarColor: '#50C878',
    bio: 'Mechanical engineer exploring robotics programming. Path planning algorithms are fascinating! Building autonomous systems is my dream.',
    location: 'Pittsburgh, PA',
    website: 'https://roboticsgeek.tech',
    joinedDate: 'January 2024',
    stats: {
      coursesCompleted: 4,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 82,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['Python', 'ROS Basics', 'Path Planning', 'Control Systems'],
    currentlyLearning: ['AI for Robotics Coding Lab', 'Computer Vision'],
    achievements: [
      { id: 1, name: 'Robot Builder', description: 'First robot programmed', icon: '🤖' }
    ],
    posts: [
      { type: 'win', time: '4h ago', context: 'Robotics > Projects', content: 'My robot navigates my apartment autonomously! A* pathfinding + obstacle detection working together!', badge: 'Autonomous Nav', stats: { likes: 42, replies: 11 } },
      { type: 'question', time: '2d ago', context: 'Robotics > ROS', content: 'ROS1 vs ROS2 for a new project? My team is debating which to use.', stats: { replies: 15, resolved: true } }
    ],
    coursesTaken: [
      { community: 'Robotics Academy', courses: [
        { title: 'ROS Fundamentals', status: 'completed', hours: 25, date: 'Mar 2024', score: 88, rank: 'Top 14%', skills: ['Nodes', 'Topics', 'Services'] },
        { title: 'Path Planning Algorithms', status: 'completed', hours: 20, date: 'Apr 2024', score: 91, rank: 'Top 9%', skills: ['A*', 'RRT', 'Dijkstra'] },
        { title: 'AI for Robotics Coding Lab', status: 'in-progress', hours: 18, progress: 55, skills: ['Perception', 'Decision Making'] }
      ]}
    ],
    coursesTaught: []
  },

  'BotBuilder_Pro': {
    id: 'BotBuilder_Pro',
    name: 'Benjamin Taylor',
    username: '@BotBuilder_Pro',
    roles: ['student', 'teacher'],
    userType: 'student_teacher',
    avatar: 'https://i.pravatar.cc/150?img=51',
    avatarColor: '#50C878',
    bio: 'Robotics engineer specializing in autonomous systems. Teaching path planning and robot control. The future is autonomous!',
    location: 'Boulder, CO',
    website: 'https://botbuilderpro.ai',
    joinedDate: 'October 2023',
    stats: {
      coursesCompleted: 12,
      coursesTeaching: 3,
      studentsHelped: 41,
      hoursLearned: 195,
      avgRating: 4.89,
      totalEarnings: 3240
    },
    expertise: ['Robotics', 'ROS', 'Path Planning', 'SLAM', 'Autonomous Systems'],
    currentlyLearning: ['Reinforcement Learning for Robotics'],
    achievements: [
      { id: 1, name: 'Bot Master', description: 'Robotics certified', icon: '🦾' },
      { id: 2, name: 'Autonomy Expert', description: '10 bots programmed', icon: '🎮' }
    ],
    posts: [
      { type: 'tip', time: '2h ago', context: 'Robotics > SLAM', content: 'For indoor SLAM, combine LiDAR with IMU data. Pure visual SLAM fails in featureless corridors!', stats: { helpful: 38, replies: 9, goodwill: 25 } },
      { type: 'answer', time: '6h ago', context: 'The Commons > Robotics', content: 'Start with simulation (Gazebo) before hardware. It\'s faster to debug and won\'t break expensive equipment!', replyTo: 'How to start with robotics?', stats: { helpful: 45, replies: 12, goodwill: 30 } }
    ],
    coursesTaken: [
      { community: 'Robotics Academy', courses: [
        { title: 'AI for Robotics Coding Lab', status: 'completed', hours: 40, date: 'Jan 2024', score: 95, rank: 'Top 4%', skills: ['Perception', 'Planning', 'Control'] },
        { title: 'SLAM & Localization', status: 'completed', hours: 30, date: 'Mar 2024', score: 93, rank: 'Top 6%', skills: ['Mapping', 'Localization', 'Sensor Fusion'] }
      ]}
    ],
    coursesTaught: [
      { title: 'AI for Robotics Coding Lab', community: 'Robotics Academy', students: 28, rating: 4.89, reviews: 24, hoursTaught: 68, topReview: { stars: 5, text: 'Ben makes robotics accessible to beginners!', author: '@robot_newbie' } },
      { title: 'Path Planning Workshop', community: 'Robotics Academy', students: 13, rating: 4.87, reviews: 11, hoursTaught: 32, topReview: { stars: 5, text: 'Finally understand A* algorithm!', author: '@algo_learner' } }
    ],
    teachingStats: { students: 41, rating: 4.89, comeback: 88, earned: 3240 }
  },

  // Course 13: AI for Medical Diagnostics Coding
  'MedTechInnovator': {
    id: 'MedTechInnovator',
    name: 'Maria Santos',
    username: '@MedTechInnovator',
    roles: ['student'],
    userType: 'student',
    avatar: 'https://i.pravatar.cc/150?img=41',
    avatarColor: '#E74C3C',
    bio: 'MD exploring AI in healthcare. Building diagnostic tools to help doctors make better decisions. Medicine meets machine learning!',
    location: 'Baltimore, MD',
    website: 'https://medtechinnovator.health',
    joinedDate: 'December 2023',
    stats: {
      coursesCompleted: 6,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 112,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['Medical Imaging', 'Python', 'Healthcare AI', 'Diagnostics'],
    currentlyLearning: ['AI for Medical Diagnostics Coding', 'Deep Learning'],
    achievements: [
      { id: 1, name: 'Health AI', description: 'First diagnostic model', icon: '🏥' }
    ],
    posts: [
      { type: 'win', time: '6h ago', context: 'Medical AI > Projects', content: 'My chest X-ray classifier achieved 94% sensitivity for pneumonia detection! IRB approved for pilot study!', badge: 'Clinical Ready', stats: { likes: 58, replies: 14 } },
      { type: 'question', time: '3d ago', context: 'Medical AI > Ethics', content: 'How do you handle model explainability for FDA submissions? Need to justify AI decisions to regulators.', stats: { replies: 18, resolved: true } }
    ],
    coursesTaken: [
      { community: 'Healthcare AI Academy', courses: [
        { title: 'Medical Image Analysis', status: 'completed', hours: 30, date: 'Feb 2024', score: 93, rank: 'Top 7%', skills: ['DICOM', 'Segmentation', 'Classification'] },
        { title: 'Healthcare ML Ethics', status: 'completed', hours: 15, date: 'Mar 2024', score: 95, rank: 'Top 5%', skills: ['Bias', 'Fairness', 'Regulations'] },
        { title: 'AI for Medical Diagnostics Coding', status: 'in-progress', hours: 22, progress: 70, skills: ['Diagnosis', 'Validation'] }
      ]}
    ],
    coursesTaught: []
  },

  'HealthAI_Student': {
    id: 'HealthAI_Student',
    name: 'Hannah White',
    username: '@HealthAI_Student',
    roles: ['student', 'teacher'],
    userType: 'student_teacher',
    avatar: 'https://i.pravatar.cc/150?img=45',
    avatarColor: '#E74C3C',
    bio: 'Biomedical engineer turned AI specialist. Teaching medical AI to bridge the gap between healthcare and technology. Saving lives with code!',
    location: 'Cleveland, OH',
    website: 'https://healthaistudent.io',
    joinedDate: 'November 2023',
    stats: {
      coursesCompleted: 8,
      coursesTeaching: 2,
      studentsHelped: 34,
      hoursLearned: 145,
      avgRating: 4.86,
      totalEarnings: 2680
    },
    expertise: ['Medical AI', 'Image Classification', 'Healthcare ML', 'PyTorch'],
    currentlyLearning: ['Federated Learning for Healthcare'],
    achievements: [
      { id: 1, name: 'Medical AI Cert', description: 'Healthcare certified', icon: '⚕️' },
      { id: 2, name: 'Life Saver', description: 'Diagnostic tools built', icon: '❤️' }
    ],
    posts: [
      { type: 'tip', time: '3h ago', context: 'Medical AI > Best Practices', content: 'Always validate on external datasets! Our model dropped 15% accuracy on data from a different hospital. Domain shift is real!', stats: { helpful: 42, replies: 10, goodwill: 28 } },
      { type: 'answer', time: '1d ago', context: 'The Commons > Healthcare', content: 'For small medical datasets, use pretrained ImageNet models + aggressive augmentation. Works surprisingly well!', replyTo: 'How to train with limited medical data?', stats: { helpful: 38, replies: 8, goodwill: 25 } }
    ],
    coursesTaken: [
      { community: 'Healthcare AI Academy', courses: [
        { title: 'AI for Medical Diagnostics Coding', status: 'completed', hours: 40, date: 'Feb 2024', score: 94, rank: 'Top 5%', skills: ['Diagnosis AI', 'Clinical Validation', 'Deployment'] },
        { title: 'Medical Image Segmentation', status: 'completed', hours: 25, date: 'Apr 2024', score: 91, rank: 'Top 9%', skills: ['U-Net', '3D Segmentation', 'Annotation'] }
      ]}
    ],
    coursesTaught: [
      { title: 'AI for Medical Diagnostics Coding', community: 'Healthcare AI Academy', students: 24, rating: 4.86, reviews: 20, hoursTaught: 58, topReview: { stars: 5, text: 'Hannah bridges medicine and ML beautifully!', author: '@med_student' } },
      { title: 'Healthcare ML Basics', community: 'Healthcare AI Academy', students: 10, rating: 4.84, reviews: 8, hoursTaught: 25, topReview: { stars: 5, text: 'Perfect intro for healthcare professionals!', author: '@doc_coder' } }
    ],
    teachingStats: { students: 34, rating: 4.86, comeback: 86, earned: 2680 }
  },

  // Course 14: AI Coding Bootcamp: Python Projects
  'PythonPro88': {
    id: 'PythonPro88',
    name: 'Peter Anderson',
    username: '@PythonPro88',
    roles: ['student'],
    userType: 'student',
    avatar: 'https://i.pravatar.cc/150?img=50',
    avatarColor: '#FFD93D',
    bio: 'Self-taught programmer going pro with Python. Building ML projects one at a time. Prof. Petrova makes Python fun!',
    location: 'Columbus, OH',
    website: null,
    joinedDate: 'February 2024',
    stats: {
      coursesCompleted: 3,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 58,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['Python', 'Basic ML', 'Data Structures'],
    currentlyLearning: ['AI Coding Bootcamp: Python Projects', 'Data Science'],
    achievements: [
      { id: 1, name: 'Python Start', description: '5 projects completed', icon: '🐍' }
    ],
    posts: [
      { type: 'win', time: '5h ago', context: 'Python Bootcamp > Projects', content: 'Built a movie recommendation system! Collaborative filtering is so cool!', badge: 'Project 5 Done', stats: { likes: 24, replies: 7 } },
      { type: 'question', time: '1d ago', context: 'Python Bootcamp > ML', content: 'Overfitting on my small dataset. Cross-validation or just get more data?', stats: { replies: 9, resolved: true } }
    ],
    coursesTaken: [
      { community: 'Python Academy', courses: [
        { title: 'Python Fundamentals', status: 'completed', hours: 18, date: 'Mar 2024', score: 86, rank: 'Top 17%', skills: ['Syntax', 'Data Types', 'Functions'] },
        { title: 'Data Structures in Python', status: 'completed', hours: 15, date: 'Apr 2024', score: 84, rank: 'Top 20%', skills: ['Lists', 'Dicts', 'OOP'] },
        { title: 'AI Coding Bootcamp: Python Projects', status: 'in-progress', hours: 20, progress: 60, skills: ['ML Basics', 'Scikit-learn'] }
      ]}
    ],
    coursesTaught: []
  },

  'MLBeginner_2024': {
    id: 'MLBeginner_2024',
    name: 'Maya Lewis',
    username: '@MLBeginner_2024',
    roles: ['student', 'teacher'],
    userType: 'student_teacher',
    avatar: 'https://i.pravatar.cc/150?img=48',
    avatarColor: '#FFD93D',
    bio: 'From Python newbie to AI developer in 8 weeks! Now teaching the bootcamp. Proof that anyone can learn to code with the right system.',
    location: 'Sacramento, CA',
    website: 'https://mayalewis.dev',
    joinedDate: 'December 2023',
    stats: {
      coursesCompleted: 7,
      coursesTeaching: 2,
      studentsHelped: 28,
      hoursLearned: 134,
      avgRating: 4.82,
      totalEarnings: 2120
    },
    expertise: ['Python', 'ML Basics', 'Scikit-learn', 'Jupyter Notebooks'],
    currentlyLearning: ['Deep Learning Fundamentals'],
    achievements: [
      { id: 1, name: 'Bootcamp Graduate', description: 'All projects done', icon: '🎓' },
      { id: 2, name: 'Rapid Growth', description: 'Teacher in 8 weeks', icon: '📈' }
    ],
    posts: [
      { type: 'tip', time: '2h ago', context: 'Python Bootcamp > Getting Started', content: 'Don\'t try to understand everything at once. Build projects, break things, Google errors. That\'s how you learn!', stats: { helpful: 52, replies: 15, goodwill: 35 } },
      { type: 'answer', time: '8h ago', context: 'The Commons > Career', content: 'I was a barista 8 months ago. Now I\'m a junior ML engineer. PeerLoop\'s model works. Trust the process!', replyTo: 'Can I really learn to code from scratch?', stats: { helpful: 78, replies: 24, goodwill: 55 } }
    ],
    coursesTaken: [
      { community: 'Python Academy', courses: [
        { title: 'AI Coding Bootcamp: Python Projects', status: 'completed', hours: 45, date: 'Feb 2024', score: 92, rank: 'Top 8%', skills: ['Python', 'ML', 'Projects'] },
        { title: 'Data Science Essentials', status: 'completed', hours: 25, date: 'Mar 2024', score: 89, rank: 'Top 12%', skills: ['Pandas', 'Visualization', 'Statistics'] }
      ]}
    ],
    coursesTaught: [
      { title: 'AI Coding Bootcamp: Python Projects', community: 'Python Academy', students: 18, rating: 4.82, reviews: 15, hoursTaught: 45, topReview: { stars: 5, text: 'Maya\'s enthusiasm is contagious!', author: '@python_newbie' } },
      { title: 'Python for Absolute Beginners', community: 'Python Academy', students: 10, rating: 4.8, reviews: 8, hoursTaught: 25, topReview: { stars: 5, text: 'Perfect for complete beginners!', author: '@first_coder' } }
    ],
    teachingStats: { students: 28, rating: 4.82, comeback: 85, earned: 2120 }
  },

  // Creator: Guy Rymberg - AI Prompting Mastery
  'GuyRymberg': {
    id: 'GuyRymberg',
    name: 'Guy Rymberg',
    username: '@GuyRymberg',
    roles: ['creator'],
    userType: 'creator',
    avatar: 'https://i.pravatar.cc/150?img=13',
    avatarColor: '#1d9bf0',
    bio: 'AI teaching specialist with 15 years experience. Created the AI Prompting Mastery course. Passionate about the PeerLoop model - Learn, Teach, Earn. Former AI Lead at Google, published author of "AI Prompting for Business".',
    location: 'San Francisco, CA',
    website: 'https://guyrymberg.ai',
    joinedDate: 'October 2024',
    stats: {
      coursesCompleted: 0,
      coursesTeaching: 0,
      coursesCreated: 1,
      studentsEnrolled: 127,
      studentTeachers: 3,
      totalRevenue: 57150,
      creatorEarnings: 8573,
      hoursLearned: 0,
      avgRating: 4.9,
      totalEarnings: 8573
    },
    expertise: ['AI Prompt Engineering', 'Large Language Models', 'Business AI Strategy', 'AI Communication', 'Prompt Library Design'],
    currentlyLearning: [],
    achievements: [
      { id: 1, name: 'Course Creator', description: 'Published first course', icon: '📚' },
      { id: 2, name: 'Student-Teacher Builder', description: '3 certified S-Ts', icon: '👨‍🏫' },
      { id: 3, name: 'Top Rated Creator', description: '4.9 average rating', icon: '⭐' },
      { id: 4, name: 'Century Club', description: '100+ students enrolled', icon: '💯' }
    ],
    posts: [
      { type: 'announcement', time: '1h ago', context: 'AI Prompting Mastery', content: 'New module released: Advanced Chain-of-Thought Prompting! Check it out and let me know what you think.', stats: { likes: 89, replies: 24 } },
      { type: 'tip', time: '1d ago', context: 'The Commons > AI', content: 'The secret to great prompts: Be specific about format, give examples, and always specify the audience. Works every time!', stats: { helpful: 156, replies: 42, goodwill: 95 } }
    ],
    coursesTaken: [],
    coursesTaught: [],
    createdCourses: [15],
    studentTeachers: [
      { name: 'Marcus Chen', studentsTaught: 12 },
      { name: 'Jessica Torres', studentsTaught: 8 },
      { name: 'Alex Rivera', studentsTaught: 5 }
    ]
  },

  // Student-Teachers for AI Prompting Mastery course
  'MarcusChen_ST': {
    id: 'MarcusChen_ST',
    name: 'Marcus Chen',
    username: '@MarcusChen_ST',
    roles: ['student', 'teacher'],
    userType: 'student_teacher',
    avatar: 'https://i.pravatar.cc/150?img=52',
    avatarColor: '#1d9bf0',
    bio: 'Certified Student-Teacher for AI Prompting Mastery. Former marketing manager who discovered the power of AI prompts. Now helping others master prompt engineering while earning 70% commission!',
    location: 'Seattle, WA',
    website: null,
    joinedDate: 'November 2024',
    stats: {
      coursesCompleted: 1,
      coursesTeaching: 1,
      studentsHelped: 12,
      hoursLearned: 45,
      avgRating: 4.88,
      totalEarnings: 3780
    },
    expertise: ['AI Prompting', 'Business Applications', 'ChatGPT', 'Prompt Templates'],
    currentlyLearning: ['Advanced LLM Techniques'],
    achievements: [
      { id: 1, name: 'Certified Teacher', description: 'AI Prompting Mastery', icon: '🎓' },
      { id: 2, name: 'Dozen Club', description: '12 students taught', icon: '🔥' }
    ],
    posts: [
      { type: 'tip', time: '4h ago', context: 'AI Prompting > Templates', content: 'Save your best prompts in a library! I have 50+ templates organized by use case. Huge time saver!', stats: { helpful: 34, replies: 8, goodwill: 22 } },
      { type: 'win', time: '3d ago', context: 'AI Prompting Mastery', content: 'Just hit 12 students taught! The 70% commission is life-changing. Thank you @GuyRymberg!', badge: 'Dozen Club', stats: { likes: 45, replies: 12 } }
    ],
    coursesTaken: [
      { community: 'AI Prompting Mastery', courses: [
        { title: 'AI Prompting Mastery', status: 'completed', hours: 45, date: 'Nov 2024', score: 94, rank: 'Top 6%', skills: ['Prompt Engineering', 'Chain-of-Thought', 'Templates'] }
      ]}
    ],
    coursesTaught: [
      { title: 'AI Prompting Mastery', community: 'Guy Rymberg Academy', students: 12, rating: 4.88, reviews: 10, hoursTaught: 28, topReview: { stars: 5, text: 'Marcus explains prompting from a business perspective!', author: '@marketing_pro' } }
    ],
    certifiedCourses: [15],
    teachingStats: { students: 12, rating: 4.88, comeback: 92, earned: 3780 }
  },

  'JessicaTorres_ST': {
    id: 'JessicaTorres_ST',
    name: 'Jessica Torres',
    username: '@JessicaTorres_ST',
    roles: ['student', 'teacher'],
    userType: 'student_teacher',
    avatar: 'https://i.pravatar.cc/150?img=49',
    avatarColor: '#1d9bf0',
    bio: 'Student-Teacher for AI Prompting Mastery. Product manager by day, AI prompt teacher by passion. Love helping others unlock the power of effective AI communication.',
    location: 'Austin, TX',
    website: null,
    joinedDate: 'December 2024',
    stats: {
      coursesCompleted: 1,
      coursesTeaching: 1,
      studentsHelped: 8,
      hoursLearned: 38,
      avgRating: 4.91,
      totalEarnings: 2520
    },
    expertise: ['AI Prompting', 'Product Management', 'Business Strategy'],
    currentlyLearning: ['Advanced Prompt Engineering'],
    achievements: [
      { id: 1, name: 'Certified Teacher', description: 'AI Prompting Mastery', icon: '🎓' }
    ],
    posts: [
      { type: 'answer', time: '2h ago', context: 'AI Prompting > Use Cases', content: 'For product specs, use this template: "Act as a senior PM. Write a PRD for [feature] including user stories, acceptance criteria, and edge cases."', replyTo: 'Best prompts for product managers?', stats: { helpful: 28, replies: 6, goodwill: 18 } },
      { type: 'tip', time: '2d ago', context: 'The Commons > AI', content: 'Chain-of-thought prompting tip: Add "Let\'s think step by step" to complex problems. Accuracy jumps 20%+!', stats: { helpful: 42, replies: 11, goodwill: 28 } }
    ],
    coursesTaken: [
      { community: 'AI Prompting Mastery', courses: [
        { title: 'AI Prompting Mastery', status: 'completed', hours: 38, date: 'Dec 2024', score: 96, rank: 'Top 4%', skills: ['Prompt Engineering', 'Business Applications', 'Advanced Techniques'] }
      ]}
    ],
    coursesTaught: [
      { title: 'AI Prompting Mastery', community: 'Guy Rymberg Academy', students: 8, rating: 4.91, reviews: 7, hoursTaught: 19, topReview: { stars: 5, text: 'Jessica\'s PM background adds great context!', author: '@aspiring_pm' } }
    ],
    certifiedCourses: [15],
    teachingStats: { students: 8, rating: 4.91, comeback: 88, earned: 2520 }
  },

  // ============================================
  // DEMO USERS - These are used for demo login
  // ============================================

  // Demo: New User (first-time user experience)
  'demo_new': {
    id: 'demo_new',
    name: 'New User',
    username: '@newuser',
    email: 'newuser@demo.com',
    roles: ['student'],
    userType: 'new_user',
    avatar: 'https://i.pravatar.cc/150?img=33',
    avatarColor: '#6b7280',
    bio: 'Just joined PeerLoop! Excited to start learning.',
    location: '',
    website: null,
    joinedDate: 'January 2025',
    stats: {
      coursesCompleted: 0,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 0,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: [],
    currentlyLearning: [],
    achievements: [],
    posts: [],
    coursesTaken: [],
    coursesTaught: []
  },

  // Demo: Sarah Miller (student)
  'demo_sarah': {
    id: 'demo_sarah',
    name: 'Sarah Miller',
    username: '@sarahmiller',
    email: 'sarah@demo.com',
    roles: ['student'],
    userType: 'student',
    avatar: 'https://i.pravatar.cc/150?img=44',
    avatarColor: '#8b5cf6',
    bio: 'New to coding, excited to learn web development! Coming from a marketing background, I discovered my passion for tech and am now diving into full-stack development.',
    location: 'Austin, TX',
    website: null,
    joinedDate: 'October 2024',
    stats: {
      coursesCompleted: 3,
      coursesTeaching: 0,
      studentsHelped: 0,
      hoursLearned: 45,
      avgRating: 0,
      totalEarnings: 0
    },
    expertise: ['HTML/CSS', 'JavaScript Basics'],
    currentlyLearning: ['Full-Stack Web Development', 'React Basics'],
    achievements: [
      { id: 1, name: 'First Steps', description: 'Completed first course', icon: '👣' },
      { id: 2, name: 'HTML Hero', description: 'Mastered HTML basics', icon: '🌐' },
      { id: 3, name: 'CSS Stylist', description: 'Completed CSS module', icon: '🎨' }
    ],
    posts: [
      { type: 'question', time: '2h ago', context: 'The Commons > Web Development', content: 'What\'s the best way to learn React hooks? I keep getting confused by useState vs useEffect.', stats: { replies: 5, resolved: false } },
      { type: 'win', time: '1d ago', context: 'Code Academy > JavaScript', content: 'Just completed my first JavaScript course! Arrays were tough but finally clicking!', badge: 'JavaScript Basics', stats: { likes: 12, replies: 3 } }
    ],
    coursesTaken: [
      { community: 'Code Academy', courses: [
        { title: 'JavaScript Basics', status: 'completed', hours: 15, date: 'Jan 2025', score: 88, rank: 'Top 15%', skills: ['Variables', 'Functions', 'Arrays'] },
        { title: 'HTML & CSS Fundamentals', status: 'completed', hours: 10, date: 'Dec 2024', score: 92, rank: 'Top 10%', skills: ['HTML5', 'CSS3', 'Flexbox'] },
        { title: 'React Basics', status: 'in-progress', hours: 8, progress: 45, skills: ['Components', 'Props', 'State'] }
      ]}
    ],
    coursesTaught: []
  },

  // Demo: Alex Sanders (student-teacher)
  'demo_alex': {
    id: 'demo_alex',
    name: 'Alex Sanders',
    username: '@alexsanders',
    email: 'alex@demo.com',
    roles: ['student', 'teacher'],
    userType: 'student_teacher',
    avatar: 'https://i.pravatar.cc/150?img=3',
    avatarColor: '#22c55e',
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
    ],
    posts: [
      { type: 'answer', time: '2h ago', context: 'The Commons > Python', content: 'The key to understanding list comprehensions is thinking about them as a compact for-loop...', replyTo: 'Can someone explain list comprehensions simply?', stats: { helpful: 12, replies: 3, goodwill: 15 } },
      { type: 'win', time: '1d ago', context: 'Jane\'s AI Academy > Deep Learning', content: 'Just completed the Neural Networks module! Finally understand backpropagation!', badge: 'Neural Network Basics', stats: { likes: 8, replies: 5 } },
      { type: 'tip', time: '3d ago', context: 'The Commons > Python', content: 'Pro tip: Use print(type(variable)) to debug. 90% of beginner errors are type mismatches!', stats: { helpful: 24, replies: 8, goodwill: 20 } }
    ],
    coursesTaken: [
      { community: 'AI Academy', courses: [
        { title: 'Machine Learning Fundamentals', status: 'completed', hours: 24, date: 'Nov 2024', score: 94, rank: 'Top 5%', skills: ['Supervised Learning', 'Regression', 'Classification'] },
        { title: 'Deep Learning Fundamentals', status: 'in-progress', hours: 12, progress: 60, skills: ['Neural Networks', 'Backpropagation'] }
      ]},
      { community: 'Python Academy', courses: [
        { title: 'Advanced Python', status: 'completed', hours: 18, date: 'Oct 2024', score: 91, rank: 'Top 10%', skills: ['OOP', 'Decorators', 'Generators'] }
      ]}
    ],
    coursesTaught: [
      { title: 'Python Basics for Beginners', community: 'The Commons', students: 28, rating: 4.9, reviews: 89, hoursTaught: 45, topReview: { stars: 5, text: 'Alex explained loops so clearly!', author: '@newcoder' } },
      { title: 'Data Analysis with Pandas', community: 'Data Science Hub', students: 12, rating: 4.8, reviews: 34, hoursTaught: 22, topReview: { stars: 5, text: 'Finally understand DataFrames!', author: '@datalearner' } }
    ],
    teachingStats: { students: 47, rating: 4.9, comeback: 89, earned: 2340 }
  },

  // Demo: Marcus Johnson (admin)
  'demo_marcus': {
    id: 'demo_marcus',
    name: 'Marcus Johnson',
    username: '@marcusj',
    email: 'marcus@demo.com',
    roles: ['creator', 'instructor', 'student', 'teacher'],
    userType: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=53',
    avatarColor: '#f59e0b',
    bio: 'Platform admin and senior instructor. 15 years in tech education. Here to help build the future of peer-to-peer learning!',
    location: 'Chicago, IL',
    website: 'https://marcusjohnson.edu',
    joinedDate: 'January 2024',
    stats: {
      coursesCompleted: 45,
      coursesTeaching: 15,
      coursesCreated: 8,
      studentsHelped: 890,
      studentsEnrolled: 2340,
      hoursLearned: 520,
      avgRating: 4.98,
      totalEarnings: 45000,
      totalRevenue: 125000
    },
    expertise: ['Course Design', 'Educational Technology', 'React', 'Node.js', 'System Design', 'AWS'],
    currentlyLearning: ['AI for Education', 'Learning Analytics'],
    achievements: [
      { id: 1, name: 'Course Creator Elite', description: 'Created 5+ courses', icon: '📚' },
      { id: 2, name: 'Master Teacher', description: 'Helped 500+ students', icon: '🏆' },
      { id: 3, name: 'Top Earner', description: 'Earned $25,000+', icon: '💰' },
      { id: 4, name: 'Platform Pioneer', description: 'Original platform admin', icon: '🚀' }
    ],
    posts: [
      { type: 'announcement', time: '1h ago', context: 'The Commons > Announcements', content: 'Excited to announce our new certification program! Student-teachers can now earn official credentials.', stats: { likes: 156, replies: 42 } },
      { type: 'tip', time: '2d ago', context: 'The Commons > Teaching Tips', content: 'The best teachers learn from their students. Always ask for feedback after each session!', stats: { helpful: 89, replies: 23, goodwill: 45 } }
    ],
    coursesTaken: [
      { community: 'PeerLoop Academy', courses: [
        { title: 'Advanced Course Design', status: 'completed', hours: 30, date: 'Jan 2024', score: 98, rank: 'Top 1%', skills: ['Curriculum Design', 'Assessment', 'Engagement'] }
      ]}
    ],
    coursesTaught: [
      { title: 'How to Teach Online', community: 'PeerLoop Academy', students: 234, rating: 4.98, reviews: 567, hoursTaught: 450, topReview: { stars: 5, text: 'Changed how I think about teaching!', author: '@newteacher' } },
      { title: 'Building Tech Courses', community: 'Creator Hub', students: 89, rating: 4.95, reviews: 234, hoursTaught: 180, topReview: { stars: 5, text: 'Essential for any course creator', author: '@techcreator' } }
    ],
    createdCourses: [1, 2, 3, 4, 5, 6, 7, 8],
    teachingStats: { students: 890, rating: 4.98, comeback: 94, earned: 45000 }
  }
};

/**
 * Get demo users for the login screen
 * Returns an array of users suitable for demo login
 */
export const getDemoUsers = () => {
  const demoIds = ['demo_new', 'demo_alex', 'GuyRymberg', 'demo_sarah', 'demo_marcus'];
  return demoIds.map(id => communityUsers[id]).filter(Boolean);
};

/**
 * Get a user profile by username (with or without @)
 */
export const getUserByUsername = (username) => {
  const cleanUsername = username.replace('@', '');
  return communityUsers[cleanUsername] || null;
};

/**
 * Get a user profile by their display name
 */
export const getUserByName = (name) => {
  return Object.values(communityUsers).find(user => user.name === name) || null;
};

/**
 * Get all users with a specific role
 */
export const getUsersByRole = (role) => {
  return Object.values(communityUsers).filter(user => user.roles.includes(role));
};

/**
 * Get all student-teachers (users with both 'student' and 'teacher' roles)
 */
export const getStudentTeachers = () => {
  return Object.values(communityUsers).filter(
    user => user.roles.includes('student') && user.roles.includes('teacher')
  );
};

/**
 * Get all students only (not teachers)
 */
export const getStudentsOnly = () => {
  return Object.values(communityUsers).filter(
    user => user.roles.includes('student') && !user.roles.includes('teacher')
  );
};

/**
 * Get user initials from name
 */
export const getUserInitials = (name) => {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

export default communityUsers;

