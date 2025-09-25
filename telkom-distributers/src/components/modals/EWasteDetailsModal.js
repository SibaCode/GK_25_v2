import React, { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";

export function EWasteDetailsModal({ log, onStatusChange, trigger }) {
  const [open, setOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(log.status);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);
    onStatusChange(log.id, newStatus);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Collected": return "bg-warning text-warning-foreground";
      case "Processing": return "bg-secondary text-secondary-foreground";
      case "Recycled": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-6 relative">
            <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
              E-Waste Details
              <Badge className={cn("text-xs", getStatusColor(currentStatus))}>
                {currentStatus}
              </Badge>
            </h2>

            <div className="mb-4 space-y-2">
              <p><strong>Customer:</strong> {log.customer}</p>
              <p><strong>Distributor:</strong> {log.distributor}</p>
              <p><strong>Timestamp:</strong> {log.timestamp}</p>
              <p><strong>Items:</strong> {log.items.join(", ")}</p>
              <p><strong>Weight:</strong> {log.weight} kg</p>
              <p><strong>Reward Points:</strong> {log.rewardPoints}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Update Status</label>
              <select
                className="w-full border rounded-md p-2"
                value={currentStatus}
                onChange={handleStatusChange}
              >
                <option value="Collected">Collected</option>
                <option value="Processing">Processing</option>
                <option value="Recycled">Recycled</option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
