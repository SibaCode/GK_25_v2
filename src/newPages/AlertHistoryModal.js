// src/newPages/AlertHistoryModal.js
import React from 'react';
import { X, Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const AlertHistoryModal = ({ onClose, userData }) => {
  // Sample alert data - replace with actual data from your backend
  const alerts = [
    {
      id: 1,
      type: 'security',
      title: 'New Login Detected',
      message: 'A new device logged into your account from Johannesburg',
      timestamp: new Date('2024-01-15T10:30:00'),
      read: true
    },
    {
      id: 2,
      type: 'update',
      title: 'Policy Updated',
      message: 'Your coverage amount has been increased to R500,000',
      timestamp: new Date('2024-01-14T14:20:00'),
      read: true
    },
    {
      id: 3,
      type: 'warning',
      title: 'Verification Required',
      message: 'Please complete your identity verification to maintain coverage',
      timestamp: new Date('2024-01-13T09:15:00'),
      read: false
    }
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'security':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'update':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'security':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'update':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Alert History</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh] p-6">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${getBackgroundColor(alert.type)} ${
                  !alert.read ? 'ring-2 ring-blue-200' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {getIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                      <span className="text-sm text-gray-500">
                        {alert.timestamp.toLocaleDateString()} at{' '}
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{alert.message}</p>
                  </div>
                  {!alert.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {alerts.length === 0 && (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No alerts to display</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertHistoryModal;