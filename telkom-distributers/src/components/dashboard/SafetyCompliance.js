// src/components/dashboard/SafetyCompliance.js
import React from "react";

export default function SafetyCompliance() {
    return (
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Safety Rules & Regulations</h2>

            <div className="space-y-2">
                <h3 className="font-semibold text-gray-700">Key Regulations:</h3>
                <ol className="list-decimal list-inside text-gray-600 space-y-1">
                    <li>Data Protection Act: Comply with South Africa's POPIA when handling sensitive data.</li>
                    <li>Financial Sector Conduct Authority (FSCA) Regulations: Follow FSCA rules for banks and insurers.</li>
                    <li>Telecommunications Regulations: Follow ICASA rules for SIM card registration.</li>
                    <li>Cybersecurity Regulations: Implement strong security to prevent data breaches.</li>
                    <li>Consumer Protection Act: Ensure transparency and fairness with customers.</li>
                </ol>
            </div>

            <div className="space-y-2">
                <h3 className="font-semibold text-gray-700">Key Considerations:</h3>
                <ol className="list-decimal list-inside text-gray-600 space-y-1">
                    <li>Consent: Obtain explicit customer consent before collecting data.</li>
                    <li>Data Security: Use encryption and secure storage for customer data.</li>
                    <li>Transparency: Clearly communicate terms, services, and pricing.</li>
                    <li>Accountability: Set up processes for handling complaints and disputes.</li>
                </ol>
            </div>
        </div>
    );
}
