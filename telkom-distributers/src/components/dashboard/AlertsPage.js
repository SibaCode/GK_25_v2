// src/components/dashboard/DashboardAlerts.js
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { Button } from "../ui/button";
import { Toaster } from "react-hot-toast";

export default function AlertsPage() {
    const [alerts, setAlerts] = useState([]);
    const [search, setSearch] = useState("");
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

    const filteredAlerts = alerts.filter(
        (alert) =>
            alert.ref.toLowerCase().includes(search.toLowerCase()) ||
            alert.simNumber?.toLowerCase().includes(search.toLowerCase()) ||
            alert.status?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 p-4">
            <Toaster position="top-right" />
            <div className="text-gray-700">
                <h2 className="text-3xl font-bold mb-2">Alerts</h2>
                <p className="text-gray-500">
                    Here are all alerts generated for your registered SIMs.
                </p>
            </div>

            <input
                type="text"
                placeholder="Search by Ref, SIM, or Status"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full md:w-1/3 mb-4"
            />

            {filteredAlerts.length === 0 ? (
                <p className="text-gray-500">No alerts available.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
                        <thead className="bg-gray-100 text-left text-gray-700">
                            <tr>
                                <th className="px-4 py-3">Ref</th>
                                <th className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAlerts.map((alert, idx) => (
                                <tr
                                    key={idx}
                                    className="border-t hover:bg-gray-50 cursor-pointer"
                                    onClick={() => setSelectedAlert(alert)}
                                >
                                    <td className="px-4 py-3 font-mono text-sm">{alert.ref}</td>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal for selected alert */}
            {selectedAlert && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-2">Alert Details</h3>
                        <p className="text-green-600 font-semibold mb-4">
                            ? This alert has been sent to the selected banks and insurers.
                        </p>

                        <div className="space-y-2 text-gray-700">
                            <p><strong>Ref:</strong> {selectedAlert.ref}</p>
                            <p><strong>Status:</strong> {selectedAlert.status}</p>
                        </div>

                        <div className="mt-6">
                            <h4 className="font-semibold mb-2">Timeline</h4>
                            <ul className="list-disc list-inside text-gray-600">
                                <li>SIM registered - 28 Sep 2025, 10:00 AM</li>
                                <li>Banks notified - 28 Sep 2025, 10:05 AM</li>
                                <li>Insurers notified - 28 Sep 2025, 10:07 AM</li>
                                <li>Status updated (new) - 28 Sep 2025, 10:10 AM</li>
                            </ul>
                        </div>

                        <div className="flex justify-end mt-4">
                            <Button
                                className="bg-gray-300 text-black"
                                onClick={() => setSelectedAlert(null)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
