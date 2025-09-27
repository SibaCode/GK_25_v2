import React, { useState } from "react";

const FraudProtectionForm = () => {
    const [idNumber, setIdNumber] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [linkedSIMs, setLinkedSIMs] = useState([]);

    // Mock data for linked SIMs
    const mockSIMs = [
        { number: "0821234567", provider: "Vodacom", status: "Active", lastActive: "2025-09-25" },
        { number: "0839876543", provider: "MTN", status: "Pending Fraud", lastActive: "2025-09-20" },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!idNumber) return alert("Please enter your ID number");

        // Fetch SIMs linked to ID (mock for now)
        setLinkedSIMs(mockSIMs);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-blue-600 text-white shadow-md p-4">
                <h1 className="text-2xl font-bold">Fraud Protection Dashboard</h1>
                <p className="text-sm text-blue-100">Secure your SIMs & track fraud cases</p>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6">
                {/* ID Number Form */}
                {!submitted && (
                    <div className="max-w-md mx-auto bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Enter Your ID Number</h2>
                        <p className="text-gray-600 mb-4">
                            We need your ID to fetch all SIMs linked to your account.
                        </p>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="South African ID Number"
                                value={idNumber}
                                onChange={(e) => setIdNumber(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition"
                            >
                                Verify
                            </button>
                        </form>
                    </div>
                )}

                {/* Linked SIMs */}
                {submitted && linkedSIMs.length > 0 && (
                    <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Linked SIMs</h2>
                        <table className="w-full table-auto border-collapse">
                            <thead>
                                <tr className="border-b bg-gray-100">
                                    <th className="px-4 py-2 text-left">SIM Number</th>
                                    <th className="px-4 py-2 text-left">Provider</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2 text-left">Last Active</th>
                                    <th className="px-4 py-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {linkedSIMs.map((sim, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2">{sim.number}</td>
                                        <td className="px-4 py-2">{sim.provider}</td>
                                        <td className="px-4 py-2">
                                            <span
                                                className={`px-2 py-1 rounded-full text-white text-sm ${sim.status === "Active"
                                                        ? "bg-green-500"
                                                        : sim.status === "Pending Fraud"
                                                            ? "bg-yellow-500"
                                                            : "bg-red-500"
                                                    }`}
                                            >
                                                {sim.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">{sim.lastActive}</td>
                                        <td className="px-4 py-2">
                                            <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">
                                                Report Fraud
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {submitted && linkedSIMs.length === 0 && (
                    <p className="text-center text-gray-500 mt-6">No SIMs linked to this ID.</p>
                )}
            </main>
        </div>
    );
};

export default FraudProtectionForm;

