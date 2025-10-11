import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Lock, User, Plus, X } from "lucide-react";

const RegisterSimProtection = () => {
  const [formData, setFormData] = useState({
    idNumber: "",
    selectedNumber: "",
    emailAlert: false,
    email: "",
    nextOfKinAlert: false,
    nextOfKin: [{ name: "", number: "" }],
    autoLock: false,
    bankAccount: false,
    bankAccounts: [{ bankName: "", accountNumber: "" }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggle = (field) => {
    setFormData({ ...formData, [field]: !formData[field] });
  };

  const handleKinChange = (index, field, value) => {
    const updatedKin = [...formData.nextOfKin];
    updatedKin[index][field] = value;
    setFormData({ ...formData, nextOfKin: updatedKin });
  };

  const addNextOfKin = () => {
    setFormData({
      ...formData,
      nextOfKin: [...formData.nextOfKin, { name: "", number: "" }],
    });
  };

  const removeNextOfKin = (index) => {
    const updatedKin = formData.nextOfKin.filter((_, i) => i !== index);
    setFormData({ ...formData, nextOfKin: updatedKin });
  };

  const handleBankChange = (index, field, value) => {
    const updatedAccounts = [...formData.bankAccounts];
    updatedAccounts[index][field] = value;
    setFormData({ ...formData, bankAccounts: updatedAccounts });
  };

  const addBankAccount = () => {
    setFormData({
      ...formData,
      bankAccounts: [...formData.bankAccounts, { bankName: "", accountNumber: "" }],
    });
  };

  const removeBankAccount = (index) => {
    const updated = formData.bankAccounts.filter((_, i) => i !== index);
    setFormData({ ...formData, bankAccounts: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-blue-700 text-center mb-2">
          SIM Protection Setup1
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Secure your SIM by verifying your identity and setting custom alerts.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ID Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              ID Number
            </label>
            <p className="text-xs text-gray-500 mb-1">
              Enter the South African ID number linked to your SIM.
            </p>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              placeholder="e.g., 9001015800087"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Linked Numbers */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Linked Numbers
            </label>
            <p className="text-xs text-gray-500 mb-1">
              Select the phone number you want to protect.
            </p>
            <select
              name="selectedNumber"
              value={formData.selectedNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Select a number</option>
              <option value="0831234567">083 123 4567</option>
              <option value="0729876543">072 987 6543</option>
            </select>
          </div>

          {/* Transition Notice */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded-lg mt-6 mb-4">
            <p className="text-blue-700 font-medium">
              You’re now setting up your <span className="font-semibold">Protection Rules</span>.
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Choose how you want to receive alerts and secure your linked accounts.
            </p>
          </div>

          {/* Protection Toggles */}
          <div className="space-y-4">
            {/* Email Alert */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-gray-700">
                <Mail className="w-5 h-5 text-blue-600" />
                Send Alert to My Email
              </label>
              <input
                type="checkbox"
                checked={formData.emailAlert}
                onChange={() => handleToggle("emailAlert")}
                className="w-5 h-5 accent-blue-600"
              />
            </div>
            {formData.emailAlert && (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            )}

            {/* Next of Kin */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-gray-700">
                <Phone className="w-5 h-5 text-blue-600" />
                Send Alert to My Next of Kin
              </label>
              <input
                type="checkbox"
                checked={formData.nextOfKinAlert}
                onChange={() => handleToggle("nextOfKinAlert")}
                className="w-5 h-5 accent-blue-600"
              />
            </div>

            {formData.nextOfKinAlert && (
              <div className="space-y-3 mt-2">
                {formData.nextOfKin.map((kin, index) => (
                  <div
                    key={index}
                    className="flex flex-col border border-gray-200 p-3 rounded-lg relative"
                  >
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
                      onChange={(e) =>
                        handleKinChange(index, "name", e.target.value)
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={kin.number}
                      onChange={(e) =>
                        handleKinChange(index, "number", e.target.value)
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addNextOfKin}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <Plus size={16} /> Add Another Next of Kin
                </button>
              </div>
            )}

            {/* Auto Lock */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-gray-700">
                <Lock className="w-5 h-5 text-blue-600" />
                Auto-lock SIM if Suspicious Activity
              </label>
              <input
                type="checkbox"
                checked={formData.autoLock}
                onChange={() => handleToggle("autoLock")}
                className="w-5 h-5 accent-blue-600"
              />
            </div>

            {/* Bank Accounts */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-gray-700">
                <User className="w-5 h-5 text-blue-600" />
                Link My Bank Account
              </label>
              <input
                type="checkbox"
                checked={formData.bankAccount}
                onChange={() => handleToggle("bankAccount")}
                className="w-5 h-5 accent-blue-600"
              />
            </div>

            {formData.bankAccount && (
              <div className="space-y-3 mt-2">
                {formData.bankAccounts.map((acc, index) => (
                  <div
                    key={index}
                    className="flex flex-col border border-gray-200 p-3 rounded-lg relative"
                  >
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
                      value={acc.bankName}
                      onChange={(e) =>
                        handleBankChange(index, "bankName", e.target.value)
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Account Number"
                      value={acc.accountNumber}
                      onChange={(e) =>
                        handleBankChange(index, "accountNumber", e.target.value)
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addBankAccount}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <Plus size={16} /> Add Another Account
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Save Protection Settings
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterSimProtection;
