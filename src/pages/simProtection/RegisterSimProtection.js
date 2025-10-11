import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { Button } from "../ui/button";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function RegisterSimProtection({ user }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        simId: "",
        freezeBanks: [],
        notifyInsurers: [],
        compliance: false,
    });
    const [linkedSims, setLinkedSims] = useState([]);
    const [loadingSims, setLoadingSims] = useState(true);

    // Fetch linked SIMs
    useEffect(() => {
        const fetchSims = async () => {
            if (!user?.uid) return;
            setLoadingSims(true);
            try {
                const simsRef = collection(db, "linkedSims");
                const q = query(simsRef, where("userId", "==", user.uid));
                const snapshot = await getDocs(q);
                const sims = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                if (sims.length === 0) {
                    setLinkedSims([
                        { id: "sim1", number: "0812345678", carrier: "Telkom" },
                        { id: "sim2", number: "0823456789", carrier: "Vodacom" },
                    ]);
                } else {
                    setLinkedSims(sims);
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch linked SIMs");
            } finally {
                setLoadingSims(false);
            }
        };
        fetchSims();
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleArrayChange = (e, field) => {
        const { value, checked } = e.target;
        setForm((prev) => {
            const arr = prev[field] || [];
            if (checked) return { ...prev, [field]: [...arr, value] };
            return { ...prev, [field]: arr.filter((v) => v !== value) };
        });
    };

    const handleSubmit = async () => {
        if (!form.compliance) {
            toast.error("Please confirm the compliance checkbox before submitting.");
            return;
        }

        try {
            // Remove new Date() or serverTimestamp
            const alertData = {
                userId: user.uid,
                simId: form.simId,
                simNumber: linkedSims.find((s) => s.id === form.simId)?.number || "",
                carrier: linkedSims.find((s) => s.id === form.simId)?.carrier || "",
                freezeBanks: form.freezeBanks,
                notifyInsurers: form.notifyInsurers,
                ref: Math.random().toString(36).substring(2, 10), // simple random ref
            };

            // Store alert in "simProtections"
            await addDoc(collection(db, "simProtections"), alertData);

            toast.success("SIM Protection registered!");
            navigate("/dashboard/home");
        } catch (err) {
            console.error(err);
            toast.error("Error registering SIM."); // Now should work
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Toaster position="top-right" />
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 text-center">Register SIM Protection</h2>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">Select Linked SIM</label>
                    <select
                        name="simId"
                        value={form.simId}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-3"
                    >
                        <option value="">Select SIM</option>
                        {linkedSims.map((sim) => (
                            <option key={sim.id} value={sim.id}>
                                {sim.number} ({sim.carrier})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <p className="font-semibold text-gray-700 mb-1">Freeze Bank Accounts</p>
                    {["Bank A", "Bank B", "Bank C"].map((bank) => (
                        <label key={bank} className="inline-flex items-center mr-4">
                            <input
                                type="checkbox"
                                value={bank}
                                checked={form.freezeBanks.includes(bank)}
                                onChange={(e) => handleArrayChange(e, "freezeBanks")}
                                className="mr-2"
                            />
                            {bank}
                        </label>
                    ))}
                </div>

                <div className="mb-4">
                    <p className="font-semibold text-gray-700 mb-1">Notify Insurers</p>
                    {["Insurer X", "Insurer Y"].map((ins) => (
                        <label key={ins} className="inline-flex items-center mr-4">
                            <input
                                type="checkbox"
                                value={ins}
                                checked={form.notifyInsurers.includes(ins)}
                                onChange={(e) => handleArrayChange(e, "notifyInsurers")}
                                className="mr-2"
                            />
                            {ins}
                        </label>
                    ))}
                </div>

                <div className="mb-4 p-3 border rounded bg-gray-50 text-gray-700">
                    <p><strong>Summary:</strong></p>
                    <p>Selected SIM: {linkedSims.find((s) => s.id === form.simId)?.number || "None"}</p>
                    <p>Banks to Freeze: {form.freezeBanks.join(", ") || "None"}</p>
                    <p>Insurers to Notify: {form.notifyInsurers.join(", ") || "None"}</p>
                </div>

                <div className="mb-4">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            name="compliance"
                            checked={form.compliance}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        I confirm I understand the compliance and regulations
                    </label>
                </div>

                <div className="flex justify-end mt-4">
                    <Button className="bg-green-500 text-white" onClick={handleSubmit}>Submit</Button>
                </div>
            </div>
        </div>
    );
}
