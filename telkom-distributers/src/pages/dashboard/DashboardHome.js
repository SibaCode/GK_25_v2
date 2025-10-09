// src/components/dashboard/DashboardHome.js
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import toast, { Toaster } from "react-hot-toast";

export default function DashboardHome() {
  const [data, setData] = useState({
    newAlerts: 0,
    linkedSims: 0,
    historicalAlerts: 0,
    alerts: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.log("No user logged in");
      setLoading(false);
      return;
    }

    const docRef = doc(db, "users", currentUser.uid);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const alerts = userData.alerts || [];

        setData({
          newAlerts: alerts.filter((a) => a.status === "new").length,
          linkedSims: userData.linkedSims?.length || 0,
          historicalAlerts: alerts.filter((a) => a.status !== "new").length,
          alerts: alerts.sort(
            (a, b) =>
              new Date(b.createdAt?.seconds * 1000 || 0) -
              new Date(a.createdAt?.seconds * 1000 || 0)
          ),
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p className="text-white">Loading dashboard...</p>;

  return (
    <div className="space-y-6 p-4">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="text-gray-700">
          <h2 className="text-3xl font-bold mb-2">3Welcome to SIM Protection</h2>
          <p className="text-gray-500">
            Monitor your SIM cards, alerts, and linked accounts from a single dashboard.
          </p>
        </div>
        <Button
          className="bg-blue-500 text-white"
          onClick={() => navigate("/dashboard/registerSim")}
        >
          Register New SIM
        </Button>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
          <h3 className="text-lg font-semibold mb-2">New Alerts</h3>
          <p className="text-2xl font-bold text-red-500">{data.newAlerts}</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
          <h3 className="text-lg font-semibold mb-2">Linked SIMs</h3>
          <p className="text-2xl font-bold text-indigo-600">{data.linkedSims}</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
          <h3 className="text-lg font-semibold mb-2">Historical Alerts</h3>
          <p className="text-2xl font-bold text-green-500">{data.historicalAlerts}</p>
        </div>
      </div>

      {/* Alerts & Safety Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alerts Table */}
        <div className="bg-white shadow-md rounded-xl p-6 overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">Alerts</h3>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Ref</th>
                <th className="border px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.alerts.length === 0 ? (
                <tr>
                  <td colSpan="2" className="border px-4 py-2 text-center text-gray-500">
                    No alerts yet
                  </td>
                </tr>
              ) : (
                data.alerts.map((alert, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <td className="border px-4 py-2">{alert.ref}</td>
                    <td
                      className={`border px-4 py-2 font-semibold ${
                        alert.status === "new" ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {alert.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Safety & Compliance */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Safety & Compliance</h3>
          <p className="text-gray-700 mb-2">
            <strong>Data Protection Act:</strong> Ensure POPIA compliance when handling customer data.
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Financial Regulations:</strong> Follow FSCA regulations for banks and insurers.
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Telecom Regulations:</strong> ICASA rules for SIM registration.
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Cybersecurity:</strong> Protect against unauthorized access.
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Consumer Protection:</strong> Be transparent and fair with customers.
          </p>
          <p className="mt-4 text-green-600 font-bold text-lg">
            All these services for only R15 per month!
          </p>
          <Button
            className="mt-4 bg-blue-500 text-white"
            onClick={() => navigate("/dashboard/alerts")}
          >
            View All Alerts
          </Button>
        </div>
      </div>

      {/* Alert Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-2">Alert Details</h3>
            <p className="text-green-600 font-semibold mb-4">
              ✅ This alert has been sent to the selected banks and insurers.
            </p>
            <p><strong>Ref:</strong> {selectedAlert.ref}</p>
            <p><strong>SIM Number:</strong> {selectedAlert.simNumber}</p>
            <p><strong>Carrier:</strong> {selectedAlert.carrier}</p>
            <p><strong>Status:</strong> {selectedAlert.status}</p>
            <p><strong>Date:</strong> {selectedAlert.createdAt ? new Date(selectedAlert.createdAt.seconds * 1000).toLocaleString() : "-"}</p>
            <p className="mt-4 font-semibold">Timeline (demo):</p>
            <ul className="list-disc ml-5 text-gray-700">
              <li>Alert Created</li>
              <li>Banks Notified</li>
              <li>Insurers Notified</li>
              <li>Customer Confirmed</li>
            </ul>
            <div className="flex justify-end mt-4">
              <Button className="bg-gray-300 text-black" onClick={() => setSelectedAlert(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* About Section */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-2">About SIM Protection</h3>
        <p className="text-gray-600">
          This service monitors all registered SIM cards and notifies you of suspicious activity. Keep your SIM cards and linked accounts safe.
        </p>
      </div>
    </div>
  );
}
