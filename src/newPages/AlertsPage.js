// src/newPages/AlertsPage.js
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs, doc, updateDoc, orderBy } from "firebase/firestore";
import { X, Eye } from "lucide-react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchAlerts = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "users", auth.currentUser.uid, "alerts"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const alertsData = [];
      querySnapshot.forEach((doc) => alertsData.push({ id: doc.id, ...doc.data() }));
      setAlerts(alertsData);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const markResolved = async (alertId) => {
    try {
      const alertRef = doc(db, "users", auth.currentUser.uid, "alerts", alertId);
      await updateDoc(alertRef, { status: "resolved" });
      fetchAlerts(); // Refresh after update
    } catch (error) {
      console.error("Error marking alert resolved:", error);
    }
  };

  const filteredAlerts = alerts.filter(
    (a) =>
      a.selectedNumber?.includes(search) ||
      a.nextOfKin?.some((k) => k.name.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <p className="text-center mt-10">Loading alerts...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ssActive Alerts</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by SIM or Next of Kin"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full max-w-md border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {/* Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlerts.length ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white p-4 rounded-2xl shadow-md flex flex-col justify-between ${
                alert.status === "resolved" ? "opacity-50" : ""
              }`}
            >
              <div className="mb-2">
                <h2 className="font-semibold text-gray-700 text-lg">{alert.selectedNumber}</h2>
                <p className="text-sm text-gray-500 mb-1">
                  Type: {alert.type || "SIM Alert"}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  Status: {alert.status || "active"}
                </p>
                <p className="text-sm text-gray-500">
                  Date: {alert.createdAt?.toDate().toLocaleString() || "-"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => markResolved(alert.id)}
                  disabled={alert.status === "resolved"}
                  className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                >
                  Mark as Resolved
                </button>
                <button
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-1"
                >
                  <Eye className="w-4 h-4" /> View
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No alerts found.</p>
        )}
      </div>
    </div>
  );
}
