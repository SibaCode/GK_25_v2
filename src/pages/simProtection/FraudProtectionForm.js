// src/components/simProtection/RegisterSimProtection.js
import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import toast, { Toaster } from "react-hot-toast";
export default function FraudProtectionForm() {
    const [form, setForm] = useState({
        fullName: "",
        dob: "",
        idNumber: "",
        email: "",
        phoneNumbers: "",
        carrier: "",
        simType: "",
        simDate: "",
        carrierPin: "",
        banks: "",
        insurers: "",
        paymentApps: "",
        otherAccounts: "",
        alertMethod: "",
        defaultAction: "",
        recovery: "",
        language: "",
        country: "",
        consent: false,
        emergencyContact: ""
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "simProtections"), {
                ...form,
                createdAt: serverTimestamp(),
            });
            toast.success("Registration successful!");
            setForm({
                fullName: "",
                dob: "",
                idNumber: "",
                email: "",
                phoneNumbers: "",
                carrier: "",
                simType: "",
                simDate: "",
                carrierPin: "",
                banks: "",
                insurers: "",
                paymentApps: "",
                otherAccounts: "",
                alertMethod: "",
                defaultAction: "",
                recovery: "",
                language: "",
                country: "",
                consent: false,
                emergencyContact: ""
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit registration");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Toaster position="top-right" />
            <Card className="w-full max-w-3xl shadow-xl rounded-2xl">
                <CardContent className="p-6 space-y-6">
                    <h2 className="text-2xl font-bold text-center text-gray-800">
                        SIM Protection Registration
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 1. Basic Personal Info */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">1. Basic Personal Info</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input placeholder="Full Name (as registered with carrier)" name="fullName" value={form.fullName} onChange={handleChange} required />
                                <Input type="date" name="dob" value={form.dob} onChange={handleChange} placeholder="Date of Birth" required />
                                <Input placeholder="National ID / Passport (optional)" name="idNumber" value={form.idNumber} onChange={handleChange} />
                                <Input type="email" placeholder="Email Address" name="email" value={form.email} onChange={handleChange} required />
                                <Input placeholder="Phone number(s) to protect" name="phoneNumbers" value={form.phoneNumbers} onChange={handleChange} required />
                            </div>
                        </div>

                        {/* 2. Mobile Carrier Info */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">2. Mobile Carrier Info</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input placeholder="Mobile Network Operator (MTN, Vodacom, etc.)" name="carrier" value={form.carrier} onChange={handleChange} required />
                                <Select name="simType" onValueChange={(val) => setForm({ ...form, simType: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="SIM Type (Prepaid/Postpaid)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="prepaid">Prepaid</SelectItem>
                                        <SelectItem value="postpaid">Postpaid</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input type="date" placeholder="SIM Registration Date (optional)" name="simDate" value={form.simDate} onChange={handleChange} />
                                <Input placeholder="Carrier Account PIN/Passphrase (if any)" name="carrierPin" value={form.carrierPin} onChange={handleChange} />
                            </div>
                        </div>

                        {/* 3. Linked Institutions / Accounts */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">3. Linked Institutions / Accounts</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input placeholder="Banks linked to your number" name="banks" value={form.banks} onChange={handleChange} />
                                <Input placeholder="Insurance providers linked" name="insurers" value={form.insurers} onChange={handleChange} />
                                <Input placeholder="Payment apps / e-wallets" name="paymentApps" value={form.paymentApps} onChange={handleChange} />
                                <Input placeholder="Other critical accounts" name="otherAccounts" value={form.otherAccounts} onChange={handleChange} />
                            </div>
                        </div>

                        {/* 4. Security Preferences */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">4. Security Preferences</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input placeholder="Alert delivery method (SMS, email, push)" name="alertMethod" value={form.alertMethod} onChange={handleChange} />
                                <Input placeholder="Default action (Freeze/Alert only)" name="defaultAction" value={form.defaultAction} onChange={handleChange} />
                                <Input placeholder="Recovery method (backup email/phone)" name="recovery" value={form.recovery} onChange={handleChange} />
                            </div>
                        </div>

                        {/* 5. Optional / Advanced Info */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">5. Optional / Advanced Info</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input placeholder="Preferred Language" name="language" value={form.language} onChange={handleChange} />
                                <Input placeholder="Country of Residence" name="country" value={form.country} onChange={handleChange} />
                                <Input placeholder="Emergency Contact (optional)" name="emergencyContact" value={form.emergencyContact} onChange={handleChange} />
                            </div>

                            <div className="flex items-start space-x-2 mt-3">
                                <Checkbox
                                    id="consent"
                                    name="consent"
                                    checked={form.consent}
                                    onCheckedChange={(checked) => setForm({ ...form, consent: checked })}
                                    required
                                />
                                <label htmlFor="consent" className="text-sm text-gray-600">
                                    I consent to sharing alerts with linked institutions as required by law.
                                </label>
                            </div>
                        </div>

                        <Button type="submit" className="w-full">
                            Register
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
