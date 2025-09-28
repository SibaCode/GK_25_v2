import React from "react";
import { CheckCircle } from "lucide-react";

export default function SuccessScreen() {
    return (
        <div className="max-w-lg text-center space-y-6 p-6">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
            <h2 className="text-3xl font-bold">Registration Successful</h2>
            <p className="text-blue-100">
                Your Telkom SIM Protection service is now active. We’ll monitor your number 24/7 and notify your banks,
                insurers, and apps if we detect unusual SIM activity.
            </p>
            <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl shadow hover:bg-blue-100 transition">
                Go to Dashboard
            </button>
        </div>
    );
}
