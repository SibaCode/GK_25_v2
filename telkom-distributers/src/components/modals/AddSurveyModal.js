import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as Dialog from "@radix-ui/react-dialog";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const surveySchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  category: z.string().min(1, "Please select a category"),
  targetAudience: z.string().min(1, "Please select a target audience"),
});

export function AddSurveyModal({ trigger }) {
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
      await addDoc(collection(db, "surveys"), {
        ...data,
        responses: 0,
        status: "draft",
        createdAt: serverTimestamp(),
      });
      toast.success(`Survey "${data.title}" added successfully!`);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error adding survey:", error);
      toast.error("Failed to add survey.");
    }
  };

  const defaultTrigger = (
    <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-lg transition-all text-white flex items-center gap-2">
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
          <Dialog.Title className="text-xl font-bold mb-4">Add Survey</Dialog.Title>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">Survey Title</label>
              <input
                {...form.register("title")}
                placeholder="Customer Satisfaction Survey"
                className="border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {form.formState.errors.title && (
                <span className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                {...form.register("description")}
                placeholder="Describe the purpose of the survey..."
                className="border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
              />
              {form.formState.errors.description && (
                <span className="text-red-500 text-sm mt-1">{form.formState.errors.description.message}</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-1">Category</label>
                <select
                  {...form.register("category")}
                  className="border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  <option value="service_quality">Service Quality</option>
                  <option value="training">Training & Education</option>
                  <option value="environment">Environmental</option>
                  <option value="products">Product Feedback</option>
                  <option value="community">Community Engagement</option>
                </select>
                {form.formState.errors.category && (
                  <span className="text-red-500 text-sm mt-1">{form.formState.errors.category.message}</span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-1">Target Audience</label>
                <select
                  {...form.register("targetAudience")}
                  className="border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select audience</option>
                  <option value="all_customers">All Customers</option>
                  <option value="business_customers">Business Customers</option>
                  <option value="residential">Residential Users</option>
                  <option value="students">Students</option>
                  <option value="distributors">Distributors</option>
                </select>
                {form.formState.errors.targetAudience && (
                  <span className="text-red-500 text-sm mt-1">{form.formState.errors.targetAudience.message}</span>
                )}
              </div>
            </div>

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
                Add Survey
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AddSurveyModal;
