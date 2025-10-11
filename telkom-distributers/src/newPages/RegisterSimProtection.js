// src/newDash/dashboard/RegisterSimProtection.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Lock, User, Plus, X } from "lucide-react";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { getLinkedSimsById } from "./fakeRicaApi";

const translations = {
  en: {
    title: "SIM Protection Setup",
    description: "Secure your SIM by verifying your identity and setting custom alerts.",
    idNumber: "ID Number",
    idNumberPlaceholder: "Enter your 13-digit South African ID number",
    linkedNumber: "Linked Number",
    linkedNumberDescription: "Select the phone number you want to protect:",
    loadingSims: "Loading linked SIMs...",
    enterNumberManually: "Enter number manually",
    sendEmailAlert: "Send Alert to My Email",
    emailPlaceholder: "user@example.com",
    sendKinAlert: "Send Alert to My Next of Kin",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    autoLock: "Auto-lock SIM if Suspicious Activity",
    linkBank: "Link My Bank Account",
    bankName: "Bank Name",
    accountNumber: "Account Number",
    addAnotherKin: "Add Another Next of Kin",
    addAnotherAccount: "Add Another Account",
    save: "Save Protection Settings",
    saving: "Saving...",
    fixErrors: "Please fix the errors before submitting.",
    saved: "SIM Protection saved successfully!",
    failed: "Failed to save SIM protection. Try again.",
    preferredLanguage: "Preferred Language",
  },
  zu: {
    title: "Lungelo Lokuvikela i-SIM",
    description: "Vikela i-SIM yakho ngokuhlola ubuqiniso bakho futhi usethe izaziso ezenziwe ngokwezifiso.",
    idNumber: "Inombolo ye-ID",
    idNumberPlaceholder: "Faka inombolo yakho ye-ID engu-13",
    linkedNumber: "Inombolo Ehlobene",
    linkedNumberDescription: "Khetha inombolo yocingo ofuna ukuyivikela:",
    loadingSims: "Ilayisha i-SIM exhunywe...",
    enterNumberManually: "Faka inombolo ngesandla",
    sendEmailAlert: "Thumela Isaziso Ku-imeyili Yami",
    emailPlaceholder: "umsebenzisi@example.com",
    sendKinAlert: "Thumela Isaziso Komuntu Osondele Kimina",
    fullName: "Igama Eligcwele",
    phoneNumber: "Inombolo Yocingo",
    autoLock: "Vala i-SIM ngokuzenzakalelayo uma kunezenzo ezingavamile",
    linkBank: "Hlanganisa I-akhawunti Yami yaseBhange",
    bankName: "Igama Lebhange",
    accountNumber: "Inombolo Ye-Akhawunti",
    addAnotherKin: "Engeza Omunye Osondele",
    addAnotherAccount: "Engeza Enye I-akhawunti",
    save: "Londoloza Izilungiselelo Zokuvikela i-SIM",
    saving: "Ligcina...",
    fixErrors: "Sicela lungisa amaphutha ngaphambi kokuthumela.",
    saved: "Ukuvikela i-SIM kugcinwe ngempumelelo!",
    failed: "Ukuvikela i-SIM kwehlulekile. Zama futhi.",
    preferredLanguage: "Ulimi Oluthandwayo",
  },
  xh: {
    title: "Usetyenziso Lokuqinisekisa i-SIM",
    description: "Khusela i-SIM yakho ngokuvavanya ubuqu bakho kunye nokumisela izaziso.",
    idNumber: "Inombolo ye-ID",
    idNumberPlaceholder: "Faka inombolo yakho ye-ID eyi-13",
    linkedNumber: "Inombolo Exhunyiwe",
    linkedNumberDescription: "Khetha inombolo yefowuni ofuna ukuyikhusela:",
    loadingSims: "Ukulayisha ii-SIM ezinxulunyaniswe...",
    enterNumberManually: "Faka inombolo ngesandla",
    sendEmailAlert: "Thumela Isaziso kwi-imeyile yam",
    emailPlaceholder: "umsebenzisi@example.com",
    sendKinAlert: "Thumela Isaziso Komnye Umntu Oseduze Nam",
    fullName: "Igama Elipheleleyo",
    phoneNumber: "Inombolo Yefowuni",
    autoLock: "Vala i-SIM ngokuzenzekelayo ukuba kukho imisebenzi engaqhelekanga",
    linkBank: "Nxibelelana neAkhawunti yam yaseBhanki",
    bankName: "Igama leBhanki",
    accountNumber: "Inombolo yeAkhawunti",
    addAnotherKin: "Yongeza Omnye Umntu Oseduze",
    addAnotherAccount: "Yongeza Enye iAkhawunti",
    save: "Gcina Usetyenziso Lokuqinisekisa i-SIM",
    saving: "Kugcinwa...",
    fixErrors: "Nceda lungisa iimpazamo ngaphambi kokuthumela.",
    saved: "Ukuvikela i-SIM kugcinwe ngempumelelo!",
    failed: "Ukuvikela i-SIM kwehlulekile. Zama kwakhona.",
    preferredLanguage: "Ulwimi Oluthandwayo",
  },
  af: {
    title: "SIM-beskerming Instelling",
    description: "Beveilig jou SIM deur jou identiteit te verifieer en pasgemaakte waarskuwings te stel.",
    idNumber: "ID Nommer",
    idNumberPlaceholder: "Voer jou 13-syfer Suid-Afrikaanse ID nommer in",
    linkedNumber: "Gekoppelde Nommer",
    linkedNumberDescription: "Kies die telefoonnommer wat jy wil beskerm:",
    loadingSims: "Laai gekoppelde SIM-kaarte...",
    enterNumberManually: "Voer nommer handmatig in",
    sendEmailAlert: "Stuur waarskuwing na my e-pos",
    emailPlaceholder: "gebruiker@example.com",
    sendKinAlert: "Stuur waarskuwing na my familielid",
    fullName: "Volledige Naam",
    phoneNumber: "Telefoonnommer",
    autoLock: "Outomatiese SIM-sluiting indien verdagte aktiwiteit",
    linkBank: "Koppel my bankrekening",
    bankName: "Bank Naam",
    accountNumber: "Rekeningnommer",
    addAnotherKin: "Voeg nog 'n familielid by",
    addAnotherAccount: "Voeg nog 'n rekening by",
    save: "Stoor SIM-beskerming instellings",
    saving: "Stoor...",
    fixErrors: "Los asseblief die foute op voordat jy indien.",
    saved: "SIM-beskerming suksesvol gestoor!",
    failed: "SIM-beskerming kon nie gestoor word nie. Probeer weer.",
    preferredLanguage: "Voorkeurtaal",
  },
};

const RegisterSimProtection = ({ onClose }) => {
  const [formData, setFormData] = useState({
    idNumber: "",
    selectedNumber: "",
    preferredLanguage: "en", // default
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

  const regex = {
    idNumber: /^\d{13}$/,
    phone: /^0\d{9}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    name: /^[A-Za-z\s]{2,}$/,
    bankAccount: /^\d{6,20}$/,
    bankName: /^[A-Za-z\s]{2,}$/,
  };

  const t = translations[formData.preferredLanguage] || translations.en;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) return;
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.preferredLanguage) {
          setFormData(prev => ({ ...prev, preferredLanguage: data.preferredLanguage }));
        }
      }
    };
    fetchUserData();
  }, []);

  const validateField = (name, value, index = null) => {
    let error = "";
    switch (name) {
      case "idNumber":
        if (!regex.idNumber.test(value)) error = t.idNumber + " must be 13 digits";
        break;
      case "selectedNumber":
        if (!regex.phone.test(value)) error = t.phoneNumber + " must be 10 digits";
        break;
      case "email":
        if (formData.emailAlert && !regex.email.test(value)) error = "Invalid email address";
        break;
      case "nextOfKinName":
        if (!regex.name.test(value)) error = t.fullName + " must be letters only";
        break;
      case "nextOfKinNumber":
        if (!regex.phone.test(value)) error = t.phoneNumber + " must be 10 digits";
        break;
      case "bankName":
        if (!regex.bankName.test(value)) error = t.bankName + " must be letters only";
        break;
      case "accountNumber":
        if (!regex.bankAccount.test(value)) error = t.accountNumber + " must be 6–20 digits";
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

    if (!regex.idNumber.test(formData.idNumber)) { newErrors.idNumber = t.idNumber + " must be 13 digits"; formHasError = true; }
    if (!regex.phone.test(formData.selectedNumber)) { newErrors.selectedNumber = t.phoneNumber + " must be 10 digits"; formHasError = true; }
    if (formData.emailAlert && !regex.email.test(formData.email)) { newErrors.email = "Invalid email"; formHasError = true; }

    if (formData.nextOfKinAlert) {
      formData.nextOfKin.forEach((kin, index) => {
        if (!regex.name.test(kin.name)) { newErrors[`nextOfKinName-${index}`] = t.fullName + " must be letters only"; formHasError = true; }
        if (!regex.phone.test(kin.number)) { newErrors[`nextOfKinNumber-${index}`] = t.phoneNumber + " must be 10 digits"; formHasError = true; }
      });
    }

    if (formData.bankAccount) {
      formData.bankAccounts.forEach((acc, index) => {
        if (!regex.bankName.test(acc.bankName)) { newErrors[`bankName-${index}`] = t.bankName + " must be letters only"; formHasError = true; }
        if (!regex.bankAccount.test(acc.accountNumber)) { newErrors[`accountNumber-${index}`] = t.accountNumber + " must be 6–20 digits"; formHasError = true; }
      });
    }

    if (formHasError) { setErrors(newErrors); return alert(t.fixErrors); }

    setLoading(true);
    try {
      if (!auth.currentUser) throw new Error("User not logged in");

      await setDoc(doc(db, "users", auth.currentUser.uid), {
        simProtection: formData,
        preferredLanguage: formData.preferredLanguage,
        createdAt: serverTimestamp()
      }, { merge: true });

      alert(t.saved);
      if (onClose) onClose();
    } catch (error) {
      console.error("Error saving SIM protection:", error);
      alert(t.failed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl shadow-xl w-full overflow-y-auto relative">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-700 text-center mb-2">{t.title}</h1>
        <p className="text-sm text-gray-600 text-center mb-6">{t.description}</p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Preferred Language */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">{t.preferredLanguage}</label>
            <select name="preferredLanguage" value={formData.preferredLanguage} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="en">English</option>
              <option value="zu">Zulu</option>
              {/* add Xhosa and Afrikaans if desired */}
            </select>
          </div>

          {/* ID Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">{t.idNumber}</label>
            <p className="text-xs text-gray-500 mb-1">{t.idNumberPlaceholder}</p>
            <input type="text" name="idNumber" value={formData.idNumber} onChange={handleIdChange} placeholder={t.idNumberPlaceholder} className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.idNumber ? "border-red-500" : "border-gray-300"}`} required />
            {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
          </div>

          {/* Linked Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">{t.linkedNumber}</label>
            <p className="text-xs text-gray-500 mb-1">{t.linkedNumberDescription}</p>

            {loadingSims && <p className="text-blue-600 text-sm mb-2">{t.loadingSims}</p>}

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
                placeholder={t.enterNumberManually}
                className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors.selectedNumber ? "border-red-500" : "border-gray-300"}`}
                required
              />
            )}

            {errors.selectedNumber && <p className="text-red-500 text-sm mt-1">{errors.selectedNumber}</p>}
          </div>

          {/* Email Alert */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-gray-700"><Mail className="w-5 h-5 text-blue-600" /> {t.sendEmailAlert}</label>
            <input type="checkbox" checked={formData.emailAlert} onChange={() => handleToggle("emailAlert")} className="w-5 h-5 accent-blue-600" />
          </div>
          {formData.emailAlert && (
            <div className="space-y-1">
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={t.emailPlaceholder} className={`w-full border px-3 py-2 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500 outline-none ${errors.email ? "border-red-500" : "border-gray-300"}`} required />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          )}

          {/* Next of Kin */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-gray-700"><Phone className="w-5 h-5 text-blue-600" /> {t.sendKinAlert}</label>
            <input type="checkbox" checked={formData.nextOfKinAlert} onChange={() => handleToggle("nextOfKinAlert")} className="w-5 h-5 accent-blue-600" />
          </div>
          {formData.nextOfKinAlert && formData.nextOfKin.map((kin, index) => (
            <div key={index} className="flex flex-col border border-gray-200 p-3 rounded-lg relative">
              {formData.nextOfKin.length > 1 && <button type="button" onClick={() => removeNextOfKin(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><X size={16} /></button>}
              <input type="text" placeholder={t.fullName} value={kin.name} onChange={(e) => handleKinChange(index, "name", e.target.value)} className={`border px-3 py-2 rounded-lg mb-1 focus:ring-2 focus:ring-blue-500 outline-none ${errors[`nextOfKinName-${index}`] ? "border-red-500" : "border-gray-300"}`} required />
              {errors[`nextOfKinName-${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`nextOfKinName-${index}`]}</p>}
              <input type="text" placeholder={t.phoneNumber} value={kin.number} onChange={(e) => handleKinChange(index, "number", e.target.value)} className={`border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors[`nextOfKinNumber-${index}`] ? "border-red-500" : "border-gray-300"}`} required />
              {errors[`nextOfKinNumber-${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`nextOfKinNumber-${index}`]}</p>}
            </div>
          ))}
          {formData.nextOfKinAlert && <button type="button" onClick={addNextOfKin} className="flex items-center gap-1 text-blue-600 font-medium"><Plus size={16} /> {t.addAnotherKin}</button>}

          {/* Auto-lock SIM */}
          <div className="flex items-center justify-between">
            <label className="text-gray-700">{t.autoLock}</label>
            <input type="checkbox" checked={formData.autoLock} onChange={() => handleToggle("autoLock")} className="w-5 h-5 accent-blue-600" />
          </div>

          {/* Bank Account */}
          <div className="flex items-center justify-between">
            <label className="text-gray-700">{t.linkBank}</label>
            <input type="checkbox" checked={formData.bankAccount} onChange={() => handleToggle("bankAccount")} className="w-5 h-5 accent-blue-600" />
          </div>
          {formData.bankAccount && formData.bankAccounts.map((acc, index) => (
            <div key={index} className="flex flex-col border border-gray-200 p-3 rounded-lg relative">
              {formData.bankAccounts.length > 1 && <button type="button" onClick={() => removeBankAccount(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><X size={16} /></button>}
              <input type="text" placeholder={t.bankName} value={acc.bankName} onChange={(e) => handleBankChange(index, "bankName", e.target.value)} className={`border px-3 py-2 rounded-lg mb-1 focus:ring-2 focus:ring-blue-500 outline-none ${errors[`bankName-${index}`] ? "border-red-500" : "border-gray-300"}`} required />
              {errors[`bankName-${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`bankName-${index}`]}</p>}
              <input type="text" placeholder={t.accountNumber} value={acc.accountNumber} onChange={(e) => handleBankChange(index, "accountNumber", e.target.value)} className={`border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${errors[`accountNumber-${index}`] ? "border-red-500" : "border-gray-300"}`} required />
              {errors[`accountNumber-${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`accountNumber-${index}`]}</p>}
            </div>
          ))}
          {formData.bankAccount && <button type="button" onClick={addBankAccount} className="flex items-center gap-1 text-blue-600 font-medium"><Plus size={16} /> {t.addAnotherAccount}</button>}

          {/* Submit */}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            {loading ? t.saving : t.save}
          </button>

        </form>
      </div>
    </motion.div>
  );
};

export default RegisterSimProtection;
