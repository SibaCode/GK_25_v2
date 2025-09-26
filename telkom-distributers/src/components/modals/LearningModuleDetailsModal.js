import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../ui/button";

export function LearningModuleDetailsModal({ module, onStatusChange, trigger }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(module.status);

  const handleStatusUpdate = () => {
    onStatusChange(module.id, status);
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6">
          <Dialog.Title className="text-xl font-bold mb-4">{module.title}</Dialog.Title>
          <p className="text-sm text-muted-foreground mb-2">Distributor: {module.distributor}</p>
          <p className="text-sm text-muted-foreground mb-2">Notes: {module.notes || "N/A"}</p>
          <div className="flex flex-col mb-4">
            <label className="font-semibold text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border-gray-300 rounded-lg p-2"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
            <Button onClick={handleStatusUpdate} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              Update Status
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default LearningModuleDetailsModal;
