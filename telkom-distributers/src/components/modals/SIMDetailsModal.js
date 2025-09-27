import React from "react";
import { Button } from "../ui/button";

const SIMDetailsModal = ({ isOpen, onClose, fraudCase }) => {
    if (!isOpen || !fraudCase) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full z-50 relative">
                <h2 className="text-xl font-bold mb-4">SIM Case Details</h2>

                <div className="space-y-2">
                    <p><strong>SIM Number:</strong> {fraudCase.simNumber}</p>
                    <p><strong>Customer Name:</strong> {fraudCase.customerName}</p>
                    <p><strong>Category:</strong> {fraudCase.category}</p>
                    <p><strong>Priority:</strong> {fraudCase.priority}</p>
                    <p><strong>Risk Score:</strong> {fraudCase.riskScore}</p>
                    <p><strong>Status:</strong> {fraudCase.status}</p>
                    <p><strong>AI Recommendation:</strong> {fraudCase.aiRecommendation || "-"}</p>
                    <p><strong>Distributor Action:</strong> {fraudCase.distributorAction || "-"}</p>
                </div>

                <div className="mt-4 flex justify-end">
                    <Button onClick={onClose}>Close</Button>
                </div>
            </div>
        </div>
    );
};

export default SIMDetailsModal;
