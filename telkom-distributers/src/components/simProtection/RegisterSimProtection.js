// src/components/simProtection/RegisterSimProtection.js
import React, { useEffect, useState } from "react";
import { db } from "../../firebase"; // Make sure Firebase is initialized here
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { Button } from "../ui/button";
import toast, { Toaster } from "react-hot-toast";

export default function RegisterSimProtection({ user }) {
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
    const [linkedSims, setLinkedSims] = useState([]);
    const [loadingSims, setLoadingSims] = useState(true);

    // Fetch linked SIMs from Firebase
    useEffect(() => {
        const fetchSims = async () => {
            if (!user?.uid) return;
            setLoadingSims(true);
            try {
                const simsRef = collection(db, "linkedSims");
                const q = query(simsRef, where("userId", "==", user.uid));
                const snapshot = await getDocs(q);
                const sims = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setLinkedSims(sims);
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
        try {
            await addDoc(collection(db, "simProtections"), { ...form, userId: user.uid, createdAt: new Date() });
            toast.success("SIM Protection registered successfully!");
            setForm({
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
            setStep(1);
        } catch (err) {
            console.error(err);
            toast.error("Failed to register SIM protection");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Toaster position="top-right" />
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 text-center">SIM Protection Registration</h2>

                {/* Step 1: Personal Info */}
                <div className={`transition-all ${step === 1 ? "block" : "hidden"}`}>
                    <p className="text-gray-600 mb-4">Step 1: Enter your personal information</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                placeholder=" "
                                className="peer block w-full rounded-md border border-gray-300 p-3 placeholder-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                            <label className="absolute left-3 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-blue-500 peer-focus:text-sm">
                                Full Name
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                type="date"
                                name="dob"
                                value={form.dob}
                                onChange={handleChange}
                                placeholder=" "
                                className="peer block w-full rounded-md border border-gray-300 p-3 placeholder-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                            <label className="absolute left-3 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-blue-500 peer-focus:text-sm">
                                Date of Birth
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder=" "
                                className="peer block w-full rounded-md border border-gray-300 p-3 placeholder-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                            <label className="absolute left-3 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-blue-500 peer-focus:text-sm">
                                Email
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder=" "
                                className="peer block w-full rounded-md border border-gray-300 p-3 placeholder-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                            <label className="absolute left-3 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-blue-500 peer-focus:text-sm">
                                Phone Number
                            </label>
                        </div>
                        <div className="relative md:col-span-2">
                            <input
                                type="text"
                                name="idNumber"
                                value={form.idNumber}
                                onChange={handleChange}
                                placeholder=" "
                                className="peer block w-full rounded-md border border-gray-300 p-3 placeholder-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                            <label className="absolute left-3 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-blue-500 peer-focus:text-sm">
                                ID Number
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button className="bg-blue-500 text-white" onClick={() => setStep(2)}>Next</Button>
                    </div>
                </div>

                {/* Step 2: SIM Selection and Rules */}
                <div className={`transition-all ${step === 2 ? "block" : "hidden"}`}>
                    <p className="text-gray-600 mb-4">Step 2: Select your SIM and add rules</p>
                    {loadingSims ? (
                        <p>Loading linked SIMs...</p>
                    ) : (
                        <select
                            name="simId"
                            value={form.simId}
                            onChange={handleChange}
                            className="w-full rounded-md border border-gray-300 p-3 mb-4"
                        >
                            <option value="">Select SIM</option>
                            {linkedSims.map((sim) => (
                                <option key={sim.id} value={sim.id}>
                                    {sim.number} ({sim.carrier})
                                </option>
                            ))}
                        </select>
                    )}

                    <div className="mb-4">
                        <p className="font-semibold text-gray-700 mb-2">Freeze these bank accounts</p>
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
                        <p className="font-semibold text-gray-700 mb-2">Notify these insurers</p>
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

                    <div className="flex justify-between mt-4">
                        <Button className="bg-gray-300 text-black" onClick={() => setStep(1)}>Back</Button>
                        <Button className="bg-green-500 text-white" onClick={handleSubmit}>Submit</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
