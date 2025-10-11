// src/newPages/ViewSimProtectionModal.js
import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function ViewSimProtectionModal({ data, onClose, onEdit }) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-y-auto max-h-[80vh] relative p-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
          <h2 className="text-2xl font-bold text-orange-600">SIM Protection Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium">ID Number:</span>
            <span>{data.idNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Linked Number:</span>
            <span>{data.selectedNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Preferred Language:</span>
            <span>{data.preferredLanguage.toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Email Alerts:</span>
            <span>{data.emailAlert ? data.email : "No"}</span>
          </div>
          <div>
            <span className="font-medium">Next of Kin Alerts:</span>
            {data.nextOfKinAlert ? (
              <ul className="ml-4 mt-1 list-disc list-inside">
                {data.nextOfKin.map((kin, idx) => (
                  <li key={idx}>{kin.name} - {kin.number}</li>
                ))}
              </ul>
            ) : (
              <span className="ml-2">No</span>
            )}
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Auto-lock SIM:</span>
            <span>{data.autoLock ? "Yes" : "No"}</span>
          </div>
          <div>
            <span className="font-medium">Bank Accounts:</span>
            {data.bankAccount ? (
              <ul className="ml-4 mt-1 list-disc list-inside">
                {data.bankAccounts.map((acc, idx) => (
                  <li key={idx}>{acc.bankName} - {acc.accountNumber}</li>
                ))}
              </ul>
            ) : (
              <span className="ml-2">No</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onEdit}
            className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700 transition font-medium"
          >
            Edit
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
