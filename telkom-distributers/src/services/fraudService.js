import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { db } from "../firebase";

// Generate next case number
const generateCaseNumber = async () => {
  const snapshot = await getDocs(collection(db, "fraudCases"));
  const count = snapshot.size + 1;
  const year = new Date().getFullYear();
  return `FR-${year}-${String(count).padStart(3, "0")}`; // FR-2025-001
};

export const addFraudCase = async (fraudCase) => {
  try {
    const caseNumber = await generateCaseNumber();

    const docRef = await addDoc(collection(db, "fraudCases"), {
      ...fraudCase,
      caseNumber,
      status: fraudCase.status || "Pending",
      createdAt: serverTimestamp(),
    });

    return { id: docRef.id, caseNumber };
  } catch (error) {
    console.error("Error adding fraud case:", error);
    throw error;
  }
};
