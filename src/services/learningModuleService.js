// services/learningHubService.js
import { db } from "../firebase";
import { collection, addDoc, updateDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";

// Add a new learning course assignment
export const assignCourse = async (assignment) => {
  try {
    await addDoc(collection(db, "learningAssignments"), {
      ...assignment,
      createdAt: new Date(),
      status: "Assigned", // Assigned / Scheduled / Completed
      attendance: [],
    });
  } catch (error) {
    console.error("Error assigning course:", error);
  }
};

// Update course status or attendance
export const updateCourse = async (assignmentId, data) => {
  try {
    const assignmentRef = doc(db, "learningAssignments", assignmentId);
    await updateDoc(assignmentRef, data);
  } catch (error) {
    console.error("Error updating course:", error);
  }
};

// Listen for all assignments
export const subscribeAssignments = (callback) => {
  const q = query(collection(db, "learningAssignments"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const assignments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(assignments);
  });
};
