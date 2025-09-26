// AddSaleModal.js
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as Dialog from "@radix-ui/react-dialog";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { addSale } from "../../services/salesService";

const saleSchema = z.object({
    product: z.string().min(1, "Please select a product"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    price: z.coerce.number().min(0.1, "Price must be at least 0.1"),
});

export function AddSaleModal({ trigger, onAddEntry, availableProducts = [] }) {
    const [open, setOpen] = useState(false);

    const form = useForm({
        resolver: zodResolver(saleSchema),
        defaultValues: {
            product: "",
            quantity: 1,
            price: 0,
        },
    });

    const watchQuantity = form.watch("quantity");
    const watchPrice = form.watch("price");
    const total = watchQuantity * watchPrice;

    const onSubmit = async (data) => {
        try {
            // Assign distributor (hardcoded or current user)
            const distributor = "SibaTheDev";
            const newSale = { ...data, distributor, total, status: "Pending" };
            await addSale(newSale);
            onAddEntry && onAddEntry(newSale);
            toast.success("Sale added successfully!");
            form.reset({ product: "", quantity: 1, price: 0 });
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to add sale");
        }
    };

    const defaultTrigger = (
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-lg text-white flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Sale
        </Button>
    );

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Toaster position="top-right" />
            <Dialog.Trigger asChild>{trigger || defaultTrigger}</Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6">
                    <Dialog.Title className="text-xl font-bold mb-4">Add New Sale</Dialog.Title>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Product Select */}
                        <div className="flex flex-col">
                            <label className="font-semibold text-gray-700 mb-1">Product</label>
                            <select
                                {...form.register("product")}
                                className="border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Select a product</option>
                                {availableProducts.map((p) => (
                                    <option key={p.id || p} value={p.name || p}>
                                        {p.name || p}
                                    </option>
                                ))}
                            </select>
                            {form.formState.errors.product && (
                                <span className="text-red-500 text-sm mt-1">{form.formState.errors.product.message}</span>
                            )}
                        </div>

                        {/* Quantity & Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="font-semibold text-gray-700 mb-1">Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    {...form.register("quantity")}
                                    className="border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                {form.formState.errors.quantity && (
                                    <span className="text-red-500 text-sm mt-1">{form.formState.errors.quantity.message}</span>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <label className="font-semibold text-gray-700 mb-1">Price (R)</label>
                                <input
                                    type="number"
                                    min="0.1"
                                    step="0.01"
                                    {...form.register("price")}
                                    className="border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                {form.formState.errors.price && (
                                    <span className="text-red-500 text-sm mt-1">{form.formState.errors.price.message}</span>
                                )}
                            </div>
                        </div>

                        {/* Total */}
                        <div className="p-3 bg-blue-100 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-700">Total</p>
                            <p className="text-2xl font-bold text-blue-800">R {total.toFixed(2)}</p>
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
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow hover:shadow-lg transition"
                            >
                                Add Sale
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export default AddSaleModal;
