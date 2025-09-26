import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

const salesCollection = collection(db, "sales");

// Add sale
export const addSale = async (sale) => {
  try {
    if (!sale.product || !sale.distributor || !sale.quantity || !sale.price) {
      throw new Error("Missing required sale fields");
    }

    const saleData = {
      ...sale,
      total: sale.quantity * sale.price,
      date: serverTimestamp(),
      status: sale.status || "Pending",
    };

    const docRef = await addDoc(salesCollection, saleData);
    return { id: docRef.id, ...saleData };
  } catch (error) {
    console.error("Error adding sale:", error);
    throw error;
  }
};

// Get all sales
export const getSales = async () => {
  try {
    const q = query(salesCollection, orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching sales:", error);
    throw error;
  }
};

// Update sale
export const updateSale = async (id, updatedData) => {
  try {
    if (updatedData.quantity && updatedData.price) {
      updatedData.total = updatedData.quantity * updatedData.price;
    }
    const docRef = doc(db, "sales", id);
    await updateDoc(docRef, updatedData);
    return { id, ...updatedData };
  } catch (error) {
    console.error("Error updating sale:", error);
    throw error;
  }
};

// Delete sale
export const deleteSale = async (id) => {
  try {
    const docRef = doc(db, "sales", id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error("Error deleting sale:", error);
    throw error;
  }
};
