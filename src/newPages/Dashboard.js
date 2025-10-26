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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { t, i18n } = useTranslation();

  // Fetch user from Firestore and listen for changes
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

  // Dynamic Coverage Calculation
  const calculateCoverageTotal = () => {
    let total = currentUser?.simProtection?.coverage || 0;
    if (currentUser?.creditLockActive) total += currentUser?.creditLockCoverage || 0;
    if (currentUser?.dataBrokerActive) total += currentUser?.dataBrokerCoverage || 0;
    return total >= 1000000 ? `${total / 1000000}M` : `${total / 1000}K`;
  };

  // Active services count
  const activeServicesCount = () => {
    let count = currentUser?.simProtection?.active ? 1 : 0;
    if (currentUser?.creditLockActive) count++;
    if (currentUser?.dataBrokerActive) count++;
    return count;
  };

  // Security score
  const calculateSecurityScore = () => {
    let score = 0;
    if (currentUser?.simProtection?.active) score += 65;
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
      alert(t("logoutFailed") || t("logoutFailedFallback"));
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
    if (service === "creditLock") window.location.href = "/CreditLock";
    if (service === "dataBroker") window.location.href = "/DataBroker";
  };

  const handleFileClaim = () => {
    alert(t("redirectClaims") || "Redirecting to claims portal...");
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">{t("loadingUser")}</p>;
  if (!currentUser) return <p className="text-center mt-10 text-gray-600">{t("noUser")}</p>;

  const alerts = currentUser.simProtection?.activeAlertsArray || [];
  const securityScore = calculateSecurityScore();
  const activeServices = activeServicesCount();

  return (
    <div className="min-h-screen bg-gray-100">
    {/* Mobile Navbar */}
<div className="lg:hidden bg-white shadow-sm border-b p-4 sticky top-0 z-50">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 transition"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      <div>
        <h1 className="text-xl font-bold text-blue-600">SimSure</h1>
        <p className="text-xs text-gray-500">FSP License #123456</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <button 
        onClick={() => setIsAlertModalOpen(true)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <Bell className="w-5 h-5" />
        {alerts.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {alerts.length}
          </span>
        )}
      </button>
    </div>
  </div>
</div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 lg:pt-6">
        {/* Sidebar - Hidden on mobile when menu is closed */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block lg:col-span-1 bg-white rounded-3xl shadow-md p-5 flex flex-col gap-6 overflow-auto max-h-[90vh]`}>
          {/* Logo - Hidden on mobile since it's in navbar */}
          <div className="hidden lg:block mb-6">
            <h1 className="text-2xl font-bold text-blue-600">SimSure</h1>
            <p className="text-xs text-gray-500 mt-1">FSP License #123456</p>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-200 to-blue-400 flex items-center justify-center text-blue-600 font-bold text-lg shadow">
              {currentUser.fullName?.split(" ").map((n) => n[0]).join("") || "U"}
            </div>
            <div className="flex flex-col justify-center truncate">
              <h2 className="font-semibold text-gray-800 text-base">{currentUser.fullName}</h2>
              <p className="text-xs text-gray-500">{t("policyHolder")}</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600 font-semibold">{currentUser.simProtection?.active ? t("protected") : t("inactive")}</span>
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

          {/* Services */}
          <div className="flex flex-col gap-3 mb-6">
            <Link 
              to="/SimFraud" 
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 p-3 rounded-lg hover:bg-blue-50 transition border-l-4 ${currentUser.simProtection?.active ? "border-blue-500 bg-blue-25" : "border-gray-300"}`}
            >
              <Bell className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-semibold text-gray-800">{t("simFraudAlert")}</div>
                <div className="text-xs text-gray-500">${currentUser.simProtection?.coverage || 0} {t("coverage")} • {currentUser.simProtection?.active ? t("active") : t("inactive")}</div>
              </div>
            </Link>
            <Link 
              to="/CreditLock" 
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 p-3 rounded-lg hover:bg-purple-50 transition border-l-4 ${currentUser.creditLockActive ? "border-purple-300" : "border-gray-300"}`}
            >
              <Lock className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-semibold text-gray-800">{t("creditFileLock")}</div>
                <div className="text-xs text-gray-500">${currentUser.creditLockCoverage || 0} {t("coverage")} • {currentUser.creditLockActive ? t("active") : t("inactive")}</div>
              </div>
            </Link>
            <Link 
              to="/DataBroker" 
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 p-3 rounded-lg hover:bg-green-50 transition border-l-4 ${currentUser.dataBrokerActive ? "border-green-300" : "border-gray-300"}`}
            >
              <Database className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-semibold text-gray-800">{t("dataBrokerRemoval")}</div>
                <div className="text-xs text-gray-500">{t("preventive")} • {currentUser.dataBrokerActive ? t("active") : t("inactive")}</div>
              </div>
            </Link>
          </div>

          {/* Policy Documents */}
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition text-gray-700"
            >
              <FileText className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium">{t("policyDocuments")}</span>
            </button>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition text-gray-700"
            >
              <Shield className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium">{t("termsConditions")}</span>
            </button>
          </div>

          {/* Help / Logout */}
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-medium flex items-center justify-center gap-2"
          >
            <span className="text-blue-500 font-bold">?</span> {t("help")}
          </button>
          <button 
            onClick={handleLogout} 
            className="mt-auto flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition duration-200 shadow-sm text-sm font-medium"
          >
            <LogOut className="w-4 h-4" /> {t("logout")}
          </button>
        </div>

        {/* Main Dashboard */}
        <div className="lg:col-span-3 space-y-6 overflow-auto">
          {/* Policy Overview */}
          <div className="bg-white p-6 rounded-3xl shadow-md border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{t("yourProtectionPortfolio")}</h2>
                <p className="text-gray-600 text-sm mt-1">Policy #POL-{currentUser.uid?.slice(-8).toUpperCase() || "ACTIVE"}</p>
                <p className="text-gray-500 text-xs mt-2">{t("memberSince")}: {new Date(currentUser.createdAt?.toDate() || new Date()).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{calculateCoverageTotal()}</p>
                <p className="text-gray-500 text-sm">{t("totalCoverage")}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600">{activeServices}/3 {t("servicesActive")}</span>
                </div>
              </div>
            </div>
            {/* Coverage Cards */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-blue-700">${currentUser.simProtection?.coverage || 0}</p>
                <p className="text-xs text-gray-600">{t("simProtection")}</p>
                <div className={`w-3 h-3 rounded-full mx-auto mt-1 ${currentUser.simProtection?.active ? "bg-green-500" : "bg-red-500"}`}></div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="font-semibold text-purple-700">${currentUser.creditLockCoverage || 0}</p>
                <p className="text-xs text-gray-600">{t("creditLock")}</p>
                <div className={`w-3 h-3 rounded-full mx-auto mt-1 ${currentUser.creditLockActive ? "bg-green-500" : "bg-red-500"}`}></div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="font-semibold text-green-700">${currentUser.dataBrokerCoverage || 0}</p>
                <p className="text-xs text-gray-600">{t("dataBroker")}</p>
                <div className={`w-3 h-3 rounded-full mx-auto mt-1 ${currentUser.dataBrokerActive ? "bg-green-500" : "bg-red-500"}`}></div>
              </div>
            </div>
          </div>

          {/* Alerts Section */}
          <div className="bg-white p-6 rounded-3xl shadow-md border-l-4 border-red-500">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-red-800 flex items-center gap-2"><AlertTriangle className="w-5 h-5" />{t("emergencyResponse")}</h3>
              <button className="text-sm text-blue-600 underline" onClick={() => setIsAlertModalOpen(true)}>{t("viewAlerts")}</button>
            </div>
            {alerts.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700">
                {alerts.map((alert, i) => <li key={i}>{alert}</li>)}
              </ul>
            ) : <p className="text-gray-500 text-sm">{t("noActiveAlerts")}</p>}
          </div>

          {/* Security Score / Recommendations */}
          <div className="bg-white p-6 rounded-3xl shadow-md border-l-4 border-blue-600">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-blue-800 flex items-center gap-2"><Shield className="w-5 h-5" />{t("riskAssessment")}</h3>
              <span className="text-sm text-gray-500">{t("securityScore")}: {securityScore}/100</span>
            </div>
            <p className="text-gray-700 text-sm">
              {securityScore >= 80 ? t("recommendationExcellent") : t("recommendationImprove")}
            </p>
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
      {isAlertModalOpen && <AlertHistoryModal onClose={() => setIsAlertModalOpen(false)} />}
      {openModal === "register" && <RegisterSimProtectionModal onClose={() => setOpenModal(null)} />}
      {openModal === "view" && <ViewSimProtectionModal onClose={() => setOpenModal(null)} />}
      {openModal === "edit" && <EditSimProtectionModal onClose={() => setOpenModal(null)} />}
    </div>
  );
}