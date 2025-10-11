// src/newPages/Dashboard.js
import React, { useState, useEffect } from "react";
import { Plus, Bell, CreditCard, Shield, LogOut, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import RegisterSimProtectionModal from "./RegisterSimProtectionModal";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import DashboardTabs from "./DashboardTabs"; // adjust path



export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("About");
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

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
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      alert(t("logoutFailed") || "Failed to logout. Try again.");
    }
  };

  if (loading) return <p className="text-center mt-10">{t("loadingUser")}</p>;
  if (!currentUser) return <p className="text-center mt-10">{t("noUser")}</p>;

  const alerts = currentUser.simProtection?.activeAlertsArray || [];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 sticky top-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
              {currentUser.fullName?.split(" ").map((n) => n[0]).join("") || "U"}
            </div>
            <div>
              <h2 className="font-bold text-gray-700">{currentUser.fullName}</h2>
              <p className="text-sm text-gray-500">{currentUser.email}</p>
              <p className="text-sm text-gray-500">{currentUser.phone}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">{t("nextOfKin")}</h3>
            {currentUser.simProtection?.nextOfKin?.length
              ? currentUser.simProtection.nextOfKin.map((kin, idx) => (
                  <div key={idx} className="text-sm text-gray-600 mb-1">
                    {kin.name} - {kin.number}
                  </div>
                ))
              : <p className="text-sm text-gray-500">{t("noNextOfKin")}</p>}
          </div>

          <select
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="border p-2 rounded w-full mt-4"
          >
            <option value="en">English</option>
            <option value="af">Afrikaans</option>
            <option value="zu">Zulu</option>
            <option value="xh">Xhosa</option>
            <option value="st">Sotho</option>
          </select>

          <button
            onClick={handleLogout}
            className="mt-4 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <LogOut className="w-4 h-4" /> {t("logout")}
          </button>
        </div>

        {/* Main Dashboard */}
        <div className="lg:col-span-3 space-y-6">
          {/* User Data Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-md text-gray-700">
            <h2 className="text-lg font-bold mb-3">{t("yourDataSummary")}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Total SIMs */}
              <div className="bg-blue-500 text-white p-4 rounded-lg text-center flex flex-col justify-between">
                <div>
                  <p className="text-sm">{t("totalSims")}</p>
                  <p className="text-2xl font-bold">
                    {currentUser.simProtection?.selectedNumber ? 1 : 0}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-2 bg-white text-blue-500 px-2 py-1 rounded hover:bg-gray-100 transition text-sm font-medium"
                >
                  {t("registerSim")}
                </button>
              </div>

              {/* Active Alerts */}
              <div className="bg-gray-500 text-white p-4 rounded-lg text-center flex flex-col justify-between">
                <div>
                  <p className="text-sm">{t("activeAlerts")}</p>
                  <p className="text-2xl font-bold">{alerts.length}</p>
                </div>
                <button
                  onClick={() => setIsAlertModalOpen(true)}
                  className="mt-2 bg-white text-gray-500 px-2 py-1 rounded hover:bg-gray-100 transition text-sm font-medium flex items-center justify-center gap-1"
                >
                  <Eye className="w-4 h-4" /> {t("viewAlerts")}
                </button>
              </div>

              {/* Last Updated */}
              <div className="bg-gray-300 text-gray-800 p-4 rounded-lg text-center">
                <p className="text-sm">{t("lastUpdated")}</p>
                <p className="text-2xl font-bold">
                  {currentUser.simProtection?.createdAt?.toDate
                    ? currentUser.simProtection.createdAt.toDate().toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs for About / Legal / Accessibility */}
        <div className="bg-white p-6 rounded-2xl shadow-sm text-gray-700">
  {/* Tab Buttons */}
  <DashboardTabs t={t} />
</div>


          {/* Security Reminders */}
          <div className="bg-white p-6 rounded-2xl shadow-sm text-gray-700">
            <h2 className="text-lg font-bold mb-2">{t("securityReminders")}</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
              <li>{t("neverShareOtp")}</li>
              <li>{t("checkAccounts")}</li>
              <li>{t("updateRecovery")}</li>
            </ul>
            <p className="text-sm mt-2">
              {t("forMoreTips") || "For more tips, visit your"}{" "}
              <Link to="/alerts" className="text-blue-600 font-medium">{t("alertsPage") || "Alerts page"}</Link>.
            </p>
          </div>
        </div>
      </div>

      {/* Register SIM Modal */}
      <RegisterSimProtectionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (auth.currentUser) {
            const refresh = async () => {
              const docRef = doc(db, "users", auth.currentUser.uid);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) setCurrentUser(docSnap.data());
            };
            refresh();
          }
        }}
      />

      {/* Alerts Modal */}
      {isAlertModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-lg overflow-y-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{t("activeAlerts")}</h2>
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setIsAlertModalOpen(false)}
              >
                {t("close") || "Close"}
              </button>
            </div>
            {alerts.length === 0 && <p className="text-sm text-gray-500">{t("noAlerts") || "No alerts yet."}</p>}
            <ul className="space-y-3">
              {alerts.map((alert, idx) => (
                <li key={idx} className="border-l-2 border-blue-500 pl-3 p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition">
                  <p className="text-sm font-semibold">SIM: {alert.simNumber}</p>
                  <p className="text-sm">Time: {alert.timestamp?.toDate().toLocaleString()}</p>
                  <p className="text-sm">Affected Banks: {alert.affectedBanks.join(", ") || "-"}</p>
                  <p className="text-sm">Notified: {alert.notifiedNextOfKin.join(", ") || "-"}</p>
                  <p className="text-sm">Status: {alert.status}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
