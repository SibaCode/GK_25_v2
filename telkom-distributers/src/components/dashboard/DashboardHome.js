// src/components/dashboard/DashboardHome.js
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function DashboardHome() {
    const [data, setData] = useState({
        newAlerts: 0,
        linkedSims: 0,
        historicalAlerts: 0,
    });
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

        // Real-time listener
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data();
                setData({
                    newAlerts: userData.newAlerts?.length || 0,
                    linkedSims: userData.linkedSims?.length || 0,
                    historicalAlerts: userData.historicalAlerts?.length || 0,
                });
            }
            setLoading(false);
        });

        return () => unsubscribe(); // Clean up listener on unmount
    }, []);

    if (loading) return <p className="text-white">Loading dashboard...</p>;

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
                    <p className="text-2xl font-bold text-red-500">{data.newAlerts}</p>
                </div>

                {/*<div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">*/}
                {/*    <h3 className="text-lg font-semibold mb-2">Linked SIMs</h3>*/}
                {/*    <p className="text-2xl font-bold text-indigo-600">{data.linkedSims}</p>*/}
                {/*</div>*/}

                <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
                    <h3 className="text-lg font-semibold mb-2">Historical Alerts</h3>
                    <p className="text-2xl font-bold text-green-500">{data.historicalAlerts}</p>
                </div>
            </div>

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
