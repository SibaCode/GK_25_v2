// src/newDash/dashboard/RegisterSimProtection.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Lock, User, Plus, X } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const RegisterSimProtection = ({ onClose }) => {
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

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const regex = {
    idNumber: /^\d{13}$/,
    phone: /^0\d{9}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    name: /^[A-Za-z\s]{2,}$/,
    bankAccount: /^\d{6,20}$/,
    bankName: /^[A-Za-z\s]{2,}$/,
  };

  // Helper to validate fields
  const validateField = (name, value, index = null) => {
    let error = "";
    switch (name) {
      case "idNumber":
        if (!regex.idNumber.test(value)) error = "ID number must be 13 digits";
        break;
      case "selectedNumber":
        if (!regex.phone.test(value)) error = "Phone number must be 10 digits";
        break;
      case "email":
        if (formData.emailAlert && !regex.email.test(value)) error = "Invalid email address";
        break;
      case "nextOfKinName":
        if (!regex.name.test(value)) error = "Name must be letters only";
        break;
      case "nextOfKinNumber":
        if (!regex.phone.test(value)) error = "Phone must be 10 digits";
        break;
      case "bankName":
        if (!regex.bankName.test(value)) error = "Bank name must be letters only";
        break;
      case "accountNumber":
        if (!regex.bankAccount.test(value)) error = "Account number must be 6–20 digits";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleKinChange = (index, field, value) => {
    const updatedKin = [...formData.nextOfKin];
    if (field === "name") value = value.replace(/[^A-Za-z\s]/g, "");
    if (field === "number") value = value.replace(/[^0-9]/g, "").slice(0, 10);
    updatedKin[index][field] = value;
    setFormData({ ...formData, nextOfKin: updatedKin });
    const errorField = field === "name" ? `nextOfKinName-${index}` : `nextOfKinNumber-${index}`;
    setErrors({ ...errors, [errorField]: validateField(field === "name" ? "nextOfKinName" : "nextOfKinNumber", value) });
  };

  const handleBankChange = (index, field, value) => {
    const updatedAccounts = [...formData.bankAccounts];
    if (field === "bankName") value = value.replace(/[^A-Za-z\s]/g, "");
    if (field === "accountNumber") value = value.replace(/[^0-9]/g, "").slice(0, 20);
    updatedAccounts[index][field] = value;
    setFormData({ ...formData, bankAccounts: updatedAccounts });
    const errorField = field === "bankName" ? `bankName-${index}` : `accountNumber-${index}`;
    setErrors({ ...errors, [errorField]: validateField(field === "bankName" ? "bankName" : "accountNumber", value) });
  };

  const handleToggle = (field) => setFormData({ ...formData, [field]: !formData[field] });
  const addNextOfKin = () => setFormData({ ...formData, nextOfKin: [...formData.nextOfKin, { name: "", number: "" }] });
  const removeNextOfKin = (index) => setFormData({ ...formData, nextOfKin: formData.nextOfKin.filter((_, i) => i !== index) });
  const addBankAccount = () => setFormData({ ...formData, bankAccounts: [...formData.bankAccounts, { bankName: "", accountNumber: "" }] });
  const removeBankAccount = (index) => setFormData({ ...formData, bankAccounts: formData.bankAccounts.filter((_, i) => i !== index) });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formHasError = false;
    const newErrors = {};

    // Main fields
    if (!regex.idNumber.test(formData.idNumber)) { newErrors.idNumber = "ID number must be 13 digits"; formHasError = true; }
    if (!regex.phone.test(formData.selectedNumber)) { newErrors.selectedNumber = "Phone number must be 10 digits"; formHasError = true; }
    if (formData.emailAlert && !regex.email.test(formData.email)) { newErrors.email = "Invalid email"; formHasError = true; }

    // Next of Kin
    if (formData.nextOfKinAlert) {
      formData.nextOfKin.forEach((kin, index) => {
        if (!regex.name.test(kin.name)) { newErrors[`nextOfKinName-${index}`] = "Name must be letters only"; formHasError = true; }
        if (!regex.phone.test(kin.number)) { newErrors[`nextOfKinNumber-${index}`] = "Phone must be 10 digits"; formHasError = true; }
      });
    }

    // Bank Accounts
    if (formData.bankAccount) {
      formData.bankAccounts.forEach((acc, index) => {
        if (!regex.bankName.test(acc.bankName)) { newErrors[`bankName-${index}`] = "Bank name must be letters only"; formHasError = true; }
        if (!regex.bankAccount.test(acc.accountNumber)) { newErrors[`accountNumber-${index}`] = "Account number must be 6–20 digits"; formHasError = true; }
      });
    }

    if (formHasError) { setErrors(newErrors); return alert("Please fix the errors before submitting."); }

    setLoading(true);
    try {
      await addDoc(collection(db, "simProtection"), { ...formData, createdAt: serverTimestamp() });
      alert("SIM Protection saved successfully!");
      if (onClose) onClose();
    } catch (error) {
      console.error("Error saving SIM protection:", error);
      alert("Failed to save SIM protection. Try again.");
    } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl shadow-xl w-full overflow-y-auto relative">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-700 text-center mb-2">SIM Protection Setup</h1>
        <p className="text-sm text-gray-600 text-center mb-6">Secure your SIM by verifying your identity and setting custom alerts.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ID Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">ID Number</label>
            <p className="text-xs text-gray-500 mb-1">Enter your 13-digit South African ID number.</p>
            <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} placeholder="e.g., 9001015800087" className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.idNumber ? "border-red-500" : "border-gray-300"}`} required />
            {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
          </div>

          {/* Linked Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Linked Number</label>
            <p className="text-xs text-gray-500 mb-1">Enter the phone number you want to protect (10 digits, e.g., 0831234567).</p>
            <input type="text" name="selectedNumber" value={formData.selectedNumber} onChange={handleChange} placeholder="0831234567" className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.selectedNumber ? "border-red-500" : "border-gray-300"}`} required />
            {errors.selectedNumber && <p className="text-red-500 text-sm mt-1">{errors.selectedNumber}</p>}
          </div>

          {/* Email Alert */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-gray-700"><Mail className="w-5 h-5 text-blue-600" /> Send Alert to My Email</label>
            <input type="checkbox" checked={formData.emailAlert} onChange={() => handleToggle("emailAlert")} className="w-5 h-5 accent-blue-600" />
          </div>
          {formData.emailAlert && (
            <div className="space-y-1">
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="user@example.com" className={`w-full border px-3 py-2 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500 outline-none ${errors.email ? "border-red-500" : "border-gray-300"}`} required />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          )}

          {/* Next of Kin */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-gray-700"><Phone className="w-5 h-5 text-blue-600" /> Send Alert to My Next of Kin</label>
            <input type="checkbox" checked={formData.nextOfKinAlert} onChange={() => handleToggle("nextOfKinAlert")} className="w-5 h-5 accent-blue-600" />
          </div>
          {formData.nextOfKinAlert && formData.nextOfKin.map((kin, index) => (
            <div key={index} className="flex flex-col border border-gray-200 p-3 rounded-lg relative">
              {formData.nextOfKin.length > 1 && <button type="button" onClick={() => removeNextOfKin(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><X size={16} /></button>}
              <input type="text" placeholder="Full Name" value={kin.name} onChange={(e) => handleKinChange(index, "name", e.target.value)} className={`border px-3 py-2 rounded-lg mb-1 focus:ring-2 focus:ring-blue-500 outline-none ${errors[`nextOfKinName-${index}`] ? "border-red-500" : "border-gray-300"}`} required />
              {errors[`nextOfKinName-${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`nextOfKinName-${index}`]}</p>}
              <input type="text" placeholder="Phone Number" value={kin.number} onChange={(e) => handleKinChange(index, "number", e.target.value)} className={`border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors[`nextOfKinNumber-${index}`] ? "border-red-500" : "border-gray-300"}`} required />
              {errors[`nextOfKinNumber-${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`nextOfKinNumber-${index}`]}</p>}
            </div>
          ))}
          {formData.nextOfKinAlert && <button type="button" onClick={addNextOfKin} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"><Plus size={16} /> Add Another Next of Kin</button>}

          {/* Auto Lock */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-gray-700"><Lock className="w-5 h-5 text-blue-600" /> Auto-lock SIM if Suspicious Activity</label>
            <input type="checkbox" checked={formData.autoLock} onChange={() => handleToggle("autoLock")} className="w-5 h-5 accent-blue-600" />
          </div>

          {/* Bank Accounts */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-gray-700"><User className="w-5 h-5 text-blue-600" /> Link My Bank Account</label>
            <input type="checkbox" checked={formData.bankAccount} onChange={() => handleToggle("bankAccount")} className="w-5 h-5 accent-blue-600" />
          </div>
          {formData.bankAccount && formData.bankAccounts.map((acc, index) => (
            <div key={index} className="flex flex-col border border-gray-200 p-3 rounded-lg relative">
              {formData.bankAccounts.length > 1 && <button type="button" onClick={() => removeBankAccount(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><X size={16} /></button>}
              <input type="text" placeholder="Bank Name" value={acc.bankName} onChange={(e) => handleBankChange(index, "bankName", e.target.value)} className={`border px-3 py-2 rounded-lg mb-1 focus:ring-2 focus:ring-blue-500 outline-none ${errors[`bankName-${index}`] ? "border-red-500" : "border-gray-300"}`} required />
              {errors[`bankName-${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`bankName-${index}`]}</p>}
              <input type="text" placeholder="Account Number" value={acc.accountNumber} onChange={(e) => handleBankChange(index, "accountNumber", e.target.value)} className={`border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors[`accountNumber-${index}`] ? "border-red-500" : "border-gray-300"}`} required />
              {errors[`accountNumber-${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`accountNumber-${index}`]}</p>}
            </div>
          ))}
          {formData.bankAccount && <button type="button" onClick={addBankAccount} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"><Plus size={16} /> Add Another Account</button>}

          {/* Submit */}
          <motion.button whileTap={{ scale: 0.97 }} type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition" disabled={loading}>
            {loading ? "Saving..." : "Save Protection Settings"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default RegisterSimProtection;
