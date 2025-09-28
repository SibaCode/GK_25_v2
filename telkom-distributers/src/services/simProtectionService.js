import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const addSimProtection = async (data) => {
    try {
        const docRef = await addDoc(collection(db, "simProtections"), {
            ...data,
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding SIM Protection record:", error);
        throw error;
    }
};
