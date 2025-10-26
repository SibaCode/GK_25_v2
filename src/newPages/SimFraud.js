// src/newPages/Dashboard.js
import React, { useState, useEffect } from "react";
import { Bell, LogOut, Shield, FileText, HelpCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import RegisterSimProtectionModal from "./RegisterSimProtectionModal";
import ViewAlertsModal from "./ViewAlertsModal";

export default function SimFraud() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(null); // "registerSim" | "viewAlerts"

  const { t, i18n } = useTranslation();

  // Fetch current user
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) setCurrentUser(docSnap.data());
          setLoading(false);
        });
        return () => unsubscribeSnapshot();
      } else setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // Update i18n language
  useEffect(() => {
    if (currentUser?.preferredLanguage) i18n.changeLanguage(currentUser.preferredLanguage);
  }, [currentUser, i18n]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      alert(t("logoutFailed") || "Failed to logout. Try again.");
    }
  };

  const handleLanguageChange = async (newLang) => {
    i18n.changeLanguage(newLang);
    if (auth.currentUser) {
      const docRef = doc(db, "users", auth.currentUser.uid);
      try {
        await updateDoc(docRef, { preferredLanguage: newLang });
        setCurrentUser({ ...currentUser, preferredLanguage: newLang });
      } catch (error) {
        console.error("Failed to update language:", error);
      }
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">{t("loadingUser")}</p>;
  if (!currentUser) return <p className="text-center mt-10 text-gray-600">{t("noUser")}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 p-4">

        {/* Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-3xl shadow-md p-5 flex flex-col gap-6 overflow-auto max-h-[90vh]">
          {/* Logo */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-blue-600">SimSure</h1>
            <p className="text-xs text-gray-500 mt-1">FSP License #123456</p>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-200 to-blue-400 flex items-center justify-center text-blue-600 font-bold shadow">
              {currentUser.fullName?.split(" ").map((n) => n[0]).join("") || "U"}
            </div>
            <div className="flex flex-col justify-center truncate">
              <h2 className="font-semibold text-gray-800">{currentUser.fullName}</h2>
              <p className="text-xs text-gray-500">Policy Holder</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600 font-semibold">Protected</span>
              </div>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex flex-col gap-1">
            <label htmlFor="language-select" className="text-sm font-semibold text-gray-700">{t("preferredLanguage")}</label>
            <select
              id="language-select"
              value={currentUser.preferredLanguage || "en"}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-300 transition"
            >
              <option value="en">English</option>
              <option value="af">Afrikaans</option>
              <option value="zu">Zulu</option>
              <option value="xh">Xhosa</option>
              <option value="st">Sotho</option>
            </select>
          </div>

          {/* Service Links */}
          <div className="flex flex-col gap-3 mb-4">
            <Link to="/SimFraud" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition border-l-4 border-blue-500">
              <Bell className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-semibold text-gray-800">SIM Protection</div>
                <div className="text-xs text-gray-500">$1M Coverage • Active</div>
              </div>
            </Link>
          </div>

          {/* Information Links */}
          <div className="flex flex-col gap-2 mb-4">
            <Link to="/security-tips" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition text-gray-700">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Security Tips</span>
            </Link>
            <Link to="/documents" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition text-gray-700">
              <FileText className="w-4 h-4 text-green-600" />
              <span className="text-sm">Policy Documents</span>
            </Link>
            <Link to="/help" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition text-gray-700">
              <HelpCircle className="w-4 h-4 text-purple-600" />
              <span className="text-sm">Help & Support</span>
            </Link>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-auto flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition duration-200 shadow-sm text-sm font-medium"
          >
            <LogOut className="w-4 h-4" /> {t("logout")}
          </button>
        </div>

        {/* Main Dashboard */}
        <div className="lg:col-span-3 space-y-6 overflow-auto max-h-[90vh]">

          {/* Register / View Alerts / Pre-Declare */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <button
              onClick={() => setOpenModal("registerSim")}
              className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-md hover:scale-105 transform transition duration-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <Bell className="w-8 h-8" />
                <span className="text-lg font-semibold">Register SIM</span>
              </div>
              <p className="text-sm text-blue-100">Protect your SIM</p>
            </button>

            <button
              onClick={() => setOpenModal("viewAlerts")}
              className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-md hover:scale-105 transform transition duration-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-8 h-8" />
                <span className="text-lg font-semibold">View Alerts</span>
              </div>
              <p className="text-sm text-red-100">See recent threats</p>
            </button>

            <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-6 flex flex-col justify-between">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Pre-Declare Changes</h3>
              <p className="text-gray-600 text-sm mb-4">
                Notify us if you plan to swap your SIM or travel abroad. Prevent false alarms.
              </p>
              <div className="flex flex-col gap-2">
                <button className="bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition">SIM Swap</button>
                <button className="bg-yellow-100 text-yellow-700 border border-yellow-500 py-3 rounded-lg font-semibold hover:bg-yellow-200 transition">Travel / Country Move</button>
              </div>
            </div>
          </div>

          {/* Current Protected Account */}
          <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-blue-500">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Current Protected Account</h3>
            <p className="text-gray-600 text-sm">Policy #POL-{currentUser.uid?.slice(-8).toUpperCase() || "ACTIVE"}</p>
            <p className="text-gray-600 text-sm mt-1">SIM Protection Active • $1M Coverage</p>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-red-800 mb-2">Emergency Contacts</h3>
            <p className="text-gray-600 text-sm mb-4">Call immediately if you suspect SIM theft or fraud.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition">File Claim Now</button>
              <button className="bg-white text-red-600 border border-red-600 py-3 rounded-lg font-semibold hover:bg-red-50 transition">Call: 1-800-XXX-XXXX</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {openModal === "registerSim" && (
        <RegisterSimProtectionModal isOpen={true} onClose={() => setOpenModal(null)} />
      )}
      {openModal === "viewAlerts" && (
        <ViewAlertsModal isOpen={true} onClose={() => setOpenModal(null)} />
      )}
    </div>
  );
}
