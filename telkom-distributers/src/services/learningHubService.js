import { db } from "../firebase";
import { collection, addDoc, doc, onSnapshot, updateDoc, query, orderBy } from "firebase/firestore";

// Add a new learning session/course
export const addLearningSession = async (sessionData) => {
  try {
    const docRef = await addDoc(collection(db, "learningHubSessions"), {
      ...sessionData,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Failed to add learning session:", error);
    throw error;
  }
};

// Get all assigned courses
export const getAssignedCourses = async () => {
  try {
    const q = query(collection(db, "learningHubSessions"), orderBy("createdAt", "desc"));
    const snapshot = await onSnapshot(q, (snap) => {
      const courses = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return courses;
    });
  } catch (error) {
    console.error("Failed to fetch assigned courses:", error);
    throw error;
  }
};

// Get recent learning sessions
export const getRecentSessions = async () => {
  try {
    const q = query(collection(db, "learningHubSessions"), orderBy("createdAt", "desc"));
    const snapshot = await onSnapshot(q, (snap) => {
      const sessions = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return sessions;
    });
  } catch (error) {
    console.error("Failed to fetch recent sessions:", error);
    throw error;
  }
};

// Assign a course to a distributor
export const assignCourse = async (courseId, distributor) => {
  try {
    const courseRef = doc(db, "learningHubSessions", courseId);
    await updateDoc(courseRef, { distributor });
  } catch (error) {
    console.error("Failed to assign course:", error);
    throw error;
  }
};

// Update course details (attendance, status, materials)
export const updateCourse = async (courseId, updateData) => {
  try {
    const courseRef = doc(db, "learningHubSessions", courseId);
    await updateDoc(courseRef, updateData);
  } catch (error) {
    console.error("Failed to update course:", error);
    throw error;
  }
};

// Subscribe to real-time updates on assignments
export const subscribeAssignments = (callback) => {
  try {
    const q = query(collection(db, "learningHubSessions"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const courses = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(courses);
    });
    return unsubscribe;
  } catch (error) {
    console.error("Failed to subscribe to assignments:", error);
    throw error;
  }
};
