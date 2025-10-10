// src/newPages/SimActivity.js
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp, getDoc, doc } from "firebase/firestore";
import { motion } from "framer-motion";

export default function SimActivity() {
  const [simNumber, setSimNumber] = useState("");
  const [bankAccounts, setBankAccounts] = useState([]);
  const [emailAlert, setEmailAlert] = useState(false);
  const [nextOfKin, setNextOfKin] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data().simProtection || {};
        setSimNumber(data.selectedNumber || "");
        setBankAccounts(data.bankAccounts || []);
        setEmailAlert(data.emailAlert || false);
        setNextOfKin(data.nextOfKin || []);
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  const triggerAlert = async () => {
    if (!auth.currentUser) return alert("User not logged in");
    try {
      const alertsRef = collection(db, "users", auth.currentUser.uid, "alerts");
      await addDoc(alertsRef, {
        simNumber,
        timestamp: serverTimestamp(),
        affectedAccounts: bankAccounts,
        notified: {
          email: emailAlert,
          nextOfKin,
        },
        status: "pending",
      });
      alert("Alert triggered successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to trigger alert.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading SIM data...</p>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-xl font-bold mb-4">Trigger SIM Activity Alert</h1>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">SIM Number</label>
        <input type="text" value={simNumber} disabled className="w-full border px-3 py-2 rounded-lg bg-gray-100" />
      </div>

      <div className="mb-4">
        <p className="text-gray-700 mb-1">Bank Accounts Affected:</p>
        {bankAccounts.length ? (
          bankAccounts.map((acc, idx) => (
            <p key={idx} className="text-sm text-gray-600">{acc.bankName}: {acc.accountNumber}</p>
          ))
        ) : <p className="text-sm text-gray-500">None</p>}
      </div>

      <div className="mb-4">
        <p className="text-gray-700 mb-1">Notifications:</p>
        {emailAlert && <p className="text-sm text-gray-600">Email: {auth.currentUser?.email}</p>}
        {nextOfKin.length ? nextOfKin.map((kin, idx) => (
          <p key={idx} className="text-sm text-gray-600">Next of Kin: {kin.name} - {kin.number}</p>
        )) : <p className="text-sm text-gray-500">No next of kin notifications</p>}
      </div>

      <button
        onClick={triggerAlert}
        className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition font-medium"
      >
        Trigger Alert
      </button>
    </motion.div>
  );
}
