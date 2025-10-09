// src/newDash/dashboard/DashboardAlerts.js
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Button } from "../ui/button";

export default function DashboardAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const unsub = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        setAlerts(snap.data().alerts || []);
      }
    });

    return () => unsub();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Alerts</h2>
      <p className="text-gray-600">
        All alerts for your registered SIMs. Click a ref to see details.
      </p>

      {/* Alerts Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl p-4">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-blue-100 text-gray-800">
            <tr>
              <th className="border px-4 py-2 text-left">Ref</th>
              <th className="border px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length === 0 ? (
              <tr>
                <td colSpan="2" className="border px-4 py-2 text-center text-gray-500">
                  No alerts available
                </td>
              </tr>
            ) : (
              alerts.map((alert, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-blue-50 cursor-pointer"
                  onClick={() => setSelectedAlert(alert)}
                >
                  <td className="border px-4 py-2 font-mono text-blue-700 font-semibold">
                    {alert.ref}
                  </td>
                  <td className={`border px-4 py-2 font-semibold ${alert.status === "new" ? "text-red-500" : "text-green-600"}`}>
                    {alert.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              Alert Details
            </h3>
            <p className="text-green-600 font-semibold mb-4">
              ✅ This alert has been sent to your banks and insurers.
            </p>

            <p><strong>Ref:</strong> {selectedAlert.ref}</p>
            <p><strong>Status:</strong> {selectedAlert.status}</p>
            <p><strong>SIM Number:</strong> {selectedAlert.simNumber}</p>
            <p><strong>Carrier:</strong> {selectedAlert.carrier}</p>
            <p><strong>Date:</strong> {selectedAlert.createdAt?.seconds ? new Date(selectedAlert.createdAt.seconds * 1000).toLocaleString() : "-"}</p>

            <div className="flex justify-end mt-4">
              <Button className="bg-gray-300 text-black" onClick={() => setSelectedAlert(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
