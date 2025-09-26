import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "../ui/button";
import { Trash2, Edit2 } from "lucide-react";
import { updateSale, deleteSale } from "../../services/salesService";

export function SaleDetailsModal({ sale, onStatusChange, trigger }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(sale.status || "Pending");

  const handleUpdateStatus = async () => {
    try {
      await updateSale(sale.id, { status });
      onStatusChange && onStatusChange(sale.id, status);
      toast.success("Sale status updated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;
    try {
      await deleteSale(sale.id);
      toast.success("Sale deleted!");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete sale");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Toaster position="top-right" />
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6">
          <Dialog.Title className="text-xl font-bold mb-4">Sale Details</Dialog.Title>

          <div className="space-y-3">
            <p><strong>Product:</strong> {sale.product}</p>
            <p><strong>Distributor:</strong> {sale.distributor}</p>
            <p><strong>Quantity:</strong> {sale.quantity}</p>
            <p><strong>Price:</strong> R {sale.price?.toFixed(2)}</p>
            <p><strong>Total:</strong> R {sale.total?.toFixed(2)}</p>
            <p><strong>Date:</strong> {sale.date?.toDate ? sale.date.toDate().toLocaleString() : new Date(sale.date).toLocaleString()}</p>

            <div className="flex flex-col mt-2">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="border p-2 rounded mt-1">
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <Button onClick={handleUpdateStatus} className="mt-2 bg-blue-500 text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4" /> Update Status
              </Button>
            </div>

            <Button onClick={handleDelete} className="mt-4 bg-red-500 text-white flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Delete Sale
            </Button>
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={() => setOpen(false)} className="border">Close</Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default SaleDetailsModal;
