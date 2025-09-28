// src/components/dashboard/LinkedSims.js
import React, { useEffect, useState } from "react";
import { getSimProtections } from "../../services/simProtectionService";

export default function LinkedSims() {
    const [sims, setSims] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getSimProtections();
            setSims(data);
        };
        fetchData();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Linked SIMs</h2>
            {sims.length === 0 ? (
                <p>No SIMs registered yet.</p>
            ) : (
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Full Name</th>
                            <th className="border px-4 py-2">Phone Number</th>
                            <th className="border px-4 py-2">Carrier</th>
                            <th className="border px-4 py-2">SIM Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sims.map(sim => (
                            <tr key={sim.id} className="hover:bg-gray-100">
                                <td className="border px-4 py-2">{sim.fullName}</td>
                                <td className="border px-4 py-2">{sim.phoneNumbers}</td>
                                <td className="border px-4 py-2">{sim.carrier}</td>
                                <td className="border px-4 py-2">{sim.simType}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
