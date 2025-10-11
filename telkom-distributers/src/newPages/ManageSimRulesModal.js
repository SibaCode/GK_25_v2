// src/newDash/dashboard/ManageSimRulesModal.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Edit, Trash, Plus } from "lucide-react";
import { doc, getDoc, deleteField, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import RegisterSimProtection from "./RegisterSimProtection";

const ManageSimRulesModal = ({ onClose }) => {
  const [simRules, setSimRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRule, setSelectedRule] = useState(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);

  // Fetch current rules from Firestore
  const fetchRules = async () => {
    setLoading(true);
    if (!auth.currentUser) return;
    const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      setSimRules(data.simProtection ? [data.simProtection] : []);
    } else {
      setSimRules([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleDelete = async (index) => {
    if (!auth.currentUser) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this SIM rule?");
    if (!confirmDelete) return;

    try {
      // Remove the simProtection field from Firestore (or modify if multiple rules)
      await setDoc(doc(db, "users", auth.currentUser.uid), { simProtection: deleteField() }, { merge: true });
      fetchRules();
    } catch (error) {
      console.error("Failed to delete SIM rule:", error);
      alert("Failed to delete SIM rule. Try again.");
    }
  };

  const handleEdit = (rule) => {
    setSelectedRule(rule);
    setShowAddEditModal(true);
  };

  const handleAddNew = () => {
    setSelectedRule(null);
    setShowAddEditModal(true);
  };

  const handleAddEditClose = () => {
    setShowAddEditModal(false);
    fetchRules(); // Refresh list after adding/updating
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative overflow-y-auto"
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-4">Manage SIM Protection Rules</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <>
            {simRules.length === 0 ? (
              <p className="text-center text-gray-500 mb-4">No SIM protection rules set.</p>
            ) : (
              <div className="grid gap-4">
                {simRules.map((rule, index) => (
                  <div key={index} className="border rounded-lg p-4 shadow-sm relative">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-blue-600">SIM: {rule.selectedNumber}</h3>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(rule)} className="text-blue-600 hover:text-blue-800">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(index)} className="text-red-500 hover:text-red-700">
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>Email Alert: {rule.emailAlert ? rule.email : "No"}</li>
                      <li>Next of Kin Alert: {rule.nextOfKinAlert ? rule.nextOfKin.map(k => `${k.name} (${k.number})`).join(", ") : "No"}</li>
                      <li>Auto Lock: {rule.autoLock ? "Yes" : "No"}</li>
                      <li>Bank Linked: {rule.bankAccount ? rule.bankAccounts.map(b => `${b.bankName} (${b.accountNumber})`).join(", ") : "No"}</li>
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-center">
              <button
                onClick={handleAddNew}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Plus size={16} /> Add New SIM Protection
              </button>
            </div>
          </>
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      {showAddEditModal && (
        <RegisterSimProtection onClose={handleAddEditClose} existingRule={selectedRule} />
      )}
    </>
  );
};

export default ManageSimRulesModal;
