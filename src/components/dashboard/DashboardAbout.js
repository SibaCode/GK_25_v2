// src/components/dashboard/DashboardAbout.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export default function DashboardAbout() {
    const navigate = useNavigate();

    return (
        <div className="space-y-6 p-4">
            <div className="bg-white shadow-md rounded-xl p-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-4"> SIM Alerts</h2>

           
                <ul className="list-disc list-inside text-gray-700 mb-4">
                    <li>Assist  you monitor your SIM cards and linked accounts.</li>
                    <li>Receive alerts for suspicious activity.</li>
                    <li>Protect your finances and personal information.</li>
                </ul>

                <p className="text-gray-800 font-bold text-lg mb-4">
                    All this for only <span className="text-green-600">R15 per month</span>!
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mb-2">Quick Safety Rules</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4">
                    <li>Comply with POPIA for personal data protection.</li>
                    <li>Follow FSCA regulations for banks and insurers.</li>
                    <li>Adhere to ICASA rules for telecommunications.</li>
                </ul>

                <Button
                    className="bg-blue-500 text-white mt-2"
                    onClick={() => navigate("/dashboard/alerts")}
                >
                    View Alerts
                </Button>
            </div>
        </div>
    );
}
