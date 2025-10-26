// src/newPages/ViewAlertsModal.js
import React from "react";
import { X, Bell } from "lucide-react";

export default function ViewAlertsModal({ isOpen, onClose, alerts = [] }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" /> Alerts History
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="p-4 max-h-80 overflow-y-auto">
          {alerts.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">No alerts available.</p>
          ) : (
            <ul className="space-y-3">
              {alerts.map((alert, idx) => (
                <li
                  key={idx}
                  className="bg-red-50 p-3 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="text-gray-800 font-medium">{alert.title || "Alert"}</p>
                    <p className="text-gray-500 text-sm">{alert.description || "Details not provided"}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      alert.status === "active" ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {alert.status || "Inactive"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
