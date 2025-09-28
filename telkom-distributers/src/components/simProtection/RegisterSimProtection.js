// src/components/simProtection/RegisterSimProtection.js
import React, { useState } from "react";
import { Button } from "../ui/button";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, updateDoc, arrayUnion, serverTimestamp ,setDoc} from "firebase/firestore";
import { db } from "../../firebase";

export default function RegisterSimProtection() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: "",
        dob: "",
        email: "",
        phone: "",
        idNumber: "",
        simId: "",
        freezeBanks: [],
        notifyInsurers: [],
        compliance: false,
    });
    const [step, setStep] = useState(1);

    // Mock data
    const linkedSims = [
        { id: "sim1", number: "0812345678", carrier: "Telkom" },
        { id: "sim2", number: "0823456789", carrier: "Vodacom" },
    ];
    const banks = ["Capitec", "FNB", "Standard Bank"];
    const insurers = ["Naked Insurance X", "1st for Women", "OutSurance Z"];

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

    const generateRef = () => "REF-" + Math.floor(Math.random() * 1000000);
    const handleSubmit = async () => {
        if (!form.compliance) {
            toast.error("Please confirm your consent before submitting.");
            return;
        }

        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) {
                toast.error("You must be logged in to register a SIM.");
                return;
            }

            const userRef = doc(db, "users", user.uid);
            const simData = linkedSims.find((s) => s.id === form.simId);

            // New SIM object
            const newSim = {
                simId: form.simId,
                simNumber: simData?.number || "",
                carrier: simData?.carrier || "",
                freezeBanks: form.freezeBanks,
                notifyInsurers: form.notifyInsurers,
                registeredAt: new Date(),
            };

            // New alert object
            const newAlert = {
                ref: generateRef(),
                simNumber: simData?.number || "",
                carrier: simData?.carrier || "",
                freezeBanks: form.freezeBanks,
                notifyInsurers: form.notifyInsurers,
                status: "new",
                createdAt: new Date(),
            };

            // Save both SIM and Alert, creating the document if it doesn't exist
            await setDoc(userRef, {
                linkedSims: arrayUnion(newSim),
                alerts: arrayUnion(newAlert),
            }, { merge: true }); // ? merge keeps existing data

            toast.success("SIM registered & alert created!");
            navigate("/dashboard/alerts");
        } catch (err) {
            console.error(err);
            toast.error("Error registering SIM.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Toaster position="top-right" />
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 text-center">
                    SIM Protection Registration
                </h2>

                {/* Step 1: Personal Info */}
                <div className={`rounded-md border ${step >= 1 ? "border-blue-400" : "border-gray-300"} p-4`}>
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => setStep(1)}>
                        <h3 className="font-semibold text-gray-700">Step 1: Personal Information</h3>
                        <span>{step > 1 ? "?" : ""}</span>
                    </div>
                    {step === 1 && (
                        <div className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[{ label: "Full Name", name: "fullName", type: "text" },
                                { label: "Date of Birth", name: "dob", type: "date" },
                                { label: "Email", name: "email", type: "email" },
                                { label: "Phone Number", name: "phone", type: "tel" },
                                { label: "ID Number", name: "idNumber", type: "text", colSpan: 2 }
                                ].map((field) => (
                                    <div key={field.name} className={field.colSpan ? "md:col-span-2" : ""}>
                                        <label className="block text-gray-700 font-medium mb-1">{field.label}</label>
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={form[field.name]}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end mt-4">
                                <Button className="bg-blue-500 text-white" onClick={() => setStep(2)}>Next</Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Step 2: SIM & Rules */}
                <div className={`rounded-md border ${step >= 2 ? "border-blue-400" : "border-gray-300"} p-4`}>
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => setStep(2)}>
                        <h3 className="font-semibold text-gray-700">Step 2: Select SIM & Add Rules</h3>
                        <span>{step > 2 ? "?" : ""}</span>
                    </div>
                    {step === 2 && (
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Linked SIMs</label>
                                <select
                                    name="simId"
                                    value={form.simId}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md p-3"
                                    required
                                >
                                    <option value="">Select SIM</option>
                                    {linkedSims.map((sim) => (
                                        <option key={sim.id} value={sim.id}>
                                            {sim.number} ({sim.carrier})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-700 mb-1">Freeze Bank Accounts</p>
                                {banks.map((bank) => (
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

                            <div>
                                <p className="font-semibold text-gray-700 mb-1">Notify Insurers</p>
                                {insurers.map((ins) => (
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

                            <div className="flex justify-between mt-4">
                                <Button className="bg-gray-300 text-black" onClick={() => setStep(1)}>Back</Button>
                                <Button className="bg-green-500 text-white" onClick={() => setStep(3)}>Next</Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Step 3: Summary & Consent */}
                <div className={`rounded-md border ${step >= 3 ? "border-blue-400" : "border-gray-300"} p-4`}>
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => setStep(3)}>
                        <h3 className="font-semibold text-gray-700">Step 3: Summary & Consent</h3>
                    </div>
                    {step === 3 && (
                        <div className="mt-4 space-y-4">
                            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                                <p><strong>SIM:</strong> {linkedSims.find(s => s.id === form.simId)?.number || "None"}</p>
                                <p><strong>Carrier:</strong> {linkedSims.find(s => s.id === form.simId)?.carrier || "None"}</p>
                                <p><strong>Banks to Freeze:</strong> {form.freezeBanks.join(", ") || "None"}</p>
                                <p><strong>Insurers to Notify:</strong> {form.notifyInsurers.join(", ") || "None"}</p>
                                <label className="inline-flex items-center mt-2">
                                    <input
                                        type="checkbox"
                                        name="compliance"
                                        checked={form.compliance}
                                        onChange={handleChange}
                                        className="mr-2"
                                        required
                                    />
                                    I confirm I understand the compliance and regulations
                                </label>
                            </div>
                            <div className="flex justify-between">
                                <Button className="bg-gray-300 text-black" onClick={() => setStep(2)}>Back</Button>
                                <Button className="bg-green-500 text-white" onClick={handleSubmit}>Submit</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
