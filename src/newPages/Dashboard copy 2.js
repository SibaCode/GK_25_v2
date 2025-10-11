// src/newPages/Dashboard.js
import React, { useState, useEffect } from "react";
import { Plus, Bell, CreditCard, LogOut, Eye, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, onSnapshot , updateDoc} from "firebase/firestore";
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

  const alerts = currentUser.simProtection?.activeAlertsArray || [];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 p-4">

        {/* Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-3xl shadow-md p-5 flex flex-col gap-6 overflow-auto max-h-[90vh]">
          {/* Profile */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-200 to-blue-400 flex items-center justify-center text-blue-600 font-bold text-lg shadow">
              {currentUser.fullName?.split(" ").map((n) => n[0]).join("") || "U"}
            </div>
            <div className="flex flex-col justify-center truncate">
              <h2 className="font-semibold text-gray-800 text-base sm:text-lg">{currentUser.fullName}</h2>
              <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
              <p className="text-xs text-gray-500">{currentUser.phone}</p>
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
          {/* User Data Summary */}
          <div className="bg-white p-6 rounded-3xl shadow-lg text-gray-700">
            <h2 className="text-xl font-bold mb-5">{t("yourDataSummary")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

              {/* Total SIMs */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-5 rounded-2xl flex flex-col justify-between shadow-md hover:scale-105 transform transition duration-200">
                <div>
                  <CreditCard className="w-8 h-8 mb-2 transform transition duration-300 hover:scale-110" />
                  <p className="text-sm">{t("totalSims")}</p>
                  <p className="text-3xl font-bold mt-1">
                    {currentUser.simProtection?.selectedNumber ? 1 : 0}
                  </p>
                </div>

                <button
                  onClick={() => setOpenModal(currentUser.simProtection ? "view" : "register")}
                  className="mt-3 bg-white text-blue-500 px-3 py-1 rounded-lg hover:bg-gray-100 transition text-sm font-medium shadow"
                >
                  {currentUser.simProtection ? "Manage SIM" : "Register SIM"}
                </button>
              </div>

              {/* Active Alerts */}
              <div className="relative bg-gradient-to-br from-red-500 to-red-600 text-white p-5 rounded-2xl flex flex-col justify-between shadow-md hover:scale-105 transform transition duration-200">
                <div>
                  <Bell className="w-8 h-8 mb-2 transform transition duration-300 hover:scale-110" />
                  <p className="text-sm">{t("activeAlerts")}</p>
                  <p className="text-3xl font-bold mt-1">{alerts.length}</p>
                </div>
              
                <button
                  onClick={() => setIsAlertModalOpen(true)}
                  className="mt-3 bg-white text-red-600 px-3 py-1 rounded-lg hover:bg-gray-100 transition text-sm font-medium shadow flex items-center justify-center gap-1 relative"
                >
                  <Eye className="w-4 h-4" /> {t("viewAlerts")}
                  {alerts.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                      {alerts.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Last Updated */}
              <div className="bg-gray-200 text-gray-800 p-5 rounded-2xl flex flex-col justify-center text-center shadow-sm">
                <Clock className="w-8 h-8 mb-2 transform transition duration-300 hover:scale-110" />
                <p className="text-sm">{t("lastUpdated")}</p>
                <p className="text-2xl font-semibold mt-1">
                  {currentUser.simProtection?.createdAt?.toDate
                    ? currentUser.simProtection.createdAt.toDate().toLocaleString()
                    : "-"}
                </p>
              </div>

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
        </div>
      </div>

      {/* Modals */}
      {openModal === "register" && (
        <RegisterSimProtectionModal
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
