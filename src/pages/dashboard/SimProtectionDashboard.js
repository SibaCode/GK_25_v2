// src/components/simProtection/SimProtectionDashboard.js
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { db } from "../../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export default function SimProtectionDashboard() {
    const [registrations, setRegistrations] = useState([]);

    useEffect(() => {
        const q = query(collection(db, "simProtections"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRegistrations(data);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">SIM Protection Dashboard</h1>

            <Card className="overflow-auto">
                <CardHeader>
                    <CardTitle>All Registered SIM Protections</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full table-auto border-collapse text-left">
                        <thead>
                            <tr className="border-b bg-gray-200">
                                <th className="px-4 py-2">Full Name</th>
                                <th className="px-4 py-2">Phone Number(s)</th>
                                <th className="px-4 py-2">Carrier</th>
                                <th className="px-4 py-2">SIM Type</th>
                                <th className="px-4 py-2">Banks</th>
                                <th className="px-4 py-2">Insurers</th>
                                <th className="px-4 py-2">Alert Method</th>
                                <th className="px-4 py-2">Registered At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map((reg) => (
                                <tr key={reg.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">{reg.fullName}</td>
                                    <td className="px-4 py-2">{reg.phoneNumbers}</td>
                                    <td className="px-4 py-2">{reg.carrier}</td>
                                    <td className="px-4 py-2">{reg.simType}</td>
                                    <td className="px-4 py-2">{reg.banks}</td>
                                    <td className="px-4 py-2">{reg.insurers}</td>
                                    <td className="px-4 py-2">{reg.alertMethod}</td>
                                    <td className="px-4 py-2">{reg.createdAt?.toDate ? reg.createdAt.toDate().toLocaleString() : "-"}</td>
                                </tr>
                            ))}
                            {registrations.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="text-center py-4 text-gray-500">No registrations yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
