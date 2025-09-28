// src/components/dashboard/DashboardAlerts.js
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { Button } from "../ui/button";
import toast, { Toaster } from "react-hot-toast";

export default function DashboardAlerts() {
    const [alerts, setAlerts] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedAlert, setSelectedAlert] = useState(null); // for modal

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const unsub = onSnapshot(userRef, (snap) => {
            if (snap.exists()) {
                const newAlerts = snap.data().alerts || [];
                if (newAlerts.length > alerts.length) {
                    toast.success("New alert received!");
                }
                setAlerts(newAlerts);
            }
        });

        return () => unsub();
    }, [alerts.length]);

    const filteredAlerts = alerts.filter(
        (alert) =>
            alert.simNumber.includes(search) ||
            alert.carrier.toLowerCase().includes(search.toLowerCase()) ||
            alert.status.toLowerCase().includes(search.toLowerCase())
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
                placeholder="Search by SIM, Carrier, or Status"
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
                                <th className="px-4 py-3">SIM Number</th>
                                <th className="px-4 py-3">Carrier</th>
                                <th className="px-4 py-3">Rules Applied</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Date</th>
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
                                    <td className="px-4 py-3">{alert.simNumber}</td>
                                    <td className="px-4 py-3">{alert.carrier}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        <div>
                                            <strong>Banks:</strong>{" "}
                                            {alert.freezeBanks?.length > 0
                                                ? alert.freezeBanks.join(", ")
                                                : "None"}
                                        </div>
                                        <div>
                                            <strong>Insurers:</strong>{" "}
                                            {alert.notifyInsurers?.length > 0
                                                ? alert.notifyInsurers.join(", ")
                                                : "None"}
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

            {/* Modal for selected alert */}
            {selectedAlert && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-96">
                        <h3 className="text-xl font-bold mb-2">Alert Details</h3>
                        <p className="text-green-600 font-semibold mb-4">
                            ? This alert has been sent to the selected banks and insurers.
                        </p>

                        <p>
                            <strong>Ref:</strong> {selectedAlert.ref}
                        </p>
                        <p>
                            <strong>SIM Number:</strong> {selectedAlert.simNumber}
                        </p>
                        <p>
                            <strong>Carrier:</strong> {selectedAlert.carrier}
                        </p>
                        <p>
                            <strong>Alternative Email:</strong> {selectedAlert.altEmail || "—"}
                        </p>
                        <p>
                            <strong>Alternative Phone:</strong> {selectedAlert.altPhone || "—"}
                        </p>
                        <p>
                            <strong>Banks to Freeze:</strong>{" "}
                            {selectedAlert.freezeBanks?.length > 0
                                ? selectedAlert.freezeBanks.join(", ")
                                : "None"}
                        </p>
                        <p>
                            <strong>Insurers to Notify:</strong>{" "}
                            {selectedAlert.notifyInsurers?.length > 0
                                ? selectedAlert.notifyInsurers.join(", ")
                                : "None"}
                        </p>
                        <p>
                            <strong>Status:</strong> {selectedAlert.status}
                        </p>
                        <p>
                            <strong>Date:</strong>{" "}
                            {selectedAlert.createdAt?.seconds
                                ? new Date(selectedAlert.createdAt.seconds * 1000).toLocaleString()
                                : "—"}
                        </p>

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
