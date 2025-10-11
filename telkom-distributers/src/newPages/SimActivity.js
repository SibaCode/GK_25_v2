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

  // Fetch user data and listen for real-time updates
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setCurrentUser(data);

            // pre-fill the first registered SIM
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

      // generate a simple Case Number
      const caseNumber = `CASE-${Math.floor(1000 + Math.random() * 9000)}`;

      const newAlert = {
        simNumber: selectedSim,
        timestamp: Timestamp.now(),
        affectedBanks: currentUser.simProtection?.bankAccounts?.map((b) => b.bankName) || [],
        notifiedNextOfKin: currentUser.simProtection?.nextOfKin?.map((n) => n.name) || [],
        status: "pending",
        caseNumber: caseNumber,
      };

      // Save alert in Firestore
      await updateDoc(docRef, {
        "simProtection.activeAlertsArray": arrayUnion(newAlert),
      });

      // Send email via EmailJS
      await emailjs.send(
        "service_gs10hsn",       // Your Service ID
        "template_tu6ca39",      // Your Template ID
        {
          sim_number: newAlert.simNumber,
          affected_banks: newAlert.affectedBanks.join(", "),
          notified: newAlert.notifiedNextOfKin.join(", "),
          status: newAlert.status,
          time: newAlert.timestamp.toDate().toLocaleString(),
          to_email: currentUser.email,
          case_number: newAlert.caseNumber,
        },
        "3U2Dnx4hFe8-eLaQk"         // Replace with your EmailJS public key
      );

      alert("Alert triggered and email sent successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to trigger alert or send email.");
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
            <h2 className="text-lg font-bold mb-2">Alert Timeline</h2>
            {alerts.length === 0 && <p className="text-sm text-gray-500">No alerts yet.</p>}
            <ul className="space-y-3">
              {alerts
                .slice()
                .reverse()
                .map((alert, idx) => (
                <li key={idx} className="border-l-2 border-blue-500 pl-3 p-3 rounded-md hover:bg-gray-50 transition">
                  <p className="text-sm font-semibold">Case: {alert.caseNumber}</p>
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
      </div>
    </div>
  );
}
