import React from "react";

const sampleAlerts = [
    { id: 1, date: "2025-09-28", sim: "0831234567", type: "SIM Swap", status: "Pending" },
    { id: 2, date: "2025-09-27", sim: "0827654321", type: "Suspicious Transaction", status: "Resolved" },
];

export default function AlertsPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Alerts</h1>
            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr className="border-b bg-gray-200">
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">SIM</th>
                        <th className="p-2 text-left">Type</th>
                        <th className="p-2 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {sampleAlerts.map((alert) => (
                        <tr key={alert.id} className="border-b hover:bg-gray-100">
                            <td className="p-2">{alert.date}</td>
                            <td className="p-2">{alert.sim}</td>
                            <td className="p-2">{alert.type}</td>
                            <td className="p-2">{alert.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
