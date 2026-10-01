/* ==========================================================================
   PORTFOLIO-CONTEXT.JS - CENTRALIZED DATA SOURCE OF TRUTH FOR AI ASSISTANT
   ========================================================================== */

const PORTFOLIO_DATA = {
  person: {
    name: "Dadhi Shankar Sharma",
    title: "Android Developer, Java Specialist & AI Engineer",
    bio: "Passionate Android Developer and Computer Applications graduate from Ajmer, Rajasthan, India. Specializing in Native Android Apps, Java, Kotlin, Firebase, REST APIs, and AI Integration. Experienced in building real-time messaging, library management, and desktop enterprise applications.",
    location: "Ajmer, Rajasthan, India",
    email: "dadhishankar1@gmail.com",
    phone: "+91 6376736849",
    availability: "Available for Internships, Full-Time Roles, and Freelance Projects.",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      medium: "https://medium.com",
      instagram: "https://instagram.com/life_of_coder (@life_of_coder)",
      twitter: "https://twitter.com"
    },
    keyQualities: [
      "Clean Code Architecture",
      "Fast Learner & Adaptable",
      "Strong Problem Solving",
      "Android & Mobile App Expertise",
      "Firebase Backend Mastery",
      "Java Programming",
      "API & AI Integration",
      "Team Collaboration & Continuous Learning"
    ]
  },

  skills: {
    languages: ["Java", "Kotlin", "Python", "C", "C++", "JavaScript", "HTML", "CSS"],
    frameworksAndSdk: [
      "Android SDK",
      "Firebase (Auth, Firestore, Realtime DB, Storage, Cloud Messaging)",
      "REST APIs",
      "Retrofit",
      "Material Design",
      "XML Layouts",
      "JDBC"
    ],
    databases: [
      "Cloud Firestore",
      "Firebase Realtime Database",
      "SQLite",
      "MySQL",
      "Firebase Cloud Storage"
    ],
    tools: [
      "Android Studio",
      "VS Code",
      "Git & GitHub",
      "Postman",
      "Figma",
      "Gemini AI API / AI Chatbot Integration"
    ],
    concepts: [
      "Native Mobile App Development",
      "MVC & Clean Architecture",
      "Real-time Chat & Data Sync",
      "AI Recommendation Integration",
      "User Authentication & Security",
      "Desktop GUI Development",
      "Responsive Web UI"
    ]
  },

  experience: [
    {
      role: "Android Developer (Personal & Independent Projects)",
      duration: "Ongoing",
      location: "Ajmer, Rajasthan, India",
      details: "Engineered multiple native Android applications focusing on secure authentication, Firebase real-time database synchronization, clean architecture, RESTful API integration, and AI-assisted recommendation features."
    }
  ],

  projects: [
    {
      id: "sandesh",
      name: "Sandesh",
      category: "Android Application",
      description: "A real-time messaging Android application inspired by WhatsApp. Features user authentication, instant real-time chat, image & video sharing, voice messages, Cloud Firestore synchronization, Firebase Storage, and push notifications.",
      technologies: ["Java", "Firebase", "Android Studio", "Cloud Firestore", "Push Notifications"],
      features: [
        "User Authentication (Firebase Auth)",
        "Instant Real-Time Messaging",
        "Media Sharing (Images, Videos, Voice Notes)",
        "Cloud Firestore & Storage Integration",
        "Push Notifications"
      ],
      role: "Lead Android & Backend Developer",
      demonstrates: "Real-time mobile messaging architecture, media handling, cloud storage synchronization, and push notifications."
    },
    {
      id: "libmanage",
      name: "LibManage",
      category: "Digital Library & AI Integration",
      description: "An Android-based digital library management application designed to simplify book management, search, user authentication, and AI-powered book recommendations.",
      technologies: ["Java", "Firebase", "AI Integration", "Android Studio"],
      features: [
        "Digital Book Cataloging & Search",
        "User Authentication & Member Profiles",
        "Cloud Database Synchronization",
        "AI-Powered Book Recommendations & Smart Search"
      ],
      role: "Lead Developer & AI Integration Engineer",
      demonstrates: "Database management, UI design, cloud integration, and practical AI application logic."
    },
    {
      id: "store-system",
      name: "Departmental Store Management System",
      category: "Desktop Application",
      description: "Desktop software developed using Java and MySQL following MVC architecture for inventory tracking, billing, employee management, and customer records.",
      technologies: ["Java", "MySQL", "MVC Architecture", "JDBC"],
      features: [
        "Interactive Billing & Receipt Generation",
        "Inventory Tracking & Stock Alerts",
        "Employee Management & Records",
        "Customer Data Management"
      ],
      role: "Java Desktop Software Developer",
      demonstrates: "Object-oriented programming, relational database connectivity (JDBC), and MVC software design patterns."
    }
  ],

  education: [
    {
      degree: "Bachelor of Computer Applications (BCA)",
      institution: "Maharshi Dayanand Saraswati University (MDSU)",
      location: "Ajmer, Rajasthan, India",
      status: "Graduated",
      highlights: "Comprehensive coursework in Data Structures, Java Programming, Database Management Systems, Operating Systems, Software Engineering, and Web Development."
    }
  ],

  certifications: [
    { name: "Google Firebase Certification", issuer: "Google / Recognized Platform" },
    { name: "Android Development Specialist", issuer: "Professional Training" },
    { name: "Java Programming Mastery", issuer: "Certified Course" },
    { name: "Git & GitHub Version Control", issuer: "Developer Certification" },
    { name: "AI Development & API Integration", issuer: "Specialized Training" }
  ],

  services: [
    {
      title: "Native Android App Development",
      description: "Building fast, high-performance, and feature-rich native Android applications using Java, Kotlin, and modern Android SDKs."
    },
    {
      title: "Firebase Backend & Integration",
      description: "Integrating real-time databases, Firestore, user authentication, push notifications, and cloud storage into mobile apps."
    },
    {
      title: "Java Desktop Software Development",
      description: "Creating scalable desktop management software using Java, Swing/AWT, MySQL, and MVC architecture."
    },
    {
      title: "AI Integration & API Solutions",
      description: "Integrating modern AI APIs (such as Google Gemini) to add intelligent search, chatbots, and recommendation features into applications."
    }
  ],

  stats: {
    completedProjects: "10+",
    satisfiedClients: "100%",
    yearsExperience: "2+",
    coffeeCups: "500+"
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PORTFOLIO_DATA;
}
