/**
 * PeerLoop Database
 * 
 * This file contains all the mock data for the PeerLoop platform including:
 * - Creators with detailed profiles, qualifications, and expertise
 * - Courses with comprehensive information, curriculum, and learning objectives
 * - Helper functions for querying and searching the data
 * 
 * PeerLoop Model: Learn → Certify → Teach → Earn (70/15/15 split)
 * Price Range: $300-600 (1-on-1 tutoring pricing)
 */

// Database for creators (experts who create courses)
export const instructorsDatabase = [
  {
    id: 1,
    name: "Albert Einstein",
    title: "Theoretical Physicist & Nobel Laureate",
    avatar: "https://i.pravatar.cc/120?img=68",
    bio: "Revolutionary physicist who developed the theory of relativity, one of the two pillars of modern physics. Nobel Prize winner and one of the most influential scientists of all time.",
    qualifications: [
      {
        id: 1,
        sentence: "Ph.D. in Physics from University of Zurich (1905)"
      },
      {
        id: 2,
        sentence: "Nobel Prize in Physics from Royal Swedish Academy of Sciences (1921)"
      },
      {
        id: 3,
        sentence: "Professor of Physics at Princeton University for 22 years"
      }
    ],
    website: "https://www.princeton.edu",
    expertise: [
      "Theory of Relativity",
      "Quantum Mechanics", 
      "Statistical Physics",
      "Mathematical Physics",
      "Cosmology & Astrophysics",
      "Philosophy of Science"
    ],
    stats: {
      studentsTaught: 1730,
      coursesCreated: 2,
      averageRating: 4.8,
      totalReviews: 350
    },
    courses: [2, 3] // Course IDs: Node.js Backend, Cloud Architecture AWS
  },
  {
    id: 2,
    name: "Jane Doe",
    title: "Leading AI Strategist at TechCorp",
    avatar: "https://i.pravatar.cc/120?img=32",
    bio: "Leading AI strategist with 10+ years experience in product management and AI implementation. Expert in helping companies leverage AI for competitive advantage.",
    qualifications: [
      {
        id: 1,
        sentence: "MBA from Stanford Graduate School of Business (2015)"
      },
      {
        id: 2,
        sentence: "Leading AI Strategist at TechCorp for 6 years"
      },
      {
        id: 3,
        sentence: "Former Product Manager at Google AI for 4 years"
      }
    ],
    website: "https://techcorp.com",
    expertise: [
      "AI Product Strategy",
      "Machine Learning Applications",
      "Product Management",
      "AI Ethics & Governance",
      "Data-Driven Decision Making",
      "AI Implementation"
    ],
    stats: {
      studentsTaught: 19928,
      coursesCreated: 4,
      averageRating: 4.8,
      totalReviews: 2400
    },
    courses: [1, 4, 5, 6] // Course IDs: AI for PM, Deep Learning, Computer Vision, NLP
  },
  {
    id: 3,
    name: "Prof. Maria Rodriguez",
    title: "Data Science & Analytics Specialist",
    avatar: "https://i.pravatar.cc/120?img=47",
    bio: "Expert in data science, statistical analysis, and business intelligence. Helps organizations make data-driven decisions through advanced analytics.",
    qualifications: [
      {
        id: 1,
        sentence: "Ph.D. in Statistics from University of California, Berkeley (2016)"
      },
      {
        id: 2,
        sentence: "Senior Data Scientist at Netflix for 6 years"
      },
      {
        id: 3,
        sentence: "Analytics Director at Spotify for 4 years"
      }
    ],
    website: "https://netflix.com",
    expertise: [
      "Statistical Analysis & Modeling",
      "Data Visualization & Storytelling",
      "Business Intelligence & Analytics",
      "Python & R Programming",
      "SQL & Database Management",
      "A/B Testing & Experimentation"
    ],
    stats: {
      studentsTaught: 2450,
      coursesCreated: 2,
      averageRating: 4.55,
      totalReviews: 490
    },
    courses: [7, 8] // Course IDs: Data Science Fundamentals, Business Intelligence
  },
  {
    id: 4,
    name: "James Wilson",
    title: "Full-Stack Development & DevOps Engineer",
    avatar: "https://i.pravatar.cc/120?img=60",
    bio: "Full-stack developer with expertise in modern web technologies and DevOps practices. Builds scalable applications and efficient deployment pipelines.",
    qualifications: [
      {
        id: 1,
        sentence: "B.S. in Computer Science from University of Washington (2018)"
      },
      {
        id: 2,
        sentence: "Senior Full-Stack Developer at Shopify for 5 years"
      },
      {
        id: 3,
        sentence: "DevOps Engineer at GitHub for 3 years"
      }
    ],
    website: "https://github.com",
    expertise: [
      "React, Vue.js & Angular",
      "Node.js & Python Backend",
      "Docker & Kubernetes",
      "CI/CD Pipelines",
      "Microservices Architecture",
      "Cloud Infrastructure (AWS/Azure)"
    ],
    stats: {
      studentsTaught: 2970,
      coursesCreated: 3,
      averageRating: 4.7,
      totalReviews: 595
    },
    courses: [9, 10, 11] // Course IDs: Full-Stack Dev, DevOps, Microservices
  },
  {
    id: 5,
    name: "Dr. Priya Nair",
    title: "AI for Robotics Specialist",
    avatar: "https://i.pravatar.cc/120?img=26",
    bio: "Expert in robotics and AI integration, focusing on real-world automation and intelligent systems.",
    qualifications: [
      { id: 1, sentence: "Ph.D. in Robotics and AI from MIT (2020)" },
      { id: 2, sentence: "Lead Robotics Engineer at Boston Dynamics" }
    ],
    website: "https://bostondynamics.com",
    expertise: [
      "Robotics AI Integration",
      "Autonomous Systems",
      "Reinforcement Learning",
      "Python & ROS"
    ],
    stats: {
      studentsTaught: 3200,
      coursesCreated: 1,
      averageRating: 4.9,
      totalReviews: 400
    },
    courses: [12] // Course IDs that this instructor teaches
  },
  {
    id: 6,
    name: "Prof. Elena Petrova",
    title: "AI in Healthcare Innovator",
    avatar: "https://i.pravatar.cc/120?img=52",
    bio: "Pioneer in applying AI to medical diagnostics and healthcare data analysis.",
    qualifications: [
      { id: 1, sentence: "M.D., Ph.D. in Biomedical Informatics from Stanford (2017)" },
      { id: 2, sentence: "Chief Data Scientist at MedAI" }
    ],
    website: "https://medai.com",
    expertise: [
      "Medical AI",
      "Deep Learning for Healthcare",
      "Data Science",
      "Python, R"
    ],
    stats: {
      studentsTaught: 2100,
      coursesCreated: 1,
      averageRating: 4.8,
      totalReviews: 250
    },
    courses: [13] // Course IDs that this instructor teaches
  },
  {
    id: 7,
    name: "Mr. Samuel Lee",
    title: "AI Coding Bootcamp Instructor",
    avatar: "https://i.pravatar.cc/120?img=11",
    bio: "Specialist in teaching practical AI coding skills for beginners and professionals alike.",
    qualifications: [
      { id: 1, sentence: "M.S. in Computer Science from UC Berkeley (2015)" },
      { id: 2, sentence: "Lead Instructor at CodeAI Bootcamp" }
    ],
    website: "https://codeaibootcamp.com",
    expertise: [
      "AI Coding Fundamentals",
      "Python for AI",
      "Machine Learning Projects",
      "Education Technology"
    ],
    stats: {
      studentsTaught: 5000,
      coursesCreated: 1,
      averageRating: 4.7,
      totalReviews: 600
    },
    courses: [14] // Course IDs that this instructor teaches
  },
  {
    id: 8,
    name: "Guy Rymberg",
    title: "AI Prompting Specialist & Business AI Expert",
    avatar: "https://i.pravatar.cc/120?img=15",
    bio: "AI teaching specialist with 15 years experience in AI and machine learning. Expert in helping professionals leverage AI prompting for competitive advantage. Has taught over 500 students the art of prompt engineering and AI communication. Passionate about the PeerLoop model of Learn → Teach → Earn.",
    qualifications: [
      { id: 1, sentence: "Ph.D. in Computer Science from MIT (2012)" },
      { id: 2, sentence: "Former AI Lead at Google for 6 years" },
      { id: 3, sentence: "Published Author: 'AI Prompting for Business' (2023)" },
      { id: 4, sentence: "Keynote Speaker at AI Summit, TechCrunch Disrupt" }
    ],
    website: "https://guyrymberg.ai",
    expertise: [
      "AI Prompt Engineering",
      "Large Language Models",
      "Business AI Strategy",
      "AI Communication",
      "Prompt Library Design",
      "AI-Powered Workflows"
    ],
    stats: {
      studentsTaught: 527,
      coursesCreated: 1,
      averageRating: 4.9,
      totalReviews: 127
    },
    courses: [15] // AI Prompting Mastery
  },
  {
    id: 9,
    name: "Dr. Sarah Chen",
    title: "AI Research Scientist & Educator",
    avatar: "https://i.pravatar.cc/120?img=44",
    bio: "Former Google AI researcher, now dedicated to making artificial intelligence accessible to everyone. Specializes in breaking down complex AI concepts for beginners.",
    qualifications: [
      { id: 1, sentence: "Ph.D. in Machine Learning from Stanford University (2018)" },
      { id: 2, sentence: "Former AI Research Scientist at Google Brain for 5 years" },
      { id: 3, sentence: "Author of 'AI for Everyone' bestselling book (2023)" }
    ],
    website: "https://drsarahchen.ai",
    expertise: [
      "Machine Learning Fundamentals",
      "AI Education",
      "Neural Networks",
      "Python for AI",
      "Data Science",
      "AI Ethics"
    ],
    stats: {
      studentsTaught: 8500,
      coursesCreated: 2,
      averageRating: 4.9,
      totalReviews: 1200
    },
    courses: [16, 17] // AI for Beginners, Machine Learning Essentials
  },
  {
    id: 10,
    name: "Marcus Johnson",
    title: "DevOps Engineer & Open Source Advocate",
    avatar: "https://i.pravatar.cc/120?img=53",
    bio: "10+ years in software development, passionate about automation and developer tools. Core contributor to several open source projects and GitHub expert.",
    qualifications: [
      { id: 1, sentence: "B.S. in Computer Science from Georgia Tech (2013)" },
      { id: 2, sentence: "Senior DevOps Engineer at Microsoft for 6 years" },
      { id: 3, sentence: "GitHub Star and open source maintainer" }
    ],
    website: "https://marcusjohnson.dev",
    expertise: [
      "Git & GitHub",
      "Version Control",
      "CI/CD Pipelines",
      "Open Source Development",
      "Team Collaboration",
      "Code Review Best Practices"
    ],
    stats: {
      studentsTaught: 12000,
      coursesCreated: 2,
      averageRating: 4.8,
      totalReviews: 890
    },
    courses: [18, 19] // Introduction to GitHub, Git for Teams
  },
  {
    id: 11,
    name: "Elena Rodriguez",
    title: "Automation Specialist & No-Code Expert",
    avatar: "https://i.pravatar.cc/120?img=23",
    bio: "Helping businesses automate workflows without writing code. N8N certified trainer with expertise in connecting AI tools to business processes.",
    qualifications: [
      { id: 1, sentence: "M.S. in Information Systems from MIT (2019)" },
      { id: 2, sentence: "N8N Certified Expert Trainer" },
      { id: 3, sentence: "Automation consultant for Fortune 500 companies" }
    ],
    website: "https://elenarodriguez.io",
    expertise: [
      "N8N Workflow Automation",
      "No-Code Development",
      "AI Integration",
      "Business Process Automation",
      "Zapier & Make",
      "API Integrations"
    ],
    stats: {
      studentsTaught: 5200,
      coursesCreated: 2,
      averageRating: 4.85,
      totalReviews: 620
    },
    courses: [20, 21] // N8N Workflow Automation, No-Code AI Integration
  }
];

/**
 * Comprehensive course database with detailed information
 * Each course includes curriculum, learning objectives, and instructor relationship
 */
export const coursesDatabase = [
  {
    id: 1,
    title: "AI for Product Managers",
    description: "Master the skills to lead AI-driven products. Learn to evaluate AI technologies, build AI roadmaps, and make data-driven decisions. This comprehensive course covers everything from machine learning fundamentals to advanced AI strategy. You will learn how to identify opportunities where AI can add genuine value, communicate effectively with data science teams, and make informed decisions about AI investments. The curriculum includes real-world case studies and hands-on projects.",
    duration: "6 weeks",
    level: "Intermediate",
    rating: 4.8,
    ratingCount: 1892,
    students: 15678,
    price: "$399",
    badge: "Bestseller",
    thumbnail: "https://via.placeholder.com/300x200/4ECDC4/ffffff?text=AI+PM",
    instructorId: 2, // Links to Jane Doe
    category: "AI & Product Management",
    tags: ["AI", "Product Management", "Machine Learning", "Strategy"],
    learningObjectives: [
      "Evaluate AI technologies for product development",
      "Build comprehensive AI roadmaps",
      "Make data-driven product decisions",
      "Lead AI-driven product teams",
      "Implement AI ethics and responsible practices"
    ],
    curriculum: [
      {
        title: "Introduction to AI for Product Managers",
        duration: "45 min",
        description: "Overview of AI in product management and course structure"
      },
      {
        title: "Machine Learning Fundamentals",
        duration: "1h 15min",
        description: "Understanding core ML concepts and their business applications"
      },
      {
        title: "Building an AI Roadmap",
        duration: "1h",
        description: "Creating strategic AI implementation plans"
      },
      {
        title: "AI Ethics and Responsible Development",
        duration: "1h 30min",
        description: "Ensuring ethical AI practices in product development"
      },
      {
        title: "AI Product Strategy",
        duration: "2h",
        description: "Developing comprehensive AI product strategies"
      },
      {
        title: "Implementation and Deployment",
        duration: "1h 45min",
        description: "Bringing AI products to market successfully"
      }
    ]
  },
  {
    id: 2,
    title: "Node.js Backend Development",
    description: "Learn to build robust backend services with Node.js, Express, and MongoDB. Master REST APIs and authentication systems.",
    duration: "6 weeks",
    level: "Intermediate",
    rating: 4.7,
    ratingCount: 156,
    students: 980,
    price: "$349",
    badge: null,
    thumbnail: "https://via.placeholder.com/300x200/00D2FF/ffffff?text=Node",
    instructorId: 1, // Links to Albert Einstein
    category: "Backend Development",
    tags: ["Node.js", "Express", "MongoDB", "REST API"],
    learningObjectives: [
      "Build robust backend services with Node.js",
      "Master REST API development and authentication",
      "Implement database integration with MongoDB",
      "Deploy scalable backend applications",
      "Follow security best practices"
    ],
    curriculum: [
      {
        title: "Node.js Fundamentals",
        duration: "1h 15min",
        description: "Core concepts and environment setup"
      },
      {
        title: "Express Framework",
        duration: "2h 45min",
        description: "Building REST APIs and middleware"
      },
      {
        title: "Database Integration",
        duration: "3h 30min",
        description: "MongoDB connection and data modeling"
      }
    ]
  },
  {
    id: 3,
    title: "Cloud Architecture with AWS",
    description: "Design and deploy scalable cloud solutions using AWS services. Learn serverless architecture and infrastructure as code.",
    duration: "10 weeks",
    level: "Advanced",
    rating: 4.9,
    ratingCount: 142,
    students: 750,
    price: "$399",
    badge: "Popular",
    thumbnail: "https://via.placeholder.com/300x200/FF9900/ffffff?text=AWS",
    instructorId: 1, // Links to Albert Einstein
    category: "Cloud Computing",
    tags: ["AWS", "Serverless", "Lambda", "CloudFormation"],
    learningObjectives: [
      "Design scalable cloud architectures",
      "Implement serverless applications",
      "Master infrastructure as code",
      "Deploy and manage AWS services",
      "Optimize cloud costs and performance"
    ],
    curriculum: [
      {
        title: "AWS Fundamentals",
        duration: "2h 00min",
        description: "Core AWS services and concepts"
      },
      {
        title: "Serverless Architecture",
        duration: "3h 30min",
        description: "Lambda functions and API Gateway"
      },
      {
        title: "Infrastructure as Code",
        duration: "4h 15min",
        description: "CloudFormation and CDK"
      }
    ]
  },
  {
    id: 4,
    title: "Deep Learning Fundamentals",
    description: "Master the fundamentals of deep learning, neural networks, and modern AI architectures. Build and deploy real-world AI applications.",
    duration: "10 weeks",
    level: "Intermediate",
    rating: 4.9,
    ratingCount: 378,
    students: 2100,
    price: "$399",
    badge: "Featured",
    thumbnail: "https://via.placeholder.com/300x200/FF6B6B/ffffff?text=AI",
    instructorId: 2, // Links to Jane Doe
    category: "Machine Learning",
    tags: ["Deep Learning", "Neural Networks", "TensorFlow", "PyTorch"],
    learningObjectives: [
      "Understand neural network fundamentals",
      "Build and train deep learning models",
      "Master modern AI architectures",
      "Deploy AI applications in production",
      "Apply deep learning to real-world problems"
    ],
    curriculum: [
      {
        title: "Neural Network Basics",
        duration: "2h 30min",
        description: "Fundamentals of neural networks"
      },
      {
        title: "Deep Learning Frameworks",
        duration: "3h 45min",
        description: "TensorFlow and PyTorch implementation"
      },
      {
        title: "Advanced Architectures",
        duration: "4h 00min",
        description: "CNN, RNN, and Transformer models"
      }
    ]
  },
  {
    id: 5,
    title: "Computer Vision with Python",
    description: "Learn computer vision techniques using OpenCV, TensorFlow, and PyTorch. Build image recognition and object detection systems.",
    duration: "6 weeks",
    level: "Advanced",
    rating: 4.7,
    ratingCount: 124,
    students: 950,
    price: "$349",
    badge: null,
    thumbnail: "https://via.placeholder.com/300x200/4ECDC4/ffffff?text=CV",
    instructorId: 2, // Links to Jane Doe
    category: "Computer Vision",
    tags: ["OpenCV", "Image Processing", "Object Detection", "CNN"],
    learningObjectives: [
      "Master computer vision fundamentals",
      "Build image recognition systems",
      "Implement object detection algorithms",
      "Process and analyze visual data",
      "Deploy computer vision applications"
    ],
    curriculum: [
      {
        title: "Computer Vision Basics",
        duration: "1h 45min",
        description: "Image processing fundamentals"
      },
      {
        title: "Object Detection",
        duration: "3h 15min",
        description: "YOLO and R-CNN implementations"
      },
      {
        title: "Advanced Techniques",
        duration: "2h 30min",
        description: "Deep learning for computer vision"
      }
    ]
  },
  {
    id: 6,
    title: "Natural Language Processing",
    description: "Explore NLP techniques for text analysis, sentiment analysis, and language modeling. Build chatbots and language processing systems.",
    duration: "8 weeks",
    level: "Advanced",
    rating: 4.8,
    ratingCount: 189,
    students: 1200,
    price: "$349",
    badge: "Popular",
    thumbnail: "https://via.placeholder.com/300x200/9B59B6/ffffff?text=NLP",
    instructorId: 2, // Links to Jane Doe
    category: "Natural Language Processing",
    tags: ["NLP", "Transformers", "BERT", "Text Analysis"],
    learningObjectives: [
      "Master NLP fundamentals and techniques",
      "Build text analysis and processing systems",
      "Implement transformer-based models",
      "Create chatbots and language applications",
      "Deploy NLP solutions in production"
    ],
    curriculum: [
      {
        title: "NLP Fundamentals",
        duration: "2h 00min",
        description: "Text processing and analysis basics"
      },
      {
        title: "Transformer Models",
        duration: "3h 30min",
        description: "BERT, GPT, and modern architectures"
      },
      {
        title: "Practical Applications",
        duration: "2h 45min",
        description: "Chatbots and language systems"
      }
    ]
  },
  {
    id: 7,
    title: "Data Science Fundamentals",
    description: "Learn the core concepts of data science, statistical analysis, and data visualization. Master Python for data analysis.",
    duration: "8 weeks",
    level: "Beginner",
    rating: 4.6,
    ratingCount: 312,
    students: 1800,
    price: "$299",
    badge: "Bestseller",
    thumbnail: "https://via.placeholder.com/300x200/FFD93D/000000?text=Data",
    instructorId: 3, // Links to Prof. Maria Rodriguez
    category: "Data Science",
    tags: ["Python", "Pandas", "Matplotlib", "Statistics"],
    learningObjectives: [
      "Master Python for data analysis",
      "Understand statistical concepts",
      "Create compelling data visualizations",
      "Perform exploratory data analysis",
      "Build data-driven insights"
    ],
    curriculum: [
      {
        title: "Python for Data Science",
        duration: "2h 15min",
        description: "Pandas, NumPy, and data manipulation"
      },
      {
        title: "Statistical Analysis",
        duration: "3h 00min",
        description: "Hypothesis testing and modeling"
      },
      {
        title: "Data Visualization",
        duration: "2h 30min",
        description: "Matplotlib, Seaborn, and Plotly"
      }
    ]
  },
  {
    id: 8,
    title: "Business Intelligence & Analytics",
    description: "Transform raw data into actionable insights. Learn to create dashboards and reports for business decision-making.",
    duration: "6 weeks",
    level: "Intermediate",
    rating: 4.5,
    ratingCount: 87,
    students: 650,
    price: "$349",
    badge: null,
    thumbnail: "https://via.placeholder.com/300x200/00B894/ffffff?text=BI",
    instructorId: 3, // Links to Prof. Maria Rodriguez
    category: "Business Analytics",
    tags: ["Tableau", "Power BI", "SQL", "Dashboard Design"],
    learningObjectives: [
      "Transform data into business insights",
      "Create compelling dashboards and reports",
      "Master BI tools and platforms",
      "Design effective data visualizations",
      "Drive data-driven decision making"
    ],
    curriculum: [
      {
        title: "BI Fundamentals",
        duration: "1h 30min",
        description: "Business intelligence concepts"
      },
      {
        title: "Dashboard Design",
        duration: "3h 45min",
        description: "Tableau and Power BI mastery"
      },
      {
        title: "Advanced Analytics",
        duration: "2h 15min",
        description: "Predictive analytics and reporting"
      }
    ]
  },
  {
    id: 9,
    title: "Full-Stack Web Development",
    description: "Build complete web applications from frontend to backend. Learn modern development practices and deployment strategies.",
    duration: "12 weeks",
    level: "Intermediate",
    rating: 4.7,
    ratingCount: 245,
    students: 1400,
    price: "$449",
    badge: "Popular",
    thumbnail: "https://via.placeholder.com/300x200/6C5CE7/ffffff?text=Full",
    instructorId: 4, // Links to James Wilson
    category: "Full-Stack Development",
    tags: ["React", "Node.js", "MongoDB", "Deployment"],
    learningObjectives: [
      "Build complete web applications",
      "Master frontend and backend development",
      "Implement modern development practices",
      "Deploy applications to production",
      "Follow industry best practices"
    ],
    curriculum: [
      {
        title: "Full-Stack Fundamentals",
        duration: "2h 30min",
        description: "Architecture and project setup"
      },
      {
        title: "Frontend Development",
        duration: "4h 00min",
        description: "React, state management, and UI/UX"
      },
      {
        title: "Backend Development",
        duration: "3h 45min",
        description: "Node.js, APIs, and database integration"
      }
    ]
  },
  {
    id: 10,
    title: "DevOps & CI/CD Mastery",
    description: "Master DevOps practices, containerization, and continuous integration/deployment. Build efficient development pipelines.",
    duration: "8 weeks",
    level: "Advanced",
    rating: 4.8,
    ratingCount: 156,
    students: 850,
    price: "$329",
    badge: "Featured",
    thumbnail: "https://via.placeholder.com/300x200/FF7675/ffffff?text=DevOps",
    instructorId: 4, // Links to James Wilson
    category: "DevOps",
    tags: ["Docker", "Kubernetes", "Jenkins", "GitHub Actions"],
    learningObjectives: [
      "Master DevOps principles and practices",
      "Implement containerization with Docker",
      "Build CI/CD pipelines",
      "Manage infrastructure with Kubernetes",
      "Automate deployment processes"
    ],
    curriculum: [
      {
        title: "DevOps Fundamentals",
        duration: "2h 00min",
        description: "DevOps culture and practices"
      },
      {
        title: "Containerization",
        duration: "3h 30min",
        description: "Docker and container orchestration"
      },
      {
        title: "CI/CD Pipelines",
        duration: "3h 15min",
        description: "Jenkins, GitHub Actions, and automation"
      }
    ]
  },
  {
    id: 11,
    title: "Microservices Architecture",
    description: "Design and implement scalable microservices architectures. Learn service communication, API gateways, and distributed systems.",
    duration: "10 weeks",
    level: "Advanced",
    rating: 4.6,
    ratingCount: 98,
    students: 720,
    price: "$379",
    badge: null,
    thumbnail: "https://via.placeholder.com/300x200/74B9FF/ffffff?text=Micro",
    instructorId: 4, // Links to James Wilson
    category: "System Design",
    tags: ["Microservices", "API Gateway", "Service Mesh", "Distributed Systems"],
    learningObjectives: [
      "Design scalable microservices architectures",
      "Implement service communication patterns",
      "Build API gateways and service mesh",
      "Manage distributed systems",
      "Deploy microservices to production"
    ],
    curriculum: [
      {
        title: "Microservices Fundamentals",
        duration: "2h 15min",
        description: "Architecture principles and patterns"
      },
      {
        title: "Service Communication",
        duration: "3h 45min",
        description: "API gateways and service mesh"
      },
      {
        title: "Deployment Strategies",
        duration: "3h 00min",
        description: "Container orchestration and scaling"
      }
    ]
  },
  {
    id: 12,
    title: "AI for Robotics Coding Lab",
    description: "Hands-on coding with AI algorithms for robotics, including path planning and control.",
    duration: "6 weeks",
    level: "Intermediate",
    rating: 4.9,
    ratingCount: 167,
    students: 800,
    price: "$399",
    badge: "New",
    thumbnail: "https://via.placeholder.com/300x200/00B894/ffffff?text=RoboticsAI",
    instructorId: 5, // Links to Dr. Priya Nair
    category: "AI & Robotics",
    tags: ["Robotics", "AI", "Python", "Reinforcement Learning"],
    learningObjectives: [
      "Implement AI algorithms for robotics",
      "Code path planning and control systems",
      "Integrate Python with ROS for robotics"
    ],
    curriculum: [
      { title: "Robotics AI Basics", duration: "2h", description: "Introduction to robotics and AI integration." },
      { title: "Path Planning", duration: "2h 30min", description: "Coding path planning algorithms." },
      { title: "Reinforcement Learning", duration: "3h", description: "Applying RL to robotics." }
    ]
  },
  {
    id: 13,
    title: "AI for Medical Diagnostics Coding",
    description: "Develop AI models for medical image analysis and diagnostics using Python.",
    duration: "8 weeks",
    level: "Advanced",
    rating: 4.8,
    ratingCount: 89,
    students: 600,
    price: "$499",
    badge: "Featured",
    thumbnail: "https://via.placeholder.com/300x200/0984e3/ffffff?text=MedAI",
    instructorId: 6, // Links to Prof. Elena Petrova
    category: "AI in Healthcare",
    tags: ["Medical AI", "Deep Learning", "Python", "Diagnostics"],
    learningObjectives: [
      "Build AI models for medical diagnostics",
      "Analyze medical images with deep learning",
      "Apply Python to healthcare data"
    ],
    curriculum: [
      { title: "Medical AI Overview", duration: "1h 30min", description: "Introduction to AI in healthcare." },
      { title: "Image Analysis", duration: "3h", description: "Coding deep learning for medical images." },
      { title: "Diagnostics Projects", duration: "3h 30min", description: "Building diagnostic AI systems." }
    ]
  },
  {
    id: 14,
    title: "AI Coding Bootcamp: Python Projects",
    description: "Project-based course for learning AI coding with Python, including real-world ML projects.",
    duration: "5 weeks",
    level: "Beginner",
    rating: 4.7,
    ratingCount: 234,
    students: 1200,
    price: "$299",
    badge: "Bestseller",
    thumbnail: "https://via.placeholder.com/300x200/636e72/ffffff?text=BootcampAI",
    instructorId: 7, // Links to Mr. Samuel Lee
    category: "AI Coding",
    tags: ["Python", "AI", "Machine Learning", "Projects"],
    learningObjectives: [
      "Learn Python for AI coding",
      "Complete real-world ML projects",
      "Understand AI coding best practices"
    ],
    curriculum: [
      { title: "Python for AI", duration: "1h", description: "Python basics for AI coding." },
      { title: "ML Project 1", duration: "2h 30min", description: "Hands-on machine learning project." },
      { title: "ML Project 2", duration: "2h 30min", description: "Advanced AI coding project." }
    ]
  },
  {
    id: 15,
    title: "AI Prompting Mastery",
    description: "Learn to write effective AI prompts for business use. Master the art of communicating with AI to boost your productivity. This comprehensive course teaches you the fundamentals and advanced techniques of prompt engineering.",
    duration: "4-6 weeks",
    level: "Intermediate",
    rating: 4.9,
    ratingCount: 127,
    students: 127,
    price: "$450",
    badge: "New",
    thumbnail: "https://via.placeholder.com/300x200/1d9bf0/ffffff?text=AI+Prompting",
    instructorId: 8, // Links to Guy Rymberg
    category: "AI & Prompt Engineering",
    tags: ["AI Prompting", "Prompt Engineering", "ChatGPT", "LLM", "Business AI", "Productivity"],
    peerloopFeatures: {
      oneOnOneTeaching: true,
      certifiedTeachers: true,
      earnWhileTeaching: true,
      teacherCommission: "70%"
    },
    learningObjectives: [
      "Fundamentals of prompt engineering",
      "Advanced techniques for business applications",
      "Building your own prompt library",
      "Iteration and refinement strategies",
      "Context and constraint design",
      "Real-world AI use cases"
    ],
    curriculum: [
      { 
        title: "Module 1: Foundations", 
        duration: "Week 1", 
        description: "What is AI prompting, your first prompts, and the prompt framework guide.",
        videos: 2,
        readings: 1
      },
      { 
        title: "Module 2: Intermediate Techniques", 
        duration: "Week 2", 
        description: "Context and constraints, iteration strategies, and 50 prompt templates.",
        videos: 2,
        readings: 1
      },
      { 
        title: "Module 3: Advanced Applications", 
        duration: "Week 3", 
        description: "Business use cases, building AI workflows, and automation patterns.",
        videos: 2,
        readings: 1
      },
      { 
        title: "Module 4: Specialization", 
        duration: "Week 4", 
        description: "Industry-specific prompting, custom GPT creation, and prompt library design.",
        videos: 2,
        readings: 1
      },
      { 
        title: "Module 5: Certification Prep", 
        duration: "Week 5-6", 
        description: "Final assessment, portfolio review, and becoming a certified Student-Teacher.",
        videos: 1,
        assessment: true
      }
    ],
    studentTeachers: [
      { name: "Marcus Chen", studentsTaught: 12, certifiedDate: "December 2024" },
      { name: "Jessica Torres", studentsTaught: 8, certifiedDate: "November 2024" },
      { name: "Alex Rivera", studentsTaught: 5, certifiedDate: "January 2025" }
    ],
    includes: [
      "Full course access",
      "1-on-1 peer teaching sessions",
      "Certificate on completion",
      "Lifetime access to materials",
      "Access to prompt library templates",
      "Discord community access"
    ]
  },
  {
    id: 16,
    title: "AI for Beginners",
    description: "Understand the fundamentals of artificial intelligence without any coding required. Perfect for professionals who want to understand AI concepts and their business applications.",
    duration: "4 weeks",
    level: "Beginner",
    rating: 4.9,
    ratingCount: 856,
    students: 6200,
    price: "$249",
    badge: "Bestseller",
    thumbnail: "https://via.placeholder.com/300x200/10B981/ffffff?text=AI+Basics",
    instructorId: 9, // Dr. Sarah Chen
    category: "AI Fundamentals",
    tags: ["AI", "Beginner", "No-Code", "Business AI", "Fundamentals"],
    learningObjectives: [
      "Understand what AI is and how it works",
      "Learn key AI terminology and concepts",
      "Identify AI opportunities in your business",
      "Evaluate AI tools and solutions",
      "Make informed decisions about AI investments"
    ],
    curriculum: [
      { title: "What is Artificial Intelligence?", duration: "1h 30min", description: "Introduction to AI concepts and history" },
      { title: "Types of AI and Machine Learning", duration: "2h", description: "Understanding different AI approaches" },
      { title: "AI in the Real World", duration: "1h 45min", description: "Case studies and practical applications" },
      { title: "Getting Started with AI Tools", duration: "2h 15min", description: "Hands-on with popular AI platforms" }
    ]
  },
  {
    id: 17,
    title: "Machine Learning Essentials",
    description: "Learn the core concepts of ML algorithms and when to use them. This course bridges the gap between theory and practice for aspiring data scientists.",
    duration: "8 weeks",
    level: "Intermediate",
    rating: 4.8,
    ratingCount: 423,
    students: 2800,
    price: "$399",
    badge: "Featured",
    thumbnail: "https://via.placeholder.com/300x200/8B5CF6/ffffff?text=ML+Essentials",
    instructorId: 9, // Dr. Sarah Chen
    category: "Machine Learning",
    tags: ["Machine Learning", "Python", "Algorithms", "Data Science"],
    learningObjectives: [
      "Master supervised and unsupervised learning",
      "Implement common ML algorithms from scratch",
      "Choose the right algorithm for your problem",
      "Evaluate and improve model performance",
      "Deploy ML models to production"
    ],
    curriculum: [
      { title: "ML Foundations", duration: "2h", description: "Core concepts and mathematical foundations" },
      { title: "Supervised Learning", duration: "3h 30min", description: "Regression, classification, and decision trees" },
      { title: "Unsupervised Learning", duration: "2h 45min", description: "Clustering, dimensionality reduction" },
      { title: "Model Evaluation", duration: "2h", description: "Metrics, validation, and optimization" }
    ]
  },
  {
    id: 18,
    title: "Introduction to GitHub",
    description: "Master version control, collaboration, and GitHub workflows. Essential skills for any developer or team working on software projects.",
    duration: "3 weeks",
    level: "Beginner",
    rating: 4.8,
    ratingCount: 1245,
    students: 9500,
    price: "$149",
    badge: "Bestseller",
    thumbnail: "https://via.placeholder.com/300x200/1F2937/ffffff?text=GitHub+101",
    instructorId: 10, // Marcus Johnson
    category: "Developer Tools",
    tags: ["GitHub", "Git", "Version Control", "Collaboration", "Beginner"],
    learningObjectives: [
      "Set up and configure Git and GitHub",
      "Master basic Git commands and workflows",
      "Create and manage repositories",
      "Collaborate with pull requests and code reviews",
      "Use GitHub features like Issues and Projects"
    ],
    curriculum: [
      { title: "Getting Started with Git", duration: "1h 30min", description: "Installation, configuration, and first commits" },
      { title: "GitHub Fundamentals", duration: "2h", description: "Repositories, branches, and remote operations" },
      { title: "Collaboration Workflows", duration: "2h 30min", description: "Pull requests, code reviews, and team workflows" },
      { title: "Advanced GitHub Features", duration: "1h 45min", description: "Actions, Pages, and project management" }
    ]
  },
  {
    id: 19,
    title: "Git for Teams",
    description: "Advanced branching strategies and code review best practices. Learn how high-performing teams manage code at scale.",
    duration: "5 weeks",
    level: "Advanced",
    rating: 4.7,
    ratingCount: 312,
    students: 1800,
    price: "$299",
    badge: "Popular",
    thumbnail: "https://via.placeholder.com/300x200/374151/ffffff?text=Git+Teams",
    instructorId: 10, // Marcus Johnson
    category: "Developer Tools",
    tags: ["Git", "Team Workflows", "Branching", "Code Review", "Advanced"],
    learningObjectives: [
      "Implement GitFlow and trunk-based development",
      "Design effective branching strategies",
      "Master merge conflict resolution",
      "Set up CI/CD with GitHub Actions",
      "Establish code review best practices"
    ],
    curriculum: [
      { title: "Branching Strategies", duration: "2h 30min", description: "GitFlow, trunk-based, and feature flags" },
      { title: "Advanced Merging", duration: "2h", description: "Rebasing, cherry-picking, and conflict resolution" },
      { title: "CI/CD Integration", duration: "3h", description: "GitHub Actions and automated workflows" },
      { title: "Team Best Practices", duration: "2h 15min", description: "Code review, documentation, and standards" }
    ]
  },
  {
    id: 20,
    title: "N8N Workflow Automation",
    description: "Build powerful automations connecting your favorite apps. Learn to create complex workflows without writing code using N8N.",
    duration: "6 weeks",
    level: "Intermediate",
    rating: 4.85,
    ratingCount: 389,
    students: 3200,
    price: "$349",
    badge: "Featured",
    thumbnail: "https://via.placeholder.com/300x200/EA580C/ffffff?text=N8N+Automation",
    instructorId: 11, // Elena Rodriguez
    category: "Automation",
    tags: ["N8N", "Automation", "No-Code", "Workflows", "Integration"],
    learningObjectives: [
      "Set up and configure N8N",
      "Build multi-step automated workflows",
      "Connect APIs and services",
      "Handle errors and edge cases",
      "Deploy and monitor automations"
    ],
    curriculum: [
      { title: "N8N Fundamentals", duration: "2h", description: "Installation, interface, and first workflow" },
      { title: "Building Workflows", duration: "3h 30min", description: "Triggers, nodes, and data transformation" },
      { title: "Advanced Integrations", duration: "3h", description: "APIs, webhooks, and custom functions" },
      { title: "Production Deployment", duration: "2h 30min", description: "Self-hosting, monitoring, and scaling" }
    ]
  },
  {
    id: 21,
    title: "No-Code AI Integration",
    description: "Connect AI tools like ChatGPT to your workflows. Learn to leverage AI capabilities without programming knowledge.",
    duration: "4 weeks",
    level: "Intermediate",
    rating: 4.9,
    ratingCount: 234,
    students: 1900,
    price: "$299",
    badge: "New",
    thumbnail: "https://via.placeholder.com/300x200/F59E0B/ffffff?text=No-Code+AI",
    instructorId: 11, // Elena Rodriguez
    category: "AI & Automation",
    tags: ["AI", "No-Code", "ChatGPT", "Automation", "Integration"],
    learningObjectives: [
      "Connect ChatGPT and other AI tools to workflows",
      "Build AI-powered automations",
      "Process and transform AI responses",
      "Create intelligent business processes",
      "Optimize AI usage and costs"
    ],
    curriculum: [
      { title: "AI APIs for Non-Developers", duration: "1h 45min", description: "Understanding AI services and APIs" },
      { title: "ChatGPT Integration", duration: "2h 30min", description: "Connecting OpenAI to your workflows" },
      { title: "AI-Powered Workflows", duration: "3h", description: "Building intelligent automation chains" },
      { title: "Advanced AI Patterns", duration: "2h 15min", description: "Chains, memory, and complex AI tasks" }
    ]
  }
];

/**
 * Helper Functions for Database Queries
 * These functions provide a clean API for accessing the mock data
 */

/**
 * Find an instructor by their ID
 * @param {number} id - The instructor ID to search for
 * @returns {Object|null} The instructor object or null if not found
 */
export const getInstructorById = (id) => {
  return instructorsDatabase.find(instructor => instructor.id === id);
};

/**
 * Find a course by its ID
 * @param {number} id - The course ID to search for
 * @returns {Object|null} The course object or null if not found
 */
export const getCourseById = (id) => {
  return coursesDatabase.find(course => course.id === id);
};

/**
 * Get all courses taught by a specific instructor
 * @param {number} instructorId - The instructor ID
 * @returns {Array} Array of course objects
 */
export const getCoursesByInstructorId = (instructorId) => {
  return coursesDatabase.filter(course => course.instructorId === instructorId);
};

/**
 * Get all instructors from the database
 * @returns {Array} Array of all instructor objects
 */
export const getAllInstructors = () => {
  return instructorsDatabase;
};

/**
 * Get all courses from the database
 * @returns {Array} Array of all course objects
 */
export const getAllCourses = () => {
  return coursesDatabase;
};

/**
 * Get an instructor with their associated courses
 * @param {number} instructorId - The instructor ID
 * @returns {Object|null} Instructor object with courses array, or null if not found
 */
export const getInstructorWithCourses = (instructorId) => {
  const instructor = getInstructorById(instructorId);
  if (!instructor) return null;
  
  const courses = getCoursesByInstructorId(instructorId);
  return {
    ...instructor,
    courses: courses
  };
}; 

/**
 * Get all courses with search indexing for efficient searching
 * Each course gets a searchIndex property containing all searchable text
 * @returns {Array} Array of course objects with search indexing
 */
export const getIndexedCourses = () => {
  return coursesDatabase.map(course => ({
    ...course,
    searchIndex: [
      course.title,
      course.description,
      course.category,
      course.level,
      course.price,
      course.duration,
      course.rating,
      course.students,
      ...(course.tags || []),
      ...(course.learningObjectives || []),
      ...(course.curriculum ? course.curriculum.map(c => c.title + ' ' + c.description) : []),
      // Add instructor name to course search index
      getInstructorById(course.instructorId)?.name || '',
      getInstructorById(course.instructorId)?.title || '',
      getInstructorById(course.instructorId)?.bio || ''
    ].join(' ').toLowerCase()
  }));
};

/**
 * Get all instructors with search indexing for efficient searching
 * Each instructor gets a searchIndex property containing all searchable text
 * @returns {Array} Array of instructor objects with search indexing
 */
export const getIndexedInstructors = () => {
  return instructorsDatabase.map(instructor => ({
    ...instructor,
    searchIndex: [
      instructor.name,
      instructor.title,
      instructor.bio,
      instructor.website,
      ...(instructor.qualifications ? instructor.qualifications.map(q => q.sentence) : []),
      ...(instructor.expertise || []),
      ...(instructor.stats ? Object.values(instructor.stats).map(String) : [])
    ].join(' ').toLowerCase()
  }));
}; 