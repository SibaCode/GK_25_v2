// CourseDetailsModal.js
import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import toast from "react-hot-toast";

export function CourseDetailsModal({ course, onStatusChange, trigger }) {
  // Hooks always at top level
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(course?.status || "Pending");

  // Safely handle undefined course
  if (!course) return null;

  const handleStatusUpdate = () => {
    if (onStatusChange) {
      onStatusChange(course.id, status);
      toast.success(`Course status updated to "${status}"`);
    }
    setOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Assigned": return "bg-warning text-warning-foreground";
      case "In Progress": return "bg-secondary text-secondary-foreground";
      case "Completed": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger || <Button>View Details</Button>}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6">
          <Dialog.Title className="text-xl font-bold mb-4">{course.title || "Course Details"}</Dialog.Title>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Assigned Distributor</p>
              <p className="font-medium text-foreground">{course.distributor || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="font-medium text-foreground">{course.description || "No description"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={getStatusColor(status)}>{status}</Badge>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-primary flex-1"
              >
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <Button onClick={handleStatusUpdate} className="bg-primary text-white flex-1">
                Update Status
              </Button>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={() => setOpen(false)} variant="outline">Close</Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CourseDetailsModal;
