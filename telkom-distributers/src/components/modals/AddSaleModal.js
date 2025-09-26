// AddSaleModal.js
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
      <Dialog.Trigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-lg text-white flex items-center gap-2">
            Add Sale
          </Button>
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <Dialog.Title className="text-2xl font-bold mb-4 text-foreground">Add New Sale</Dialog.Title>

          <div className="flex flex-col space-y-4">
            <input
              name="product"
              placeholder="Product Name"
              value={formData.product}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <input
              name="distributor"
              placeholder="Distributor"
              value={formData.distributor}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                name="quantity"
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <input
                name="price"
                type="number"
                placeholder="Price (R)"
                value={formData.price}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-3">
            <Button
              onClick={() => setOpen(false)}
              className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow hover:shadow-lg transition"
            >
              Add Sale
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
