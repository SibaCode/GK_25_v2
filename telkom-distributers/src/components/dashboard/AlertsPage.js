// src/components/dashboard/AlertsPage.js
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function AlertsPage() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                if (!user) {
                    setLoading(false);
                    return;
                }

                const userRef = doc(db, "users", user.uid);
                const snap = await getDoc(userRef);

                if (snap.exists()) {
                    const data = snap.data();
                    setAlerts(data.alerts || []);
                }
            } catch (err) {
                console.error("Error fetching alerts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, []);

    if (loading) return <p className="p-6 text-gray-600">Loading alerts...</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">My Alerts</h2>

                {alerts.length === 0 ? (
                    <p className="text-gray-600">No alerts found.</p>
                ) : (
                    <div className="space-y-4">
                        {alerts.map((alert, idx) => (
                            <div
                                key={idx}
                                className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm"
                            >
                                <p className="text-sm text-gray-500 mb-1">
                                    Ref Number:{" "}
                                    <span className="font-mono font-semibold text-blue-600">
                                        {alert.refNumber}
                                    </span>
                                </p>
                                <p className="text-lg font-semibold text-gray-800">
                                    SIM: {alert.simNumber}
                                </p>
                                <p className="text-gray-700 mt-1">{alert.message}</p>

                                <div className="mt-2">
                                    <p className="font-semibold text-gray-700">Applied Rules:</p>
                                    <ul className="list-disc list-inside text-gray-600">
                                        <li>
                                            Banks Frozen:{" "}
                                            {alert.rules?.freezeBanks?.length
                                                ? alert.rules.freezeBanks.join(", ")
                                                : "None"}
                                        </li>
                                        <li>
                                            Insurers Notified:{" "}
                                            {alert.rules?.notifyInsurers?.length
                                                ? alert.rules.notifyInsurers.join(", ")
                                                : "None"}
                                        </li>
                                    </ul>
                                </div>

                                <p className="text-xs text-gray-500 mt-2">
                                    Created:{" "}
                                    {alert.createdAt?.seconds
                                        ? new Date(alert.createdAt.seconds * 1000).toLocaleString()
                                        : "N/A"}
                                </p>
                                <p
                                    className={`inline-block mt-2 px-2 py-1 text-xs rounded ${alert.resolved
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {alert.resolved ? "Resolved" : "Active"}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
