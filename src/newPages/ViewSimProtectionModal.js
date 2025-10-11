// src/newPages/ViewSimProtectionModal.js
import React from "react";
import { X, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

export default function ViewSimProtectionModal({ data, onClose }) {
  if (!data) return null;

  const simCards = data.simCards?.length ? data.simCards : data.selectedNumber ? [data] : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-white w-full max-w-3xl rounded-2xl shadow-lg overflow-y-auto max-h-[90vh] p-6 flex flex-col gap-4"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-500" /> SIM Protection Details
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 font-medium">
            <X size={24} />
          </button>
        </div>

        {/* SIM Cards */}
        {simCards.length === 0 ? (
          <p className="text-sm text-gray-500 text-center mt-4">No SIMs registered yet.</p>
        ) : (
          <ul className="space-y-3 mt-2">
            {simCards.slice().reverse().map((sim, idx) => (
              <li
                key={idx}
                className="border border-gray-200 p-4 rounded-lg flex flex-col gap-2 hover:shadow-sm transition bg-white"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    SIM: {sim.selectedNumber || sim.simNumber}
                  </h3>
                </div>

                <p className="text-sm">
                  <span className="font-medium">ID Number:</span> {sim.idNumber || "-"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Preferred Language:</span>{" "}
                  {sim.preferredLanguage?.toUpperCase() || "-"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email Alerts:</span> {sim.emailAlert ? sim.email : "No"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Next of Kin Alerts:</span>{" "}
                  {sim.nextOfKin && sim.nextOfKin.length
                    ? sim.nextOfKin.map((kin) => `${kin.name} - ${kin.number}`).join(", ")
                    : "No"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Bank Accounts:</span>{" "}
                  {sim.bankAccounts && sim.bankAccounts.length
                    ? sim.bankAccounts.map((acc) => `${acc.bankName} - ${acc.accountNumber}`).join(", ")
                    : "No accounts"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Auto-lock SIM:</span> {sim.autoLock ? "Yes" : "No"}
                </p>
              </li>
            ))}
          </ul>
        )}

        {/* Close Button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-5 py-2 rounded-2xl hover:bg-gray-300 transition font-medium"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
