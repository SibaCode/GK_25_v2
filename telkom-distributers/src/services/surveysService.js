import { db } from "../firebase"; // your Firebase config
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const surveysCol = collection(db, "surveys");

// Get all surveys
export const getSurveys = async () => {
  const snapshot = await getDocs(surveysCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Add a new survey
export const addSurvey = async (survey) => {
  const docRef = await addDoc(surveysCol, { 
    ...survey, 
    status: "draft", 
    createdAt: new Date() 
  });
  return { id: docRef.id, ...survey };
};

// Update a survey
export const updateSurvey = async (id, data) => {
  const docRef = doc(db, "surveys", id);
  await updateDoc(docRef, data);
};

// Delete a survey
export const deleteSurvey = async (id) => {
  await deleteDoc(doc(db, "surveys", id));
};
