// src/newPages/ViewAlertsModal.js
import React from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const ViewAlertsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Suspicious Login Attempt',
      message: 'New device detected from Johannesburg',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'SIM Protection Active',
      message: 'Your SIM protection is now active and monitoring',
      time: '1 day ago',
      read: true
    },
    {
      id: 3,
      type: 'success',
      title: 'Verification Complete',
      message: 'All identity verifications completed successfully',
      time: '2 days ago',
      read: true
    }
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'success': return 'bg-green-50 border-green-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Security Alerts</h2>
            <p className="text-sm text-gray-600">Recent security notifications and alerts</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="overflow-y-auto max-h-[60vh] p-6">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${getBgColor(alert.type)} ${!alert.read ? 'ring-2 ring-opacity-50 ring-yellow-400' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {getIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-800">{alert.title}</h3>
                      <span className="text-xs text-gray-500">{alert.time}</span>
                    </div>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                  </div>
                </div>
                {!alert.read && (
                  <div className="flex justify-end mt-2">
                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                      Mark as read
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* No Alerts State */}
          {alerts.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-700 mb-2">No Active Alerts</h3>
              <p className="text-sm text-gray-500">Your account is secure with no recent alerts</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <span className="text-sm text-gray-600">
            {alerts.filter(alert => !alert.read).length} unread alerts
          </span>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewAlertsModal;