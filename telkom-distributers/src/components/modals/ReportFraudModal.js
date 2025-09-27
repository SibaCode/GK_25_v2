import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";

export function ReportFraudModal({ simId, onReportFraud }) {
    const [open, setOpen] = useState(false);
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = (data) => {
        onReportFraud(simId, data.description);
        reset();
        setOpen(false);
        alert("Fraud reported successfully!");
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <Button className="bg-red-500 text-white px-3 py-1 rounded">Report Fraud</Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg">
                    <Dialog.Title className="text-xl font-bold mb-4">Report Fraud</Dialog.Title>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <textarea
                            {...register("description")}
                            placeholder="Describe the fraud..."
                            className="w-full border p-2 rounded"
                        />
                        <div className="flex justify-end gap-2">
                            <Button type="button" onClick={() => setOpen(false)} className="bg-gray-300 text-black">Cancel</Button>
                            <Button type="submit" className="bg-red-500 text-white">Submit</Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
