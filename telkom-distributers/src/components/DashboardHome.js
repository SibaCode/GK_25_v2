// src/components/dashboard/DashboardHome.js
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function DashboardHome() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
            console.log("No user logged in");
            setLoading(false);
            return;
        }

        const docRef = doc(db, "users", currentUser.uid);

        // Real-time listener for user data
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setUserData(docSnap.data());
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <p className="text-white">Loading dashboard...</p>;
    if (!userData) return <p className="text-white">No data found.</p>;

    const newAlerts = userData.alerts?.filter(a => a.status === "new") || [];
    const historicalAlerts = userData.alerts?.filter(a => a.status === "closed") || [];
    const linkedSims = userData.linkedSims || [];

    return (
        <div className="space-y-6">
            <div className="text-gray-700">
                <h2 className="text-3xl font-bold mb-2">Welcome to SIM Protection</h2>
                <p className="text-gray-500">
                    Monitor your SIM cards, alerts, and linked accounts from a single dashboard.
                </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
                    <h3 className="text-lg font-semibold mb-2">New Alerts</h3>
                    <p className="text-2xl font-bold text-red-500">{newAlerts.length}</p>
                </div>

                <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
                    <h3 className="text-lg font-semibold mb-2">Linked SIMs</h3>
                    <p className="text-2xl font-bold text-indigo-600">{linkedSims.length}</p>
                </div>

                <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
                    <h3 className="text-lg font-semibold mb-2">Historical Alerts</h3>
                    <p className="text-2xl font-bold text-green-500">{historicalAlerts.length}</p>
                </div>
            </div>

            {/* Alerts List */}
            {newAlerts.length > 0 && (
                <div className="bg-white shadow-md rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
                    <ul className="space-y-3">
                        {newAlerts.map((alert, idx) => (
                            <li
                                key={idx}
                                className="border border-red-200 bg-red-50 p-4 rounded-lg"
                            >
                                <p><strong>Ref:</strong> {alert.ref}</p>
                                <p><strong>SIM:</strong> {alert.simNumber} ({alert.carrier})</p>
                                <p><strong>Rules:</strong>
                                    {[
                                        ...(alert.freezeBanks || []),
                                        ...(alert.notifyInsurers || [])
                                    ].join(", ") || "None"}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Info Section */}
            <div className="bg-white shadow-md rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">About SIM Protection</h3>
                <p className="text-gray-600">
                    This service monitors all registered SIM cards and notifies you of suspicious activity.
                    Keep your SIM cards and linked accounts safe.
                </p>
            </div>
        </div>
    );
}
