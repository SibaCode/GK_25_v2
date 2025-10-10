// src/newPages/Dashboard.js
import React, { useState, useEffect } from "react";
import { Plus, Bell, Shield, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import RegisterSimProtectionModal from "./RegisterSimProtectionModal";
import AlertsModal from "./AlertsModal";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("About");
  const [alerts, setAlerts] = useState([]);

  // Listen for auth changes and fetch user data with real-time alerts
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);

        // Real-time listener for user data
        const unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setCurrentUser(data);
            setAlerts(data.simProtection?.alerts || []);
          }
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
      alert("Failed to logout. Try again.");
    }
  };

  const handleAddFollowUp = async (alertId) => {
    const note = prompt("Enter follow-up note:");
    if (!note) return;

    const userRef = doc(db, "users", auth.currentUser.uid);

    const updatedAlerts = alerts.map((a) =>
      a.id === alertId ? { ...a, followUps: [...(a.followUps || []), note] } : a
    );

    await updateDoc(userRef, { "simProtection.alerts": updatedAlerts });
  };

  if (loading) return <p className="text-center mt-10">Loading user data...</p>;
  if (!currentUser) return <p className="text-center mt-10">No user logged in</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* User Info */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 sticky top-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
              {currentUser.fullName?.split(" ").map((n) => n[0]).join("") || "U"}
            </div>
            <div>
              <h2 className="font-bold text-gray-700">{currentUser.fullName || "Unknown User"}</h2>
              <p className="text-sm text-gray-500">{currentUser.email || "-"}</p>
              <p className="text-sm text-gray-500">{currentUser.phone || "-"}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Next of Kin</h3>
            {currentUser.simProtection?.nextOfKin?.length
              ? currentUser.simProtection.nextOfKin.map((kin, idx) => (
                  <div key={idx} className="text-sm text-gray-600 mb-1">
                    {kin.name} - {kin.number}
                  </div>
                ))
              : <p className="text-sm text-gray-500">No next of kin added</p>}
          </div>

          <button
            onClick={handleLogout}
            className="mt-4 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Main Dashboard */}
        <div className="lg:col-span-3 space-y-6">
          {/* User Data Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-md text-gray-700">
            <h2 className="text-lg font-bold mb-3">Your Data Summary</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Total SIMs */}
              <div className="bg-blue-500 text-white p-4 rounded-lg text-center flex flex-col justify-between">
                <div>
                  <p className="text-sm">Total SIMs</p>
                  <p className="text-2xl font-bold">
                    {currentUser.simProtection?.selectedNumber ? 1 : 0}
                  </p>
                </div>
                <button
                  onClick={() => setIsSimModalOpen(true)}
                  className="mt-2 bg-white text-blue-500 px-2 py-1 rounded hover:bg-gray-100 transition text-sm font-medium"
                >
                  Register / Manage SIM
                </button>
              </div>

              {/* Active Alerts */}
              <div className="bg-gray-500 text-white p-4 rounded-lg text-center flex flex-col justify-between">
                <div>
                  <p className="text-sm">Active Alerts</p>
                  <p className="text-2xl font-bold">
                    {alerts.length || 0}
                  </p>
                </div>
                <button
                  onClick={() => setIsAlertsModalOpen(true)}
                  className="mt-2 bg-white text-gray-500 px-2 py-1 rounded hover:bg-gray-100 transition text-sm font-medium"
                >
                  View Alerts
                </button>
              </div>

              {/* Last Updated */}
              <div className="bg-gray-300 text-gray-800 p-4 rounded-lg text-center">
                <p className="text-sm">Last Updated</p>
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
            <div className="flex space-x-4 mb-4">
              {["About", "Legal", "Accessibility"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 font-medium rounded-lg ${
                    activeTab === tab
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "About" && (
              <div>
                <h2 className="text-lg font-bold mb-2">About Us</h2>
                <p className="text-sm">
                  We provide SIM protection services to secure your mobile line and linked accounts. Stay safe and in control.
                </p>
              </div>
            )}
            {activeTab === "Legal" && (
              <div>
                <h2 className="text-lg font-bold mb-2">Legal & Regulations</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                  <li>Data Protection Act (POPIA) compliance</li>
                  <li>FSCA regulations for banks and insurers</li>
                  <li>Telecommunications (ICASA) rules for SIM registration</li>
                  <li>Cybersecurity measures to prevent breaches</li>
                  <li>Consumer Protection Act compliance</li>
                </ul>
              </div>
            )}
            {activeTab === "Accessibility" && (
              <div>
                <h2 className="text-lg font-bold mb-2">♿ Accessibility & Support</h2>
                <p className="text-sm mb-2">Accessible on all devices and screen readers.</p>
                <p className="text-sm">
                  If you experience issues, contact: <span className="text-blue-600 font-medium">support@simprotect.co.za</span>
                </p>
              </div>
            )}
          </div>

          {/* Security Reminders */}
          <div className="bg-white p-6 rounded-2xl shadow-sm text-gray-700">
            <h2 className="text-lg font-bold mb-2">Security Reminders</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
              <li>Never share your OTP or PIN.</li>
              <li>Check your linked accounts regularly.</li>
              <li>Update your recovery number.</li>
            </ul>
            <p className="text-sm mt-2">
              For more tips, visit your <button onClick={() => setIsAlertsModalOpen(true)} className="text-blue-600 font-medium underline">Alerts page</button>.
            </p>
          </div>
        </div>
      </div>

      {/* Register SIM Modal */}
      <RegisterSimProtectionModal
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
      />

      {/* Alerts Modal */}
      <AlertsModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        alerts={alerts}
        handleAddFollowUp={handleAddFollowUp}
      />
    </div>
  );
}
