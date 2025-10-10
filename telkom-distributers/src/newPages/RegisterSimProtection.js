// src/newPages/SimActivity.js
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, arrayUnion, Timestamp, onSnapshot } from "firebase/firestore";
import { LogOut } from "lucide-react";
import emailjs from "@emailjs/browser";

export default function SimActivity() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSim, setSelectedSim] = useState("");
  const [triggering, setTriggering] = useState(false);

  // Fetch user data + listen for real-time updates
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setCurrentUser(data);

            const firstSim =
              data.simProtection?.selectedNumber ||
              (data.simProtection?.bankAccounts?.[0]?.accountNumber ?? "");
            setSelectedSim(firstSim);
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

  const handleTriggerAlert = async () => {
    if (!selectedSim) return;
    setTriggering(true);

    try {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const newAlert = {
        simNumber: selectedSim,
        timestamp: Timestamp.now(),
        affectedBanks: currentUser.simProtection?.bankAccounts?.map((b) => b.bankName) || [],
        nextOfKin: currentUser.simProtection?.nextOfKin?.map((n) => `${n.name} (${n.number})`) || [],
        status: "Triggered",
      };

      // Save alert in Firestore
      await updateDoc(docRef, {
        "simProtection.activeAlertsArray": arrayUnion(newAlert),
      });

      // Prepare email details
      const sim_number = newAlert.simNumber;
      const affected_banks = newAlert.affectedBanks.join(", ") || "None";
      const next_of_kin = newAlert.nextOfKin.join(", ") || "None";
      const status = newAlert.status;
      const time = new Date().toLocaleString();
      const to_email = currentUser.email; // Send to user’s email

      // Send email via EmailJS
      await emailjs.send(
        "service_gs10hsn",       // ✅ Your Service ID
        "template_tu6ca39",      // ✅ Your Template ID
        { sim_number, affected_banks, next_of_kin, status, time, to_email },
        "3U2Dnx4hFe8-eLaQk"      // ✅ Your Public Key
      );

      alert("🚨 Alert triggered and email sent successfully!");
    } catch (error) {
      console.error("Error triggering alert:", error);
      alert("❌ Failed to trigger alert or send email.");
    }

    setTriggering(false);
  };

  if (loading) return <p className="text-center mt-10">Loading SIM data...</p>;
  if (!currentUser) return <p className="text-center mt-10">No user logged in</p>;

  const simNumbers = [];
  if (currentUser.simProtection?.selectedNumber) simNumbers.push(currentUser.simProtection.selectedNumber);
  if (currentUser.simProtection?.bankAccounts) {
    currentUser.simProtection.bankAccounts.forEach((acc) => {
      if (!simNumbers.includes(acc.accountNumber)) simNumbers.push(acc.accountNumber);
    });
  }

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

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* SIM Selection */}
          <div className="bg-white p-6 rounded-2xl shadow-md text-gray-700">
            <h2 className="text-lg font-bold mb-2">Trigger SIM Activity</h2>
            <p className="text-sm mb-2">Select a SIM to trigger an alert:</p>
            <select
              className="border rounded-lg p-2 mb-4 w-full"
              value={selectedSim}
              onChange={(e) => setSelectedSim(e.target.value)}
            >
              {simNumbers.map((sim, idx) => (
                <option key={idx} value={sim}>{sim}</option>
              ))}
            </select>
            <button
              onClick={handleTriggerAlert}
              disabled={triggering}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              {triggering ? "Triggering..." : "Trigger Alert"}
            </button>
          </div>

          {/* Alert Timeline */}
          <div className="bg-white p-6 rounded-2xl shadow-md text-gray-700">
            <h2 className="text-lg font-bold mb-4">Alert Timeline</h2>
            {alerts.length === 0 ? (
              <p className="text-sm text-gray-500">No alerts yet.</p>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition"
                  >
                    <p className="text-sm font-semibold text-blue-700">📱 SIM: {alert.simNumber}</p>
                    <p className="text-xs text-gray-500">⏰ {alert.timestamp?.toDate().toLocaleString()}</p>
                    <p className="text-sm mt-1">🏦 <strong>Banks:</strong> {alert.affectedBanks.join(", ") || "-"}</p>
                    <p className="text-sm">👨‍👩‍👧 <strong>Next of Kin:</strong> {alert.nextOfKin.join(", ") || "-"}</p>
                    <p className="text-sm font-medium mt-1 text-green-600">🔔 Status: {alert.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
