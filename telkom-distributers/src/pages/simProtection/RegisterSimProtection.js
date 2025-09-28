import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import { addSimProtection } from "../../services/simProtectionService";

const schema = z.object({
    fullName: z.string().min(1, "Full Name is required"),
    dob: z.string().min(1, "Date of Birth is required"),
    nationalId: z.string().optional(),
    email: z.string().email("Invalid email"),
    phoneNumbers: z.string().min(1, "Phone number required"),
    carrier: z.string().min(1, "Mobile operator required"),
    simType: z.string().min(1, "SIM type required"),
    consent: z.boolean().refine((v) => v, "Consent is required"),
});

export default function RegisterSimProtection({ onSuccess }) {
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            fullName: "",
            dob: "",
            nationalId: "",
            email: "",
            phoneNumbers: "",
            carrier: "",
            simType: "",
            consent: false,
        },
    });

    const onSubmit = async (data) => {
        try {
            await addSimProtection(data);
            toast.success("Registration complete!");
            form.reset();
            onSuccess();
        } catch (error) {
            toast.error("Failed to register");
        }
    };

    return (
        <div className="bg-white text-black rounded-xl shadow p-6 max-w-2xl w-full">
            <Toaster position="top-right" />
            <h2 className="text-2xl font-bold mb-4">SIM Protection Registration</h2>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <input {...form.register("fullName")} placeholder="Full Name" className="input w-full" />
                <input type="date" {...form.register("dob")} className="input w-full" />
                <input {...form.register("nationalId")} placeholder="National ID (optional)" className="input w-full" />
                <input type="email" {...form.register("email")} placeholder="Email" className="input w-full" />
                <input {...form.register("phoneNumbers")} placeholder="Phone Number(s)" className="input w-full" />
                <input {...form.register("carrier")} placeholder="Mobile Operator" className="input w-full" />
                <select {...form.register("simType")} className="input w-full">
                    <option value="">Select SIM Type</option>
                    <option value="prepaid">Prepaid</option>
                    <option value="postpaid">Postpaid</option>
                </select>

                <label className="flex items-center gap-2">
                    <input type="checkbox" {...form.register("consent")} /> I consent to share alerts with my institutions
                </label>

                <div className="flex justify-end">
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
