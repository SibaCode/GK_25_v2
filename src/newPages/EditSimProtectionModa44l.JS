// src/newPages/EditSimProtectionModal.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Phone, Mail, User, Plus, Shield } from 'lucide-react';
import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

const EditSimProtectionModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    emailAlert: true,
    email: '',
    nextOfKinAlert: true,
    nextOfKin: [{ name: '', number: '' }],
    autoLock: true,
    bankAccount: true,
    bankAccounts: [{ bankName: '', accountNumber: '', insuranceAmount: 1000000 }]
  });
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      if (!auth.currentUser) return;
      
      try {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setCurrentUser(data);
          if (data.simProtection) {
            setFormData({
              emailAlert: data.simProtection.emailAlert || true,
              email: data.simProtection.email || '',
              nextOfKinAlert: data.simProtection.nextOfKinAlert || true,
              nextOfKin: data.simProtection.nextOfKin || [{ name: '', number: '' }],
              autoLock: data.simProtection.autoLock || true,
              bankAccount: data.simProtection.bankAccount || true,
              bankAccounts: data.simProtection.bankAccounts || [{ bankName: '', accountNumber: '', insuranceAmount: 1000000 }]
            });
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    
    loadUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!auth.currentUser) throw new Error("User not logged in");

      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        'simProtection.emailAlert': formData.emailAlert,
        'simProtection.email': formData.email,
        'simProtection.nextOfKinAlert': formData.nextOfKinAlert,
        'simProtection.nextOfKin': formData.nextOfKin,
        'simProtection.autoLock': formData.autoLock,
        'simProtection.bankAccount': formData.bankAccount,
        'simProtection.bankAccounts': formData.bankAccounts,
        'simProtection.updatedAt': serverTimestamp()
      });

      alert("SIM Protection settings updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating SIM protection:", error);
      alert("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addNextOfKin = () => {
    setFormData(prev => ({
      ...prev,
      nextOfKin: [...prev.nextOfKin, { name: '', number: '' }]
    }));
  };

  const removeNextOfKin = (index) => {
    setFormData(prev => ({
      ...prev,
      nextOfKin: prev.nextOfKin.filter((_, i) => i !== index)
    }));
  };

  const addBankAccount = () => {
    setFormData(prev => ({
      ...prev,
      bankAccounts: [...prev.bankAccounts, { bankName: '', accountNumber: '', insuranceAmount: 1000000 }]
    }));
  };

  const removeBankAccount = (index) => {
    setFormData(prev => ({
      ...prev,
      bankAccounts: prev.bankAccounts.filter((_, i) => i !== index)
    }));
  };

  const handleKinChange = (index, field, value) => {
    const updatedKin = [...formData.nextOfKin];
    updatedKin[index][field] = value;
    setFormData(prev => ({ ...prev, nextOfKin: updatedKin }));
  };

  const handleBankChange = (index, field, value) => {
    const updatedAccounts = [...formData.bankAccounts];
    updatedAccounts[index][field] = value;
    setFormData(prev => ({ ...prev, bankAccounts: updatedAccounts }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Edit SIM Protection</h2>
            <p className="text-sm text-gray-600">Update your protection settings</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-6">
            {/* Email Alert */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-gray-700">
                <Mail className="w-5 h-5 text-blue-600" />
                Send Email Alerts
              </label>
              <input
                type="checkbox"
                checked={formData.emailAlert}
                onChange={(e) => setFormData(prev => ({ ...prev, emailAlert: e.target.checked }))}
                className="w-5 h-5 accent-blue-600"
              />
            </div>
            {formData.emailAlert && (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            )}

            {/* Next of Kin */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-gray-700">
                <User className="w-5 h-5 text-blue-600" />
                Next of Kin Alerts
              </label>
              <input
                type="checkbox"
                checked={formData.nextOfKinAlert}
                onChange={(e) => setFormData(prev => ({ ...prev, nextOfKinAlert: e.target.checked }))}
                className="w-5 h-5 accent-blue-600"
              />
            </div>
            {formData.nextOfKinAlert && formData.nextOfKin.map((kin, index) => (
              <div key={index} className="flex gap-3 border border-gray-200 p-3 rounded-lg relative">
                {formData.nextOfKin.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeNextOfKin(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                )}
                <input
                  type="text"
                  placeholder="Full Name"
                  value={kin.name}
                  onChange={(e) => handleKinChange(index, 'name', e.target.value)}
                  className="flex-1 border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={kin.number}
                  onChange={(e) => handleKinChange(index, 'number', e.target.value)}
                  className="flex-1 border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            ))}
            {formData.nextOfKinAlert && (
              <button
                type="button"
                onClick={addNextOfKin}
                className="flex items-center gap-2 text-blue-600 font-medium"
              >
                <Plus size={16} />
                Add Another Contact
              </button>
            )}

            {/* Auto Lock */}
            <div className="flex items-center justify-between">
              <label className="text-gray-700">Auto-lock SIM on Suspicious Activity</label>
              <input
                type="checkbox"
                checked={formData.autoLock}
                onChange={(e) => setFormData(prev => ({ ...prev, autoLock: e.target.checked }))}
                className="w-5 h-5 accent-blue-600"
              />
            </div>

            {/* Bank Accounts */}
            <div className="flex items-center justify-between">
              <label className="text-gray-700">Bank Account Protection</label>
              <input
                type="checkbox"
                checked={formData.bankAccount}
                onChange={(e) => setFormData(prev => ({ ...prev, bankAccount: e.target.checked }))}
                className="w-5 h-5 accent-blue-600"
              />
            </div>
            {formData.bankAccount && formData.bankAccounts.map((account, index) => (
              <div key={index} className="flex gap-3 border border-gray-200 p-3 rounded-lg relative">
                {formData.bankAccounts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBankAccount(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                )}
                <input
                  type="text"
                  placeholder="Bank Name"
                  value={account.bankName}
                  onChange={(e) => handleBankChange(index, 'bankName', e.target.value)}
                  className="flex-1 border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Account Number"
                  value={account.accountNumber}
                  onChange={(e) => handleBankChange(index, 'accountNumber', e.target.value)}
                  className="flex-1 border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            ))}
            {formData.bankAccount && (
              <button
                type="button"
                onClick={addBankAccount}
                className="flex items-center gap-2 text-blue-600 font-medium"
              >
                <Plus size={16} />
                Add Another Bank Account
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Protection"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditSimProtectionModal;