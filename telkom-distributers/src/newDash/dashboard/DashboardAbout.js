import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export default function DashboardAbout() {
    const navigate = useNavigate();

    return (
        <div className="p-4 min-h-screen bg-[#EFF6FF]">
            <h2 className="text-3xl font-bold text-[#1F2937] mb-4">About SIM Protection</h2>

            <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
                <p className="text-gray-700">
                    SIM Protection is a service that monitors your registered SIM cards, keeps track of suspicious activity, and alerts you in real time.
                </p>
                <p className="font-bold text-[#1D4ED8] text-lg">
                    Get all these services for only R15 per month!
                </p>
                <Button className="bg-[#3B82F6] text-white mt-2" onClick={() => navigate("/new/alerts")}>
                    View Alerts
                </Button>
            </div>
        </div>
    );
}
