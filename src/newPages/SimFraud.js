// src/newPages/SimProtectionDashboard.js
import React, { useState, useEffect } from "react";
import { Bell, LogOut, Shield, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";

export default function SimProtectionDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

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

  useEffect(() => {
    if (currentUser?.preferredLanguage) {
      i18n.changeLanguage(currentUser.preferredLanguage);
    }
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

  const simProtection = currentUser.simProtection || {};
  const isActive = simProtection.status === "ACTIVE";

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 p-4">

        {/* Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-3xl shadow-md p-5 flex flex-col gap-6 overflow-auto max-h-[90vh]">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-blue-600">SimSure</h1>
            <p className="text-xs text-gray-500 mt-1">FSP License #123456</p>
          </div>

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

          <div className="flex flex-col gap-1">
            <label htmlFor="language-select" className="text-sm font-semibold text-gray-700">
              {t("preferredLanguage")}
            </label>
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

          <div className="flex flex-col gap-3 mb-4">
            <Link to="/SimFraud" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition border-l-4 border-blue-500">
              <Bell className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-semibold text-gray-800">SIM Protection</div>
                <div className="text-xs text-gray-500">$1M Coverage • {isActive ? "Active" : "Inactive"}</div>
              </div>
            </Link>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <Link to="/security-tips" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition text-gray-700">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Security Tips</span>
            </Link>
            <Link to="/help" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition text-gray-700">
              <HelpCircle className="w-4 h-4 text-purple-600" />
              <span className="text-sm">Help & Support</span>
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="mt-auto flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition duration-200 shadow-sm text-sm font-medium"
          >
            <LogOut className="w-4 h-4" /> {t("logout")}
          </button>
        </div>

        {/* Main Dashboard */}
        <div className="lg:col-span-3 space-y-6 overflow-auto max-h-[90vh]">

          {/* Protection Overview */}
          <div className="bg-white p-6 rounded-3xl shadow-md border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Your SIM Protection</h2>
                <p className="text-gray-600 text-sm mt-1">Policy #POL-{currentUser.uid?.slice(-8).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">$1M</p>
                <p className="text-gray-500 text-sm">Total Coverage</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600">{isActive ? "Active" : "Inactive"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border text-center">
              <p className="text-2xl font-bold text-gray-800">{simProtection.activeAlertsArray?.length || 0}</p>
              <p className="text-gray-600 text-sm">Active Alerts</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border text-center">
              <p className="text-2xl font-bold text-gray-800">{simProtection.linkedAccounts?.length || 0}</p>
              <p className="text-gray-600 text-sm">Linked Accounts</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border text-center">
              <p className="text-2xl font-bold text-gray-800">&lt; 60s</p>
              <p className="text-gray-600 text-sm">Response Time</p>
            </div>
          </div>

          {/* Emergency Access */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-bold text-red-800">Emergency Access</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition">
                File Claim Now
              </button>
              <button className="bg-white text-red-600 border border-red-600 py-3 rounded-lg font-semibold hover:bg-red-50 transition">
                Call: 1-800-XXX-XXXX
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
