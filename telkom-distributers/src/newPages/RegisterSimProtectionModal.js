// src/newDash/dashboard/RegisterSimProtectionModal.js
import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import RegisterSimProtection from "./RegisterSimProtection"; // adjust path

export default function RegisterSimProtectionModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-lg w-full max-w-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="max-h-[85vh] overflow-y-auto p-6">
          <RegisterSimProtection />
        </div>
      </motion.div>
    </div>
  );
}
