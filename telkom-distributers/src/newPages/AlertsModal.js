// src/newPages/AlertsModal.js
import React from "react";

export default function AlertsModal({ isOpen, onClose, alerts, handleAddFollowUp }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-11/12 max-w-2xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Active Alerts</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold"
        >
          X
        </button>

        {alerts.length === 0 ? (
          <p className="text-gray-600">No active alerts</p>
        ) : (
          <ul className="space-y-4">
            {alerts.map((alert) => (
              <li key={alert.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <p className="font-semibold">{alert.title}</p>
                <p className="text-sm text-gray-600">{alert.description}</p>
                <p className="text-xs text-gray-400 mb-2">
                  {alert.date?.toDate
                    ? alert.date.toDate().toLocaleString()
                    : alert.date || "-"}
                </p>

                {alert.followUps?.length > 0 && (
                  <div className="mb-2">
                    <p className="text-sm font-medium">Follow-Up:</p>
                    <ul className="list-disc list-inside text-gray-600 text-xs">
                      {alert.followUps.map((f, idx) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => handleAddFollowUp(alert.id)}
                  className="text-blue-600 text-xs hover:underline"
                >
                  Add Follow-Up
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
