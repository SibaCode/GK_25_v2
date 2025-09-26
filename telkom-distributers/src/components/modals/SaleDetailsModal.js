// SaleDetailsModal.js
import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { updateSale, deleteSale } from "../../services/salesService";
import toast from "react-hot-toast";

export function SaleDetailsModal({ sale, trigger, onStatusChange }) {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState(sale.status);

    const handleUpdateStatus = async () => {
        try {
            await updateSale(sale.id, { status });
            onStatusChange && onStatusChange(sale.id, status);
            toast.success("Status updated!");
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteSale(sale.id);
            toast.success("Sale deleted!");
            setOpen(false);
        } catch (error) {
            toast.error("Failed to delete sale");
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
                <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <Dialog.Title className="text-xl font-bold mb-4 text-foreground">Sale Details</Dialog.Title>

                    <div className="space-y-3">
                        <p><strong>Product:</strong> {sale.product}</p>
                        {/*<p><strong>Distributor:</strong> {sale.distributor}</p>*/}
                        <p><strong>Quantity:</strong> {sale.quantity}</p>
                        <p><strong>Price:</strong> R {sale.price.toFixed(2)}</p>
                        <p><strong>Total:</strong> R {sale.total.toFixed(2)}</p>
                        <p><strong>Date:</strong> {sale.date?.toDate ? sale.date.toDate().toLocaleString() : new Date(sale.date).toLocaleString()}</p>

                        <div className="flex items-center gap-2">
                            <label>Status:</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="border rounded px-2 py-1"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            <Button onClick={handleUpdateStatus} className="px-3 py-1 text-sm">Update</Button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button onClick={() => setOpen(false)} className="px-4 py-2 border rounded-lg">Close</Button>
                        <Button onClick={handleDelete} className="px-4 py-2 bg-destructive text-white rounded-lg">Delete</Button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
