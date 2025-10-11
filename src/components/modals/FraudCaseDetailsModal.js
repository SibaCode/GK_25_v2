import React, { useState } from "react";
import { Button } from "../ui/button";

export const FraudCaseDetailsModal = ({ fraudCase, trigger }) => {
  const [open, setOpen] = useState(false);

  if (!fraudCase) return null;

  return (
    <>
      {/* Trigger Button */}
      <div onClick={() => setOpen(true)}>
        {trigger || (
          <Button variant="outline" size="sm">
            View Details
          </Button>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4">Fraud Case Details</h2>

            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Case Number:</span> {fraudCase.caseNumber}</p>
              <p><span className="font-medium">Customer:</span> {fraudCase.customerName}</p>
              <p><span className="font-medium">SIM Number:</span> {fraudCase.simNumber}</p>
              <p><span className="font-medium">Category:</span> {fraudCase.category}</p>
              <p><span className="font-medium">Status:</span> {fraudCase.status}</p>
              <p><span className="font-medium">Description:</span> {fraudCase.description}</p>
              <p className="text-gray-500">
                <span className="font-medium">Created At:</span> {fraudCase.timestamp}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
