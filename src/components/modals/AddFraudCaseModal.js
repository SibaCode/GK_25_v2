import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as Dialog from "@radix-ui/react-dialog";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { addFraudCase } from "../../services/fraudService";

const fraudCaseSchema = z.object({
  customerName: z.string().min(2, "Customer name must be at least 2 characters"),
  simNumber: z.string().min(10, "SIM number must be at least 10 digits"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.string().min(1, "Please select a priority"),
});

export function AddFraudCaseModal({ trigger }) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(fraudCaseSchema),
    defaultValues: {
      customerName: "",
      simNumber: "",
      category: "",
      description: "",
      priority: "Medium",
    },
  });

  const onSubmit = async (data) => {
    try {
      await addFraudCase(data);
      toast.success("Fraud case added successfully!");
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to add fraud case.");
      console.error(error);
    }
  };

  const defaultTrigger = (
    <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-lg transition-all text-white">
      <Plus className="w-4 h-4 mr-2" />
      Add New Case
    </Button>
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Toaster position="top-right" />
      <Dialog.Trigger asChild>{trigger || defaultTrigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6">
          <Dialog.Title className="text-xl font-bold mb-4">Add New Fraud Case</Dialog.Title>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer Name & SIM Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-1">Customer Name</label>
                <input
                  {...form.register("customerName")}
                  placeholder="Enter customer name"
                  className="border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {form.formState.errors.customerName && (
                  <span className="text-red-500 text-sm mt-1">{form.formState.errors.customerName.message}</span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-1">SIM Number</label>
                <input
                  {...form.register("simNumber")}
                  placeholder="Enter SIM number"
                  className="border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {form.formState.errors.simNumber && (
                  <span className="text-red-500 text-sm mt-1">{form.formState.errors.simNumber.message}</span>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">Fraud Category</label>
              <select
                {...form.register("category")}
                className="border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                <option value="identity-theft">Identity Theft</option>
                <option value="sim-cloning">SIM Cloning</option>
                <option value="account-takeover">Account Takeover</option>
                <option value="billing-fraud">Billing Fraud</option>
                <option value="unauthorized-usage">Unauthorized Usage</option>
                <option value="other">Other</option>
              </select>
              {form.formState.errors.category && (
                <span className="text-red-500 text-sm mt-1">{form.formState.errors.category.message}</span>
              )}
            </div>

            {/* Priority */}
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">Priority</label>
              <select
                {...form.register("priority")}
                className="border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              {form.formState.errors.priority && (
                <span className="text-red-500 text-sm mt-1">{form.formState.errors.priority.message}</span>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                {...form.register("description")}
                placeholder="Provide detailed description..."
                className="border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
              />
              {form.formState.errors.description && (
                <span className="text-red-500 text-sm mt-1">{form.formState.errors.description.message}</span>
              )}
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
                Add Case
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AddFraudCaseModal;
