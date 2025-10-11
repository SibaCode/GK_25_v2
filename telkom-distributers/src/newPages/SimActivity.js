// src/newPages/ViewSimProtectionModal.js
import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function ViewSimProtectionModal({ data, onClose, onEdit }) {
  if (!data) return null;

  const simCards = data.simCards || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-lg overflow-y-auto max-h-[80vh] p-6 relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
          <h2 className="text-lg font-bold text-gray-800">SIM Protection Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* SIM Cards Timeline */}
        <div className="space-y-4">
          {simCards.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No SIMs registered yet.</p>
          ) : (
            <div>
              <h2 className="text-lg font-bold mb-2 text-gray-800">SIM Cards</h2>
              <ul className="space-y-3">
                {simCards.slice().reverse().map((sim, idx) => (
                  <li
                    key={idx}
                    className="border-l-2 border-blue-500 pl-3 p-3 rounded-md hover:bg-gray-50 transition"
                  >
                    <p className="text-sm font-semibold">SIM {idx + 1}</p>
                    <p className="text-sm font-semibold">ID Number: {sim.idNumber || "-"}</p>
                    <p className="text-sm font-semibold">Linked Number: {sim.selectedNumber || "None"}</p>
                    <p className="text-sm">Preferred Language: {sim.preferredLanguage?.toUpperCase() || "-"}</p>
                    <p className="text-sm">Email Alerts: {sim.emailAlert ? sim.email : "No"}</p>
                    <p className="text-sm">
                      Next of Kin Alerts:{" "}
                      {sim.nextOfKinAlert && sim.nextOfKin?.length > 0
                        ? sim.nextOfKin.map((kin, i) => `${kin.name} - ${kin.number}`).join(", ")
                        : "No"}
                    </p>
                    <p className="text-sm">Auto-lock SIM: {sim.autoLock ? "Yes" : "No"}</p>
                    <p className="text-sm">
                      Bank Accounts:{" "}
                      {sim.bankAccounts && sim.bankAccounts.length > 0
                        ? sim.bankAccounts.map((acc) => `${acc.bankName} - ${acc.accountNumber}`).join(", ")
                        : "No accounts"}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onEdit}
            className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition font-medium"
          >
            Edit
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-300 transition font-medium"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
