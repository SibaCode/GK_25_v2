// src/components/dashboard/DashboardAlerts.js
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

export default function AlertsPage() {
    const [alerts, setAlerts] = useState([]);

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
            <div className="text-gray-700">
                <h2 className="text-3xl font-bold mb-2">Alerts</h2>
                <p className="text-gray-500">
                    Here are all alerts generated for your registered SIMs.
                </p>
            </div>

            {alerts.length === 0 ? (
                <p className="text-gray-500">No alerts available.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
                        <thead className="bg-gray-100 text-left text-gray-700">
                            <tr>
                                <th className="px-4 py-3">Ref</th>
                                <th className="px-4 py-3">SIM Number</th>
                                <th className="px-4 py-3">Carrier</th>
                                <th className="px-4 py-3">Rules Applied</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alerts.map((alert, idx) => (
                                <tr key={idx} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3 font-mono text-sm">{alert.ref}</td>
                                    <td className="px-4 py-3">{alert.simNumber}</td>
                                    <td className="px-4 py-3">{alert.carrier}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        <div>
                                            <strong>Banks:</strong>{" "}
                                            {alert.freezeBanks?.length > 0 ? alert.freezeBanks.join(", ") : "None"}
                                        </div>
                                        <div>
                                            <strong>Insurers:</strong>{" "}
                                            {alert.notifyInsurers?.length > 0 ? alert.notifyInsurers.join(", ") : "None"}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-semibold ${alert.status === "new"
                                                    ? "bg-red-100 text-red-600"
                                                    : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {alert.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {alert.createdAt?.seconds
                                            ? new Date(alert.createdAt.seconds * 1000).toLocaleString()
                                            : "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
