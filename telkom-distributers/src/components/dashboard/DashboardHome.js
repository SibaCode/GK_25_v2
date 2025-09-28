import React from "react";

export default function DashboardHome() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Welcome to SIM Protection</h1>
            <p className="text-gray-700">
                This service alerts you of any unusual activity on your SIM cards.
                You can register new SIMs, track alerts, and manage your linked accounts.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-100 p-4 rounded-lg shadow">
                    <h2 className="font-semibold">New Alerts</h2>
                    <p className="text-2xl font-bold text-blue-800">2</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg shadow">
                    <h2 className="font-semibold">Total SIMs Linked</h2>
                    <p className="text-2xl font-bold text-green-800">3</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg shadow">
                    <h2 className="font-semibold">Historical Alerts</h2>
                    <p className="text-2xl font-bold text-yellow-800">5</p>
                </div>
            </div>
        </div>
    );
}
