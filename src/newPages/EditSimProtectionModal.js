// src/newPages/EditSimProtection.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

const EditSimProtectionModal = ({ data, onClose }) => {
  const [formData, setFormData] = useState(data);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (field) => setFormData(prev => ({ ...prev, [field]: !prev[field] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!auth.currentUser) throw new Error("User not logged in");

      await setDoc(doc(db, "users", auth.currentUser.uid), {
        simProtection: formData,
        updatedAt: serverTimestamp()
      }, { merge: true });

      alert("SIM Protection updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating SIM protection:", error);
      alert("Failed to update SIM Protection.");
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-y-auto relative p-6"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <X size={20} />
      </button>

      <h2 className="text-xl font-bold text-blue-700 mb-4">Edit SIM Protection</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>ID Number</label>
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label>Linked Number</label>
          <input
            type="text"
            name="selectedNumber"
            value={formData.selectedNumber}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <label>Email Alert</label>
          <input
            type="checkbox"
            checked={formData.emailAlert}
            onChange={() => handleToggle("emailAlert")}
            className="w-5 h-5 accent-blue-600"
          />
        </div>

        <div className="flex items-center justify-between">
          <label>Next of Kin Alert</label>
          <input
            type="checkbox"
            checked={formData.nextOfKinAlert}
            onChange={() => handleToggle("nextOfKinAlert")}
            className="w-5 h-5 accent-blue-600"
          />
        </div>

        <div className="flex items-center justify-between">
          <label>Auto-lock</label>
          <input
            type="checkbox"
            checked={formData.autoLock}
            onChange={() => handleToggle("autoLock")}
            className="w-5 h-5 accent-blue-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </motion.div>
  );
};

export default EditSimProtectionModal;
