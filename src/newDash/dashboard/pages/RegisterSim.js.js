import React, { useState } from "react";
import { Button } from "../ui/button";

export default function RegisterSim() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        fullName: "Mvubu Siba",
        email: "mvubusiba@gmail.com",
        altEmail: "demo@example.com",
        phone: "0812345678",
        altPhone: "0823456789",
        simNumber: "0812345678",
        carrier: "Telkom",
        freezeBanks: ["Capitec"],
        notifyInsurers: ["Naked Insurance X"],
        compliance: true,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    return (
        <div className="p-4 min-h-screen bg-[#EFF6FF] flex justify-center">
            <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-3xl space-y-4">
                <h2 className="text-2xl font-bold text-[#1F2937] text-center">SIM Registration</h2>

                {step === 1 && (
                    <div>
                        <label className="block mb-1">Full Name</label>
                        <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="w-full border rounded-md p-2 mb-2" />
                        <label className="block mb-1">Email</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border rounded-md p-2 mb-2" />
                        <label className="block mb-1">Phone</label>
                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded-md p-2 mb-2" />
                        <Button className="bg-[#3B82F6] text-white mt-2" onClick={() => setStep(2)}>Next</Button>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <label className="block mb-1">Alternative Email</label>
                        <input type="email" name="altEmail" value={form.altEmail} onChange={handleChange} className="w-full border rounded-md p-2 mb-2" />
                        <label className="block mb-1">Alternative Phone</label>
                        <input type="tel" name="altPhone" value={form.altPhone} onChange={handleChange} className="w-full border rounded-md p-2 mb-2" />
                        <label className="block mb-1">SIM Number</label>
                        <input type="text" name="simNumber" value={form.simNumber} onChange={handleChange} className="w-full border rounded-md p-2 mb-2" />
                        <label className="block mb-1">Carrier</label>
                        <input type="text" name="carrier" value={form.carrier} onChange={handleChange} className="w-full border rounded-md p-2 mb-2" />
                        <label className="flex items-center space-x-2 mt-2">
                            <input type="checkbox" name="compliance" checked={form.compliance} onChange={handleChange} />
                            <span>Agree to Safety & Compliance rules</span>
                        </label>
                        <Button className="bg-[#10B981] text-white mt-2">Submit</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
