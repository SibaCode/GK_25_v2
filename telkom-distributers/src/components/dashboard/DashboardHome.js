// src/components/dashboard/DashboardHome.js
import React from "react";

export default function DashboardHome() {
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
                    <p className="text-2xl font-bold text-red-500">3</p>
                </div>

                <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
                    <h3 className="text-lg font-semibold mb-2">Linked SIMs</h3>
                    <p className="text-2xl font-bold text-indigo-600">5</p>
                </div>

                <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
                    <h3 className="text-lg font-semibold mb-2">Historical Alerts</h3>
                    <p className="text-2xl font-bold text-green-500">12</p>
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
