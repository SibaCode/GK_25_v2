import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";

export function AddLearningModuleModal({ trigger }) {
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      title: "",
      distributor: "",
      notes: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, "learningModules"), {
        ...data,
        assignedAt: serverTimestamp(),
        status: "Pending",
      });
      toast.success("Module assigned successfully!");
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to assign module");
    }
  };

  const defaultTrigger = (
    <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-lg text-white flex items-center gap-2">
      <Plus className="w-4 h-4" /> Add Module
    </Button>
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Toaster position="top-right" />
      <Dialog.Trigger asChild>{trigger || defaultTrigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6">
          <Dialog.Title className="text-xl font-bold mb-4">Add Learning Module</Dialog.Title>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">Module Title</label>
              <input
                {...form.register("title", { required: true })}
                placeholder="Enter module title"
                className="border-gray-300 rounded-lg p-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">Distributor</label>
              <input
                {...form.register("distributor", { required: true })}
                placeholder="Distributor name"
                className="border-gray-300 rounded-lg p-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">Notes</label>
              <textarea
                {...form.register("notes")}
                placeholder="Optional notes"
                className="border-gray-300 rounded-lg p-2 min-h-[80px]"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg"
              >
                Assign Module
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AddLearningModuleModal;
