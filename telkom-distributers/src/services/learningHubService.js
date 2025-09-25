// src/services/learningHubService.js

// For now, using mock data. Later you can replace with API calls.
let assignedCourses = [
    { id: 1, title: "Fraud Prevention Basics", region: "North", distributorId: 101, date: "2025-09-30" },
    { id: 2, title: "E-Waste Management", region: "East", distributorId: 102, date: "2025-10-02" },
  ];
  
  let recentSessions = [
    { id: 1, distributorId: 101, course: "Fraud Prevention Basics", participants: 12, badges: 3, timestamp: "2025-09-20" },
    { id: 2, distributorId: 102, course: "E-Waste Management", participants: 8, badges: 2, timestamp: "2025-09-22" },
  ];
  
  export const getAssignedCourses = (distributorId) => {
    return assignedCourses.filter(course => course.distributorId === distributorId);
  };
  
  export const addLearningSession = (sessionData) => {
    const newSession = {
      id: recentSessions.length + 1,
      ...sessionData,
    };
    recentSessions.push(newSession);
    return newSession;
  };
  
  export const getRecentSessions = (distributorId) => {
    return recentSessions.filter(session => session.distributorId === distributorId);
  };
  