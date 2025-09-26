import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "../ui/button";
import { addSale } from "../../services/salesService";

export function AddSaleModal({ onAddEntry, trigger }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    product: "",
    distributor: "",
    quantity: 0,
    price: 0,
    status: "Pending",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const newSale = await addSale(formData);
      onAddEntry && onAddEntry(newSale);
      toast.success("Sale added successfully!");
      setFormData({ product: "", distributor: "", quantity: 0, price: 0, status: "Pending" });
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add sale");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Toaster position="top-right" />
      <Dialog.Trigger asChild>{trigger || <Button>Add Sale</Button>}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6">
          <Dialog.Title className="text-xl font-bold mb-4">Add Sale</Dialog.Title>

          <div className="flex flex-col space-y-3">
            <input
              name="product"
              placeholder="Product"
              value={formData.product}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="distributor"
              placeholder="Distributor"
              value={formData.distributor}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="quantity"
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              name="price"
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <div className="flex justify-end mt-4 gap-2">
            <Button onClick={() => setOpen(false)} className="border">Cancel</Button>
            <Button onClick={handleSubmit} className="bg-blue-500 text-white">Add Sale</Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
