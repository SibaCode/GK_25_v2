// src/newPages/Dashboard.js
import React, { useState, useEffect } from "react";
import { Plus, Bell, CreditCard, LogOut, Eye, Clock, Menu, X, Lock, Database, FileText, AlertTriangle, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import AlertHistoryModal from "./AlertHistoryModal";
import DashboardTabs from "./DashboardTabs";
import RegisterSimProtectionModal from "./RegisterSimProtectionModal";
import ViewSimProtectionModal from "./ViewSimProtectionModal";
import EditSimProtectionModal from "./EditSimProtectionModal";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [openModal, setOpenModal] = useState(null); // null | "register" | "view" | "edit"

  const { t, i18n } = useTranslation();

  // Helper to refresh current user from Firestore
  const refreshCurrentUser = async () => {
    if (!auth.currentUser) return;
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) setCurrentUser(docSnap.data());
  };

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

  // Update i18n language based on user's preferredLanguage
  useEffect(() => {
    if (currentUser?.preferredLanguage) {
      i18n.changeLanguage(currentUser.preferredLanguage);
    }
  }, [currentUser, i18n]);

  // Calculate total coverage amount
  const calculateCoverageTotal = () => {
    let total = 1000000; // SIM Protection base
    if (currentUser?.creditLockActive) total += 50000; // Credit Lock coverage
    // Format for display
    return total >= 1000000 ? `${total/1000000}M` : `${total/1000}K`;
  };

  // Calculate active services count
  const activeServicesCount = () => {
    let count = 1; // SIM Protection is always active (base service)
    if (currentUser?.creditLockActive) count++;
    if (currentUser?.dataBrokerActive) count++;
    return count;
  };

  // Calculate security score
  const calculateSecurityScore = () => {
    let score = 65; // Base score with only SIM protection
    if (currentUser?.creditLockActive) score += 20;
    if (currentUser?.dataBrokerActive) score += 15;
    return Math.min(score, 100);
  };

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

  const handleActivateService = (service) => {
    // Navigate to the respective service page for activation
    if (service === 'creditLock') {
      window.location.href = '/CreditLock';
    } else if (service === 'dataBroker') {
      window.location.href = '/DataBroker';
    }
  };

  const handleFileClaim = () => {
    // Implement claim filing logic
    alert("Redirecting to claims portal...");
    // window.location.href = '/file-claim';
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">{t("loadingUser")}</p>;
  if (!currentUser) return <p className="text-center mt-10 text-gray-600">{t("noUser")}</p>;

  const alerts = currentUser.simProtection?.activeAlertsArray || [];
  const securityScore = calculateSecurityScore();
  const activeServices = activeServicesCount();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 p-4">

        {/* Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-3xl shadow-md p-5 flex flex-col gap-6 overflow-auto max-h-[90vh]">
          {/* Logo */}
          <div className="hidden lg:block mb-6">
            <h1 className="text-2xl font-bold text-blue-600">SimSure</h1>
            <p className="text-xs text-gray-500 mt-1">FSP License #123456</p>
          </div>

          {/* Enhanced Profile Section */}
          <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-200 to-blue-400 flex items-center justify-center text-blue-600 font-bold text-lg shadow">
              {currentUser.fullName?.split(" ").map((n) => n[0]).join("") || "U"}
            </div>
            <div className="flex flex-col justify-center truncate">
              <h2 className="font-semibold text-gray-800 text-base">{currentUser.fullName}</h2>
              <p className="text-xs text-gray-500">Policy Holder</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600 font-semibold">Protected</span>
              </div>
            </div>
          </div>

          {/* Language Selector */}
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

          {/* Service Links */}
          <div className="flex flex-col gap-3 mb-6">
            <Link to="/SimFraud" className="flex items-center gap-2 p-3 rounded-lg hover:bg-blue-50 transition border-l-4 border-blue-500 bg-blue-25">
              <Bell className="w-5 h-5 text-blue-600" /> 
              <div>
                <div className="font-semibold text-gray-800">SIM Fraud Alert</div>
                <div className="text-xs text-gray-500">$1M Coverage • Active</div>
              </div>
            </Link>
            <Link to="/CreditLock" className="flex items-center gap-2 p-3 rounded-lg hover:bg-purple-50 transition border-l-4 border-purple-300">
              <Lock className="w-5 h-5 text-purple-600" /> 
              <div>
                <div className="font-semibold text-gray-800">Credit File Lock</div>
                <div className="text-xs text-gray-500">$50K Coverage • Inactive</div>
              </div>
            </Link>
            <Link to="/DataBroker" className="flex items-center gap-2 p-3 rounded-lg hover:bg-green-50 transition border-l-4 border-green-300">
              <Database className="w-5 h-5 text-green-600" /> 
              <div>
                <div className="font-semibold text-gray-800">Data Broker Removal</div>
                <div className="text-xs text-gray-500">Preventive • Inactive</div>
              </div>
            </Link>
          </div>

          {/* Policy Documents */}
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition text-gray-700">
              <FileText className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium">Policy Documents</span>
            </button>
            <button className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition text-gray-700">
              <Shield className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium">Terms & Conditions</span>
            </button>
          </div>

          {/* Help / FAQ */}
          <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-medium flex items-center justify-center gap-2">
            <span className="text-blue-500 font-bold">?</span> {t("help")}
          </button>

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

          {/* Policy Overview - REPLACED WELCOME SECTION */}
          <div className="bg-white p-6 rounded-3xl shadow-md border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Your Protection Portfolio</h2>
                <p className="text-gray-600 text-sm mt-1">Policy #POL-{currentUser.uid?.slice(-8).toUpperCase() || "ACTIVE"}</p>
                <p className="text-gray-500 text-xs mt-2">Member Since: {new Date(currentUser.createdAt?.toDate() || new Date()).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{calculateCoverageTotal()}</p>
                <p className="text-gray-500 text-sm">Total Coverage</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600">{activeServices}/3 Services Active</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-blue-700">$1M</p>
                <p className="text-xs text-gray-600">SIM Protection</p>
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mt-1"></div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="font-semibold text-purple-700">$50K</p>
                <p className="text-xs text-gray-600">Credit Fraud</p>
                <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mt-1"></div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="font-semibold text-green-700">Active</p>
                <p className="text-xs text-gray-600">Data Protection</p>
                <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mt-1"></div>
              </div>
            </div>
          </div>

          {/* Enhanced Services Cards with Insurance Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* SIM Fraud Card */}
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-5 rounded-2xl shadow-md hover:scale-105 transform transition duration-200 relative">
              <div className="absolute top-3 right-3 bg-white text-blue-600 text-xs px-2 py-1 rounded-full font-semibold">
                ACTIVE
              </div>
              <Bell className="w-10 h-10 mb-2" />
              <p className="text-lg font-semibold text-center">SIM Fraud Alert</p>
              <p className="text-blue-100 text-sm text-center mt-2">$1M Coverage</p>
              <div className="flex justify-between items-center mt-3 text-xs">
                <span>Premium: $9.99/mo</span>
                <span>Claims: 0</span>
              </div>
            </div>

            {/* Credit Lock Card */}
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white p-5 rounded-2xl shadow-md hover:scale-105 transform transition duration-200 relative">
              <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                INACTIVE
              </div>
              <Lock className="w-10 h-10 mb-2" />
              <p className="text-lg font-semibold text-center">Credit File Lock</p>
              <p className="text-purple-100 text-sm text-center mt-2">$50K Coverage</p>
              <div className="flex justify-between items-center mt-3 text-xs">
                <span>Premium: $4.99/mo</span>
                <button 
                  onClick={() => handleActivateService('creditLock')}
                  className="bg-white text-purple-600 px-2 py-1 rounded text-xs font-semibold hover:bg-purple-50 transition"
                >
                  ACTIVATE
                </button>
              </div>
            </div>

            {/* Data Broker Card */}
            <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-5 rounded-2xl shadow-md hover:scale-105 transform transition duration-200 relative">
              <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                INACTIVE
              </div>
              <Database className="w-10 h-10 mb-2" />
              <p className="text-lg font-semibold text-center">Data Broker Removal</p>
              <p className="text-green-100 text-sm text-center mt-2">Preventive Service</p>
              <div className="flex justify-between items-center mt-3 text-xs">
                <span>Premium: $4.99/mo</span>
                <button 
                  onClick={() => handleActivateService('dataBroker')}
                  className="bg-white text-green-600 px-2 py-1 rounded text-xs font-semibold hover:bg-green-50 transition"
                >
                  ACTIVATE
                </button>
              </div>
            </div>
          </div>

          {/* Claims & Emergency Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emergency Response */}
            <div className="bg-red-50 border border-red-200 p-5 rounded-2xl">
              <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Emergency Response
              </h3>
              <p className="text-red-700 text-sm mb-4">24/7 Claims & Support</p>
              <div className="space-y-2">
                <button 
                  onClick={handleFileClaim}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  File Claim Now
                </button>
                <button className="w-full bg-white text-red-600 border border-red-600 py-2 rounded-lg font-semibold hover:bg-red-50 transition">
                  Call Emergency: 1-800-XXX-XXXX
                </button>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl">
              <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Risk Assessment
              </h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Your Security Score</span>
                  <span>{securityScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      securityScore >= 80 ? 'bg-green-500' : 
                      securityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} 
                    style={{width: `${securityScore}%`}}
                  ></div>
                </div>
              </div>
              <p className="text-blue-700 text-sm">
                <strong>Recommendation:</strong> {securityScore >= 80 ? 
                  'Excellent protection! Maintain all services.' : 
                  'Activate Credit Lock & Data Broker services for complete protection.'}
              </p>
            </div>
          </div>
         
          {/* Tabs */}
          <div className="bg-white p-6 rounded-3xl shadow-sm">
            <DashboardTabs t={t} />
          </div>

          {/* Security Reminders */}
          <div className="bg-white p-6 rounded-3xl shadow-sm text-gray-700">
            <h2 className="text-lg font-bold mb-3">{t("securityReminders")}</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
              <li>{t("neverShareOtp")}</li>
              <li>{t("checkAccounts")}</li>
              <li>{t("updateRecovery")}</li>
            </ul>
            <p className="text-sm mt-3">
              {t("forMoreTips") || "For more tips, visit your"}{" "}
              <Link to="/alerts" className="text-blue-600 font-medium hover:underline">{t("alertsPage") || "Alerts page"}</Link>.
            </p>
          </div>

          {/* Regulatory Compliance Footer */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border">
            <div className="flex flex-wrap items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span>Underwritten by SimSure Insurance</span>
                <span>•</span>
                <span>FSP License #123456</span>
                <span>•</span>
                <span>{calculateCoverageTotal()} Total Coverage</span>
              </div>
              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                <button className="text-blue-600 hover:underline">Policy Documents</button>
                <span>•</span>
                <button className="text-blue-600 hover:underline">Terms & Conditions</button>
              </div>
            </div>
          </div>
        </div>
       
      </div>

      {/* Modals */}
      {openModal === "register" && (
        <RegisterSimProtectionModal
          isOpen={true}
          onClose={() => {
            setOpenModal(null);
            refreshCurrentUser();
          }}
        />
      )}

      {openModal === "view" && (
        <ViewSimProtectionModal
          data={currentUser.simProtection}
          onEdit={() => setOpenModal("edit")}
          onClose={() => setOpenModal(null)}
        />
      )}

      {openModal === "edit" && (
        <EditSimProtectionModal
          data={currentUser.simProtection}
          onClose={() => setOpenModal(null)}
        />
      )}

      {/* Alerts Modal */}
      <AlertHistoryModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        alerts={alerts}
      />
    </div>
  );
}