// src/newPages/ViewSimProtectionModal.js
import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function ViewSimProtectionModal({ data, onClose, onEdit }) {
  if (!data) return null;

  const simCards = data.simCards?.length ? data.simCards : data.selectedNumber ? [data] : [];

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

        {/* SIM Cards */}
        {simCards.length === 0 ? (
          <p className="text-sm text-gray-500">No SIMs registered yet.</p>
        ) : (
          <div className="space-y-4">
            {simCards.slice().reverse().map((sim, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-2xl shadow-md border-l-4 border-blue-500 hover:bg-gray-50 transition relative"
              >
                <h3 className="font-semibold text-gray-800 mb-2">SIM: {sim.selectedNumber || sim.simNumber}</h3>
                <p className="text-sm"><span className="font-medium">ID Number:</span> {sim.idNumber}</p>
                <p className="text-sm"><span className="font-medium">Preferred Language:</span> {sim.preferredLanguage?.toUpperCase()}</p>
                <p className="text-sm"><span className="font-medium">Email Alerts:</span> {sim.emailAlert ? sim.email : "No"}</p>
                <p className="text-sm"><span className="font-medium">Next of Kin Alerts:</span> {sim.nextOfKinAlert && sim.nextOfKin?.length ? sim.nextOfKin.map((kin) => `${kin.name} - ${kin.number}`).join(", ") : "No"}</p>
                <p className="text-sm"><span className="font-medium">Bank Accounts:</span> {sim.bankAccounts && sim.bankAccounts.length ? sim.bankAccounts.map(acc => `${acc.bankName} - ${acc.accountNumber}`).join(", ") : "No accounts"}</p>
                <p className="text-sm"><span className="font-medium">Auto-lock SIM:</span> {sim.autoLock ? "Yes" : "No"}</p>

                {/* Edit button per SIM */}
                {/* <button
                  onClick={() => onEdit(sim)}
                  className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800 text-xs font-medium transition"
                >
                  Edit
                </button> */}
              </div>
            ))}
          </div>
        )}

        {/* Close Button */}
        <div className="mt-5 flex justify-end gap-3">
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
