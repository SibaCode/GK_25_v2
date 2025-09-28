import React from "react";

const sampleSIMs = [
    { id: 1, number: "0831234567", carrier: "MTN", simType: "Prepaid" },
    { id: 2, number: "0827654321", carrier: "Vodacom", simType: "Postpaid" },
];

export default function LinkedSims() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Linked SIMs</h1>
            <ul className="space-y-2">
                {sampleSIMs.map((sim) => (
                    <li key={sim.id} className="p-4 bg-gray-100 rounded shadow">
                        <p><strong>Number:</strong> {sim.number}</p>
                        <p><strong>Carrier:</strong> {sim.carrier}</p>
                        <p><strong>SIM Type:</strong> {sim.simType}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
