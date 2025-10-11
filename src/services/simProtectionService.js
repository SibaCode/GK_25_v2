// src/services/simProtectionService.js
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const simCollection = collection(db, "simProtections");

// Add new SIM registration
export const addSimProtection = async (data) => {
    const docRef = await addDoc(simCollection, data);
    return { id: docRef.id, ...data };
};

// Get all registered SIMs for the dashboard
export const getSimProtections = async () => {
    const snapshot = await getDocs(simCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Update SIM registration
export const updateSimProtection = async (id, data) => {
    const docRef = doc(db, "simProtections", id);
    await updateDoc(docRef, data);
};
