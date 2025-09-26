import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

import { db } from "../../firebase"; // make sure your firebase is set up
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Zod validation schema
const surveySchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(5, "Description is required"),
  category: z.string().min(1, "Select a category"),
  targetAudience: z.string().min(1, "Select target audience"),
});

export function AddSurveyModal({ trigger, onSurveyAdded }) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      targetAudience: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // Add survey to Firestore
      const docRef = await addDoc(collection(db, "surveys"), {
        ...data,
        status: "active",           // default status
        createdAt: serverTimestamp(), 
      });

      toast.success(`Survey "${data.title}" added!`);

      // Reset form and close modal
      form.reset();
      setOpen(false);

      // Optional callback to refresh list in parent
      onSurveyAdded && onSurveyAdded({ id: docRef.id, ...data, status: "active" });
    } catch (error) {
      console.error("Error adding survey:", error);
      toast.error("Failed to add survey. Try again.");
    }
  };

  const defaultTrigger = (
    <Button className="bg-primary text-white flex items-center gap-2">
      <Plus className="w-4 h-4" /> Add Survey
    </Button>
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Toaster position="top-right" />
      <Dialog.Trigger asChild>{trigger || defaultTrigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6">
          <Dialog.Title className="text-xl font-bold mb-4">Create New Survey</Dialog.Title>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">Title</label>
              <input
                {...form.register("title")}
                placeholder="Survey Title"
                className="border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-primary"
              />
              {form.formState.errors.title && (
                <span className="text-red-500 text-sm">{form.formState.errors.title.message}</span>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                {...form.register("description")}
                placeholder="Brief description..."
                className="border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-primary min-h-[80px]"
              />
              {form.formState.errors.description && (
                <span className="text-red-500 text-sm">{form.formState.errors.description.message}</span>
              )}
            </div>

            {/* Category & Target Audience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-1">Category</label>
                <select
                  {...form.register("category")}
                  className="border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select category</option>
                  <option value="service_quality">Service Quality</option>
                  <option value="training">Training & Education</option>
                  <option value="environment">Environment</option>
                  <option value="products">Product Feedback</option>
                  <option value="community">Community Engagement</option>
                </select>
                {form.formState.errors.category && (
                  <span className="text-red-500 text-sm">{form.formState.errors.category.message}</span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-1">Target Audience</label>
                <select
                  {...form.register("targetAudience")}
                  className="border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select audience</option>
                  <option value="all_customers">All Customers</option>
                  <option value="business_customers">Business Customers</option>
                  <option value="residential">Residential Users</option>
                  <option value="students">Students</option>
                  <option value="distributors">Distributors</option>
                </select>
                {form.formState.errors.targetAudience && (
                  <span className="text-red-500 text-sm">{form.formState.errors.targetAudience.message}</span>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Create Survey</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AddSurveyModal;
