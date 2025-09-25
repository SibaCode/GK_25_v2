// AddEWasteModal.js
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as Dialog from "@radix-ui/react-dialog";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

const eWasteSchema = z.object({
  customer: z.string().min(2, "Customer name must be at least 2 characters"),
  items: z.string().min(1, "Please list the items collected"),
  weight: z.coerce.number().min(0.1, "Weight must be at least 0.1 kg"),
  distributor: z.string().min(1, "Please select a distributor"),
  notes: z.string().optional(),
});

export function AddEWasteModal({ trigger, onAddEntry, currentDistributor }) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(eWasteSchema),
    defaultValues: {
      customer: "",
      items: "",
      weight: 0,
      distributor: currentDistributor || "SibaTheDev", // set default to current distributor
      notes: "",
    },
  });

  const watchWeight = form.watch("weight");
  const rewardPoints = Math.round(watchWeight * 100);

  const onSubmit = (data) => {
    const entry = { ...data, rewardPoints };
    onAddEntry && onAddEntry(entry);
    toast.success(`E-Waste entry added! Reward: ${rewardPoints} pts`);
    form.reset({ ...form.getValues(), distributor: currentDistributor || "" }); // keep default distributor
    setOpen(false);
  };

  const defaultTrigger = (
    <Button className="bg-gradient-to-r from-green-500 to-lime-500 hover:shadow-lg transition-all text-white flex items-center gap-2">
      <Plus className="w-4 h-4" /> Add E-Waste Entry
    </Button>
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Toaster position="top-right" />
      <Dialog.Trigger asChild>{trigger || defaultTrigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6">
          <Dialog.Title className="text-xl font-bold mb-4">Add E-Waste Entry</Dialog.Title>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer & Distributor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-1">Customer Name</label>
                <input
                  {...form.register("customer")}
                  placeholder="Enter customer name"
                  className="border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                {form.formState.errors.customer && (
                  <span className="text-red-500 text-sm mt-1">{form.formState.errors.customer.message}</span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-1">Distributor</label>
                <select
                  {...form.register("distributor")}
                  className="border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="">Select distributor</option>
                  <option value="metro-store-a">Metro Store A</option>
                  <option value="downtown-branch">Downtown Branch</option>
                  <option value="north-plaza">North Plaza</option>
                  <option value="south-center">South Center</option>
                  <option value="east-mall">East Mall</option>
                </select>
                {form.formState.errors.distributor && (
                  <span className="text-red-500 text-sm mt-1">{form.formState.errors.distributor.message}</span>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">Items Collected</label>
              <textarea
                {...form.register("items")}
                placeholder="List items collected (e.g., smartphone, charger, cables)"
                className="border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-1 focus:ring-green-500 min-h-[100px]"
              />
              {form.formState.errors.items && (
                <span className="text-red-500 text-sm mt-1">{form.formState.errors.items.message}</span>
              )}
            </div>

            {/* Weight & Reward */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  {...form.register("weight")}
                  placeholder="0.0"
                  className="border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                {form.formState.errors.weight && (
                  <span className="text-red-500 text-sm mt-1">{form.formState.errors.weight.message}</span>
                )}
              </div>
              <div className="flex items-end">
                <div className="w-full p-3 bg-green-100 rounded-lg border">
                  <p className="text-sm text-green-700">Reward Points</p>
                  <p className="text-2xl font-bold text-green-800">{rewardPoints} pts</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">Notes (Optional)</label>
              <textarea
                {...form.register("notes")}
                placeholder="Any additional notes"
                className="border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-1 focus:ring-green-500 min-h-[80px]"
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
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-lg shadow hover:shadow-lg transition"
              >
                Add Entry
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AddEWasteModal;
