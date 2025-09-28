import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Toaster } from "react-hot-toast";

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
                    newAlerts: alerts.filter(a => a.status === "new").length,
                    linkedSims: userData.linkedSims?.length || 0,
                    historicalAlerts: alerts.filter(a => a.status !== "new").length,
                    alerts: alerts.sort(
                        (a, b) => new Date(b.createdAt?.seconds * 1000 || 0) - new Date(a.createdAt?.seconds * 1000 || 0)
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
            <div className="flex justify-between items-center">
                <div className="text-gray-700">
                    <h2 className="text-3xl font-bold mb-2">Welcome to SIM Protection</h2>
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

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
                    <h3 className="text-lg font-semibold mb-2">New Alerts</h3>
                    <p className="text-2xl font-bold text-red-500">{data.newAlerts}</p>
                </div>

              
            </div>

            {/* Alerts Table */}
            <div className="bg-white shadow-md rounded-xl p-6 overflow-x-auto">
                <h3 className="text-lg font-semibold mb-4">All Alerts</h3>
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2 text-left">Ref</th>
                            <th className="border px-4 py-2 text-left">SIM Number</th>
                            <th className="border px-4 py-2 text-left">Carrier</th>
                            <th className="border px-4 py-2 text-left">Status</th>
                            <th className="border px-4 py-2 text-left">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.alerts.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="border px-4 py-2 text-center text-gray-500">
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
                                    <td className="border px-4 py-2">{alert.simNumber}</td>
                                    <td className="border px-4 py-2">{alert.carrier}</td>
                                    <td className={`border px-4 py-2 font-semibold ${alert.status === "new" ? "text-red-500" : "text-green-500"}`}>
                                        {alert.status}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {alert.createdAt
                                            ? new Date(alert.createdAt.seconds * 1000).toLocaleString()
                                            : "-"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for Selected Alert */}
            {selectedAlert && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-96">
                        <h3 className="text-xl font-bold mb-2">Alert Details</h3>
                        <p className="text-green-600 font-semibold mb-4">
                            ? This alert has been sent to the selected banks and insurers.
                        </p>

                        <p><strong>Ref:</strong> {selectedAlert.ref}</p>
                        <p><strong>SIM Number:</strong> {selectedAlert.simNumber}</p>
                        <p><strong>Carrier:</strong> {selectedAlert.carrier}</p>
                        <p><strong>Alternative Email:</strong> {selectedAlert.altEmail || "—"}</p>
                        <p><strong>Alternative Phone:</strong> {selectedAlert.altPhone || "—"}</p>
                        <p><strong>Banks to Freeze:</strong> {selectedAlert.freezeBanks?.length > 0 ? selectedAlert.freezeBanks.join(", ") : "None"}</p>
                        <p><strong>Insurers to Notify:</strong> {selectedAlert.notifyInsurers?.length > 0 ? selectedAlert.notifyInsurers.join(", ") : "None"}</p>
                        <p><strong>Status:</strong> {selectedAlert.status}</p>
                        <p><strong>Created At:</strong> {selectedAlert.createdAt ? new Date(selectedAlert.createdAt.seconds * 1000).toLocaleString() : "-"}</p>

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

            {/* Info Section */}
            <div className="bg-white shadow-md rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">About SIM Protection</h3>
                <p className="text-gray-600">
                    This service monitors all registered SIM cards and notifies you of suspicious activity. Keep your SIM cards and linked accounts safe.
                </p>
            </div>
        </div>
    );
}
