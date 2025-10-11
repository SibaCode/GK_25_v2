// src/newDash/dashboard/RegisterSimProtection.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Lock, User, Plus, X } from "lucide-react";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { getLinkedSimsById } from "./fakeRicaApi";
import { useTranslation } from "react-i18next";

const RegisterSimProtection = ({ onClose }) => {
  const { t, i18n } = useTranslation();

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
  const [linkedSims, setLinkedSims] = useState([]);
  const [loadingSims, setLoadingSims] = useState(false);

  // Load preferred language from Firestore when component mounts
  useEffect(() => {
    const loadUserLanguage = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().preferredLanguage) {
        i18n.changeLanguage(docSnap.data().preferredLanguage);
      }
    };
    loadUserLanguage();
  }, [i18n]);

  const regex = {
    idNumber: /^\d{13}$/,
    phone: /^0\d{9}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    name: /^[A-Za-z\s]{2,}$/,
    bankAccount: /^\d{6,20}$/,
    bankName: /^[A-Za-z\s]{2,}$/,
  };

  const validateField = (name, value, index = null) => {
    let error = "";
    switch (name) {
      case "idNumber":
        if (!regex.idNumber.test(value)) error = t("ID number must be 13 digits");
        break;
      case "selectedNumber":
        if (!regex.phone.test(value)) error = t("Phone number must be 10 digits");
        break;
      case "email":
        if (formData.emailAlert && !regex.email.test(value)) error = t("Invalid email address");
        break;
      case "nextOfKinName":
        if (!regex.name.test(value)) error = t("Name must be letters only");
        break;
      case "nextOfKinNumber":
        if (!regex.phone.test(value)) error = t("Phone must be 10 digits");
        break;
      case "bankName":
        if (!regex.bankName.test(value)) error = t("Bank name must be letters only");
        break;
      case "accountNumber":
        if (!regex.bankAccount.test(value)) error = t("Account number must be 6–20 digits");
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleIdChange = async (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, idNumber: value }));
    setErrors(prev => ({ ...prev, idNumber: validateField("idNumber", value) }));

    if (/^\d{13}$/.test(value)) {
      setLoadingSims(true);
      const sims = await getLinkedSimsById(value);
      setLinkedSims(sims);
      setLoadingSims(false);
    } else {
      setLinkedSims([]);
    }
  };

  const handleKinChange = (index, field, value) => {
    const updatedKin = [...formData.nextOfKin];
    if (field === "name") value = value.replace(/[^A-Za-z\s]/g, "");
    if (field === "number") value = value.replace(/[^0-9]/g, "").slice(0, 10);
    updatedKin[index][field] = value;
    setFormData(prev => ({ ...prev, nextOfKin: updatedKin }));
    const errorField = field === "name" ? `nextOfKinName-${index}` : `nextOfKinNumber-${index}`;
    setErrors(prev => ({ ...prev, [errorField]: validateField(field === "name" ? "nextOfKinName" : "nextOfKinNumber", value) }));
  };

  const handleBankChange = (index, field, value) => {
    const updatedAccounts = [...formData.bankAccounts];
    if (field === "bankName") value = value.replace(/[^A-Za-z\s]/g, "");
    if (field === "accountNumber") value = value.replace(/[^0-9]/g, "").slice(0, 20);
    updatedAccounts[index][field] = value;
    setFormData(prev => ({ ...prev, bankAccounts: updatedAccounts }));
    const errorField = field === "bankName" ? `bankName-${index}` : `accountNumber-${index}`;
    setErrors(prev => ({ ...prev, [errorField]: validateField(field === "bankName" ? "bankName" : "accountNumber", value) }));
  };

  const handleToggle = (field) => setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  const addNextOfKin = () => setFormData(prev => ({ ...prev, nextOfKin: [...prev.nextOfKin, { name: "", number: "" }] }));
  const removeNextOfKin = (index) => setFormData(prev => ({ ...prev, nextOfKin: prev.nextOfKin.filter((_, i) => i !== index) }));
  const addBankAccount = () => setFormData(prev => ({ ...prev, bankAccounts: [...prev.bankAccounts, { bankName: "", accountNumber: "" }] }));
  const removeBankAccount = (index) => setFormData(prev => ({ ...prev, bankAccounts: prev.bankAccounts.filter((_, i) => i !== index) }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formHasError = false;
    const newErrors = {};

    if (!regex.idNumber.test(formData.idNumber)) { newErrors.idNumber = t("ID number must be 13 digits"); formHasError = true; }
    if (!regex.phone.test(formData.selectedNumber)) { newErrors.selectedNumber = t("Phone number must be 10 digits"); formHasError = true; }
    if (formData.emailAlert && !regex.email.test(formData.email)) { newErrors.email = t("Invalid email"); formHasError = true; }

    if (formData.nextOfKinAlert) {
      formData.nextOfKin.forEach((kin, index) => {
        if (!regex.name.test(kin.name)) { newErrors[`nextOfKinName-${index}`] = t("Name must be letters only"); formHasError = true; }
        if (!regex.phone.test(kin.number)) { newErrors[`nextOfKinNumber-${index}`] = t("Phone must be 10 digits"); formHasError = true; }
      });
    }

    if (formData.bankAccount) {
      formData.bankAccounts.forEach((acc, index) => {
        if (!regex.bankName.test(acc.bankName)) { newErrors[`bankName-${index}`] = t("Bank name must be letters only"); formHasError = true; }
        if (!regex.bankAccount.test(acc.accountNumber)) { newErrors[`accountNumber-${index}`] = t("Account number must be 6–20 digits"); formHasError = true; }
      });
    }

    if (formHasError) { setErrors(newErrors); return alert(t("Please fix the errors before submitting.")); }

    setLoading(true);
    try {
      if (!auth.currentUser) throw new Error(t("User not logged in"));

      await setDoc(doc(db, "users", auth.currentUser.uid), {
        simProtection: formData,
        createdAt: serverTimestamp()
      }, { merge: true });

      alert(t("SIM Protection saved successfully!"));
      if (onClose) onClose();
    } catch (error) {
      console.error("Error saving SIM protection:", error);
      alert(t("Failed to save SIM protection. Try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl shadow-xl w-full overflow-y-auto relative">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-700 text-center mb-2">{t("SIM Protection Setup")}</h1>
        <p className="text-sm text-gray-600 text-center mb-6">{t("Secure your SIM by verifying your identity and setting custom alerts.")}</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ID Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">{t("ID Number")}</label>
            <p className="text-xs text-gray-500 mb-1">{t("Enter your 13-digit South African ID number.")}</p>
            <input type="text" name="idNumber" value={formData.idNumber} onChange={handleIdChange} placeholder={t("e.g., 9001015800087")} className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.idNumber ? "border-red-500" : "border-gray-300"}`} required />
            {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
          </div>

          {/* Linked Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">{t("Linked Number")}</label>
            <p className="text-xs text-gray-500 mb-1">{t("Select the phone number you want to protect:")}</p>
            {loadingSims && <p className="text-blue-600 text-sm mb-2">{t("Loading linked SIMs...")}</p>}

            {linkedSims.length > 0 ? (
              linkedSims.map((sim, index) => (
                <label key={index} className="flex items-center gap-2 text-blue-600 mb-1">
                  <input
                    type="radio"
                    name="selectedNumber"
                    value={sim.number}
                    checked={formData.selectedNumber === sim.number}
                    onChange={handleChange}
                    className="accent-blue-600"
                  />
                  {sim.number} — {sim.status} ({sim.provider})
                </label>
              ))
            ) : (
              <input
                type="text"
                name="selectedNumber"
                value={formData.selectedNumber}
                onChange={handleChange}
                placeholder={t("Enter number manually")}
                className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.selectedNumber ? "border-red-500" : "border-gray-300"}`}
                required
              />
            )}
            {errors.selectedNumber && <p className="text-red-500 text-sm mt-1">{errors.selectedNumber}</p>}
          </div>

          {/* The rest of the form can follow the same i18next pattern for labels, placeholders, and messages */}

          {/* Submit */}
          <motion.button whileTap={{ scale: 0.97 }} type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition" disabled={loading}>
            {loading ? t("Saving...") : t("Save Protection Settings")}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default RegisterSimProtection;
