import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import i18next from "i18next";

export default function RegisterModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", preferredLanguage: "en" });
  const [loading, setLoading] = useState(false);

  const languages = [
    { code: "en", label: "English" },
    { code: "zu", label: "Zulu" },
    { code: "xh", label: "Xhosa" },
    { code: "af", label: "Afrikaans" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(userCredential.user, { displayName: form.fullName });
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        fullName: form.fullName,
        email: form.email,
        preferredLanguage: form.preferredLanguage,
        phone: "",
        nextOfKin: [],
        registeredSIMs: 0,
        activeAlerts: 0,
        linkedBanks: 0,
        createdAt: new Date(),
      });
      i18next.changeLanguage(form.preferredLanguage);
      toast.success("Registered successfully!");
      onClose();
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <Toaster position="top-right" />
      <div className="modal-content">
        <button onClick={onClose} className="modal-close">&times;</button>
        <h1 className="modal-title">Create Your Account</h1>
        <p className="modal-subtitle">Protect your digital life in minutes</p>
        <form className="modal-form" onSubmit={handleSubmit}>
          <input type="text" name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <select name="preferredLanguage" value={form.preferredLanguage} onChange={handleChange}>
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="modal-login-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}
