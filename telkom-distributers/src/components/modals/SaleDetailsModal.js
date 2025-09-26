// SaleDetailsModal.js
import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import toast, { Toaster } from "react-hot-toast";

export function SaleDetailsModal({ sale, onStatusChange, trigger }) {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState(sale.status);

    const handleStatusUpdate = () => {
        onStatusChange(sale.id, status);
        toast.success(`Status updated to ${status}`);
        setOpen(false);
    };

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Toaster position="top-right" />
            <Dialog.Trigger asChild>{trigger || <Button>View Details</Button>}</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
                <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <Dialog.Title className="text-2xl font-bold mb-4 text-foreground">
                        Sale Details
                    </Dialog.Title>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Product</p>
                            <p className="font-medium text-foreground">{sale.product}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Quantity</p>
                            <p className="font-medium text-foreground">{sale.quantity}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Price</p>
                            <p className="font-medium text-foreground">R {sale.price?.toFixed(2)}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="font-medium text-success">R {sale.total?.toFixed(2)}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">Date</p>
                            <p className="font-medium text-foreground">
                                {sale.date?.toDate
                                    ? sale.date.toDate().toLocaleString()
                                    : new Date(sale.date).toLocaleString()}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Status</p>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="border border-gray-300 p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none w-full"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            onClick={() => setOpen(false)}
                            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                        >
                            Close
                        </Button>
                        <Button
                            onClick={handleStatusUpdate}
                            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow hover:shadow-lg transition"
                        >
                            Update Status
                        </Button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
