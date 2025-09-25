// services/eWasteService.js
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "../firebase"; // your initialized Firestore

// Reference to the "eWasteEntries" collection
const eWasteCollection = collection(db, "eWasteEntries");

/**
 * Create a new E-Waste entry
 * @param {Object} entry - The eWaste entry data
 */
export const addEWaste = async (entry) => {
  try {
    const docRef = await addDoc(eWasteCollection, { ...entry, createdAt: serverTimestamp() });
    return { id: docRef.id, ...entry };
  } catch (error) {
    console.error("Error adding eWaste entry:", error);
    throw error;
  }
};

/**
 * Get all E-Waste entries, ordered by createdAt descending
 */
export const getEWasteEntries = async () => {
  try {
    const q = query(eWasteCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching eWaste entries:", error);
    throw error;
  }
};

/**
 * Update an existing E-Waste entry
 * @param {string} id - Document ID
 * @param {Object} updatedData - Data to update
 */
export const updateEWaste = async (id, updatedData) => {
  try {
    const docRef = doc(db, "eWasteEntries", id);
    await updateDoc(docRef, updatedData);
    return { id, ...updatedData };
  } catch (error) {
    console.error("Error updating eWaste entry:", error);
    throw error;
  }
};

/**
 * Delete an E-Waste entry
 * @param {string} id - Document ID
 */
export const deleteEWaste = async (id) => {
  try {
    const docRef = doc(db, "eWasteEntries", id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error("Error deleting eWaste entry:", error);
    throw error;
  }
};
