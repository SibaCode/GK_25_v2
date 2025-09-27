import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "../ui/button";
import { Shield, Brain } from "lucide-react";
import { db } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";

// Zod schema for validation
const fraudSchema = z.object({
    phoneNumber: z.string().min(10, "Enter a valid phone number"),
    customerName: z.string().min(1, "Customer name is required"),
    reportedIssue: z.string().optional(),
});

export function AddFraudModal({ trigger }) {
    const [open, setOpen] = useState(false);

    const form = useForm({
        resolver: zodResolver(fraudSchema),
        defaultValues: {
            phoneNumber: "",
            customerName: "",
            reportedIssue: "",
        },
    });

    const onSubmit = async (data) => {
        try {
            await addDoc(collection(db, "fraudReport"), {
                ...data,
                riskScore: Math.floor(Math.random() * 100),
                status: "pending",
                verificationStatus: "pending",
                anomalies: ["SIM anomaly detected"],
                aiRecommendation: "AI analysis pending",
                activityPattern: "Normal activity",
                createdAt: new Date(),
            });
            toast.success("Fraud report submitted successfully!");
            form.reset();
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit report");
        }
    };

    const defaultTrigger = (
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center gap-2">
            <Shield className="w-4 h-4" /> Add Fraud Report
        </Button>
    );

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Toaster position="top-right" />
            <Dialog.Trigger asChild>{trigger || defaultTrigger}</Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6">
                    <Dialog.Title className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5" /> Quick SIM Verification
                    </Dialog.Title>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Phone Number */}
                        <div className="flex flex-col">
                            <label className="font-semibold text-gray-700 mb-1">Phone Number *</label>
                            <input
                                {...form.register("phoneNumber")}
                                className="border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="e.g., 0271234567"
                            />
                            {form.formState.errors.phoneNumber && (
                                <span className="text-red-500 text-sm mt-1">{form.formState.errors.phoneNumber.message}</span>
                            )}
                        </div>

                        {/* Customer Name */}
                        <div className="flex flex-col">
                            <label className="font-semibold text-gray-700 mb-1">Customer Name *</label>
                            <input
                                {...form.register("customerName")}
                                className="border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Customer Name"
                            />
                            {form.formState.errors.customerName && (
                                <span className="text-red-500 text-sm mt-1">{form.formState.errors.customerName.message}</span>
                            )}
                        </div>

                        {/* Reported Issue */}
                        <div className="flex flex-col">
                            <label className="font-semibold text-gray-700 mb-1">Reported Issue</label>
                            <textarea
                                {...form.register("reportedIssue")}
                                className="border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Describe the reported issue"
                                rows={3}
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                type="button"
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow hover:shadow-lg transition flex items-center gap-2"
                            >
                                <Brain className="w-4 h-4" /> Run AI Fraud Analysis
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export default AddFraudModal;
