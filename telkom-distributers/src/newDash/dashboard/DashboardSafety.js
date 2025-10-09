import React from "react";

export default function DashboardSafety() {
    return (
        <div className="p-4 min-h-screen bg-[#EFF6FF]">
            <h2 className="text-3xl font-bold text-[#1F2937] mb-4">Safety & Compliance</h2>

            <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold">Safety Rules and Regulations</h3>
                <ol className="list-decimal list-inside text-gray-700 space-y-1">
                    <li><strong>Data Protection Act:</strong> Ensure compliance with POPIA for sensitive data.</li>
                    <li><strong>FSCA Regulations:</strong> Adhere to financial regulations for banks and insurers.</li>
                    <li><strong>Telecommunications Regulations:</strong> Comply with ICASA rules for SIM registration.</li>
                    <li><strong>Cybersecurity Regulations:</strong> Implement robust security measures.</li>
                    <li><strong>Consumer Protection Act:</strong> Ensure transparency and fairness.</li>
                </ol>

                <h3 className="text-lg font-semibold mt-4">Key Considerations</h3>
                <ol className="list-decimal list-inside text-gray-700 space-y-1">
                    <li><strong>Consent:</strong> Obtain explicit consent from customers.</li>
                    <li><strong>Data Security:</strong> Encrypt and securely store customer data.</li>
                    <li><strong>Transparency:</strong> Communicate terms, pricing, and subscriptions clearly.</li>
                    <li><strong>Accountability:</strong> Handle complaints and disputes efficiently.</li>
                </ol>
            </div>
        </div>
    );
}
