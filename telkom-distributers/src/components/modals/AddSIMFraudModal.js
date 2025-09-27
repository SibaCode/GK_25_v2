import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

const detectFraud = (activity) => {
    if (activity.duplicateSIM || activity.spikes > 5) return { status: "High Risk", recommendation: "Block SIM" };
    if (activity.spikes > 2) return { status: "Medium Risk", recommendation: "Monitor / Review" };
    return { status: "Low Risk", recommendation: "No Action Needed" };
};

const AddSIMFraudModal = ({ onAdd }) => {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        customerName: "",
        simNumber: "",
        distributor: "",
        activity: { duplicateSIM: false, spikes: 0 },
    });

    const handleSubmit = async () => {
        const aiResult = detectFraud(form.activity);
        const report = {
            ...form,
            status: aiResult.status,
            recommendation: aiResult.recommendation,
            actionsTaken: [],
            date: new Date(),
        };
        await addDoc(collection(db, "fraudReports"), report);
        onAdd(report);
        setForm({
            customerName: "",
            simNumber: "",
            distributor: "",
            activity: { duplicateSIM: false, spikes: 0 },
        });
        setOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Report SIM Fraud
            </button>

            {open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Report SIM Fraud</h2>
                        <input
                            placeholder="Customer Name"
                            className="w-full border p-2 mb-2"
                            value={form.customerName}
                            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                        />
                        <input
                            placeholder="SIM Number"
                            className="w-full border p-2 mb-2"
                            value={form.simNumber}
                            onChange={(e) => setForm({ ...form, simNumber: e.target.value })}
                        />
                        <input
                            placeholder="Distributor"
                            className="w-full border p-2 mb-2"
                            value={form.distributor}
                            onChange={(e) => setForm({ ...form, distributor: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Unusual activity spikes"
                            className="w-full border p-2 mb-2"
                            value={form.activity.spikes}
                            onChange={(e) =>
                                setForm({ ...form, activity: { ...form.activity, spikes: parseInt(e.target.value) } })
                            }
                        />
                        <label className="flex items-center mb-2 gap-2">
                            <input
                                type="checkbox"
                                checked={form.activity.duplicateSIM}
                                onChange={(e) =>
                                    setForm({ ...form, activity: { ...form.activity, duplicateSIM: e.target.checked } })
                                }
                            />
                            Duplicate SIM Usage
                        </label>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddSIMFraudModal;
